import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from "../supabaseClient";
import Nav from "../components/GlobalComps/Nav";
import Popup from "../components/GlobalComps/Popup";

export default function ItemOffers() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Grab the item name from the navigation state if available
    const itemName = location.state?.itemName || "Item";

    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popupData, setPopupData] = useState({ show: false, feedback: '', content: '' });

    useEffect(() => {
        fetchBids();
    }, [id]);

    const fetchBids = async () => {
        try {
            // Fetch pending bids for this item, sorted by highest amount
            // NOTE: Replace 'profiles' with your actual user details table if different
            const { data, error } = await supabase
                .from('bids')
                .select(`
                    *,
                    buyer:users_info(display_name)
                `)
                .eq('item_id', id)
                .eq('status', 'pending')
                .order('total_amount', { ascending: false });

            if (error) throw error;

            setBids(data);
        } catch (error) {
            console.error("Error fetching bids:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (bidId, quantityRequested) => {
        try {
            // 1. Accept this specific bid
            const { error: acceptError } = await supabase
                .from('bids')
                .update({ status: 'accepted' })
                .eq('id', bidId);
            if (acceptError) throw acceptError;

            // 2. Reject all OTHER pending bids for this item
            const { error: rejectOthersError } = await supabase
                .from('bids')
                .update({ status: 'rejected' })
                .eq('item_id', id)
                .neq('id', bidId)
                .eq('status', 'pending');
            if (rejectOthersError) throw rejectOthersError;

            // 3. Update the main item status to sold (Assuming they bought the remaining stock)
            // You might need to adjust this if they only bought a partial quantity
            const { error: itemError } = await supabase
                .from('all_items')
                .update({ status: 'sold' })
                .eq('id', id);
            if (itemError) throw itemError;

            setPopupData({ show: true, feedback: 'success', content: "Offer Accepted! The item is now marked as sold." });
            
            // Remove all bids from UI since item is sold
            setBids([]); 

        } catch (error) {
            console.error("Error accepting bid:", error);
            setPopupData({ show: true, feedback: 'error', content: "Failed to accept the offer." });
        }
    };

    const handleReject = async (bidId) => {
        try {
            const { error } = await supabase
                .from('bids')
                .update({ status: 'rejected' })
                .eq('id', bidId);

            if (error) throw error;

            // Remove the rejected bid from the UI
            setBids(bids.filter(b => b.id !== bidId));
            
        } catch (error) {
            console.error("Error rejecting bid:", error);
            setPopupData({ show: true, feedback: 'error', content: "Failed to reject the offer." });
        }
    };

    return (
        <> 
        <Nav/>
        <div className="max-w-3xl mx-auto mt-24 px-4 pb-12 relative">
            
            {popupData.show && (
                <Popup 
                    feedback={popupData.feedback}
                    content={popupData.content}
                    onClose={() => setPopupData({show: false, feedback: "", content: ""})}
                />
            )}

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="text-gray-800" size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Offers Received</h1>
                    <p className="text-sm text-gray-500">For: <span className="font-semibold">{itemName}</span></p>
                </div>
            </div>

            {/* Bids List */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading offers...</div>
            ) : bids.length === 0 ? (
                <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <Clock size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No Active Offers</h3>
                    <p className="text-gray-500">You don't have any pending bids for this item right now.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bids.map((bid, index) => {
                        const isTopOffer = index === 0;
                        const bidDate = new Date(bid.created_at).toLocaleDateString();

                        return (
                            <div key={bid.id} className={`bg-white rounded-2xl p-5 shadow-sm border ${isTopOffer ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-100'}`}>
                                
                                {isTopOffer && (
                                    <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase rounded-full mb-3">
                                        Highest Offer
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        {/* Fallback to 'Anonymous Buyer' if profile fetch fails */}
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {bid.buyer?.display_name || 'Interested Buyer'}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Requested: {bid.quantity} item(s) • Placed on {bidDate}
                                        </p>
                                        <div className="mt-2 text-2xl font-black text-gray-900">
                                            ₦{bid.total_amount.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-4 sm:mt-0">
                                        <button 
                                            onClick={() => handleReject(bid.id)}
                                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-colors border border-transparent hover:border-red-200"
                                        >
                                            <XCircle size={18} /> Reject
                                        </button>
                                        
                                        <button 
                                            onClick={() => handleAccept(bid.id, bid.quantity)}
                                            className="flex items-center gap-2 px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-sm transition-transform active:scale-95"
                                        >
                                            <CheckCircle size={18} /> Accept Offer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
        </>
    );
}