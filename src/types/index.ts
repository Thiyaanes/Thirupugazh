export interface SyncedLyricLine {
  timestamp: number;
  tamilText: string;
  transliteration: string;
}

export interface ThirupugazhSong {
  id: string;
  number: number;
  titleTamil: string;
  titleEnglish: string;
  temple: string;
  templeTamil: string;
  singer: string;
  raagam: string;
  talam: string;
  lyricsTamil: string[];
  transliteration: string[];
  lyricsEnglish: string[];
  meaning: string;
  syncedLyrics: SyncedLyricLine[];
  category: string[];
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameTamil: string;
  icon: string;
  color: string;
  count?: number;
}

export interface ReadingSettings {
  fontSize: number;
  lineSpacing: number;
  displayMode: 'tamil' | 'transliteration' | 'english' | 'both' | 'meaning';
  readingTheme: 'light' | 'dark' | 'sepia';
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppTheme {
  mode: ThemeMode;
  colors: ThemeColors;
}

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  accentLight: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  error: string;
  success: string;
  favorite: string;
  cardGradientStart: string;
  cardGradientEnd: string;
  tabBar: string;
  tabBarActive: string;
  tabBarInactive: string;
  statusBar: 'light' | 'dark';
}
