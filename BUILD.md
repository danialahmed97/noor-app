# Building Noor — AAB, APK & iOS Guide

> A step-by-step guide for producing installable builds of the app. Start here if you just want to build and ship — for general project context see [CONTEXT.md](CONTEXT.md), for local dev setup see [SETUP.md](SETUP.md).

---

## How builds work here

Noor uses **EAS Build** (Expo Application Services) — a cloud build service. You don't need Android Studio or Xcode installed to produce a release build; EAS compiles it remotely and hands you back a downloadable file. Signing credentials (keystores, certificates) are also managed by EAS in the cloud, not stored locally, so there's nothing to configure on a fresh clone.

| Profile (`eas.json`) | Platform | Produces | When to use |
|---|---|---|---|
| `development` | iOS + Android | Dev client | Local debugging with a custom dev client |
| `preview` | Android | **APK** | Quick internal testing — installs directly on a device |
| `production` | iOS + Android | **AAB** (Android) / IPA (iOS) | Store submission (Play Store / App Store) |

---

## One-time setup

```bash
npm install -g eas-cli   # install the EAS CLI globally
eas login                # log in with the Expo account that owns this project
```

You only need to do this once per machine. Ask the project owner for access if `eas login` doesn't show the Noor project.

---

## Building an Android APK (for testing)

Fastest way to get an installable file on a phone without going through the Play Store.

```bash
npm run build:apk
```

This runs `eas build --platform android --profile preview`, waits for the cloud build to finish, downloads it, and **automatically moves the file into `noor-extra/`** so your project root stays clean.

---

## Building an Android AAB (for the Play Store)

```bash
npm run build:aab
```

This runs `eas build --platform android --profile production` and, same as above, moves the resulting `.aab` into `noor-extra/` when it's done.

The `production` profile auto-increments the Android `versionCode` on every build, so you don't need to bump it manually in `app.json`.

---

## Building for iOS

iOS builds need to run interactively (a known quirk — non-interactive mode can fail to validate the distribution certificate), so there's no npm shortcut for this one:

```bash
npx eas build --platform ios --profile production
```

Requires an Apple Developer account with access to this app's bundle ID (`com.noor.islamic.dawah`). Follow the CLI prompts — it'll offer to manage certificates/provisioning profiles for you if this is your first iOS build.

---

## Where do build files go?

Every build lands in **`noor-extra/`** at the project root — a folder that's gitignored on purpose (see the note in `.gitignore`). It's where local-only artifacts (builds, signing keys, logs) live so they never get pushed to GitHub and never clutter the code you're working in. You can delete old files from there anytime; nothing in the app depends on them.

```
noor-app/
├── src/               ← the actual app code
├── ...
└── noor-extra/        ← gitignored — builds, keystores, crash logs live here
```

---

## Pushing a JS-only update (no rebuild needed)

If your change is pure JavaScript (no new native dependencies, no native config changes), you don't need a new build at all — ship it as an over-the-air update instead:

```bash
eas update --branch production --message "short description of the change"
```

Existing installs of the app pick this up automatically the next time they're opened, without going through the Play Store or App Store.

---

## Submitting to the stores

`eas.json` has a `submit` section for automating store submission, but it currently has placeholder values (Apple ID, App Store Connect app ID, Play service account) — it isn't wired up yet. For now, upload the downloaded AAB/IPA manually via the [Play Console](https://play.google.com/console) or [App Store Connect](https://appstoreconnect.apple.com).

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `eas` command not found | `npm install -g eas-cli` |
| Build fails immediately with an auth error | Run `eas login` again |
| iOS build fails on credentials in CI/non-interactive mode | Run it interactively at least once: `eas build --platform ios` |
| Can't find the build file after it finishes | Check `noor-extra/` — the build scripts move it there automatically |
| Need a completely fresh signing identity | Don't touch this alone — talk to the project owner first, since it can invalidate the app's Play Store listing |

---

*Questions about anything build-related that isn't covered here? Check [CONTEXT.md](CONTEXT.md) for the full project context, or ask.*
