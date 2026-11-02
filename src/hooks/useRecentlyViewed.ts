import { useState, useEffect } from 'react';
import { safeStorage } from '../utils/storage';

const RECENTLY_VIEWED_KEY = '@MurugarThunai_recentlyViewed';
const MAX_RECENT = 20;

export const useRecentlyViewed = () => {
  const [recentSongs, setRecentSongs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecent();
  }, []);

  const loadRecent = async () => {
    try {
      const stored = await safeStorage.getItem(RECENTLY_VIEWED_KEY);
      if (stored) {
        setRecentSongs(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recently viewed:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRecent = async (songId: string) => {
    try {
      const current = recentSongs || [];
      const filtered = current.filter(id => id !== songId);
      const newRecent = [songId, ...filtered].slice(0, MAX_RECENT);
      
      setRecentSongs(newRecent);
      await safeStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(newRecent));
    } catch (error) {
      console.error('Error saving recently viewed:', error);
    }
  };

  const clearRecent = async () => {
    try {
      setRecentSongs([]);
      await safeStorage.removeItem(RECENTLY_VIEWED_KEY);
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
    }
  };

  return { recentSongs, addRecent, addRecentSong: addRecent, clearRecent, loading };
};
