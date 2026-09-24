#!/bin/bash
# ============================================================
# Vercel build (vercel.json → buildCommand → npm run vercel-build)
# ============================================================
# Migratsiya va seed faqat PRODUCTION build'da ishlaydi. Preview deploy'lar
# (har bir branch/PR) odatda xuddi shu DATABASE_URL'ni oladi — aks holda
# ko'rib chiqilayotgan branch'dagi migratsiya prod bazaga qo'llanib ketardi.
#
# Preview uchun alohida Neon branch ulangan bo'lsa (Neon ↔ Vercel
# integratsiyasi), Preview muhitiga MIGRATE_ON_BUILD=1 qo'shing.
set -e
cd "$(dirname "$0")/.."

prisma generate --config prisma7.config.ts
npm run templates:build

if [ "$VERCEL_ENV" = "production" ] || [ "$MIGRATE_ON_BUILD" = "1" ]; then
  prisma migrate deploy --config prisma7.config.ts
  SEED_IF_EMPTY=1 tsx prisma/seed.ts
else
  echo "Migratsiya va seed o'tkazib yuborildi (VERCEL_ENV=${VERCEL_ENV:-none}; yoqish uchun MIGRATE_ON_BUILD=1)."
fi

next build
