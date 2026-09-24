# Taklifnoma.uz — Premium online taklifnomalar platformasi

To'y, nikoh, sunnat to'yi, qiz bazmi, beshik to'yi, tug'ilgan kun, biznes
tadbirlar va boshqalar uchun **jonli, konvert bilan ochiladigan** online
taklifnomalar.

## Imkoniyatlar

- 🎨 **21 ta shablon, 11 ta tadbir turi.** Har birining o'z palitrasi, bezagi va animatsiyasi bor (konvert, mum muhr, gulbarglar, musiqa). Mijoz 3 ta asosiy rangni o'zi tanlaydi.
- ✍️ **Jonli preview.** Buyurtma formasida yozilgan narsa darhol shablonda ko'rinadi.
- ⏳ Countdown, 📋 kun tartibi, 🗺 Google/Yandex xarita, 👗 dress-kod, 💳 sovg'a kartasi.
- ✅ **RSVP va 💌 tilaklar.** Mehmonlar javob beradi. Mijoz javoblarni o'z sahifasida ko'radi va CSV qilib yuklab oladi.
- 🎵 **Musiqa.** Fortepiano kutubxonasi yoki mijozning o'z faylini yuklash (+29 000).
- 📲 QR kod, Telegram/WhatsApp ulashish.
- 🔐 Admin panel: parol bilan himoyalangan, buyurtmalar sahifalab ko'rsatiladi, statistika bor.

### Tariflar (`src/lib/pricing.ts`)

| Tarif | Narx | Qo'shimcha |
|---|---|---|
| Standart | 149 000 | Barcha asosiy bo'limlar |
| Premium | 199 000 | + «Bizning hikoyamiz», 4 til (uz, kirill, ru, en) |
| Luxury | 279 000 | + galereya, kalendarga qo'shish, shaxsiy mehmon havolalari, ulashish rasmlari |

Tarif shablon narxidan aniqlanadi (`tierOf`). Tarifga kirmaydigan
imkoniyatlarni server jimgina o'chiradi (`tierFeatures`). Narx faqat serverda
hisoblanadi.

## Texnologiyalar

| Qism | Yechim |
|---|---|
| Sayt | Next.js 16.3 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| Baza | Prisma 7 + Neon Postgres (`@prisma/adapter-neon`), region `fra1` |
| Fayllar | Vercel Blob (suratlar va musiqa brauzerdan to'g'ridan-to'g'ri yuklanadi) |
| Shablonlar | React + Vite (har biri alohida statik bundle) |
| Bildirishnoma | Telegram Bot API (yangi buyurtma, tasdiqlash) |
| Sifat | `tsc`, ESLint (`eslint-config-next`), `node:test` (tsx orqali) |

## Arxitektura

```
src/app/                    # Next.js sahifalari va API
  e/[slug]/                 #   Mehmonlar ko'radigan taklifnoma (statik HTML + config)
  preview/[theme]/          #   Shablon demo va buyurtma formasidagi jonli preview
  api/orders | forms | upload/* | admin/* | cron/blob-cleanup
src/lib/                    # Biznes mantiq
  customization.ts          #   Mijoz sozlamalari: tur, standartlar, server tekshiruvi
  validation.ts             #   Buyurtma va RSVP/tilak maydonlarini tekshirish
  pricing.ts                #   Tariflar va narx hisobi
  rateLimit.ts              #   Postgres'dagi umumiy rate-limiter
templates-src/              # Shablonlar manbasi
  core/                     #   Umumiy komponentlar (RSVP, Wishes, Countdown ...)
  core/taklif/              #   Calendar, Events, Schedule, Story, DressCode ...
  luxe-vow/ watercolor-garden/ noir-gradient/   # Baza dizaynlar (generator uchun)
  <shablon-nomi>/src/       #   Har shablonning App/Hero/config'i
public/t/<nomi>/            # Build qilingan statik shablonlar (git'da yo'q)
scripts/
  templates-plan*.json      #   Katalog rejasi (seed shu yerdan o'qiydi)
  generate-*.mjs            #   Shablon manbalarini generatsiya qilish
  build-templates.sh        #   Hamma shablonni public/t/ ga build qilish
  vercel-build.sh           #   Vercel build (migratsiya faqat production'da)
tests/                      # Unit testlar (npm test)
```

**Qanday ishlaydi:** `/e/<slug>` bazadan taklifnomani o'qiydi va shablonning
statik `index.html` fayliga quyidagilarni qo'shadi:
- `window.__INV_CONFIG__` — taklifnoma ma'lumotlari;
- palitra CSS'i;
- tarjima skripti.

Shablon ichidagi `config-shim` bu ma'lumotni default config ustiga qo'shadi.
Shu tariqa bitta build qilingan shablon cheksiz ko'p taklifnomaga xizmat
qiladi, Next.js esa shablon kodini umuman yuklamaydi.

### Shablon oilalari

| Baza | Uslubi |
|---|---|
| **luxe-vow** | Ikki qatlamli tilla hoshiya, mum muhr, tilla naqsh chekka |
| **watercolor-garden** | Akvarel gullar, yumshoq to'lqinli chekka, konvertdan ko'tariladigan xat |
| **noir-gradient** | Qorong'i gradient, katta displey shrifti, minimal chiziq bezak |

> Muhim: har bir shablon CSS'ida `@source '../../core';` qatori turishi shart.
> Tailwind faqat shablon papkasini avtomatik skanerlaydi. Bu qatorsiz umumiy
> `templates-src/core/` komponentlaridagi sinflar generatsiya qilinmaydi va
> bo'limlar buzuq ko'rinadi.

