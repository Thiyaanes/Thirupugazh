import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThirupugazhSong } from '../types';
import { useTheme } from '../hooks/useTheme';
import { useReadingSettings } from '../hooks/useReadingSettings';
import { spacing } from '../theme';

interface LyricsViewerProps {
  song: ThirupugazhSong;
}

export const LyricsViewer = ({ song }: LyricsViewerProps) => {
  const { theme } = useTheme();
  const { settings, loading } = useReadingSettings();

  if (loading) return null;

  const showTamil = settings.displayMode === 'tamil' || settings.displayMode === 'both';
  const showTransliteration = settings.displayMode === 'transliteration' || settings.displayMode === 'both';
  const showEnglish = settings.displayMode === 'english';
  const showMeaning = settings.displayMode === 'meaning';

  // The arrays might not be exactly equal in length if the data is malformed,
  // but we'll map over the longest array
  const lineCount = Math.max(
    song.lyricsTamil?.length || 0,
    song.transliteration?.length || 0,
    showEnglish ? (song.lyricsEnglish?.length || 0) : 0
  );
  const lines = Array.from({ length: lineCount }, (_, i) => i);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.primary, fontSize: settings.fontSize + 4 }]}>
          {(showTransliteration && !showTamil) || showEnglish ? song.titleEnglish : song.titleTamil}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Thirupugazh {song.number} • {song.templeTamil}
        </Text>
      </View>

      {showMeaning ? (
        <View style={styles.meaningContainer}>
          <Text style={[
            styles.meaningText, 
            { 
              color: theme.colors.text,
              fontSize: settings.fontSize,
              lineHeight: settings.fontSize * settings.lineSpacing 
            }
          ]}>
            {song.meaning || "Meaning not available for this song yet."}
          </Text>
        </View>
      ) : (
        <View style={styles.lyricsContainer}>
          {showEnglish ? (
            // English-only mode: show lyricsEnglish array
            song.lyricsEnglish && song.lyricsEnglish.length > 0 ? (
              song.lyricsEnglish.map((line, i) => (
                <View key={i} style={[styles.lineContainer, { marginBottom: settings.fontSize * (settings.lineSpacing - 1) }]}>
                  <Text style={[
                    styles.englishLine,
                    {
                      color: theme.colors.text,
                      fontSize: settings.fontSize,
                    }
                  ]}>
                    {line}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={[styles.transliterationLine, { color: theme.colors.textSecondary, fontSize: settings.fontSize }]}>
                English lyrics not available for this song yet.
              </Text>
            )
          ) : (
            lines.map((i) => (
              <View key={i} style={[styles.lineContainer, { marginBottom: settings.fontSize * (settings.lineSpacing - 1) }]}>
                {showTamil && song.lyricsTamil?.[i] && (
                  <Text style={[
                    styles.tamilLine, 
                    { 
                      color: theme.colors.text,
                      fontSize: settings.fontSize,
                      lineHeight: settings.fontSize * 1.5 // Tamil script needs specific line height
                    }
                  ]}>
                    {song.lyricsTamil[i]}
                  </Text>
                )}
                {showTransliteration && song.transliteration?.[i] && (
                  <Text style={[
                    styles.transliterationLine, 
                    { 
                      color: showTamil ? theme.colors.textSecondary : theme.colors.text,
                      fontSize: showTamil ? settings.fontSize * 0.85 : settings.fontSize,
                      marginTop: showTamil ? spacing.xs : 0,
                    }
                  ]}>
                    {song.transliteration[i]}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>
      )}
      
      <View style={styles.footer}>
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
    marginBottom: spacing['2xl'],
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
    marginTop: spacing.md,
  },
  meaningContainer: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
  },
  meaningText: {
    textAlign: 'justify',
  },
  lineContainer: {
    alignItems: 'center',
  },
  tamilLine: {
    textAlign: 'center',
  },
  transliterationLine: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  englishLine: {
    textAlign: 'center',
  },
  footer: {
    marginTop: spacing['3xl'],
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: spacing.lg,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
