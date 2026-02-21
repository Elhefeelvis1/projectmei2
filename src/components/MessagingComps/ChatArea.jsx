import React, { useState, useEffect, useRef } from 'react';
import { SendHorizontal, ArrowLeft } from 'lucide-react';

export default function ChatArea({ activeConversation, messages, onSendMessage, onBack }) {
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
    
    return (
      <div className="flex flex-col h-full bg-white">
        
        {/* Chat Header */}
        <header className="p-4 border-b border-gray-200 flex items-center bg-gray-50">
           {/* Back Button - Visible only on Mobile */}
           <button 
             onClick={onBack} 
             className="mr-2 p-2 hover:bg-gray-200 rounded-full sm:hidden transition-colors"
             aria-label="Go back"
           >
             <ArrowLeft size={24} className="text-gray-700" />
           </button>

           <h3 className="text-lg font-bold text-gray-800 truncate">
             {activeConversation.name}
           </h3>
        </header>
  
        {/* Message Display Area */}
        <main className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`p-3 max-w-[85%] rounded-2xl shadow-sm relative
                  ${msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-900 border border-gray-200 rounded-tl-none'
                  }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <span className={`text-[10px] block text-right mt-1 opacity-70`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </main>
  
        {/* Message Input Footer */}
        <footer className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="flex-1 p-2 px-4 border border-gray-300 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
              className={`p-2 rounded-full transition-colors 
                ${inputMessage.trim() 
                  ? 'text-blue-600 hover:bg-blue-50' 
                  : 'text-gray-300 cursor-not-allowed'
                }`}
            >
              <SendHorizontal size={24} />
            </button>
          </div>
        </footer>
      </div>
    );
}