import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useLanguage } from '../../src/context/LanguageContext';
import { useReadingSettings } from '../../src/hooks/useReadingSettings';
import { spacing, typography, borderRadius } from '../../src/theme';
import { Header } from '../../src/components/Header';
import { ThemeSelector } from '../../src/components/ThemeSelector';
import thirupugazhData from '../../src/data/thirupugazh.json';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { t, uiLanguage, setUiLanguage } = useLanguage();
  const { settings, updateSettings } = useReadingSettings();

  const handleFontSize = (delta: number) => {
    const newSize = Math.max(14, Math.min(32, settings.fontSize + delta));
    updateSettings({ fontSize: newSize });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <Header title={t('settingsTitle')} />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* App Language Section */}
        <View style={styles.section}>
          <Text style={[typography.label, { color: theme.colors.textSecondary, marginBottom: spacing.md }]}>
            APP LANGUAGE • செயலி மொழி
          </Text>

          <View style={[styles.settingCard, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="language-outline" size={22} color={theme.colors.primary} style={styles.settingIcon} />
              <Text style={[typography.h4, { color: theme.colors.text }]}>{t('appLanguage')}</Text>
            </View>

            <View style={[styles.modeGrid, { marginTop: spacing.md }]}>
              {[
                { id: 'en', label: t('englishOption') },
                { id: 'ta', label: t('tamilOption') },
              ].map((lang) => {
                const active = uiLanguage === lang.id;
                return (
                  <TouchableOpacity
                    key={lang.id}
                    style={[
                      styles.modeBtn,
                      {
                        backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                        borderColor: active ? theme.colors.primary : theme.colors.border,
                        width: '48%',
                      }
                    ]}
                    onPress={() => setUiLanguage(lang.id as any)}
                  >
                    <Text style={[typography.button, { color: active ? '#FFF' : theme.colors.text, fontSize: 13 }]}>
                      {lang.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Theme / Appearance */}
        <ThemeSelector />

        {/* Reading Settings */}
        <View style={styles.section}>
          <Text style={[typography.label, { color: theme.colors.textSecondary, marginBottom: spacing.md }]}>
            {t('readingPreferences').toUpperCase()}
          </Text>

          {/* Text Size Control */}
          <View style={[styles.settingCard, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="text-outline" size={20} color={theme.colors.primary} style={styles.settingIcon} />
                <Text style={[typography.h4, { color: theme.colors.text }]}>{t('fontSize')}</Text>
              </View>
              <View style={styles.stepperContainer}>
                <TouchableOpacity 
                  style={[styles.stepBtn, { backgroundColor: theme.colors.surface }]}
                  onPress={() => handleFontSize(-2)}
                >
                  <Text style={[typography.h3, { color: theme.colors.text }]}>-</Text>
                </TouchableOpacity>
                <Text style={[typography.h4, { color: theme.colors.text, marginHorizontal: spacing.md }]}>
                  {settings.fontSize}px
                </Text>
                <TouchableOpacity 
                  style={[styles.stepBtn, { backgroundColor: theme.colors.surface }]}
                  onPress={() => handleFontSize(2)}
                >
                  <Text style={[typography.h3, { color: theme.colors.text }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Language View Mode Control */}
          <View style={[styles.settingCard, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border, marginTop: spacing.md }]}>
            <Text style={[typography.h4, { color: theme.colors.text, marginBottom: spacing.sm }]}>
              {t('languageViewMode')}
            </Text>

            <View style={styles.modeGrid}>
              {[
                { id: 'tamil', label: 'தமிழ் (Tamil)' },
                { id: 'transliteration', label: 'English' },
                { id: 'both', label: 'Both (இரண்டும்)' },
                { id: 'meaning', label: 'Meaning (பொருள்)' },
              ].map((mode) => {
                const active = settings.displayMode === mode.id;
                return (
                  <TouchableOpacity
                    key={mode.id}
                    style={[
                      styles.modeBtn,
                      {
                        backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                        borderColor: active ? theme.colors.primary : theme.colors.border,
                      }
                    ]}
                    onPress={() => updateSettings({ displayMode: mode.id as any })}
                  >
                    <Text style={[typography.button, { color: active ? '#FFF' : theme.colors.text, fontSize: 12 }]}>
                      {mode.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Devotional Background Info */}
        <View style={styles.section}>
          <Text style={[typography.label, { color: theme.colors.textSecondary, marginBottom: spacing.md }]}>
            {t('aboutThirupugazh').toUpperCase()}
          </Text>

          <View style={[styles.aboutCard, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
            <View style={styles.aboutHeader}>
              <Ionicons name="flower-outline" size={24} color={theme.colors.primary} />
              <Text style={[typography.h3, { color: theme.colors.primary, marginLeft: spacing.sm }]}>
                {t('appName')}
              </Text>
            </View>

            <Text style={[typography.body, { color: theme.colors.textSecondary, marginTop: spacing.sm, lineHeight: 22 }]}>
              {t('aboutText1')}
            </Text>
            <Text style={[typography.body, { color: theme.colors.textSecondary, marginTop: spacing.sm, lineHeight: 22 }]}>
              {t('aboutText2')}
            </Text>
          </View>
        </View>

        {/* App Info Footer */}
        <View style={styles.footer}>
          <Text style={[typography.h4, { color: theme.colors.text }]}>Thirupugazh (திருப்புகழ் ̇)</Text>
          <Text style={[typography.caption, { color: theme.colors.textMuted, marginTop: 4 }]}>
            Version 1.0.0 • {thirupugazhData.length} Thirupugazh Songs Collection
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing['4xl'],
  },
  section: {
    marginVertical: spacing.lg,
  },
  settingCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: spacing.sm,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  modeBtn: {
    width: '48%',
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  aboutCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    marginVertical: spacing['2xl'],
  },
});
