import React, { useState, useEffect, useRef, useCallback } from 'react';
import Nav from "../components/GlobalComps/Nav.jsx";
import { Search, Loader2 } from 'lucide-react'; 
import BidItemCard from '../components/BodyComps/BidItemCard';

// Simulated large dataset for demonstration
const generateDummyData = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}: ${["Industrial Espresso Machine", "Herman Miller Chair", "MacBook Pro", "Persian Rug"][i % 4]}`,
    category: ["Appliances", "Furniture", "Electronics", "Decor"][i % 4],
    image: `https://via.placeholder.com/300x200?text=Item+${i + 1}`,
    availableQty: Math.floor(Math.random() * 10) + 1,
    askingPrice: Math.floor(Math.random() * 3000) + 500,
  }));
};

const ALL_ITEMS = generateDummyData(60); // Total mock database
const ITEMS_PER_PAGE = 12;

export default function ItemListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Infinite Scroll States
  const [items, setItems] = useState([]); // Items currently displayed
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Intersection Observer Ref
  const observer = useRef();

  // 1. Logic to "Fetch" items (simulating an API)
  const fetchItems = useCallback(async (pageNum, filter, search) => {
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const filteredTotal = ALL_ITEMS.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filter === 'All' || item.category === filter;
      return matchesSearch && matchesCategory;
    });

    const start = (pageNum - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const newBatch = filteredTotal.slice(start, end);

    setItems(prev => pageNum === 1 ? newBatch : [...prev, ...newBatch]);
    setHasMore(end < filteredTotal.length);
    setLoading(false);
  }, []);

  // 2. Reset and fetch when filters change
  useEffect(() => {
    setPage(1);
    fetchItems(1, categoryFilter, searchTerm);
  }, [categoryFilter, searchTerm, fetchItems]);

  // 3. Trigger next page load
  useEffect(() => {
    if (page > 1) {
      fetchItems(page, categoryFilter, searchTerm);
    }
  }, [page, fetchItems]); // dependencies are minimal to prevent loops

  // 4. Observer Setup: Detects when the "last element" enters view
  const lastItemElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="bg-gray-100 min-h-screen pb-12">
      <Nav />
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Live Auctions & Bidding</h1>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search items..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-56">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer outline-none"
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
          {items.map((item, index) => {
            // Attach the observer ref to the very last item in the current list
            if (items.length === index + 1) {
              return (
                <div ref={lastItemElementRef} key={item.id}>
                  <BidItemCard item={item} />
                </div>
              );
            } else {
              return (
                <div key={item.id}>
                  <BidItemCard item={item} />
                </div>
              );
            }
          })}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
            <span className="ml-3 text-gray-600 font-medium">Loading more items...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-xl font-medium text-gray-500 italic">
              No items found matching your criteria.
            </p>
          </div>
        )}

        {/* End of Content Message */}
        {!hasMore && items.length > 0 && (
          <div className="py-10 text-center text-gray-400 text-sm uppercase tracking-widest">
            You've reached the end of the catalog
          </div>
        )}
      </main>
    </div>
  );
}