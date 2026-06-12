// Weekly content generation for Noor.
//
// Picks a theme (or uses a manual override from state/topics.json), asks the
// Anthropic API for 15 new content cards on that theme, validates them, and
// appends the valid ones to src/data/content.js. Prints a PR description to
// stdout. No external dependencies — relies on Node 20+'s built-in fetch.

'use strict';

const fs = require('fs');
const path = require('path');
const { validateBatch } = require('./validate-schema');

const ROOT_DIR = path.join(__dirname, '..');
const CONTENT_PATH = path.join(ROOT_DIR, 'src', 'data', 'content.js');
const STATE_PATH = path.join(ROOT_DIR, 'state', 'topics.json');
const STATE_DIR = path.join(ROOT_DIR, 'state');

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = 'claude-sonnet-4-5';
const GENERATION_MAX_TOKENS = 16000;
const THEME_MAX_TOKENS = 1024;

const CARDS_PER_BATCH = 15;
const MIN_VALID_CARDS = 10;
const THEME_HISTORY_LIMIT = 20;
const RECENT_THEMES_TO_AVOID = 4;

const FIELD_ORDER = [
  'id',
  'category',
  'arabic',
  'transliteration',
  'translation',
  'explanation',
  'source',
  'sourceType',
  'tag',
];

// Style references copied verbatim from src/data/content.js so the model
// matches existing tone, length, and formatting.
const EXAMPLE_CARDS = [
  {
    id: 'ayah_2_286',
    category: 'Ayah',
    arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    transliteration: 'Lā yukallifullāhu nafsan illā wusʿahā',
    translation: '"Allah does not burden a soul beyond what it can bear."',
    explanation:
      "When life feels overwhelming, remember — Allah knows your limits better than you do. Every trial you face is within your capacity to handle. You were not given this difficulty by accident; you were chosen for it because you are strong enough.",
    source: 'Surah Al-Baqarah • 2:286',
    sourceType: 'Quran',
    tag: 'Tawakkul',
  },
  {
    id: 'dua_anxiety_1',
    category: 'Dua',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    transliteration: 'Rabbi-shrah lī ṣadrī wa yassir lī amrī',
    translation: '"My Lord, expand for me my chest and ease for me my task."',
    explanation:
      "The du'a of Prophet Musa (AS) before speaking to Pharaoh. Recite this when facing anxiety, a difficult conversation, public speaking, or any overwhelming situation. Ask Allah to open your heart and smooth your path — He answered Musa, He will answer you.",
    source: 'Surah Ta-Ha • 20:25–26',
    sourceType: 'Dua',
    tag: 'Anxiety',
  },
  {
    id: 'story_woman_cat',
    category: 'Story',
    arabic: null,
    transliteration: null,
    translation: 'The Woman and the Cat — Cruelty Has Consequences',
    explanation:
      "A woman entered Hellfire because of a cat she locked up — neither feeding it nor freeing it to eat. Islam teaches that mercy toward all living beings is worship. Cruelty to animals is not a minor matter in Allah's sight — every creature matters.",
    source: 'Sahih Bukhari • Narrated by Abdullah ibn Umar (RA)',
    sourceType: 'Story',
    tag: 'Mercy',
  },
];

main().catch((err) => {
  console.error(`ERROR: ${err.message}`);
  process.exit(1);
});

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ERROR: ANTHROPIC_API_KEY environment variable is not set');
    process.exit(1);
  }

  const { source, existingIds, categoryCounts } = readExistingContent();
  const state = loadState();

  let theme;
  let reasoning;
  if (typeof state.overrideTheme === 'string' && state.overrideTheme.trim()) {
    theme = state.overrideTheme.trim();
    reasoning = `Manual override set in state/topics.json (overrideTheme = "${theme}").`;
  } else {
    const picked = await pickTheme(apiKey, {
      categoryCounts,
      themeHistory: Array.isArray(state.themeHistory) ? state.themeHistory : [],
    });
    theme = picked.theme;
    reasoning = picked.reasoning;
  }

  const rawCards = await generateCards(apiKey, { theme, existingIds });

  let cards;
  try {
    cards = JSON.parse(stripCodeFences(rawCards));
  } catch (err) {
    const savedPath = saveFailedBatch(rawCards);
    console.error(`ERROR: Failed to parse card generation response as JSON (${err.message})`);
    console.error(`Raw response saved to ${savedPath}`);
    process.exit(1);
  }

  if (!Array.isArray(cards)) {
    const savedPath = saveFailedBatch(rawCards);
    console.error('ERROR: Card generation response was not a JSON array');
    console.error(`Raw response saved to ${savedPath}`);
    process.exit(1);
  }

  const { validCards, droppedCards, errors } = validateBatch(cards, existingIds);

  if (droppedCards.length > 0) {
    console.error(`Dropped ${droppedCards.length} card(s) during validation:`);
    for (const e of errors) {
      console.error(`  - ${e}`);
    }
  }

  if (validCards.length < MIN_VALID_CARDS) {
    console.error(
      `ERROR: Only ${validCards.length} valid card(s), below the minimum of ${MIN_VALID_CARDS}. Aborting without writing changes.`
    );
    process.exit(1);
  }

  const updatedSource = appendCards(source, validCards);
  fs.writeFileSync(CONTENT_PATH, updatedSource);

  const newState = updateState(state, { theme });
  saveState(newState);

  printPrSummary({
    batchCount: newState.batchCount,
    theme,
    reasoning,
    validCards,
    droppedCards,
  });
}

