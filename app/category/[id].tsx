import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { spacing, typography } from '../../src/theme';
import { Header } from '../../src/components/Header';
import { SongListItem } from '../../src/components/SongListItem';
import { ThirupugazhSong } from '../../src/types';
import thirupugazhData from '../../src/data/thirupugazh.json';

const CATEGORY_MAP: Record<string, { name: string; nameTamil: string; templeMatch: string[] }> = {
  thirupparangkunram: { name: 'Thirupparankundram', nameTamil: 'திருப்பரங்குன்றம்', templeMatch: ['thirupparangkunram', 'thirupparangkun\'ram', 'திருப்பரங்குன்றம்'] },
  tiruchendur: { name: 'Tiruchendur', nameTamil: 'திருச்செந்தூர்', templeMatch: ['tiruchendur', 'திருச்செந்தூர்', 'திருச்செந்துார்'] },
  palani: { name: 'Palani', nameTamil: 'பழநி திருப்புகழ்', templeMatch: ['palani', 'பழநி'] },
  swamimalai: { name: 'Swamimalai', nameTamil: 'சுவாமிமலை', templeMatch: ['swamimalai', 'சுவாமிமலை'] },
  thiruthani: { name: 'Thiruthani', nameTamil: 'திருத்தணிகை', templeMatch: ['thiruthani', 'திருத்தணி', 'திருத்தணிகை'] },
  pazhamudircholai: { name: 'Pazhamudircholai', nameTamil: 'பழமுதிர்ச்சோலை', templeMatch: ['pazhamudircholai', 'பழமுதிர்ச்சோலை'] },
  vayaloor: { name: 'Vayaloor', nameTamil: 'வயலூர் திருப்புகழ்', templeMatch: ['vayaloor', 'வயலூர்'] },
  vinaayakar: { name: 'Vinayagar', nameTamil: 'விநாயகர் துதி', templeMatch: ['vinaayakar', 'vi:naayakar', 'விநாயகர்'] },
  kanchipuram: { name: 'Kanchipuram', nameTamil: 'காஞ்சீபுரம் திருப்புகழ்', templeMatch: ['kanchipuram', 'காஞ்சீபுரம்'] },
  thiruvarunai: { name: 'Thiruvannamalai', nameTamil: 'திருவண்ணாமலை', templeMatch: ['thiruvarunai', 'thiruvaru\'nai', 'திருவண்ணாமலை'] },
};

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();

  const categoryInfo = CATEGORY_MAP[id?.toLowerCase() || ''] || {
    name: id || 'Temple',
    nameTamil: id || 'தலம்',
    templeMatch: [id?.toLowerCase() || ''],
  };

  const allSongs = thirupugazhData as ThirupugazhSong[];
  const categorySongs = allSongs.filter(song => {
    const templeLower = (song.temple || '').toLowerCase();
    const templeTamilLower = (song.templeTamil || '').toLowerCase();
    return categoryInfo.templeMatch.some(
      match => templeLower.includes(match.toLowerCase()) || templeTamilLower.includes(match.toLowerCase())
    );
  });

  // Fallback to all songs if category filter produced empty list
  const songsToDisplay = categorySongs.length > 0 ? categorySongs : allSongs;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <Header 
        showBack 
        onBack={() => router.back()} 
        title={categoryInfo.nameTamil} 
      />

      <View style={styles.container}>
        <View style={styles.summaryBar}>
          <Text style={[typography.caption, { color: theme.colors.textMuted }]}>
            {songsToDisplay.length} Thirupugazh Songs ({categoryInfo.name})
          </Text>
        </View>

        <FlatList
          data={songsToDisplay}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <SongListItem song={item} />}
          contentContainerStyle={styles.listContent}
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
  summaryBar: {
    paddingVertical: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing['4xl'],
  },
});
