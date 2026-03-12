import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

export default function PasswordConfirmModal({ isOpen, onClose, onConfirm, isSubmitting }) {
    const [passwordInput, setPasswordInput] = useState("");

    // Don't render anything if the modal is closed
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass the typed password back to the parent component
        onConfirm(passwordInput);
        // Clear the input for security
        setPasswordInput("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Verify Identity</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    <p className="text-sm text-gray-600 mb-6">
                        Please enter your current password to confirm this action.
                    </p>
                    
                    <div className="mb-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="text-gray-400" size={18} />
                            </div>
                            <input
                                type="password"
                                required
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="Enter password"
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600/20 focus:border-green-600 outline-none transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={!passwordInput || isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition disabled:opacity-50"
                        >
                            {isSubmitting ? 'Verifying...' : 'Confirm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}