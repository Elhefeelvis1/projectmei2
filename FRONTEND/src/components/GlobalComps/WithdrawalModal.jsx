import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../AuthComps/CheckAuth.jsx";
import { Wallet, X } from "lucide-react";
import Popup from "./Popup.jsx";

export default function WithdrawalModal({ isOpen, onClose, walletValue }) {
    const { session } = useAuth();
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [popup, setPopup] = useState({ show: false, feedback: "", content: "" });

    const handleWithdraw = async () => {
        setIsLoading(true);
        try {
            // Call the secure RPC function
            const { data, error } = await supabase.rpc('process_withdrawal', {
                p_amount: Number(withdrawAmount)
            });

            if (error) throw error;
            setPopup({
                show: true,
                feedback: "success",
                content: "Withdrawal request submitted successfully! Your funds are pending transfer."
            });
            setWithdrawAmount(''); // Reset input
            onClose();

            // NOTE: You may want to trigger a callback here to refresh the user's wallet UI

        } catch (error) {
            console.error('Withdrawal error:', error);
            setPopup({
                show: true,
                feedback: "error",
                content: error.message || 'Error submitting withdrawal request. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            {popup.show && (
                <Popup
                    feedback={popup.feedback}
                    content={popup.content}
                    onClose={() => setPopup({ show: false, feedback: "", content: "" })}
                />
            )}

            <div className="relative w-full max-w-md p-6 bg-white rounded-xl shadow-xl flex flex-col gap-5">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Withdraw Funds</h2>
                    <p className="text-sm text-gray-500 mt-1">Minimum withdrawal: ₦1,000</p>
                </div>

                {/* Body */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-sm font-medium text-gray-700">Available Balance</span>
                        <span className="text-lg font-bold text-green-600">
                            ₦{Number(walletValue || 0).toLocaleString()}
                        </span>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Amount to Withdraw</label>
                        <input
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="Enter amount (₦)"
                            min="1000"
                            max={walletValue}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                        />
                        {Number(withdrawAmount) < 1000 ? (
                            <p className="text-sm text-red-500 mt-2">Minimum withdrawal: ₦1,000</p>
                        ) :
                            Number(withdrawAmount) > walletValue ? (
                                <p className="text-sm text-red-500 mt-2">Withdrawal amount exceeds wallet balance</p>
                            ) : null}
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleWithdraw}
                    disabled={Number(withdrawAmount) < 1000 || Number(withdrawAmount) > walletValue || isLoading}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                        </>
                    ) : (
                        <>
                            <Wallet size={20} /> Submit Request
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}