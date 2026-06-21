import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthComps/CheckAuth.jsx";
import { User, ListTodo, Gavel, Package, Heart, Settings, HelpCircle, LogOut, LogIn } from "lucide-react";
import WithdrawalModal from "./WithdrawalModal"; // Adjust path if needed

export default function NavMenu({ isOpen, onClose }) {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [walletValue, setWalletValue] = useState(null);
  const [openWithdrawal, setOpenWithdrawal] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      if (session?.user) {
        const { data, error } = await supabase
          .from('users_info')
          .select('wallet_value')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
          return;
        }
        setWalletValue(data.wallet_value);
      }
    };
    fetchWallet();
  }, [session]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onClose();
    navigate('/login');
  };

  return (
    <>
      <WithdrawalModal
        isOpen={openWithdrawal}
        onClose={() => setOpenWithdrawal(false)}
        walletValue={walletValue}
      />

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[110]" onClick={onClose} />

          <div className="fixed right-4 top-20 z-[120] w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 animate-in fade-in zoom-in duration-200">
            <nav className="flex flex-col">
              {session && (
                <>
                  <div className="px-4 py-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500 uppercase">
                      Wallet: <span className="text-gray-900">₦{walletValue !== null ? walletValue.toLocaleString() : "..."}</span>
                    </p>
                    <button
                      disabled={walletValue < 1000} // Flipped the logic: disabled if LESS than 1000
                      className={`${walletValue < 1000 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white font-semibold px-3 py-1 rounded-full text-sm transition-colors cursor-pointer`}
                      onClick={() => {
                        onClose(); // Hides the menu (isOpen becomes false)
                        setOpenWithdrawal(true); // Shows the modal (openWithdrawal becomes true)
                      }}
                    >
                      Withdraw
                    </button>
                  </div>

                  <Link to="/userDetails" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
                    <User size={18} />
                    <span className="text-sm font-medium">My Profile</span>
                  </Link>

                  <Link to="/my-items" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
                    <ListTodo size={18} />
                    <span className="text-sm font-medium">My Items</span>
                  </Link>

                  <Link to="/my-bids" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
                    <Gavel size={18} />
                    <span className="text-sm font-medium">My Bids</span>
                  </Link>

                  <Link to="/pickups" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
                    <Package size={18} />
                    <span className="text-sm font-medium">View Pickups</span>
                  </Link>

                  <Link to="/favorites" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
                    <Heart size={18} />
                    <span className="text-sm font-medium">Favorites</span>
                  </Link>

                  {/* <Link to="/settings" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors">
                    <Settings size={18} />
                    <span className="text-sm font-medium">Settings</span>
                  </Link> */}
                </>
              )}

              <button
                onClick={() => {
                  onClose();
                  if (location.pathname === "/") {
                    document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    navigate("/", { state: { scrollTo: "contact-us" } });
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors text-left cursor-pointer border-none bg-transparent"
              >
                <HelpCircle size={18} />
                <span className="text-sm font-medium">Contact Us</span>
              </button>


              {session ? (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center border-t border-gray-50 gap-3 px-4 py-3 transition-colors hover:bg-red-50 text-red-600 cursor-pointer"
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
      )}
    </>
  );
}