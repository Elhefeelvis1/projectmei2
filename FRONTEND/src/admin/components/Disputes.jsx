import { AlertTriangle, ShieldAlert } from "lucide-react";

function Disputes({ disputes }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-4 border-slate-100">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                        <ShieldAlert className="text-red-500" size={22} />
                        Active Trade Disputes
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Arbitrate and resolve contested transactions between buyers and sellers.
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left border-collapse min-w-[650px]">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-xs sm:text-sm border-b border-gray-200">
                            <th className="p-3.5 font-semibold">Transaction ID</th>
                            <th className="p-3.5 font-semibold">Parties</th>
                            <th className="p-3.5 font-semibold">Amount</th>
                            <th className="p-3.5 font-semibold">Reason</th>
                            <th className="p-3.5 font-semibold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {disputes && disputes.length > 0 ? (
                            disputes.map(dispute => (
                                <tr key={dispute.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3.5 font-medium text-gray-900 text-sm">{dispute.id || dispute.reference_id || dispute.pickup_id}</td>
                                    <td className="p-3.5 text-xs sm:text-sm">
                                        <span className="text-blue-600 font-semibold">{dispute.buyer || dispute.buyer_name || 'Buyer'}</span> (Buyer) <br />
                                        <span className="text-gray-400 text-xs font-medium">vs</span> <br />
                                        <span className="text-green-600 font-semibold">{dispute.seller || dispute.seller_name || 'Seller'}</span> (Seller)
                                    </td>
                                    <td className="p-3.5 font-bold text-gray-900 text-sm">₦{(dispute.amount || dispute.total_amount || 0)?.toLocaleString()}</td>
                                    <td className="p-3.5 text-xs sm:text-sm text-gray-600 max-w-xs">
                                        <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                            <span className="truncate">{dispute.reason || 'Trade dispute raised'}</span>
                                        </div>
                                    </td>
                                    <td className="p-3.5 text-right">
                                        <button className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-xs">
                                            Resolve Case
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-400 text-sm">
                                    No active trade disputes found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Disputes;