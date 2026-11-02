import { useState, useEffect, useRef } from 'react';
import { SyncedLyricLine } from '../types';

export const useSyncedLyrics = (lyrics: SyncedLyricLine[], initialIsPlaying: boolean = false) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(initialIsPlaying);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => prev + 0.1);
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!lyrics || lyrics.length === 0) return;

    let newIndex = 0;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].timestamp) {
        newIndex = i;
      } else {
        break;
      }
    }

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [currentTime, lyrics, activeIndex]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const seekTo = (time: number) => {
    setCurrentTime(time);
  };

  const reset = () => {
    setCurrentTime(0);
    setActiveIndex(0);
    setIsPlaying(false);
  };

  return { currentTime, activeIndex, isPlaying, togglePlay, seekTo, reset };
};
