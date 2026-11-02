import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useFavorites } from '../hooks/useFavorites';
import * as Haptics from 'expo-haptics';

interface FavoriteButtonProps {
  songId: string;
  size?: number;
}

export const FavoriteButton = ({ songId, size = 24 }: FavoriteButtonProps) => {
  const { theme } = useTheme();
  const { isFavorite, toggleFavorite, loading } = useFavorites();
  const scaleValue = useRef(new Animated.Value(1)).current;
  
  const active = isFavorite(songId);

  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Haptics not supported on device
    }
    
    // Animate
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1.2,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    toggleFavorite(songId);
  };

  if (loading) return null;

  return (
    <TouchableOpacity onPress={handlePress} accessibilityRole="button">
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Ionicons 
          name={active ? "heart" : "heart-outline"} 
          size={size} 
          color={active ? theme.colors.favorite : theme.colors.textMuted} 
        />
      </Animated.View>
    </TouchableOpacity>
  );
};
