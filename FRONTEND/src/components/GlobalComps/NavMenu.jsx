import { supabase } from "../../supabaseClient";
import { User, Settings, LogOut, LogIn, HelpCircle, Heart, Package, ListTodo} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthComps/CheckAuth.jsx";

export default function NavMenu({ isOpen, onClose }) {
  const { session } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onClose();
    navigate('/login');
  };

  return (
    <>
      <div className="fixed inset-0 z-[110]" onClick={onClose} />
      
      <div className="absolute right-0 top-14 z-[120] w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 animate-in fade-in zoom-in duration-200">
        <nav className="flex flex-col">
          {session && (
            <>
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-gray-500 uppercase">Wallet: <span className="text-gray-900">₦125.75</span></p>
              </div>

              <Link to="/userDetails" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
                <User size={18} />
                <span className="text-sm font-medium">My Profile</span>
              </Link>

              <Link to="/my-items" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
                <ListTodo size={18} />
                <span className="text-sm font-medium">My Items</span>
              </Link>

              <Link to="/Pickups" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
                <Package size={18} />
                <span className="text-sm font-medium">View Pickups</span>
              </Link>
              
              <Link to="/favorites" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
                <Heart size={18} />
                <span className="text-sm font-medium">Favorites</span>
              </Link>
              
              <Link to="/settings" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
                <Settings size={18} />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </>
          )}

          <Link to="/support" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
            <HelpCircle size={18} />
            <span className="text-sm font-medium">Support</span>
          </Link>

          {session ? (
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center border-t border-gray-50 gap-3 px-4 py-3 transition-colors hover:bg-red-50 text-red-600"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          ) : (
            <Link 
              to="/login" 
              onClick={onClose}
              className="w-full flex items-center border-t border-gray-50 gap-3 px-4 py-3 transition-colors hover:bg-green-50 text-green-600"
            >
              <LogIn size={18} />
              <span className="text-sm font-medium">Sign In</span>
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}