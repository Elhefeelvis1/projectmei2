import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Users as UsersIcon, 
  UserX, 
  UserCheck, 
  Search, 
  Loader2, 
  AlertCircle, 
  Wallet, 
  School, 
  Phone, 
  X, 
  ShieldAlert 
} from 'lucide-react';
import { supabase } from '../../supabaseClient';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'suspended'
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Pagination & Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMIT = 12;

  // Stats State
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0 });

  // Error State
  const [errorMsg, setErrorMsg] = useState('');

  // Action Modal State
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    user: null,
    targetStatus: '' // 'suspended' or 'active'
  });
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Sentinel ref for Infinite Scroll IntersectionObserver
  const sentinelRef = useRef(null);

  // Stats fetching using HEAD requests (highly performant)
  const fetchStats = async () => {
    try {
      // Total count
      const { count: total, error: totalErr } = await supabase
        .from('users_info')
        .select('*', { count: 'exact', head: true });

      if (totalErr) throw totalErr;

      // Suspended count
      const { count: suspended, error: suspErr } = await supabase
        .from('users_info')
        .select('*', { count: 'exact', head: true })
        .eq('account_status', 'suspended');

      if (suspErr) throw suspErr;

      const totalCount = total || 0;
      const suspendedCount = suspended || 0;

      setStats({
        total: totalCount,
        suspended: suspendedCount,
        active: Math.max(0, totalCount - suspendedCount)
      });
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  };

  // Run stats fetch on mount and whenever a suspension action is finalized
  useEffect(() => {
    fetchStats();
  }, []);

  // Debounce the search input by 350ms to prevent spamming Supabase
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Main fetch function wrapped in useCallback
  const fetchUsers = useCallback(async (currentOffset, isNewQuery = false) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      let query = supabase
        .from('users_info')
        .select('*');

      // 1. Filter by Tab
      if (activeTab === 'suspended') {
        query = query.eq('account_status', 'suspended');
      }

      // 2. Filter by Search Query (Case-insensitive match on multiple fields)
      if (debouncedSearch.trim() !== '') {
        const term = `%${debouncedSearch.trim()}%`;
        query = query.or(`full_name.ilike.${term},display_name.ilike.${term},phone.ilike.${term},school.ilike.${term}`);
      }

      // 3. Paginate
      const fromRange = currentOffset;
      const toRange = currentOffset + LIMIT - 1;
      query = query
        .order('display_name', { ascending: true })
        .range(fromRange, toRange);

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        setUsers(prev => isNewQuery ? data : [...prev, ...data]);
        setHasMore(data.length === LIMIT);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setErrorMsg('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, debouncedSearch]);

  // Reset list and trigger new query when search term or active tab changes
  useEffect(() => {
    setUsers([]);
    setOffset(0);
    setHasMore(true);
    fetchUsers(0, true);
  }, [activeTab, debouncedSearch, fetchUsers]);

  // Callback to load the next page of users
  const loadMoreUsers = useCallback(() => {
    if (isLoading || !hasMore) return;
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    fetchUsers(nextOffset, false);
  }, [isLoading, hasMore, offset, fetchUsers]);

  // Set up the IntersectionObserver for Infinite Scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreUsers();
        }
      },
      {
        root: null, // relative to document viewport
        rootMargin: '100px', // start loading before completely scrolling to the bottom
        threshold: 0.1
      }
    );

    observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [sentinelRef, hasMore, isLoading, loadMoreUsers]);

  // Handle opening action modal
  const openActionModal = (user, targetStatus) => {
    setActionModal({
      isOpen: true,
      user,
      targetStatus
    });
  };

  // Close modal helper
  const closeActionModal = () => {
    setActionModal({ isOpen: false, user: null, targetStatus: '' });
  };

  // Perform backend suspension state change
  const handleUpdateStatus = async () => {
    const { user, targetStatus } = actionModal;
    if (!user) return;

    setIsSubmittingAction(true);
    setErrorMsg('');
    try {
      const dbStatus = targetStatus === 'suspended' ? 'suspended' : 'active';
      const { error } = await supabase
        .from('users_info')
        .update({ account_status: dbStatus })
        .eq('user_id', user.user_id);

      if (error) throw error;

      // Update local state instantly
      setUsers(prev => 
        prev.map(u => 
          u.user_id === user.user_id 
            ? { ...u, account_status: dbStatus } 
            : u
        )
      );

      // If we are on the suspended tab and unsuspended someone, remove them immediately
      if (activeTab === 'suspended' && dbStatus === 'active') {
        setUsers(prev => prev.filter(u => u.user_id !== user.user_id));
      }

      // Re-fetch stats and close modal
      fetchStats();
      closeActionModal();
    } catch (err) {
      console.error('Error updating user status:', err);
      setErrorMsg('Failed to update account status. Please try again.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Users Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 transition-hover hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <UsersIcon size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Users</p>
            <p className="text-3xl font-black text-slate-800 mt-0.5">{stats.total.toLocaleString()}</p>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 transition-hover hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Active Accounts</p>
            <p className="text-3xl font-black text-emerald-600 mt-0.5">{stats.active.toLocaleString()}</p>
          </div>
        </div>

        {/* Suspended Users Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 transition-hover hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Suspended Accounts</p>
            <p className="text-3xl font-black text-rose-600 mt-0.5">{stats.suspended.toLocaleString()}</p>
          </div>
        </div>

      </div>

      {/* 2. Control bar (Tabs and Search) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Tabs */}
        <div className="flex bg-slate-50 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UsersIcon size={14} />
            All Users
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
              activeTab === 'all' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-600'
            }`}>
              {stats.total}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('suspended')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'suspended'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserX size={14} />
            Suspended
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
              activeTab === 'suspended' ? 'bg-rose-50 text-rose-700' : 'bg-slate-200 text-slate-600'
            }`}>
              {stats.suspended}
            </span>
          </button>
        </div>

        {/* Right Side: Search input */}
        <div className="relative md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder={`Search ${activeTab === 'suspended' ? 'suspended ' : ''}users...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
            >
              <X size={16} />
            </button>
          )}
        </div>

      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2.5 text-xs text-rose-800 font-medium leading-relaxed">
          <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* 3. Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {users.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400">
                <UsersIcon size={32} />
              </div>
              <p className="text-base font-bold text-slate-700">No Users Found</p>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                We couldn't find any users that fit your active tab filter or search query.
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 border-b border-emerald-600 hover:border-emerald-700 transition pb-0.5 cursor-pointer"
                >
                  Clear search filters
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">User Details</th>
                  <th className="py-4 px-6">Contact & School</th>
                  <th className="py-4 px-6">Wallet Balance</th>
                  <th className="py-4 px-6">Account Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map(u => {
                  const isSuspended = u.account_status === 'suspended';
                  const initials = u.full_name 
                    ? u.full_name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
                    : u.display_name ? u.display_name.charAt(0).toUpperCase() : 'U';

                  return (
                    <tr key={u.user_id} className="hover:bg-slate-50/50 transition-colors group">
                      
                      {/* User Details */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                            isSuspended ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {initials}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 leading-snug group-hover:text-slate-900 transition-colors">
                              {u.full_name || 'No Full Name'}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                              @{u.display_name || 'username'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact & School */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
                            <Phone size={12} className="text-slate-400" />
                            {u.phone || 'N/A'}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <School size={12} className="text-slate-400" />
                            {u.school || 'Unspecified Institution'}
                          </div>
                        </div>
                      </td>

                      {/* Wallet Balance */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <Wallet size={14} className="text-slate-400" />
                          <span>₦{(u.wallet_value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </td>

                      {/* Account Status Badge */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          isSuspended 
                            ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                          {isSuspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>

                      {/* Quick Action Button */}
                      <td className="py-4 px-6 text-right">
                        {isSuspended ? (
                          <button
                            onClick={() => openActionModal(u, 'active')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
                          >
                            <UserCheck size={12} />
                            Activate Account
                          </button>
                        ) : (
                          <button
                            onClick={() => openActionModal(u, 'suspended')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold text-rose-600 hover:bg-rose-50 active:scale-95 transition-all cursor-pointer"
                          >
                            <UserX size={12} />
                            Suspend User
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* 4. Infinite Scroll Sentinel / Lazy Load indicator */}
        {hasMore && (
          <div ref={sentinelRef} className="py-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium bg-slate-50/20">
            <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
            Loading more directory entries...
          </div>
        )}

        {!hasMore && users.length > 0 && (
          <div className="py-6 border-t border-slate-100 text-center text-[10px] font-semibold text-slate-400 tracking-wide uppercase bg-slate-50/20">
            End of user directory
          </div>
        )}
      </div>

      {/* 5. Suspension Confirmation Modal */}
      {actionModal.isOpen && actionModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-250 border border-slate-100">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className={`text-base font-bold flex items-center gap-2 ${
                actionModal.targetStatus === 'suspended' ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {actionModal.targetStatus === 'suspended' ? (
                  <>
                    <ShieldAlert size={20} />
                    Suspend User Account
                  </>
                ) : (
                  <>
                    <UserCheck size={20} />
                    Activate User Account
                  </>
                )}
              </h2>
              <button 
                onClick={closeActionModal} 
                disabled={isSubmittingAction}
                className="text-slate-400 hover:text-slate-700 transition disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              
              {/* Alert Warning Panel */}
              <div className={`p-4 rounded-xl text-xs leading-relaxed flex gap-3 items-start ${
                actionModal.targetStatus === 'suspended' 
                  ? 'bg-rose-50 text-rose-800' 
                  : 'bg-emerald-50 text-emerald-800'
              }`}>
                {actionModal.targetStatus === 'suspended' ? (
                  <UserX size={18} className="flex-shrink-0 mt-0.5 text-rose-600" />
                ) : (
                  <UserCheck size={18} className="flex-shrink-0 mt-0.5 text-emerald-600" />
                )}
                <p>
                  {actionModal.targetStatus === 'suspended' 
                    ? `Are you sure you want to suspend @${actionModal.user.display_name}? This user will lose access to buy or post items, make withdrawal requests, or update their credentials until their suspension is cleared by an admin.`
                    : `Are you sure you want to activate @${actionModal.user.display_name}? They will immediately regain full platform access, including posting new items, placing bids, and completing trades.`
                  }
                </p>
              </div>

              {/* User summary */}
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">User details</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">Full Name</span>
                  <span className="font-bold text-slate-800">{actionModal.user.full_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">Username</span>
                  <span className="font-bold text-slate-800">@{actionModal.user.display_name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">School</span>
                  <span className="font-bold text-slate-800 truncate max-w-[200px]">{actionModal.user.school || 'Unspecified'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={closeActionModal}
                  disabled={isSubmittingAction}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold text-xs transition cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleUpdateStatus}
                  disabled={isSubmittingAction}
                  className={`flex-1 px-4 py-2.5 text-white rounded-xl font-bold text-xs transition flex justify-center items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50 ${
                    actionModal.targetStatus === 'suspended' 
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/10' 
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/10'
                  }`}
                >
                  {isSubmittingAction ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : actionModal.targetStatus === 'suspended' ? (
                    <>
                      <UserX size={14} />
                      Confirm Suspend
                    </>
                  ) : (
                    <>
                      <UserCheck size={14} />
                      Confirm Activate
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
