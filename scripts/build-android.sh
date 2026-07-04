#!/usr/bin/env bash
# Build an Android AAB (production) or APK (preview) via EAS and move the
# downloaded artifact out of the project root into noor-extra/.
set -euo pipefail
shopt -s nullglob

PROFILE="${1:-production}"
cd "$(dirname "$0")/.."

npx eas build --platform android --profile "$PROFILE"

mkdir -p noor-extra
artifacts=(build-*.aab build-*.apk)
if [ ${#artifacts[@]} -eq 0 ]; then
  echo "No new build artifact found in project root — nothing to move."
else
  mv "${artifacts[@]}" noor-extra/
  echo "Moved to noor-extra/: ${artifacts[*]}"
fi
