# Noor App — Full Project Context

> Feed this file to Claude when you want full context on the Noor codebase.

---

## What Is This

**Noor** is a React Native / Expo mobile app for iOS and Android. It delivers curated Islamic content (Quranic verses, hadiths, stories, duas) in a swipeable card interface — inspired by Inshorts. No backend. Fully offline. Content is bundled in the app.

**Project path:** `/Users/danialahmedbarbhuiya/My Companies/noor-app/`
**Bundle ID:** `com.noor.islamic.dawah` (iOS + Android)
**EAS Project ID:** `0a625db5-899f-4e73-94bc-f9ab626cd232`
**GitHub:** `https://github.com/danialahmed97/noor-app`

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
| Splash | expo-splash-screen ~31.0.13 |
| OTA Updates | expo-updates ~29.0.16 |
| System UI | expo-system-ui ~6.0.9 |
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
├── App.js                              ← Root. ThemeProvider + SafeAreaProvider + Root/AppContent
├── app.json                            ← Expo config (icon, splash, EAS project ID, runtime version)
├── eas.json                            ← EAS build profiles (development / preview / production)
├── package.json                        ← SDK 54 locked dependencies
├── babel.config.js                     ← babel-preset-expo
├── CONTEXT.md                          ← This file
├── assets/                             ← icon.png, splash.png, adaptive-icon.png
├── android/                            ← Ejected native Android project
│   └── app/src/main/
│       ├── java/com/noor/dawah/
│       │   └── MainActivity.kt         ← Sets AppTheme before super.onCreate for splash fix
│       └── res/values/
│           ├── colors.xml              ← Brand colors incl. splashBackground
│           └── styles.xml              ← AppTheme / BootTheme / Theme.App.SplashScreen
├── ios/                                ← Ejected native iOS project
│   └── NoorIslamicDawah/
└── src/
    ├── context/
    │   └── ThemeContext.js             ← Dark/light mode context, AsyncStorage persistence
    ├── screens/
    │   ├── HomeScreen.js               ← Main card deck with category filter + theme toggle
    │   ├── SavedScreen.js              ← Bookmarked cards (My Collection)
    │   └── SettingsScreen.js           ← About tab: stats, how-to, disclaimer
    ├── components/
    │   ├── SwipeCard.js                ← Card with vertical PanResponder, save, share, modal
    │   ├── CategoryBar.js              ← Horizontal scrollable category filter chips
    │   └── SplashAnimation.js          ← JS-driven animated splash overlay (new)
    ├── data/
    │   └── content.js                  ← All 222 Islamic card objects + CATEGORIES array
    └── utils/
        └── storage.js                  ← AsyncStorage helpers (save / unsave / getSaved)
```

---

## App.js — Root

```
App (SafeAreaProvider + ThemeProvider)
└── Root (waits for theme mode, then hides native splash, shows JS splash)
    └── AppContent (NavigationContainer + Tab.Navigator)
        ├── Home  🏠 "Discover"
        ├── Saved 🤍 "Saved"
        └── About ☪️ "About"
```

**Root component flow:**
1. Waits for `mode` from `ThemeContext` to resolve (reads AsyncStorage)
2. Sets `appReady = true` and immediately calls `SplashScreen.hideAsync()`
3. While not ready: renders a plain `#0D5016` green View (matches native splash)
4. Once ready: renders `AppContent` with `SplashAnimation` overlaid on top
5. `SplashAnimation` calls `onFinish()` when its fade-out completes → overlay removed

Tab bar is theme-aware: background, border color, active/inactive tint all read from `colors`.

---

## ThemeContext.js — Dark Mode + Transliteration

**File:** `src/context/ThemeContext.js`

