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
  ChevronLeft,
  Power,
  Store,
  X,
  ArrowUpRight,
  ShieldCheck,
  Lock
} from 'lucide-react';
import Approvals from '../components/Approvals';
import Disputes from '../components/Disputes';
import Withdrawals from '../components/Withdrawals';
import Users from '../components/Users';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../components/AuthComps/CheckAuth';

export default function AdminDashboard() {
  const { session } = useAuth();
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingItems, setPendingItems] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [escrowTotal, setEscrowTotal] = useState(0);
  const [adminLevel, setAdminLevel] = useState(null);
  const [fullName, setFullName] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session?.user?.id)
          .maybeSingle();

        if (error) throw error;
        if (data) setAdminLevel(data?.level);

        const { data: userData, error: userError } = await supabase
          .from('users_info')
          .select('full_name, display_name')
          .eq('user_id', session?.user?.id)
          .maybeSingle();

        if (userError) throw userError;
        if (userData) {
          setFullName(userData.full_name || userData.display_name || '');
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    if (session?.user?.id) {
      fetchAdminData();
    }
  }, [session?.user?.id]);

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

  const fetchEscrowFunds = async () => {
    try {
      const { data, error } = await supabase
        .from('pickups')
        .select('total_amount')
        .eq('status', 'pending');

      if (!error && data) {
        const total = data.reduce((sum, item) => sum + (Number(item.total_amount) || 0), 0);
        setEscrowTotal(total);
      } else {
        setEscrowTotal(0);
      }
    } catch (error) {
      console.error("Error fetching escrow funds:", error);
      setEscrowTotal(0);
    }
  };

  const fetchDisputes = async () => {
    try {
      const { data, error } = await supabase
        .from('disputes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setDisputes(data);
      } else {
        setDisputes([]);
      }
    } catch (error) {
      setDisputes([]);
    }
  };

  // Fetch counts and initial list on mount
  useEffect(() => {
    fetchPendingItems();
    fetchPendingWithdrawals();
    fetchEscrowFunds();
    fetchDisputes();
  }, []);

  // Fetch updates when tab changes
  useEffect(() => {
    if (activeTab === 'approvals') {
      fetchPendingItems();
    } else if (activeTab === 'withdrawals') {
      fetchPendingWithdrawals();
    } else if (activeTab === 'disputes') {
      fetchDisputes();
    } else if (activeTab === 'overview') {
      fetchPendingItems();
      fetchPendingWithdrawals();
      fetchEscrowFunds();
      fetchDisputes();
    }
  }, [activeTab]);

  const totalNotifications = pendingItems.length + pendingWithdrawals.length + disputes.length;

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'disputes', label: 'Disputes', icon: ShieldAlert, badge: disputes.length > 0 ? disputes.length : undefined },
    { id: 'approvals', label: 'Pending Approvals', icon: CheckSquare, badge: pendingItems.length > 0 ? pendingItems.length : undefined },
    { id: 'withdrawals', label: 'Wallet Withdrawals', icon: Wallet, badge: pendingWithdrawals.length > 0 ? pendingWithdrawals.length : undefined },
    { id: 'users', label: 'User Management', icon: UsersIcon },
  ];

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 text-white transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none lg:static ${
          isMobileSidebarOpen ? 'translate-x-0 w-72 max-w-[85vw]' : '-translate-x-full lg:translate-x-0'
        } ${
          isDesktopSidebarOpen ? 'lg:w-64' : 'lg:w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800 min-h-[65px]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 shrink-0">
              <ShieldCheck size={20} />
            </div>
            {(isDesktopSidebarOpen || isMobileSidebarOpen) && (
              <span className="text-lg font-bold text-white tracking-tight truncate">
                P2P <span className="text-green-400">Admin</span>
              </span>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isDesktopSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isDesktopSidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const showFull = isDesktopSidebarOpen || isMobileSidebarOpen;

            return (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                title={!showFull ? item.label : undefined}
                className={`w-full flex items-center p-3 rounded-xl transition-all font-medium text-sm ${
                  isActive
                    ? 'bg-green-600 text-white shadow-md shadow-green-900/20 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                } ${!showFull ? 'justify-center' : ''}`}
              >
                <Icon size={20} className="shrink-0" />
                {showFull && (
                  <span className="ml-3 flex-1 text-left truncate">{item.label}</span>
                )}
                {item.badge ? (
                  showFull ? (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ml-2 ${
                        isActive ? 'bg-white text-green-700' : 'bg-red-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2 ring-2 ring-slate-900" />
                  )
                ) : null}
              </button>
            );
          })}

          <div className="pt-2">
            <a
              href="/"
              className={`w-full flex items-center p-3 rounded-xl transition-colors text-slate-300 hover:bg-slate-800 hover:text-white text-sm font-medium ${
                !(isDesktopSidebarOpen || isMobileSidebarOpen) ? 'justify-center' : ''
              }`}
              title={!(isDesktopSidebarOpen || isMobileSidebarOpen) ? "Go to MarketPlace" : undefined}
            >
              <Store size={20} className="shrink-0 text-slate-400" />
              {(isDesktopSidebarOpen || isMobileSidebarOpen) && (
                <span className="ml-3 flex-1 text-left truncate">Go to MarketPlace</span>
              )}
            </a>
          </div>
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => supabase.auth.signOut()}
            className={`w-full flex items-center p-3 rounded-xl border border-red-500/40 transition-all text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 text-sm font-medium ${
              !(isDesktopSidebarOpen || isMobileSidebarOpen) ? 'justify-center' : ''
            }`}
            title={!(isDesktopSidebarOpen || isMobileSidebarOpen) ? "Logout" : undefined}
          >
            <Power size={20} className="shrink-0" />
            {(isDesktopSidebarOpen || isMobileSidebarOpen) && (
              <span className="ml-3 flex-1 text-left truncate">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50">

        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Open sidebar navigation"
            >
              <Menu size={22} />
            </button>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 capitalize truncate tracking-tight">
              {activeTab.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <button
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {totalNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-white"></span>
              )}
            </button>

            <div className="flex items-center gap-3 border-l border-gray-200 pl-3 sm:pl-6">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center border border-green-200 shadow-2xs shrink-0">
                {fullName ? fullName.charAt(0).toUpperCase() : (session?.user?.email ? session.user.email.charAt(0).toUpperCase() : '')}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-800 leading-tight truncate max-w-[140px]">
                  {fullName || session?.user?.email || ''}
                </p>
                <p className="text-xs text-gray-500">
                  {adminLevel === "high" ? "Super Admin" : (adminLevel ? "Admin" : "")}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-gray-500">Funds in Escrow</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Lock size={18} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                      ₦{(escrowTotal || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                      <ArrowUpRight size={14} /> Active protected trades
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('disputes')}
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-gray-500">Active Disputes</span>
                    <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                      <ShieldAlert size={18} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl sm:text-3xl font-bold text-red-600 tracking-tight">{disputes.length}</p>
                    <p className="text-xs text-gray-400 group-hover:text-red-500 transition-colors font-medium mt-1">
                      Require arbitration &rarr;
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('approvals')}
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-gray-500">Pending Approvals</span>
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <CheckSquare size={18} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl sm:text-3xl font-bold text-amber-600 tracking-tight">{pendingItems.length}</p>
                    <p className="text-xs text-gray-400 group-hover:text-amber-600 transition-colors font-medium mt-1">
                      Review new item listings &rarr;
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('withdrawals')}
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-gray-500">Pending Withdrawals</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Wallet size={18} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600 tracking-tight">{pendingWithdrawals.length}</p>
                    <p className="text-xs text-gray-400 group-hover:text-blue-600 transition-colors font-medium mt-1">
                      Process payout requests &rarr;
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel on Mobile / Desktop */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
                <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3">Quick Navigation</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => setActiveTab('approvals')}
                    className="p-3.5 rounded-xl bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-200 text-left transition-all"
                  >
                    <CheckSquare className="text-amber-500 mb-2" size={20} />
                    <p className="text-xs sm:text-sm font-semibold text-gray-800">Review Items</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{pendingItems.length} awaiting</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('withdrawals')}
                    className="p-3.5 rounded-xl bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-200 text-left transition-all"
                  >
                    <Wallet className="text-blue-500 mb-2" size={20} />
                    <p className="text-xs sm:text-sm font-semibold text-gray-800">Payouts</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{pendingWithdrawals.length} pending</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('disputes')}
                    className="p-3.5 rounded-xl bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-200 text-left transition-all"
                  >
                    <ShieldAlert className="text-red-500 mb-2" size={20} />
                    <p className="text-xs sm:text-sm font-semibold text-gray-800">Disputes</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{disputes.length} active</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="p-3.5 rounded-xl bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-200 text-left transition-all"
                  >
                    <UsersIcon className="text-purple-500 mb-2" size={20} />
                    <p className="text-xs sm:text-sm font-semibold text-gray-800">Users</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Manage accounts</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DISPUTES */}
          {activeTab === 'disputes' && (
            <Disputes disputes={disputes} />
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