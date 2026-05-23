import React from 'react';
import { Check, X, AlertCircle, Calendar } from 'lucide-react';

export default function WithdrawalRow({ request, onApprove, onDecline }) {
  const profile = request.profile || {};
  const requestedAmount = request.amount || 0;
  const walletValue = profile.wallet_value || 0;
  const isWalletSufficient = requestedAmount <= walletValue;

  // Formatting date
  const requestDate = request.created_at
    ? new Date(request.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'N/A';

  const handleApproveClick = () => {
    if (!isWalletSufficient) {
      alert(
        `Insufficient Wallet Balance!\n\nThe requested amount (₦${requestedAmount.toLocaleString()}) exceeds the user's current wallet balance (₦${walletValue.toLocaleString()}). Approval is blocked.`
      );
      return;
    }
    onApprove(request);
  };

  const handleDeclineClick = () => {
    onDecline(request);
  };

  return (
    <tr className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
      {/* User Information */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm shadow-sm">
            {(profile.full_name || profile.display_name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">
              {profile.full_name || 'Name Loading...'}
            </p>
            <p className="text-xs text-slate-400 font-medium">
              @{profile.display_name || 'username'}
            </p>
          </div>
        </div>
      </td>

      {/* Requested Payout */}
      <td className="py-4 px-6 font-semibold text-sm">
        <span className="text-slate-900 font-black text-base">₦{requestedAmount.toLocaleString()}</span>
      </td>

      {/* User Wallet Balance */}
      <td className="py-4 px-6 text-sm">
        <div className="flex flex-col gap-1">
          <span className={`font-bold ${isWalletSufficient ? 'text-slate-700' : 'text-rose-600'}`}>
            ₦{walletValue.toLocaleString()}
          </span>
          {!isWalletSufficient && (
            <span className="text-[10px] text-rose-500 font-semibold flex items-center gap-1 animate-pulse">
              <AlertCircle size={12} />
              Exceeds wallet
            </span>
          )}
        </div>
      </td>

      {/* Date Requested */}
      <td className="py-4 px-6 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <Calendar size={13} className="text-slate-400" />
          {requestDate}
        </div>
      </td>

      {/* Bank Name (Quick View) */}
      <td className="py-4 px-6 text-sm text-slate-600 font-medium">
        {profile.bank || <span className="text-slate-300 italic">Not set</span>}
      </td>

      {/* Actions / Outcome Badge */}
      <td className="py-4 px-6 text-right">
        {request.status === 'pending' ? (
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleApproveClick}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer hover:shadow-sm ${
                isWalletSufficient
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
            >
              <Check size={14} /> Approve
            </button>
            <button
              onClick={handleDeclineClick}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer hover:shadow-sm"
            >
              <X size={14} /> Decline
            </button>
          </div>
        ) : request.status === 'approved' ? (
          <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1 shadow-sm">
            <Check size={13} strokeWidth={3} /> Approved
          </span>
        ) : (
          <span className="bg-rose-100 text-rose-800 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1 shadow-sm">
            <X size={13} strokeWidth={3} /> Rejected
          </span>
        )}
      </td>
    </tr>
  );
}
