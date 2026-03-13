import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Eye, XCircle, AlertTriangle } from 'lucide-react';

export default function MyItems() {
    const navigate = useNavigate();

    // Modal State
    const [confirmModal, setConfirmModal] = useState({ show: false, action: null, item: null });

    // Mock User Data (We will replace this with Supabase fetch later)
    const [myItems, setMyItems] = useState([
        { id: 1, title: "iPhone 13 Pro", price: 650000, category: "mobile-phones", condition: "used-like-new", status: "active", description: "Slightly used." },
        { id: 2, title: "Study Desk", price: 45000, category: "furniture", condition: "used-good", status: "active", description: "Wooden desk." },
    ]);

    const handleEdit = (item) => {
        // Navigate to the edit route AND pass the item data in the background state
        navigate(`/edit-item/${item.id}`, { state: { item } });
    };

    const handleConfirmAction = () => {
        const { action, item } = confirmModal;
        
        if (action === "delete") {
            console.log("Deleting item from Supabase:", item.id);
            setMyItems(myItems.filter(i => i.id !== item.id)); // Mock UI update
        } else if (action === "close") {
            console.log("Closing/Deactivating item:", item.id);
            setMyItems(myItems.map(i => i.id === item.id ? { ...i, status: 'closed' } : i)); // Mock UI update
        }
        
        setConfirmModal({ show: false, action: null, item: null });
    };

    return (
        <div className="max-w-5xl mx-auto mt-6 px-4 pb-12 relative">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="text-gray-800" size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myItems.map((item) => (
                    <div key={item.id} className={`bg-white border rounded-2xl p-5 shadow-sm transition-all ${item.status === 'closed' ? 'opacity-60 grayscale' : 'border-gray-100'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                                <p className="text-green-600 font-bold">₦{item.price.toLocaleString()}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                {item.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
                            <button className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                <Eye size={18} /> <span className="text-[10px] font-bold uppercase">View</span>
                            </button>
                            <button 
                                onClick={() => handleEdit(item)} 
                                disabled={item.status === 'closed'}
                                className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition disabled:opacity-50"
                            >
                                <Edit size={18} /> <span className="text-[10px] font-bold uppercase">Edit</span>
                            </button>
                            <button 
                                onClick={() => setConfirmModal({ show: true, action: "close", item })}
                                disabled={item.status === 'closed'}
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
                ))}
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
    );
}