import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../components/AuthComps/CheckAuth';
import Nav from "../components/Nav/Nav.jsx";
import ChatArea from '../components/MessagingComps/ChatArea';
import ChatList from '../components/MessagingComps/ChatList';
import { supabase } from '../supabaseClient';

export default function Messages() {
  const navigate = useNavigate();
  const { id: paramChatId } = useParams();
  const { session } = useAuth();

  const [activeChatId, setActiveChatId] = useState(paramChatId || null);
  const [isMobile, setIsMobile] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  // Handle URL param chat change and reset unread_count on mount/param change
  useEffect(() => {
    if (paramChatId) {
      setActiveChatId(paramChatId);

      // Optimistic frontend update
      setConversations((prev) =>
        prev.map((c) => (String(c.id) === String(paramChatId) ? { ...c, unread: 0 } : c))
      );

      // Database update to set unread_count to 0
      supabase
        .from('conversations')
        .update({ unread_count: 0 })
        .eq('id', paramChatId)
        .then(({ error }) => {
          if (error) console.error("Error resetting unread_count:", error);
        });
    }
  }, [paramChatId]);

  // Handle clicking a conversation: optimistic update + database update to unread_count: 0
  const handleChatSelect = async (id) => {
    setActiveChatId(id);

    // 1. Optimistic frontend update
    setConversations((prev) =>
      prev.map((c) => (String(c.id) === String(id) ? { ...c, unread: 0 } : c))
    );

    navigate(`/messages/${id}`);

    // 2. Query update database
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ unread_count: 0 })
        .eq('id', id);

      if (error) console.error("Error updating unread_count:", error);
    } catch (err) {
      console.error("Error in handleChatSelect:", err);
    }
  };

  // 1. Mobile Responsive Check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 2. FETCH CONVERSATIONS LIST (runs on session load)
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          last_message,
          unread_count,
          is_deleted,
          is_open,
          updated_at,
          participant_1,
          participant_2,
          pickup_id,
          pickup:pickups (
            id,
            quantity,
            total_amount,
            status,
            buyer_id,
            seller_id,
            item:all_items (
              id,
              item_name,
              item_value,
              image_url
            ),
            buyer:users_info!pickups_buyer_id_fkey (
              user_id,
              full_name,
              display_name
            ),
            seller:users_info!pickups_seller_id_fkey (
              user_id,
              full_name,
              display_name
            )
          )
        `)
        .or(`participant_1.eq.${session.user.id},participant_2.eq.${session.user.id}`)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error);
        return;
      }

      if (data) {
        const formattedConversations = data.map(chat => {
          const isParticipant1 = chat.participant_1 === session.user.id;
          const otherUserId = isParticipant1 ? chat.participant_2 : chat.participant_1;

          const pickup = chat.pickup;
          let otherUserName = "User";
          if (pickup) {
            if (pickup.buyer_id === otherUserId && pickup.buyer) {
              otherUserName = pickup.buyer.display_name || pickup.buyer.full_name || "Buyer";
            } else if (pickup.seller_id === otherUserId && pickup.seller) {
              otherUserName = pickup.seller.display_name || pickup.seller.full_name || "Seller";
            }
          }

          const itemTitle = pickup?.item?.item_name || "Item Conversation";
          const itemPrice = pickup?.total_amount || pickup?.item?.item_value || 0;
          const itemImage = pickup?.item?.image_url?.[0] || null;
          const isOpened = paramChatId && String(chat.id) === String(paramChatId);

          return {
            id: chat.id,
            pickup_id: chat.pickup_id,
            item_title: itemTitle,
            item_price: itemPrice,
            item_image: itemImage,
            lastMessage: chat.last_message,
            unread: isOpened ? 0 : (chat.unread_count || 0),
            is_deleted: chat.is_deleted,
            is_open: chat.is_open,
            participant_1: chat.participant_1,
            participant_2: chat.participant_2,
            other_user_id: otherUserId,
            other_user_name: otherUserName,
            time: chat.updated_at
              ? new Date(chat.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : "",
          };
        });

        setConversations(formattedConversations);
      }
    };

    fetchConversations();
  }, [session?.user?.id]);

  // 3. FETCH MESSAGES & SUBSCRIBE TO REAL-TIME UPDATES FOR ACTIVE CHAT
  useEffect(() => {
    if (!activeChatId || !session?.user?.id) return;

    // A. Fetch existing messages for this specific chat
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', activeChatId)
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
        filter: `conversation_id=eq.${activeChatId}`
      },
        (payload) => {
          if (payload.new.sender_id !== session.user.id) {
            setMessages((prev) => [...prev, payload.new]);

            // Reset unread_count in DB because this chat is currently open
            supabase
              .from('conversations')
              .update({ unread_count: 0 })
              .eq('id', activeChatId)
              .then(({ error }) => {
                if (error) console.error("Error setting unread_count to 0:", error);
              });
          }
        })
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [activeChatId, session?.user?.id]);

  const activeConversation = conversations.find(c => String(c.id) === String(activeChatId));

  // 4. SENDING A MESSAGE
  const handleSendMessage = async (text) => {
    if (!activeChatId || !session?.user?.id) return;

    const recipientId = activeConversation?.other_user_id || activeConversation?.participant_2;
    const tempMessageId = crypto.randomUUID();

    // A. Optimistic UI Update
    const optimisticMessage = {
      id: tempMessageId,
      conversation_id: activeChatId,
      text: text,
      sender_id: session.user.id,
      receiver_id: recipientId,
      created_at: new Date().toISOString(),
      status: 'sending'
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    // Update conversation list locally
    setConversations((prev) => prev.map(c =>
      String(c.id) === String(activeChatId)
        ? { ...c, lastMessage: text, time: "Just now", unread: 0 }
        : c
    ));

    // B. Push message to Supabase
    const { error } = await supabase
      .from('messages')
      .insert([{
        conversation_id: activeChatId,
        text: text,
        sender_id: session.user.id,
        receiver_id: recipientId
      }])
      .select("id")
      .single();

    if (!error) {
      await supabase
        .from('conversations')
        .update({
          last_message: text,
          updated_at: new Date().toISOString()
        })
        .eq('id', activeChatId);
    }

    if (recipientId) {
      await supabase
        .from('notifications')
        .insert({
          user_id: recipientId,
          type: 'message',
          title: "New Inbox Message",
          message: `You received a new message on "${activeConversation?.item_title || 'your item'}"`,
          reference_id: activeChatId,
          created_at: new Date().toISOString(),
        });
    }

    if (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) =>
        prev.map(msg =>
          msg.id === tempMessageId
            ? { ...msg, status: 'failed' }
            : msg
        )
      );
    } else {
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
    <div className="h-screen sm:min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Show Nav on desktop always, and on mobile only when no chat is open */}
      <div className={activeChatId ? "hidden sm:block" : "block"}>
        <Nav />
      </div>

      <main className={`flex flex-col flex-1 h-[100dvh] sm:h-[calc(100vh-5rem)] p-0 md:p-8 sm:mt-16 ${activeChatId ? 'pt-0' : 'pt-24 sm:pt-0'}`}>
        <h1 className="text-3xl font-bold mb-4 hidden md:block px-4">
          Inbox
        </h1>

        <div className="flex flex-1 bg-white md:rounded-xl shadow-md overflow-hidden border-0 sm:border sm:border-gray-200 h-full pb-0">

          {/* LEFT PANE (ChatList) */}
          <aside
            className={`border-r border-gray-200 h-full transition-all duration-300 ease-in-out
                    ${activeChatId ? 'hidden sm:block sm:w-1/3 md:w-1/4' : 'w-full sm:w-1/3 md:w-1/4'}`}
          >
            <ChatList
              conversations={conversations}
              activeChatId={activeChatId}
              onChatSelect={handleChatSelect}
              isCollapsed={false}
            />
          </aside>

          {/* RIGHT PANE (ChatArea) */}
          <section
            className={`h-full flex-1 transition-all duration-300 flex flex-col
                    ${activeChatId ? 'w-full flex' : 'hidden sm:flex'}`}
          >
            {activeConversation ? (
              <ChatArea
                activeConversation={activeConversation}
                messages={messages}
                onSendMessage={handleSendMessage}
                onBack={() => {
                  setActiveChatId(null);
                  navigate('/messages');
                }}
                currentUser={session?.user}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500">
                <p className="text-xl font-medium">
                  {conversations.length === 0 ? "Loading conversation..." : "Select a conversation"}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}