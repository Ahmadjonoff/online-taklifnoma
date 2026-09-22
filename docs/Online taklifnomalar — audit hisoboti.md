# Online taklifnomalar — audit hisoboti

2026-09-22 · @Someone

Sayt (localhost:3000) brauzer orqali to'liq ko'rib chiqildi: barcha sahifalar, formalar, admin panel, mobil ko'rinish va network so'rovlari tekshirildi. Quyida topilgan xatolar va rivojlantirish takliflari muhimlik darajasi bo'yicha tartiblangan.

## 1. Kritik xatolar (darhol tuzatish kerak)

### Admin panel himoyasiz

`/admin` va `/admin/javoblar` sahifalari hech qanday login yoki parolsiz ochiladi. Tekshirilganda cookie, sessiya tokeni yoki boshqa autentifikatsiya izi topilmadi — havolani bilgan har kim mijozlarning ismi, telefon raqami, buyurtma summasini ko'radi va "To'landi" / "Bekor" tugmalari orqali buyurtma holatini o'zgartira oladi. Buning ustiga bu havolalar ("Admin panel", "RSVP va tilaklar") saytning ochiq footer qismida hammaga ko'rinib turibdi. Bu — mijozlar maxfiyligi (PII) va biznes ma'lumotlari xavfsizligiga bevosita tahdid.

**Tavsiya:** admin bo'limiga parol/login (masalan, oddiy session-based auth yoki NextAuth) qo'shish va footer'dagi ochiq havolalarni olib tashlash.

### RSVP va "Tilaklar daftari" formalari ishlamaydi

Har ikkala forma ham `/api/forms` endpointiga POST so'rov yuboradi, lekin bu endpoint doimiy ravishda `400 Bad Request` (`"Ma'lumotlar to'liq emas"`) qaytaradi. Bu real taklifnoma sahifasida (`nikoh-imperial`) ikkala forma orqali ham sinovdan o'tkazildi — ikkalasi ham "Yuborishda xatolik" xabari bilan muvaffaqiyatsiz tugadi. Admin paneldagi "RSVP va tilaklar" bo'limi buni tasdiqlaydi: "0 keladi, 0 kelolmaydi, 0 tilak" — ya'ni hozircha mehmonlarning barcha javoblari va tilaklari yo'qolib ketmoqda.

Qiziq jihati: buyurtma formasi (`/api/orders`) xuddi shu sahifada to'g'ri ishlaydi (200 status bilan) — demak muammo faqat `/api/forms` endpointida yoki frontend yuboradigan payload strukturasida (backend kutayotgan maydonlar bilan frontend yuborayotgan maydonlar mos kelmayapti).

**Tavsiya:** `/api/forms` route handler kodini frontend RSVP/tilak komponentlari yuborayotgan payload bilan solishtirib, qaysi maydon yetishmayotganini aniqlash — bu ehtimol soatlar ichida tuzatiladigan bug.

## 2. O'rtacha darajadagi muammolar

- **Dastur (kun tartibi) bo'limida layout xatosi.** Taklifnoma ichidagi vaqt-jadval liniyasida "Marosim boshlanishi" qatorining "19:00" vaqti matndan uzilib, o'ng chetga otilib ketgan; boshqa qatorlar (18:00, 21:00) esa vaqt va matn birga to'g'ri joylashgan. CSS/flex pozitsiyalash xatosi.
- **Sana maydonida cheklov yo'q.** Buyurtma formasidagi va boshqa joylardagi `<input type="date">` maydonlarida `min`/`max` atributi yo'q — foydalanuvchi tasodifan yil 275760 kabi mazmunsiz sana kiritishi mumkin.
- **Telefon raqami format tekshiruvi yo'q.** Admin paneldagi bitta buyurtmada telefon o'rniga "=123" saqlanib qolgani ko'rindi — forma har qanday matnni telefon sifatida qabul qilyapti.
- **Meta teglar va sarlavhalar yo'q.** Har bir taklifnoma sahifasi (`/e/...`) va preview sahifalarining `<title>` tegi yo'q — brauzer tabida shunchaki "localhost" chiqadi. Open Graph teglari (`og:title`, `og:image`, `og:description`) ham umuman yo'q. Bu jiddiy, chunki bu havolalar asosan Telegram/WhatsApp orqali ulashiladi — hozir ulashganda chiroyli preview kartochka (kelin-kuyov ismi, sana, rasm) chiqmaydi.
- **Dizaynsiz xato sahifalari.** `/admin`dan tashqari har qanday mavjud bo'lmagan URL uchun Next.js'ning standart qora-oq 404 sahifasi chiqadi — saytga qaytish tugmasi yo'q. Xuddi shunday, noto'g'ri shablon slug bilan `/preview/...` ochilganda ("Shablon topilmadi") bezaksiz qora ekran chiqadi, ortga qaytish imkonisiz.
- **Keraksiz prefetch yuklamasi.** `/shablonlar` sahifasi ochilganda barcha 77 ta shablonning preview sahifasi avtomatik oldindan yuklanadi (Next.js Link prefetch). Bu bitta sahifa ochilishi uchun 77 ta qo'shimcha server so'rovi degani — production muhitda keraksiz trafik, server yuklamasi va xarajatni oshiradi.

