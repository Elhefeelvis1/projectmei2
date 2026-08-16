import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../components/AuthComps/CheckAuth';
import Nav from '../components/Nav/Nav';
import Popup from '../components/GlobalComps/Popup';
import { Star, ArrowLeft, Loader2, Send } from 'lucide-react';

export default function ReviewSeller() {
  const { pickupId } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pickupData, setPickupData] = useState(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    const fetchPickupDetails = async () => {
      if (!session?.user) return;

      setIsLoading(true);

      // Check if already reviewed
      const { data: existingReview } = await supabase
        .from('seller_reviews')
        .select('id')
        .eq('pickup_id', pickupId)
        .eq('buyer_id', session.user.id)
        .single();

      if (existingReview) {
        setPopup({ show: true, type: 'error', message: 'You have already reviewed this transaction.' });
        setTimeout(() => navigate('/pickups'), 2000);
        return;
      }

      // Fetch pickup info
      const { data, error } = await supabase
        .from('pickups')
        .select(`
          *,
          item:all_items(item_name),
          seller:users_info!pickups_seller_id_fkey(display_name)
        `)
        .eq('id', pickupId)
        .eq('buyer_id', session.user.id)
        .single();

      if (error || !data) {
        console.error("Error fetching pickup:", error);
        setPopup({ show: true, type: 'error', message: 'Pickup not found or unauthorized.' });
      } else if (data.status !== 'accepted') {
        setPopup({ show: true, type: 'error', message: 'You can only review completed pickups.' });
      } else {
        setPickupData(data);
      }
      setIsLoading(false);
    };

    fetchPickupDetails();
  }, [pickupId, session, navigate]);

  const handleFeedbackChange = (e) => {
    const text = e.target.value;
    if (text.length <= 300) {
      setFeedback(text);
    }
  };

  const wordCount = feedback.trim() ? feedback.trim().split(/\s+/).length : 0;
  const isOverWordLimit = wordCount > 50;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setPopup({ show: true, type: 'error', message: 'Please select a star rating.' });
      return;
    }
    if (isOverWordLimit) {
      setPopup({ show: true, type: 'error', message: 'Feedback must be 50 words or less.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('seller_reviews')
        .insert({
          seller_id: pickupData.seller_id,
          buyer_id: session.user.id,
          pickup_id: pickupData.id,
          item_id: pickupData.item_id,  // stored now, FK to all_items added later
          rating,
          feedback: feedback.trim()
        });

      if (error) throw error;

      setPopup({ show: true, type: 'success', message: 'Review submitted successfully!' });

      setTimeout(() => navigate('/pickups'), 2000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setPopup({ show: true, type: 'error', message: 'Failed to submit review. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Nav />
      {popup.show && (
        <Popup feedback={popup.type} content={popup.message} onClose={() => setPopup({ show: false, type: '', message: '' })} />
      )}

      <main className="max-w-xl mx-auto px-4 pt-6 sm:pt-24 sm:pb-12 pb-24">
        <button
          onClick={() => navigate('/pickups')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 font-medium"
        >
          <ArrowLeft size={18} /> Back to Pickups
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : pickupData ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Rate your experience</h1>
                <p className="text-gray-500">
                  How was your transaction with <span className="font-semibold text-gray-900">{pickupData.seller?.display_name || 'the seller'}</span> for <span className="font-semibold text-gray-900">{pickupData.item?.item_name}</span>?
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Star Rating */}
                <div className="flex justify-center gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-2 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        size={40}
                        className={`transition-colors ${star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-100 text-gray-200'
                          }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Feedback Textarea */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leave a comment (optional)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={handleFeedbackChange}
                    placeholder="Describe your experience with this seller..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none h-32 transition-colors bg-gray-50 hover:bg-white focus:bg-white"
                  />
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <span className={`${isOverWordLimit ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                      {wordCount} / 50 words
                    </span>
                    <span className="text-gray-400">
                      {feedback.length} / 300 chars
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={rating === 0 || isOverWordLimit || isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <Send size={18} />
                      Submit Review
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Unable to load pickup details.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
