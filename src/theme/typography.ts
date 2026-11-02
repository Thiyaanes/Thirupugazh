import { StyleSheet } from 'react-native';

export const typography = StyleSheet.create({
  // Tamil text styles
  tamilTitle: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 36,
  },
  tamilSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 28,
  },
  tamilBody: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 28,
  },
  tamilLyrics: {
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 36,
  },
  tamilLyricsLarge: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 42,
  },
  // English text styles
  h1: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  h4: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  button: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 14,
  },
});