function readExistingContent() {
  const source = fs.readFileSync(CONTENT_PATH, 'utf8');

  const existingIds = new Set();
  const idRegex = /id:\s*"([^"]*)"/g;
  let match;
  while ((match = idRegex.exec(source)) !== null) {
    existingIds.add(match[1]);
  }

  const categoryCounts = {};
  const categoryRegex = /category:\s*"([^"]*)"/g;
  while ((match = categoryRegex.exec(source)) !== null) {
    categoryCounts[match[1]] = (categoryCounts[match[1]] || 0) + 1;
  }

  return { source, existingIds, categoryCounts };
}

function loadState() {
  return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n');
}

async function callAnthropic({ apiKey, system, messages, maxTokens }) {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  if (!Array.isArray(data.content)) {
    throw new Error(`Unexpected Anthropic API response shape: ${JSON.stringify(data)}`);
  }

  return data.content.map((block) => (block.type === 'text' ? block.text : '')).join('');
}

function stripCodeFences(text) {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}

async function pickTheme(apiKey, { categoryCounts, themeHistory }) {
  const recentThemes = themeHistory.slice(-RECENT_THEMES_TO_AVOID);

  const system = [
    'You help plan weekly content themes for Noor, an Islamic dawah app that delivers short cards',
    '(categories: Ayah, Hadith, Story, Dua) in a swipeable feed.',
    '',
    "Pick ONE specific theme for this week's batch of 15 new cards — concrete enough to inspire",
    'focused content, e.g. "Patience in Hardship", "The Companions of the Prophet", "Mercy to Creation",',
    '"Names of Allah: Ar-Rahman", "Stories of the Prophets: Yusuf (AS)".',
    '',
    'Consider the current category distribution (favour themes that let under-represented categories',
    'grow) and avoid repeating recent themes.',
    '',
    'Respond with ONLY a JSON object of the form {"theme": "...", "reasoning": "..."}.',
    'No markdown fences, no commentary, no extra keys.',
  ].join('\n');

  const userPrompt = [
    `Current card counts by category: ${JSON.stringify(categoryCounts)}`,
    recentThemes.length
      ? `Avoid repeating these recent themes: ${recentThemes.join(', ')}.`
      : 'No theme history yet — pick freely.',
    '',
    'Respond with ONLY the JSON object described in the system prompt.',
  ].join('\n');

  const raw = await callAnthropic({
    apiKey,
    system,
    messages: [{ role: 'user', content: userPrompt }],
    maxTokens: THEME_MAX_TOKENS,
  });

  let parsed;
  try {
    parsed = JSON.parse(stripCodeFences(raw));
  } catch (err) {
    throw new Error(`Failed to parse theme-pick response as JSON (${err.message}). Raw response:\n${raw}`);
  }

  if (!parsed || typeof parsed.theme !== 'string' || !parsed.theme.trim()) {
    throw new Error(`Theme-pick response missing "theme" field. Raw response:\n${raw}`);
  }

  return {
    theme: parsed.theme.trim(),
    reasoning: typeof parsed.reasoning === 'string' && parsed.reasoning.trim()
      ? parsed.reasoning.trim()
      : '(no reasoning provided)',
  };
}