- Uses `useColorScheme()` for system preference, persists user choice to AsyncStorage key `'noor_theme'`
- Returns `null` for `mode` until resolved (prevents flash); both `noor_theme` and `noor_show_transliteration` are loaded together via `Promise.all` before the first render
- Context value: `{ colors, isDark, toggleTheme, mode, showTransliteration, toggleTransliteration }`
- `showTransliteration` (boolean, default `false`): global preference for showing Arabic script vs Latin transliteration
- `toggleTransliteration()`: flips `showTransliteration`, persists to AsyncStorage key `'noor_show_transliteration'`

**Light mode color tokens:**

| Token | Value |
|---|---|
| primary | `#0D5016` (deep Islamic green) |
| gold | `#C9A84C` |
| bg | `#F6F4EE` (warm parchment) |
| bgCard | `#FFFFFF` |
| textDark | `#1A1A1A` |
| textMid | `#555555` |
| textLight | `#888888` |
| border | `#E8E4DA` |
| tabBar | `#FFFFFF` |
| tabActive | `#0D5016` |
| tabInactive | `#999999` |

**Dark mode color tokens:**

| Token | Value |
|---|---|
| primary | `#4CAF7D` |
| gold | `#D4A853` |
| bg | `#121612` |
| bgCard | `#1E241E` |
| textDark | `#EDE8DC` |
| textMid | `#A89F8C` |
| textLight | `#6B6560` |
| border | `#2A302A` |
| tabBar | `#1E241E` |
| tabActive | `#4CAF7D` |
| tabInactive | `#6B6560` |

**Category colors (both modes):**

| Category | Light primary | Light bg | Dark primary | Dark bg |
|---|---|---|---|---|
| Ayah | `#1B5E20` | `#E8F5E9` | `#4CAF7D` | `#1A2E1E` |
| Hadith | `#1A237E` | `#E8EAF6` | `#7986CB` | `#1A1D2E` |
| Story | `#4A148C` | `#F3E5F5` | `#CE93D8` | `#1E1A2E` |
| Dua | `#B71C1C` | `#FFEBEE` | `#EF9A9A` | `#2E1A1A` |

---

## SplashAnimation.js — JS Splash

**File:** `src/components/SplashAnimation.js`

Animated overlay rendered on top of `AppContent` after the native splash hides.

**Sequence:**
1. 200ms pause
2. Arabic "نور" fades + springs in (700ms + spring)
3. "Islamic Dawah" subtitle fades in (500ms)
4. 800ms hold
5. Full screen fades out (400ms) → `onFinish()` called

**Styling:** `position: absolute`, full screen, `zIndex: 9999`, green `#0D5016` background, gold Arabic text (80px), uppercase gold subtitle (18px, 4px letter-spacing).

---

## HomeScreen.js

**State:**
- `selectedCategory` — `'All'` | `'Story'` | `'Ayah'` | `'Dua'` | `'Hadith'`
- `deck` — shuffled array of card objects for current category
- `index` — current card index
- `cardKey` — incremented to force SwipeCard remount
- `toastMsg` + `toastAnim` — fade toast

**Header:** Arabic "نور" + "Noor · Islamic Dawah" on left | theme toggle (☀️/🌙) + refresh (↺) on right

**Logic:**
- Category change → filter content → shuffle → reset index to 0
- `goNext()` / `goPrev()` → increment / decrement index with boundary toasts
- `handleRestart()` → reshuffle, reset to 0, show toast
- `openingFromSaved`: When navigating from SavedScreen via `route.params.openCard`, places the target card at index 0, shuffles the rest behind it, sets `instant=true` on SwipeCard to skip the entry animation

---

## SwipeCard.js

**Props:** `card`, `onNext`, `onPrev`, `showHints`, `instant`, `onMounted`
- `instant={true}` skips the 150ms fade-in (sets `fadeAnim` to 1 directly) — used when opening a card from SavedScreen so there's no redundant fade
- `onMounted()` is called after the card is ready (after fade completes, or immediately when `instant=true`) — used by HomeScreen to reset the `openingFromSaved` flag

**Gesture:** Vertical `PanResponder` (ignores horizontal). 60px threshold. Up → `onNext()`, Down → `onPrev()`. Snap-back under threshold. Blocked when "Read More" modal is open.

