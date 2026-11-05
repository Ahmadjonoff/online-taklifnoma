# Instagram referens tahlili — «Cinematic 3D» shablon oilasi uchun

> Sana: 2026-11-04. Tahlil Chrome kengaytmasi orqali, foydalanuvchining Instagram sessiyasida qilindi (like, izoh, follow, DM — hech narsa bosilmadi).
> Kadrlar: `docs/referens/<post-id>-<n>.jpg`.

## 0. Qisqa va halol xulosa (avval shuni o'qing)

1. **5 ta postning birortasi ham taklifnoma emas.** Ular: 3D portfolio-sayt (1), 3D mahsulot-sayt (2), admin-dashboard (3, 4) va avtosalon sayti (5). Konvert, darvoza, quti, kitob yoki parda ochilishi **hech birida yo'q**. Ulardan olinadigan narsa — *ochilish turi* emas, *harakat tili*: scroll'ga bog'langan kamera, egilgan «ekran» effekti, kinematografik 3D obyekt, kod ko'rsatadigan reel formati.
2. **Hech bir postning caption'ida jonli sayt havolasi yo'q.** Hammasida «comment qiling — link/code yuboramiz» (lead-magnit). Bio'dagi havolalar: kurs/do'kon/agentlik sahifalari (4 ta), faqat `echo__builds` bio'sida `jishnumondal.vercel.app` bor — lekin u **videodagi sayt emas** (videodagi sayt `localhost`da edi, boshqa dizayn: «ECHO», «JULIAN VANCE», «LANDING PAGES»).
3. **Texnologiya bahosi — taxmin.** Hech bir videodagi sayt ochilmagani uchun `THREE/gsap/Lenis`, `.glb`, network tekshiruvi qilib bo'lmadi. Quyidagi texnik baholar faqat ko'ringan harakatga asoslangan va «taxminan» deb belgilangan.
4. **Qamrov cheklovlari:** har bir video ~10–12 soniya ichida 3 soniya oralig'ida 3–4 marta kadrga olindi (videoni 2 marta boshidan oxirigacha ko'rish, pauza qilish imkoni bo'lmadi — Instagram videosi `<video>` sifatida avtomatik aylanadi, men esa har 3 soniyada suratga oldim). Shuning uchun vaqt chizig'i kadrlar orasida **interpolyatsiya** qilingan. Ovoz tekshirilmadi (videolar muted ishladi).
5. **GIF yozilmadi.** `gif_creator` faqat 3 kadr tutdi (1-post) va uni eksport qilsam brauzer yuklamalariga tushadi, bu muhitdan repoga ko'chirib bo'lmaydi. Shu sababli `*-ochilish.gif` fayllari **yo'q**; o'rniga JPG kadrlar bor.
6. **6-band (boshqa taklifnomalar):** `#onlinetaklifnoma` bo'yicha ko'rilgan 6 ta o'zbek post/sayt ichida **haqiqiy 3D yo'q**; hammasi 2D animatsiyali. Bu bozor uchun muhim topilma (pastda).

---

## 1. Postlar bo'yicha tahlil

### 1.1 `DexTHhNTeh0` — «I hate boring Portfolio Websites»

