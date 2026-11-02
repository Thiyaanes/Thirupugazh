import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { useTheme } from '../hooks/useTheme';
import { SongCard } from './SongCard';
import { ThirupugazhSong } from '../types';
import thirupugazhData from '../data/thirupugazh.json';
import { spacing, typography } from '../theme';

export const RecentlyViewed = () => {
  const { recentSongs, loading } = useRecentlyViewed();
  const { theme } = useTheme();

  if (loading || recentSongs.length === 0) {
    return null;
  }

  // Map IDs to actual song data
  const songs = recentSongs
    .map(id => (thirupugazhData as ThirupugazhSong[]).find(s => s.id === id))
    .filter(Boolean) as ThirupugazhSong[];

  return (
    <View style={styles.container}>
      <Text style={[typography.h3, { color: theme.colors.text, marginBottom: spacing.md }]}>
        Recently Viewed
      </Text>
      
      <FlatList
        data={songs}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SongCard song={item} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.lg,
  },
  listContent: {
    paddingRight: spacing.lg,
  },
});
