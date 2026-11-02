import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeStorage } from '../utils/storage';

export type UILanguage = 'en' | 'ta';

const UI_LANGUAGE_KEY = '@Thirupugazh_uiLanguage';
const HAS_LAUNCHED_KEY = '@Thirupugazh_hasLaunched';

const translations = {
  en: {
    tabHome: 'Home',
    tabSearch: 'Search',
    tabFavorites: 'Favorites',
    tabSettings: 'Settings',
    appName: 'Thirupugazh (திருப்புகழ் ̇)',
    searchPlaceholder: 'Search by song name, number, or temple...',
    featuredTitle: 'Featured Thirupugazh',
    templesHeader: 'Murugan Temples',
    popularHeader: 'Thirupugazh Songs (1 - {count})',
    seeAll: 'See All',
    favoritesTitle: 'Favorites',
    noFavoritesTitle: 'No Favorites Yet',
    noFavoritesDesc: 'Tap the heart icon on any Thirupugazh song to save it here for quick offline access.',
    settingsTitle: 'Settings',
    appLanguage: 'App UI Language',
    readingPreferences: 'Reading Preferences',
    fontSize: 'Font Size',
    languageViewMode: 'Song View Mode',
    aboutThirupugazh: 'About Thirupugazh',
    aboutText1: 'Thirupugazh is a 15th-century Tamil devotional anthology composed by Saint Arunagirinathar dedicated to Lord Murugan.',
    aboutText2: 'Renowned for its intricate meter, rhythmic beat structures (Chantham), and melodic beauty, reading Thirupugazh fills the heart with divine grace.',
    selectLanguageTitle: 'Welcome to Thirupugazh',
    selectLanguageSubtitle: 'Select your preferred app language / உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    englishOption: 'English',
    tamilOption: 'தமிழ் (Tamil)',
    continueBtn: 'Continue • தொடர்க',
    foundSongs: 'Found {count} songs',
    noSongsFound: 'No Songs Found',
    searchDesc: 'Try searching for song name, number (1-{count}), or temple name.',
    filtersAll: 'All',
    filtersVinayagar: 'Vinayagar',
    filtersThirupparankundram: 'Thirupparankundram',
    filtersTiruchendur: 'Tiruchendur',
    filtersPalani: 'Palani',
    filtersSwamimalai: 'Swamimalai',
    filtersThiruthani: 'Thiruthani',
    filtersVayaloor: 'Vayaloor',
    filtersKanchipuram: 'Kanchipuram',
    filtersThiruvannamalai: 'Thiruvannamalai',
    // Song detail screen tabs
    songTabPaadal: 'பாடல்கள் (Tamil)',
    songTabEnglish: 'Lyrics (English)',
    songTabSynced: 'Synced',
    // Song navigation footer
    songNavPrev: 'Song {num}',
    songNavNext: 'Song {num}',
    songNavFirst: 'First Song',
    songNavLast: 'Last Song',
    // Home screen load-more
    loadMoreSongs: 'Load More ({count} remaining)',
  },
  ta: {
    tabHome: 'முகப்பு',
    tabSearch: 'தேடல்',
    tabFavorites: 'விருப்பங்கள்',
    tabSettings: 'அமைப்புகள்',
    appName: 'திருப்புகழ் (Thirupugazh ̇)',
    searchPlaceholder: 'பாடல் பெயர், எண், தலம் கொண்டு தேடுக...',
    featuredTitle: 'சிறப்பு திருப்புகழ்',
    templesHeader: 'முருகன் திருத்தலங்கள்',
    popularHeader: 'திருப்புகழ் பாடல்கள் (1 - {count})',
    seeAll: 'அனைத்தும்',
    favoritesTitle: 'விருப்பப் பாடல்கள்',
    noFavoritesTitle: 'விருப்பப் பாடல்கள் எதுவும் இல்லை',
    noFavoritesDesc: 'பாடல்களின் இதயக் குறியீட்டைத் தொட்டு உங்களுக்குப் பிடித்த பாடல்களைச் சேமிக்கவும்.',
    settingsTitle: 'அமைப்புகள்',
    appLanguage: 'செயலி மொழி',
    readingPreferences: 'வாசிப்பு விருப்பங்கள்',
    fontSize: 'எழுத்து அளவு',
    languageViewMode: 'பாடல் காட்சி முறை',
    aboutThirupugazh: 'திருப்புகழ் வரலாறு',
    aboutText1: 'திருப்புகழ் என்பது 15-ஆம் நூற்றாண்டில் அருணகிரிநாதரால் இயற்றப்பட்ட முருகப் பெருமானின் புகழ்பாடும் சந்தத் தமிழ் நூலாகும்.',
    aboutText2: 'இசை நயமும், சந்த தாள அமைப்பும் கொண்ட திருப்புகழ் பாடல்கள் மன அமைதியையும், பக்தியையும், நல்வாழ்வையும் தரும் அற்புத அருட்பாக்கள் ஆகும்.',
    selectLanguageTitle: 'திருப்புகழ் செயலிக் வரவேற்பு',
    selectLanguageSubtitle: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும் / Select your language',
    englishOption: 'English (ஆங்கிலம்)',
    tamilOption: 'தமிழ் (Tamil)',
    continueBtn: 'தொடர்க • Continue',
    foundSongs: '{count} பாடல்கள் கண்டறியப்பட்டன',
    noSongsFound: 'பாடல்கள் எதுவும் கிடைக்கவில்லை',
    searchDesc: 'பாடல் பெயர், எண் (1-{count}), அல்லது தலப் பெயரை உள்ளிட்டு தேடவும்.',
    filtersAll: 'அனைத்தும்',
    filtersVinayagar: 'விநாயகர் துதி',
    filtersThirupparankundram: 'திருப்பரங்குன்றம்',
    filtersTiruchendur: 'திருச்செந்தூர்',
    filtersPalani: 'பழநி',
    filtersSwamimalai: 'சுவாமிமலை',
    filtersThiruthani: 'திருத்தணிகை',
    filtersVayaloor: 'வயலூர்',
    filtersKanchipuram: 'காஞ்சீபுரம்',
    filtersThiruvannamalai: 'திருவண்ணாமலை',
    // Song detail screen tabs
    songTabPaadal: 'பாடல்கள் (Tamil)',
    songTabEnglish: 'Lyrics (English)',
    songTabSynced: 'சீரிசை (Synced)',
    // Song navigation footer
    songNavPrev: 'பாடல் {num}',
    songNavNext: 'பாடல் {num}',
    songNavFirst: 'முதல் பாடல்',
    songNavLast: 'கடைசி பாடல்',
    // Home screen load-more
    loadMoreSongs: 'மேலும் பாடல்களைக் காட்டுக ({count} பாடல்கள் உள்ளன)',
  },
};

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  uiLanguage: UILanguage;
  setUiLanguage: (lang: UILanguage) => Promise<void>;
  isFirstLaunch: boolean;
  completeFirstLaunch: (selectedLang: UILanguage) => Promise<void>;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uiLanguage, setUiLanguageState] = useState<UILanguage>('en');
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadLanguagePreferences();
  }, []);

  const loadLanguagePreferences = async () => {
    try {
      const hasLaunched = await safeStorage.getItem(HAS_LAUNCHED_KEY);
      const savedLang = await safeStorage.getItem(UI_LANGUAGE_KEY) as UILanguage | null;

      if (!hasLaunched) {
        setIsFirstLaunch(true);
        // Default UI language is English as requested
        setUiLanguageState('en');
      } else if (savedLang && (savedLang === 'en' || savedLang === 'ta')) {
        setUiLanguageState(savedLang);
      }
    } catch (e) {
      console.error('Error loading language preferences:', e);
    } finally {
      setLoading(false);
    }
  };

  const setUiLanguage = async (lang: UILanguage) => {
    setUiLanguageState(lang);
    await safeStorage.setItem(UI_LANGUAGE_KEY, lang);
  };

  const completeFirstLaunch = async (selectedLang: UILanguage) => {
    await setUiLanguage(selectedLang);
    await safeStorage.setItem(HAS_LAUNCHED_KEY, 'true');
    setIsFirstLaunch(false);
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const dict = translations[uiLanguage] || translations.en;
    let str = dict[key] || translations.en[key] || key;
    if (params) {
      Object.keys(params).forEach((paramKey) => {
        str = str.replace(`{${paramKey}}`, String(params[paramKey]));
      });
    }
    return str;
  };

  return (
    <LanguageContext.Provider
      value={{
        uiLanguage,
        setUiLanguage,
        isFirstLaunch,
        completeFirstLaunch,
        t,
        loading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
