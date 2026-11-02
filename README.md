<p align="center">
  <h1 align="center"> Thirupugazh (திருப்புகழ்)</h1>
  <p align="center">
    A cross-platform mobile app to explore, search, and read the sacred 1330+ Thirupugazh hymns of Saint Arunagirinathar — in Tamil, English transliteration, and synced-lyrics mode.
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react&logoColor=white" alt="React Native" />
    <img src="https://img.shields.io/badge/Expo_SDK-57-000020?logo=expo&logoColor=white" alt="Expo" />
    <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-brightgreen" alt="Platform" />
    <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License" />
  </p>
</p>

---

## About

**Thirupugazh** (திருப்புகழ்) is a 15th-century Tamil devotional anthology composed by **Saint Arunagirinathar**, dedicated to Lord Murugan. Renowned for its intricate meter, rhythmic beat structures (_Chantham_), and melodic beauty, Thirupugazh fills the heart with divine grace.

This app brings the complete collection of **1330+ hymns** to your fingertips — with bilingual support, temple-based categorization, synced-lyrics playback, and a beautiful reading experience.

---

##  Features

###  Home
- **Featured Thirupugazh** hero card with gradient styling
- **10 Murugan Temple categories** (Thirupparankundram, Tiruchendur, Palani, Swamimalai, Thiruthani, Pazhamudircholai, Vayaloor, Kanchipuram, Thiruvannamalai, Vinayagar)
- **Recently Viewed** history section
- **Infinite-scroll pagination** — lazy-loads 50 songs at a time with scroll-triggered auto-loading

###  Search
- **Full-text search** across song titles, lyrics (Tamil), transliteration (English), song numbers, and temple names
- **Debounced queries** (300ms) for smooth performance
- **Temple-based filters** for quick category filtering

###  Song Detail
- **Three viewing modes:**
  - 🇮🇳 **Tamil Lyrics** (பாடல்கள்) — original Tamil text
  - 🇬🇧 **English Lyrics** — transliterated text
  -  **Synced Lyrics** — real-time line highlighting with playback controls
- **Reading Settings** — adjustable font size (14–32px), display mode (Tamil / English / Both / Meaning)
- **Raagam & Talam** metadata display
- **Song-to-song navigation** (Previous / Next footer)
- **Favourite bookmarking** with heart icon

###  Favorites
- Bookmark any song for quick offline access
- Persisted via AsyncStorage — survives app restarts

###  Settings
- **UI Language** — runtime switching between English and Tamil (தமிழ்)
- **Theme Selection** — Light, Dark, Sepia, and System (auto-detect)
- **Font Size** stepper control
- **Display Mode** — Tamil, English, Both, or Meaning
- **About section** with app info

### Bilingual i18n
- Full Tamil/English internationalization for all UI strings
- Context-driven translation system with `useLanguage()` hook
- First-launch language selection modal

---

## Architecture

### Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React Native 0.86 + Expo SDK 57 |
| **Language** | TypeScript 6.0 |
| **Navigation** | Expo Router (file-based routing, tabs, dynamic `[id]` routes) |
| **State** | React Context API + Custom Hooks + AsyncStorage |
| **Animations** | React Native Reanimated 4.5 + Gesture Handler 2.32 |
| **Styling** | StyleSheet API + Centralized Design Tokens |
| **Data Pipeline** | Python (PyMuPDF, `tamil` TSCII library, regex) |
| **Platforms** | iOS, Android, Web |

### Project Structure

```
Thirupugazh/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout (providers, stack nav)
│   ├── index.tsx                 # Entry redirect
│   ├── (tabs)/                   # Bottom tab navigation
│   │   ├── _layout.tsx           # Tab bar config
│   │   ├── index.tsx             # Home screen
│   │   ├── search.tsx            # Search screen
│   │   ├── favorites.tsx         # Favorites screen
│   │   └── settings.tsx          # Settings screen
│   ├── song/
│   │   └── [id].tsx              # Song detail (dynamic route)
│   └── category/
│       └── [id].tsx              # Temple category listing
│
├── src/
│   ├── components/               # 15 reusable UI components
│   │   ├── CategoryCard.tsx      # Temple category card
│   │   ├── EnglishLyricsViewer.tsx
│   │   ├── FavoriteButton.tsx    # Heart toggle button
│   │   ├── FeaturedCard.tsx      # Hero gradient card
│   │   ├── Header.tsx            # Screen header with back nav
│   │   ├── LanguageSelectionModal.tsx  # First-launch lang picker
│   │   ├── LyricsLine.tsx        # Individual lyric line
│   │   ├── LyricsViewer.tsx      # Tamil lyrics scroll view
│   │   ├── ReadingSettings.tsx   # Font/display mode modal
│   │   ├── RecentlyViewed.tsx    # Recently viewed songs row
│   │   ├── SearchBar.tsx         # Search input component
│   │   ├── SongCard.tsx          # Song card (grid layout)
│   │   ├── SongListItem.tsx      # Song list item (list layout)
│   │   ├── SyncedLyrics.tsx      # Synced lyrics with playback
│   │   └── ThemeSelector.tsx     # Light/Dark/Sepia/System picker
│   │
│   ├── context/
│   │   └── LanguageContext.tsx    # i18n provider (Tamil/English)
│   │
│   ├── hooks/                    # 6 custom React hooks
│   │   ├── useFavorites.ts       # Favourite songs persistence
│   │   ├── useReadingSettings.ts # Font size & display mode
│   │   ├── useRecentlyViewed.ts  # Recently viewed history
│   │   ├── useSearch.ts          # Debounced full-text search
│   │   ├── useSyncedLyrics.ts    # Synced lyrics playback state
│   │   └── useTheme.ts           # Theme hook re-export
│   │
│   ├── theme/                    # Design system
│   │   ├── ThemeContext.tsx       # Theme provider (Light/Dark/Sepia/System)
│   │   ├── colors.ts             # Color palettes (light, dark, sepia)
│   │   ├── spacing.ts            # Spacing scale tokens
│   │   ├── typography.ts         # Typography scale
│   │   └── index.ts              # Theme barrel export
│   │
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   │
│   ├── utils/
│   │   ├── lyricsFormatter.ts    # Lyrics text formatting
│   │   └── storage.ts            # Safe AsyncStorage wrapper
│   │
│   └── data/
│       └── thirupugazh.json      # 330+ songs dataset (~14 MB)
│
├── assets/                       # App icons, splash screen, images
├── generate_330_songs.py         # PDF → JSON data pipeline (main)
├── generate_data.py              # Text → JSON data generator
├── fix_english_lyrics.py         # English lyrics cleanup script
├── fix_transliteration.py        # Transliteration repair script
├── fix_thirupugazh_script.py     # Additional data fixes
├── analyze_songs.py              # Data quality analyzer
├── app.json                      # Expo app config
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript config
└── babel.config.js               # Babel config
```

