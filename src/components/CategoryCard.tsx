import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types';
import { useTheme } from '../hooks/useTheme';
import { spacing, borderRadius, typography } from '../theme';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

export const CategoryCard = ({ category, onPress }: CategoryCardProps) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: theme.colors.surfaceElevated }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
        <Ionicons name={category.icon as any} size={24} color="#FFF" />
      </View>
      <View style={styles.textContainer}>
        <Text style={[typography.h4, { color: theme.colors.text }]} numberOfLines={1}>
          {category.name}
        </Text>
        {category.nameTamil && (
          <Text style={[typography.caption, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {category.nameTamil}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%', // Rough 2-column layout
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
});
