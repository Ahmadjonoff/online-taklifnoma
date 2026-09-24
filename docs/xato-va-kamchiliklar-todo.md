# Xato va kamchiliklar — bajarilishi kerak bo'lgan ishlar

Loyihani to'liq ko'rib chiqish natijasida aniqlangan muammolar va ularni tuzatish
bo'yicha topshiriqlar ro'yxati. Ustuvorlik darajasi bo'yicha guruhlangan.

> **Holat:** quyidagi barcha 8 band bajarildi (✅). Har bir bandda nima
> o'zgartirilgani qisqacha yozilgan.

## 🔴 Jiddiy (Critical) — darhol tuzatish kerak

### ✅ 1. Reflected XSS — `src/app/preview/[theme]/route.ts`
- **Muammo:** `?cfg=` query-parametri `JSON.parse` qilingach, hech qanday
  himoyasiz to'g'ridan-to'g'ri `<script>window.__INV_CONFIG__=${JSON.stringify(config)};</script>`
  ichiga qo'yiladi (42–116-qatorlar). Agar `cfg` ichidagi biror satrda
  `</script><script>...</script>` bo'lsa, brauzer buni haqiqiy skript sifatida
  ijro etadi.
- **Qiyoslash:** `src/app/e/[slug]/route.ts` (188-qator) xuddi shu joyda
  `.replace(/<\/script/gi, "<\\/script")` bilan bu holatni to'g'ri qamrab olgan
  — bir xil kodning ikki nusxasida himoya nomutanosib.
- **Xavf darajasi yuqori:** route login talab qilmaydi, `OrderForm.tsx` orqali
  `sandbox="allow-scripts allow-same-origin"` bilan iframe'da yuklanadi —
  tajovuzkor tayyor havola yasab, foydalanuvchiga yuborishi mumkin.
- **Tuzatish:** `JSON.stringify(config).replace(/<\/script/gi, "<\\/script")`
  qo'llash (yoki `cfg` ni qat'iy validatsiya qilish/whitelist maydonlar bilan
  cheklash).
- **Bajarildi:** `JSON.stringify(config).replace(/<\/script/gi, "<\\/script")`
  qo'llandi — `e/[slug]/route.ts` bilan bir xil himoya endi ikkala joyda ham bor.

### ✅ 2. Admin cookie qiymati — bevosita parolning o'zi
- **Fayllar:** `src/app/api/admin/login/route.ts` (13-qator),
  `src/proxy.ts` (10–21-qatorlar).
- **Muammo:** Login cookie'siga sessiya tokeni o'rniga **parolning aynan
  o'zi** yoziladi va keyingi so'rovlarda shu qiymat solishtiriladi. Cookie
  biror sabab bilan oqib ketsa (log, xato xabari, devtools ulashuvi va h.k.),
  tajovuzkor bevosita admin parolini qo'lga kiritadi.
- **Tuzatish:** Login muvaffaqiyatli bo'lganda tasodifiy sessiya token
  generatsiya qilish (masalan `crypto.randomUUID()` yoki imzolangan JWT),
  uni serverda/DB'da saqlash yoki imzolab cookie'ga qo'yish — cookie'da
  parolning o'zi hech qachon bo'lmasligi kerak.
- **Bajarildi:** yangi `src/lib/adminAuth.ts` qo'shildi — `createSessionToken()`
  `issuedAt.nonce.hmac` ko'rinishidagi imzolangan (HMAC-SHA256, kalit —
  `ADMIN_PASSWORD`) tokenni yaratadi, `verifySessionToken()` imzoni
  `timingSafeEqual` bilan va tokenning 14 kunlik amal muddatini tekshiradi.
  `login/route.ts`, `logout/route.ts` va `proxy.ts` shu funksiyalardan
  foydalanadigan qilib yangilandi — cookie'da endi parol emas, token saqlanadi.

### ✅ 3. Zaif standart admin parol (`admin123`)
- **Fayllar:** `src/app/api/admin/login/route.ts` va `src/proxy.ts` —
  ikkalasida ham `process.env.ADMIN_PASSWORD ?? "admin123"`.
