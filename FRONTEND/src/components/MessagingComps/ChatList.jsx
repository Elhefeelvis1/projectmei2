import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function ChatList({ conversations, activeChatId, onChatSelect, isCollapsed }) {
    const [searchTerm, setSearchTerm] = useState("");

    // Filters by item title OR the other person's name
    const filteredConversations = conversations.filter(chat => {
        const targetName = chat.other_user_name || chat.name || "";
        const targetItem = chat.item_title || "";
        const search = searchTerm.toLowerCase();
        
        return targetName.toLowerCase().includes(search) || targetItem.toLowerCase().includes(search);
    });

    const getInitials = (name) => {
        if (!name) return "?";
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }; 

    return (
      <div className="h-full flex flex-col bg-white">
        
        {!isCollapsed && (
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search chats..."
                        className="w-full pl-3 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>
        )}
        
        <ul className="flex-1 overflow-y-auto list-none p-0 m-0 hide-scrollbar">
          {filteredConversations.map((chat) => (
            <li key={chat.id} className="border-b border-gray-50 last:border-b-0">
                <button 
                    onClick={() => onChatSelect(chat.id)}
                    title={isCollapsed ? (chat.item_title || chat.name) : ""}
                    className={`w-full flex items-center py-4 transition-colors relative
                        ${isCollapsed ? 'justify-center px-2' : 'justify-start px-4'}
                        ${chat.id === activeChatId 
                            ? 'bg-blue-50 border-l-4 border-blue-600' 
                            : 'hover:bg-gray-50 border-l-4 border-transparent'
                        }`}
                >
                    {/* Avatar with unread badge */}
                    <div className={`relative flex-shrink-0 ${isCollapsed ? 'm-0' : 'mr-3'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
                            ${chat.id === activeChatId ? 'bg-blue-600' : 'bg-slate-700'}`}>
                            {getInitials(chat.other_user_name || chat.name)}
                        </div>
                        
                        {chat.unread > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full border-2 border-white">
                                {chat.unread}
                            </span>
                        )}
                    </div>
                    
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0 text-left">
                            <div className="flex justify-between items-baseline mb-0.5">
                                {/* Item Title is Primary */}
                                <p className={`text-sm truncate ${chat.unread > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'}`}>
                                    {chat.item_title || chat.name}
                                </p>
                                <span className="text-[10px] font-medium text-gray-400 ml-2 whitespace-nowrap">
                                    {chat.time}
                                </span>
                            </div>
                            {/* User Name is Secondary */}
                            <p className="text-xs text-gray-500 truncate mb-1">
                                {chat.other_user_name}
                            </p>
                            <p className={`text-xs truncate ${chat.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
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