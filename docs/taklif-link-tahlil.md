# taklif-link.uz — to'liq skreyping va tahlil

> Skreyping sanasi: 2026-09-22
> Manbalar: `https://taklif-link.uz/` (SPA), `/demo?template=<id>` (17 ta demo),
> `/assets/index-BRMXNLcv.js` (2.4 MB minified bundle), `/assets/index-cvf-x4Tn.css`.
> SPA bo'lgani uchun kontent JS bilan render qilinadi — matn `r.jina.ai` orqali
> render qilib, rang/sozlamalar bundle ichidan ajratib olindi.

## 1. Sayt nima qiladi

Raqamli to'y taklifnomalari (wedding website) platformasi:
mijoz ro'yxatdan o'tadi → shablon tanlaydi → ma'lumot kiritadi → havola oladi →
mehmonlarga yuboradi → mehmonlar RSVP qoldiradi va mehmonlar kitobiga yozadi.

Texnologiya: Vite + React SPA, Replit'da joylashtirilgan (`replit-dev-banner.js`),
Supabase'ga o'xshash backend (`wedding`, `guest`, `guestBook`, `photo` jadvallari),
i18n: `uz / ru / en / tr` (ayrim shablonlarda 4 til).

## 2. Bosh sahifa tuzilishi

| # | Blok | Mazmuni |
|---|---|---|
| 1 | Header | logo, `Shablonlar`, `Xususiyatlar`, `Narxlar`, telefon `+998 94 877 77 58`, til almashtirgich, `Kirish` |
| 2 | Hero | «Tez, chiroyli va qulay» + «To'yingiz uchun zamonaviy raqamli taklifnomalar» + 2 CTA |
| 3 | Shablonlar galereyasi | 17 karta, `Premium`/`Oddiy` belgisi, «Tez orada» kartasi |
| 4 | Taqqoslash | «An'anaviy taklifnoma» (5 minus) vs «Taklif Link bilan» (5 plus) |
| 5 | Xususiyatlar | 6 ta: moslashtirish, RSVP, foto galereya, ko'p til, joylashuv, fon musiqasi |
| 6 | Yakuniy CTA | «To'yingiz uchun mukammal saytni yarating» + `Boshlash` / `Demo Ko'rish` |
| 7 | Footer | Telegram `@taklif_link_admin`, Instagram `@taklif_link` |

## 3. Shablonlar — 17 ta (11 Premium + 6 Oddiy)

Har bir shablonda **umumiy skelet** bir xil, farq — palitra, bezak SVG/rasmlar va
bo'limlar to'plami. `Bundle` dan olingan aniq rang kodlari:

| # | Nomi | id | Daraja | Palitra (hex) | O'ziga xosligi |
|---|---|---|---|---|---|
| 1 | Yoqut 🌹 | `crimson` | Premium | `#0F0204` `#1A0506` `#E8CE7A` | bordo-qora + tilla; **ikki tadbirli** (Qizlar bazmi + Nikoh to'yi); gulbarg yog'iladi |
| 2 | Sunnat to'y 🤍 | `sunnat` | Premium | `#FFFAF2` + rose-gold `#B76E79` | fil suyagi + rose-gold; **doiraviy naqshinkor rasm ramkasi**; bolaning yoshi ko'rsatiladi |
| 3 | Milliy | `anor` | Premium | `#F4EEE4` `#FFF4EA` `#5F211F` | anor naqshi (`pomegranate.webp`), krem qog'oz, tilla hoshiya (`border-ornament`) |
| 4 | Ivory ✉️ | `ivory` | Premium | `#F9F0E0` `#6C513F` + bordo muhr | konvert ochilish videosi (`envelope-open.mp4`), basmala, gul dastalari, **Kun tartibi (5 band)**, **Maxsus mehmonlar (xonandalar)**, kiyim uslubi |
| 5 | Garden 🤍 | `sacred` | Premium | `#F9F0E0` `#6C513F` + `#89916B` | nikoh uchun; akvarel gul burchaklari (4 burchak), muhrli RSVP |
| 6 | Royal 💌 | `royal` | Premium | `#FFFDF6` `#112250` + tilla | to'q ko'k + tilla; **oylik kalendar**, sana/vaqt kartasi, galereya, to'yona |
| 7 | Floral Fotiha 💐 | `gardenFotiha` | Premium | `#F4F6EF` `#EEF2E6` `#7D9160` | akvarel gullar, fotiha to'yi variantи (matnlar `fotiha` ga almashtirilgan) |
| 8 | Floral 💐 | `garden` | Premium | `#F4F6EF` `#EEF2E6` `#7D9160` | akvarel gullar, nozik yashil bog' |
| 9 | Qiz bazmi — Nafis | `qizbazmi` | Premium | `#8A6A34` `#CFA95E` `#ECD9A4` `#C69D52` `#77894E` `#54603A` `#2E3A1E` | yumshoq yashil akvarel, **muhrli konvert** («Ochish uchun muhrga bosing»), bitta qahramon (kelin), oylik kalendar |
| 10 | Qiz bazmi — Sharqona | `turkish` | Premium | `#8A6A34` `#E0C07F` `#FFF3D4` `#D8B978` `#3A241A` `#5A3B28` `#7A1F2B` `#4A3222` | bordo gilam, chiroqlar, tilla naqsh; **turkcha interfeys** (Ahıska turklari uchun: «Kına Gecesi») |
| 11 | Imperial | `imperial` | Premium | `#0B0B0B` `#1A1A1A` + `#C9A96E` `#A9842F` `#E7CD86` `#FFF3CF` `#E0C172` `#B8923F` | fil suyagi fon + oltin naqsh; **muqaddas duo (oyat)** + **tantanali kun tartibi** + ikki to'yxona rasmi |
| 12 | Aurora | `aurora` | Oddiy | `#1A1530` `#2A1F4A` `#1D1640` `#0F0A25` `#0A0820` + pastel `#FF9EC0` `#B8A3FF` `#88E5D3` `#D4ECFF` `#FFD6E1` `#E8D4F5` `#C9B6E3` `#A8D0E6` `#BDE4C8` `#FFB6D2` `#7A5CB0` | gradient «shimoliy shafaq», romantik sirli muhit |
| 13 | Pearl | `pearl` | Oddiy | `#F8F5F0` `#1A1A1A` `#4A4A4A` `#8A8A8A` `#E8E0D0` `#F0E8DF` `#E0D8C8` `#F5EDD8` `#EDE2D0` `#C8B89E` + tilla `#C9A96E` | **jurnal/nashr uslubi**: «1-son · To'y nashri», `01-bob … 04-bob` bo'limlari, `Photographed for the occasion` |
| 14 | Velvet | `velvet` | Oddiy | `#0A0307` `#150509` `#1A060F` `#2A0810` `#4A0F24` `#5A1432` `#3D0A1F` + `#D4A87C` `#B88858` `#F3D9A8` `#F8E3B6` `#F5E6D3` `#8A5A3A` | to'q binafsha-qora + shampan; **fon video** (`hero-video.mp4`), boy bezaklar |
| 15 | Gul | `flower` | Oddiy | `#F9F1E7` `#DCBFA0` `#8B7355` `#3B3B3B` `#F472B6` `#FB7185` | romantik gulli, **mehmonlar rasm yuklaydi**, «Bir sevgi…», oylik kalendar |
| 16 | Epic | `epic` | Oddiy | `#1A0E00` + `#1976D2` `#1565C0` + `#FBBF24` `#F59E0B` | dadil kinematografik, ko'k-amber kontrast |
| 17 | Zamonaviy | `modern` | Oddiy | `#070707` `#21231F` `#30322D` `#45463F` + tilla `#C9A96E` `#F5E0A0` `#E8C97E` `#A07840` + krem `#E8D8BF` `#F4EAD8` `#EAD7BB` `#D6BB8F` `#CFB080` + `#1A0E00` `#0F0D0A` | mobilga optimallashgan, **fon video** (`azamat_temp_bg.mp4`), to'q-oltin |

