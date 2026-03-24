import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthComps/CheckAuth";
import { ArrowLeft, Edit, Trash2, Eye, XCircle, AlertTriangle, Clock, CheckCircle, FolderClock } from 'lucide-react'; // <-- Added missing icons
import Nav from "../components/GlobalComps/Nav";
import Tabs from "../components/GlobalComps/Tabs";
import { supabase } from "../supabaseClient";

// Tabs for the UI
const tabs = [
    { id: 'approved', label: 'Approved', icon: Clock },
    { id: 'reviewing', label: 'Under Review', icon: CheckCircle },
    { id: 'closed', label: 'Closed / Sold', icon: FolderClock },
];

export default function MyItems() {
    const navigate = useNavigate();
    const { session } = useAuth();

    const [activeTab, setActiveTab] = useState('approved');
    const [confirmModal, setConfirmModal] = useState({ show: false, action: null, item: null });
    const [loading, setLoading] = useState(true);
    const [myItems, setMyItems] = useState([]);

    useEffect(() => {
        // Moved function inside useEffect to prevent dependency/hoisting errors
        const fetchMyItems = async () => {
            if (!session?.user?.id) return;

            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('all_items')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setMyItems(data || []);
            } catch (error) {
                console.error("Error fetching items:", error);
            } finally {
                setLoading(false);
            }
        };

        if (session?.user) {
            fetchMyItems();
        } else {
            setLoading(false); // Stop loading if no session
        }
    }, [session]);
    
    // Filter logic based on tabs
    const filteredItems = myItems.filter(item => {
        if (activeTab === 'approved') return item.status === 'approved';
        if (activeTab === 'reviewing') return item.status === 'reviewing';
        if (activeTab === 'closed') return ['closed', 'sold', 'rejected'].includes(item.status);
        return true;
    });

    const handleEdit = (item) => {
        navigate(`/edit-item/${item.id}`, { state: { item } });
    };

    const handleViewBids = (item) => {
        navigate(`/item-offers/${item.id}`, { state: { itemName: item.title } });
    };

    // Made this async so it actually updates the database
    const handleConfirmAction = async () => {
        const { action, item } = confirmModal;
        
        try {
            if (action === "delete") {
                // 1. Delete from Supabase
                const { error } = await supabase.from('all_items').delete().eq('id', item.id);
                if (error) throw error;

                // 2. Update Local State
                setMyItems(myItems.filter(i => i.id !== item.id)); 
            } else if (action === "close") {
                // 1. Update in Supabase
                const { error } = await supabase.from('all_items').update({ status: 'closed' }).eq('id', item.id);
                if (error) throw error;

                // 2. Update Local State
                setMyItems(myItems.map(i => i.id === item.id ? { ...i, status: 'closed' } : i)); 
            }
        } catch (error) {
            console.error(`Error trying to ${action} item:`, error);
            // Optional: Add a toast notification here to tell the user it failed
        }
        
        setConfirmModal({ show: false, action: null, item: null });
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
                <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
            </div>

            {/* Tab Navigation */}
            <Tabs tabArray={tabs} setActive={setActiveTab} activeTab={activeTab} />

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Added Loading UI */}
                {loading ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
                        Loading your listings...
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
                        No items found in this category.
                    </div>
                ) : (
                    filteredItems.map((item) => (
                        <div key={item.id} className={`bg-white border rounded-2xl p-5 shadow-sm transition-all ${['closed', 'sold'].includes(item.status) ? 'opacity-60 grayscale' : 'border-gray-100'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{item.item_name}</h3>
                                    {/* Added optional chaining to price just in case it is null */}
                                    <p className="text-green-600 font-bold">₦{item.item_value?.toLocaleString() || '0'}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full 
                                    ${item.status === 'approved' ? 'bg-green-100 text-green-700' : ''}
                                    ${item.status === 'reviewing' ? 'bg-amber-100 text-amber-700' : ''}
                                    ${item.status === 'sold' ? 'bg-blue-100 text-blue-700' : ''}
                                    ${['closed', 'rejected'].includes(item.status) ? 'bg-gray-200 text-gray-600' : ''}
                                `}>
                                    {item.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-4 gap-2 mt-6">
                                <button 
                                    onClick={() => handleViewBids(item)}
                                    className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                >
                                    <Eye size={18} /> <span className="text-[10px] font-bold uppercase">View Bids</span>
                                </button>
                                <button 
                                    onClick={() => handleEdit(item)} 
                                    disabled={['closed', 'sold'].includes(item.status)}
                                    className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition disabled:opacity-50"
                                >
                                    <Edit size={18} /> <span className="text-[10px] font-bold uppercase">Edit</span>
                                </button>
                                <button 
                                    onClick={() => setConfirmModal({ show: true, action: "close", item })}
                                    disabled={['closed', 'sold'].includes(item.status)}
                                    className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                                >
                                    <XCircle size={18} /> <span className="text-[10px] font-bold uppercase">Close</span>
                                </button>
                                <button 
                                    onClick={() => setConfirmModal({ show: true, action: "delete", item })}
                                    className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                    <Trash2 size={18} /> <span className="text-[10px] font-bold uppercase">Delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* CONFIRMATION MODAL */}
            {confirmModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
                        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${confirmModal.action === 'delete' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            {confirmModal.action === 'delete' 
                                ? "This action cannot be undone. This will permanently delete your listing." 
                                : "Closing this listing means buyers can no longer see or purchase it."}
                        </p>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setConfirmModal({ show: false, action: null, item: null })}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmAction}
                                className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition ${confirmModal.action === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'}`}
                            >
                                Yes, {confirmModal.action === 'delete' ? 'Delete' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
    );
}