# Taklifnoma.uz — Premium online taklifnomalar platformasi

To'y, nikoh, sunnat to'yi, qiz bazmi, tug'ilgan kun, biznes tadbirlar va boshqalar
uchun **jonli, konvert bilan ochiladigan** online taklifnomalar.

## Imkoniyatlar

- 🎨 **77 premium shablon** — 11 tadbir turi uchun. Har biri alohida palitra,
  bezak va animatsiya bilan (konvert, mum muhr, gul sochilishi, musiqa)
- ✍️ **Jonli preview** — buyurtma formada yozganingiz darhol shablonda aks etadi
- ⏳ **Countdown** — tadbirgacha qolgan vaqt
- 📋 **Tadbir dasturi** — timeline bo'limi (max 5 band)
- 🗓️ **Oylik kalendar** — tadbir kuni ajratib ko'rsatiladi
- 🎊 **Ko'p tadbirli dastur** — «Qizlar bazmi» + «Nikoh to'yi» kabi 2+ marosim
- 🎤 **Maxsus mehmonlar** — xonandalar ro'yxati (slider yoki ro'yxat)
- 💐 **Kiyim uslubi, hikoya, galereya** — mavzu bo'yicha qo'shimcha bo'limlar
- ✅ **RSVP** — mehmonlar kelish/kelmasligini bildiradi, izoh yozadi
- 💌 **Tilaklar galereyasi** — mehmonlar tilak qoldiradi, barchasi taklifnomada ko'rinadi
- 📲 **QR kod + ulashish** — Telegram/WhatsApp tugmalari, QR yuklab olish
- 🔐 **Admin panel** — parol bilan himoyalangan, buyurtmalar va javoblar statistikasi

## Texnologiyalar

| Qism | Yechim |
|---|---|
| Sayt | Next.js 16.3 (App Router, Turbopack), TypeScript, Tailwind CSS 4 |
| Baza | Prisma 7 + SQLite (driver adapter) |
| Shablonlar | React + Vite (har biri alohida statik bundle) |
| QR | `qrcode` |

## Arxitektura

```
templates-src/              # Shablonlar manbasi
  core/                     #   Umumiy komponentlar (RSVP, Wishes, Countdown...)
  core/taklif/              #   Yangi bo'limlar: Calendar, Events, Schedule,
                            #   Singers, Story, DearGuests, DressCode, Details
  luxe-vow/                 #   Baza A — konvert + mum muhr, tilla naqsh
  watercolor-garden/        #   Baza B — akvarel gullar, yumshoq to'lqin chekka
  noir-gradient/            #   Baza C — qorong'i gradient, kinematografik
  <shablon-nomi>/src/       #   Har shablonning App/Hero/config'i
public/t/<nomi>/            # Build qilingan statik shablonlar
scripts/
  templates-plan.json       #   60 ta asosiy shablon rejasi
  templates-plan-taklif.json#   17 ta taklif-link uslubidagi shablon rejasi
  generate-templates.mjs    #   Asosiy shablonlarni generatsiya qiladi
  generate-taklif-templates.mjs # Yangi 17 shablonni generatsiya qiladi
  prepare-templates.sh      #   config-shim + submit.ts ni o'rnatadi
  build-templates.sh        #   Hamma shablonni public/t/ ga build qiladi
  build-taklif-templates.sh #   Faqat yangi 17 shablonni build qiladi
  vite.template.config.ts   #   Vite konfiguratsiyasi
docs/
  taklif-link-tahlil.md     # taklif-link.uz skreypingi va tahlili
```

**Qanday ishlaydi:** `/e/<slug>` sahifasi bazadan taklifnoma ma'lumotlarini
o'qib, shablonning statik HTML'iga `window.__INV_CONFIG__` sifatida inject
qiladi. Shablon ichidagi `config-shim` buni default config ustiga merge qiladi
— shu tariqa bitta shablon cheksiz xilma-xil taklifnomalarga aylanadi.

Bo'limlar `config-default.ts` dagi `enabled` bayroqlari bilan boshqariladi
(`calendar`, `events`, `story`, `singers`, `dressCode`, `gallery`, `rsvp`,
`wishes`, `gift`) — shu sababli 17 shablon bir xil kod ustida har xil ko'rinadi.

## Shablonlar oilalari

