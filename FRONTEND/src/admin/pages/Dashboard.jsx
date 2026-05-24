import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  CheckSquare,
  Wallet,
  Users as UsersIcon,
  Menu,
  Bell,
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';
import Approvals from '../components/Approvals';
import Disputes from '../components/Disputes';
import Withdrawals from '../components/Withdrawals';
import Users from '../components/Users';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../components/AuthComps/CheckAuth';

export default function AdminDashboard() {
  const { session } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingItems, setPendingItems] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [adminLevel, setAdminLevel] = useState(null);
  const [fullName, setFullName] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data, error } = await supabase.from('admin_users')
          .select('*')
          .eq('user_id', session?.user?.id)
          .single();

        if (error) throw error;
        setAdminLevel(data?.level);

        const { data: userData, error: userError } = await supabase.from('users_info')
          .select('full_name')
          .eq('user_id', session?.user?.id)
          .single();

        if (userError) throw userError;
        setFullName(userData?.full_name);

      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    }
    fetchAdminData();
  }, [session?.user?.id]);

  // Fetch counts and initial list on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all reviewing items
        const { data: itemsData } = await supabase
          .from('all_items')
          .select('*')
          .eq('status', 'reviewing')
          .order('created_at', { ascending: false });

        if (itemsData) setPendingItems(itemsData);
      } catch (err) {
        console.error("Error fetching initial dashboard counts:", err);
      }
    };

    fetchAllData();
  }, []);

  // Fetch updates when tab changes
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
    } else if (activeTab === 'withdrawals') {
      const fetchPendingWithdrawals = async () => {
        try {
          const { data: requests, error: requestsError } = await supabase
            .from('withdrawal_requests')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(10);

          if (requestsError) throw requestsError;

          if (requests && requests.length > 0) {
            const userIds = [...new Set(requests.map(r => r.user_id))];
            const { data: profiles, error: profilesError } = await supabase
              .from('users_info')
              .select('user_id, full_name, display_name, wallet_value, bank, bank_account')
              .in('user_id', userIds);

            if (profilesError) throw profilesError;

            const merged = requests.map(req => ({
              ...req,
              profile: profiles?.find(p => p.user_id === req.user_id) || {}
            }));

            setPendingWithdrawals(merged);
          } else {
            setPendingWithdrawals([]);
          }
        } catch (error) {
          console.error("Error fetching pending withdrawals:", error);
        }
      };
      fetchPendingWithdrawals();
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
    { id: 'withdrawals', label: 'Wallet Withdrawals', icon: Wallet, badge: pendingWithdrawals.length },
    { id: 'users', label: 'User Management', icon: UsersIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">

      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? 'w-64' : 'w-18'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}
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
                {fullName?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">{fullName}</p>
                <p className="text-xs text-gray-500">{adminLevel === "high" ? "Super Admin" : "Admin"}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-8">

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Funds in Escrow</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₦24,500</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Active Disputes</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{mockDisputes.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{pendingItems.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Pending Withdrawals</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{pendingWithdrawals.length}</p>
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
          {activeTab === 'withdrawals' && (
            <Withdrawals withdrawals={pendingWithdrawals} />
          )}

          {/* TAB: USERS */}
          {activeTab === 'users' && (
            <Users />
          )}
        </div>
      </main>
    </div>
  );
}