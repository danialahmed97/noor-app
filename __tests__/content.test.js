import { CATEGORIES, CATEGORY_COLORS, CATEGORY_LIGHT, content } from '../src/data/content';

// ── CATEGORIES ────────────────────────────────────────────────────────────────

describe('CATEGORIES', () => {
  it('contains All, Story, Ayah, Dua, Hadith', () => {
    expect(CATEGORIES).toEqual(expect.arrayContaining(['All', 'Story', 'Ayah', 'Dua', 'Hadith']));
  });

  it('has exactly 5 items', () => {
    expect(CATEGORIES).toHaveLength(5);
  });

  it('starts with All', () => {
    expect(CATEGORIES[0]).toBe('All');
  });
});

// ── CATEGORY_COLORS ───────────────────────────────────────────────────────────

describe('CATEGORY_COLORS', () => {
  it('has a color for every non-All category', () => {
    const nonAll = CATEGORIES.filter((c) => c !== 'All');
    nonAll.forEach((cat) => {
      expect(CATEGORY_COLORS).toHaveProperty(cat);
      expect(typeof CATEGORY_COLORS[cat]).toBe('string');
    });
  });

  it('all colors are valid hex strings', () => {
    Object.values(CATEGORY_COLORS).forEach((color) => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});

// ── CATEGORY_LIGHT ────────────────────────────────────────────────────────────

describe('CATEGORY_LIGHT', () => {
  it('has a light color for every non-All category', () => {
    const nonAll = CATEGORIES.filter((c) => c !== 'All');
    nonAll.forEach((cat) => {
      expect(CATEGORY_LIGHT).toHaveProperty(cat);
    });
  });
});

// ── content array ─────────────────────────────────────────────────────────────

describe('content', () => {
  it('is an array with 222 cards', () => {
    expect(Array.isArray(content)).toBe(true);
    expect(content).toHaveLength(222);
  });

  it('every card has the required fields', () => {
    const requiredFields = ['id', 'category', 'translation', 'explanation', 'source', 'sourceType'];
    content.forEach((card) => {
      requiredFields.forEach((field) => {
        expect(card).toHaveProperty(field);
        expect(typeof card[field]).toBe('string');
        expect(card[field].length).toBeGreaterThan(0);
      });
    });
  });

  it('every card id is unique', () => {
    const ids = content.map((c) => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(content.length);
  });

  it('every card category is one of the known types', () => {
    const valid = new Set(['Ayah', 'Hadith', 'Story', 'Dua']);
    content.forEach((card) => {
      expect(valid.has(card.category)).toBe(true);
    });
  });

  it('has at least 1 card per category', () => {
    const categories = ['Ayah', 'Hadith', 'Story', 'Dua'];
    categories.forEach((cat) => {
      const count = content.filter((c) => c.category === cat).length;
      expect(count).toBeGreaterThan(0);
    });
  });

  it('Ayah cards have arabic text', () => {
    const ayahs = content.filter((c) => c.category === 'Ayah');
    ayahs.forEach((card) => {
      expect(typeof card.arabic).toBe('string');
      expect(card.arabic.length).toBeGreaterThan(0);
    });
  });

  it('Ayah cards have Quran sourceType', () => {
    const ayahs = content.filter((c) => c.category === 'Ayah');
    ayahs.forEach((card) => {
      expect(card.sourceType).toBe('Quran');
    });
  });

  it('Hadith cards have Hadith sourceType', () => {
    const hadiths = content.filter((c) => c.category === 'Hadith');
    hadiths.forEach((card) => {
      expect(card.sourceType).toBe('Hadith');
    });
  });

  it('card explanations are not unreasonably long (< 1000 chars)', () => {
    content.forEach((card) => {
      expect(card.explanation.length).toBeLessThan(1000);
    });
  });

  it('first card is Ayah 1:1 Bismillah', () => {
    expect(content[0].id).toBe('ayah_1_1');
    expect(content[0].category).toBe('Ayah');
    expect(content[0].tag).toBe('Bismillah');
  });
});

// ── category counts ───────────────────────────────────────────────────────────

describe('category distribution', () => {
  const countBy = (cat) => content.filter((c) => c.category === cat).length;

  it('has 95 Ayah cards', () => {
    expect(countBy('Ayah')).toBe(95);
  });

  it('has 73 Hadith cards', () => {
    expect(countBy('Hadith')).toBe(73);
  });

  it('has 34 Dua cards', () => {
    expect(countBy('Dua')).toBe(34);
  });

  it('has 20 Story cards', () => {
    expect(countBy('Story')).toBe(20);
  });

  it('total of all categories equals content length', () => {
    const total = ['Ayah', 'Hadith', 'Story', 'Dua'].reduce((sum, cat) => sum + countBy(cat), 0);
    expect(total).toBe(content.length);
  });
});
