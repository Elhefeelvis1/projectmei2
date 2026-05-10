import { AlertTriangle } from "lucide-react";

function Disputes({ disputes }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                        <th className="p-4 font-medium">Transaction ID</th>
                        <th className="p-4 font-medium">Parties</th>
                        <th className="p-4 font-medium">Amount</th>
                        <th className="p-4 font-medium">Reason</th>
                        <th className="p-4 font-medium text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {disputes.map(dispute => (
                        <tr key={dispute.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-900">{dispute.id}</td>
                            <td className="p-4 text-sm">
                                <span className="text-blue-600 font-medium">{dispute.buyer}</span> (B) <br />
                                <span className="text-gray-400 text-xs">vs</span> <br />
                                <span className="text-green-600 font-medium">{dispute.seller}</span> (S)
                            </td>
                            <td className="p-4 font-medium">${dispute.amount}</td>
                            <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                                <AlertTriangle className="inline-block w-4 h-4 text-amber-500 mr-1 pb-0.5" />
                                {dispute.reason}
                            </td>
                            <td className="p-4 text-right">
                                <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                    Resolve Case
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Disputes;