- **Akkaunt:** `echo__builds` (EchoBuilds, ~5.5k obunachi). 22-oktabr, 13 897 like, 4 520 izoh.
- **Caption:** «Follow and comment "link" for the source code…» — minimal, interaktiv, «kutilmagan» portfolio.
- **Hashtaglar:** #portfolio #portfoliowebsite #webdesign #claude #3dwebsite (+ CreativeCoding, Awwwards, BuildInPublic…).
- **Bio havolasi:** `jishnumondal.vercel.app` (Next.js; `THREE/gsap/Lenis` global sifatida yo'q, 1 ta `<canvas>`; video saytidan boshqa sayt — taxminiy tahlilga kiritilmadi).

**Vaqt chizig'i (~12 s, kadrlar 0 / 3 / 6 / 9 s):**

- 0:00–0:03 — Tepada oq matn «I hate boring Portfolio Websites». Quyida noutbuk ekrani, ekranda katta qalin sarlavhalar («FULL STACK DEVELOPER», «TECHNOLOGIST») yon tomonga **egilgan, yoy bo'ylab buklangan** holda gorizontal sirpanmoqda. Fonda xira «2023/2025» raqamlari.
- 0:03–0:06 — Kamera «LANDING PAGES» bo'limiga o'tadi: loyiha kartalari (interer, qizil/qora poster) ekranning o'rtasida **silindr yuzasiga o'ralgandek egilgan**, chetlarida perspektiva bilan kichrayadi.
- 0:06–0:09 — Kartalar gorizontal aylanib, o'rtadagisi («JULIAN VANCE» + kamera ikonkasi) markazga keladi — **cover-flow / egri karusel**.
- 0:09–0:12 — Oq fonli bo'limga o'tish: «Aether AI» loyihasi, yengil kartalar qatlam-qatlam turibdi (chuqurlik/parallaks).

**Ochilish effekti:** klassik «ochilish» yo'q. Uning o'rniga: sahifa elementlari butun *3D egri sirt* sifatida ko'rinadi (egilgan ekran effekti), bo'limlar orasida gorizontal «sirpanish».
**Kamera:** scroll'ga bog'langan yon siljish + yengil perspektiva; chuqurlik kartalar qatlamlari bilan beriladi.
**3D obyektlar/materiallar:** haqiqiy 3D model yo'q; yassi tekisliklar egilgan (shader-egrilik yoki CSS 3D). Material — matn va rasm.
**Effektlar:** qora fon, xira katta raqamlar, kontrastli oq matn; zarracha/bloom ko'rinmadi.
**Ranglar (taxminan):** `#0B0B0D` (fon), `#F2F2F2` (matn), `#C8372D` (qizil urg'u), `#E9E7E1` (oq bo'lim). **Tipografiya:** juda qalin, siqilgan grotesk (condensed sans), katta o'lcham, hammasi bosh harf.
**Ichki bo'limlar:** hero, ish-tajriba, landing pages, loyihalar, kontakt.
**Musiqa:** tekshirilmadi (muted).
**Texnik baho (taxmin):** WebGL «curved plane» shader (R3F + `Plane` + vertex egilishi) + GSAP ScrollTrigger + Lenis. **Qiyinlik: o'rta**; o'rta Android'da xavf: **o'rta** (har bir kartada tekstura bo'lsa, GPU xotira ko'p).
**Rejadagi variant:** A–F ga to'g'ri kelmaydi → **yangi: «G. Egri sirt (curved plane)» — ochilishdan keyingi bo'limlar o'tishi va galereya uchun** (reja 5-bo'limdagi «Galereya — cover-flow» bilan mos).

Kadrlar: `DexTHhNTeh0-1..4.jpg`.

---

### 1.2 `DfPhwy_zHog` — «Website after switching from ChatGPT to Claude Code»

- **Akkaunt:** `ngocbuildswebsites` (Ngoc Phan, ~5k obunachi). 2 kun oldin, 28 izoh.
- **Caption:** «Comment 'Astra' to receive the exact framework I use to create 3D websites!» — AI yordamida 3D sayt, «immersive depth, refined transitions».
- **Hashtaglar:** #WebDesign #AIWebDesign #NoCode #CreativeDeveloper #DesignInspiration.
- **Bio havolasi:** `zerasoftwarestudio.com/r/ngoc/webdev` (kurs: «Learn to build 3D websites»). Jonli demo sayti emas.

**Vaqt chizig'i (~9 s, kadrlar 0 / 3 / 6 s):**

- 0:00–0:03 — Noutbuk ekrani, to'q ko'k-qora kosmik fon. Markazda **yaltiroq ko'k, shisha-silikon materialdan** quloqchin (earbud) modeli; chapda matn «Unrivalled audio quality». O'ng pastda qo'l trekpadni suryapti.
- 0:03–0:06 — Model **aylanadi** (ichki neon-ko'k yorug'lik «U» shaklida ko'rinadi); matn «Crafted for pure clarity.» — har bir scroll qadamida yangi sarlavha.
- 0:06–0:09 — Model yaqinlashib, to'liq ko'rinadi (shaffof qobiq + ichki yorug'lik), atrofida ingichka yoy/orbita chizig'i; «Sub Alphatonic Power Core».

**Ochilish effekti:** yo'q (mahsulot hero'si). Asosiy «wow» — **scroll bilan aylanuvchi 3D model** (scroll-driven turntable) va har bir qadamda sarlavha almashinuvi.
**Kamera:** model aylanadi/yaqinlashadi (kamera orbitasi scroll'ga bog'langan), ingichka orbital chiziqlar chuqurlik hissini kuchaytiradi.
**Materiallar:** shisha/shaffof qobiq (transmission) + ichki emissiv neon; qora-ko'k muhit. Yorug'lik: rim-light.
**Effektlar:** yulduz-zarrachalar fon, neon glow (bloom), orbit chiziqlari.
**Ranglar (taxminan):** `#05070F` (fon), `#2D5BFF` (ko'k model), `#6FD3FF` (neon), `#FFFFFF` (matn). **Tipografiya:** geometrik sans (Outfit/Inter tipidagi), qisqa sarlavhalar.
**Ichki bo'limlar:** faqat hero + CTA tugma («Explore»).
**Texnik baho (taxmin):** R3F + `useGLTF` + `MeshTransmissionMaterial` + `scroll` bilan kamera/model rotatsiyasi + Bloom; GSAP matn almashinuvi. **Qiyinlik: o'rta–yuqori** (model + transmission); **Android xavfi: yuqori** (transmission material — 2 ta render o'tishi, o'rta telefonlarda og'ir). Taklifnoma uchun `high` darajada qoldirib, `medium`da oddiy PBR materialga o'tkazish kerak.
**Rejadagi variant:** **C (uzuk qutisi)** va hero «3D monogramma» uchun to'g'ridan-to'g'ri ilhom: *shisha/oltin obyekt + ichki yorug'lik + scroll-turntable*. Yangi element: **scroll-driven turntable**.

Kadrlar: `DfPhwy_zHog-1..3.jpg`.

---

### 1.3 `DfRznLZPt8Q` — «E-commerce store admin dashboard»

- **Akkaunt:** `_code_and_chill_` (Code & Chill, ~74k obunachi, tasdiqlangan). 1 kun oldin, 4 649 like.
- **Caption:** «E-commerce store admin dashboard 🛒» — #ecommerce #javascript #uianimation #webdesign #Frontend. Izohlarda hamma «Code / Link» yozmoqda (lead-magnit).
- **Bio havolasi:** `codeandchill.store` (do'kon).

**Vaqt chizig'i (~10 s):**

- 0:00–0:03 — Qora fonda sarlavha «Admin Dashboard 🛒» (iliq oltin-shaftoli rang), ostida UI skrinshoti (ko'k gradientli panel), pastda **kod oynasi** (GSAP `fromTo`, `ghost`, `back.out`).
- 0:03–0:06 — «Orders» sahifasi: Kanban ustunlari; kartochkani **sudrash** («ghost» nusxa + `rotation: -2`, `back.out(2)`). Burchakda oltin sfera va ko'k shaffof «shisha» bezaklar.
- 0:06–0:10 — Asosiy panelga qaytish, grafik chizig'i animatsiyasi.

**Ochilish effekti:** yo'q. **Kamera/3D:** yo'q (2D UI; faqat dekorativ yarim-3D sferalar).
**Materiallar/effektlar:** glassmorphism, gradient blur, sudralayotganda «ghost» soya.
**Ranglar (taxminan):** `#050A14`, `#0E1B33`, `#2B7BFF`, `#F5A65B` (sarlavha), `#19C3B1`. **Tipografiya:** geometrik sans, oltin-shaftoli sarlavha.
**Texnik baho:** GSAP + React; **past** qiyinlik, Android xavfi **past**.
**Taklifnomaga foydasi:** *3D emas*, lekin ikki g'oya foydali: (a) **sudrash/karta «ghost»** mikro-animatsiyasi (RSVP, kun tartibi kartalari uchun); (b) **kodni videoning pastida ko'rsatish** — marketing reel formati uchun.
**Rejadagi variant:** 5-bo'limga yangi qator: «Mikro-interaksiyalar (GSAP drag/back.out)». Ochilish uchun — **kerak emas**.

Kadrlar: `DfRznLZPt8Q-1..3.jpg`.

---

### 1.4 `Dewo9q0zUIx` — «Dashboard V14 — Modern & Minimal UI»

- **Akkaunt:** `code.xr` (Arastoo, ~100k obunachi). 21-oktabr, 5 169 like, 1 698 izoh.
- **Caption:** toza oq temali dashboard; «React.js | CSS | JavaScript | Framer Motion»; hashtag: #webdevelopment #reactjs #frontend #javascript #css.
- **Bio havolasi:** `topmate.io/code_xr` (konsultatsiya/membership). Jonli demo yo'q.

**Vaqt chizig'i (~9 s):** 0:00–0:03 oq dashboard'da yon menyu; 0:03–0:06 yuqoridagi «Manage» tabiga o'tish, **bo'sh kartochkalar** (skelet) paydo bo'ladi; 0:06–0:09 qaytish. Pastda `framer-motion` kodi.

**Ochilish/kamera/3D:** yo'q. **Effektlar:** yengil tab-o'tish, skeleton yuklanish.
**Ranglar (taxminan):** `#FFFFFF`, `#F4F4F5`, `#111111`, urg'u `#F97316` (to'q sariq «V14»). **Tipografiya:** neytral sans.
**Texnik baho:** Framer Motion; **past**, xavf **yo'q**.
**Taklifnomaga foydasi:** minimal. Faqat **skeleton → kontent** o'tishi (3D bundle yuklanguncha poster o'rniga) g'oyasi — 6-bo'lim «lazy loading» bilan mos.
**Rejadagi variant:** yangi element kerak emas; **«kerak emas»**.

Kadrlar: `Dewo9q0zUIx-1..3.jpg`.

---

### 1.5 `DexuTzTzHz5` — «Scroll & Interactive Website for Car Dealership» («Client paid $2,250»)

- **Akkaunt:** `lynam_up` (Jordan Lynam, ~11k obunachi, tasdiqlangan). 22-oktabr, 3 488 like.
- **Caption:** «Comment "SITE" … "TEACH"…», #cardealerships #exoticcars #websitedesign. Bio: `max.lynamupmedia.com` (+2 havola) — agentlik/AI-agent sahifasi.
- *(Izohlar orasida foydalanuvchining o'z izohi — «Build» — oldindan bor edi; men yangi izoh yozmadim.)*

**Vaqt chizig'i (~10 s):** 0:00–0:03 ko'k Mercedes G-wagon (old ko'rinish) ekranni to'ldiradi, ekran noutbukda **biroz egilgan/perspektivali**; 0:03–0:06 scroll bilan oq Audi RS Q8 orqadan, o'ng pastda **narx/spec kartasi** (shisha panel); 0:06–0:10 BMW salon ichi, rul va «677 hp, 3.3s to 60» matni chap pastda.

**Ochilish effekti:** yo'q; asosiy «wow» — **to'liq ekranli kinematik rasm-ketma-ketlik**, scroll bilan bir mashinadan ikkinchisiga *kross-fade + zoom*. Haqiqiy 3D model yo'q, fotografiya (yoki oldindan render qilingan kadrlar).
**Kamera:** sekin zoom-in + yengil parallaks (Ken Burns); tepada «CARVAULT» navbari.
**Materiallar/effektlar:** vignette, kontrastli grading, kartalar glassmorphism; yorug'lik (fonarlar) tabiiy.
**Ranglar (taxminan):** `#0A0A0F`, `#1F4FD8` (ko'k), `#FFFFFF`, `#3AA0FF` (CTA). **Tipografiya:** geometrik sans, kichik caps.
**Texnik baho (taxmin):** scroll-bog'langan **image-sequence** (canvas'da kadrma-kadr) yoki GSAP kross-fade; **past–o'rta** qiyinlik. Android xavfi: **o'rta** (ketma-ketlik hajmi katta bo'lsa — 3–6 MB).
**Taklifnomaga foydasi:** *fotografik* hero (to'yxona/kelin-kuyov surati) uchun **scroll bilan kross-fade + zoom** — 3D modelsiz ham «kino» ta'sirini beradi, mijoz surati bilan ishlaydi (reja 11-savol, 4-band).
**Rejadagi variant:** yangi: **«H. Kinematik foto-hero (scroll cross-fade)»** — past xavfli «low» daraja fallback sifatida ham ishlatiladi.

Kadrlar: `DexuTzTzHz5-1..3.jpg`.

---

## 2. Instagramdagi boshqa online taklifnomalar (6-band)

`#onlinetaklifnoma` sahifasi va undan chiqqan postlar ko'rildi. Hammasi 2D; qisqa jadval:

| Post | Akkaunt | Nima ko'rindi | 3D? |
|---|---|---|---|
| `DXi01a6jN94` | `invitestudio.uz` | «Eng zamonaviy taklifnoma» — telefonda yurak shaklidagi ochilish ekrani; «bitta link: lokatsiya, musiqa, taymer» | Yo'q (2D) |
| `DbsjqiHowTH` | `chorlove.uz` | Telegram'da pushti gulli to'y taklifnomasi, «1 daqiqada yarating: xarita, fotoalbom, tilaklar» | Yo'q |
| `De4pxs3NZfI` | `codeline_uz` | «Xamidjon & Sevaraxon» — milliy naqshli, **ikki uzukli** hero, ganch-stil bezaklar, musiqa tugmasi; kod bilan yonma-yon | Yo'q (CSS/JS animatsiya) |
| `DbS4maotrWp` | `elektron__taklifnomalar` | Video-taklifnoma: «M&S» oltin monogramma, **marmar fon + tilla halqa + gul bargi**, oltin chang zarrachalari | Yo'q (oldindan render qilingan video) |
| hashtag sahifasi | turli | Kvadrat «mehrob/darvoza» ko'rinishli taklifnoma (oltin-shaftoli), «199 ming» narxli reel'lar | Yo'q |

Qo'shimcha: `chorlove.uz` (jonli sayt) ochildi — Next.js, 2 ta `<canvas>`, `THREE/gsap` yo'q, hero'da ikki telefon mockup; statistika «6 552+ taklifnoma». **Bozor xulosasi:** o'zbek raqobatchilarida haqiqiy WebGL 3D ko'rinmadi — ular 2D animatsiya va oldindan render qilingan video bilan cheklanadi. Reja 10-bo'limdagi «raqobatchilarda yo'q» fikri tasdiqlandi (mahalliy bozor uchun).

Kadrlar: `DXi01a6jN94-1.jpg`, `DbsjqiHowTH-1.jpg`, `De4pxs3NZfI-1.jpg`, `DbS4maotrWp-1.jpg`, `chorlove-uz-sayt-1.jpg`, `hashtag-onlinetaklifnoma-1.jpg`.

**Ko'rilgan, lekin chuqur tahlil qilinmagan:** kvadrat «mehrob» taklifnomasi (hashtag sahifasidagi) — B (darvoza) varianti uchun vizual qo'llanma bo'ladi; sahifa kadrlari saqlangan.

---

## 3. Yakuniy xulosa

### 3.1 Umumiy uslub: nima «wow» beradi

1. **Bitta qahramon obyekt + qorong'u fon + ichki yorug'lik** (2-post) — eng kuchli taassurot beradi.
2. **Scroll = kamera** (1, 2, 5-postlar): foydalanuvchi o'zi «tomosha» boshqaradi.
3. **Egri/buklangan sirt** (1-post): oddiy kartalar «3D»ga o'xshab ko'rinadi, modelsiz.
4. **Kinematik foto + sekin zoom** (5-post): 3D modelsiz ham «film» hissi.
5. **Mikro-interaksiya** (3-post): sudrash/ghost kartalar jonlilik beradi.

### 3.2 Eng kuchli 5 effekt (ustuvorlik tartibida)

| # | Effekt | Manba | Belgi |
|---|---|---|---|
| 1 | Hero: oltin/shisha 3D obyekt + ichki yorug'lik + zarrachalar (monogramma/uzuk) | 2-post | **albatta** |
| 2 | Scroll bilan boshqariladigan kamera va sarlavha almashinuvi | 1, 2, 5 | **albatta** |
| 3 | Kinematik foto-hero (kross-fade + sekin zoom) — `low` daraja fallback | 5-post | **albatta** (fallback sifatida) |
| 4 | Egri sirt (curved plane) galereya / cover-flow | 1-post | **keyinroq** |
| 5 | Sudrash/ghost mikro-interaksiyalar (RSVP, kun tartibi) | 3-post | **keyinroq** |

Kerak emas: dashboard UI (3, 4-post) — 3D taklifnomaga bevosita foyda yo'q; faqat skeleton-yuklanish g'oyasi.

### 3.3 Rejaga o'zgartirishlar

**4-bo'lim (ochilish effektlari):**
- A–F **saqlanadi**, lekin postlarda ularning birortasi tasdiqlanmadi — tanlov hali ham reja va bozor mantig'iga (o'zbek auditoriyasi → B darvoza) tayanadi.
- **Qo'shiladi:** `G. Scroll-turntable` (qahramon obyekt aylanadi, sarlavha almashadi) — A–C ning o'rniga emas, ularning *ochilishdan keyingi* hero qismi sifatida.
- **Qo'shiladi:** `H. Kinematik foto-hero` — WebGL'siz «low» daraja uchun va mijozning o'z surati uchun.
- 6-bo'lim «CSS fallback» dagi `CssOpening`ga H ni qo'shish.

**5-bo'lim (ichki animatsiyalar):**
- Galereya qatoriga: «egri sirt (curved plane) + cover-flow» aniqlashtiriladi.
- Yangi qator: **RSVP/kun tartibi — sudrash/ghost mikro-interaksiya** (GSAP `back.out`).
- **Olib tashlash tavsiyasi:** «MeshTransmissionMaterial» ni ommaviy ishlatmaslik — faqat hero'da `high` darajada (2-postdagi shisha materialning Android xavfi).
- Texnik: matn-almashinuvi sarlavhalari uchun `SplitText` allaqachon bor — o'zgarishsiz.

**11-bo'lim (ochiq savollar):** 4-savol («mijoz surati 3D sahnaga tushadimi») — 5-postga ko'ra, **kinematik foto-hero** orqali hal qilinadi, 3D tekstura kerak emas.

### 3.4 Birinchi shablon uchun aniq ssenariy (tavsiya)

Shablon: `toy-konvert-3d` (reja 8-bo'lim, A ochilish) — chunki 3D model faylisiz (procedural), tez prototip.

1. **Poster (0–1.5 s):** bordo + oltin fon, oltin chang CSS spinner. 3D bundle fonda yuklanadi.
2. **Idle:** konvert sekin aylanadi; mum muhr yarqiraydi (rim-light); «Ochish uchun bosing». (Bosish → musiqa.)
3. **Ochilish (3–4 s, GSAP):** kamera yaqinlashadi → muhr bo'laklanib uchadi → qopqoq buklanadi → karta ko'tarilib kameraga uchib keladi, atrofda oltin chang (Bloom faqat `high`da).
4. **Hero (scroll-turntable, G):** karta fon bo'lib sekin aylanadi; ismlar oltin `Text3D`/HTML; scroll qilganda sarlavha almashadi («Sizni taklif qilamiz» → sana → manzil).
5. **Bo'limlar (HTML ustida 3D qatlam):** blessing (`SplitText`) → countdown (flip) → kun tartibi (SVG chiziq chiziladi) → galereya (egri sirt cover-flow, keyinroq) → manzil → RSVP (konfetti) → tilaklar.
6. **Fallback (`low`):** H — kinematik foto-hero + CSS konvert ochilishi.

**Birinchi bosqich bahosi:** A ochilish + hero (G) + RSVP konfetti — taxminan 4–5 ish kuni; qolgan bo'limlar keyingi iteratsiya.

---

## 4. Tekshirilmagan / keyingi qadamlar

- Videolardagi saytlar (1–2, 5-post) manbasi (`THREE`, `gsap`, `.glb`, network) — **havola yo'qligi sababli tekshirilmadi**. Agar muallif «link» deb yuborsa yoki to'g'ridan-to'g'ri demo havola berilsa, qayta tekshirish kerak.
- Ovoz/musiqa — tekshirilmadi.
- GIF fayllar yo'q — kerak bo'lsa, Mac'dagi QuickTime/ekran yozuvi bilan 3–5 soniyali ochilishlarni yozib qo'shish mumkin.
- Postlarni ikki marta boshidan oxirigacha to'liq ko'rish va pauza orqali aniq kadrlar olish — keyingi sessiyada, video pleer boshqaruvi bilan.

---

## 5. Qo'shimcha: haqiqiy 3D taklifnoma referenslari (2-to'plam)

Foydalanuvchi keyinroq yuborgan ikkinchi to'plamda (`docs/referens/Deek-wFvFcs-*`,
`Db-GonDPLq3-*`, `*-cover.jpg`) **aynan 3D taklifnomalar** bor — kerakli uslub shular:

| Post | Akkaunt | Ko'rinish |
|---|---|---|
| `Deek-wFvFcs` | `digital_nameera24` | «This is NOT a normal wedding invitation» — **binafsha shisha plaket**, ichida oltin islomiy mehrob naqshi va ismlar («Syed Irfan & Neha»), atrofida oltin fonarlar, binafsha gullar, sham, bokeh. Caption: *«cinematic 3D Glass Wedding Invitation — created with AI»* (ИИ-контент). |
| `Db-GonDPLq3` | `unique__invites` | «3D Engagement Ceremony Invitation» — atlas mato ustida mis medalyon (Bismillah), oq atirgullar, bordo «Save the Date» kartasi tilla tagliklarda, fonar va marvaridlar. |
| `DQqyObLEwhc` | `undangandigital.mps12` | Pushti gulli «Save the Date», shisha effekt, gulli arka. |
| `DeAOrMyoeeb` | `sidra_invitation` | Oq atlas lenta/bant, gulli zal (AI-generatsiya). |
| `DfPiu7suvZ8` | `online_taklifnomalarrrr` | Fotiha to'yi — yashil fon, oltin yozuv («Crescent» shabloni, 149 000). |

**Xulosa:** bu postlarning hammasi **AI'da render qilingan video** — ism/sana/rang
dinamik emas, har bir buyurtma uchun alohida video yasaladi. Bizning yondashuv:
shu sahnani **three.js'da real vaqtda** qurish, shunda ism, sana va palitra
buyurtmadan avtomatik olinadi va mehmon sahnani o'zi «ochadi».

Natija — `nikoh-kristall-3d` shabloni (baza: `templates-src/cinematic-3d`):
`docs/referens/natija-kristall-*.jpg`.
