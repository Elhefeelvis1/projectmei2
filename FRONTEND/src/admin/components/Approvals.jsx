import { CheckCircle, XCircle } from "lucide-react";


function Approvals({ items }) {



    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-medium">${item.price}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Seller: {item.seller} • ID: {item.id}</p>

                        <div className={`text-xs inline-flex items-center px-2 py-1 rounded-full mb-4 ${item.riskScore === 'High' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            Risk Score: {item.riskScore}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 py-2 rounded-lg text-sm font-medium transition flex justify-center items-center gap-2">
                            <CheckCircle size={16} /> Approve
                        </button>
                        <button className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 py-2 rounded-lg text-sm font-medium transition flex justify-center items-center gap-2">
                            <XCircle size={16} /> Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Approvals