**Card layout (top to bottom):**
1. Colored header band: category chip (emoji + name + watermark symbol) | [ع/A toggle button — only when `card.arabic` and `card.transliteration` are both non-empty] | share button
2. Arabic text or transliteration — shown inside the colored header band for Ayah / Hadith / Dua. When `showTransliteration=true` and `card.transliteration` is non-empty, renders Latin transliteration (centered, ~18px, system font); otherwise renders Arabic (right-aligned RTL, 22px). Hadiths always show Arabic (their `transliteration` is null).
3. Translation text (bold, 17px)
4. Thin colored divider
5. Explanation (8-line truncate; "Read more" link if >450 chars opens fullscreen modal)
6. Footer: source icon + source text + heart (save) button

**Transliteration toggle button:**
- Label: `ع` when Arabic is showing (tap to switch to transliteration), `A` when transliteration is showing (tap to switch back)
- Visible only when `card.arabic && card.transliteration` are both non-empty (Ayahs + Duas only in v1)
- Tapping triggers `toggleTransliteration()` from ThemeContext + light haptic
- Global state — toggling on one card applies to all cards immediately

**Transliteration coverage (v1):**
- Ayahs (95): ✅ have transliteration
- Duas (34): ✅ have transliteration
- Hadiths (73): ❌ null — deferred to v1.x pending scholarly review
- Stories (20): ❌ null — no Arabic text, toggle never appears

**Watermark symbols by category:** Ayah=✦, Hadith=☽, Story=✺, Dua=❋

**Save/Heart:** Spring animation on press (1.4× scale), haptic feedback, persisted via `saveCard()` / `unsaveCard()`.

**Modal:** Full-screen ScrollView for long explanations. Backdrop press closes it.

---

## SavedScreen.js

**Header:** "My Collection" + dynamic subtitle ("X cards saved")

**Empty state:** 🤲 emoji + "No saved cards yet" + "Tap the heart ❤️ on any card to save it to your collection."

**Card list:** FlatList, 30px separator, each card shows:
- Category chip + tag | Share (↗) + Remove (✕) buttons
- Arabic text, translation, explanation (3-line truncate)
- Source footer

**Actions:**
- Remove: Confirmation alert → `unsaveCard()` → local state update
- Share: Native Share sheet with formatted card text
- Card press: Navigates to Home tab with `openCard` param → HomeScreen re-arranges deck

**Data:** `useFocusEffect` reloads from AsyncStorage on every tab focus.

---

## SettingsScreen.js

Hero section (Arabic "نور" + tagline), then four sections: CONTENT LIBRARY, DISPLAY, HOW TO USE, DISCLAIMER, and a version footer.

**DISPLAY section:**
- "Show transliteration" toggle row — Switch bound to `showTransliteration` / `toggleTransliteration` from ThemeContext
- Subtitle: "Display Arabic in Latin letters"

**HOW TO USE steps (8 items):**
1. 👆 Swipe UP to move to the next card
2. 👇 Swipe DOWN to go back to the previous card
3. 🤍 Tap the heart in the card footer to save a card
4. ↗ Tap the share icon to send via WhatsApp, iMessage, etc.
5. ☪️ Use the category filter to focus on Ayahs, Hadiths, Stories, or Duas
6. ↺ Tap the refresh icon to reshuffle the deck anytime
7. ☀️ Tap the sun / moon icon to switch between light and dark mode
8. ع Tap the ع button on any card to switch between Arabic and transliteration

---

## CategoryBar.js

Horizontal `ScrollView` of filter chips. Reads `CATEGORIES` from `content.js`.

- **Active chip:** Category color background + white text + shadow
- **Inactive chip:** Gray border + mid-tone text
- "All" chip uses `colors.primary` green + ☪️

---

## content.js — Data

```js
export const CATEGORIES = ['All', 'Story', 'Ayah', 'Dua', 'Hadith'];
```

**Total: 222 cards**

