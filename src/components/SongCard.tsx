import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThirupugazhSong } from '../types';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, borderRadius, shadows } from '../theme';
import { FavoriteButton } from './FavoriteButton';

interface SongCardProps {
  song: ThirupugazhSong;
  onPress?: () => void;
}

export const SongCard = ({ song, onPress }: SongCardProps) => {
  const router = useRouter();
  const { theme } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/song/${song.id}` as any);
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: theme.colors.surfaceElevated },
        theme.mode === 'light' ? shadows.sm : undefined
      ]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {/* Placeholder for song image */}
        <Image 
          source={require('../../assets/devotional1.png')} 
          style={styles.image} 
          resizeMode="cover"
        />
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{song.number}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <View style={styles.titleWrapper}>
            <Text style={[typography.tamilSubtitle, { color: theme.colors.text }]} numberOfLines={1}>
              {song.titleTamil}
            </Text>
            <Text style={[typography.caption, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {song.titleEnglish}
            </Text>
          </View>
          <FavoriteButton songId={song.id} />
        </View>
        
        <Text style={[typography.caption, { color: theme.colors.primary, marginTop: spacing.xs }]} numberOfLines={1}>
          📍 {song.templeTamil}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  imageContainer: {
    height: 120,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  numberBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  numberText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleWrapper: {
    flex: 1,
    paddingRight: spacing.xs,
  },
});