## 3. Kichik nuqsonlar

- Taklifnoma matnida jumla chala qolgan: "Sizni tadbirimizda ko'rishdan" — davomi yo'q (ehtimol "xursandmiz" yoki shunga o'xshash so'z tushib qolgan).
- Qidiruv natijalari kategoriya sonlari bilan biroz farq qiladi: "nikoh" so'zi bo'yicha qidiruv 18 ta natija ko'rsatadi, "Nikoh to'yi" kategoriyasida esa 17 ta shablon bor — ehtimol qidiruv tavsifdagi matnni ham qamrab olgani uchun, lekin tekshirib ko'rish kerak.
- RSVP formasida ismni bo'sh qoldirib yuborishga urinilganda, faqat maydon chegarasi qizil rangga o'zgaradi — aniq xato matni ("Ismingizni kiriting") ko'rsatilmaydi, bu foydalanuvchi uchun tushunarsiz bo'lishi mumkin.

## 4. Rivojlantirish (upgrade) takliflari

- **Admin panelga autentifikatsiya** — bu ro'yxatdagi eng muhim qadam, chunki hozir bu funksiyani biznes uchun xavfsiz ishlatib bo'lmaydi.
- **RSVP ro'yxatini eksport qilish** — Excel/CSV formatida yuklab olish, to'yxonaga dasturxon sonini tayyorlashda qulay bo'ladi.
- **Avtomatik bildirishnoma** — yangi RSVP, tilak yoki buyurtma kelganda operatorga Telegram bot orqali darhol xabar yuborish (hozir buni admin panelni qo'lda tekshirib turish orqali bilish mumkin).
- **Mehmon ko'rish statistikasi** — "ko'rish" hisoblagichi allaqachon mavjud (masalan "0 ko'rish"), buni kengaytirib, qaysi mehmon havolani ochgani/ochmagani ko'rinadigan qilish mumkin.
- **O'z-o'ziga xizmat (self-service) tahrirlash paneli** — hozir galereya rasmlari va matnlar operator orqali qo'lda kiritiladi; kelin-kuyovga o'zi rasm yuklab, matn tahrirlay oladigan sodda panel qo'shish ish yukini kamaytiradi.
- **Ixtiyoriy onlayn to'lov** — hozir barcha narx kelishuvlari Telegram orqali qo'lda boradi; Payme yoki Click integratsiyasi ba'zi mijozlar uchun jarayonni tezlashtiradi (majburiy emas, qo'shimcha variant sifatida).
- **Ko'p tilli interfeys** — rus tilida versiya qo'shish, chunki ko'p to'y mehmonlari va mijozlar rus tilida ham qulay o'qiydi.
- **Meta va Open Graph teglarini to'g'irlash** — yuqorida aytilgan muammoning davomi sifatida, bu eng arzon va eng katta ta'sir beradigan yaxshilanishlardan biri: ijtimoiy tarmoqlarda ulashilganda chiroyli preview va qidiruv tizimlarida to'g'ri ko'rinish beradi.

## 5. Ustuvorlik jadvali

| # | Topilma | Muhimlik | Taxminiy hajmi |
| --- | --- | --- | --- |
| 1 | Admin panel himoyasiz (auth yo'q) | Kritik | O'rtacha (login tizimi) |
| 2 | RSVP / Tilaklar formasi 400 xato beradi | Kritik | Kichik (payload moslash) |
| 3 | Dastur bo'limida vaqt-jadval layout xatosi | O'rtacha | Kichik (CSS) |
| 4 | Sana/telefon maydonlarida validatsiya yo'q | O'rtacha | Kichik |
| 5 | Meta/OG teglar yo'q | O'rtacha | Kichik-o'rtacha |
| 6 | Dizaynsiz 404 va "Shablon topilmadi" sahifalari | O'rtacha | Kichik |
| 7 | /shablonlar sahifasida 77 ta ortiqcha prefetch so'rovi | O'rtacha | Kichik (prefetch sozlamasi) |
| 8 | Chala jumla ("ko'rishdan...") | Kichik | Bir necha daqiqa |
| 9 | RSVP forma xato xabari yo'q | Kichik | Kichik |
| 10 | Qidiruv/kategoriya son nomuvofiqligi | Kichik | Tekshirish kerak |

Upgrade takliflari (bo'lim 4) ustuvorlik jadvaliga kiritilmagan, chunki ular xato emas — mahsulotni rivojlantirish yo'nalishlari sifatida alohida ko'rib chiqilishi kerak.
