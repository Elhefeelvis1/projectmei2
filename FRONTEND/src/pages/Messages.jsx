import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthComps/CheckAuth'; // Your auth hook
import Nav from "../components/GlobalComps/Nav.jsx";
import ChatArea from '../components/MessagingComps/ChatArea';
import ChatList from '../components/MessagingComps/ChatList';
import { supabase } from '../supabaseClient';

export default function Messages() {
    const navigate = useNavigate();
    const { session } = useAuth(); // Grabbing session from context
    
    const [activeChatId, setActiveChatId] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);

    // 1. Mobile Responsive Check
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 2. FETCH CONVERSATIONS LIST
    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchConversations = async () => {
            // Query the new conversations table
            const { data, error } = await supabase
                .from('conversations')
                .select(`
                    id,
                    item_title,
                    last_message,
                    unread_count,
                    is_deleted,
                    updated_at,
                    participant_1,
                    participant_2
                `)
                // Get chats where the current user is either participant 1 or 2
                .or(`participant_1.eq.${session.user.id},participant_2.eq.${session.user.id}`)
                .order('updated_at', { ascending: false });

            if (error) {
                console.error("Error fetching conversations:", error);
                return;
            }

            // Format the data so your ChatList component can read it easily
            if (data) {
                const formattedConversations = data.map(chat => {
                    // Figure out who the "other" person is
                    const isParticipant1 = chat.participant_1 === session.user.id;
                    const otherUserId = isParticipant1 ? chat.participant_2 : chat.participant_1;
                    
                    return {
                        id: chat.id,
                        item_title: chat.item_title,
                        lastMessage: chat.last_message,
                        unread: chat.unread_count,
                        is_deleted: chat.is_deleted,
                        other_user_id: otherUserId, // You might need to join/fetch the actual name later
                        time: new Date(chat.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    };
                });
                
                setConversations(formattedConversations);
            }
        };

        fetchConversations();
    }, [session]);

    // 2. FETCH MESSAGES & SUBSCRIBE TO REAL-TIME UPDATES
    useEffect(() => {
      // Don't run if no chat is selected or user isn't fully loaded
      if (!activeChatId || !session?.user?.id) return;

      // A. Fetch existing messages for this specific chat
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', activeChatId)
          .order('created_at', { ascending: true }); 
        
        if (!error && data) setMessages(data);
      };

      fetchMessages();

      // B. Set up Real-Time WebSocket Listener
      const messageSubscription = supabase
        .channel(`chat_${activeChatId}`)
        .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages', 
            filter: `chat_id=eq.${activeChatId}` 
          }, 
          (payload) => {
            // Prevent duplicate UI updates if we sent it ourselves
            if (payload.new.sender_id !== session.user.id) {
                setMessages((prev) => [...prev, payload.new]);
            }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(messageSubscription);
      };
    }, [activeChatId, session]); // Re-run if they click a new chat

    const activeConversation = conversations.find(c => c.id === activeChatId);

    // 3. SENDING A MESSAGE
    const handleSendMessage = async (text) => {
        if (!activeChatId || !session?.user?.id) return;

        // Create a unique temporary ID so we can find this exact message later if it fails
        const tempMessageId = crypto.randomUUID();

        // A. Optimistic UI Update (Notice the added status: 'sending')
        const optimisticMessage = {
          id: tempMessageId, 
          chat_id: activeChatId,
          text: text,
          sender_id: session.user.id,
          receiver_id: activeConversation.participant_id, 
          created_at: new Date().toISOString(),
          status: 'sending' // <-- NEW TRACKING PROPERTY
        };
        
        setMessages((prev) => [...prev, optimisticMessage]);

        // Update the conversation list's "last message" snippet locally
        setConversations((prev) => prev.map(c => 
            c.id === activeChatId 
            ? { ...c, lastMessage: text, time: "Just now", unread: 0 } 
            : c
        ));

        // B. Push to Supabase
        const { error } = await supabase
          .from('messages')
          .insert([{
              // Do NOT pass the tempMessageId here. Let Supabase generate its own real UUID
              chat_id: activeChatId,
              text: text,
              sender_id: session.user.id,
              receiver_id: activeConversation.participant_id
          }]);

        if (error) {
            console.error("Failed to send message:", error);
            
            // C. Flip the status to 'failed' in our local React state
            setMessages((prev) => 
                prev.map(msg => 
                    msg.id === tempMessageId 
                        ? { ...msg, status: 'failed' } 
                        : msg
                )
            );
        } else {
            // Optional: If successful, clear the 'sending' status so it's fully confirmed
            setMessages((prev) => 
                prev.map(msg => 
                    msg.id === tempMessageId 
                        ? { ...msg, status: 'sent' } 
                        : msg
                )
            );
        }
    };

    return (
      <div className="min-h-screen bg-gray-50 pt-15 md:pt-18">
        <Nav />
        
        <main className="flex flex-col h-[91vh] p-0 md:p-8 pt-2 md:pt-4 md:mt-0 mt-4">
          <h1 className="text-3xl font-bold mb-4 hidden md:block px-4">
            Inbox
          </h1>
          
          <div className="flex flex-1 bg-white md:rounded-xl shadow-md overflow-hidden border border-gray-200">
            
            {/* LEFT PANE */}
            <aside 
                className={`border-r border-gray-200 h-full transition-all duration-300 ease-in-out
                    ${activeChatId ? 'w-[20%] sm:w-1/3 md:w-1/4' : 'w-full sm:w-1/3 md:w-1/4'}`}
            >
              <ChatList 
                conversations={conversations}
                activeChatId={activeChatId} 
                onChatSelect={setActiveChatId}
                isCollapsed={isMobile && !!activeChatId}
              />
            </aside>
    
            {/* RIGHT PANE */}
            <section 
                className={`h-full flex-1 transition-all duration-300
                    ${activeChatId ? 'block' : 'hidden sm:block'}`}
            >
              {activeConversation ? (
                <ChatArea 
                    activeConversation={activeConversation} 
                    messages={messages} 
                    onSendMessage={handleSendMessage}
                    onBack={() => setActiveChatId(null)}
                    currentUser={session?.user}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500">
                  <p className="text-xl font-medium">Select a conversation</p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    );
}