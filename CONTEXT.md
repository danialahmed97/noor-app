# Noor App — Full Project Context

> Feed this file to Claude when you want full context on the Noor codebase.

---

## What Is This

**Noor - Islamic Dawah** is a React Native / Expo mobile app for iOS and Android.
It delivers curated Islamic content (Quranic verses, hadiths, stories, duas) in a swipeable card interface — inspired by Inshorts. No backend. Fully offline. Content is bundled in the app.

**Project path:** `/Users/danialahmedbarbhuiya/My Companies/noor-app/`
**Bundle ID:** `com.noor.dawah` (iOS + Android)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.81.5 |
| Runtime | Expo SDK 54.0.0 |
| React | 19.1.0 |
| Navigation | React Navigation v6 — Bottom Tabs |
| Persistence | AsyncStorage 2.2.0 (local only, no backend) |
| Animations | React Native Animated (built-in) |
| Haptics | expo-haptics ~15.0.8 |
| Gradient | expo-linear-gradient ~15.0.8 |
| Icons | @expo/vector-icons ^15.0.3 |
| Safe Area | react-native-safe-area-context ~5.6.0 |
| Screens | react-native-screens ~4.16.0 |
| Dev tools | babel-preset-expo, @babel/core |

**Run commands:**
```bash
npx expo start          # start dev server
npx expo start --clear  # start with cache cleared (use after package changes)
```

---

## File Structure

```
noor-app/
├── App.js                          ← Root. NavigationContainer + Tab.Navigator (3 tabs)
├── app.json                        ← Expo config (no icon/splash — stripped to avoid missing asset errors)
├── package.json                    ← SDK 54 locked dependencies
├── babel.config.js                 ← babel-preset-expo
├── CONTEXT.md                      ← This file
├── assets/                         ← icon.png, splash.png, adaptive-icon.png (green placeholder PNGs)
└── src/
    ├── screens/
    │   ├── HomeScreen.js           ← Main card deck screen
    │   ├── SavedScreen.js          ← Bookmarked cards (reads AsyncStorage)
    │   └── SettingsScreen.js       ← About, stats, how-to, disclaimer
    ├── components/
    │   ├── SwipeCard.js            ← Individual card with PanResponder swipe gestures
    │   └── CategoryBar.js          ← Horizontal scrollable category filter
    ├── data/
    │   └── content.js              ← All 35+ Islamic card objects + CATEGORIES array
    ├── utils/
    │   └── storage.js              ← AsyncStorage helpers
    └── theme.js                    ← All design tokens (colors, spacing, radius, shadow, helpers)
```

---

## App.js — Root

Sets up `Tab.Navigator` with 3 screens:
- **Home** — emoji 🏠, label "Discover"
- **Saved** — emoji 🤍, label "Saved"
- **Settings** — emoji ☪️, label "About"

Tab bar: white background, 85px height on iOS / 65px on Android, no native labels (custom `TabIcon` component renders emoji + text).

---

## HomeScreen.js

**State:**
- `selectedCategory` — `'All'` | `'Ayah'` | `'Hadith'` | `'Story'` | `'Dua'`
- `deck` — shuffled array of card objects for current category
- `index` — current card index
- `cardKey` — incremented to force SwipeCard remount on navigation
- `toastMsg` + `toastAnim` — fade toast notifications

**Logic:**
- On category change → filter content → shuffle → reset index to 0
- `goNext()` → increment index (capped at deck.length - 1), shows toast at last card
- `goPrev()` → decrement index (capped at 0), shows toast at first card
- `handleRestart()` → reshuffle current category, reset to 0, show "🔄 Cards reshuffled" toast

**UI:**
- Header: Arabic "نور" + "Noor · Islamic Dawah" + refresh button (↺)
- CategoryBar below header
- Progress bar + "X / Y" counter
- Card area (SwipeCard or empty state)
- Prev / Next button row at bottom
- Toast overlay (position: absolute, bottom: 110)

**Current swipe model:** Swipe LEFT = next card, swipe RIGHT = previous card. No save/skip — every card matters.

---

## SwipeCard.js

**Props:** `card`, `onNext`, `onPrev`

**Gesture:** `PanResponder` — horizontal drag only (dx > dy threshold). Swipe left → `flyOut('left')` → calls `onNext()`. Swipe right → `flyOut('right')` → calls `onPrev()`. Under threshold → `snapBack()`.

**Animations:**
- `position` (Animated.ValueXY) — card translate X/Y
- `rotate` — interpolated from position.x: `[-6deg, 0deg, 6deg]`
- `fadeAnim` — fade in on mount (200ms)

**Card layout (top to bottom):**
1. Header row: category chip (emoji + name + tag) | share button (↗)
2. Arabic text box (left border in category color) — only if `card.arabic` is not null
3. Translation (bold, 17px)
4. Thin colored divider
5. Explanation (14.5px, up to 6 lines, "Read more ↓" toggle if >160 chars)
6. Footer: source icon + source text
7. Swipe hints row below card: "← Previous" and "Next →"

**Share:** Native `Share.share()` — formats Arabic + translation + explanation + source + "📲 via Noor App"

---

## theme.js — Design Tokens

