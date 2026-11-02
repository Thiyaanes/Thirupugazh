import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { ThirupugazhSong } from '../types';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, borderRadius, shadows } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface FeaturedCardProps {
  song: ThirupugazhSong;
}

export const FeaturedCard = ({ song }: FeaturedCardProps) => {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        theme.mode === 'light' ? shadows.md : undefined
      ]} 
      onPress={() => router.push(`/song/${song.id}` as any)}
      activeOpacity={0.8}
    >
      <ImageBackground 
        source={require('../../assets/devotional1.png')} 
        style={styles.imageBackground}
        imageStyle={{ borderRadius: borderRadius.xl }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            
            <View style={styles.titleContainer}>
              <Text style={styles.tamilTitle} numberOfLines={2}>
                {song.titleTamil}
              </Text>
              <Text style={styles.englishTitle} numberOfLines={1}>
                {song.titleEnglish} • Thirupugazh {song.number}
              </Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={[styles.readButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => router.push(`/song/${song.id}` as any)}
              >
                <Ionicons name="book" size={16} color="#FFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Read Lyrics</Text>
              </TouchableOpacity>
              
              <Text style={styles.templeText} numberOfLines={1}>
                📍 {song.templeTamil}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    width: '100%',
    borderRadius: borderRadius.xl,
    marginVertical: spacing.md,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.xl,
  },
  gradient: {
    flex: 1,
    borderRadius: borderRadius.xl,
    justifyContent: 'flex-end',
  },
  content: {
    padding: spacing.lg,
  },
  badge: {
    position: 'absolute',
    top: -100, // Roughly positions it at the top of the card
    left: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  titleContainer: {
    marginBottom: spacing.md,
  },
  tamilTitle: {
    ...typography.tamilTitle,
    color: '#FFF',
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  englishTitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.8)',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  buttonIcon: {
    marginRight: spacing.xs,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  templeText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
});