function buildCardSystemPrompt() {
  return [
    'You are a careful Islamic content writer for Noor, a mobile dawah app that delivers short,',
    'swipeable content cards (Ayah, Hadith, Story, Dua) to Muslims for daily reflection.',
    '',
    '## Card schema',
    'Return a JSON array of card objects. Each object must have EXACTLY these fields:',
    '',
    '- id (string): unique identifier, lowercase, format "{category_lower}_{descriptor}",',
    '  e.g. "ayah_2_255", "dua_morning_3", "hadith_intentions", "story_abu_bakr_cave"',
    '- category (string): one of "Ayah", "Hadith", "Story", "Dua"',
    '- arabic (string or null): Arabic text with full diacritics (tashkeel); null ONLY for Story cards',
    '- transliteration (string or null): scholarly transliteration with diacritics; null ONLY for Story cards',
    '- translation (string): for Ayah/Hadith/Dua, the English translation wrapped in escaped double',
    '  quotes (e.g. "\\"...\\""); for Story, this is the card headline (no surrounding quotes)',
    '- explanation (string): 40-60 words, plain text, no surrounding quotes',
    '- source (string): precise citation',
    '- sourceType (string): one of "Quran", "Hadith", "Story", "Dua"',
    '- tag (string): short Title Case tag (1-2 words)',
    '',
    '## Batch composition',
    `This batch has ${CARDS_PER_BATCH} cards. Target distribution (adjust slightly to fit the theme):`,
    '7 Story, 4 Dua, 3 Ayah, 1 Hadith.',
    '',
    '## Transliteration rules',
    '- Use full scholarly diacritics: ṣ ḍ ṭ ẓ ī ā ū ʿ ʾ',
    '- Sun-letter handling: write as pronounced ("dunyā" not "al-dunyā")',
    '- Capitalize divine names and attributes (Allāh, Rabb, Raḥmān, Raḥīm, etc.)',
    '',
    '## Hadith reliability — CRITICAL',
    'If you are not confident in a Hadith\'s exact wording or authenticity (Sahih/Hasan), DO NOT',
    'include it. Quality over completeness. Better to return 25 verified cards than 35 with one',
    'fabricated reference.',
    '',
    '## Source citation format',
    'Be precise, e.g. "Surah Al-Baqarah • 2:286", "Sahih al-Bukhari • Book of Faith • #1",',
    '"Sunan Abu Dawud • Du\'a • #1525".',
    '',
    '## Output format',
    'Output ONLY a JSON array of card objects. No markdown code fences, no preamble, no commentary,',
    'no trailing text — your entire response must be valid JSON starting with [ and ending with ].',
    '',
    '## Style examples',
    'Match the tone, length, and formatting of these existing cards:',
    '',
    JSON.stringify(EXAMPLE_CARDS, null, 2),
  ].join('\n');
}

async function generateCards(apiKey, { theme, existingIds }) {
  const system = buildCardSystemPrompt();
  const idList = Array.from(existingIds).join(', ');

  const userPrompt = `Generate ${CARDS_PER_BATCH} cards on the theme: ${theme}. Avoid these existing IDs: ${idList}. Return only the JSON array.`;

  return callAnthropic({
    apiKey,
    system,
    messages: [{ role: 'user', content: userPrompt }],
    maxTokens: GENERATION_MAX_TOKENS,
  });
}

function saveFailedBatch(rawText) {
  if (!fs.existsSync(STATE_DIR)) {
    fs.mkdirSync(STATE_DIR, { recursive: true });
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(STATE_DIR, `failed-batch-${timestamp}.txt`);
  fs.writeFileSync(filePath, rawText);
  return path.relative(ROOT_DIR, filePath);
}

function formatValue(value) {
  return value === null ? 'null' : JSON.stringify(value);
}

function formatCard(card) {
  const lines = FIELD_ORDER.map((field) => `    ${field}: ${formatValue(card[field])},`);
  return `  {\n${lines.join('\n')}\n  },`;
}

function appendCards(source, cards) {
  const closingIndex = source.lastIndexOf('\n];');
  if (closingIndex === -1) {
    throw new Error('Could not find closing "];" of the content array in src/data/content.js');
  }

  const before = source.slice(0, closingIndex);
  const after = source.slice(closingIndex); // starts with "\n];"
  const newEntries = cards.map(formatCard).join('\n\n');

  return `${before}\n\n${newEntries}${after}`;
}

function updateState(state, { theme }) {
  const history = Array.isArray(state.themeHistory) ? state.themeHistory.slice() : [];
  history.push(theme);
  while (history.length > THEME_HISTORY_LIMIT) {
    history.shift();
  }

  return {
    ...state,
    lastTheme: theme,
    lastGeneratedAt: new Date().toISOString(),
    overrideTheme: null,
    themeHistory: history,
    batchCount: (state.batchCount || 0) + 1,
  };
}

function printPrSummary({ batchCount, theme, reasoning, validCards, droppedCards }) {
  const breakdown = {};
  for (const card of validCards) {
    breakdown[card.category] = (breakdown[card.category] || 0) + 1;
  }
  const breakdownStr =
    Object.entries(breakdown)
      .map(([cat, count]) => `${cat}: ${count}`)
      .join(', ') || 'none';

  const idList = validCards.map((c) => `- ${c.id}`).join('\n');

  const lines = [
    `## 🌙 Weekly card batch #${batchCount}`,
    '',
    `**Theme:** ${theme}`,
    '',
    `**Reasoning:** ${reasoning}`,
    '',
    '**Stats:**',
    `- Total cards added: ${validCards.length}`,
    `- Cards dropped (failed validation): ${droppedCards.length}`,
    `- By category: ${breakdownStr}`,
    '',
    '**Card IDs added:**',
    idList || '- (none)',
    '',
    '**Review checklist:**',
    '- [ ] Spot-check 5 random cards for accuracy',
    '- [ ] Verify no fabricated Hadith citations',
    '- [ ] Confirm Arabic + transliteration alignment',
    '- [ ] Check source citations are precise',
    '',
    'Merge to main to publish via OTA.',
  ];

  console.log(lines.join('\n'));
}