---

##  Data Pipeline

The song dataset was built from raw source material using a custom Python pipeline:

```
┌──────────────────────────┐     ┌─────────────────────────────┐
│  Tamil PDF (TSCII)       │     │  English Transliteration     │
│  (அருணகிரிநாதர்.pdf)      │     │  (thirupugal_full_text.txt)  │
└────────────┬─────────────┘     └──────────────┬──────────────┘
             │                                   │
     PyMuPDF + tamil lib                  Regex parsing
     TSCII → Unicode                    Header extraction
             │                                   │
             └──────────┬───────────────────────┘
                        │
              Regex matching by song number
              Temple mapping (Tamil ↔ English)
              Raagam / Talam extraction
              Synced lyrics generation
                        │
                        ▼
         ┌──────────────────────────┐
         │  thirupugazh.json        │
         │  1330+ structured songs   │
         │  (~14 MB, UTF-8)         │
         └──────────────────────────┘
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
   fix_english    fix_translit    analyze_songs
   _lyrics.py     eration.py      .py
   (cleanup)      (repair)        (validate)
```

**Pipeline scripts:**
| Script | Purpose |
|---|---|
| `generate_330_songs.py` | Extracts Tamil lyrics from PDF (TSCII→Unicode via PyMuPDF + `tamil` lib), matches with English transliterations, generates full JSON |
| `generate_data.py` | Alternative text-based generator from `.txt` source |
| `fix_english_lyrics.py` | Strips leaked headers, removes merged song content from English lyrics arrays |
| `fix_transliteration.py` | Detects and repairs transliteration arrays corrupted with Tamil characters |
| `analyze_songs.py` | Validates data integrity, detects extra/merged content in lyrics |

---

##  Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **yarn**
- **Expo CLI** (installed globally or via `npx`)
- **Expo Go** app on your phone (for mobile testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/Thirupugazh.git
cd Thirupugazh

# Install dependencies
npm install

# Start the development server
npm start
```

### Running on Devices

```bash
# iOS (requires macOS + Xcode)
npm run ios

# Android (requires Android Studio / emulator)
npm run android

# Web
npm run web
```

### Regenerating Song Data (Optional)

If you have the source PDF and text files in the parent directory:

```bash
# Install Python dependencies
pip install PyMuPDF python-tamil

# Generate the dataset
python generate_330_songs.py

# Fix and validate
python fix_english_lyrics.py
python fix_transliteration.py
python analyze_songs.py
```

---

##  Theming

The app supports **4 themes** with a centralized design token system:

| Theme | Background | Primary | Description |
|---|---|---|---|
|  **Light** | `#FFF8F0` | `#D4520A` | Warm cream with saffron orange |
|  **Dark** | `#1A1218` | `#F4A236` | Deep burgundy-black with golden amber |
|  **Sepia** | `#F5E6D0` | `#8B6914` | Classic parchment-style reading mode |
|  **System** | _auto_ | _auto_ | Follows device light/dark preference |

---

## Screens

| Screen | Route | Description |
|---|---|---|
| Home | `/(tabs)/` | Featured song, temple categories, recently viewed, all songs |
| Search | `/(tabs)/search` | Full-text search with temple filters |
| Favorites | `/(tabs)/favorites` | Bookmarked songs list |
| Settings | `/(tabs)/settings` | Language, theme, font, display mode, about |
| Song Detail | `/song/[id]` | Lyrics viewer (Tamil / English / Synced) |
| Category | `/category/[id]` | Songs filtered by temple |


---

<p align="center">
  <b>வேலும் மயிலும் துணை</b><br/>
  <i>May Vel and Mayil protect us</i>
</p>
