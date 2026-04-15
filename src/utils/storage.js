import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_KEY       = 'noor_saved_cards';
const HINTS_SHOWN_KEY = 'noor_hints_shown';

export async function getSavedCards() {
  try {
    const json = await AsyncStorage.getItem(SAVED_KEY);
    return json ? JSON.parse(json) : [];
  } catch { return []; }
}

export async function saveCard(card) {
  try {
    const existing = await getSavedCards();
    const already  = existing.find((c) => c.id === card.id);
    if (already) return;
    await AsyncStorage.setItem(SAVED_KEY, JSON.stringify([...existing, card]));
  } catch {}
}

export async function unsaveCard(cardId) {
  try {
    const existing = await getSavedCards();
    await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(existing.filter((c) => c.id !== cardId)));
  } catch {}
}

export async function isCardSaved(cardId) {
  try {
    const existing = await getSavedCards();
    return existing.some((c) => c.id === cardId);
  } catch { return false; }
}

export async function getHintsShown() {
  try {
    const val = await AsyncStorage.getItem(HINTS_SHOWN_KEY);
    return val === 'true';
  } catch { return false; }
}

export async function setHintsShown() {
  try {
    await AsyncStorage.setItem(HINTS_SHOWN_KEY, 'true');
  } catch {}
}