## Ishga tushirish

```bash
npm install
cp .env.example .env.local    # yoki: vercel env pull .env.local
npm run templates:build       # shablonlarni public/t/ ga build qilish
npm run db:migrate            # migratsiyalar (DATABASE_URL_UNPOOLED)
npm run db:seed               # tadbir turlari va shablonlar
npm run dev                   # http://localhost:3000
```

**Shablon rasmlari.** Katalog kartalari va bosh sahifa jonli iframe o'rniga
`public/thumbs/` dagi rasmlarni ko'rsatadi. Shablon dizayni o'zgarganda yoki
yangi shablon qo'shilganda rasmlarni qayta yarating:

```bash
npm run templates:build && npm run build && npm start   # boshqa terminalda
npm run thumbs                                          # BASE_URL=http://localhost:3000
```

Rasmi yo'q shablon uchun sayt avvalgidek jonli iframe ko'rsatadi.

Tekshiruvlar:

```bash
npm run typecheck
npm run lint
npm test
```

## Muhit o'zgaruvchilari

| O'zgaruvchi | Tavsif |
|---|---|
| `DATABASE_URL` | Neon pooled ulanish (ilova) |
| `DATABASE_URL_UNPOOLED` | Neon to'g'ridan-to'g'ri ulanish (Prisma CLI, migratsiyalar) |
| `ADMIN_PASSWORD` | Admin paroli. Production'da majburiy |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (surat va musiqa yuklash) |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID` | Operatorga xabarlar. Bo'sh bo'lsa yuborilmaydi |
| `CRON_SECRET` | Yetim Blob fayllarini tozalovchi cron uchun. Bo'sh bo'lsa cron ishlamaydi |
| `NEXT_PUBLIC_SITE_URL` | Saytning asosiy manzili (metadata). Bo'sh bo'lsa, Vercel production domeni olinadi |
| `MIGRATE_ON_BUILD` | `1` bo'lsa, production'dan boshqa build'da ham migratsiya ishlaydi |

## Sahifalar

| Manzil | Tavsif |
|---|---|
| `/` | Bosh sahifa: hero, jonli namuna, tariflar, FAQ |
| `/shablonlar` | Katalog: qidiruv, tadbir turi, tarif, tartiblash |
| `/shablon/[slug]` | Shablon sahifasi: telefon ramkasida jonli demo |
| `/buyurtma?shablon=...` | Bosqichma-bosqich buyurtma formasi va jonli preview |
| `/buyurtma/[token]` | Mijoz sahifasi: holat, RSVP, tilaklar, CSV, mehmon havolalari (Luxury). Faqat tasodifiy token orqali ochiladi |
| `/e/[slug]` | **Mehmonlar ko'radigan taklifnoma** (faqat `PAID` bo'lsa ochiladi) |
| `/preview/[theme]` | Shablon demo (namuna ma'lumotlar bilan) |
| `/boshqaruv` | Admin: buyurtmalar (saytda havolasi yo'q) |
| `/boshqaruv/javoblar` | Admin: RSVP va tilaklar |

Admin himoyasi `src/proxy.ts` da joylashgan. Next.js 16 da `middleware` fayl
konvensiyasi `proxy` ga o'zgartirilgan. Sessiya cookie'si HMAC bilan
imzolangan token (`src/lib/adminAuth.ts`).

## Oqim

1. Mijoz shablon tanlaydi va formani to'ldiradi. Buyurtma `PENDING` holatida saqlanadi, operatorga Telegram'da xabar keladi (tarif va jami summa bilan).
2. Mijoz Telegram orqali to'laydi, operator admin panelda **«To'landi»** tugmasini bosadi.
3. Bot operatorga mijozga yuborish uchun tayyor xabar beradi: taklifnoma havolasi va mijoz sahifasi.
4. Mehmonlar taklifnomani ochadi, RSVP va tilak qoldiradi. Mijoz ularni `/buyurtma/[token]` da ko'radi.

Aloqa manzili bitta joyda: `src/lib/contact.ts`.

## Deploy (Vercel + Neon)

`vercel.json` build buyrug'i sifatida `npm run vercel-build` ni ishlatadi, u
`scripts/vercel-build.sh` ni chaqiradi. Skript quyidagilarni bajaradi:

1. Prisma client generatsiyasi.
2. Shablonlarni build qilish (`public/t` git'ga kirmaydi, build paytida yig'iladi).
3. **Faqat production'da** (`VERCEL_ENV=production`): `prisma migrate deploy` va bo'sh bazaga seed.
4. `next build`.

Preview deploy'lar prod bazaga migratsiya qo'llamaydi. Preview uchun alohida
Neon branch ulangan bo'lsa, Preview muhitiga `MIGRATE_ON_BUILD=1` qo'shing.

**Cron:** `/api/cron/blob-cleanup` kuniga bir marta ishlaydi. U 3 kundan eski
va hech bir taklifnomada ishlatilmagan suratlar va musiqalarni o'chiradi.
Ishlashi uchun Vercel'da `CRON_SECRET` o'rnatilgan bo'lishi kerak.

**Rate-limit:** login, buyurtma, RSVP/tilak, yuklash va mehmon havolalari
uchun limitlar Postgres'dagi `RateLimit` jadvalida hisoblanadi. Shuning uchun
ular barcha serverless instance'lar uchun umumiy.
