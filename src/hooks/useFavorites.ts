import { useState, useEffect } from 'react';
import { safeStorage } from '../utils/storage';

const FAVORITES_KEY = '@MurugarThunai_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await safeStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (songId: string) => {
    try {
      const currentFavs = favorites || [];
      const newFavorites = currentFavs.includes(songId)
        ? currentFavs.filter(id => id !== songId)
        : [...currentFavs, songId];
        
      setFavorites(newFavorites);
      await safeStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isFavorite = (songId: string) => (favorites || []).includes(songId);

  return { favorites, toggleFavorite, isFavorite, loading };
};
