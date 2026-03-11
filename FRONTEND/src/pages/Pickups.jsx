import React, { useState } from 'react';
import Nav from "../components/GlobalComps/Nav.jsx";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Ban, 
  MapPin, 
  Lock, 
  X 
} from 'lucide-react';

// Mock Data
const mockOrders = [
  { id: "ORD-101", title: "Industrial Espresso Machine", seller: "Roy W.", price: 450, status: "pending", location: "Downtown Cafe", date: "Mar 10, 2026", image: "https://via.placeholder.com/150" },
  { id: "ORD-102", title: "MacBook Pro M3 Max", seller: "David K.", price: 3200, status: "completed", location: "Tech Hub Plaza", date: "Mar 02, 2026", image: "https://via.placeholder.com/150" },
  { id: "ORD-103", title: "Vintage Persian Rug", seller: "Sarah J.", price: 2500, status: "declined", location: "Westside Gallery", date: "Feb 28, 2026", image: "https://via.placeholder.com/150" },
  { id: "ORD-104", title: "Herman Miller Office Chair", seller: "Alex M.", price: 850, status: "cancelled", location: "Main St. Offices", date: "Feb 15, 2026", image: "https://via.placeholder.com/150" },
];

export default function MyPickupsPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationPassword, setVerificationPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = [
    { id: 'pending', label: 'Pending Pickup', icon: Clock },
    { id: 'completed', label: 'Completed', icon: CheckCircle },
    { id: 'declined', label: 'Declined', icon: XCircle },
    { id: 'cancelled', label: 'Cancelled', icon: Ban },
  ];

  const filteredOrders = mockOrders.filter(order => order.status === activeTab);

  const openConfirmModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleConfirmPickup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay for password verification and status update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Verified with password. Order ${selectedOrder.id} confirmed!`);
    
    // Reset state after success
    setIsSubmitting(false);
    setIsModalOpen(false);
    setVerificationPassword('');
    setSelectedOrder(null);
    // In a real app, you would refetch the orders or update the local state here
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
        <Nav />
      
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
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-8 hide-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center transition-hover hover:border-green-300">
                
                {/* Image Placeholder */}
                <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                  <img src={order.image} alt={order.title} className="w-full h-full object-cover" />
                </div>

                {/* Order Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900">{order.title}</h3>
                    <span className="font-semibold text-lg text-gray-900">${order.price}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Order ID: {order.id} • Seller: {order.seller}</p>
                  
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><MapPin size={16} className="text-gray-400"/> {order.location}</span>
                    <span className="flex items-center gap-1"><Clock size={16} className="text-gray-400"/> {order.date}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full sm:w-auto flex-shrink-0">
                  {order.status === 'pending' && (
                    <button 
                      onClick={() => openConfirmModal(order)}
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <CheckCircle size={18} />
                      Confirm Pickup
                    </button>
                  )}
                  {order.status !== 'pending' && (
                    <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium text-sm text-center capitalize">
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
              <p className="text-gray-500 mt-1">When you make a purchase, it will appear here.</p>
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Confirm Pickup</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleConfirmPickup} className="p-6">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-6 flex gap-3 items-start">
                <CheckCircle size={20} className="flex-shrink-0 mt-0.5 text-blue-600" />
                <p>
                  By confirming, you agree that you have inspected and received <strong>{selectedOrder.title}</strong>. 
                  Funds will be released to the seller immediately. This action cannot be undone.
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
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isSubmitting ? 'Verifying...' : 'Release Funds'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}