// ─────────────────────────────────────────────────────────
//  SavedScreen.js — Saved / Bookmarked cards
// ─────────────────────────────────────────────────────────
import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getSavedCards, unsaveCard } from '../utils/storage';
import { spacing, radius, shadow, getCategoryColor, getCategoryLightColor, getCategoryEmoji } from '../theme';
import { useTheme } from '../context/ThemeContext';

export default function SavedScreen({ navigation }) {
  const { colors } = useTheme();
  const [savedCards, setSavedCards] = useState([]);

  const styles = useMemo(() => StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },

    // ── Header ────────────────────────────────────────────
    header: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.textDark,
      letterSpacing: -0.3,
    },
    headerSubtitle: {
      fontSize: 13,
      color: colors.textLight,
      marginTop: 2,
    },

    // ── List ──────────────────────────────────────────────
    list: {
      padding: spacing.lg,
    },

    // ── Card ──────────────────────────────────────────────
    card: {
      backgroundColor: colors.bgCard,
      borderRadius: radius.lg,
      padding: spacing.lg,
      ...shadow.card,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm + 2,
      paddingVertical: spacing.xs + 1,
      borderRadius: radius.pill,
      gap: 4,
    },
    chipEmoji: { fontSize: 12 },
    chipText: {
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    chipTag: {
      fontSize: 11,
      fontWeight: '500',
      opacity: 0.8,
    },
    cardActions: {
      flexDirection: 'row',
      gap: spacing.xs,
    },
    iconBtn: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconBtnText: {
      fontSize: 14,
      color: colors.textMid,
      fontWeight: '600',
    },

    // ── Content ───────────────────────────────────────────
    arabicText: {
      fontSize: 18,
      lineHeight: 32,
      textAlign: 'right',
      fontWeight: '500',
      marginBottom: spacing.sm,
    },
    translationText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textDark,
      lineHeight: 22,
      marginBottom: spacing.sm,
    },
    explanationText: {
      fontSize: 13.5,
      color: colors.textMid,
      lineHeight: 20,
    },
    footer: {
      marginTop: spacing.md,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
    },
    sourceText: {
      fontSize: 11.5,
      color: colors.textLight,
      fontWeight: '500',
    },

    // ── Empty ─────────────────────────────────────────────
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xxl,
    },
    emptyEmoji:    { fontSize: 52, marginBottom: spacing.lg },
    emptyTitle:    { fontSize: 20, fontWeight: '700', color: colors.textDark, marginBottom: spacing.sm },
    emptySubtitle: { fontSize: 14, color: colors.textMid, textAlign: 'center', lineHeight: 22 },
  }), [colors]);

  useFocusEffect(
    useCallback(() => {
      getSavedCards().then((cards) => setSavedCards(cards || [])).catch(() => setSavedCards([]));
    }, [])
  );

  const handleUnsave = (cardId) => {
    Alert.alert(
      'Remove Card',
      'Remove this from your saved collection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await unsaveCard(cardId);
            getSavedCards().then((cards) => setSavedCards(cards || [])).catch(() => setSavedCards([]));
          },
        },
      ]
    );
  };

  const handleShare = async (card) => {
    const arabicLine = card.arabic ? `${card.arabic}\n\n` : '';
    const text = `${arabicLine}${card.translation}\n\n${card.explanation}\n\n— ${card.source}\n\n📲 via Noor App`;
    await Share.share({ message: text });
  };

  const renderItem = ({ item: card }) => {
    const handleCardPress = () => navigation.navigate('Home', { openCard: card });
    const catColor      = getCategoryColor(card.category, colors);
    const catLightColor = getCategoryLightColor(card.category, colors);
    const catEmoji      = getCategoryEmoji(card.category);

    return (
      <TouchableOpacity activeOpacity={0.85} onPress={handleCardPress}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={[styles.categoryChip, { backgroundColor: catLightColor }]}>
            <Text style={styles.chipEmoji}>{catEmoji}</Text>
            <Text style={[styles.chipText, { color: catColor }]}>{card.category}</Text>
            {card.tag && (
              <Text style={[styles.chipTag, { color: catColor }]}> · {card.tag}</Text>
            )}
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity
              onPress={() => handleShare(card)}
              style={styles.iconBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.iconBtnText}>↗</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleUnsave(card.id)}
              style={[styles.iconBtn, { backgroundColor: colors.duaLight }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.iconBtnText, { color: colors.dua }]}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Arabic */}
        {card.arabic && (
          <Text style={[styles.arabicText, { color: catColor }]}>{card.arabic}</Text>
        )}

        {/* Translation */}
        <Text style={styles.translationText}>{card.translation}</Text>

        {/* Explanation */}
        <Text style={styles.explanationText} numberOfLines={3}>{card.explanation}</Text>

        {/* Source */}
        <View style={[styles.footer, { borderTopColor: catLightColor }]}>
          <Text style={styles.sourceText}>
            {card.sourceType === 'Quran' ? '📖' : card.sourceType === 'Hadith' ? '📜' : card.sourceType === 'Dua' ? '🤲' : '✨'}
            {'  '}{card.source}
          </Text>
        </View>
      </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Collection</Text>
        <Text style={styles.headerSubtitle}>
          {(savedCards || []).length} {(savedCards || []).length === 1 ? 'card' : 'cards'} saved
        </Text>
      </View>

      {(savedCards || []).length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🤲</Text>
          <Text style={styles.emptyTitle}>No saved cards yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart ❤️ on any card to save it to your collection.
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedCards}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        />
      )}
    </SafeAreaView>
  );
}
