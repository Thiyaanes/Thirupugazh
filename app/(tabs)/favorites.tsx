import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useLanguage } from '../../src/context/LanguageContext';
import { useFavorites } from '../../src/hooks/useFavorites';
import { spacing, typography, borderRadius } from '../../src/theme';
import { Header } from '../../src/components/Header';
import { SongListItem } from '../../src/components/SongListItem';
import { ThirupugazhSong } from '../../src/types';
import thirupugazhData from '../../src/data/thirupugazh.json';

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const { favorites, loading } = useFavorites();

  const allSongs = thirupugazhData as ThirupugazhSong[];
  const favoriteSongs = favorites
    .map(id => allSongs.find(song => song.id === id))
    .filter(Boolean) as ThirupugazhSong[];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <Header title={t('tabFavorites')} />

      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            data={favoriteSongs}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <SongListItem song={item} />}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(212, 82, 10, 0.1)' }]}>
                  <Ionicons name="heart-dislike-outline" size={48} color={theme.colors.primary} />
                </View>

                <Text style={[typography.h3, { color: theme.colors.text, marginTop: spacing.lg }]}>
                  {t('noFavoritesTitle')}
                </Text>
                
                <Text style={[typography.body, { color: theme.colors.textSecondary, textAlign: 'center', marginTop: spacing.xs, marginHorizontal: spacing.xl }]}>
                  {t('noFavoritesDesc')}
                </Text>

                <TouchableOpacity 
                  style={[styles.exploreBtn, { backgroundColor: theme.colors.primary }]}
                  onPress={() => router.push('/search' as any)}
                >
                  <Ionicons name="compass-outline" size={20} color="#FFF" style={{ marginRight: spacing.xs }} />
                  <Text style={styles.exploreBtnText}>{t('tabSearch')}</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: spacing.md,
    paddingBottom: spacing['4xl'],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['5xl'],
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    marginTop: spacing.xl,
  },
  exploreBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
