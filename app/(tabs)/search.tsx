import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useLanguage } from '../../src/context/LanguageContext';
import { spacing, typography, borderRadius } from '../../src/theme';
import { Header } from '../../src/components/Header';
import { SearchBar } from '../../src/components/SearchBar';
import { SongListItem } from '../../src/components/SongListItem';
import { useSearch } from '../../src/hooks/useSearch';
import { ThirupugazhSong } from '../../src/types';
import thirupugazhData from '../../src/data/thirupugazh.json';

const FILTER_TAGS = [
  { id: 'All', labelKey: 'filtersAll' as const },
  { id: 'Vinayagar', labelKey: 'filtersVinayagar' as const },
  { id: 'Thirupparankundram', labelKey: 'filtersThirupparankundram' as const },
  { id: 'Tiruchendur', labelKey: 'filtersTiruchendur' as const },
  { id: 'Palani', labelKey: 'filtersPalani' as const },
  { id: 'Swamimalai', labelKey: 'filtersSwamimalai' as const },
  { id: 'Thiruthani', labelKey: 'filtersThiruthani' as const },
  { id: 'Vayaloor', labelKey: 'filtersVayaloor' as const },
  { id: 'Kanchipuram', labelKey: 'filtersKanchipuram' as const },
  { id: 'Thiruvannamalai', labelKey: 'filtersThiruvannamalai' as const },
];

export default function SearchScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const songs = thirupugazhData as ThirupugazhSong[];
  const { results, isSearching } = useSearch(songs, query);

  const displayedSongs = query.trim().length > 0 
    ? results 
    : songs.filter((s) => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Vinayagar') return s.temple === 'Vinayagar' || s.templeTamil?.includes('விநாயகர்');
        if (activeFilter === 'Thirupparankundram') return s.temple === 'Thirupparankundram' || s.templeTamil?.includes('திருப்பரங்குன்றம்');
        if (activeFilter === 'Tiruchendur') return s.temple === 'Tiruchendur' || s.templeTamil?.includes('திருச்செந்தூர்') || s.templeTamil?.includes('திருச்செந்துார்');
        if (activeFilter === 'Palani') return s.temple === 'Palani' || s.templeTamil?.includes('பழநி');
        if (activeFilter === 'Swamimalai') return s.temple === 'Swamimalai' || s.templeTamil?.includes('சுவாமிமலை');
        if (activeFilter === 'Thiruthani') return s.temple === 'Thiruthani' || s.templeTamil?.includes('திருத்தணி');
        if (activeFilter === 'Vayaloor') return s.temple === 'Vayaloor' || s.templeTamil?.includes('வயலூர்');
        if (activeFilter === 'Kanchipuram') return s.temple === 'Kanchipuram' || s.templeTamil?.includes('காஞ்சீபுரம்');
        if (activeFilter === 'Thiruvannamalai') return s.temple === 'Thiruvannamalai' || s.templeTamil?.includes('திருவண்ணாமலை');
        return true;
      });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <Header title={t('tabSearch')} />
      
      <View style={styles.container}>
        <SearchBar 
          value={query} 
          onChangeText={setQuery} 
          placeholder={t('searchPlaceholder')} 
          onClear={() => setQuery('')}
        />

        {/* Filter chips */}
        <View style={styles.filterContainer}>
          <FlatList
            data={FILTER_TAGS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isSelected = activeFilter === item.id;
              return (
                <TouchableOpacity
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceElevated,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                  onPress={() => setActiveFilter(item.id)}
                >
                  <Text
                    style={[
                      typography.label,
                      { color: isSelected ? '#FFF' : theme.colors.textSecondary },
                    ]}
                  >
                    {t(item.labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={[typography.caption, { color: theme.colors.textMuted }]}>
            {isSearching ? 'Searching...' : t('foundSongs', { count: displayedSongs.length })}
          </Text>
          {isSearching && <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginLeft: spacing.xs }} />}
        </View>

        {/* Results List */}
        <FlatList
          data={displayedSongs}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          initialNumToRender={15}
          maxToRenderPerBatch={20}
          windowSize={10}
          renderItem={({ item }) => <SongListItem song={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={theme.colors.textMuted} />
              <Text style={[typography.h3, { color: theme.colors.text, marginTop: spacing.md }]}>
                {t('noSongsFound')}
              </Text>
              <Text style={[typography.body, { color: theme.colors.textSecondary, textAlign: 'center', marginTop: spacing.xs }]}>
                {t('searchDesc')}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  filterContainer: {
    marginVertical: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginRight: spacing.xs,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing['4xl'],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['5xl'],
  },
});
