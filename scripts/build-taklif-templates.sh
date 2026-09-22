#!/bin/bash
# ============================================================
# Faqat taklif-link uslubidagi 17 shablonni statik build qilish
# -> public/t/<slug>/
#
# NEGA ALOHIDA: `build-templates.sh` hamma shablonni (77 ta) qaytadan yasaydi.
# Faqat yangi shablonlar ustida ishlaganda bu skript ancha tez.
# ============================================================
set -e
cd "$(dirname "$0")/.."

OUT="public/t"
mkdir -p "$OUT"

SLUGS=$(node -e "const p=require('./scripts/templates-plan-taklif.json'); console.log(p.templates.map(t=>t.slug).join(' '))")

count=0
for name in $SLUGS; do
  if [ ! -f "templates-src/$name/src/App.tsx" ]; then
    echo "⚠  $name — manba topilmadi (avval: npm run templates:taklif)"
    continue
  fi

  echo "Building $name ..."
  rm -rf "$OUT/$name"
  TPL_SLUG="$name" TPL_OUT="$(pwd)/$OUT/$name" \
    npx vite build --config scripts/vite.template.config.ts 2>&1 | tail -2
  # Musiqa fayli (mavjud bo'lsa)
  cp ../invitations/public/music.mp3 "$OUT/$name/music.mp3" 2>/dev/null || true
  count=$((count+1))
done

echo ""
echo "OK: $count shablon build qilindi -> $OUT/"
