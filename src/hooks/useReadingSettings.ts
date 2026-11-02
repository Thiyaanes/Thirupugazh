import { useState, useEffect } from 'react';
import { safeStorage } from '../utils/storage';
import { ReadingSettings } from '../types';

const READING_SETTINGS_KEY = '@MurugarThunai_readingSettings';

const defaultSettings: ReadingSettings = {
  fontSize: 20,
  lineSpacing: 1.8,
  displayMode: 'tamil',
  readingTheme: 'light',
};

export const useReadingSettings = () => {
  const [settings, setSettings] = useState<ReadingSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await safeStorage.getItem(READING_SETTINGS_KEY);
      if (stored) {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading reading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<ReadingSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      await safeStorage.setItem(READING_SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving reading settings:', error);
    }
  };

  return { settings, updateSettings, loading };
};
