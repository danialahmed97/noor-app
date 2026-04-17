import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  SafeAreaView, TouchableOpacity,
  Platform, StatusBar,
} from 'react-native';
import { spacing, radius, shadow, scale } from '../theme';
import { content } from '../data/content';
import { useTheme } from '../context/ThemeContext';

const categoryCounts = {
  Ayah:   content.filter((c) => c.category === 'Ayah').length,
  Hadith: content.filter((c) => c.category === 'Hadith').length,
  Story:  content.filter((c) => c.category === 'Story').length,
  Dua:    content.filter((c) => c.category === 'Dua').length,
};

const categoryEmojis = {
  Ayah:   '📖',
  Hadith: '📜',
  Story:  '✨',
  Dua:    '🤲',
};

const HOW_TO_USE = [
  { icon: '👆', text: 'Swipe UP to move to the next card' },
  { icon: '👇', text: 'Swipe DOWN to go back to the previous card' },
  { icon: '🤍', text: 'Tap the heart in the card footer to save a card to your collection' },
  { icon: '↗',  text: 'Tap the share icon to send a card via WhatsApp, iMessage, etc.' },
  { icon: '☪️', text: 'Use the category filter to focus on Ayahs, Hadiths, Stories, or Duas' },
  { icon: '↺',  text: 'Tap the refresh icon to reshuffle the deck anytime' },
  { icon: '☀️', text: 'Tap the sun / moon icon to switch between light and dark mode' },
];

export default function SettingsScreen() {
  const { colors } = useTheme();

  const categoryColors = {
    Ayah:   colors.ayah,
    Hadith: colors.hadith,
    Story:  colors.story,
    Dua:    colors.dua,
  };

  const styles = useMemo(() => StyleSheet.create({
    safe:   { flex: 1, backgroundColor: colors.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    scroll: { paddingBottom: spacing.xxl },

    // ── Hero ──
    hero: {
      alignItems: 'center',
      paddingTop: spacing.xl,
      paddingBottom: spacing.lg,
      paddingHorizontal: spacing.xl,
    },
    heroArabic: {
      fontSize: scale(52),
      fontWeight: '700',
      color: colors.gold,
      letterSpacing: 1,
    },
    heroTitle: {
      fontSize: scale(18),
      fontWeight: '700',
      color: colors.textDark,
      marginTop: spacing.xs,
      letterSpacing: 0.3,
    },
    heroSub: {
      fontSize: scale(13),
      color: colors.textMid,
      textAlign: 'center',
      lineHeight: scale(20),
      marginTop: spacing.sm,
    },

    // ── Section label ──
    sectionLabel: {
      fontSize: scale(11),
      fontWeight: '700',
      color: colors.textLight,
      letterSpacing: 1.2,
      marginHorizontal: spacing.lg,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },

    // ── Stats ──
    statsRow: {
      flexDirection: 'row',
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.bgCard,
      borderRadius: radius.md,
      alignItems: 'center',
      paddingVertical: spacing.md,
      overflow: 'hidden',
      ...shadow.soft,
    },
    statBar:   { position: 'absolute', top: 0, left: 0, right: 0, height: 4 },
    statEmoji: { fontSize: scale(22), marginBottom: spacing.xs },
    statCount: { fontSize: scale(22), fontWeight: '800' },
    statLabel: { fontSize: scale(11), color: colors.textLight, fontWeight: '500', marginTop: 2 },

    // ── How to use / Display ──
    howCard: {
      marginHorizontal: spacing.lg,
      backgroundColor: colors.bgCard,
      borderRadius: radius.md,
      overflow: 'hidden',
      ...shadow.soft,
    },
    howRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    howRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    howIcon: { fontSize: scale(18), width: 28, textAlign: 'center' },
    howText: { fontSize: scale(14), color: colors.textMid, flex: 1, lineHeight: scale(21) },

    // ── Disclaimer ──
    disclaimerCard: {
      marginHorizontal: spacing.lg,
      backgroundColor: colors.bgCard,
      borderRadius: radius.md,
      padding: spacing.md,
      ...shadow.soft,
    },
    disclaimerText: {
      fontSize: scale(13),
      color: colors.textMid,
      lineHeight: scale(21),
    },

    // ── Version ──
    version: {
      textAlign: 'center',
      fontSize: scale(12),
      color: colors.textLight,
      marginTop: spacing.xl,
    },

  }), [colors]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Text style={styles.heroArabic}>نور</Text>
          <Text style={styles.heroTitle}>Noor · Islamic Dawah</Text>
          <Text style={styles.heroSub}>
            Short, powerful Islamic reminders — for the heart, one card at a time.
          </Text>
        </View>

        {/* ── Content Library ── */}
        <Text style={styles.sectionLabel}>CONTENT LIBRARY</Text>
        <View style={styles.statsRow}>
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <View key={cat} style={styles.statCard}>
              <View style={[styles.statBar, { backgroundColor: categoryColors[cat] }]} />
              <Text style={styles.statEmoji}>{categoryEmojis[cat]}</Text>
              <Text style={[styles.statCount, { color: categoryColors[cat] }]}>{count}</Text>
              <Text style={styles.statLabel}>{cat}s</Text>
            </View>
          ))}
        </View>

        {/* ── How to use ── */}
        <Text style={styles.sectionLabel}>HOW TO USE</Text>
        <View style={styles.howCard}>
          {HOW_TO_USE.map((item, i) => (
            <View key={i} style={[styles.howRow, i < HOW_TO_USE.length - 1 && styles.howRowBorder]}>
              <Text style={styles.howIcon}>{item.icon}</Text>
              <Text style={styles.howText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* ── Disclaimer ── */}
        <Text style={styles.sectionLabel}>DISCLAIMER</Text>
        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerText}>
            All Quranic verses are referenced from authentic translations. Hadiths are sourced from
            Sahih collections. Stories are drawn from classical Islamic literature. This app is
            intended for general educational and spiritual benefit. Always verify with a qualified
            scholar for matters of faith and practice.
          </Text>
        </View>

        <Text style={styles.version}>Noor v1.0.0 · Made with ❤️ for the Ummah</Text>

      </ScrollView>
    </SafeAreaView>
  );
}
