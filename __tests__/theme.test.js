import {
  scale,
  isTablet,
  CARD_MAX_WIDTH,
  spacing,
  radius,
  shadow,
  getCategoryColor,
  getCategoryLightColor,
  getCategoryEmoji,
} from '../src/theme';
import { Dimensions } from 'react-native';

const MOCK_WIDTH = 375; // jest-expo default window width

// ── scale ────────────────────────────────────────────────────────────────────

describe('scale', () => {
  it('returns size unchanged on a 375-wide screen (BASE_WIDTH)', () => {
    // scale = (screenWidth / 375) * size  → 375/375 * n = n
    expect(scale(16)).toBeCloseTo(16);
  });

  it('returns a number for any positive input', () => {
    expect(typeof scale(24)).toBe('number');
    expect(scale(24)).toBeGreaterThan(0);
  });

  it('scales proportionally', () => {
    const s = scale(10);
    expect(scale(20)).toBeCloseTo(s * 2);
  });
});

// ── isTablet / CARD_MAX_WIDTH ─────────────────────────────────────────────────

describe('isTablet', () => {
  it('is a boolean', () => {
    expect(typeof isTablet).toBe('boolean');
  });
});

describe('CARD_MAX_WIDTH', () => {
  it('is a positive number', () => {
    expect(typeof CARD_MAX_WIDTH).toBe('number');
    expect(CARD_MAX_WIDTH).toBeGreaterThan(0);
  });

  it('is 560 on tablet or (screenWidth - 32) otherwise', () => {
    const { width } = Dimensions.get('window');
    if (width >= 768) {
      expect(CARD_MAX_WIDTH).toBe(560);
    } else {
      expect(CARD_MAX_WIDTH).toBe(width - 32);
    }
  });
});

// ── spacing & radius ─────────────────────────────────────────────────────────

describe('spacing', () => {
  it('has all required keys', () => {
    expect(spacing).toHaveProperty('xs', 4);
    expect(spacing).toHaveProperty('sm', 8);
    expect(spacing).toHaveProperty('md', 16);
    expect(spacing).toHaveProperty('lg', 24);
    expect(spacing).toHaveProperty('xl', 32);
    expect(spacing).toHaveProperty('xxl', 48);
  });

  it('values are strictly increasing', () => {
    const vals = [spacing.xs, spacing.sm, spacing.md, spacing.lg, spacing.xl, spacing.xxl];
    for (let i = 1; i < vals.length; i++) {
      expect(vals[i]).toBeGreaterThan(vals[i - 1]);
    }
  });
});

describe('radius', () => {
  it('has sm, md, lg, pill', () => {
    expect(radius).toHaveProperty('sm', 8);
    expect(radius).toHaveProperty('md', 16);
    expect(radius).toHaveProperty('lg', 24);
    expect(radius).toHaveProperty('pill', 100);
  });
});

// ── shadow ───────────────────────────────────────────────────────────────────

describe('shadow', () => {
  it('card shadow has required properties', () => {
    expect(shadow.card).toMatchObject({
      shadowColor: '#000',
      elevation: expect.any(Number),
    });
  });

  it('soft shadow has lower elevation than card', () => {
    expect(shadow.soft.elevation).toBeLessThan(shadow.card.elevation);
  });
});

// ── getCategoryColor ──────────────────────────────────────────────────────────

describe('getCategoryColor', () => {
  const colors = {
    ayah: '#1B5E20',
    hadith: '#1A237E',
    story: '#4A148C',
    dua: '#B71C1C',
    primary: '#0D5016',
  };

  it.each([
    ['Ayah', '#1B5E20'],
    ['Hadith', '#1A237E'],
    ['Story', '#4A148C'],
    ['Dua', '#B71C1C'],
  ])('returns correct color for %s', (category, expected) => {
    expect(getCategoryColor(category, colors)).toBe(expected);
  });

  it('returns primary color for unknown category', () => {
    expect(getCategoryColor('Unknown', colors)).toBe(colors.primary);
  });
});

// ── getCategoryLightColor ─────────────────────────────────────────────────────

describe('getCategoryLightColor', () => {
  const colors = {
    ayahLight: '#E8F5E9',
    hadithLight: '#E8EAF6',
    storyLight: '#F3E5F5',
    duaLight: '#FFEBEE',
  };

  it.each([
    ['Ayah', '#E8F5E9'],
    ['Hadith', '#E8EAF6'],
    ['Story', '#F3E5F5'],
    ['Dua', '#FFEBEE'],
  ])('returns correct light color for %s', (category, expected) => {
    expect(getCategoryLightColor(category, colors)).toBe(expected);
  });

  it('returns ayahLight as fallback for unknown category', () => {
    expect(getCategoryLightColor('Unknown', colors)).toBe(colors.ayahLight);
  });
});

// ── getCategoryEmoji ──────────────────────────────────────────────────────────

describe('getCategoryEmoji', () => {
  it.each([
    ['Ayah', '📖'],
    ['Hadith', '🌙'],
    ['Story', '✨'],
    ['Dua', '🤲'],
  ])('returns correct emoji for %s', (category, expected) => {
    expect(getCategoryEmoji(category)).toBe(expected);
  });

  it('returns 📖 as default for unknown category', () => {
    expect(getCategoryEmoji('Unknown')).toBe('📖');
  });
});
