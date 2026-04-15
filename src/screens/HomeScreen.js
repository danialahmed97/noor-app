import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, Animated, useWindowDimensions,
  Platform, StatusBar,
} from 'react-native';
import { content } from '../data/content';
import { spacing, radius, shadow, scale } from '../theme';
import SwipeCard from '../components/SwipeCard';
import CategoryBar from '../components/CategoryBar';
import { getHintsShown, setHintsShown } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function HomeScreen({ navigation, route }) {
  const { width, height: windowHeight } = useWindowDimensions();
  const { colors, isDark, toggleTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deck,    setDeck]    = useState([]);
  const [index,   setIndex]   = useState(0);
  const [cardKey, setCardKey] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const [toastMsg, setToastMsg] = useState('');
  const [openingFromSaved, setOpeningFromSaved] = useState(false);

  const styles = useMemo(() => StyleSheet.create({
    safe:           { flex: 1, backgroundColor: colors.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
    appName:        { fontSize: scale(26), fontWeight: '700', color: colors.primary, letterSpacing: 0.5 },
    appSub:         { fontSize: scale(11), color: colors.textLight, letterSpacing: 0.4, marginTop: -2 },
    headerButtons:  { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    iconBtn:        { width: 40, height: 40, borderRadius: 20, backgroundColor: isDark ? colors.bgCard : '#EEEAE2', justifyContent: 'center', alignItems: 'center' },
    iconBtnText:    { fontSize: 18 },
    refreshIcon:    { fontSize: 22, color: colors.primary, fontWeight: '600' },
    progressRow:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.sm },
    progressBg:     { flex: 1, height: 3, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
    progressFill:   { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
    progressText:   { fontSize: scale(12), color: colors.textLight, fontWeight: '600', minWidth: 44, textAlign: 'right' },
    cardArea:       { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, maxHeight: windowHeight * 0.78, overflow: 'hidden', alignSelf: 'stretch' },
    empty:          { alignItems: 'center', paddingHorizontal: spacing.xl },
    emptyEmoji:     { fontSize: 56, marginBottom: spacing.md },
    emptyTitle:     { fontSize: scale(22), fontWeight: '700', color: colors.textDark, marginBottom: spacing.sm },
    emptySub:       { fontSize: scale(15), color: colors.textMid, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
    restartBtn:     { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.pill, ...shadow.soft },
    restartBtnText: { color: '#FFF', fontWeight: '700', fontSize: scale(15) },
    toast:          { position: 'absolute', bottom: 110, alignSelf: 'center', backgroundColor: isDark ? 'rgba(76,175,125,0.9)' : 'rgba(13,80,22,0.9)', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 2, borderRadius: radius.pill },
    toastText:      { color: '#FFF', fontSize: scale(13), fontWeight: '600' },
  }), [colors, isDark, windowHeight]);

  useEffect(() => {
    getHintsShown().then((shown) => {
      if (!shown) {
        setShowHints(true);
        setHintsShown();
      }
    });
  }, []);

  useEffect(() => {
    const filtered = selectedCategory === 'All'
      ? content
      : content.filter((c) => c.category === selectedCategory);
    setDeck(shuffleArray(filtered));
    setIndex(0);
    setCardKey((k) => k + 1);
  }, [selectedCategory]);

  useEffect(() => {
    const openCard = route?.params?.openCard;
    if (!openCard) return;

    setOpeningFromSaved(true);

    setSelectedCategory('All');

    const filtered = content.filter((c) => c.id !== openCard.id);
    const newDeck = [openCard, ...shuffleArray(filtered)];
    setDeck(newDeck);
    setIndex(0);
    setCardKey((k) => k + 1);

    navigation.setParams({ openCard: null });
  }, [route?.params?.openCard]);

  const showToast = (msg) => {
    setToastMsg(msg);
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(toastAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start();
  };

  const goNext = useCallback(() => {
    setIndex((prev) => {
      if (prev >= deck.length - 1) {
        showToast('Starting over 🔄');
        setCardKey((k) => k + 1);
        return 0;
      }
      return prev + 1;
    });
    setCardKey((k) => k + 1);
  }, [deck.length]);

  const goPrev = useCallback(() => {
    setIndex((prev) => {
      if (prev <= 0) {
        showToast('Starting over 🔄');
        setCardKey((k) => k + 1);
        return deck.length - 1;
      }
      return prev - 1;
    });
    setCardKey((k) => k + 1);
  }, [deck.length]);

  const handleRestart = useCallback(() => {
    const filtered = selectedCategory === 'All'
      ? content
      : content.filter((c) => c.category === selectedCategory);
    setDeck(shuffleArray(filtered));
    setIndex(0);
    setCardKey((k) => k + 1);
    showToast('🔄 Cards reshuffled');
  }, [selectedCategory]);

  const currentCard = deck[index];
  const total       = deck.length;
  const current     = index + 1;

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>نور</Text>
          <Text style={styles.appSub}>Noor · Islamic Dawah</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleTheme} activeOpacity={0.7}>
            <Text style={styles.iconBtnText}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleRestart} activeOpacity={0.7}>
            <Text style={styles.refreshIcon}>↺</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Category filter ── */}
      <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} />

      {/* ── Progress ── */}
      {total > 0 && (
        <View style={styles.progressRow}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${(current / total) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{current} / {total}</Text>
        </View>
      )}

      {/* ── Card area ── */}
      <View style={styles.cardArea}>
        {currentCard ? (
          <View style={{ maxHeight: '100%', justifyContent: 'center' }}>
            <SwipeCard
              key={`${cardKey}-${currentCard.id}`}
              card={currentCard}
              onNext={goNext}
              onPrev={goPrev}
              showHints={showHints}
              instant={openingFromSaved}
              onMounted={() => setOpeningFromSaved(false)}
            />
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌙</Text>
            <Text style={styles.emptyTitle}>All done!</Text>
            <Text style={styles.emptySub}>Alhamdulillah — may Allah put these words in your heart.</Text>
            <TouchableOpacity style={styles.restartBtn} onPress={handleRestart} activeOpacity={0.8}>
              <Text style={styles.restartBtnText}>Start Again ↺</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── Toast ── */}
      <Animated.View
        style={[styles.toast, {
          opacity: toastAnim,
          transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
        }]}
        pointerEvents="none"
      >
        <Text style={styles.toastText}>{toastMsg}</Text>
      </Animated.View>

    </SafeAreaView>
  );
}