- **Muammo:** `.env`da `ADMIN_PASSWORD` sozlanmasa (yoki production'da
  unutilsa), admin panel standart `admin123` paroli bilan ochiq qoladi.
- **Tuzatish:** Production build/start paytida `ADMIN_PASSWORD` majburiy
  qilish (o'zgaruvchi yo'q bo'lsa xato bilan to'xtatish), fallback parolni
  olib tashlash.
- **Bajarildi:** `adminAuth.ts`dagi `getAdminPassword()` — `NODE_ENV === "production"`
  va `ADMIN_PASSWORD` yo'q bo'lsa xato tashlaydi; `admin123` fallback faqat
  development uchun qoldirildi.

## 🟠 O'rtacha (Medium)

### ✅ 4. Brute-force himoyasi yo'q
- **Fayllar:** `src/app/api/admin/login/route.ts`, `src/app/api/orders/route.ts`.
- **Muammo:** Login va buyurtma yuborish endpointlarida rate-limiting yoki
  captcha yo'q — admin parolini cheksiz urinish yoki forma spam qilish mumkin.
- **Tuzatish:** IP/soniya asosida oddiy rate-limit (masalan in-memory yoki
  Redis-based) qo'shish, ayniqsa `/api/admin/login` uchun.
- **Bajarildi:** yangi `src/lib/rateLimit.ts` — jarayon xotirasidagi
  fixed-window limiter (`rateLimit(key, limit, windowMs)` + `clientIp(req)`).
  `/api/admin/login`ga 5 urinish/daqiqa, `/api/orders`ga 5 buyurtma/daqiqa
  (IP bo'yicha) qo'llandi; limitdan oshganda `429` qaytariladi.

### ✅ 5. `next.config.ts` dagi noto'g'ri "SHABLON" alias
- **Fayl:** `next.config.ts` (10–31-qatorlar).
- **Muammo:** `@ui`, `@decor`, `@config` aliaslari `templates-src/SHABLON/...`
  yo'liga ishora qiladi — "SHABLON" bu yerda o'zgaruvchi emas, qattiq yozilgan
  satr, va bunday papka mavjud emas (haqiqiy shablon papkalari
  `nikoh-royal`, `toy-original` kabi nomlangan). Hozircha `src/` ichida
  ishlatilmaydi (o'lik config), lekin kelajakda shu aliasga tayangan kod
  module-not-found xatosiga uchraydi.
- **Tuzatish:** Aliaslarni olib tashlash yoki to'g'ri (dinamik/haqiqiy)
  yo'lga tuzatish.
- **Bajarildi:** `next.config.ts`dan `turbopack.resolveAlias` va `webpack()`
  bloklari butunlay olib tashlandi — bu aliaslar haqiqatda faqat
  `scripts/vite.template.config.ts` orqali (shablonlarni build qilishda)
  ishlatiladi, Next ilovasi ularga umuman muhtoj emasligi tasdiqlandi.

### ✅ 6. `views` hisoblagichi — bot-trafik va race condition
- **Fayl:** `src/app/e/[slug]/route.ts` (152–156-qatorlar).
- **Muammo:** Har bir GET so'rovida `views: { increment: 1 }` bajariladi.
  Link Telegram/WhatsApp'ga ulashilganda ularning link-preview botlari ham
  sahifani so'raydi va ko'rishlar sonini soxta oshiradi.
- **Tuzatish:** Bot User-Agent'larni filtrlash yoki ko'rishni faqat
  frontend orqali (masalan client-side fetch bilan) hisoblash.
- **Bajarildi:** `e/[slug]/route.ts`ga `BOT_UA_RE` regex qo'shildi (bot,
  crawl, spider, telegrambot, whatsapp, facebookexternalhit va h.k.) —
  User-Agent shu naqshga mos kelsa, `views` oshirilmaydi.

## 🟡 Kichik / kod sifati

### ✅ 7. `api/forms/route.ts` — uzunlik chegarasi yo'q
- **Fayl:** `src/app/api/forms/route.ts`.
- **Muammo:** RSVP/tilak yuborishda faqat `name`/`slug`/`kind` tekshiriladi;
  `message`/`comment` uchun maksimal uzunlik cheklanmagan — juda uzun matn
  yuborib DB'ni to'ldirish mumkin.
- **Tuzatish:** `message`/`comment`/`guestName` uchun maksimal uzunlik
  validatsiyasi qo'shish (masalan 500–1000 belgi).
- **Bajarildi:** `api/forms/route.ts`ga `MAX_NAME_LENGTH = 80` va
  `MAX_TEXT_LENGTH = 500` konstantalari va shu chegaralarni tekshiruvchi
  validatsiya qo'shildi (`400` xato qaytaradi).

### ✅ 8. Xatolarni loglashda foydalanuvchi ma'lumotlari
- **Fayllar:** Ko'p joyda `catch (e) { console.error(e); ... }`
  (`api/orders`, `api/forms`, `api/admin/orders/[id]` va h.k.).
- **Muammo:** Production loglarida foydalanuvchi ma'lumotlari (ism, telefon)
  chiqib ketishi mumkin, ayniqsa loglar tashqi tizimga yuborilsa.
- **Tuzatish:** Log qilishdan oldin shaxsiy ma'lumotlarni maskalash yoki
  faqat xato turi/stack'ni loglash.
- **Bajarildi:** `api/orders/route.ts`, `api/forms/route.ts` va
  `api/admin/orders/[id]/route.ts`dagi barcha `console.error(e)` chaqiruvlari
  `console.error("...xatolik:", e instanceof Error ? e.message : e)` ko'rinishiga
  o'zgartirildi — endi to'liq xato obyekti/stack o'rniga faqat qisqa xabar
  loglanadi.

---

## Ustuvorlik tartibida tavsiya etilgan tartib

1. ✅ `preview/[theme]/route.ts` dagi XSS'ni darhol tuzatish.
2. ✅ Admin autentifikatsiyasini sessiya-token asosiga o'tkazish.
3. ✅ Standart admin parolni majburiy environment o'zgaruvchisiga aylantirish.
4. ✅ Login/order endpointlariga oddiy rate-limit qo'shish.
5. ✅ `next.config.ts` dagi "SHABLON" aliaslarini tozalash.
6. ✅ Qolgan kichik topilmalarni (7, 8) navbat bilan bajarish.

## Bajarilgan o'zgarishlar — fayllar ro'yxati

**Yangi fayllar:**
- `src/lib/adminAuth.ts` — imzolangan sessiya tokeni (login/logout/proxy shu yerdan foydalanadi).
- `src/lib/rateLimit.ts` — jarayon xotirasidagi oddiy rate-limiter.

**O'zgartirilgan fayllar:**
- `src/proxy.ts` — cookie solishtirish o'rniga `verifySessionToken`.
- `src/app/api/admin/login/route.ts` — sessiya tokeni + rate-limit.
- `src/app/api/admin/logout/route.ts` — `COOKIE_NAME` konstantasidan foydalanish.
- `src/app/preview/[theme]/route.ts` — XSS tuzatildi (`</script` escape).
- `src/app/e/[slug]/route.ts` — bot User-Agent filtri (`views` hisoblagichi uchun).
- `src/app/api/orders/route.ts` — rate-limit + xavfsizroq log.
- `src/app/api/forms/route.ts` — uzunlik validatsiyasi + xavfsizroq log.
- `src/app/api/admin/orders/[id]/route.ts` — xavfsizroq log.
- `next.config.ts` — o'lik "SHABLON" aliaslari olib tashlandi.

**Tekshirildi:** `npx tsc --noEmit` va `npm run build` xatosiz o'tdi; sessiya
token yaratish/tekshirish va XSS-escape logikasi qo'lda skript bilan sinovdan
o'tkazildi.

---

# 2-bosqich: qayta tahlil (2026-09-24)

Loyiha Neon + Vercel'ga ko'chgach qayta ko'rib chiqildi. Quyida topilgan
muammolar va ularning yechimi keltirilgan.

## 🟠 O'rtacha

### ✅ 9. RSVP/tilak endpoint'ida rate-limit yo'q edi
- **Fayl:** `src/app/api/forms/route.ts`
- **Bajarildi:** ikki xil limit qo'shildi:
  - IP bo'yicha: daqiqasiga 5 ta;
  - bitta taklifnomaga (IP'dan qat'i nazar): soatiga 300 ta.

### ✅ 10. `guestsCount` tekshirilmas edi
- **Muammo:** `Math.max(1, body.guests ?? 1)` — yuqori chegara yo'q edi. Satr yoki 2³¹ dan katta son 500 xato qaytarardi.
- **Bajarildi:** yangi `src/lib/validation.ts` → `validateGuestSubmission`:
  - mehmonlar soni butun son, 1–20 oralig'ida (shablondagi tanlagich bilan bir xil);
  - `attending` faqat `keladi` yoki `kelolmaydi`;
  - bo'sh tilak rad etiladi.

### ✅ 11. Buyurtma maydonlarida uzunlik va tur chegarasi yo'q edi
- **Fayl:** `src/app/api/orders/route.ts`
- **Bajarildi:** `validateOrderContent` (`src/lib/validation.ts`):
  - tur tekshiruvi, boshqaruv belgilarini tozalash;
  - `CONTENT_LIMITS` bo'yicha uzunlik chegarasi;
  - `eventTime` formati (HH:MM) va sana formati tekshiriladi.

  Xuddi shu chegaralar jonli preview'da va formadagi `maxLength` da ham ishlatiladi.

### ✅ 12. Rate-limiter faqat instance xotirasida edi
- **Muammo:** Vercel'da har bir instance'ning xotirasi alohida, shuning uchun limit amalda N marta zaif edi.
- **Bajarildi:** hisoblagich Postgres'ga ko'chirildi:
  - yangi `RateLimit` jadvali (migratsiya `20260924082813_rate_limit`);
  - bitta atomik `INSERT … ON CONFLICT` so'rovi;
  - baza ishlamasa xotiradagi limiterga qaytiladi.

### ✅ 13. Upload token'lari cheklanmagan edi
- **Muammo:** yuklash buyurtmadan oldin sodir bo'ladi, shuning uchun login talab qilib bo'lmaydi.
- **Bajarildi:**
  - IP limitidan tashqari umumiy soatlik limit qo'shildi (suratlar 600, musiqa 100);
  - kunlik Vercel Cron qo'shildi (`/api/cron/blob-cleanup`, `CRON_SECRET` bilan). U 3 kundan eski va hech bir taklifnomada ishlatilmagan fayllarni o'chiradi.

### ✅ 14. Preview deploy prod bazaga migratsiya qo'llashi mumkin edi
- **Bajarildi:** `scripts/vercel-build.sh` migratsiya va seed'ni faqat `VERCEL_ENV=production` bo'lganda ishga tushiradi. Boshqa muhitlarda buni yoqish uchun `MIGRATE_ON_BUILD=1` qo'yish kerak.

## 🟡 Kichik / kod sifati

### ✅ 15. README eskirgan edi
- **Muammo:** README'da SQLite, 77 shablon, `/admin` va `/buyurtma/[id]` yozilgan edi.
- **Bajarildi:** README yangilandi. `.env.example` qo'shildi.

### ✅ 16. Admin panel barcha buyurtmalarni yuklardi
- **Bajarildi:**
  - statistika bazada hisoblanadi (`groupBy` va `SUM`);
  - ro'yxat 30 tadan sahifalanadi (`?page=`).

### ✅ 17. Ko'rishlar hisoblagichi javobni sekinlashtirardi
- **Bajarildi:** `/e/[slug]` dagi DB yozuvlari `after()` ichiga ko'chirildi.

### ✅ 18. Test va lint yo'q edi
- **Bajarildi:**
  - `npm run lint` (ESLint 9 + `eslint-config-next`) qo'shildi, topilgan 4 ta xato tuzatildi;
  - `npm test` (`node:test` + tsx) qo'shildi. 25 ta test `validation`, `customization`, `pricing` va `adminAuth` ni qamraydi.

### ✅ 19. Keraksiz fayllar
- **Bajarildi:**
  - Create Next App'dan qolgan `public/*.svg` fayllari o'chirildi;
  - logo manbasi `docs/brand/` ga ko'chirildi.
- **Qoldirildi:** `.agents`, `.claude`, `.windsurf` agent skill'lari (`skills-lock.json` orqali o'rnatiladi) va `.freebuff`. Ular deploy'ga kirmaydi.

