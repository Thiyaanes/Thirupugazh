import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { safeStorage } from '../utils/storage';
import { AppTheme, ThemeMode, ThemeColors } from '../types';
import { lightColors, darkColors, sepiaColors } from './colors';

const THEME_STORAGE_KEY = '@MurugarThunai_theme';

interface ThemeContextType {
  theme: AppTheme;
  setMode: (mode: ThemeMode) => void;
  setTheme: (theme: AppTheme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [theme, setThemeState] = useState<AppTheme>({
    mode: 'system',
    colors: systemColorScheme === 'dark' ? darkColors : lightColors,
  });

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    if (mode === 'system') {
      setThemeState({
        mode: 'system',
        colors: systemColorScheme === 'dark' ? darkColors : lightColors,
      });
    }
  }, [systemColorScheme, mode]);

  const loadTheme = async () => {
    try {
      const storedTheme = await safeStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme) {
        const parsedMode = JSON.parse(storedTheme) as ThemeMode;
        setMode(parsedMode);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    
    let colors: ThemeColors;
    if (newMode === 'system') {
      colors = systemColorScheme === 'dark' ? darkColors : lightColors;
    } else if (newMode === 'dark') {
      colors = darkColors;
    } else if (newMode === 'light') {
       colors = lightColors;
    } else {
       colors = sepiaColors;
    }

    setThemeState({ mode: newMode, colors });
    try {
      await safeStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newMode));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setMode, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
