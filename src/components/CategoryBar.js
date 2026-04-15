import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CATEGORIES } from '../data/content';
import { spacing, radius, shadow, getCategoryColor, getCategoryEmoji } from '../theme';
import { useTheme } from '../context/ThemeContext';

export default function CategoryBar({ selected, onSelect }) {
  const { colors } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    wrapper: {
      backgroundColor: colors.bg,
      paddingVertical: spacing.sm,
    },
    container: {
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
      flexDirection: 'row',
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 3,
      borderRadius: radius.pill,
      gap: 5,
    },
    chipEmoji: {
      fontSize: 13,
    },
    chipText: {
      fontSize: 13,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
  }), [colors]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selected === cat;
          const catColor = cat === 'All' ? colors.primary : getCategoryColor(cat, colors);
          const emoji    = cat === 'All' ? '☪️' : getCategoryEmoji(cat);

          return (
            <TouchableOpacity
              key={cat}
              onPress={() => onSelect(cat)}
              activeOpacity={0.75}
              style={[
                styles.chip,
                isActive
                  ? { backgroundColor: catColor, ...shadow.soft }
                  : { backgroundColor: colors.border },
              ]}
            >
              <Text style={styles.chipEmoji}>{emoji}</Text>
              <Text
                style={[
                  styles.chipText,
                  { color: isActive ? '#FFF' : colors.textMid },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
