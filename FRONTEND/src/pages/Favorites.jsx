import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useFavorites } from '../components/GlobalComps/FavoritesContext.jsx';
import MinimalItemCard from '../components/BodyComps/MinimalItemCard';
import Nav from "../components/GlobalComps/Nav.jsx";
import BouncingLoader from '../components/GlobalComps/BouncingLoader';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites, loading: favoritesLoading } = useFavorites();
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  // Sync favorites with detailed items info from DB
  useEffect(() => {
    if (favoritesLoading) return;

    if (favorites.length === 0) {
      setItems([]);
      setLoadingItems(false);
      return;
    }

    // Local optimization: If we only removed an item, filter it from state instead of refetching
    const itemsIds = items.map(item => item.id);
    const hasAdded = favorites.some(id => !itemsIds.includes(id));
    const hasRemoved = itemsIds.some(id => !favorites.includes(id));

    if (!hasAdded && hasRemoved) {
      setItems(prev => prev.filter(item => favorites.includes(item.id)));
      return;
    }

    // If new items were added (or on initial load), fetch details
    if (hasAdded || items.length === 0) {
      const fetchFavoriteItems = async () => {
        setLoadingItems(true);
        try {
          const { data, error } = await supabase
            .from('all_items')
            .select('*, users_info(school)')
            .in('id', favorites);

          if (error) {
            console.error("Error fetching favorited items:", error);
          } else if (data) {
            setItems(data);
          }
        } catch (err) {
          console.error("Error in fetchFavoriteItems:", err);
        } finally {
          setLoadingItems(false);
        }
      };

      fetchFavoriteItems();
    }
  }, [favorites, favoritesLoading]);

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/itemList");
    }
  };

  const isLoading = favoritesLoading || (loadingItems && items.length === 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 pt-24 md:pt-28">
        {/* Header navigation bar */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-gray-200/80 rounded-full transition-all duration-200 focus:outline-none cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft className="text-gray-700" size={24} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              My Favorites
              <Heart className="text-red-500 fill-red-500 animate-pulse" size={24} />
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Browse and manage your saved campus deals and auction items.
            </p>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <BouncingLoader />
          </div>
        ) : items.length === 0 ? (
          /* Empty state */
          <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom duration-300">
            <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
              <Heart size={32} className="stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Saved Items Yet</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
              When you find something you like on Campus Mart, click the heart icon to save it here for later.
            </p>
            <Link
              to="/itemList"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <ShoppingBag size={18} />
              Explore Listings
            </Link>
          </div>
        ) : (
          /* Favorites grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-400">
            {items.map(item => (
              <div
                key={item.id}
                className="transform transition-all duration-300 hover:-translate-y-1 h-full"
              >
                <MinimalItemCard item={item} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