| Baza | Shablonlar | Uslubi |
|---|---|---|
| **luxe-vow** | Yoqut, Imperial, Royal, Ivory, Garden, Qiz bazmi — Nafis, Qiz bazmi — Sharqona, Milliy, Sunnat to'y, Pearl, Velvet | Ikki qatlamli tilla hoshiya, mum muhr, tilla naqsh chekka |
| **watercolor-garden** | Floral, Floral Fotiha, Gul | Akvarel gullar, yumshoq to'lqinli chekka, konvertdan ko'tariladigan xat |
| **noir-gradient** | Aurora, Epic, Zamonaviy | Qorong'i gradient, katta displey shrifti, minimal chiziq bezak |

## Ishga tushirish

```bash
npm install
npm run templates:prepare     # shablonlarni platformaga moslashtirish
npm run templates:taklif      # 17 ta yangi shablon manbasini yozish
npm run templates:build       # hamma shablonni build qilish (77 ta)
npm run templates:build:taklif# yoki faqat yangi 17 tasini
npm run db:migrate            # baza yaratish
npm run db:seed               # 11 tadbir turi + 77 shablon
npm run dev                   # http://localhost:3000
```

## Muhit o'zgaruvchilari (.env)

```
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="o'z-parolingiz"
```

## Sahifalar

| Manzil | Tavsif |
|---|---|
| `/` | Bosh sahifa — hero, jonli namuna, taqqoslash, imkoniyatlar, to'plamlar, FAQ |
| `/shablonlar` | Katalog — qidiruv, tadbir turi, daraja (Premium/Standart), tartiblash |
| `/shablon/[slug]` | Shablon sahifasi — telefon ramkasida jonli demo, dastur, o'xshashlar |
| `/buyurtma?shablon=...` | Buyurtma formasi + jonli preview (to'lov yo'q) |
| `/buyurtma/[id]` | Buyurtma qabul qilindi — Telegram aloqa + havola holati |
| `/e/[slug]` | **Mehmonlar ko'radigan taklifnoma** |
| `/preview/[theme]` | Shablon demo (namuna ma'lumotlar bilan) |
| `/admin` | Buyurtmalar (parol: `ADMIN_PASSWORD`) |
| `/admin/javoblar` | RSVP va tilaklar statistikasi |

> Muhim: har bir shablon CSS'ida `@source '../../core';` qatori turishi shart.
> Tailwind faqat shablon papkasini avtomatik skanerlaydi; usiz umumiy
> `templates-src/core/` komponentlaridagi sinflar (grid, flex, `bg-paper-2`)
> generatsiya qilinmay, bo'limlar buzuq ko'rinadi.

> Eslatma: admin himoyasi `src/proxy.ts` da (Next.js 16 da `middleware` fayl
> konvensiyasi `proxy` ga o'zgartirilgan).

## Oqim

1. Mijoz shablon tanlaydi → buyurtma beradi (`PENDING`) yoki Telegram orqali yozadi
2. Operator Telegram'da bog'lanadi, **narxni kelishadi** (saytda qat'iy narx yo'q)
3. Kelishuvdan so'ng admin panelda **"Tasdiqlangan"** bosiladi va havola faollashadi
4. Mijoz `/buyurtma/[id]` sahifasida Telegram havolasi va holatni ko'radi
5. Mehmonlar taklifnomani ochadi → RSVP va tilak qoldiradi
6. Admin `/admin/javoblar` da kuzatib turadi

Aloqa manzili bitta joyda: `src/lib/contact.ts` (`TELEGRAM_USERNAME`).
Narx matnlari: `src/lib/catalog.ts` (`PRICE_SHORT`, `PRICE_NOTE`).
Bazadagi `Template.price` faqat daraja (Premium/Standart) va admin
statistikasi uchun qoladi — mijozga ko'rsatilmaydi.

## Deploy

Production uchun tavsiya: **Vercel** (sayt) + **Neon/Supabase** (PostgreSQL'ga
o'tish uchun `prisma/schema.prisma` providerini `postgresql` ga o'zgartiring).
Shablonlar statik fayllar — `public/t/` bilan birga deploy bo'ladi
(eslatma: `public/t` git'ga kirmaydi, deploydan oldin
`npm run templates:build` ni ishga tushiring).
