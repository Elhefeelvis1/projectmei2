import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  RefreshCw, 
  AlertCircle, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  Calendar,
  X,
  ShieldAlert,
  User,
  Package
} from 'lucide-react';
import { supabase } from '../../supabaseClient';

export default function Approvals({ items }) {
  const [pendingItems, setPendingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Modal State
  const [activeModal, setActiveModal] = useState({
    show: false,
    mode: 'approve', // 'approve' or 'reject'
    item: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hydrate local state from prop on mount/change
  useEffect(() => {
    if (items) {
      setPendingItems(items);
    }
  }, [items]);

  // Fetch pending items from supabase with seller info
  const fetchPendingApprovals = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const { data, error } = await supabase
        .from('all_items')
        .select('*, users_info(user_id, display_name, full_name, school)')
        .eq('status', 'reviewing')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingItems(data || []);
    } catch (err) {
      console.error('Error fetching approvals data:', err);
      setErrorMessage('Failed to fetch pending items under review. Please try reloading.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run the full fetch with joined seller info once on mount to replace any incomplete dashboard prop data
  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const handleOpenApprove = (item) => {
    setActiveModal({ show: true, mode: 'approve', item });
  };

  const handleOpenReject = (item) => {
    setActiveModal({ show: true, mode: 'reject', item });
  };

  const handleCloseModal = () => {
    setActiveModal({ show: false, mode: 'approve', item: null });
  };

  const handleConfirmAction = async () => {
    const { mode, item } = activeModal;
    if (!item) return;

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const nextStatus = mode === 'approve' ? 'active' : 'rejected';
      const { error } = await supabase
        .from('all_items')
        .update({ status: nextStatus })
        .eq('id', item.id);

      if (error) throw error;

      // Update local state instantly
      setPendingItems(prev => prev.filter(i => i.id !== item.id));
      handleCloseModal();
    } catch (err) {
      console.error('Error processing item review status:', err);
      setErrorMessage(`Failed to ${mode} item. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col p-6 space-y-6">
      
      {/* Header bar */}
      <div className="flex justify-between items-center border-b pb-4 border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CheckSquare className="text-green-500" size={22} />
            Pending Item Approvals
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review and approve or reject marketplace listing submissions.
          </p>
        </div>
        <button
          onClick={fetchPendingApprovals}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Reload List
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2.5 text-sm text-rose-800 font-medium leading-relaxed">
          <AlertCircle size={18} className="text-rose-600 flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Main Table view */}
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
            <p className="text-sm font-semibold text-slate-500">Loading pending items...</p>
          </div>
        ) : pendingItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400">
              <CheckSquare size={32} />
            </div>
            <p className="text-base font-bold text-slate-700">No Pending Approvals</p>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Excellent work! All marketplace item submissions have been fully reviewed.
            </p>
            <button
              onClick={fetchPendingApprovals}
              className="mt-2 text-xs font-bold text-green-600 hover:text-green-700 border-b border-green-600 hover:border-green-700 transition pb-0.5 cursor-pointer"
            >
              Check for new items
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-6">Item Details</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6">Seller Details</th>
                <th className="py-3 px-6">Risk Score</th>
                <th className="py-3 px-6">Date Submitted</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {pendingItems.map(item => {
                const sellerName = item.users_info?.full_name || item.users_info?.display_name || item.seller || 'Unknown Seller';
                const sellerUser = item.users_info?.display_name ? `@${item.users_info.display_name}` : 'N/A';
                const schoolName = item.users_info?.school || 'Unspecified school';
                const formattedDate = new Date(item.created_at).toLocaleDateString(undefined, { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                });

                // Risk calculations
                const isHighRisk = item.riskScore === 'High' || item.risk_score === 'High';
                const scoreValue = item.riskScore || item.risk_score || 'Low';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Item details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-snug">{item.item_name || item.title || 'Untitled Item'}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">ID: {item.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold text-slate-800">
                        ₦{(item.item_value || item.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Seller details */}
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{sellerName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{sellerUser} • {schoolName}</p>
                      </div>
                    </td>

                    {/* Risk Score */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isHighRisk 
                          ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {scoreValue}
                      </span>
                    </td>

                    {/* Date Submitted */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{formattedDate}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenApprove(item)}
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 p-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                          title="Approve Listing"
                        >
                          <CheckCircle size={16} />
                          <span className="hidden lg:inline">Approve</span>
                        </button>
                        <button
                          onClick={() => handleOpenReject(item)}
                          className="bg-rose-50 text-rose-700 hover:bg-rose-100 p-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                          title="Reject Listing"
                        >
                          <XCircle size={16} />
                          <span className="hidden lg:inline">Reject</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirmation Modal */}
      {activeModal.show && activeModal.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-250 border border-slate-100">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className={`text-base font-bold flex items-center gap-2 ${
                activeModal.mode === 'reject' ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {activeModal.mode === 'reject' ? (
                  <>
                    <ShieldAlert size={20} />
                    Reject Item Submission
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Approve Item Submission
                  </>
                )}
              </h2>
              <button 
                onClick={handleCloseModal} 
                disabled={isSubmitting}
                className="text-slate-400 hover:text-slate-700 transition disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              
              {/* Alert Warning Panel */}
              <div className={`p-4 rounded-xl text-xs leading-relaxed flex gap-3 items-start ${
                activeModal.mode === 'reject' 
                  ? 'bg-rose-50 text-rose-800' 
                  : 'bg-emerald-50 text-emerald-800'
              }`}>
                {activeModal.mode === 'reject' ? (
                  <XCircle size={18} className="flex-shrink-0 mt-0.5 text-rose-600" />
                ) : (
                  <CheckCircle size={18} className="flex-shrink-0 mt-0.5 text-emerald-600" />
                )}
                <p>
                  {activeModal.mode === 'reject' 
                    ? `Are you sure you want to reject "${activeModal.item.item_name || activeModal.item.title}"? Rejecting this submission will flag it as rejected and it will not appear on the buyer catalog.`
                    : `Are you sure you want to approve "${activeModal.item.item_name || activeModal.item.title}"? Approving will list this item on the live student marketplace catalog immediately.`
                  }
                </p>
              </div>

              {/* Item Details Summary Card */}
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Listing overview</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">Item Name</span>
                  <span className="font-bold text-slate-800 max-w-[200px] truncate">{activeModal.item.item_name || activeModal.item.title}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">Listing Price</span>
                  <span className="font-bold text-slate-800">₦{(activeModal.item.item_value || activeModal.item.price || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">Seller</span>
                  <span className="font-bold text-slate-800">{activeModal.item.users_info?.full_name || activeModal.item.users_info?.display_name || activeModal.item.seller || 'Unknown'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold text-xs transition cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleConfirmAction}
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2.5 text-white rounded-xl font-bold text-xs transition flex justify-center items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50 ${
                    activeModal.mode === 'reject' 
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/10' 
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/10'
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : activeModal.mode === 'reject' ? (
                    <>
                      <XCircle size={14} />
                      Confirm Reject
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} />
                      Confirm Approve
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}