import React, { useState, useEffect, useRef, useCallback } from 'react';
import Nav from "../components/GlobalComps/Nav.jsx";
import { Search, Loader2, MoveUpRight, MoveDownRight } from 'lucide-react';
import BouncingLoader from '../components/GlobalComps/BouncingLoader';
import { supabase } from '../supabaseClient';
import { useAuth } from '../components/AuthComps/CheckAuth';
import MinimalItemCard from '../components/BodyComps/MinimalItemCard';

const ITEMS_PER_PAGE = 12;

export default function ItemListPage() {
  const { session, loading } = useAuth();
  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Infinite Scroll States
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  // 1. Supabase Fetch Logic
  const fetchItems = useCallback(async (pageNum, category, search, min, max) => {
    setIsLoading(true);

    try {
      // Start the base query
      let query = supabase
        .from('all_items')
        .select('*, users_info(school)', { count: 'exact' });

      // Apply Search Filter (ilike = case-insensitive search)
      if (search) {
        query = query.ilike('item_name', `%${search}%`);
      }

      // Apply Category Filter
      if (category && category !== 'All') {
        query = query.eq('category', category);
      }

      // Apply Price Filters
      if (min !== '') {
        query = query.gte('item_value', Number(min));
      }
      if (max !== '') {
        query = query.lte('item_value', Number(max));
      }

      // Apply Pagination
      const from = (pageNum - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      // Order by newest items first, then apply the range
      query = query.order('created_at', { ascending: false }).range(from, to);

      query = query.gt('quantity_available', 0); // Only fetch items that are still available

      const { data, error, count } = await query;

      if (error) throw error;

      // Map Supabase column names to match what your BidItemCard expects
      const formattedData = data.map(dbItem => ({
        ...dbItem,
        name: dbItem.title,           // Mapping DB 'title' to Card 'name'
        askingPrice: dbItem.price,    // Mapping DB 'price' to Card 'askingPrice'
        availableQty: dbItem.availableQty || 1, // Fallback if you haven't added qty to your DB yet
        images: dbItem.images || []
      }));

      // If page 1, replace items. If page > 1, append new items
      setItems(prev => pageNum === 1 ? formattedData : [...prev, ...formattedData]);

      // Check if we hit the end of the results
      setHasMore(from + formattedData.length < count);

    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on component mount
  useEffect(() => {
    // 1. Reset the page
    setPage(1);

    const loadInitialData = async () => {
      try {
        await fetchItems(1, "All", "", "", "");
      } catch (error) {
        console.error("Error fetching initial items:", error);
      } finally {
        setIsPageLoading(false);
      }
    };

    loadInitialData();

  }, []);

  // 2. Trigger fetch when filters change (WITH DEBOUNCE)
  useEffect(() => {
    // Wait 500ms after the user stops typing before hitting the database
    const delayDebounceFn = setTimeout(() => {
      setPage(1); // Always reset to page 1 when a filter changes
      fetchItems(1, categoryFilter, searchTerm, minPrice, maxPrice);
    }, 500);

    return () => clearTimeout(delayDebounceFn); // Cleanup the timer if they keep typing
  }, [categoryFilter, searchTerm, minPrice, maxPrice, fetchItems]);

  // 3. Trigger next page load when scrolling down
  useEffect(() => {
    if (page > 1) {
      fetchItems(page, categoryFilter, searchTerm, minPrice, maxPrice);
    }
  }, [page, fetchItems]);

  // 4. Observer Setup for Infinite Scroll
  const lastItemElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  if (loading || isPageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BouncingLoader />
      </div>
    );
  }

  const handleItemUpdate = (itemId, newQuantity, newStatus) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          return { ...item, quantity_available: newQuantity, status: newStatus };
        }
        return item;
      })
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-12">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 ">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 pt-13">Live Auctions & Bidding</h1>

        {/* Search and Filter Bar */}
        <div className="flex flex-col gap-4 mb-10 bg-white p-4 rounded-xl shadow-sm border border-gray-100">

          {/* Top Row: Search and Category */}
          <div className="flex flex-col sm:flex-row gap-4">
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
                className="block w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
              >
                <option value="All">All Categories</option>
                <option value="mobile-phones">Mobile Phones</option>
                <option value="furniture">Furniture</option>
                <option value="video-games">Video Games</option>
                {/* Add your other specific categories here */}
              </select>
            </div>
          </div>

          {/* Bottom Row: Price Range */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-600">Price (₦):</span>

            <div className="relative w-32">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <MoveDownRight className="text-gray-400" size={14} />
              </div>
              <input
                type="number"
                placeholder="Min"
                className="block w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600 outline-none transition-all"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <span className="text-gray-400">-</span>

            <div className="relative w-32">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <MoveUpRight className="text-gray-400" size={14} />
              </div>
              <input
                type="number"
                placeholder="Max"
                className="block w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600 outline-none transition-all"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => {
            if (items.length === index + 1) {
              return (
                <div ref={lastItemElementRef} key={item.id || index}>
                  <MinimalItemCard item={item} />
                </div>
              );
            } else {
              return (
                <div key={item.id || index}>
                  <MinimalItemCard item={item} />
                </div>
              );
            }
          })}
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
            <span className="ml-3 text-gray-600 font-medium">Fetching items...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && items.length === 0 && (
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