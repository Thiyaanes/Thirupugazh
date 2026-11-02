import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useLanguage } from '../../src/context/LanguageContext';
import { useRecentlyViewed } from '../../src/hooks/useRecentlyViewed';
import { useSyncedLyrics } from '../../src/hooks/useSyncedLyrics';
import { spacing, typography, borderRadius } from '../../src/theme';
import { Header } from '../../src/components/Header';
import { FavoriteButton } from '../../src/components/FavoriteButton';
import { LyricsViewer } from '../../src/components/LyricsViewer';
import { SyncedLyrics } from '../../src/components/SyncedLyrics';
import { EnglishLyricsViewer } from '../../src/components/EnglishLyricsViewer';
import { ReadingSettings } from '../../src/components/ReadingSettings';
import { ThirupugazhSong } from '../../src/types';
import thirupugazhData from '../../src/data/thirupugazh.json';

type ViewMode = 'lyrics' | 'english' | 'synced';

export default function SongDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { addRecentSong } = useRecentlyViewed();
  const [viewMode, setViewMode] = useState<ViewMode>('lyrics');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const song = (thirupugazhData as ThirupugazhSong[]).find(s => s.id === id);

  const { 
    currentTime, 
    activeIndex, 
    isPlaying, 
    togglePlay, 
    seekTo 
  } = useSyncedLyrics(song?.syncedLyrics || []);

  useEffect(() => {
    if (id) {
      addRecentSong(id);
    }
  }, [id]);

  if (!song) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <Header showBack onBack={() => router.back()} title="Song Not Found" />
        <View style={styles.errorContainer}>
          <Text style={[typography.h3, { color: theme.colors.text }]}>Song Not Found</Text>
          <TouchableOpacity 
            style={[styles.backBtn, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      {/* Top Header */}
      <Header
        showBack
        onBack={() => router.back()}
        title={song.titleTamil || song.titleEnglish}
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => setShowSettingsModal(true)}
              accessibilityRole="button"
            >
              <Ionicons name="options-outline" size={22} color={theme.colors.text} />
            </TouchableOpacity>
            <FavoriteButton songId={song.id} size={22} />
          </View>
        }
      />

      {/* Mode Switcher Tabs */}
      <View style={[styles.modeBar, { backgroundColor: theme.colors.surfaceElevated, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={[
            styles.modeTab,
            viewMode === 'lyrics' && { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => setViewMode('lyrics')}
        >
          <Ionicons 
            name="book-outline" 
            size={15} 
            color={viewMode === 'lyrics' ? '#FFF' : theme.colors.textSecondary} 
          />
          <Text 
            style={[
              styles.modeTabText, 
              { color: viewMode === 'lyrics' ? '#FFF' : theme.colors.textSecondary }
            ]}
            numberOfLines={1}
          >
            {t('songTabPaadal')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeTab,
            viewMode === 'english' && { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => setViewMode('english')}
        >
          <Ionicons 
            name="language-outline" 
            size={15} 
            color={viewMode === 'english' ? '#FFF' : theme.colors.textSecondary} 
          />
          <Text 
            style={[
              styles.modeTabText, 
              { color: viewMode === 'english' ? '#FFF' : theme.colors.textSecondary }
            ]}
            numberOfLines={1}
          >
            {t('songTabEnglish')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeTab,
            viewMode === 'synced' && { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => setViewMode('synced')}
        >
          <Ionicons 
            name="musical-notes-outline" 
            size={15} 
            color={viewMode === 'synced' ? '#FFF' : theme.colors.textSecondary} 
          />
          <Text 
            style={[
              styles.modeTabText, 
              { color: viewMode === 'synced' ? '#FFF' : theme.colors.textSecondary }
            ]}
            numberOfLines={1}
          >
            {t('songTabSynced')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {viewMode === 'lyrics' ? (
          <LyricsViewer song={song} />
        ) : viewMode === 'english' ? (
          <EnglishLyricsViewer song={song} />
        ) : (
          <SyncedLyrics 
            song={song} 
            currentTime={currentTime}
            activeIndex={activeIndex}
            isPlaying={isPlaying}
            onSeek={seekTo}
            onTogglePlay={togglePlay}
          />
        )}
      </View>

      {/* Song Navigation Footer (Prev / Next Songs) */}
      <View style={[styles.navFooter, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <TouchableOpacity
          style={[styles.navBtn, song.number <= 1 && styles.disabledBtn]}
          disabled={song.number <= 1}
          onPress={() => {
            const allSongs = thirupugazhData as ThirupugazhSong[];
            const prevSong = allSongs.find(s => s.number === song.number - 1);
            if (prevSong) {
              router.replace(`/song/${prevSong.id}` as any);
            }
          }}
        >
          <Ionicons name="chevron-back" size={20} color={song.number <= 1 ? theme.colors.textMuted : theme.colors.primary} />
          <Text style={[styles.navBtnText, { color: song.number <= 1 ? theme.colors.textMuted : theme.colors.text }]}>
            {song.number > 1 ? t('songNavPrev', { num: song.number - 1 }) : t('songNavFirst')}
          </Text>
        </TouchableOpacity>

        <Text style={[typography.caption, { color: theme.colors.textMuted }]}>
          {song.number} / {(thirupugazhData as ThirupugazhSong[]).length}
        </Text>

        <TouchableOpacity
          style={[styles.navBtn, song.number >= (thirupugazhData as ThirupugazhSong[]).length && styles.disabledBtn]}
          disabled={song.number >= (thirupugazhData as ThirupugazhSong[]).length}
          onPress={() => {
            const allSongs = thirupugazhData as ThirupugazhSong[];
            const nextSong = allSongs.find(s => s.number === song.number + 1);
            if (nextSong) {
              router.replace(`/song/${nextSong.id}` as any);
            }
          }}
        >
          <Text style={[styles.navBtnText, { color: song.number >= (thirupugazhData as ThirupugazhSong[]).length ? theme.colors.textMuted : theme.colors.text }]}>
            {song.number < (thirupugazhData as ThirupugazhSong[]).length ? t('songNavNext', { num: song.number + 1 }) : t('songNavLast')}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={song.number >= (thirupugazhData as ThirupugazhSong[]).length ? theme.colors.textMuted : theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Reading Settings Slide-Up Modal */}
      <Modal
        visible={showSettingsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <ReadingSettings onClose={() => setShowSettingsModal(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  modeBar: {
    flexDirection: 'row',
    padding: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: 2,
    borderRadius: borderRadius.md,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 3,
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    marginTop: spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '60%',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  navFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  navBtnText: {
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: spacing.xs,
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
