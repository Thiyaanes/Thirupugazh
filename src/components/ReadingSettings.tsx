import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useReadingSettings } from '../hooks/useReadingSettings';
import { spacing, typography, borderRadius } from '../theme';

interface ReadingSettingsProps {
  onClose: () => void;
}

export const ReadingSettings = ({ onClose }: ReadingSettingsProps) => {
  const { theme } = useTheme();
  const { settings, updateSettings } = useReadingSettings();

  const handleFontSizeChange = (increment: number) => {
    const newSize = Math.max(14, Math.min(32, settings.fontSize + increment));
    updateSettings({ fontSize: newSize });
  };

  const OptionButton = ({ 
    label, 
    active, 
    onPress, 
    icon 
  }: { 
    label: string, 
    active: boolean, 
    onPress: () => void,
    icon?: string
  }) => (
    <TouchableOpacity 
      style={[
        styles.optionBtn, 
        { 
          backgroundColor: active ? theme.colors.primary : 'transparent',
          borderColor: active ? theme.colors.primary : theme.colors.border
        }
      ]}
      onPress={onPress}
    >
      {icon && <Ionicons name={icon as any} size={16} color={active ? '#FFF' : theme.colors.text} style={styles.optionIcon} />}
      <Text style={[styles.optionText, { color: active ? '#FFF' : theme.colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Text style={[typography.h3, { color: theme.colors.text }]}>Reading Settings</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Text Size */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Text Size</Text>
          <View style={styles.sizeControl}>
            <TouchableOpacity 
              style={[styles.sizeBtn, { backgroundColor: theme.colors.surfaceElevated }]}
              onPress={() => handleFontSizeChange(-2)}
            >
              <Text style={[typography.h2, { color: theme.colors.text }]}>A-</Text>
            </TouchableOpacity>
            
            <Text style={[typography.h2, { color: theme.colors.text, marginHorizontal: spacing.xl }]}>
              {settings.fontSize}
            </Text>
            
            <TouchableOpacity 
              style={[styles.sizeBtn, { backgroundColor: theme.colors.surfaceElevated }]}
              onPress={() => handleFontSizeChange(2)}
            >
              <Text style={[typography.h1, { color: theme.colors.text }]}>A+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Display Mode */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Language Display</Text>
          <View style={styles.optionsRow}>
            <OptionButton 
              label="Tamil Only" 
              active={settings.displayMode === 'tamil'} 
              onPress={() => updateSettings({ displayMode: 'tamil' })} 
            />
            <OptionButton 
              label="Transliteration" 
              active={settings.displayMode === 'transliteration'} 
              onPress={() => updateSettings({ displayMode: 'transliteration' })} 
            />
          </View>
          <View style={styles.optionsRow}>
            <OptionButton 
              label="Lyrics (English)" 
              active={settings.displayMode === 'english'} 
              onPress={() => updateSettings({ displayMode: 'english' })} 
            />
            <OptionButton 
              label="Both" 
              active={settings.displayMode === 'both'} 
              onPress={() => updateSettings({ displayMode: 'both' })} 
            />
          </View>
          <View style={styles.optionsRow}>
            <OptionButton 
              label="Meaning" 
              active={settings.displayMode === 'meaning'} 
              onPress={() => updateSettings({ displayMode: 'meaning' })} 
            />
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    ...typography.label,
    marginBottom: spacing.md,
  },
  sizeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeBtn: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  optionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginHorizontal: spacing.xs,
  },
  optionIcon: {
    marginRight: spacing.xs,
  },
  optionText: {
    ...typography.button,
  },
});
