import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Nav from '../components/Nav/Nav';
import BouncingLoader from '../components/GlobalComps/BouncingLoader';
import { ArrowLeft, Star, GraduationCap, MessageSquare, User } from 'lucide-react';

// ─── Star display helper ──────────────────────────────────────────────────────
function StarRow({ value, max = 5, size = 16, interactive = false, onSelect, hovered, onHover }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <Star
          key={star}
          size={size}
          onClick={() => interactive && onSelect?.(star)}
          onMouseEnter={() => interactive && onHover?.(star)}
          onMouseLeave={() => interactive && onHover?.(0)}
          className={`transition-colors ${star <= (interactive ? (hovered || value) : value)
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-100 text-gray-200'
            } ${interactive ? 'cursor-pointer hover:scale-110' : ''}`}
        />
      ))}
    </div>
  );
}

// ─── Rating bar (breakdown chart) ────────────────────────────────────────────
function RatingBar({ label, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-4 text-right text-gray-600 font-medium shrink-0">{label}</span>
      <Star size={12} className="fill-yellow-400 text-yellow-400 shrink-0" />
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full bg-yellow-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-gray-500 text-xs shrink-0">{count}</span>
    </div>
  );
}

// ─── Individual review card ───────────────────────────────────────────────────
function ReviewCard({ review }) {
  const initials = review.buyer?.display_name
    ? review.buyer.display_name.charAt(0).toUpperCase()
    : '?';

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">
              {review.buyer?.display_name || 'Anonymous'}
            </p>
            <p className="text-xs text-gray-400">{timeAgo(review.created_at)}</p>
          </div>
        </div>
        <StarRow value={review.rating} size={14} />
      </div>

      {review.feedback ? (
        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
          "{review.feedback}"
        </p>
      ) : (
        <p className="text-xs text-gray-400 italic">No written review.</p>
      )}

      {(review.item_id !== undefined && review.item_id !== null) && (
        <p className="text-xs text-gray-400 mt-3">
          For:{' '}
          {review.item?.item_name && review.item_id !== 0 ? (
            <span className="font-medium text-gray-500">{review.item.item_name}</span>
          ) : (
            <span className="font-medium text-red-400 italic">[Deleted]</span>
          )}
        </p>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SellerReviews() {
  const { sellerId } = useParams();
  const navigate = useNavigate();

  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRating, setFilterRating] = useState(0); // 0 = all

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      // Fetch seller info
      const { data: sellerData, error: sellerError } = await supabase
        .from('users_info')
        .select('display_name, full_name, school, uni_email, rating_average, total_reviews')
        .eq('user_id', sellerId)
        .single();

      if (sellerError || !sellerData) {
        console.error('Error fetching seller:', sellerError);
        setIsLoading(false);
        return;
      }

      setSeller(sellerData);

      // Fetch reviews
      const { data: reviewData, error: reviewError } = await supabase
        .from('seller_reviews')
        .select(`
          id,
          rating,
          feedback,
          created_at,
          buyer:users_info!seller_reviews_buyer_id_fkey(display_name),
          item:all_items(item_name)
        `)
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (reviewError) {
        console.error('Error fetching reviews:', reviewError);
      } else {
        setReviews(reviewData || []);
      }

      setIsLoading(false);
    };

    if (sellerId) load();
  }, [sellerId]);

  if (isLoading) return <BouncingLoader />;

  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Nav />
        <p className="text-gray-500 text-lg mt-20">Seller not found.</p>
      </div>
    );
  }

  // ── Derived stats ────────────────────────────────────────────────────────
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const displayed = filterRating === 0
    ? reviews
    : reviews.filter((r) => r.rating === filterRating);

  const ratingLabel = (avg) => {
    if (avg >= 4.5) return { text: 'Excellent', color: 'text-green-600' };
    if (avg >= 3.5) return { text: 'Good', color: 'text-blue-600' };
    if (avg >= 2.5) return { text: 'Average', color: 'text-yellow-600' };
    return { text: 'Poor', color: 'text-red-500' };
  };

  const label = avgRating > 0 ? ratingLabel(avgRating) : null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 sm:pb-12">
      <Nav />

      <main className="max-w-3xl mx-auto px-4 pt-6 sm:pt-24">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 font-medium text-sm"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* ── Seller Hero Card ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-blue-500 text-white flex items-center justify-center font-black text-xl shrink-0">
              {seller.display_name?.charAt(0).toUpperCase() ?? <User size={24} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-lg font-black text-gray-900 truncate">
                  {seller.display_name || 'Unknown Seller'}
                </h1>
                {seller.uni_email && (
                  <GraduationCap size={18} className="text-green-500 shrink-0" title="Verified university email" />
                )}
              </div>
              {seller.school && (
                <p className="text-xs text-gray-500 mt-0.5">{seller.school}</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Rating Summary Card ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          {totalReviews === 0 ? (
            <div className="text-center py-6">
              <MessageSquare size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No reviews yet</p>
              <p className="text-sm text-gray-400 mt-1">This seller hasn't received any reviews.</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">

              {/* Big score */}
              <div className="text-center shrink-0">
                <p className="text-6xl font-black text-gray-900 leading-none">
                  {avgRating.toFixed(1)}
                </p>
                <StarRow value={Math.round(avgRating)} size={20} />
                {label && (
                  <p className={`text-sm font-bold mt-1 ${label.color}`}>{label.text}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>

              {/* Breakdown bars */}
              <div className="flex-1 w-full space-y-2">
                {breakdown.map(({ star, count }) => (
                  <button
                    key={star}
                    onClick={() => setFilterRating(filterRating === star ? 0 : star)}
                    className={`w-full text-left transition-opacity ${filterRating !== 0 && filterRating !== star ? 'opacity-40' : 'opacity-100'}`}
                  >
                    <RatingBar label={star} count={count} total={totalReviews} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Filter chips ─────────────────────────────────────────────── */}
        {totalReviews > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            <button
              onClick={() => setFilterRating(0)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${filterRating === 0
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              if (count === 0) return null;
              return (
                <button
                  key={star}
                  onClick={() => setFilterRating(filterRating === star ? 0 : star)}
                  className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${filterRating === star
                      ? 'bg-yellow-400 text-gray-900 border-yellow-400'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-yellow-300'
                    }`}
                >
                  <Star size={12} className="fill-current" />
                  {star}
                  <span className="text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Reviews list ─────────────────────────────────────────────── */}
        <div className="space-y-4">
          {displayed.length === 0 && totalReviews > 0 && (
            <p className="text-center text-gray-400 py-10 text-sm">
              No reviews for this rating.
            </p>
          )}
          {displayed.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

      </main>
    </div>
  );
}
