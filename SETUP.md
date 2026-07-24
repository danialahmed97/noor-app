# نور Noor — Islamic Dawah App
### Inshorts-style swipeable Islamic content cards for iOS & Android

---

## What's included

| Feature | Details |
|---|---|
| **Swipeable cards** | Swipe UP for next, DOWN for previous — Inshorts-style |
| **4 content types** | Ayahs 📖, Hadiths 📜, Stories ✨, Duas 🤲 |
| **222 cards** | Curated authentic Islamic content |
| **Category filter** | Filter by content type |
| **Save collection** | Tap ❤️ on any card; bookmarks persist on device |
| **Share** | Share any card via WhatsApp, iMessage, etc. |
| **Dark mode** | Light/dark toggle with system preference fallback |
| **OTA updates** | JS-only updates via `expo-updates` (no store release needed) |
| **Design** | Deep green + gold Islamic aesthetic |

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org) (v18+)
- [Expo Go](https://expo.dev/client) app installed on your phone

### 1. Install dependencies
```bash
cd noor-app
npm install
```

### 2. Start the app
```bash
npx expo start
```

### 3. Open on your phone
- Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS)
- The app will load directly on your device

---

## Project Structure

```
noor-app/
├── App.js                          ← Root with bottom tab navigation
├── src/
│   ├── data/
│   │   └── content.js              ← All Islamic content (add more cards here!)
│   ├── components/
│   │   ├── SwipeCard.js            ← Card UI + swipe gesture logic
│   │   └── CategoryBar.js          ← Category filter strip
│   ├── screens/
│   │   ├── HomeScreen.js           ← Main swipe deck
│   │   ├── SavedScreen.js          ← Bookmarked cards
│   │   └── SettingsScreen.js       ← About & stats
│   ├── utils/
│   │   └── storage.js              ← AsyncStorage for saved cards
│   └── theme.js                    ← Colors, spacing, design tokens
```

---

## Adding More Content

Open `src/data/content.js` and add to the `content` array:

```js
{
  id: 'unique_id',           // Must be unique
  category: 'Hadith',        // 'Ayah' | 'Hadith' | 'Story' | 'Dua'
  arabic: 'عربي نص',         // Arabic text (or null for Stories)
  translation: '"English translation in quotes."',
  explanation: 'Your 40-60 word explanation here. Keep it short and impactful.',
  source: 'Sahih Bukhari • Narrated by ...',
  sourceType: 'Hadith',      // 'Quran' | 'Hadith' | 'Story' | 'Dua'
  tag: 'Topic Tag',          // Short tag like 'Patience', 'Forgiveness'
},
```

---

## Building for Production

See [BUILD.md](BUILD.md) for the full guide — quick version:
```bash
npm run build:apk   # Android APK, for testing
npm run build:aab   # Android AAB, for the Play Store
```

---

## Tech Stack

- **Expo SDK 54** — React Native framework
- **React Navigation** — Bottom tab navigation
- **AsyncStorage** — Local card saving (no backend needed)
- **React Native Animated** — Smooth swipe gestures (zero extra deps)
- **expo-updates** — OTA JS bundle delivery
- **expo-splash-screen** — Native + JS animated splash sequence

---

## Next Steps / Ideas

- 🔔 Daily notification with a random card (use `expo-notifications`)
- 🌐 Arabic language toggle
- 🔊 Audio recitation for Ayahs and Duas
- 🗂️ Content from a live API / CMS
- 📊 Reading streak tracker
- 🕌 Prayer time reminder integration

---

*"Convey from me, even if it is one verse." — Prophet Muhammad ﷺ*

*May Allah accept this as sadaqah jariyah for all who contributed. 🤲*
