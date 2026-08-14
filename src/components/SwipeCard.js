import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, Animated, PanResponder,
  Dimensions, Share, TouchableOpacity, ScrollView, Modal, BackHandler, Platform, StatusBar,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  spacing, radius, shadow,
  getCategoryColor, getCategoryLightColor, getCategoryEmoji,
  scale, CARD_MAX_WIDTH, isTablet,
} from '../theme';
import { isCardSaved, saveCard, unsaveCard } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 60;
const SWIPE_DURATION  = 220;
const WATERMARK       = { Ayah: '✦', Hadith: '☽', Story: '✺', Dua: '❋' };

export default function SwipeCard({ card, onNext, onPrev, showHints, instant, onMounted, slotHeight }) {
  const { colors, showTransliteration, toggleTransliteration } = useTheme();
  const { width: liveWidth, height: liveHeight } = useWindowDimensions();
  const position  = useRef(new Animated.ValueXY()).current;
  const fadeAnim  = useRef(new Animated.Value(instant ? 1 : 0)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;
  const translitAnim = useRef(new Animated.Value(showTransliteration ? 32 : 0)).current;
  const [expanded,      setExpanded]      = useState(false);
  const [saved,         setSaved]         = useState(false);
  const insets      = useSafeAreaInsets();

  // ── Measurement-based correction layer (post-mount, one-shot per card) ──
  const [contentHeight, setContentHeight] = useState(0);
  const contentHeightRef = useRef(0);
  const [hintsHeight, setHintsHeight] = useState(0);
  const [fullExplLines, setFullExplLines] = useState(0);
  const fullExplLinesRef = useRef(0);
  const [fullTransLines, setFullTransLines] = useState(0);
  const fullTransLinesRef = useRef(0);
  const [fullArabicLines, setFullArabicLines] = useState(0);
  const fullArabicLinesRef = useRef(0);
  const [lineAdjustment, setLineAdjustment] = useState(0);
  const [transLineAdjustment, setTransLineAdjustment] = useState(0);
  const [arabicLineAdjustment, setArabicLineAdjustment] = useState(0);
  const [readMoreOverride, setReadMoreOverride] = useState(null);
  const [transReadMoreOverride, setTransReadMoreOverride] = useState(null);
  const [arabicReadMoreOverride, setArabicReadMoreOverride] = useState(null);
  const correctionAppliedRef = useRef(false);
  const lastSlotHeightRef = useRef(0);

  // ── Measured arabic/translation line counts — feed the Case 3 / story
  //    explanation budget so it uses real rendered heights, not char estimates ──
  const [measuredArabicLines, setMeasuredArabicLines] = useState(0);
  const measuredArabicLinesRef = useRef(0);
  const [measuredTranslitLines, setMeasuredTranslitLines] = useState(0);
  const measuredTranslitLinesRef = useRef(0);
  const [measuredTranslationLines, setMeasuredTranslationLines] = useState(0);
  const measuredTranslationLinesRef = useRef(0);

  // ── Height-aware overflow logic ──
  // All values are synchronous — no async measurement, no race conditions.
  const screenWidth = liveWidth;
  const screenHeight = liveHeight;
  const isStoryCard = card.category === 'Story';

  // 1. Chars per line — scales with card width
  const liveCardMaxWidth = isTablet ? screenWidth - 80 : screenWidth - 32;
  const cardWidth = liveCardMaxWidth - (spacing.lg * 2);
  const arabicCharWidth = scale(22) * 0.48;   // arabic font scale(22), avg char ~48% of fontSize
  const englishCharWidth = scale(17) * 0.50;  // translation font scale(17), avg char ~50% of fontSize
  const explanationCharWidth = scale(14.5) * 0.50; // explanation font scale(14.5)

  const arabicCharsPerLine = Math.max(1, Math.floor(cardWidth / (isTablet ? arabicCharWidth * 0.85 : arabicCharWidth)));
  const translationCharsPerLine = Math.max(1, Math.floor(cardWidth / (isTablet ? englishCharWidth * 0.85 : englishCharWidth)));
  const explanationCharsPerLine = Math.max(1, Math.floor(cardWidth / (isTablet ? explanationCharWidth * 0.85 : explanationCharWidth)));

  const arabicLines = Math.ceil((card.arabic?.length || 0) / arabicCharsPerLine);
  const translationLines = Math.ceil((card.translation?.length || 0) / translationCharsPerLine);
  const estimatedExplanationLines = Math.round((card.explanation?.length || 0) / explanationCharsPerLine);

  // 2. Line heights in dp
  const arabicLineHeight = scale(38);
  const translationLineHeight = scale(26);
  const explanationLineHeight = scale(23);
  const translitLineHeight = scale(20); // styles.translitText lineHeight

  // 3. Chrome height — everything that isn't card content
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : insets.top;
  // Screen-level chrome — outside the card itself (status bar, app header, tabs, tab bar)
  const screenChrome =
    statusBarHeight           // status bar
    + 50                      // app header (نور + icons)
    + 44                      // category tabs row
    + 24                      // progress bar row
    + 60 + (insets.bottom || 8); // tab bar
  // Card-internal chrome — padding/divider/footer inside the card's own layout.
  // Used standalone against slotHeight for the measured explanation budget below.
  const cardChrome =
    spacing.md + spacing.lg // header band top+bottom padding
    + 40                     // bandTop row (category chip + buttons)
    + spacing.lg             // body padding top
    + spacing.md             // body padding bottom (before footer)
    + 1.5                    // divider
    + spacing.md             // divider marginBottom
    + 40;                    // footer (source + heart)
  const chromeHeight = screenChrome + cardChrome;

  // 4. Available height for content (arabic + translation + explanation)
  const readMoreBuffer = Platform.OS === 'ios' ? (isTablet ? 80 : 40) : 0;
  const availableHeight = screenHeight - chromeHeight - readMoreBuffer;

  // 5. How much height does each section consume?
  const arabicHeight = arabicLines * arabicLineHeight;
  const translationHeight = translationLines * translationLineHeight;
  const explanationHeight = estimatedExplanationLines * explanationLineHeight;

  // Use measured header height when available (transliteration is much shorter than arabic)
  const effectiveArabicHeight = (showTransliteration && card.transliteration && measuredTranslitLines > 0)
    ? measuredTranslitLines * translitLineHeight
    : arabicHeight;

  // 6. Truncation hierarchy — show as much as the device allows
  let truncateArabic = false;
  let truncateTranslation = false;
  let explanationLines;
  let maxArabicLines;
  let maxTranslationLines;

  if (isStoryCard) {
    truncateArabic = false;
    truncateTranslation = false;
    const remainingForExplanation = availableHeight - translationHeight;
    const maxExplanationLines = Math.max(1, Math.floor(remainingForExplanation / explanationLineHeight));
    if (estimatedExplanationLines > maxExplanationLines) {
      explanationLines = maxExplanationLines;
    } else {
      explanationLines = undefined;
    }
  } else if (effectiveArabicHeight > availableHeight) {
    // Case 1: Arabic alone exceeds screen — truncate arabic, hide translation + explanation
    truncateArabic = true;
    maxArabicLines = Math.max(2, Math.floor(availableHeight / arabicLineHeight));
    explanationLines = 0;
  } else if (effectiveArabicHeight + translationHeight > availableHeight) {
    // Case 2: Arabic + translation exceeds screen — truncate translation, hide explanation
    truncateTranslation = true;
    const remainingForTranslation = availableHeight - effectiveArabicHeight;
    maxTranslationLines = Math.max(2, Math.floor(remainingForTranslation / translationLineHeight));
    explanationLines = 0;
  } else {
    // Case 3: Arabic + translation fit — budget the rest for explanation
    const remainingForExplanation = availableHeight - effectiveArabicHeight - translationHeight;
    const maxExplanationLines = Math.max(1, Math.floor(remainingForExplanation / explanationLineHeight));
    if (estimatedExplanationLines > maxExplanationLines) {
      explanationLines = maxExplanationLines;
    } else {
      explanationLines = undefined; // fits fully, no truncation
    }
  }

  // ── Measured explanation budget — supersedes the char-estimate formula
  //    above (Case 3 / stories only) once real arabic/translation heights
  //    are known. Case 1/2 (arabic or translation truncation) stay on the
  //    formula — they're rare and out of scope here. ──
  const arabicPresent = !isStoryCard && !!card.arabic;
  const showingTranslit = arabicPresent && showTransliteration && !!card.transliteration;
  const measuredArabicHeight = measuredArabicLines > 0 ? measuredArabicLines * arabicLineHeight : null;
  const measuredTranslitHeight = measuredTranslitLines > 0 ? measuredTranslitLines * translitLineHeight : null;
  const headerTextHeight = showingTranslit
    ? measuredTranslitHeight
    : (arabicPresent ? measuredArabicHeight : 0);
  const measuredTranslationHeight = measuredTranslationLines > 0 ? measuredTranslationLines * translationLineHeight : null;

  const measurementsReady =
    !truncateArabic
    && !truncateTranslation
    && headerTextHeight !== null
    && measuredTranslationHeight !== null;

  let measuredMaxExplanationLines = null;
  if (!expanded && slotHeight > 0 && measurementsReady) {
    const measuredRemaining = slotHeight - cardChrome - headerTextHeight - measuredTranslationHeight;
    measuredMaxExplanationLines = Math.max(1, Math.floor(measuredRemaining / explanationLineHeight));
    const linesForDecision = fullExplLines > 0 ? fullExplLines : estimatedExplanationLines;
    explanationLines = linesForDecision > measuredMaxExplanationLines ? measuredMaxExplanationLines : undefined;
  }

  const needsReadMore = card.explanation?.length > 450; // kept for Story compat

  // Check if truncation actually removes content
  const arabicActuallyTruncated = truncateArabic && arabicLines > maxArabicLines;
  const translationActuallyTruncated = truncateTranslation && translationLines > maxTranslationLines;
  const explanationActuallyTruncated = explanationLines !== undefined && explanationLines !== 0
    && (fullExplLines > 0 ? fullExplLines : estimatedExplanationLines) > explanationLines;

  const showReadMoreBase = (arabicActuallyTruncated || translationActuallyTruncated || explanationActuallyTruncated) && !expanded;

  // ── Post-mount correction: measured content/hints/full-explanation-lines
  //    nudge the formula's output without touching it above ──
  const effectiveExplanationLines = lineAdjustment === 0
    ? explanationLines
    : (explanationLines !== undefined
        ? Math.max(1, explanationLines - lineAdjustment)
        : Math.max(1, (fullExplLines || estimatedExplanationLines) - lineAdjustment));

  const showReadMore = readMoreOverride === false
    ? false
    : (lineAdjustment > 0 && !expanded)
      ? true
      : (showReadMoreBase || (fullExplLines > 0 && effectiveExplanationLines !== undefined && fullExplLines > effectiveExplanationLines && !expanded));

  // ── Translation / arabic post-mount correction ──
  const effectiveMaxTranslationLines = maxTranslationLines !== undefined
    ? Math.max(1, maxTranslationLines - transLineAdjustment)
    : undefined;
  const effectiveMaxArabicLines = maxArabicLines !== undefined
    ? Math.max(1, maxArabicLines - arabicLineAdjustment)
    : undefined;

  const showTranslationReadMore = transReadMoreOverride === false
    ? false
    : (transLineAdjustment > 0 && !expanded)
      ? true
      : (truncateTranslation && !expanded);

  const showArabicReadMore = arabicReadMoreOverride === false
    ? false
    : (arabicLineAdjustment > 0 && !expanded)
      ? true
      : (truncateArabic && !expanded);

  const swiping     = useRef(false);
  const expandedRef = useRef(false);

  const catColor      = getCategoryColor(card.category, colors);
  const catLightColor = getCategoryLightColor(card.category, colors);
  const catEmoji      = getCategoryEmoji(card.category);
  const isStory        = isStoryCard;
  const showTranslitBtn = !!(card.arabic && card.transliteration);

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
      maxHeight: '100%',
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
    translitPill:        { width: 64, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', flexDirection: 'row', overflow: 'hidden' },
    translitSlider:      { position: 'absolute', width: 32, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.95)', top: 0, left: 0 },
    translitHalf:        { width: 32, height: 28, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
    translitLabel:       { fontSize: scale(13), fontWeight: '600', color: '#FFFFFF' },
    translitLabelActive: { fontSize: scale(13), fontWeight: '600', color: '#0D5016' },
    arabicText:    { fontSize: scale(22), lineHeight: scale(38), textAlign: 'right', writingDirection: 'rtl', fontWeight: '500', color: '#FFFFFF' },
    translitText:  { fontSize: scale(14), lineHeight: scale(20), textAlign: 'center', fontWeight: '400', color: '#FFFFFF' },
    storyHeadline: { fontSize: scale(18), fontWeight: '700', color: '#FFFFFF', lineHeight: scale(26), marginTop: spacing.xs },
    body:          { padding: spacing.lg, overflow: 'hidden' },
    translation:   { fontSize: scale(17), lineHeight: scale(26), color: colors.textDark, fontWeight: '600', marginBottom: spacing.md },
    divider:       { height: 1.5, borderRadius: 1, marginBottom: spacing.md },
    explanation:   { fontSize: scale(14.5), lineHeight: scale(23), color: colors.textMid },
    readMore:      { fontSize: scale(13), fontWeight: '600' },
    footer:        { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, gap: spacing.xs },
    sourceIcon:    { fontSize: scale(12) },
    sourceText:    { fontSize: scale(12), color: colors.textLight, fontWeight: '500', flex: 1 },
    heart:         { fontSize: scale(20), minWidth: scale(24) },
    hints:         { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.md, marginTop: spacing.sm },
    hintText:      { fontSize: scale(11), color: colors.textLight, fontWeight: '500' },
  }), [colors]);

  useEffect(() => {
    position.setValue({ x: 0, y: 0 });
    swiping.current = false;
    expandedRef.current = false;
    setExpanded(false);

    // Belt-and-braces reset — component remounts per card anyway, but keep
    // the correction-layer state explicitly fresh.
    setTransLineAdjustment(0);
    setArabicLineAdjustment(0);
    setFullTransLines(0);
    fullTransLinesRef.current = 0;
    setFullArabicLines(0);
    fullArabicLinesRef.current = 0;
    setTransReadMoreOverride(null);
    setArabicReadMoreOverride(null);

    if (instant) {
      fadeAnim.setValue(1);
      onMounted?.();
    } else {
      fadeAnim.setValue(0);
      if (Platform.OS === 'ios') {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start(() => onMounted?.());
      } else {
        const timer = setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }).start(() => onMounted?.());
        }, 40);
        // cleanup handled by component remount via key
      }
    }

    isCardSaved(card.id).then(setSaved);
  }, [card.id]);

  useEffect(() => {
    Animated.spring(translitAnim, {
      toValue: showTransliteration ? 32 : 0,
      tension: 200,
      friction: 20,
      useNativeDriver: true,
    }).start();
  }, [showTransliteration]);

  useEffect(() => {
    if (!expanded) return;
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      expandedRef.current = false;
      setExpanded(false);
      return true;
    });
    return () => handler.remove();
  }, [expanded]);

  // ── One-shot measurement correction ──
  // Corrects the formula's initial estimate using real layout measurements.
  // Shrink-only / hide-only: never expands content or force-shows Read more
  // beyond the overflow case. Resets on a >50dp slotHeight change (rotation)
  // so a fresh correction can apply.
  useEffect(() => {
    if (lastSlotHeightRef.current > 0 && Math.abs(slotHeight - lastSlotHeightRef.current) > 50) {
      correctionAppliedRef.current = false;
      setLineAdjustment(0);
      setTransLineAdjustment(0);
      setArabicLineAdjustment(0);
      setReadMoreOverride(null);
      setTransReadMoreOverride(null);
      setArabicReadMoreOverride(null);
    }
    if (slotHeight > 0) lastSlotHeightRef.current = slotHeight;

    if (expanded) return;
    if (correctionAppliedRef.current && contentHeight <= slotHeight + 2) return;
    if (slotHeight <= 0) return;
    if (contentHeight <= 0) return;

    const measuredHintsHeight = showHints ? hintsHeight : 0;
    const usableSlot = slotHeight - measuredHintsHeight;

    // Translation overflow correction
    if (!truncateArabic && contentHeight > usableSlot + 2 && maxTranslationLines !== undefined) {
      const transOverflow = Math.ceil((contentHeight - usableSlot) / translationLineHeight);
      if (transOverflow > 0) {
        setTransLineAdjustment(prev => prev + transOverflow);
        correctionAppliedRef.current = true;
        return; // let re-render settle before checking further
      }
    }

    // Arabic overflow correction (same pattern)
    if (truncateArabic && contentHeight > usableSlot + 2 && maxArabicLines !== undefined) {
      const arabicOverflow = Math.ceil((contentHeight - usableSlot) / arabicLineHeight);
      if (arabicOverflow > 0) {
        setArabicLineAdjustment(prev => prev + arabicOverflow);
        correctionAppliedRef.current = true;
        return;
      }
    }

    if (contentHeight > usableSlot + 2) {
      // Formula underestimated content height (e.g. iQOO Neo 7) — shrink explanation lines.
      const extraLines = Math.ceil((contentHeight - usableSlot) / explanationLineHeight);
      setLineAdjustment(prev => prev + extraLines);
      correctionAppliedRef.current = true;
    } else if (fullExplLines > 0 && explanationLines !== undefined && fullExplLines <= explanationLines) {
      // Formula overestimated — full explanation already fits, Read more is redundant.
      if (readMoreOverride !== false) setReadMoreOverride(false);
      correctionAppliedRef.current = true;
    } else if (truncateTranslation && fullTransLines > 0 && fullTransLines <= effectiveMaxTranslationLines) {
      // Formula overestimated — full translation already fits, Read more is redundant.
      if (transReadMoreOverride !== false) setTransReadMoreOverride(false);
      correctionAppliedRef.current = true;
    } else if (truncateArabic && fullArabicLines > 0 && fullArabicLines <= effectiveMaxArabicLines) {
      // Formula overestimated — full arabic already fits, Read more is redundant.
      if (arabicReadMoreOverride !== false) setArabicReadMoreOverride(false);
      correctionAppliedRef.current = true;
    }
  }, [slotHeight, contentHeight, fullExplLines, fullTransLines, fullArabicLines, expanded]);

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
    onStartShouldSetPanResponder:        () => false,
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponder: (_, g) => {
      if (expandedRef.current) return false;
      return Math.abs(g.dy) > Math.abs(g.dx) && Math.abs(g.dy) > 8;
    },
    onMoveShouldSetPanResponderCapture: () => false,
    onPanResponderGrant: () => {
      if (expandedRef.current) return;
      swiping.current = false;
    },
    onPanResponderMove: (_, g) => {
      if (expandedRef.current || swiping.current) return;
      position.setValue({ x: 0, y: g.dy });
    },
    onPanResponderRelease: (_, g) => {
      if (expandedRef.current || swiping.current) return;
      if (g.dy < -SWIPE_THRESHOLD)     flyOut('up');
      else if (g.dy > SWIPE_THRESHOLD) flyOut('down');
      else                             snapBack();
    },
    onPanResponderTerminate: () => {
      if (!expandedRef.current && !swiping.current) snapBack();
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

  const handleTranslitPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTransliteration();
  };

  const handleShare = async () => {
    const arabicLine = card.arabic ? `${card.arabic}\n\n` : '';
    const text = `${arabicLine}${card.translation}\n\n${card.explanation}\n\n— ${card.source}\n\n📲 via Noor App`;
    await Share.share({ message: text });
  };

  return (
    <Animated.View
      style={[styles.wrapper, { opacity: fadeAnim, width: isTablet ? screenWidth - 80 : CARD_MAX_WIDTH }]}
      {...panResponder.panHandlers}
    >
      <Animated.View style={[styles.cardShadow, { transform: [{ translateY: position.y }] }]}>
        <View style={styles.cardClip}>
          <View
            onLayout={(e) => {
              contentHeightRef.current = e.nativeEvent.layout.height;
              setContentHeight(e.nativeEvent.layout.height);
            }}
          >

          {/* ── Gradient header band ── */}
          <View style={[styles.headerBand, { backgroundColor: catColor }]}>
            <Text style={styles.watermark}>{WATERMARK[card.category] || '✦'}</Text>
            <View style={styles.bandTop}>
              <View style={[styles.categoryChip, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                <Text style={styles.chipEmoji}>{catEmoji}</Text>
                <Text style={styles.chipTextLight}>{card.category}</Text>
                {card.tag && <Text style={styles.chipTagLight}> · {card.tag}</Text>}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                {showTranslitBtn && (
                  <TouchableOpacity style={styles.translitPill} onPress={handleTranslitPress} activeOpacity={0.9}>
                    <Animated.View style={[styles.translitSlider, { transform: [{ translateX: translitAnim }] }]} />
                    <View style={styles.translitHalf}>
                      <Text style={!showTransliteration ? styles.translitLabelActive : styles.translitLabel}>ع</Text>
                    </View>
                    <View style={styles.translitHalf}>
                      <Text style={showTransliteration ? styles.translitLabelActive : styles.translitLabel}>A</Text>
                    </View>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.7}>
                  <Text style={styles.shareBtnText}>↗</Text>
                </TouchableOpacity>
              </View>
            </View>
            {card.arabic && (
              <>
                <Text
                  style={showTransliteration && card.transliteration ? styles.translitText : styles.arabicText}
                  numberOfLines={truncateArabic && !expanded ? effectiveMaxArabicLines : undefined}
                  onTextLayout={(e) => {
                    const lines = e.nativeEvent.lines.length;
                    if (showTransliteration && card.transliteration) {
                      if (lines !== measuredTranslitLinesRef.current) {
                        measuredTranslitLinesRef.current = lines;
                        setMeasuredTranslitLines(lines);
                      }
                    } else {
                      if (lines !== measuredArabicLinesRef.current) {
                        measuredArabicLinesRef.current = lines;
                        setMeasuredArabicLines(lines);
                      }
                    }
                  }}
                >
                  {showTransliteration && card.transliteration ? card.transliteration : card.arabic}
                </Text>
                {/* Hidden measurement text — reveals real rendered line count for correction */}
                {truncateArabic ? (
                  <Text
                    style={[
                      showTransliteration && card.transliteration ? styles.translitText : styles.arabicText,
                      { position: 'absolute', opacity: 0, left: spacing.lg, right: spacing.lg, top: 0 },
                    ]}
                    pointerEvents="none"
                    onTextLayout={(e) => {
                      if (fullArabicLinesRef.current === 0) {
                        fullArabicLinesRef.current = e.nativeEvent.lines.length;
                        setFullArabicLines(e.nativeEvent.lines.length);
                      }
                    }}
                  >
                    {showTransliteration && card.transliteration ? card.transliteration : card.arabic}
                  </Text>
                ) : null}
                {showArabicReadMore && (
                  <TouchableOpacity
                    onPress={() => { expandedRef.current = true; setExpanded(true); }}
                    activeOpacity={0.7}
                    style={{ marginTop: 4 }}
                  >
                    <Text style={[styles.readMore, { color: '#FFFFFF' }]}>Read more ↓</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            {isStory && (
              <Text
                style={styles.storyHeadline}
                onTextLayout={(e) => {
                  const lines = e.nativeEvent.lines.length;
                  if (lines !== measuredTranslationLinesRef.current) {
                    measuredTranslationLinesRef.current = lines;
                    setMeasuredTranslationLines(lines);
                  }
                }}
              >
                {card.translation}
              </Text>
            )}
          </View>

          {/* ── Card body ── */}
          <View style={styles.body}>
            {/* Translation — hidden if arabic itself is truncated */}
            {!isStory && !truncateArabic && (
              <Text
                style={styles.translation}
                numberOfLines={truncateTranslation && !expanded ? effectiveMaxTranslationLines : undefined}
                onTextLayout={(e) => {
                  const lines = e.nativeEvent.lines.length;
                  if (lines !== measuredTranslationLinesRef.current) {
                    measuredTranslationLinesRef.current = lines;
                    setMeasuredTranslationLines(lines);
                  }
                }}
              >
                {card.translation}
              </Text>
            )}

            {/* Hidden measurement text — reveals real rendered line count for correction */}
            {!isStory && !truncateArabic && card.translation ? (
              <Text
                style={[styles.translation, { position: 'absolute', opacity: 0, left: spacing.lg, right: spacing.lg, top: 0 }]}
                pointerEvents="none"
                onTextLayout={(e) => {
                  if (fullTransLinesRef.current === 0) {
                    fullTransLinesRef.current = e.nativeEvent.lines.length;
                    setFullTransLines(e.nativeEvent.lines.length);
                  }
                }}
              >
                {card.translation}
              </Text>
            ) : null}

            {/* Read more on translation */}
            {!isStory && showTranslationReadMore && (
              <TouchableOpacity
                onPress={() => { expandedRef.current = true; setExpanded(true); }}
                activeOpacity={0.7}
                style={{ marginTop: spacing.sm }}
              >
                <Text style={[styles.readMore, { color: catColor }]}>Read more ↓</Text>
              </TouchableOpacity>
            )}

            {/* Divider + explanation — only when neither arabic nor translation is truncated */}
            {!truncateArabic && !truncateTranslation && card.explanation ? (
              <>
                <View style={[styles.divider, { backgroundColor: catLightColor }]} />
                <Text
                  style={styles.explanation}
                  numberOfLines={effectiveExplanationLines}
                >
                  {card.explanation}
                </Text>
                {/* Hidden measurement text — reveals real rendered line count for correction */}
                <Text
                  style={[styles.explanation, { position: 'absolute', opacity: 0, left: spacing.lg, right: spacing.lg, top: 0 }]}
                  pointerEvents="none"
                  onTextLayout={(e) => {
                    fullExplLinesRef.current = e.nativeEvent.lines.length;
                    setFullExplLines(e.nativeEvent.lines.length);
                  }}
                >
                  {card.explanation}
                </Text>
                {showReadMore && !expanded && (
                  <TouchableOpacity
                    onPress={() => { expandedRef.current = true; setExpanded(true); }}
                    activeOpacity={0.7}
                    style={{ marginTop: spacing.sm }}
                  >
                    <Text style={[styles.readMore, { color: catColor }]}>Read more ↓</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : null}

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
        </View>
      </Animated.View>

      {/* ── Swipe hints (only if showHints=true) ── */}
      {showHints && (
        <View style={styles.hints} onLayout={(e) => setHintsHeight(e.nativeEvent.layout.height)}>
          <Text style={styles.hintText}>↑ Next</Text>
          <Text style={styles.hintText}>↓ Prev</Text>
        </View>
      )}

      {/* ── Read more Modal ── */}
      <Modal
        visible={expanded}
        animationType="slide"
        transparent={false}
        statusBarTranslucent={false}
        onRequestClose={() => { expandedRef.current = false; setExpanded(false); }}
      >
        <View style={{
          flex: 1,
          backgroundColor: colors.bg,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}>

          {/* Header band identical to card */}
          <View style={[styles.headerBand, { backgroundColor: catColor }]}>
            <Text style={styles.watermark}>{WATERMARK[card.category] || '✦'}</Text>
            <View style={styles.bandTop}>
              <View style={[styles.categoryChip, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                <Text style={styles.chipEmoji}>{catEmoji}</Text>
                <Text style={styles.chipTextLight}>{card.category}</Text>
                {card.tag && <Text style={styles.chipTagLight}> · {card.tag}</Text>}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                {showTranslitBtn && (
                  <TouchableOpacity style={styles.translitPill} onPress={handleTranslitPress} activeOpacity={0.9}>
                    <Animated.View style={[styles.translitSlider, { transform: [{ translateX: translitAnim }] }]} />
                    <View style={styles.translitHalf}>
                      <Text style={!showTransliteration ? styles.translitLabelActive : styles.translitLabel}>ع</Text>
                    </View>
                    <View style={styles.translitHalf}>
                      <Text style={showTransliteration ? styles.translitLabelActive : styles.translitLabel}>A</Text>
                    </View>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => { expandedRef.current = false; setExpanded(false); }}
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
            </View>
            {card.arabic && (
              <Text style={showTransliteration && card.transliteration ? styles.translitText : styles.arabicText}>
                {showTransliteration && card.transliteration ? card.transliteration : card.arabic}
              </Text>
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
              onPress={() => { expandedRef.current = false; setExpanded(false); }}
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

        </View>
      </Modal>

    </Animated.View>
  );
}
