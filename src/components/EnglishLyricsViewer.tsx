import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThirupugazhSong } from '../types';
import { useTheme } from '../hooks/useTheme';
import { useReadingSettings } from '../hooks/useReadingSettings';
import { spacing } from '../theme';

interface EnglishLyricsViewerProps {
  song: ThirupugazhSong;
}

export const EnglishLyricsViewer = ({ song }: EnglishLyricsViewerProps) => {
  const { theme } = useTheme();
  const { settings, loading } = useReadingSettings();

  if (loading) return null;

  const englishLines = song.lyricsEnglish || [];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.primary, fontSize: settings.fontSize + 4 }]}>
          {song.titleEnglish}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Thirupugazh {song.number} • {song.templeTamil}
        </Text>
      </View>

      {/* Lyrics Lines */}
      {englishLines.length > 0 ? (
        <View style={styles.lyricsContainer}>
          {englishLines.map((line, i) => {
            // Detect empty lines — render as spacer
            if (!line.trim()) {
              return <View key={i} style={styles.spacer} />;
            }
            return (
              <Text
                key={i}
                style={[
                  styles.lyricLine,
                  {
                    color: theme.colors.text,
                    fontSize: settings.fontSize,
                    lineHeight: settings.fontSize * settings.lineSpacing,
                  },
                ]}
              >
                {line}
              </Text>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyIcon]}>📜</Text>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary, fontSize: settings.fontSize * 0.85 }]}>
            English lyrics are not available for this song yet.
          </Text>
        </View>
      )}

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: 'rgba(0,0,0,0.1)' }]}>
        <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
          {song.singer ? `Singer: ${song.singer}` : ''}
          {song.raagam && song.raagam !== 'N/A' ? ` • Raagam: ${song.raagam}` : ''}
          {song.talam && song.talam !== 'N/A' ? ` • Talam: ${song.talam}` : ''}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing['6xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  lyricsContainer: {
    marginTop: spacing.sm,
  },
  lyricLine: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  spacer: {
    height: spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: spacing['4xl'],
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    marginTop: spacing['3xl'],
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: spacing.lg,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