## 4. Taklifnoma (demo) anatomiyasi — bo'limlar

Har bir demo — «konvert» ekranidan boshlanadi («Ochish uchun bosing» /
«Ochish uchun muhrga bosing») va quyidagi bo'limlardan iborat.
Bundle'dagi `createWedding.sections.*` kalitlari — yoqib/o'chiriladigan ro'yxat:

| Kalit | Nomi | Mazmuni |
|---|---|---|
| — | **Konvert (cover)** | yopiq konvert, monogramma/muhr, ochish tugmasi, (ayrimlarida video) |
| — | **Hero** | kicker («Nikoh kuni»), sana + vaqt, kelin-kuyov ismlari, «Pastga suring» |
| `blessing` | Muqaddas duo | Basmala / oyat + manba (masalan «Anfol surasi, 63-oyat»), arabcha matn |
| `dearGuests` | Murojaat | «Aziz mehmonimiz! Sizni nikoh to'yimiz munosabati bilan…» + «Hurmat bilan, …» |
| `countdown` | Sana va sanoq | KUN : SOAT : DAQIQA : SONIYA |
| — | **Oylik kalendar** | oy nomi, hafta kunlari, tadbir kuni ajratib ko'rsatilgan |
| `schedule` | Kun tartibi | 5 tagacha band: vaqt + izoh (17:00 Mehmonlarni kutib olish, 18:00 Nikoh marosimi, 19:00 Kokteyl, 20:00 Kechki taom, 21:00 Raqs) |
| `details` | Tadbir tafsilotlari | «Qachon & Qayerda» kartasi: sana, boshlanish vaqti, joy |
| — | **Ikki tadbir** | Yoqut: 1) Qizlar bazmi 27-noyabr «Oʻzbegim» to'yxonasi; 2) Nikoh to'yi 28-noyabr «Orasta» to'yxonasi — har biri SANA / VAQT / TO'YXONA + Google/Yandex havola |
| `venue` | To'yxona | nom, manzil, xarita tugmalari, (ba'zilarida xarita ramkasi — `map-frame.svg`) |
| `location` | Joylashuv (xarita) | koordinata yoki Yandex/Google havolasi |
| `story` | Bizning hikoyamiz | sevgi hikoyasi matni («Our Journey») |
| `gallery` | Suratlar galereyasi | juftlik va «xotira» rasmlari; `flower` da mehmonlar o'zi rasm yuklaydi |
| — | **Maxsus mehmonlar** | xonandalar: ism + foto + izoh («Yulduz Usmonova — Soat 21:00 da jonli ijro»); slider yoki ro'yxat |
| `dressCode` | Kiyim uslubi | «Bayramda to'q qizil va bordo ranglardagi kiyimlardan voz kechishingizni so'raymiz» |
| `notes` | Mehmon notlari | sovg'a haqida + kiyim kodi |
| `rsvp` | Tashrifni tasdiqlash | **ikki rejim**: «Qo'lda kiritish» yoki «Ismimni topish» (mehmonlar ro'yxatidan qidirish) |
| `toyona` | To'yona (pul sovg'asi) | karta raqami + egasi + «Karta raqamini nusxalash» |
| `guestBook` | Mehmonlar kitobi / Tilaklar daftari | mehmon xatolari ro'yxati + «Xabar yuborish» |
| — | **Footer** | «Sizni intizorlik bilan kutib qoluvchilar: … hamda ularning ota-onalari», «Baxtimizga sherik bo'ling!» |
| `orderCta` | Reklama bloki | «To'y Taklifnomangizni Buyurtma Bering» + Telegram/Instagram (studiya promosi) |

