import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit3, XCircle, AlertTriangle, Clock, CreditCard, CheckCircle, FolderClock } from 'lucide-react';
import { supabase } from "../supabaseClient";
import { useAuth } from "../components/AuthComps/CheckAuth";
import Nav from "../components/GlobalComps/Nav";
import BidItemCard from "../components/BodyComps/BidItemCard";
import Tabs from "../components/GlobalComps/Tabs";

// Tabs for the UI
const tabs = [
  { id: 'pending', label: 'Active Bids', icon: Clock },
  { id: 'accepted', label: 'Purchased / Won', icon: CheckCircle },
  { id: 'history', label: 'History', icon: FolderClock },
];

export default function MyBids() {
    const navigate = useNavigate();
    const { session } = useAuth();

    const [activeTab, setActiveTab] = useState('pending');
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modals
    const [confirmModal, setConfirmModal] = useState({ show: false, bidId: null });
    const [editModal, setEditModal] = useState({ show: false, bid: null });

    useEffect(() => {
        if (session?.user) {
            fetchMyBids();
        }
    }, [session]);

    const fetchMyBids = async () => {
        setLoading(true);
        try {
            // We fetch the bids AND the connected item data simultaneously!
            const { data, error } = await supabase
                .from('bids')
                .select(`
                    *,
                    item:all_items(*)
                `)
                .eq('buyer_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBids(data || []);
        } catch (error) {
            console.error("Error fetching bids:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter logic based on tabs
    const filteredBids = bids.filter(bid => {
        if (activeTab === 'pending') return bid.status === 'pending';
        if (activeTab === 'accepted') return bid.status === 'accepted';
        if (activeTab === 'history') return ['rejected', 'withdrawn', 'closed', 'paid'].includes(bid.status);
        return true;
    });

    const handlePayNow = (bid) => {
        console.log("Preparing payment for bid:", bid.id);
        // Paystack integration will go here!
    };

    const handleWithdraw = async () => {
        const { bidId } = confirmModal;
        try {
            const { error } = await supabase
                .from('bids')
                .update({ status: 'withdrawn' })
                .eq('id', bidId);

            if (error) throw error;

            // Update UI instantly
            setBids(bids.map(b => b.id === bidId ? { ...b, status: 'withdrawn' } : b));
        } catch (error) {
            console.error("Error withdrawing bid:", error);
        } finally {
            setConfirmModal({ show: false, bidId: null });
        }
    };

    const handleRefreshAfterEdit = () => {
        setEditModal({ show: false, bid: null });
        fetchMyBids(); // Pull fresh data to reflect their new bid amount or "Buy Now" purchase
    };

    return (
        <>
        <Nav/>
        <div className="max-w-5xl mx-auto mt-24 px-4 pb-12 relative">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-5">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="text-gray-800" size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">My Bids & Purchases</h1>
            </div>

            {/* Tab Navigation */}
            <Tabs tabArray={tabs} setActive={setActiveTab} activeTab={activeTab} />

            {/* Bids Grid */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading your history...</div>
            ) : filteredBids.length === 0 ? (
                <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <Clock size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No Bids Found</h3>
                    <p className="text-gray-500">You don't have any bids in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredBids.map((bid) => {
                        const item = bid.item;
                        const hasImage = item?.image_url && item.image_url.length > 0;

                        return (
                            <div key={bid.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4">
                            {/* Thumbnail */}
                            <div className="w-full sm:w-28 h-28 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                {hasImage ? (
                                    <img src={item.image_url[0]} alt={item.item_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-base font-bold text-gray-900 line-clamp-1">{item?.item_name || "Item Deleted"}</h3>
                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full 
                                            ${bid.status === 'pending' ? 'bg-purple-100 text-purple-700' : ''}
                                            ${bid.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
                                            ${['rejected', 'withdrawn', 'closed'].includes(bid.status) ? 'bg-gray-100 text-gray-600' : ''}
                                        `}>
                                            {bid.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">
                                        You offered: <span className="font-bold text-gray-900">₦{bid.total_amount.toLocaleString()}</span> for {bid.quantity} item(s)
                                    </p>
                                </div>

                                {/* Actions (Only show for pending) */}
                                {bid.status === 'pending' && item && (
                                    <div className="flex gap-2 mt-2">
                                        <button 
                                            onClick={() => setEditModal({ show: true, bid })}
                                            className="flex-1 flex justify-center items-center gap-1 py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-semibold rounded-lg transition"
                                        >
                                            <Edit3 size={16} /> Edit
                                        </button>
                                        <button 
                                            onClick={() => setConfirmModal({ show: true, bidId: bid.id })}
                                            className="flex-1 flex justify-center items-center gap-1 py-1.5 px-3 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-lg transition"
                                        >
                                            <XCircle size={16} /> Withdraw
                                        </button>
                                    </div>
                                )}

                                {/* Success state info - NOW AN INTERACTIVE BUTTON */}
                                {bid.status === 'accepted' && (
                                    <div className="mt-2">
                                        <button 
                                            onClick={() => handlePayNow(bid)} 
                                            className="flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg w-full sm:w-fit transition-all shadow-sm active:scale-95"
                                        >
                                            <CreditCard size={18} /> Pay ₦{bid.total_amount.toLocaleString()} Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        );
                    })}
                </div>
            )}

            {/* EDIT BID MODAL (Wraps your BidItemCard) */}
            {editModal.show && editModal.bid?.item && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="relative w-full max-w-md my-8">
                        {/* Close button for the modal */}
                        <button 
                            onClick={() => setEditModal({ show: false, bid: null })}
                            className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition"
                        >
                            <XCircle size={28} />
                        </button>
                        
                        {/* Inject your existing card here! */}
                        <BidItemCard 
                            item={editModal.bid.item} 
                            existingBid={editModal.bid} 
                            onRefresh={handleRefreshAfterEdit} 
                        />
                    </div>
                </div>
            )}

            {/* WITHDRAW CONFIRMATION MODAL */}
            {confirmModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
                        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-100 text-red-600">
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Withdraw Bid?</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Are you sure you want to withdraw this offer? The seller will no longer be able to accept it.
                        </p>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setConfirmModal({ show: false, bidId: null })}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleWithdraw}
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                            >
                                Yes, Withdraw
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
        </>
    );
}