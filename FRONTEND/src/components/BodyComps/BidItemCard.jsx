import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../AuthComps/CheckAuth';
import { Minus, Plus, Gavel, ShoppingCart, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import ImageViewer from './ImageViewer';
import Popup from '../GlobalComps/Popup';

export default function BidItemCard({ item, onRefresh, existingBid = null }) {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [activeAction, setActiveAction] = useState(null);

  const lowestBid = Math.round((80/100) * item.item_value); 

  // Pre-fill the state if editing
  const [desiredQty, setDesiredQty] = useState(existingBid ? existingBid.quantity : 1);
  const [bidAmount, setBidAmount] = useState(
    existingBid 
      ? (existingBid.total_amount / existingBid.quantity) // Calculate the per-item bid
      : lowestBid
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 
  const [imageError, setImageError] = useState(false); 
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  
  // Cleaned up the initial state to match your Popup props
  const [popupData, setPopupData] = useState({ show: false, feedback: '', content: ''});

  useEffect(() => {
    setImageError(false);
  }, [currentImageIndex]);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === item.image_url.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? item.image_url.length - 1 : prev - 1));
  };

  const handleIncreaseQty = () => {
    if (desiredQty < item.quantity_available) setDesiredQty(prev => prev + 1);
  };

  const handleDecreaseQty = () => {
    if (desiredQty > 1) setDesiredQty(prev => prev - 1);
  };

  const handleBidBlur = () => {
    if (bidAmount < lowestBid) {
      setBidAmount(lowestBid);
    }
  };

  const isBidValid = bidAmount >= lowestBid;
  const bidTotal = bidAmount * desiredQty;
  const buyNowTotal = item.item_value * desiredQty;

  const handleSendBid = async () => {
    if (!session?.user) {
      navigate('/login');
      return;
    }
    
    setActiveAction('bidding');

    const {data, error} = await supabase
      .from('all_items')
      .select('quantity_available')
      .eq('id', item.id)
      .single();

    if (error) {
      console.error("Error fetching item availability:", error);
      // Fixed: Now passing 'feedback' and 'content'
      setPopupData({ show: true, feedback: 'error', content: "An error occurred, please try again." });
      setActiveAction(null);
      return;
    }

    if (data.quantity_available < desiredQty) {
      setPopupData({
        show: true,
        feedback: 'error',
        content: `Only ${data.quantity_available} item(s) are available. Please adjust your quantity.`
      });
      setActiveAction(null);
      return;
    }
    
    try {
      let submitError;

      if (existingBid) {
        // Check if BOTH the total amount and the quantity are exactly the same
        if (existingBid.total_amount === bidTotal && existingBid.quantity === desiredQty) {
          
          setPopupData({ show: true, feedback: 'error', content: "The new offer can't be the same as the existing one." });
          setActiveAction(null);
          return;
          
        } else {
          const { error } = await supabase
            .from('bids')
            .update({
              quantity: desiredQty,
              total_amount: bidTotal,
              status: 'pending' // Resets status just in case
            })
            .eq('id', existingBid.id);
            
          submitError = error;
        }
      } else {
        // If new, INSERT a new row
        const { error } = await supabase
          .from('bids')
          .insert([{
            seller_id: item.user_id, 
            buyer_id: session.user.id, 
            item_id: item.id,
            quantity: desiredQty,
            total_amount: bidTotal, 
            status: 'pending' 
          }]);
        submitError = error;
      }

      if (submitError) throw submitError;
      
      console.log(`Successfully placed bid for ₦${bidTotal.toLocaleString()}`);
      setPopupData({ show: true, feedback: 'success', content: existingBid ? "Bid updated successfully!" : "Your bid has been placed!" });
      
      // Delay to let them read the success message
      setTimeout(() => {
          if (onRefresh) onRefresh();
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting bid:", error);
      setPopupData({ show: true, feedback: 'error', content: "Failed to place bid." });
    } finally {
      setActiveAction(null);
    }
  };

  // const handleBuyNow = async () => {
  //   if (!session?.user) {
  //     navigate('/login');
  //     return;
  //   }

  //   setActiveAction('buying');

  //   // 1. Fetch current availability
  //   const { data, error } = await supabase
  //     .from('all_items')
  //     .select('quantity_available')
  //     .eq('id', item.id)
  //     .single();

  //   if (error) {
  //     console.error("Error fetching item availability:", error);
  //     setPopupData({ show: true, feedback: 'error', content: "An error occurred, please try again." });
  //     setActiveAction(null);
  //     return;
  //   }

  //   // Safety check: ensure data exists and has enough stock
  //   if (!data || data.quantity_available < desiredQty) {
  //     setPopupData({
  //       show: true,
  //       feedback: 'error',
  //       content: `Only ${data?.quantity_available || 0} item(s) are available. Please adjust your quantity.`
  //     });
  //     setActiveAction(null);
  //     return;
  //   }

  //   const newQuantity = data.quantity_available - desiredQty;

  //   try {
  //     // 2. Simulate Paystack Payment Delay
  //     await new Promise(resolve => setTimeout(resolve, 1500));
  //     const paystackPaymentSuccessful = true; // We will replace this with real Paystack later

  //     if (paystackPaymentSuccessful) {
        
  //       // 3. Update Item Inventory
  //       const updatePayload = { quantity_available: newQuantity };
  //       if (newQuantity === 0) {
  //         updatePayload.status = 'sold';
  //       }

  //       const { error: updateError } = await supabase
  //         .from('all_items')
  //         .update(updatePayload)
  //         .eq('id', item.id);

  //       if (updateError) throw updateError;

  //       // 4. Create the "Paid" Bid Record
  //       const { error: insertError, data: insertedBid } = await supabase
  //         .from('bids')
  //         .insert([{
  //           seller_id: item.user_id,
  //           buyer_id: session.user.id,
  //           item_id: item.id,
  //           quantity: desiredQty,
  //           total_amount: buyNowTotal, 
  //           status: 'paid' 
  //         }])
  //         .select('id') 
  //         .single();

  //       if (insertError) throw insertError;

  //       // 5. Create the "Pending" Pickup Record
  //       const { error: insertPickupError } = await supabase
  //         .from('pickups')
  //         .insert([{
  //           item_id: item.id,
  //           bid_id: insertedBid.id,
  //           buyer_id: session.user.id,
  //           seller_id: item.user_id,
  //           quantity: desiredQty,
  //           total_amount: buyNowTotal,
  //           status: 'pending'
  //         }]);

  //       if (insertPickupError) throw insertPickupError;

  //       console.log(`Successfully bought ${item.item_name}!`);
        
  //       setPopupData({ show: true, feedback: 'success', content: "Purchase completed successfully!" });

  //       // 6. Refresh the UI
  //       setTimeout(() => {
  //         if (onRefresh) onRefresh(newQuantity, newQuantity === 0 ? 'sold' : item.status);
  //       }, 2000);
  //     }
  //   } catch (error) {
  //     console.error("Error processing purchase:", error);
  //     setPopupData({ show: true, feedback: 'error', content: "Failed to process purchase." });
  //   } finally {
  //     setActiveAction(null);
  //   }
  // };

  const handleBuyNow = async () => {
    if (!session?.user) {
      navigate('/login');
      return;
    }

    setActiveAction('buying');

    try {
      // 1. Simulate Paystack Payment Delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const paystackPaymentSuccessful = true; // Replace with real Paystack later

      if (paystackPaymentSuccessful) {
        
        // 2. Call the Atomic Database Transaction
        const { data: result, error: rpcError } = await supabase.rpc('process_buy_now', {
            p_item_id: item.id,
            p_buyer_id: session.user.id,
            p_seller_id: item.user_id,
            p_quantity: desiredQty,
            p_total_amount: buyNowTotal
        });

        if (rpcError) {
             // This will catch the custom RAISE EXCEPTION messages from our SQL!
            throw new Error(rpcError.message || "Database transaction failed");
        }

        console.log(`Successfully bought ${item.item_name}!`);
        setPopupData({ show: true, feedback: 'success', content: "Purchase completed successfully!" });

        // 3. Refresh the UI using the data returned securely from Postgres
        setTimeout(() => {
          if (onRefresh) {
            onRefresh(result.new_quantity, result.new_status);
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Error processing purchase:", error);
      
      // We can display the specific SQL error message to the user if stock ran out
      setPopupData({ 
          show: true, 
          feedback: 'error', 
          content: error.message.includes('Insufficient stock') 
              ? error.message 
              : "Failed to process purchase. Please try again." 
      });
    } finally {
      setActiveAction(null);
    }
  };
  
  const hasImages = item.image_url && item.image_url.length > 0;

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-shadow hover:shadow-lg">
      
      {/* Fixed: Pass popupData.content instead of popupData.message */}
      {popupData.show && (
        <Popup 
          feedback={popupData.feedback}
          content={popupData.content}
          onClose={() => setPopupData({show: false, feedback: "", content: ""})}
        />
      )}

      {/* Product Image Carousel */}
      <div className="relative h-48 overflow-hidden bg-gray-100 group">
        
        {imageError || !hasImages ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
            <ImageOff size={40} className="mb-2 opacity-50" />
            <span className="text-xs font-semibold">Image not available</span>
          </div>
        ) : (
          <img 
            src={item.image_url[currentImageIndex]} 
            alt={`${item.item_name} preview`} 
            onError={() => setImageError(true)} 
            onClick={() => setIsViewerOpen(true)} 
            className="w-full h-full object-cover transition-opacity duration-300 cursor-pointer hover:opacity-90"
          />
        )}

        {hasImages && item.image_url.length > 1 && (
          <>
            <button 
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white text-gray-700 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>

            <button 
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white text-gray-700 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all active:scale-95"
            >
              <ChevronRight size={18} />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-sm">
              {currentImageIndex + 1} / {item.image_url.length}
            </div>
          </>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {/* Header Info */}
        <h3 className="text-lg font-bold text-gray-900 truncate mb-1">
          {item.item_name}
        </h3>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            Available: <span className="font-bold text-gray-700">{item.quantity_available}</span>
          </p>
          <p className="text-base font-bold text-green-600">
            Asking: ₦{item.item_value.toLocaleString()}
          </p>
        </div>

        <hr className="border-gray-100 mb-4" />

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">Quantity:</span>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button 
              onClick={handleDecreaseQty} 
              disabled={desiredQty <= 1}
              className="p-1 text-gray-600 hover:text-red-600 disabled:opacity-30 disabled:hover:text-gray-600 transition-colors"
            >
              <Minus size={18} />
            </button>
            <span className="px-4 min-w-[40px] text-center font-bold text-gray-800">
              {desiredQty}
            </span>
            <button 
              onClick={handleIncreaseQty} 
              disabled={desiredQty >= item.quantity_available}
              className="p-1 text-gray-600 hover:text-green-600 disabled:opacity-30 disabled:hover:text-gray-600 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Bid Input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Your Bid (₦)</label>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            onBlur={handleBidBlur}
            min={lowestBid}
            className={`w-full p-2.5 bg-gray-50 border rounded-lg text-sm outline-none transition-all
              ${!isBidValid 
                ? 'border-red-400 focus:ring-2 focus:ring-red-100' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50'}`}
          />
          {!isBidValid && (
            <p className="text-xs text-red-500 mt-1 ml-1">Min bid is ₦{lowestBid.toLocaleString()}</p>
          )}
        </div>

        {/* Totals Display */}
        <div className="bg-blue-50 p-3 rounded-xl mb-6 text-center">
          <p className="text-xs text-blue-600 mb-1">
            Total for {desiredQty} item(s) at ₦{bidAmount.toLocaleString()}:
          </p>
          <p className="text-xl font-black text-blue-700">
            ₦{bidTotal.toLocaleString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto space-y-2">
          <button 
            onClick={handleSendBid}
            // Fixed: Restored the !isBidValid check so users can't submit invalid bids
            disabled={!isBidValid || activeAction !== null}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Gavel size={20} />
            {activeAction === 'bidding' ? "Sending Bid..." : "Submit Bid"}
          </button>
          
          <button 
            onClick={handleBuyNow}
            disabled={activeAction !== null}
            className="w-full flex items-center justify-center gap-2 border-2 border-green-600 text-green-600 hover:bg-green-50 disabled:opacity-50 font-bold py-3 rounded-xl transition-all active:scale-95"
          >
            <ShoppingCart size={20} />
            {activeAction === 'buying' ? "Processing Payment..." : `Buy Now (₦${buyNowTotal.toLocaleString()})`}
          </button>
        </div>
      </div>
      
      {isViewerOpen && hasImages && (
        <ImageViewer 
          images={item.image_url} 
          initialIndex={currentImageIndex} 
          onClose={() => setIsViewerOpen(false)} 
        />
      )}
    </div>
  );
}