### ✅ 20. Slug to'qnashuvi 500 qaytarishi mumkin edi
- **Bajarildi:**
  - slug qo'shimchasi endi `crypto.randomBytes` bilan yasaladi;
  - `@unique` to'qnashuvida (P2002) 3 martagacha qayta urinadi.

---

# 3-bosqich: logika va texnik xatolar (2026-09-24)

### ✅ 21. Mavjud bo'lmagan sana qabul qilinardi
- **Muammo:** `new Date("2026-02-31")` xato bermaydi, jimgina 3-martga aylanadi. Taklifnomada esa "31.02.2026" ko'rinardi.
- **Bajarildi:** yangi `src/lib/dates.ts` → `isRealDate` sanani qaytarib solishtiradi.

### ✅ 22. Sana server vaqt zonasiga bog'liq edi
- **Muammo:** `eventDate` UTC yarim tunida saqlanadi, lekin `getDate()`/`getMonth()` bilan o'qilardi. Server UTC bo'lmasa, sana bir kunga siljiydi.
- **Bajarildi:** `isoDate()` faqat UTC getter'larni ishlatadi. `/e/[slug]`, `kalendar.ics` va ulashish rasmlari shunga o'tkazildi.
- "Bugun" endi Toshkent vaqti bo'yicha hisoblanadi (`eventDateRange`). Forma va server bir xil oraliqni ishlatadi.

