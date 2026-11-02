import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useLanguage } from '../../src/context/LanguageContext';
import { spacing, typography, borderRadius } from '../../src/theme';
import { Header } from '../../src/components/Header';
import { FeaturedCard } from '../../src/components/FeaturedCard';
import { CategoryCard } from '../../src/components/CategoryCard';
import { RecentlyViewed } from '../../src/components/RecentlyViewed';
import { SongListItem } from '../../src/components/SongListItem';
import { Category, ThirupugazhSong } from '../../src/types';
import thirupugazhData from '../../src/data/thirupugazh.json';

const TEMPLE_CATEGORIES: Category[] = [
  { id: 'thirupparangkunram', name: 'Thirupparankundram', nameTamil: 'திருப்பரங்குன்றம்', icon: 'flame', color: '#E58A1F' },
  { id: 'tiruchendur', name: 'Tiruchendur', nameTamil: 'திருச்செந்தூர்', icon: 'water', color: '#0077B6' },
  { id: 'palani', name: 'Palani', nameTamil: 'பழநி', icon: 'sunny', color: '#D4520A' },
  { id: 'swamimalai', name: 'Swamimalai', nameTamil: 'சுவாமிமலை', icon: 'book', color: '#2A9D8F' },
  { id: 'thiruthani', name: 'Thiruthani', nameTamil: 'திருத்தணிகை', icon: 'shield', color: '#E76F51' },
  { id: 'pazhamudircholai', name: 'Pazhamudircholai', nameTamil: 'பழமுதிர்ச்சோலை', icon: 'leaf', color: '#38B000' },
  { id: 'vayaloor', name: 'Vayaloor', nameTamil: 'வயலூர்', icon: 'location', color: '#F4A261' },
  { id: 'vinaayakar', name: 'Vinayagar', nameTamil: 'விநாயகர் துதி', icon: 'star', color: '#7B2CBF' },
  { id: 'kanchipuram', name: 'Kanchipuram', nameTamil: 'காஞ்சீபுரம்', icon: 'business', color: '#9D4EDD' },
  { id: 'thiruvarunai', name: 'Thiruvannamalai', nameTamil: 'திருவண்ணாமலை', icon: 'flower', color: '#B33951' },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();

  const songs = thirupugazhData as ThirupugazhSong[];
  const featuredSong = songs.find(s => s.isFeatured) || songs[0];

  const [displayLimit, setDisplayLimit] = React.useState(50);

  const displayedSongs = songs.slice(0, displayLimit);
  const isAllLoaded = displayLimit >= songs.length;

  const handleCategoryPress = (category: Category) => {
    router.push(`/category/${category.id}` as any);
  };

  const handleLoadMore = () => {
    setDisplayLimit(prev => Math.min(prev + 100, songs.length));
  };

  const handleSeeAll = () => {
    setDisplayLimit(songs.length);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Header 
        title={t('appName')} 
        rightComponent={
          <TouchableOpacity onPress={() => router.push('/search' as any)} accessibilityRole="button">
            <Ionicons name="search-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isNearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 400;
          if (isNearBottom && displayLimit < songs.length) {
            setDisplayLimit(prev => Math.min(prev + 50, songs.length));
          }
        }}
        scrollEventThrottle={200}
      >
        {/* Quick Search Banner */}
        <TouchableOpacity 
          style={[styles.searchBarContainer, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}
          onPress={() => router.push('/search' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="search" size={20} color={theme.colors.textMuted} style={styles.searchIcon} />
          <Text style={[typography.body, { color: theme.colors.textMuted }]}>
            {t('searchPlaceholder')}
          </Text>
        </TouchableOpacity>

        {/* Hero Featured Thirupugazh */}
        {featuredSong && <FeaturedCard song={featuredSong} />}

        {/* Categories / Temples */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.h3, { color: theme.colors.text }]}>
            {t('templesHeader')}
          </Text>
        </View>

        <View style={styles.categoriesGrid}>
          {TEMPLE_CATEGORIES.map((cat) => (
            <CategoryCard 
              key={cat.id} 
              category={cat} 
              onPress={() => handleCategoryPress(cat)} 
            />
          ))}
        </View>

        {/* Recently Viewed */}
        <RecentlyViewed />

        {/* All Thirupugazh Songs Header */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.h3, { color: theme.colors.text }]}>
            {t('popularHeader', { count: songs.length })}
          </Text>
          {!isAllLoaded && (
            <TouchableOpacity onPress={handleSeeAll}>
              <Text style={[typography.label, { color: theme.colors.primary }]}>
                {t('seeAll')} ({songs.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Songs List */}
        <View style={styles.songsList}>
          {displayedSongs.map((song) => (
            <SongListItem key={song.id} song={song} />
          ))}
        </View>

        {/* Load More Button */}
        {!isAllLoaded && (
          <TouchableOpacity
            style={[styles.loadMoreBtn, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}
            onPress={handleLoadMore}
          >
            <Text style={[typography.button, { color: theme.colors.primary }]}>
              {t('loadMoreSongs', { count: songs.length - displayLimit })}
            </Text>
            <Ionicons name="chevron-down" size={18} color={theme.colors.primary} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.md,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    marginVertical: spacing.xs,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  songsList: {
    marginTop: spacing.xs,
  },
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginVertical: spacing.lg,
  },
});