```js
colors = {
  primary:     '#0D5016',   // Deep Islamic green
  gold:        '#C9A84C',
  bg:          '#F6F4EE',   // Warm parchment background
  bgCard:      '#FFFFFF',
  textDark:    '#1A1A1A',
  textMid:     '#555555',
  textLight:   '#888888',
  arabic:      '#8B6914',   // Golden brown for Arabic text
  // Category colors
  ayah:        '#1B5E20',   ayahLight:   '#E8F5E9',
  hadith:      '#1A237E',   hadithLight: '#E8EAF6',
  story:       '#4A148C',   storyLight:  '#F3E5F5',
  dua:         '#B71C1C',   duaLight:    '#FFEBEE',
  // Swipe
  swipeRight:  '#27AE60',
  swipeLeft:   '#E74C3C',
  // Tab bar
  tabBar:      '#FFFFFF',
  tabActive:   '#0D5016',
  tabInactive: '#999999',
}

spacing = { xs:4, sm:8, md:16, lg:24, xl:32, xxl:48 }
radius  = { sm:8, md:16, lg:24, pill:100 }
shadow.card = { shadowOpacity:0.12, shadowRadius:12, elevation:6 }
shadow.soft = { shadowOpacity:0.08, shadowRadius:6,  elevation:3 }
```

**Helper functions:**
- `getCategoryColor(category)` → primary hex
- `getCategoryLightColor(category)` → light background hex
- `getCategoryEmoji(category)` → `'📖' | '🌙' | '✨' | '🤲'`

---

## content.js — Data Model

```js
export const CATEGORIES = ['All', 'Ayah', 'Hadith', 'Story', 'Dua'];

// Each card:
{
  id:          'ayah_1',            // unique string
  category:    'Ayah',             // 'Ayah' | 'Hadith' | 'Story' | 'Dua'
  arabic:      'بِسْمِ اللَّهِ…', // Arabic text, or null for Stories
  translation: '"English translation in quotes."',
  explanation: 'Up to ~60 word explanation with context.',
  source:      'Surah Al-Fatihah • 1:1',
  sourceType:  'Quran',            // 'Quran' | 'Hadith' | 'Story' | 'Dua'
  tag:         'Bismillah',        // Short contextual label
}
```

**Current card count: 35+ cards**
- 10 Ayahs (Quranic verses with Arabic)
- 10 Hadiths (with Arabic)
- 7 Stories (arabic: null, translation is the story title)
- 8 Duas (with Arabic)

**Story cards** use `translation` as the story title/headline instead of a quoted verse.
**Source icon logic** in SwipeCard: Quran=📖, Hadith=📜, Dua=🤲, Story=✨

---

## storage.js — AsyncStorage API

```js
getSavedCards()          // returns array of saved card objects
saveCard(card)           // adds card to saved list
unsaveCard(cardId)       // removes card by id
isCardSaved(cardId)      // returns boolean
```

Storage key: `'noor_saved_cards'` (assumed — check file if editing).

---

## package.json (final locked versions)

```json
{
  "dependencies": {
    "@expo/vector-icons": "^15.0.3",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@react-navigation/bottom-tabs": "^6.6.1",
    "@react-navigation/native": "^6.1.18",
    "expo": "~54.0.0",
    "expo-haptics": "~15.0.8",
    "expo-linear-gradient": "~15.0.8",
    "expo-status-bar": "~3.0.9",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "babel-preset-expo": "^55.0.17"
  }
}
```

---

## app.json (current — no icon/splash to avoid missing asset errors)

```json
{
  "expo": {
    "name": "Noor - Islamic Dawah",
    "slug": "noor-dawah",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "assetBundlePatterns": ["**/*"],
    "ios": { "supportsTablet": false, "bundleIdentifier": "com.noor.dawah" },
    "android": { "package": "com.noor.dawah" }
  }
}
```

> Note: `icon` and `splash` fields were removed because the asset files were missing and caused Metro to crash. Placeholder PNGs now exist in `assets/` — they can be added back if needed.

---

## Known Issues / History

| Issue | Fix Applied |
|---|---|
| `EMFILE: too many open files` on `expo start` | Installed Watchman via `brew install watchman` |
| SDK 51 vs Expo Go SDK 54 mismatch | Updated all packages to SDK 54 via `npx expo install --fix` |
| `react@18.3.2` doesn't exist on npm | Corrected to `18.3.1`, then `npx expo install --fix` bumped to `19.1.0` |
| Missing `icon.png`, `splash.png` in assets/ | Generated green placeholder PNGs via Python script |
| `babel-preset-expo` missing | Installed as devDependency |
| Port 8081 conflict from stale background process | `lsof -ti:8081 \| xargs kill -9` |

---

## Future Feature Ideas

- Daily push notifications (`expo-notifications`)
- Dark mode toggle
- Arabic language UI
- Audio recitation for Ayahs and Duas
- Live CMS / API content sync (replace bundled content)
- Reading streak tracker
- Prayer time integration (expo-location)
- Saving cards (AsyncStorage already has the util — just needs UI wired up in current version)

---

## How to Add a New Card

Open `src/data/content.js` and add an object to the `content` array:

```js
{
  id: 'ayah_11',           // must be unique
  category: 'Ayah',
  arabic: 'Arabic text here',
  translation: '"English translation in quotes."',
  explanation: 'Explanation in ~40-60 words. Keep it grounded and practical.',
  source: 'Surah X • Y:Z',
  sourceType: 'Quran',
  tag: 'ShortTag',
}
```

For Stories, set `arabic: null` and use `translation` as the story headline.

---

## Developer Notes

- The project uses **no backend, no auth, no API calls** — fully client-side
- `useFocusEffect` in SavedScreen re-fetches from AsyncStorage on every tab focus
- SwipeCard is remounted (not just re-rendered) on each card change via `key={cardKey-cardId}`
- `useNativeDriver: false` is required on position animations because they drive layout (translateX/Y affect card position)
- Watchman is installed at `/opt/homebrew/bin/watchman` — Metro uses it automatically
