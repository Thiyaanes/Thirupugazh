import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThirupugazhSong } from '../types';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, borderRadius } from '../theme';
import { FavoriteButton } from './FavoriteButton';

interface SongListItemProps {
  song: ThirupugazhSong;
  onPress?: () => void;
  showThumbnail?: boolean;
}

export const SongListItem = ({ song, onPress, showThumbnail = true }: SongListItemProps) => {
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
      style={[styles.container, { borderBottomColor: theme.colors.border }]} 
      onPress={handlePress}
    >
      {showThumbnail && (
        <View style={styles.thumbnailContainer}>
          <Image 
            source={require('../../assets/devotional1.png')} 
            style={styles.thumbnail} 
          />
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{song.number}</Text>
          </View>
        </View>
      )}
      
      <View style={styles.contentContainer}>
        <Text style={[typography.tamilSubtitle, { color: theme.colors.text }]} numberOfLines={1}>
          {song.titleTamil}
        </Text>
        <Text style={[typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]} numberOfLines={1}>
          {song.titleEnglish}
        </Text>
        <Text style={[typography.label, { color: theme.colors.primary, marginTop: spacing.xs }]} numberOfLines={1}>
          📍 {song.templeTamil}
        </Text>
      </View>

      <View style={styles.actionContainer}>
        <FavoriteButton songId={song.id} size={20} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginRight: spacing.md,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  numberBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderTopLeftRadius: borderRadius.sm,
  },
  numberText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  actionContainer: {
    paddingLeft: spacing.sm,
    justifyContent: 'center',
  },
});