Qo'shimcha: **til almashtirgich** (UZ/RU/EN/TR), **fon musiqasi** tugmasi,
ulashish (WhatsApp/Telegram/Instagram/Facebook).

## 5. Ma'lumot modeli (bundle'dan)

```ts
type Wedding = {
  groom: string; bride: string
  twinWedding?: boolean              // qo'sh to'y (egizaklar) — bride2/groom2
  weddingDate: string; weddingTime: string
  venue: string; venueAddress: string
  venueCoordinates: { lat: number; lng: number } | null
  locationLink?: string              // Yandex/Google/koordinata
  couplePhotoUrl: string | null
  story: string | null
  dearGuestMessage: string | null
  dressCode?: string
  cardNumber?: string; cardHolderName?: string
  singers?: { name: string; note?: string; photo?: string }[]
  schedule?: { time: string; label: string }[]      // maks 5
  secondEventTitle/Date/Time/Venue/VenueAddress/MapPinUrl   // 2-tadbir
  backgroundMusicUrl?: string
  shareImage?: string
  template: string
  defaultLanguage: 'uz'|'ru'|'en'
  availableLanguages: string[]
  visibility: 'public'|'private'
  sections: Partial<Record<
    'blessing'|'countdown'|'schedule'|'venue'|'location'|'rsvp'|'guestBook'|
    'dearGuests'|'details'|'story'|'gallery'|'toyona'|'notes'|'dressCode'|'singer'|'orderCta',
    boolean>>
}
```

