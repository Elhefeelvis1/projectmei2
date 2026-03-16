import React, { useState, useEffect } from 'react';
import { Minus, Plus, Gavel, ShoppingCart, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import ImageViewer from './ImageViewer';

export default function BidItemCard({ item }) {
  // Using item.item_value instead of askingPrice
  const lowestBid = Math.round((80/100) * item.item_value); 

  const [desiredQty, setDesiredQty] = useState(1);
  const [bidAmount, setBidAmount] = useState(lowestBid);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 
  const [imageError, setImageError] = useState(false); 
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [currentImageIndex]);

  // Image Navigation Handlers using image_url
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === item.image_url.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? item.image_url.length - 1 : prev - 1));
  };

  // Handlers for Quantity using quantity_available
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

  // Calculations
  const isBidValid = bidAmount >= lowestBid;
  const bidTotal = bidAmount * desiredQty;
  const buyNowTotal = item.item_value * desiredQty;

  // Action Handlers using item_name
  const handleSendBid = () => {
    if (!isBidValid) return;
    console.log(`Sent bid for ${item.item_name}: ₦${bidAmount} x ${desiredQty} = ₦${bidTotal}`);
  };

  const handleBuyNow = () => {
    console.log(`Bought ${item.item_name} instantly: ₦${item.item_value} x ${desiredQty} = ₦${buyNowTotal}`);
  };

  // Fallback for when there are no images at all
  const hasImages = item.image_url && item.image_url.length > 0;

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-shadow hover:shadow-lg">
      
      {/* Product Image Carousel */}
      <div className="relative h-48 overflow-hidden bg-gray-100 group">
        
        {/* The Fallback UI vs The Actual Image */}
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

        {/* Only show controls if there is more than 1 image */}
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
            disabled={!isBidValid}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Gavel size={20} />
            Submit Bid
          </button>
          
          <button 
            onClick={handleBuyNow}
            className="w-full flex items-center justify-center gap-2 border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold py-3 rounded-xl transition-all active:scale-95"
          >
            <ShoppingCart size={20} />
            Buy Now (₦{buyNowTotal.toLocaleString()})
          </button>
        </div>
      </div>
      {/* Render the Fullscreen Viewer if the user clicked the image */}
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