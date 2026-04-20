import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getSavedCards,
  saveCard,
  unsaveCard,
  isCardSaved,
  getHintsShown,
  setHintsShown,
} from '../src/utils/storage';

const CARD_A = { id: 'card_1', category: 'Ayah', translation: 'Test A', arabic: '', explanation: '', source: '', sourceType: 'Quran' };
const CARD_B = { id: 'card_2', category: 'Hadith', translation: 'Test B', arabic: '', explanation: '', source: '', sourceType: 'Hadith' };

beforeEach(() => {
  AsyncStorage._reset();
});

// ── getSavedCards ────────────────────────────────────────────────────────────

describe('getSavedCards', () => {
  it('returns empty array when nothing is stored', async () => {
    const result = await getSavedCards();
    expect(result).toEqual([]);
  });

  it('returns parsed cards when storage has data', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([CARD_A]));
    const result = await getSavedCards();
    expect(result).toEqual([CARD_A]);
  });

  it('returns empty array when AsyncStorage throws', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('storage error'));
    const result = await getSavedCards();
    expect(result).toEqual([]);
  });
});

// ── saveCard ─────────────────────────────────────────────────────────────────

describe('saveCard', () => {
  it('saves a card when none exist', async () => {
    await saveCard(CARD_A);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'noor_saved_cards',
      JSON.stringify([CARD_A])
    );
  });

  it('appends to existing cards', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([CARD_A]));
    await saveCard(CARD_B);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'noor_saved_cards',
      JSON.stringify([CARD_A, CARD_B])
    );
  });

  it('does not save duplicate cards (same id)', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([CARD_A]));
    await saveCard(CARD_A);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('does not throw when AsyncStorage throws', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('fail'));
    await expect(saveCard(CARD_A)).resolves.toBeUndefined();
  });
});

// ── unsaveCard ───────────────────────────────────────────────────────────────

describe('unsaveCard', () => {
  it('removes the card with matching id', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([CARD_A, CARD_B]));
    await unsaveCard('card_1');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'noor_saved_cards',
      JSON.stringify([CARD_B])
    );
  });

  it('leaves list unchanged when id not found', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([CARD_A]));
    await unsaveCard('nonexistent_id');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'noor_saved_cards',
      JSON.stringify([CARD_A])
    );
  });

  it('results in empty array when removing the only card', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([CARD_A]));
    await unsaveCard('card_1');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'noor_saved_cards',
      JSON.stringify([])
    );
  });

  it('does not throw when AsyncStorage throws', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('fail'));
    await expect(unsaveCard('card_1')).resolves.toBeUndefined();
  });
});

// ── isCardSaved ──────────────────────────────────────────────────────────────

describe('isCardSaved', () => {
  it('returns true when card id is in storage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([CARD_A, CARD_B]));
    expect(await isCardSaved('card_1')).toBe(true);
  });

  it('returns false when card id is not in storage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([CARD_A]));
    expect(await isCardSaved('card_999')).toBe(false);
  });

  it('returns false when storage is empty', async () => {
    expect(await isCardSaved('card_1')).toBe(false);
  });

  it('returns false when AsyncStorage throws', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('fail'));
    expect(await isCardSaved('card_1')).toBe(false);
  });
});

// ── getHintsShown / setHintsShown ────────────────────────────────────────────

describe('getHintsShown', () => {
  it('returns false when key is not set', async () => {
    expect(await getHintsShown()).toBe(false);
  });

  it('returns true when key is set to "true"', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('true');
    expect(await getHintsShown()).toBe(true);
  });

  it('returns false for any value other than "true"', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('false');
    expect(await getHintsShown()).toBe(false);
  });

  it('returns false when AsyncStorage throws', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('fail'));
    expect(await getHintsShown()).toBe(false);
  });
});

describe('setHintsShown', () => {
  it('stores "true" under the hints key', async () => {
    await setHintsShown();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('noor_hints_shown', 'true');
  });

  it('does not throw when AsyncStorage throws', async () => {
    AsyncStorage.setItem.mockRejectedValueOnce(new Error('fail'));
    await expect(setHintsShown()).resolves.toBeUndefined();
  });
});