## 6. RSVP va mehmonlar boshqaruvi

- **Mehmon tomoni**: «Qo'lda kiritish» (ism + email) yoki «Ismimni topish»
  (guest list'dan qidirib tanlash) → holat tanlash:
  `✅ Ha, albatta boraman` · `👥 Ha, mehmon bilan boraman` · `😐 Hali aniq emas` ·
  `❌ Afsus, kela olmayman` + izoh (ixtiyoriy).
- **Egasi tomoni** (`manage.guests*`): jami mehmonlar, tasdiqlangan/kutilmoqda,
  javob berish foizi, holat bo'yicha filtr, qidiruv, ommaviy (bulk) yangilash,
  `Ro'yxatni eksport qilish`, mehmon qo'shish (toifa: oila/do'stlar/hamkasblar,
  tomon: kelin/kuyov/ikkalasi, hamroh, ovqatlanish cheklovi, ichki eslatmalar),
  so'nggi izohlar statistikasi.
- **Mehmon menejeri roli**: alohida hisob, faqat mehmonlar va mehmonlar kitobi
  bo'limiga cheklangan kirish (`guestManager.*`).

## 7. Narx rejalari

| Reja | Xususiyatlar |
|---|---|
| **Asosiy** (bepul) | asosiy veb-sayt, mehmonlar ro'yxati, RSVP, foto galereya, 7 ta bepul shablon |
| **Premium** | barcha Asosiy + cheksiz mehmon, premium shablonlar, cheksiz foto, shaxsiy domen, fon musiqasi |
| **Deluxe** | barcha Premium + kengaytirilgan moslashtirish, ustuvor qo'llab-quvvatlash, mehmonlarga xabar, tahlil paneli |

## 8. Bizning loyihaga ko'chiriladigan qismlar (xulosa)

Bizning platformamiz allaqachon: konvert bilan ochilish, countdown, timeline,
venue + xarita, RSVP, tilaklar daftari (Wishes), to'yona kartasi, QR + ulashish,
admin panel — ya'ni skelet kuchli. taklif-link dan **qo'shiladigan qiymat**:

1. **17 ta yangi shablon** — ularning nomi/palitrasi va o'ziga xosligi bilan
   (3 ta yangi premium baza: `luxe-vow`, `watercolor-garden`, `noir-gradient`).
2. **Yangi bo'limlar**: oylik kalendar, ko'p tadbirli dastur, maxsus mehmonlar
   (xonandalar), sevgi hikoyasi, galereya, kiyim uslubi, murojaat bloki.
3. **Premium sayt qatlami**: shablon darajalari (Premium/Oddiy), narx rejalari,
   taqqoslash bloki, xususiyatlar, katalogda qidiruv/filtr.
