import React, { useEffect, useState } from 'react';
import Nav from "../components/GlobalComps/Nav.jsx";
import Popup from '../components/GlobalComps/Popup.jsx';
import { useAuth } from '../components/AuthComps/CheckAuth.jsx';
import Tabs from '../components/GlobalComps/Tabs.jsx';
import { supabase } from '../supabaseClient.js';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Ban, 
  MapPin, 
  Lock, 
  X,
  Loader2
} from 'lucide-react';

// Tabs for the UI
const tabs = [
  { id: 'pending', label: 'Pending Pickups', icon: Clock },
  { id: 'accepted', label: 'Completed', icon: CheckCircle },
  { id: 'rejected', label: 'Rejected / Cancelled', icon: Ban },
];

export default function MyPickupsPage() {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal & Action State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState(''); // 'accepted' or 'rejected'
  const [verificationPassword, setVerificationPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });
  
  // 1. Fetch Pickups Data
  const fetchPickups = async () => {
    if (!session?.user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('pickups')
      .select('*, item:all_items(item_name, image_url)')
      .eq('buyer_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching pickups:", error);
    } else {
      setOrders(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPickups();
  }, [session]);

  // Derived state for the UI
  const filteredOrders = orders.filter(order => order.status === activeTab);

  // Trigger the Modal
  const openConfirmModal = (order, type) => {
    setSelectedOrder(order);
    setActionType(type); // Tells the modal whether we are accepting or rejecting
    setIsModalOpen(true);
  };

// The pickup processing function
  const handleProcessAction = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
          // Step A: Verify Password
          const { error: authError } = await supabase.auth.signInWithPassword({
              email: session.user.email,
              password: verificationPassword,
          });

          if (authError) {
              setPopup({ show: true, type: "error", message: "Incorrect password. Action failed." });
              setIsSubmitting(false);
              return;
          }

          /* ======================================================================
          REFERENCE: NORMAL JS FLOW (NOW HANDLED BY RPC FOR ATOMICITY)
          ======================================================================
          const amount = selectedOrder.total_amount;
          
          // 1. Update Pickup Status
          await supabase.from('pickups').update({ status: actionType }).eq('id', selectedOrder.id);
          
          if (actionType === 'accepted') {
              // 2. Record item transaction
              await supabase.from('transactions_items').insert([{...}]);
              
              // 3. Update Seller Wallet (Amount - 5%)
              const sellerEarnings = amount * 0.95;
              await supabase.from('users_info')
                .update({ wallet_value: previousValue + sellerEarnings })
                .eq('id', selectedOrder.seller_id);
                
              // 4. Record Seller Wallet Transaction
              await supabase.from('transactions-wallet')
                .insert([{ user_id: seller_id, transaction_type: 'sale', transaction_value: sellerEarnings }]);
                
          } else if (actionType === 'rejected') {
              // 3. Update Buyer Wallet (Full Refund)
              await supabase.from('users_info')
                .update({ wallet_value: previousValue + amount })
                .eq('id', selectedOrder.buyer_id);
                
              // 4. Record Buyer Wallet Transaction
              await supabase.from('transactions-wallet')
                .insert([{ user_id: buyer_id, transaction_type: 'refund', transaction_value: amount }]);
          }
          ======================================================================
          */

          // Step B: Execute the Atomic RPC Transaction
          const { error: rpcError } = await supabase.rpc('process_pickup_resolution', {
              p_pickup_id: selectedOrder.id,
              p_action_type: actionType,
              p_item_id: selectedOrder.item_id,
              p_seller_id: selectedOrder.seller_id,
              p_buyer_id: selectedOrder.buyer_id,
              p_quantity: selectedOrder.quantity,
              p_amount: selectedOrder.total_amount 
          });

          if (rpcError) throw rpcError;

          // Success Cleanup
          setPopup({ 
              show: true, 
              type: "success", 
              message: actionType === 'accepted' ? "Pickup confirmed successfully!" : "Pickup rejected and cancelled." 
          });
          
          // Remove the item from the current local state to update UI instantly
          setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: actionType } : o));

      } catch (error) {
          console.error("Error processing pickup:", error);
          setPopup({ show: true, type: "error", message: "An error occurred. Please try again." });
      } finally {
          setIsSubmitting(false);
          setIsModalOpen(false);
          setVerificationPassword('');
          setSelectedOrder(null);
      }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans relative">
        <Nav />
        {popup.show && (
            <Popup feedback={popup.type} content={popup.message} onClose={() => setPopup({ show: false, type: "", message: "" })} />
        )}
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 pt-25 pb-4 px-4 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="text-green-600" size={32} />
            My Pickups
          </h1>
          <p className="text-gray-500 mt-2">Manage your purchases and confirm item receipts.</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        
        <Tabs tabArray={tabs} setActive={setActiveTab} activeTab={activeTab} />

        {/* Loading State */}
        {isLoading ? (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
        ) : (
            <div className="space-y-4">
            {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center transition-hover hover:border-green-300">
                    
                    {/* Image */}
                    <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {order.item?.image_url?.[0] ? (
                        <img src={order.item.image_url[0]} alt={order.item.item_name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xs text-gray-400">No Image</span>
                    )}
                    </div>

                    {/* Order Details */}
                    <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-900">{order.item?.item_name || "Unknown Item"}</h3>
                        <span className="font-black text-lg text-gray-900">₦{order.total_amount?.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Quantity: {order.quantity}</p>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><Clock size={16} className="text-gray-400"/> {new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    </div>

                    {/* Actions */}
                    <div className="w-full sm:w-auto flex flex-col gap-2 flex-shrink-0">
                    {order.status === 'pending' ? (
                        <>
                        <button 
                        onClick={() => openConfirmModal(order, 'accepted')}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                        <CheckCircle size={18} /> Accept
                        </button>
                        <button 
                        onClick={() => openConfirmModal(order, 'rejected')}
                        className="w-full sm:w-auto bg-red-50 hover:bg-red-100 text-red-600 px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                        <XCircle size={18} /> Reject
                        </button>
                        </>
                    ) : (
                        <div className={`px-4 py-2 rounded-lg font-bold text-sm text-center capitalize ${order.status === 'accepted' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {order.status}
                        </div>
                    )}
                    </div>
                </div>
                ))
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
                <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No {activeTab} items found</h3>
                <p className="text-gray-500 mt-1">When you engage in transactions, they will appear here.</p>
                </div>
            )}
            </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className={`text-xl font-bold ${actionType === 'accepted' ? 'text-gray-900' : 'text-red-600'}`}>
                  {actionType === 'accepted' ? 'Confirm Pickup' : 'Reject Pickup'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleProcessAction} className="p-6">
              
              {/* Dynamic Warning Message */}
              <div className={`p-4 rounded-lg text-sm mb-6 flex gap-3 items-start ${actionType === 'accepted' ? 'bg-blue-50 text-blue-800' : 'bg-red-50 text-red-800'}`}>
                {actionType === 'accepted' ? (
                    <CheckCircle size={20} className="flex-shrink-0 mt-0.5 text-blue-600" />
                ) : (
                    <Ban size={20} className="flex-shrink-0 mt-0.5 text-red-600" />
                )}
                <p>
                  {actionType === 'accepted' 
                    ? `By confirming, you agree that you have inspected and received this item. Funds will be released to the seller immediately. This action cannot be undone.`
                    : `By rejecting, you state that the item was not received or was unsatisfactory. This will trigger a cancellation process.`
                  }
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verify your password to confirm
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={verificationPassword}
                    onChange={(e) => setVerificationPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600/20 focus:border-green-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!verificationPassword || isSubmitting}
                  className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition disabled:opacity-50 flex justify-center items-center
                    ${actionType === 'accepted' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                  `}
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (actionType === 'accepted' ? 'Release Funds' : 'Confirm Reject')}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}