| Category | Count |
|---|---|
| Ayah | 95 |
| Hadith | 73 |
| Dua | 34 |
| Story | 20 |

**Card schema:**
```js
{
  id:             'ayah_1',
  category:       'Ayah',           // 'Ayah' | 'Hadith' | 'Story' | 'Dua'
  arabic:         '…',              // Arabic string, or null for Stories
  transliteration: '…',             // Latin transliteration string for Ayahs + Duas; null for Hadiths + Stories
  translation:    '"English text"',
  explanation:    '~40–60 words.',
  source:         'Surah Al-Fatihah • 1:1',
  sourceType:     'Quran',          // 'Quran' | 'Hadith' | 'Story' | 'Dua'
  tag:            'Bismillah',      // short label (optional)
}
```

Source icons in SwipeCard: Quran=📖, Hadith=📜, Dua=🤲, Story=✨

---

## storage.js

```js
getSavedCards()       // returns array of saved card objects
saveCard(card)        // appends card to saved list
unsaveCard(cardId)    // removes card by id
isCardSaved(cardId)   // returns boolean
```

AsyncStorage key: `'noor_saved_cards'`

---

## app.json (current)

```json
{
  "expo": {
    "name": "Noor",
    "slug": "noor-dawah",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#121612"
    },
    "ios": { "supportsTablet": false, "bundleIdentifier": "com.noor.islamic.dawah" },
    "android": {
      "package": "com.noor.islamic.dawah",
      "versionCode": 2,
      "userInterfaceStyle": "automatic",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0D5016"
      }
    },
    "androidStatusBar": {
      "backgroundColor": "#121612",
      "barStyle": "light-content",
      "translucent": false
    },
    "runtimeVersion": "1.0.0",
    "updates": { "url": "https://u.expo.dev/0a625db5-899f-4e73-94bc-f9ab626cd232" },
    "extra": { "eas": { "projectId": "0a625db5-899f-4e73-94bc-f9ab626cd232" } }
  }
}
```

---

## EAS Build Setup (eas.json)

| Profile | Platform | Distribution | Output |
|---|---|---|---|
| development | iOS + Android | internal | dev client |
| preview | Android | internal | APK |
| production | iOS + Android | store | IPA + AAB |

Production auto-increments build numbers on both platforms. Submit config has placeholder values (Apple ID, service account) — not yet wired up for automated store submission.

**OTA updates** are configured via `expo-updates` + `runtimeVersion: "1.0.0"`. Run `eas update` to push JS-only updates without a full rebuild.

---

## Android Native Files

**`android/app/src/main/res/values/colors.xml`**
```xml
<color name="colorPrimary">#0D5016</color>
<color name="colorPrimaryDark">#121612</color>
<color name="colorAccent">#C9A84C</color>
<color name="splashBackground">#121612</color>
<color name="iconBackground">#0D5016</color>
```

**`android/app/src/main/res/values/styles.xml`**
- `AppTheme`: Sets `windowBackground`, `statusBarColor`, `navigationBarColor`, and `windowSplashScreenBackground` all to `@color/splashBackground` — prevents white flash when theme switches in `onCreate`
- `BootTheme` (extends `AppTheme`): Overrides `windowBackground` with `@drawable/ic_launcher_background`
- `Theme.App.SplashScreen` (extends `BootTheme`): Applied to `MainActivity` in AndroidManifest

**`MainActivity.kt`:** Calls `setTheme(R.style.AppTheme)` before `super.onCreate(null)` — required by `expo-splash-screen` to colour the background, status bar, and navigation bar correctly.

---

## Known Issues / History

| Issue | Fix Applied |
|---|---|
| `EMFILE: too many open files` on `expo start` | Installed Watchman via `brew install watchman` |
| SDK 51 vs Expo Go SDK 54 mismatch | Updated all packages to SDK 54 via `npx expo install --fix` |
| Missing `icon.png` / `splash.png` | Generated placeholder PNGs; assets now present |
| Android splash screen white flicker | Fixed via `AppTheme.windowBackground = splashBackground` in styles.xml |
| iOS build non-interactive credential failure | Must run `eas build --platform ios` interactively to validate distribution cert |

