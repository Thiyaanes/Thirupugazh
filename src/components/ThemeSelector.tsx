import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { ThemeMode } from '../types';
import { spacing, typography, borderRadius, shadows } from '../theme';

export const ThemeSelector = () => {
  const { theme, setMode } = useTheme();

  const ThemeOption = ({ mode, label, color1, color2 }: { mode: ThemeMode, label: string, color1: string, color2: string }) => {
    const isActive = theme.mode === mode;
    
    return (
      <TouchableOpacity 
        style={[styles.optionContainer, isActive && { borderColor: theme.colors.primary, borderWidth: 2 }]}
        onPress={() => setMode(mode)}
        activeOpacity={0.8}
      >
        <View style={[styles.colorPreview, { backgroundColor: color1 }]}>
          <View style={[styles.colorHalf, { backgroundColor: color2 }]} />
        </View>
        <Text style={[typography.button, { color: theme.colors.text, marginTop: spacing.sm }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[typography.label, { color: theme.colors.textSecondary, marginBottom: spacing.md }]}>
        APPEARANCE
      </Text>
      
      <View style={styles.optionsRow}>
        <ThemeOption mode="system" label="System" color1="#F0F0F0" color2="#333333" />
        <ThemeOption mode="light" label="Light" color1="#FFF8F0" color2="#D4520A" />
        <ThemeOption mode="dark" label="Dark" color1="#1A1218" color2="#F4A236" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.lg,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionContainer: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  colorPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    ...shadows.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorHalf: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '50%',
  },
});