### ✅ 23. Shablon sahifasida Luxury uchun Standart imkoniyatlari ko'rsatilardi
- **Muammo:**
  - `tier === "premium" ? … : featuresStandard` sharti Luxury'ni ham Standart deb ko'rsatardi;
  - ro'yxatlar tariflarga mos emas edi (masalan, galereya Premium'da deb yozilgan, aslida faqat Luxury'da).
- **Bajarildi:** sahifa bosh sahifadagi tarif kartalaridan (`home.plans`) foydalanadi. Eskirgan ro'yxatlar o'chirildi.

### ✅ 24. O'chirilgan RSVP/tilaklar API orqali ishlayverardi
- **Bajarildi:** mijoz bo'limni o'chirgan bo'lsa:
  - POST 403 qaytaradi;
  - tilaklar GET orqali ko'rsatilmaydi.

### ✅ 25. Bekor qilingan buyurtma mijozga "kutilmoqda" bo'lib ko'rinardi
- **Bajarildi:** `/buyurtma/[token]` da alohida "Buyurtma bekor qilingan" holati qo'shildi (uz/ru/en).

### ✅ 26. Admin tugmalari xatoni yashirardi
- **Muammo:** sessiya tugagan bo'lsa ham tugma bosilganda hech narsa bo'lmasdi.
- **Bajarildi:**
  - 401 bo'lsa login sahifasiga o'tadi;
  - boshqa xatolar ko'rsatiladi;
  - tasdiqlangan taklifnomani bekor qilishdan oldin tasdiq so'raladi.

### ✅ 27. Production'da metadata localhost'ga ishora qilardi
- **Muammo:** Vercel'da `NEXT_PUBLIC_SITE_URL` yo'q edi, shuning uchun `metadataBase` = `http://localhost:3000` bo'lib qolardi.
- **Bajarildi:** `VERCEL_PROJECT_PRODUCTION_URL` ga fallback qo'shildi.

### ✅ 28. Script ichidagi JSON faqat `</script` bo'yicha escape qilinardi
- **Muammo:** `<!--<script>` kabi matn sahifani buzishi mumkin edi.
- **Bajarildi:** `scriptJson()` har bir `<` ni `<` ga almashtiradi. Taklifnoma, preview va tarjima skriptida ishlatiladi.

### ✅ 29. RSVP limiti CGNAT ortidagi mehmonlarni to'sib qo'yishi mumkin edi
- **Bajarildi:** IP limiti 20/daqiqaga oshirildi. Taklifnoma boshiga soatlik limit o'zgarmadi.

### ✅ 30. Shablon fayli yo'q bo'lsa 500 xato chiqardi
- **Bajarildi:** `/e/[slug]` endi xatoni loglaydi va 404 sahifa ko'rsatadi.