---

## How to Add a New Card

Open `src/data/content.js` and add an object to the `content` array:

```js
{
  id: 'ayah_96',           // must be unique across all cards
  category: 'Ayah',
  arabic: 'Arabic text here',
  translation: '"English translation in quotes."',
  explanation: 'Explanation in ~40–60 words.',
  source: 'Surah X • Y:Z',
  sourceType: 'Quran',
  tag: 'ShortTag',
}
```

For Stories: set `arabic: null`; `translation` is used as the story headline.

---

## Developer Notes

- **No backend, no auth, no API calls** — fully client-side
- `useFocusEffect` in SavedScreen re-fetches from AsyncStorage on every tab focus
- SwipeCard is **remounted** (not re-rendered) on each card change via `key={cardKey-cardId}` — this resets all internal animation state cleanly
- `useNativeDriver: true` is used on all Animated values in SwipeCard and SplashAnimation (opacity, scale, translate) — layout-affecting properties would require `false`
- After any native file change (styles.xml, colors.xml, AndroidManifest, MainActivity), a full EAS rebuild is required — `npx expo start` will not pick up native changes
- Watchman is installed at `/opt/homebrew/bin/watchman` — Metro uses it automatically
- `expo-updates` is configured but OTA pushes haven't been used yet; `eas update` will push to devices on `runtimeVersion: "1.0.0"`

---

## Weekly Content Pipeline

Autonomous pipeline that proposes a new batch of content cards every week, gated by human review before anything reaches users.

**Schedule:** Every Saturday at 04:00 IST (Friday 22:30 UTC).

**Flow:**

```
Saturday 04:00 IST
  │
  ▼
weekly-cards.yml (GitHub Action)
  │  1. Calls Anthropic API to pick a theme (or uses state/topics.json → overrideTheme)
  │  2. Calls Anthropic API to generate 15 candidate cards for that theme
  │  3. Validates cards against the schema (scripts/validate-schema.js)
  │  4. Appends valid cards to src/data/content.js, updates state/topics.json
  ▼
Opens a PR to main (label: auto-generated, content-review)
  │
  ▼
Human review
  │  - Spot-check Arabic, transliteration, translations, sources
  │  - Verify no fabricated Hadith citations
  ▼
Merge to main
  │
  ▼
deploy-update.yml (GitHub Action, triggered by push to main touching src/data/content.js)
  │  Runs `eas update --branch main`
  ▼
Users receive the new cards via OTA update
```

**Where the pieces live:**

- `scripts/generate-cards.js` — main generation script (theme selection, API call, validation, file writes, PR description)
- `scripts/validate-schema.js` — standalone schema validator (`validateCard`, `validateBatch`)
- `state/topics.json` — tracks `lastTheme`, `lastGeneratedAt`, `themeHistory`, `batchCount`, and `overrideTheme`
- `.github/workflows/weekly-cards.yml` — scheduled generation + PR creation
- `.github/workflows/deploy-update.yml` — OTA publish on merge to main

**Required GitHub Secrets:**

- `ANTHROPIC_API_KEY` — used by `weekly-cards.yml` to call the Anthropic API
- `EAS_TOKEN` — used by `deploy-update.yml` to authenticate `eas update`

**Overriding the theme:** Edit `state/topics.json`, set `"overrideTheme": "your theme"`, commit to `main`. The next Saturday run will use that theme verbatim (with reasoning `"Manual override..."`) instead of asking Claude to pick one, and will clear `overrideTheme` back to `null` afterwards.

**Disabling temporarily:** Comment out the `schedule:` block in `.github/workflows/weekly-cards.yml`. `workflow_dispatch` still allows manual runs.

**Running manually:** GitHub → Actions tab → "Weekly Card Generation" → Run workflow.
