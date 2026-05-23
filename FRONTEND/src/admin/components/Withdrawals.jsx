import React, { useState, useEffect } from 'react';
import { RotateCw, Wallet, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import WithdrawalRow from './WithdrawalRow';
import WithdrawalActionModal from './WithdrawalActionModal';

export default function Withdrawals({ withdrawals }) {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeModal, setActiveModal] = useState({ show: false, mode: 'approve', request: null });
  const [errorMessage, setErrorMessage] = useState('');

  // Hydrate local state from prop
  useEffect(() => {
    if (withdrawals) {
      setRequests(withdrawals);
    }
  }, [withdrawals]);

  // Main fetch function to reload or get new pending withdrawal requests
  const fetchPendingWithdrawals = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      // 1. Fetch up to 10 pending withdrawal requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

      if (requestsError) throw requestsError;

      if (requestsData && requestsData.length > 0) {
        // 2. Fetch profiles for associated users to get names, display_names, wallets, and banks
        const userIds = [...new Set(requestsData.map(r => r.user_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from('users_info')
          .select('user_id, full_name, display_name, wallet_value, bank, bank_account')
          .in('user_id', userIds);

        if (profilesError) throw profilesError;

        // 3. Map profile details into requests
        const mappedRequests = requestsData.map(req => ({
          ...req,
          profile: profilesData?.find(p => p.user_id === req.user_id) || {}
        }));

        setRequests(mappedRequests);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error('Error fetching withdrawal requests:', err);
      setErrorMessage('Failed to fetch withdrawal requests. Please try refreshing again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenApprove = (request) => {
    setActiveModal({ show: true, mode: 'approve', request });
  };

  const handleOpenDecline = (request) => {
    setActiveModal({ show: true, mode: 'decline', request });
  };

  const handleModalClose = () => {
    setActiveModal({ show: false, mode: 'approve', request: null });
  };

  const handleSuccessUpdate = (requestId, nextStatus) => {
    // Instantly update local state to replace buttons with a badge
    setRequests(prev =>
      prev.map(req => (req.id === requestId ? { ...req, status: nextStatus } : req))
    );
  };

  // Check if all active/visible entries are processed (either approved or rejected)
  const allEntriesProcessed =
    requests.length > 0 && requests.every(req => req.status !== 'pending');

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col p-6 space-y-6">
      
      {/* Header bar */}
      <div className="flex justify-between items-center border-b pb-4 border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Wallet className="text-green-500" size={22} />
            Pending Wallet Withdrawals
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review and approve or reject payouts to users. Only showing up to 10 entries.
          </p>
        </div>
        <button
          onClick={fetchPendingWithdrawals}
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
            <p className="text-sm font-semibold text-slate-500">Loading withdrawals data...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400">
              <Wallet size={32} />
            </div>
            <p className="text-base font-bold text-slate-700">No Pending Requests</p>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Excellent work! All withdrawal requests have been fully processed.
            </p>
            <button
              onClick={fetchPendingWithdrawals}
              className="mt-2 text-xs font-bold text-green-600 hover:text-green-700 border-b border-green-600 hover:border-green-700 transition pb-0.5 cursor-pointer"
            >
              Check for new requests
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-6">User</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Wallet Balance</th>
                <th className="py-3 px-6">Date Requested</th>
                <th className="py-3 px-6">Bank Name</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {requests.map(req => (
                <WithdrawalRow
                  key={req.id}
                  request={req}
                  onApprove={handleOpenApprove}
                  onDecline={handleOpenDecline}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginate / Refresh when all processed */}
      {allEntriesProcessed && (
        <div className="pt-6 border-t border-slate-100 flex justify-center animate-in fade-in slide-in-from-bottom duration-300">
          <button
            onClick={fetchPendingWithdrawals}
            disabled={isLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <RotateCw size={18} />
                Refresh & Load Next 10 Entries
              </>
            )}
          </button>
        </div>
      )}

      {/* Action Popups / Modals */}
      <WithdrawalActionModal
        isOpen={activeModal.show}
        onClose={handleModalClose}
        mode={activeModal.mode}
        request={activeModal.request}
        onSuccess={handleSuccessUpdate}
      />
    </div>
  );
}
