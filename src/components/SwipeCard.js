import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, Animated, PanResponder,
  Dimensions, Share, TouchableOpacity, ScrollView, Modal, BackHandler, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  spacing, radius, shadow,
  getCategoryColor, getCategoryLightColor, getCategoryEmoji,
  scale, CARD_MAX_WIDTH,
} from '../theme';
import { isCardSaved, saveCard, unsaveCard } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 60;
const SWIPE_DURATION  = 220;
const WATERMARK       = { Ayah: '✦', Hadith: '☽', Story: '✺', Dua: '❋' };

export default function SwipeCard({ card, onNext, onPrev, showHints, instant, onMounted }) {
  const { colors } = useTheme();
  const position  = useRef(new Animated.ValueXY()).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;
  const [expanded,      setExpanded]      = useState(false);
  const [needsReadMore, setNeedsReadMore] = useState(false);
  const [saved,         setSaved]         = useState(false);
  const swiping = useRef(false);

  const catColor      = getCategoryColor(card.category, colors);
  const catLightColor = getCategoryLightColor(card.category, colors);
  const catEmoji      = getCategoryEmoji(card.category);
  const isStory       = card.category === 'Story';

  const styles = useMemo(() => StyleSheet.create({
    wrapper: { width: CARD_MAX_WIDTH, alignSelf: 'center' },
    cardShadow: {
      borderRadius: radius.lg,
      backgroundColor: colors.bgCard,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
        },
        android: {
          borderWidth: 1,
          borderColor: colors.border,
        },
      }),
    },
    cardClip: {
      borderRadius: radius.lg,
      backgroundColor: colors.bgCard,
      overflow: 'hidden',
    },
    headerBand:    { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg, position: 'relative', overflow: 'hidden' },
    watermark:     { position: 'absolute', bottom: -10, right: 16, fontSize: scale(80), opacity: 0.08, color: '#FFFFFF' },
    bandTop:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
    categoryChip:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, gap: 4 },
    chipEmoji:     { fontSize: scale(12) },
    chipTextLight: { fontSize: scale(11), fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 0.5 },
    chipTagLight:  { fontSize: scale(11), fontWeight: '500', color: 'rgba(255,255,255,0.8)' },
    shareBtn:      { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    shareBtnText:  { fontSize: 15, color: '#FFFFFF', fontWeight: '600' },
    arabicText:    { fontSize: scale(22), lineHeight: scale(38), textAlign: 'right', writingDirection: 'rtl', fontWeight: '500', color: '#FFFFFF' },
    storyHeadline: { fontSize: scale(18), fontWeight: '700', color: '#FFFFFF', lineHeight: scale(26), marginTop: spacing.xs },
    body:          { padding: spacing.lg },
    translation:   { fontSize: scale(17), lineHeight: scale(26), color: colors.textDark, fontWeight: '600', marginBottom: spacing.md },
    divider:       { height: 1.5, borderRadius: 1, marginBottom: spacing.md },
    explanation:   { fontSize: scale(14.5), lineHeight: scale(23), color: colors.textMid },
    readMore:      { fontSize: scale(13), fontWeight: '600' },
    footer:        { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, gap: spacing.xs },
    sourceIcon:    { fontSize: scale(12) },
    sourceText:    { fontSize: scale(12), color: colors.textLight, fontWeight: '500', flex: 1 },
    heart:         { fontSize: scale(20) },
    hints:         { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.md, marginTop: spacing.sm },
    hintText:      { fontSize: scale(11), color: colors.textLight, fontWeight: '500' },
  }), [colors]);

  useEffect(() => {
    setExpanded(false);
    setNeedsReadMore(false);
    position.setValue({ x: 0, y: 0 });
    fadeAnim.setValue(instant ? 1 : 0);
    swiping.current = false;

    if (instant) {
      if (onMounted) onMounted();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        if (onMounted) onMounted();
      });
    }

    isCardSaved(card.id).then(setSaved);
  }, [card.id]);

  useEffect(() => {
    if (!expanded) return;
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      setExpanded(false);
      return true;
    });
    return () => handler.remove();
  }, [expanded]);

  const handleHeartPress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const next = !saved;
    setSaved(next);
    next ? await saveCard(card) : await unsaveCard(card.id);
    Animated.sequence([
      Animated.spring(heartAnim, { toValue: 1.4, useNativeDriver: true, speed: 30 }),
      Animated.spring(heartAnim, { toValue: 1,   useNativeDriver: true, speed: 20 }),
    ]).start();
  };

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (_, g) =>
      !expanded && Math.abs(g.dy) > Math.abs(g.dx) && Math.abs(g.dy) > 8,
    onPanResponderGrant: () => { swiping.current = false; },
    onPanResponderMove: (_, g) => {
      if (!expanded && !swiping.current) position.setValue({ x: 0, y: g.dy });
    },
    onPanResponderRelease: (_, g) => {
      if (expanded || swiping.current) return;
      if (g.dy < -SWIPE_THRESHOLD)     flyOut('up');
      else if (g.dy > SWIPE_THRESHOLD) flyOut('down');
      else                             snapBack();
    },
    onPanResponderTerminate: () => {
      if (!expanded && !swiping.current) snapBack();
    },
  })).current;

  const flyOut = (direction) => {
    swiping.current = true;
    const toY = direction === 'up' ? -SCREEN_HEIGHT * 1.4 : SCREEN_HEIGHT * 1.4;
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: 0, y: toY },
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      direction === 'up' ? onNext() : onPrev();
    });
  };

  const snapBack = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5, tension: 80,
      useNativeDriver: false,
    }).start();
  };

  const handleShare = async () => {
    const arabicLine = card.arabic ? `${card.arabic}\n\n` : '';
    const text = `${arabicLine}${card.translation}\n\n${card.explanation}\n\n— ${card.source}\n\n📲 via Noor App`;
    await Share.share({ message: text });
  };

  return (
    <Animated.View
      style={[styles.wrapper, { opacity: fadeAnim }]}
      {...panResponder.panHandlers}
    >
      <Animated.View style={[styles.cardShadow, { transform: [{ translateY: position.y }] }]}>
        <View style={styles.cardClip}>

          {/* ── Gradient header band ── */}
          <View style={[styles.headerBand, { backgroundColor: catColor }]}>
            <Text style={styles.watermark}>{WATERMARK[card.category] || '✦'}</Text>
            <View style={styles.bandTop}>
              <View style={[styles.categoryChip, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                <Text style={styles.chipEmoji}>{catEmoji}</Text>
                <Text style={styles.chipTextLight}>{card.category}</Text>
                {card.tag && <Text style={styles.chipTagLight}> · {card.tag}</Text>}
              </View>
              <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.7}>
                <Text style={styles.shareBtnText}>↗</Text>
              </TouchableOpacity>
            </View>
            {card.arabic && (
              <Text style={styles.arabicText}>{card.arabic}</Text>
            )}
            {isStory && (
              <Text style={styles.storyHeadline}>{card.translation}</Text>
            )}
          </View>

          {/* ── Card body ── */}
          <View style={styles.body}>
            {!isStory && <Text style={styles.translation}>{card.translation}</Text>}
            <View style={[styles.divider, { backgroundColor: catLightColor }]} />
            <Text
              style={styles.explanation}
              numberOfLines={8}
              onTextLayout={(e) => {
                setNeedsReadMore(e.nativeEvent.lines.length >= 8);
              }}
            >
              {card.explanation}
            </Text>
            {needsReadMore && !expanded && (
              <TouchableOpacity
                onPress={() => setExpanded(true)}
                activeOpacity={0.7}
                style={{ marginTop: spacing.sm }}
              >
                <Text style={[styles.readMore, { color: catColor }]}>Read more ↓</Text>
              </TouchableOpacity>
            )}

            <View style={[styles.footer, { borderTopColor: catLightColor }]}>
              <Text style={styles.sourceIcon}>
                {card.sourceType === 'Quran' ? '📖' : card.sourceType === 'Hadith' ? '📜' : card.sourceType === 'Dua' ? '🤲' : '✨'}
              </Text>
              <Text style={styles.sourceText}>{card.source}</Text>
              <Animated.View style={{ transform: [{ scale: heartAnim }] }}>
                <TouchableOpacity onPress={handleHeartPress} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.heart}>{saved ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>

        </View>
      </Animated.View>

      {/* ── Swipe hints (only if showHints=true) ── */}
      {showHints && (
        <View style={styles.hints}>
          <Text style={styles.hintText}>↑ Next</Text>
          <Text style={styles.hintText}>↓ Prev</Text>
        </View>
      )}

      {/* ── Read more Modal ── */}
      <Modal
        visible={expanded}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setExpanded(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>

          {/* Header band identical to card */}
          <View style={[styles.headerBand, { backgroundColor: catColor }]}>
            <Text style={styles.watermark}>{WATERMARK[card.category] || '✦'}</Text>
            <View style={styles.bandTop}>
              <View style={[styles.categoryChip, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                <Text style={styles.chipEmoji}>{catEmoji}</Text>
                <Text style={styles.chipTextLight}>{card.category}</Text>
                {card.tag && <Text style={styles.chipTagLight}> · {card.tag}</Text>}
              </View>
              <TouchableOpacity
                onPress={() => setExpanded(false)}
                activeOpacity={0.8}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>✕</Text>
              </TouchableOpacity>
            </View>
            {card.arabic && (
              <Text style={styles.arabicText}>{card.arabic}</Text>
            )}
            {isStory && (
              <Text style={styles.storyHeadline}>{card.translation}</Text>
            )}
          </View>

          {/* Scrollable body */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
            showsVerticalScrollIndicator={true}
          >
            {!isStory && (
              <Text style={styles.translation}>{card.translation}</Text>
            )}
            <View style={[styles.divider, { backgroundColor: catLightColor }]} />
            <Text style={styles.explanation}>{card.explanation}</Text>
            <TouchableOpacity
              onPress={() => setExpanded(false)}
              activeOpacity={0.7}
              style={{
                marginTop: spacing.xl,
                alignSelf: 'center',
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.xl,
                backgroundColor: catLightColor,
                borderRadius: radius.pill,
              }}
            >
              <Text style={[styles.readMore, { color: catColor }]}>Show less ↑</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, {
            borderTopColor: catLightColor,
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.lg,
          }]}>
            <Text style={styles.sourceIcon}>
              {card.sourceType === 'Quran' ? '📖' : card.sourceType === 'Hadith' ? '📜' : card.sourceType === 'Dua' ? '🤲' : '✨'}
            </Text>
            <Text style={styles.sourceText}>{card.source}</Text>
            <Animated.View style={{ transform: [{ scale: heartAnim }] }}>
              <TouchableOpacity
                onPress={handleHeartPress}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.heart}>{saved ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

        </SafeAreaView>
      </Modal>

    </Animated.View>
  );
}
