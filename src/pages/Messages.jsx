import { useState, useEffect } from 'react';
import Nav from "../components/GlobalComps/Nav.jsx";
import ChatArea from '../components/MessagingComps/ChatArea';
import ChatList from '../components/MessagingComps/ChatList';

export default function Messages() {
    const [activeChatId, setActiveChatId] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    // Replaces MUI useMediaQuery to keep the project dependency-free
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640); // 'sm' breakpoint
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const [conversations, setConversations] = useState([
      { id: 1, name: "Dr. Smith", lastMessage: "See you next week.", time: "10:30 AM", unread: 2 },
      { id: 2, name: "Sarah Connor", lastMessage: "Did you get the file?", time: "Yesterday", unread: 0 },
      { id: 3, name: "System Admin", lastMessage: "Your password expires soon.", time: "Oct 15", unread: 1 },
    ]);
  
    const [messages, setMessages] = useState([
      { id: 101, chatId: 1, text: "Hello, I have a question about my project.", sender: "user", time: "11:00 AM" },
      { id: 102, chatId: 1, text: "Sure, how can I help?", sender: "Dr. Smith", time: "11:05 AM" },
      { id: 103, chatId: 1, text: "When is the deadline for the final report?", sender: "user", time: "11:10 AM" },
      { id: 201, chatId: 2, text: "Hey, did you get the files I sent?", sender: "Sarah Connor", time: "Yesterday" },
      { id: 301, chatId: 3, text: "Security Alert: Please update your password.", sender: "System Admin", time: "Oct 15" },
    ]);

    const activeConversation = conversations.find(c => c.id === activeChatId);
    const activeMessages = messages.filter(m => m.chatId === activeChatId);

    const handleSendMessage = (text) => {
        if (!activeChatId) return;
        const newMessage = {
            id: Date.now(),
            chatId: activeChatId,
            text: text,
            sender: "user",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, newMessage]);
        setConversations((prev) => prev.map(c => 
            c.id === activeChatId 
            ? { ...c, lastMessage: text, time: "Just now", unread: 0 } 
            : c
        ));
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        
        <main className="flex flex-col h-[90vh] p-0 md:p-8 pt-2 md:pt-4 md:mt-0 mt-4">
          <h1 className="text-3xl font-bold mb-4 hidden md:block px-4">
            Inbox
          </h1>
          
          <div className="flex flex-1 bg-white md:rounded-xl shadow-md overflow-hidden border border-gray-200">
            
            {/* LEFT PANE (Chat List) */}
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
    
            {/* RIGHT PANE (Chat Area) */}
            <section 
                className={`h-full flex-1 transition-all duration-300
                    ${activeChatId ? 'block' : 'hidden sm:block'}`}
            >
              {activeConversation ? (
                <ChatArea 
                    activeConversation={activeConversation} 
                    messages={activeMessages} 
                    onSendMessage={handleSendMessage}
                    onBack={() => setActiveChatId(null)}
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