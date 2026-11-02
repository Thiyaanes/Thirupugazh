import { useState, useEffect, useMemo } from 'react';
import { ThirupugazhSong } from '../types';
import thirupugazhData from '../data/thirupugazh.json';

export const useSearch = (data: ThirupugazhSong[], query: string) => {
  const [results, setResults] = useState<ThirupugazhSong[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query || query.trim() === '') {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Simple debounce
    const timeoutId = setTimeout(() => {
      const lowerQuery = query.toLowerCase().trim();
      
      const filtered = data.filter((song) => {
        // Check titles
        if (
          song.titleTamil.toLowerCase().includes(lowerQuery) ||
          song.titleEnglish.toLowerCase().includes(lowerQuery)
        ) {
          return true;
        }
        
        // Check number
        if (song.number.toString() === lowerQuery) return true;
        
        // Check temple
        if (
          song.temple.toLowerCase().includes(lowerQuery) ||
          song.templeTamil.toLowerCase().includes(lowerQuery)
        ) {
          return true;
        }

        // Check lyrics/transliteration arrays
        const inTamil = song.lyricsTamil?.some(line => line.toLowerCase().includes(lowerQuery));
        const inTrans = song.transliteration?.some(line => line.toLowerCase().includes(lowerQuery));
        
        if (inTamil || inTrans) return true;
        
        return false;
      });
      
      setResults(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, data]);

  return { results, isSearching };
};
