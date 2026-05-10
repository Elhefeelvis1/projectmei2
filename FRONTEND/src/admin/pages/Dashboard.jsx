import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  CheckSquare,
  Wallet,
  Users,
  Menu,
  Bell,
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';
import Approvals from '../components/Approvals';
import Disputes from '../components/Disputes';
import { supabase } from '../../supabaseClient';

// Mock Data
const adminUser = { name: "Sarah Jenkins", role: "Super Admin" };

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingItems, setPendingItems] = useState([]);

  useEffect(() => {
    if (activeTab === 'approvals') {
      const fetchPendingItems = async () => {
        try {
          const { data, error } = await supabase
            .from('all_items')
            .select('*')
            .eq('status', 'reviewing')
            .order('created_at', { ascending: false });

          if (error) throw error;
          setPendingItems(data || []);
        } catch (error) {
          console.error("Error fetching pending items:", error);
        }
      };

      fetchPendingItems();
    }
  }, [activeTab]);

  const [mockDisputes, setMockDisputes] = useState([
    { id: "TXN-8829", buyer: "Alex M.", seller: "David K.", item: "MacBook Pro", amount: 1200, status: "Contested", reason: "Item scratched, not as described." },
    { id: "TXN-9102", buyer: "Jessica T.", seller: "Roy W.", item: "Espresso Machine", amount: 450, status: "Contested", reason: "Seller did not show up." },
  ]);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'disputes', label: 'Disputes', icon: ShieldAlert, badge: mockDisputes.length },
    { id: 'approvals', label: 'Pending Approvals', icon: CheckSquare, badge: pendingItems.length },
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
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-green-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
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
                <p className="text-3xl font-bold text-amber-600 mt-2">{pendingItems.length}</p>
              </div>
            </div>
          )}

          {/* TAB: DISPUTES */}
          {activeTab === 'disputes' && (
            <Disputes disputes={mockDisputes} />
          )}

          {/* TAB: APPROVALS */}
          {activeTab === 'approvals' && (
            <Approvals items={pendingItems} />
          )}

          {/* TAB: WITHDRAWALS */}
          {/* {activeTab === 'withdrawals' && (
            <Withdrawals withdrawals={mockWithdrawals} />
          )} */}

          {/* TAB: USERS */}
          {/* {activeTab === 'users' && (
            <Users users={mockUsers} />
          )} */}
        </div>
      </main>
    </div>
  );
}