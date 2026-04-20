import React, { useState, useEffect, useRef } from 'react';
import { SendHorizontal, ArrowLeft, Package, AlertCircle } from 'lucide-react';

export default function ChatArea({ activeConversation, messages, onSendMessage, onBack, currentUser }) {
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Auto-scroll to the bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSend = () => {
      if (inputMessage.trim() !== '') {
        onSendMessage(inputMessage);
        setInputMessage('');
      }
    };

    // Helper to format ISO timestamps from Supabase
    const formatTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    return (
      <div className="flex flex-col h-full bg-white">
        
        {/* Chat Header */}
        <header className="p-4 border-b border-gray-200 flex flex-col bg-gray-50">
            <div className="flex items-center">
               {/* Back Button - Visible only on Mobile */}
               <button 
                 onClick={onBack} 
                 className="mr-2 p-2 hover:bg-gray-200 rounded-full sm:hidden transition-colors"
                 aria-label="Go back"
               >
                 <ArrowLeft size={24} className="text-gray-700" />
               </button>

               <h3 className="text-lg font-bold text-gray-800 truncate">
                 {activeConversation.other_user_name || activeConversation.name}
               </h3>
            </div>
            
            {/* Context Banner: Shows what item this chat is about */}
            {activeConversation.item_title && (
                <div className="mt-2 flex items-center gap-2 text-sm text-blue-700 bg-blue-50 p-2 rounded-lg border border-blue-100">
                    <Package size={16} />
                    <span className="font-semibold truncate">
                        {activeConversation.item_title}
                    </span>
                    <span className="ml-auto font-bold">
                        ₦{activeConversation.item_price?.toLocaleString()}
                    </span>
                </div>
            )}
        </header>
  
        {/* Message Display Area */}
        <main className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.sender_id === currentUser?.id;
            // Check if the user has been deleted (sender_id is null due to ON DELETE SET NULL)
            const isDeletedUser = msg.sender_id === null;
            // Check if the message failed to send
            const isFailed = msg.status === 'failed'; 

            return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                
                {/* 1. DELETED USER TAG */}
                {isDeletedUser && !isMe && (
                    <span className="text-[10px] text-gray-400 mb-1 ml-1 font-medium uppercase tracking-wider">
                        Deleted User
                    </span>
                )}

                <div 
                  className={`p-3 max-w-[85%] rounded-2xl shadow-sm relative
                    ${isMe 
                      ? (isFailed ? 'bg-red-500 text-white' : 'bg-blue-600 text-white') 
                      : 'bg-white border border-gray-200' // Base styling for received messages
                    }
                    ${isMe ? 'rounded-tr-none' : 'rounded-tl-none'}
                    ${msg.status === 'sending' ? 'opacity-70' : 'opacity-100'}
                  `}
                >
                  {/* 2. CONDITIONAL TEXT STYLING */}
                  <p className={`text-sm leading-relaxed 
                    ${isMe ? 'text-white' : 'text-gray-900'}
                    ${isDeletedUser ? 'italic text-gray-500' : ''}
                  `}>
                    {msg.text}
                  </p>
                  
                  <span className={`text-[10px] flex justify-end items-center gap-1 mt-1 
                      ${isMe ? 'text-blue-200' : 'text-gray-400'}
                      ${isFailed ? 'text-red-200' : ''}
                  `}>
                    {formatTime(msg.created_at || msg.time)}
                  </span>
                </div>

                {/* 3. FAILED MESSAGE WARNING */}
                {isFailed && (
                    <div className="flex items-center gap-1 text-red-500 mt-1 mr-1 text-xs font-semibold">
                        <AlertCircle size={12} />
                        <span>Not sent</span>
                    </div>
                )}

              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </main>
  
        {/* Message Input Footer */}
        <footer className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="flex-1 p-3 px-4 border border-gray-300 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 hover:bg-white"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                  e.preventDefault(); 
                }
              }}
            />
            <button 
              onClick={handleSend} 
              disabled={!inputMessage.trim()}
              className={`p-3 rounded-full transition-colors 
                ${inputMessage.trim() 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              <SendHorizontal size={20} />
            </button>
          </div>
        </footer>
      </div>
    );
}