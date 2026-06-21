import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient.js';
import { useAuth } from '../AuthComps/CheckAuth.jsx';

const FavoritesContext = createContext({});

export const FavoritesProvider = ({ children }) => {
  const { session } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.user?.id) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('users_info')
          .select('favourites')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching favorites:", error);
        } else if (data) {
          setFavorites(data.favourites || []);
        }
      } catch (err) {
        console.error("Unexpected error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [session?.user?.id]);

  const toggleFavorite = async (itemId) => {
    if (!session?.user?.id) {
      console.warn("User must be logged in to toggle favorites");
      return;
    }

    const isFav = favorites.includes(itemId);
    const updatedFavorites = isFav
      ? favorites.filter(id => id !== itemId)
      : [...favorites, itemId];

    // Optimistically update local state
    setFavorites(updatedFavorites);

    try {
      const { error } = await supabase
        .from('users_info')
        .update({ favourites: updatedFavorites })
        .eq('user_id', session.user.id);

      if (error) {
        console.error("Error updating favorites in DB, reverting:", error);
        // Revert local state on DB failure
        setFavorites(favorites);
      }
    } catch (err) {
      console.error("Unexpected error updating favorites, reverting:", err);
      // Revert local state on exception
      setFavorites(favorites);
    }
  };

  const isFavorited = (itemId) => {
    return favorites.includes(itemId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorited, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
