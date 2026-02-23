import React, { useState } from 'react';
import { Minus, Plus, Gavel, ShoppingCart } from 'lucide-react';

export default function BidItemCard({ item }) {
  const lowestBid = ((80/100) * item.askingPrice).toFixed(2); // 80% of asking price as minimum bid

  const [desiredQty, setDesiredQty] = useState(1);
  const [bidAmount, setBidAmount] = useState(lowestBid);

  // Handlers for Quantity
  const handleIncreaseQty = () => {
    if (desiredQty < item.availableQty) setDesiredQty(prev => prev + 1);
  };

  const handleDecreaseQty = () => {
    if (desiredQty > 1) setDesiredQty(prev => prev - 1);
  };

  // Ensure bid doesn't fall below asking price on blur
  const handleBidBlur = () => {
    if (bidAmount < lowestBid) {
      setBidAmount(lowestBid);
    }
  };

  // Calculations
  const isBidValid = bidAmount >= lowestBid;
  const bidTotal = bidAmount * desiredQty;
  const buyNowTotal = item.askingPrice * desiredQty;

  // Action Handlers
  const handleSendBid = () => {
    if (!isBidValid) return;
    console.log(`Sent bid for ${item.name}: $${bidAmount} x ${desiredQty} = $${bidTotal}`);
  };

  const handleBuyNow = () => {
    console.log(`Bought ${item.name} instantly: ₦${item.askingPrice} x ${desiredQty} = ₦${buyNowTotal}`);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-shadow hover:shadow-lg">
      {/* Product Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {/* Header Info */}
        <h3 className="text-lg font-bold text-gray-900 truncate mb-1">
          {item.name}
        </h3>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            Available: <span className="font-bold text-gray-700">{item.availableQty}</span>
          </p>
          <p className="text-base font-bold text-green-600">
            Asking: ₦{item.askingPrice.toLocaleString()}
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
              disabled={desiredQty >= item.availableQty}
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
            <p className="text-xs text-red-500 mt-1 ml-1">Min bid is ₦{lowestBid}</p>
          )}
        </div>

        {/* Totals Display */}
        <div className="bg-blue-50 p-3 rounded-xl mb-6 text-center">
          <p className="text-xs text-blue-600 mb-1">
            Total for {desiredQty} item(s) at ₦{bidAmount}:
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
    </div>
  );
}