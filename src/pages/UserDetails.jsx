import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Gavel, History, CheckCircle, Clock, XCircle, CreditCard } from 'lucide-react';

export default function UserDetails(props) {
    const [editStatus, setEdit] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    // Mock Data for demonstration
    const bids = [
        { id: 1, item: "MacBook Pro M3", amount: 2400, status: 'won', date: '2025-10-12' },
        { id: 2, item: "Espresso Machine", amount: 850, status: 'pending', date: '2025-10-14' },
        { id: 3, item: "Office Chair", amount: 150, status: 'closed', date: '2025-09-30' },
    ];

    const transactions = [
        { id: 101, item: "MacBook Pro M3", type: "purchase", amount: 2400, date: '2025-10-13' },
        { id: 102, item: "iPhone 15 Case", type: "sale", amount: 25, date: '2025-10-05' },
    ];

    return (
        <div className="max-w-5xl mx-auto mt-6 px-4 pb-12">
            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-8">
                <button 
                    onClick={handleGoBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                    aria-label="Go back"
                >
                    <ArrowLeft className="text-gray-700" size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>
                <div className="w-10"></div> {/* Spacer for alignment */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Sidebar / Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                        <div className="relative inline-block mb-4">
                            <img
                                className="w-24 h-24 rounded-full object-cover border-4 border-green-50 shadow-md"
                                src="/static/images/avatar/1.jpg"
                                alt={props.username || "User avatar"}
                            />
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{props.fullName || "Mmaduabuchi Igwilo"}</h2>
                        <p className="text-sm text-gray-500 mb-6">@{props.username || "mmadu_dev"}</p>
                        
                        <div className="space-y-2">
                            <button 
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <User size={18} /> Profile Details
                            </button>
                            <button 
                                onClick={() => setActiveTab('bids')}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'bids' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Gavel size={18} /> My Bids
                            </button>
                            <button 
                                onClick={() => setActiveTab('transactions')}
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
                        
                        {/* Tab: Profile Info */}
                        {activeTab === 'profile' && (
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
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Username</label>
                                        <input type="text" disabled={!editStatus} defaultValue={props.username} className={`p-3 rounded-xl border outline-none transition-all ${!editStatus ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-white border-green-600 ring-2 ring-green-50'}`} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Full Name</label>
                                        <input type="text" disabled defaultValue={props.fullName} className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email</label>
                                        <input type="email" disabled={!editStatus} defaultValue={props.email} className={`p-3 rounded-xl border outline-none transition-all ${!editStatus ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-white border-green-600 ring-2 ring-green-50'}`} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Phone Number</label>
                                        <input type="tel" disabled={!editStatus} defaultValue={props.phoneNumber} className={`p-3 rounded-xl border outline-none transition-all ${!editStatus ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-white border-green-600 ring-2 ring-green-50'}`} />
                                    </div>
                                    <div className="md:col-span-2 flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">School / Institution</label>
                                        <input type="text" disabled defaultValue={props.schoolName} className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none" />
                                    </div>
                                    {editStatus && (
                                        <div className="md:col-span-2 mt-4">
                                            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95">Save Updated Profile</button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}

                        {/* Tab: Bids */}
                        {activeTab === 'bids' && (
                            <div className="animate-in slide-in-from-right duration-300">
                                <h3 className="text-lg font-bold text-gray-800 mb-6">Auction History</h3>
                                <div className="space-y-4">
                                    {bids.map(bid => (
                                        <div key={bid.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-full ${bid.status === 'won' ? 'bg-green-100 text-green-600' : bid.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'}`}>
                                                    {bid.status === 'won' ? <CheckCircle size={20} /> : bid.status === 'pending' ? <Clock size={20} /> : <XCircle size={20} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{bid.item}</p>
                                                    <p className="text-xs text-gray-500">{bid.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-gray-900">${bid.amount.toLocaleString()}</p>
                                                <p className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block ${bid.status === 'won' ? 'bg-green-200 text-green-800' : bid.status === 'pending' ? 'bg-amber-200 text-amber-800' : 'bg-gray-200 text-gray-800'}`}>
                                                    {bid.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tab: Transactions */}
                        {activeTab === 'transactions' && (
                            <div className="animate-in slide-in-from-right duration-300">
                                <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Transactions</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                                <th className="pb-4">Description</th>
                                                <th className="pb-4">Date</th>
                                                <th className="pb-4 text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {transactions.map(tx => (
                                                <tr key={tx.id} className="group">
                                                    <td className="py-4 flex items-center gap-3">
                                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                            <CreditCard size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-800 text-sm">{tx.item}</p>
                                                            <p className="text-[10px] text-gray-400 uppercase font-medium">{tx.type}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-sm text-gray-500">{tx.date}</td>
                                                    <td className={`py-4 text-right font-black ${tx.type === 'sale' ? 'text-green-600' : 'text-gray-900'}`}>
                                                        {tx.type === 'sale' ? `+$${tx.amount}` : `-$${tx.amount}`}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}