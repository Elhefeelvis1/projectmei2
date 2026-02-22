import { User, Settings, LogOut, HelpCircle, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function NavMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      <div 
        className="fixed inset-0 z-[110]" 
        onClick={onClose}
      />
      
      {/* Menu Box */}
      <div className="absolute right-0 top-14 z-[120] w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 animate-in fade-in zoom-in duration-200">
        <div className="px-4 py-2 border-b border-gray-50 mb-2">
          <p className="text-sm font-semibold text-gray-900">Options</p>
        </div>
        
        <nav className="flex flex-col">
          <Link to="/userDetails" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
            <User size={18} />
            <span className="text-sm font-medium">My Profile</span>
          </Link>
          
          <Link to="/favorites" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
            <Heart size={18} />
            <span className="text-sm font-medium">Favorites</span>
          </Link>
          
          <Link to="/settings" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </Link>

          <Link to="/support" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
            <HelpCircle size={18} />
            <span className="text-sm font-medium">Support</span>
          </Link>

          <div className="border-t border-gray-50 mt-2 pt-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors">
              <LogOut size={18} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}