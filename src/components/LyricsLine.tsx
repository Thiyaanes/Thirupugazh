import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSpring,
  interpolateColor
} from 'react-native-reanimated';
import { SyncedLyricLine } from '../types';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme';

interface LyricsLineProps {
  line: SyncedLyricLine;
  isActive: boolean;
  onPress: () => void;
  showTamil: boolean;
  showTransliteration: boolean;
}

export const LyricsLine = ({ line, isActive, onPress, showTamil, showTransliteration }: LyricsLineProps) => {
  const { theme } = useTheme();
  
  // Animation values
  const activeProgress = useSharedValue(isActive ? 1 : 0);
  
  useEffect(() => {
    activeProgress.value = withTiming(isActive ? 1 : 0, { duration: 300 });
  }, [isActive, activeProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: 1 + activeProgress.value * 0.05 }
      ],
      opacity: 0.4 + activeProgress.value * 0.6,
    };
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {showTamil && (
          <Text 
            style={[
              styles.tamilText, 
              { 
                color: isActive ? theme.colors.primary : theme.colors.text,
                fontWeight: isActive ? '700' : '400',
              }
            ]}
          >
            {line.tamilText}
          </Text>
        )}
        
        {showTransliteration && (
          <Text 
            style={[
              styles.transText, 
              { 
                color: isActive ? theme.colors.secondary : theme.colors.textSecondary,
                marginTop: showTamil ? spacing.xs : 0,
                fontSize: showTamil ? 14 : 20,
              }
            ]}
          >
            {line.transliteration}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  tamilText: {
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 34,
  },
  transText: {
    textAlign: 'center',
    fontStyle: 'italic',
  }
});
