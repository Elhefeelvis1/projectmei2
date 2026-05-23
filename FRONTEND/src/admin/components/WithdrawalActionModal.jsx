import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Loader2, Wallet } from 'lucide-react';
import { supabase } from '../../supabaseClient';

export default function WithdrawalActionModal({
  isOpen,
  onClose,
  mode, // 'approve' | 'decline'
  request, // the request object including profile
  onSuccess // callback to parent after successful DB update
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !request) return null;

  const profile = request.profile || {};
  const requestedAmount = request.amount || 0;
  const walletValue = profile.wallet_value || 0;
  
  // Bank details from profile
  const bankName = profile.bank || 'Not Provided';
  const accountNumber = profile.bank_account || 'Not Provided';
  const accountName = profile.full_name || 'Not Provided';

  const handleFinalize = async () => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const nextStatus = mode === 'approve' ? 'approved' : 'rejected';
      
      // Update withdrawal_requests table status column
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({ status: nextStatus })
        .eq('id', request.id);

      if (error) throw error;

      // If approved, we might also want to subtract the amount from the user's wallet_value
      // to synchronize the database. Wait, the process_withdrawal RPC might have already done this,
      // but to be absolutely sure, let's verify if we need to do it or if it is already done.
      // Usually, in a clean architecture, the database handles transaction logic.
      // We will perform the status update as explicitly requested: "updates the 'status' column of the database table to 'approved/rejected'".
      
      onSuccess(request.id, nextStatus);
      onClose();
    } catch (err) {
      console.error(`Error finalising ${mode}:`, err);
      setErrorMsg(err.message || `Failed to finalize request. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all scale-100 duration-300 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 text-white flex items-center gap-4 ${
          mode === 'approve' ? 'bg-gradient-to-r from-emerald-600 to-green-500' : 'bg-gradient-to-r from-rose-600 to-red-500'
        }`}>
          <div className="p-2 bg-white/20 rounded-xl">
            {mode === 'approve' ? <CheckCircle size={28} /> : <AlertTriangle size={28} />}
          </div>
          <div>
            <h3 className="text-xl font-bold font-sans">
              {mode === 'approve' ? 'Approve Withdrawal' : 'Decline Withdrawal'}
            </h3>
            <p className="text-white/80 text-xs mt-0.5">Request ID: {request.id}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Main summary card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Requested Payout</p>
              <p className="text-2xl font-black text-slate-800 mt-1">₦{requestedAmount.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">User Wallet Balance</p>
              <p className={`text-base font-bold mt-1 ${walletValue < requestedAmount ? 'text-rose-600' : 'text-emerald-600'}`}>
                ₦{walletValue.toLocaleString()}
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {errorMsg}
            </div>
          )}

          {mode === 'approve' ? (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b pb-2">
                User Payout Bank Details
              </h4>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-400">Account Name</p>
                  <p className="font-bold text-slate-800 mt-0.5">{accountName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400">Bank Name</p>
                  <p className="font-bold text-slate-800 mt-0.5">{bankName}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-slate-400">Account Number</p>
                  <p className="font-mono text-base font-bold text-slate-900 mt-0.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 inline-block tracking-widest">
                    {accountNumber}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 flex items-start gap-2.5 leading-relaxed">
                <Wallet size={16} className="mt-0.5 flex-shrink-0 text-emerald-600" />
                <span>
                  Please transfer exactly <strong>₦{requestedAmount.toLocaleString()}</strong> to the bank details above. Once the transfer is completed, click <strong>Finalize Approval</strong> below.
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-sm text-red-800 flex items-start gap-3">
                <AlertTriangle size={20} className="mt-0.5 flex-shrink-0 text-red-600" />
                <div>
                  <p className="font-bold">Confirm Declining Request</p>
                  <p className="text-xs text-red-700 mt-1 leading-relaxed">
                    Are you sure you want to reject this withdrawal request of <strong>₦{requestedAmount.toLocaleString()}</strong> for user <strong>{profile.display_name || profile.full_name || 'User'}</strong>? This decision will reject the payout and update the request status.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-white hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl border border-slate-200 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          
          <button
            onClick={handleFinalize}
            disabled={isLoading || (mode === 'approve' && walletValue < requestedAmount)}
            className={`flex-1 font-bold py-3 rounded-xl text-white shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'approve' 
                ? 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed' 
                : 'bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Finalizing...
              </>
            ) : mode === 'approve' ? (
              'Finalize Approval'
            ) : (
              'Finalize Decline'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
