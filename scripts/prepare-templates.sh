#!/bin/bash
# ============================================================
# Shablonlarni platforma uchun tayyorlash:
#  1. Har bir shablonning src/config.ts ni config-shim bilan almashtirish
#  2. core/lib/submit.ts ni platforma API'siga yo'naltirish
# ============================================================
set -e
cd "$(dirname "$0")/.."

# 1. core/lib/submit.ts -> platforma API (bizning bazamiz)
cp templates-src/submit-platform.ts templates-src/core/lib/submit.ts

# 2. Har bir shablon uchun config shim
# Avval mavjud config.ts ni config-default.ts ga saqlaymiz (agar hali saqlanmagan bo'lsa).
# Baza papkalar ham shu yerga kiradi — ularda ham config shim turishi kerak.
for dir in templates-src/*/; do
  name=$(basename "$dir")
  [ "$name" = "core" ] && continue
  [ -f "$dir/src/config.ts" ] || continue
  # config-default.ts yo'q bo'lsa (birinchi tayyorlash) — hozirgi config.ts dan nusxa
  if [ ! -f "$dir/src/config-default.ts" ]; then
    cp "$dir/src/config.ts" "$dir/src/config-default.ts"
  fi
  cp templates-src/config-shim.ts "$dir/src/config.ts"
done

echo "OK: submit.ts almashtirildi, $(ls -d templates-src/*/ | grep -v core | wc -l | tr -d ' ') shablon config'i shimlandi."
