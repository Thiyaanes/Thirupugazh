import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, Dimensions, TouchableOpacity, Text } from 'react-native';
import { ThirupugazhSong } from '../types';
import { useTheme } from '../hooks/useTheme';
import { useReadingSettings } from '../hooks/useReadingSettings';
import { LyricsLine } from './LyricsLine';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius } from '../theme';

const { height } = Dimensions.get('window');
const ITEM_HEIGHT = 80; // Approximate height of each line, used for scrolling

interface SyncedLyricsProps {
  song: ThirupugazhSong;
  currentTime: number;
  activeIndex: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
  onTogglePlay: () => void;
}

export const SyncedLyrics = ({ 
  song, 
  currentTime, 
  activeIndex, 
  isPlaying, 
  onSeek,
  onTogglePlay 
}: SyncedLyricsProps) => {
  const { theme } = useTheme();
  const { settings } = useReadingSettings();
  const flatListRef = useRef<FlatList>(null);
  const isAutoScrolling = useRef(true);

  // Auto-scroll when active index changes
  useEffect(() => {
    if (isAutoScrolling.current && flatListRef.current && song.syncedLyrics && song.syncedLyrics.length > 0) {
      try {
        flatListRef.current.scrollToIndex({
          index: activeIndex,
          animated: true,
          viewPosition: 0.5, // Center the active item
        });
      } catch (e) {
        // Sometimes scrollToIndex fails if items aren't rendered yet
      }
    }
  }, [activeIndex, song.syncedLyrics]);

  const handleLinePress = (index: number, timestamp: number) => {
    isAutoScrolling.current = true;
    onSeek(timestamp);
  };

  const showTamil = settings.displayMode === 'tamil' || settings.displayMode === 'both';
  const showTrans = settings.displayMode === 'transliteration' || settings.displayMode === 'both';

  if (!song.syncedLyrics || song.syncedLyrics.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>No synced lyrics available for this song.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.demoBanner}>
        <Ionicons name="information-circle" size={16} color={theme.colors.primary} />
        <Text style={[styles.demoText, { color: theme.colors.primary }]}>
          DEMO MODE (No Audio)
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={song.syncedLyrics}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => {
          isAutoScrolling.current = false;
        }}
        renderItem={({ item, index }) => (
          <LyricsLine 
            line={item}
            isActive={index === activeIndex}
            onPress={() => handleLinePress(index, item.timestamp)}
            showTamil={showTamil}
            showTransliteration={showTrans}
          />
        )}
        getItemLayout={(data, index) => (
          {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
        )}
      />

      <View style={[styles.controlsContainer, { backgroundColor: theme.colors.surfaceElevated, borderTopColor: theme.colors.border }]}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: theme.colors.primary,
                // Rough estimate of progress based on last timestamp
                width: `${Math.min(100, (currentTime / (song.syncedLyrics[song.syncedLyrics.length-1].timestamp + 10)) * 100)}%`
              }
            ]} 
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.playButton, { backgroundColor: theme.colors.primary }]}
          onPress={onTogglePlay}
        >
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={24} 
            color="#FFF" 
            style={{ marginLeft: isPlaying ? 0 : 3 }} 
          />
          <Text style={styles.playButtonText}>
            {isPlaying ? "Pause Demo" : "Start Demo"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(212, 82, 10, 0.1)',
  },
  demoText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
    letterSpacing: 1,
  },
  listContent: {
    paddingTop: height * 0.3,
    paddingBottom: height * 0.4,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    paddingBottom: spacing['3xl'],
    borderTopWidth: 1,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing['2xl'],
    borderRadius: borderRadius.full,
    width: 200,
  },
  playButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: spacing.sm,
  },
});
