import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function ChatList({ conversations, activeChatId, onChatSelect, isCollapsed }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredConversations = conversations.filter(chat => 
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name) => {
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    };

    return (
      <div className="h-full flex flex-col bg-white">
        
        {/* Search Bar - Hidden if collapsed */}
        {!isCollapsed && (
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>
        )}
        
        <ul className="flex-1 overflow-y-auto list-none p-0 m-0">
          {filteredConversations.map((chat) => (
            <li key={chat.id} className="border-b border-gray-100 last:border-b-0">
                <button 
                    onClick={() => onChatSelect(chat.id)}
                    title={isCollapsed ? chat.name : ""}
                    className={`w-full flex items-center py-4 transition-colors relative
                        ${isCollapsed ? 'justify-center px-2' : 'justify-start px-4'}
                        ${chat.id === activeChatId 
                            ? 'bg-blue-50 border-l-4 border-blue-600' 
                            : 'hover:bg-gray-50 border-l-4 border-transparent'
                        }`}
                >
                    {/* Avatar with unread badge */}
                    <div className={`relative flex-shrink-0 ${isCollapsed ? 'm-0' : 'mr-3'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium
                            ${chat.id === activeChatId ? 'bg-blue-600' : 'bg-gray-400'}`}>
                            {getInitials(chat.name)}
                        </div>
                        
                        {chat.unread > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </div>
                    
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0 text-left">
                            <div className="flex justify-between items-baseline">
                                <p className={`text-sm truncate ${chat.unread > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>
                                    {chat.name}
                                </p>
                                <span className="text-[11px] text-gray-500 ml-2">
                                    {chat.time}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                                {chat.lastMessage}
                            </p>
                        </div>
                    )}
                </button>
            </li>
          ))}
        </ul>
      </div>
    );
}