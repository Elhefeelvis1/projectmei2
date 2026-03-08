import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { supabase } from "../../supabaseClient";
import { User, Settings, LogOut, LogIn, HelpCircle, Heart} from "lucide-react";
import { Link } from "react-router-dom";

export default function NavMenu({ isOpen, onClose }) {
  if (!isOpen) return null;
  const navigate = useNavigate();
  const {loggedIn, setLoggedIn} = useState(false);

  useEffect(() => {
        const checkUser = async () => {
          const { data: { user }, error } = await supabase.auth.getUser();
          
          if (user) {
            setLoggedIn(true);
          }
        };
      
        checkUser();
      }, [navigate]);

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      <div 
        className="fixed inset-0 z-[110]" 
        onClick={onClose}
      />
      
      {/* Menu Box */}
      <div className="absolute right-0 top-14 z-[120] w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 animate-in fade-in zoom-in duration-200">

        <nav className="flex flex-col">

          <div className="px-4 py-2">
            <p className="text-sm font-medium text-gray-500 uppercase">Wallet: <span className="text-gray-900">₦125.75</span></p>
          </div>

          <Link to="/userDetails" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
            <User size={18} />
            <span className="text-sm font-medium">My Profile</span>
          </Link>

          <Link to="/Pickups" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
            <User size={18} />
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

          <Link to="/support" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
            <HelpCircle size={18} />
            <span className="text-sm font-medium">Support</span>
          </Link>

          <Link to={loggedIn ? "/logout" : "/login"} className={"w-full flex items-center border-t border-gray-50 gap-3 px-4 py-3 transition-colors " + (loggedIn ? "hover:bg-red-50 text-red-600" : "hover:bg-green-50 text-green-600")}>
              {loggedIn ? <LogOut size={18} /> : <LogIn size={18} />}
              <span className="text-sm font-medium">{loggedIn ? "Sign Out" : "Sign In"}</span>
          </Link>
        </nav>
      </div>
    </>
  );
}