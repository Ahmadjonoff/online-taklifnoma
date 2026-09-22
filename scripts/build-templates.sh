#!/bin/bash
# ============================================================
# Barcha shablonlarni statik build qilish -> public/t/<slug>/
# ============================================================
set -e
cd "$(dirname "$0")/.."

OUT="public/t"
mkdir -p "$OUT"

# Baza dizaynlar — mustaqil shablon emas, ulardan generatsiya qilinadi.
# Ularni build qilish shart emas (public/t ichida ishlatilmaydi).
BASES="luxe-vow watercolor-garden noir-gradient"

count=0
for dir in templates-src/*/; do
  name=$(basename "$dir")
  [ "$name" = "core" ] && continue
  case " $BASES " in *" $name "*) continue ;; esac
  [ -f "$dir/src/App.tsx" ] || continue

  # Har bir shablon uchun index.html — /t/<slug>/src/main.tsx ga ishora qiladi
  cat > "$dir/index.html" <<EOF
<!doctype html>
<html lang="uz">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./src/main.tsx"></script>
  </body>
</html>
EOF

  echo "Building $name ..."
  rm -rf "$OUT/$name"
  TPL_SLUG="$name" TPL_OUT="$(pwd)/$OUT/$name" \
    npx vite build --config scripts/vite.template.config.ts 2>&1 | tail -2
  # Musiqani shablon papkasiga nusxalash
  cp ../invitations/public/music.mp3 "$OUT/$name/music.mp3" 2>/dev/null || true
  count=$((count+1))
done

echo ""
echo "OK: $count shablon build qilindi -> $OUT/"
ls "$OUT"
