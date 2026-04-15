# نور Noor — Islamic Dawah App
### Inshorts-style swipeable Islamic content cards for iOS & Android

---

## What's included

| Feature | Details |
|---|---|
| **Swipeable cards** | Swipe right to save, left to skip — Inshorts-style |
| **4 content types** | Ayahs 📖, Hadiths 📜, Stories ✨, Duas 🤲 |
| **35+ cards** | Curated authentic Islamic content |
| **Category filter** | Filter by content type |
| **Save collection** | Bookmarked cards persist on device |
| **Share** | Share any card via WhatsApp, iMessage, etc. |
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

### iOS (requires Mac + Apple Developer account)
```bash
npx eas build --platform ios
```

### Android (APK)
```bash
npx eas build --platform android
```

Install EAS CLI first: `npm install -g eas-cli`

---

## Tech Stack

- **Expo SDK 51** — React Native framework
- **React Navigation** — Bottom tab navigation
- **AsyncStorage** — Local card saving (no backend needed)
- **React Native Animated** — Smooth swipe gestures (zero extra deps)

---

## Next Steps / Ideas

- 🔔 Daily notification with a random card (use `expo-notifications`)
- 🌙 Dark mode support
- 🌐 Arabic language toggle
- 🔊 Audio recitation for Ayahs and Duas
- 🗂️ Content from a live API / CMS
- 📊 Reading streak tracker
- 🕌 Prayer time reminder integration

---

*"Convey from me, even if it is one verse." — Prophet Muhammad ﷺ*

*May Allah accept this as sadaqah jariyah for all who contributed. 🤲*
