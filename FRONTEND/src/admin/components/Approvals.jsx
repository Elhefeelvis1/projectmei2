import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  RefreshCw, 
  AlertCircle, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  Calendar, 
  X, 
  ShieldAlert, 
  User, 
  Package,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Tag,
  Layers,
  Image as ImageIcon,
  ExternalLink,
  Eye
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { supabaseAdmin } from '../supabaseAdmin';

export default function Approvals({ items }) {
  const [pendingItems, setPendingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Modal State
  const [activeModal, setActiveModal] = useState({
    show: false,
    mode: 'approve', // 'approve' or 'reject'
    item: null
  });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to extract image URLs cleanly
  const getItemImages = (item) => {
    if (!item) return [];
    if (Array.isArray(item.image_url)) {
      return item.image_url.filter(Boolean);
    }
    if (typeof item.image_url === 'string') {
      try {
        const parsed = JSON.parse(item.image_url);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
        return [item.image_url];
      } catch {
        return [item.image_url];
      }
    }
    if (Array.isArray(item.images)) {
      return item.images.filter(Boolean);
    }
    return [];
  };

  // Hydrate local state from prop on mount/change
  useEffect(() => {
    if (items) {
      setPendingItems(items);
    }
  }, [items]);

  // Fetch pending items from supabase with seller info
  const fetchPendingApprovals = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const { data, error } = await supabase
        .from('all_items')
        .select('*, users_info(user_id, display_name, full_name, school)')
        .eq('status', 'reviewing')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingItems(data || []);
    } catch (err) {
      console.error('Error fetching approvals data:', err);
      setErrorMessage('Failed to fetch pending items under review. Please try reloading.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run the full fetch with joined seller info once on mount to replace any incomplete dashboard prop data
  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const handleOpenReview = (item, defaultMode = 'approve') => {
    setActiveImageIndex(0);
    setActiveModal({ show: true, mode: defaultMode, item });
  };

  const handleCloseModal = () => {
    setActiveModal({ show: false, mode: 'approve', item: null });
    setActiveImageIndex(0);
  };

  const handleConfirmAction = async (forcedMode) => {
    const modeToUse = forcedMode || activeModal.mode;
    const item = activeModal.item;
    if (!item) return;

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const nextStatus = modeToUse === 'approve' ? 'approved' : 'rejected';
      // Use admin client to bypass RLS for status updates
      const { error } = await supabaseAdmin
        .from('all_items')
        .update({ status: nextStatus })
        .eq('id', item.id);

      if (error) throw error;

      // Update local state instantly
      setPendingItems(prev => prev.filter(i => i.id !== item.id));
      handleCloseModal();
    } catch (err) {
      console.error('Error processing item review status:', err);
      setErrorMessage(`Failed to ${modeToUse} item. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col p-4 sm:p-6 space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b pb-4 border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <CheckSquare className="text-green-500" size={22} />
            Pending Item Approvals
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Review listing details and photos before approving submissions.
          </p>
        </div>
        <button
          onClick={fetchPendingApprovals}
          disabled={isLoading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Reload List
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2.5 text-sm text-rose-800 font-medium leading-relaxed">
          <AlertCircle size={18} className="text-rose-600 shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Main Table view */}
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
            <p className="text-sm font-semibold text-slate-500">Loading pending items...</p>
          </div>
        ) : pendingItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400">
              <CheckSquare size={32} />
            </div>
            <p className="text-base font-bold text-slate-700">No Pending Approvals</p>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Excellent work! All marketplace item submissions have been fully reviewed.
            </p>
            <button
              onClick={fetchPendingApprovals}
              className="mt-2 text-xs font-bold text-green-600 hover:text-green-700 border-b border-green-600 hover:border-green-700 transition pb-0.5 cursor-pointer"
            >
              Check for new items
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Item Details</th>
                <th className="py-3 px-4 sm:px-6">Price</th>
                <th className="py-3 px-4 sm:px-6">Seller Details</th>
                <th className="py-3 px-4 sm:px-6">Category / Condition</th>
                <th className="py-3 px-4 sm:px-6">Date Submitted</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {pendingItems.map(item => {
                const sellerName = item.users_info?.full_name || item.users_info?.display_name || item.seller || 'Unknown Seller';
                const sellerUser = item.users_info?.display_name ? `@${item.users_info.display_name}` : 'N/A';
                const schoolName = item.users_info?.school || 'Unspecified school';
                const formattedDate = new Date(item.created_at).toLocaleDateString(undefined, { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                });
                const imagesList = getItemImages(item);
                const thumbnail = imagesList[0];

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Item details */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-400 shrink-0 relative group">
                          {thumbnail ? (
                            <img
                              src={thumbnail}
                              alt={item.item_name || 'Item'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package size={22} />
                          )}
                          {imagesList.length > 1 && (
                            <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[9px] px-1 rounded-tl-sm font-semibold">
                              +{imagesList.length - 1}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <button
                            onClick={() => handleOpenReview(item, 'approve')}
                            className="text-xs font-bold text-slate-800 hover:text-green-600 text-left transition-colors truncate max-w-[200px] block cursor-pointer"
                          >
                            {item.item_name || item.title || 'Untitled Item'}
                          </button>
                          <p className="text-[10px] text-slate-400 mt-0.5">ID: {item.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 sm:px-6">
                      <span className="text-xs font-bold text-slate-900 bg-green-50 text-green-700 px-2.5 py-1 rounded-lg border border-green-200/50 inline-block">
                        ₦{(item.item_value || item.price || 0).toLocaleString()}
                      </span>
                    </td>

                    {/* Seller details */}
                    <td className="py-4 px-4 sm:px-6">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{sellerName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium truncate max-w-[150px]">
                          {sellerUser} • {schoolName}
                        </p>
                      </div>
                    </td>

                    {/* Category & Condition */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex flex-col gap-1 text-[11px]">
                        <span className="text-slate-700 font-medium capitalize truncate max-w-[140px]">
                          {item.category?.replace(/-/g, ' ') || 'General'}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 w-fit capitalize">
                          {item.condition?.replace(/-/g, ' ') || 'Used'}
                        </span>
                      </div>
                    </td>

                    {/* Date Submitted */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{formattedDate}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenReview(item, 'approve')}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 active:scale-95 cursor-pointer shadow-xs"
                          title="Review Full Details"
                        >
                          <Eye size={14} />
                          <span>Review</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Comprehensive Item Review & Approval Modal */}
      {activeModal.show && activeModal.item && (() => {
        const item = activeModal.item;
        const imagesList = getItemImages(item);
        const sellerName = item.users_info?.full_name || item.users_info?.display_name || item.seller || 'Unknown Seller';
        const sellerUser = item.users_info?.display_name ? `@${item.users_info.display_name}` : 'N/A';
        const schoolName = item.users_info?.school || 'Unspecified school';
        const formattedDate = new Date(item.created_at).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        const handlePrevImage = () => {
          setActiveImageIndex(prev => (prev === 0 ? imagesList.length - 1 : prev - 1));
        };

        const handleNextImage = () => {
          setActiveImageIndex(prev => (prev === imagesList.length - 1 ? 0 : prev + 1));
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
              
              {/* Modal Top Bar */}
              <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold">
                    <CheckSquare size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800 leading-tight">
                      Review Item Listing
                    </h2>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Item ID: {item.id}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleCloseModal} 
                  disabled={isSubmitting}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
                  aria-label="Close review modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                
                {/* 1. Images Gallery Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon size={14} />
                      Listing Photos ({imagesList.length})
                    </span>
                    {imagesList.length > 0 && (
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {activeImageIndex + 1} of {imagesList.length}
                      </span>
                    )}
                  </div>

                  {imagesList.length > 0 ? (
                    <div className="space-y-3">
                      {/* Main Featured Photo Box */}
                      <div className="relative w-full h-64 sm:h-80 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200 shadow-inner group">
                        <img
                          src={imagesList[activeImageIndex]}
                          alt={`${item.item_name || 'Item'} photo ${activeImageIndex + 1}`}
                          className="max-h-full max-w-full object-contain select-none"
                        />

                        {/* Navigation Arrows (if multiple photos) */}
                        {imagesList.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={handlePrevImage}
                              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition active:scale-95"
                              aria-label="Previous photo"
                            >
                              <ChevronLeft size={20} />
                            </button>
                            <button
                              type="button"
                              onClick={handleNextImage}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition active:scale-95"
                              aria-label="Next photo"
                            >
                              <ChevronRight size={20} />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Thumbnail Strip */}
                      {imagesList.length > 1 && (
                        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5">
                          {imagesList.map((imgUrl, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setActiveImageIndex(index)}
                              className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                                index === activeImageIndex
                                  ? 'border-green-500 ring-2 ring-green-500/20 shadow-xs scale-105'
                                  : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-44 rounded-2xl bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 gap-2">
                      <ImageIcon size={32} />
                      <p className="text-xs font-semibold">No images provided for this listing</p>
                    </div>
                  )}
                </div>

                {/* 2. Key Listing Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Left Column: Item Specifications */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Item Specifications
                    </p>
                    
                    <div>
                      <span className="text-xs text-slate-500 font-medium">Item Title</span>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        {item.item_name || item.title || 'Untitled'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Tag size={13} className="text-slate-400" /> Price:
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        ₦{(item.item_value || item.price || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Layers size={13} className="text-slate-400" /> Category:
                      </span>
                      <span className="font-semibold text-slate-800 capitalize">
                        {item.category?.replace(/-/g, ' ') || 'Uncategorized'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <CheckCircle size={13} className="text-slate-400" /> Condition:
                      </span>
                      <span className="font-semibold text-slate-800 capitalize">
                        {item.condition?.replace(/-/g, ' ') || 'Not specified'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Package size={13} className="text-slate-400" /> Quantity Available:
                      </span>
                      <span className="font-bold text-slate-800">
                        {item.quantity_available ?? item.initial_qty ?? 1} units
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Seller & Submission Details */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Seller Information
                      </p>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 font-bold flex items-center justify-center border border-green-200 shrink-0 text-sm">
                          {sellerName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{sellerName}</p>
                          <p className="text-xs text-slate-500 font-medium truncate">{sellerUser}</p>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <GraduationCap size={14} className="text-slate-400" /> School:
                          </span>
                          <span className="font-semibold text-slate-800 text-right truncate max-w-[140px]">
                            {schoolName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <Calendar size={14} className="text-slate-400" /> Submitted:
                          </span>
                          <span className="font-semibold text-slate-800">
                            {formattedDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/50 w-full justify-center font-medium">
                        <ShieldAlert size={13} className="text-amber-600" /> Status: Pending Review
                      </span>
                    </div>
                  </div>

                </div>

                {/* 3. Description Section */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Item Description
                  </label>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                    {item.description ? item.description : (
                      <span className="text-slate-400 italic">No description provided by the seller.</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Modal Footer / Action Buttons */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 font-bold text-xs transition cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  Close & Back
                </button>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  {/* Reject Button */}
                  <button 
                    type="button" 
                    onClick={() => handleConfirmAction('reject')}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl font-bold text-xs transition flex justify-center items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting && activeModal.mode === 'reject' ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <XCircle size={15} />
                        Reject Listing
                      </>
                    )}
                  </button>

                  {/* Approve Button */}
                  <button 
                    type="button" 
                    onClick={() => handleConfirmAction('approve')}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition flex justify-center items-center gap-1.5 cursor-pointer active:scale-95 shadow-md shadow-emerald-600/10 disabled:opacity-50"
                  >
                    {isSubmitting && activeModal.mode === 'approve' ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <CheckCircle size={15} />
                        Approve Listing
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}