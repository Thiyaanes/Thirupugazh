import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage, UILanguage } from '../context/LanguageContext';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, borderRadius } from '../theme';

export const LanguageSelectionModal = () => {
  const { isFirstLaunch, completeFirstLaunch } = useLanguage();
  const { theme } = useTheme();
  const [selectedLang, setSelectedLang] = useState<UILanguage>('en');

  if (!isFirstLaunch) return null;

  const handleConfirm = async () => {
    await completeFirstLaunch(selectedLang);
  };

  return (
    <Modal
      visible={isFirstLaunch}
      animationType="fade"
      transparent={false}
      statusBarTranslucent
    >
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
          
          {/* Header & Icon */}
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight + '20' }]}>
            <Ionicons name="language-outline" size={48} color={theme.colors.primary} />
          </View>

          <Text style={[typography.h1, { color: theme.colors.text, textAlign: 'center', marginTop: spacing.lg }]}>
            Thirupugazh • திருப்புகழ் ̇
          </Text>

          <Text style={[typography.body, { color: theme.colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, paddingHorizontal: spacing.md }]}>
            Please select your preferred language for the app interface.
            {'\n'}
            செயலி மொழியைத் தேர்ந்தெடுக்கவும்.
          </Text>

          {/* Language Options */}
          <View style={styles.optionsContainer}>
            
            {/* English Card */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.optionCard,
                {
                  backgroundColor: selectedLang === 'en' ? theme.colors.surfaceElevated : theme.colors.surface,
                  borderColor: selectedLang === 'en' ? theme.colors.primary : theme.colors.border,
                  borderWidth: selectedLang === 'en' ? 2 : 1,
                }
              ]}
              onPress={() => setSelectedLang('en')}
            >
              <View style={styles.optionInfo}>
                <Text style={[typography.h3, { color: theme.colors.text }]}>English</Text>
                <Text style={[typography.caption, { color: theme.colors.textMuted, marginTop: 2 }]}>
                  App interface in English (Default)
                </Text>
              </View>
              <View
                style={[
                  styles.radioOuter,
                  { borderColor: selectedLang === 'en' ? theme.colors.primary : theme.colors.border }
                ]}
              >
                {selectedLang === 'en' && (
                  <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />
                )}
              </View>
            </TouchableOpacity>

            {/* Tamil Card */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.optionCard,
                {
                  backgroundColor: selectedLang === 'ta' ? theme.colors.surfaceElevated : theme.colors.surface,
                  borderColor: selectedLang === 'ta' ? theme.colors.primary : theme.colors.border,
                  borderWidth: selectedLang === 'ta' ? 2 : 1,
                  marginTop: spacing.md,
                }
              ]}
              onPress={() => setSelectedLang('ta')}
            >
              <View style={styles.optionInfo}>
                <Text style={[typography.h3, { color: theme.colors.text }]}>தமிழ் (Tamil)</Text>
                <Text style={[typography.caption, { color: theme.colors.textMuted, marginTop: 2 }]}>
                  செயலி முகப்பு தமிழில்
                </Text>
              </View>
              <View
                style={[
                  styles.radioOuter,
                  { borderColor: selectedLang === 'ta' ? theme.colors.primary : theme.colors.border }
                ]}
              >
                {selectedLang === 'ta' && (
                  <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />
                )}
              </View>
            </TouchableOpacity>

          </View>

          {/* Hint */}
          <Text style={[typography.caption, { color: theme.colors.textMuted, textAlign: 'center', marginTop: spacing.xl }]}>
            * You can change this language preference anytime in Settings.
          </Text>

          {/* Confirm Button */}
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: theme.colors.primary }]}
            activeOpacity={0.8}
            onPress={handleConfirm}
          >
            <Text style={[typography.button, { color: '#FFFFFF', fontSize: 16 }]}>
              Continue • தொடர்க
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: spacing.xs }} />
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginTop: spacing['2xl'],
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  optionInfo: {
    flex: 1,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  confirmButton: {
    width: '100%',
    height: 54,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['2xl'],
  },
});
