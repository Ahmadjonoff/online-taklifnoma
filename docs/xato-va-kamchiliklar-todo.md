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
