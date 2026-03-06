import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  CheckSquare, 
  Wallet, 
  Users, 
  Menu, 
  Bell, 
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';

// Mock Data
const adminUser = { name: "Sarah Jenkins", role: "Super Admin" };

const mockDisputes = [
  { id: "TXN-8829", buyer: "Alex M.", seller: "David K.", item: "MacBook Pro", amount: 1200, status: "Contested", reason: "Item scratched, not as described." },
  { id: "TXN-9102", buyer: "Jessica T.", seller: "Roy W.", item: "Espresso Machine", amount: 450, status: "Contested", reason: "Seller did not show up." },
];

const mockPendingItems = [
  { id: "ITM-102", seller: "Marcus P.", title: "Vintage Leather Jacket", price: 200, riskScore: "Low" },
  { id: "ITM-105", seller: "Elena G.", title: "PS5 Console - New", price: 480, riskScore: "High" },
];

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'disputes', label: 'Disputes', icon: ShieldAlert, badge: mockDisputes.length },
    { id: 'approvals', label: 'Pending Approvals', icon: CheckSquare, badge: mockPendingItems.length },
    { id: 'withdrawals', label: 'Wallet Withdrawals', icon: Wallet },
    { id: 'users', label: 'User Management', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          {isSidebarOpen && <span className="text-xl font-bold text-green-400">P2P Admin</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
            {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-green-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} className="min-w-[20px]" />
                {isSidebarOpen && (
                  <span className="ml-3 flex-1 text-left text-sm font-medium">{item.label}</span>
                )}
                {isSidebarOpen && item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">
            {activeTab.replace('-', ' ')}
          </h1>
          
          <div className="flex items-center gap-6">
            <button className="relative text-gray-500 hover:text-gray-700">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l pl-6">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                {adminUser.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">{adminUser.name}</p>
                <p className="text-xs text-gray-500">{adminUser.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-8">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Funds in Escrow</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$24,500</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Active Disputes</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{mockDisputes.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{mockPendingItems.length}</p>
              </div>
            </div>
          )}

          {/* TAB: DISPUTES */}
          {activeTab === 'disputes' && (
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
                  {mockDisputes.map(dispute => (
                    <tr key={dispute.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{dispute.id}</td>
                      <td className="p-4 text-sm">
                        <span className="text-blue-600 font-medium">{dispute.buyer}</span> (B) <br/>
                        <span className="text-gray-400 text-xs">vs</span> <br/>
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
          )}

          {/* TAB: APPROVALS */}
          {activeTab === 'approvals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockPendingItems.map(item => (
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
          )}
        </div>
      </main>
    </div>
  );
}