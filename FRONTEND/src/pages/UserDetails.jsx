import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthComps/CheckAuth.jsx";
import Popup from "../components/GlobalComps/Popup.jsx";
import Nav from "../components/GlobalComps/Nav.jsx";
import PasswordConfirmModal from "../components/GlobalComps/PasswordConfirmModal.jsx";
import { ArrowLeft, User, Gavel, History, CheckCircle, Clock, XCircle, CreditCard, Wallet, ListTodo, Loader2 } from 'lucide-react';
import { supabase } from "../supabaseClient.js";
import BouncingLoader from "../components/GlobalComps/BouncingLoader.jsx";

export default function UserDetails() {
    const { session } = useAuth();
    const navigate = useNavigate();

    // UI States
    const [editStatus, setEdit] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [popup, setPopup] = useState({ show: false, type: "", message: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [subLoading, setSubLoading] = useState(false);
    
    // Modal States
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [updateData, setUpdateData] = useState({
        username: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        schoolName: "",
    });

    const [activityData, setActivityData] = useState([]);

    const handleGoBack = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (session?.user) {
                const { data, error } = await supabase
                    .from('users_info')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .maybeSingle();
    
                if (error) {
                    console.error("Error fetching user profile:", error);
                    return;
                }
    
                setUpdateData({
                    username: data?.display_name || "",
                    fullName: data?.full_name || "",
                    email: session.user.email || "",
                    phoneNumber: data?.phone || "",
                    schoolName: data?.school || "",
                });
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        };
        fetchUserProfile();
    }, [session]);

    const handleview = async (currentTab) => {
        if (currentTab === 'bids') {
            navigate('/my-bids');
            return;
        }

        if(currentTab !== 'profile'){
            setActiveTab("");
            setSubLoading(true);

            if(currentTab === 'myItems'){
                const {data, error} = await supabase
                .from('all_items')
                .select('id, item_name, item_value, status, created_at')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(6);

                if(error){
                    console.error("Error fetching user items:", error);
                    setSubLoading(false);
                    return;
                }
                setActivityData(data);
                setSubLoading(false);
                setActiveTab('myItems');
                
                return;

            }else if(currentTab === 'transactions'){
                const {data, error} = await supabase
                .from('transactions_items')
                .select('id, transaction_type, transaction_date, amount, item: all_items(item_name)')
                .eq('user_id', session.user.id)
                .order('transaction_date', { ascending: false })
                .limit(6);

                if(error){
                    console.error("Error fetching user transactions:", error);
                    setSubLoading(false);
                    return;
                }
                setActivityData(data);
                setSubLoading(false);
                setActiveTab('transactions');
                return;
            }
        } else {
            setActiveTab('profile');
        }
    }

    if (isLoading) {
        return <BouncingLoader />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateData(prev => ({ ...prev, [name]: value }));
    };

    const handleInitiateSave = (e) => {
        e.preventDefault();
        setShowPasswordModal(true);
    };

    const handleConfirmAndSave = async (password) => {
        setIsSubmitting(true);

        const { error: authError } = await supabase.auth.signInWithPassword({
            email: session.user.email,
            password: password,
        });

        if (authError) {
            setPopup({ show: true, type: "error", message: "Incorrect password. Update failed." });
            setIsSubmitting(false);
            setShowPasswordModal(false);
            return;
        }

        const { error: updateError } = await supabase
            .from('users_info')
            .update({
                display_name: updateData.username,
                phone: updateData.phoneNumber,
            })
            .eq('user_id', session.user.id);

        if (updateError) {
            setPopup({ show: true, type: "error", message: "Error updating user data." });
        } else {
            setPopup({ show: true, type: "success", message: "Profile updated successfully!" });
            setEdit(false);
        }

        setIsSubmitting(false);
        setShowPasswordModal(false);
    };

    return (
        <div className="max-w-5xl mx-auto mt-6 px-4 pb-12 relative">
            <Nav />
            {/* Popups and Modals */}
            {popup.show && (
                <Popup feedback={popup.type} content={popup.message} onClose={() => setPopup({ show: false, type: "", message: "" })} />
            )}

            <PasswordConfirmModal 
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onConfirm={handleConfirmAndSave}
                isSubmitting={isSubmitting}
            />

            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-6 mt-25">
                <button 
                    onClick={handleGoBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                >
                    <ArrowLeft className="text-gray-700" size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>
                <div className="w-10"></div> 
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Sidebar / Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                        <div className="relative inline-block mb-4">
                            <img
                                className="w-24 h-24 rounded-full object-cover border-4 border-green-50 shadow-md"
                                src="/static/images/avatar/1.jpg"
                                alt={updateData.username || "User avatar"}
                            />
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{updateData.fullName || "Loading..."}</h2>
                        <p className="text-sm text-gray-500 mb-2">@{updateData.username || "user"}</p>
                        <div className="flex gap-1 items-center justify-center mb-6 shadow-md px-3 py-2 rounded-lg">
                            <Wallet className="text-gray-600 font-bold" size={18} strokeWidth={3}/> 
                            <span className="text-sm font-semibold text-gray-900">₦125.75</span>
                        </div>
                        
                        <div className="space-y-2">
                            {/* FIXED: Replaced setActiveTab with handleview calls */}
                            <button 
                                onClick={() => handleview('profile')}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <User size={18} /> Profile Details
                            </button>
                            <button 
                                onClick={() => handleview('myItems')}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'myItems' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <ListTodo size={18} /> My Items
                            </button>
                            <button 
                                onClick={() => handleview('bids')}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'bids' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Gavel size={18} /> My Bids
                            </button>
                            <button 
                                onClick={() => handleview('transactions')}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'transactions' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <History size={18} /> Transactions
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
                        
                        {/* Loading Spinner */}
                        {subLoading && (
                            <div className="flex justify-center items-center py-10">
                            <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
                            <span className="ml-3 text-gray-600 font-medium">Fetching details...</span>
                            </div>
                        )}

                        {/* Tab: Profile Info */}
                        {activeTab === 'profile' && !subLoading && (
                            <div className="animate-in fade-in duration-300">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-gray-800">Personal Information</h3>
                                    <button 
                                        onClick={() => setEdit(!editStatus)}
                                        className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition-all ${editStatus ? 'bg-gray-100 border-gray-300 text-gray-600' : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'}`}
                                    >
                                        {editStatus ? 'Cancel' : 'Edit Profile'}
                                    </button>
                                </div>
                                
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleInitiateSave}>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Username</label>
                                        <input type="text" name="username" value={updateData.username} onChange={handleChange} disabled={!editStatus} className={`p-3 rounded-xl border outline-none transition-all ${!editStatus ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-white border-green-600 ring-2 ring-green-50'}`} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Full Name</label>
                                        <input type="text" disabled value={updateData.fullName} className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email</label>
                                        <input type="email" disabled value={updateData.email} className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Phone Number</label>
                                        <input type="tel" name="phoneNumber" value={updateData.phoneNumber} onChange={handleChange} disabled={!editStatus} className={`p-3 rounded-xl border outline-none transition-all ${!editStatus ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-white border-green-600 ring-2 ring-green-50'}`} />
                                    </div>
                                    <div className="md:col-span-2 flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">School / Institution</label>
                                        <input type="text" disabled value={updateData.schoolName} className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none" />
                                    </div>
                                    {editStatus && (
                                        <div className="md:col-span-2 mt-4">
                                            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95">
                                                Save Updated Profile
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}

                        {/* Tab: My Items */}
                        {activeTab === 'myItems' && !subLoading && (
                            <div className="animate-in slide-in-from-right duration-300">
                                <h3 className="text-lg font-bold text-gray-800 mb-6">My Recent Items</h3>
                                <div className="space-y-4">
                                    {activityData?.length === 0 && <p className="text-gray-500 text-sm">No items found.</p>}
                                    {activityData?.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-full ${item.status === 'sold' ? 'bg-green-100 text-green-600' : item.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'}`}>
                                                    {item.status === 'sold' ? <CheckCircle size={20} /> : item.status === 'pending' ? <Clock size={20} /> : <XCircle size={20} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{item.item_name}</p>
                                                    <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {/* FIXED: Changed to Naira symbol */}
                                                <p className="font-black text-gray-900">₦{item.item_value?.toLocaleString()}</p>
                                                <p className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block ${item.status === 'sold' ? 'bg-green-200 text-green-800' : item.status === 'pending' ? 'bg-amber-200 text-amber-800' : 'bg-gray-200 text-gray-800'}`}>
                                                    {item.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => navigate('/my-items')} className="mt-6 text-sm text-green-600 font-bold hover:underline">
                                    View all my items &rarr;
                                </button>
                            </div>
                        )}

                        {/* Tab: Transactions */}
                        {activeTab === 'transactions' && !subLoading && (
                            <div className="animate-in slide-in-from-right duration-300">
                                <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Transactions</h3>
                                <div className="overflow-x-auto">
                                    {activityData?.length === 0 && <p className="text-gray-500 text-sm">No recent transactions.</p>}
                                    {activityData?.length > 0 && (
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                                    <th className="pb-4">Description</th>
                                                    <th className="pb-4">Date</th>
                                                    <th className="pb-4 text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {activityData.map(tx => (
                                                    <tr key={tx.id} className="group">
                                                        <td className="py-4 flex items-center gap-3">
                                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                <CreditCard size={18} />
                                                            </div>
                                                            <div>
                                                                {/* FIXED: Safe chaining in case the item is deleted */}
                                                                <p className="font-bold text-gray-800 text-sm">{tx.item?.item_name || "Unknown Item"}</p>
                                                                <p className="text-[10px] text-gray-400 uppercase font-medium">{tx.transaction_type}</p>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 text-sm text-gray-500">{new Date(tx.transaction_date).toLocaleDateString()}</td>
                                                        <td className={`py-4 text-right font-black ${tx.transaction_type === 'sale' ? 'text-green-600' : 'text-gray-900'}`}>
                                                            {/* FIXED: Changed to Naira symbol */}
                                                            {tx.transaction_type === 'sale' ? `+₦${tx.amount.toLocaleString()}` : `-₦${tx.amount.toLocaleString()}`}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}