import React, { useState } from 'react';
import Nav from "../components/GlobalComps/Nav.jsx";
import { Search } from 'lucide-react'; // Replacing MUI SearchIcon with Lucide
import BidItemCard from '../components/BodyComps/BidItemCard';

// Dummy data remains unchanged
const dummyItems = [
  { id: 1, name: "Industrial Espresso Machine", category: "Appliances", image: "https://via.placeholder.com/300x200?text=Espresso+Machine", availableQty: 3, askingPrice: 1200 },
  { id: 2, name: "Herman Miller Office Chair", category: "Furniture", image: "https://via.placeholder.com/300x200?text=Office+Chair", availableQty: 10, askingPrice: 850 },
  { id: 3, name: "MacBook Pro M3 Max", category: "Electronics", image: "https://via.placeholder.com/300x200?text=MacBook+Pro", availableQty: 5, askingPrice: 3200 },
  { id: 4, name: "Vintage Persian Rug", category: "Decor", image: "https://via.placeholder.com/300x200?text=Persian+Rug", availableQty: 1, askingPrice: 2500 },
];

export default function ItemListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Filter logic remains the same
  const filteredItems = dummyItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-100 min-h-screen pb-12">
      <Nav />
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Live Auctions & Bidding
        </h1>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search items..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter Select */}
          <div className="w-full sm:w-56">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Appliances">Appliances</option>
              <option value="Furniture">Furniture</option>
              <option value="Electronics">Electronics</option>
              <option value="Decor">Decor</option>
            </select>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className="h-full">
                <BidItemCard item={item} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-xl font-medium text-gray-500 italic">
                No items found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}