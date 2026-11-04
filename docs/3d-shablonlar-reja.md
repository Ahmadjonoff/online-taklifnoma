# 4-shablon oilasi: «Cinematic 3D» — rejalashtirish hujjati

> Holat: **2-bosqich bajarildi** — umumiy 3D dvigatel (`templates-src/core/cinema`)
> va 6 ta 3D shablon (12–13-bo'limlar). Sana: 2026-11-04.
>
> **Muhim eslatma:** foydalanuvchi yuborgan 5 ta Instagram post
> (`DexTHhNTeh0`, `DfPhwy_zHog`, `DfRznLZPt8Q`, `Dewo9q0zUIx`, `DexuTzTzHz5`)
> bu sessiyadan ochilmadi: `instagram.com` muhit tarmoq siyosatida bloklangan,
> qidiruv tizimlari esa Instagram post ichini indekslamaydi. Shuning uchun
> quyidagi effektlar ro'yxati 2025–2026 yillardagi umumiy «3D taklifnoma»
> trendlariga asoslangan. Postlar ko'rilgach, **5-bo'limdagi** effektlar
> ro'yxati ularga moslab qayta tartiblanadi (qaysi biri «asosiy», qaysi biri
> «keyinroq»).

---

## 1. Hozirgi arxitektura (qisqacha)

| Narsa | Joyi | 3D oilaga ta'siri |
|---|---|---|
| Baza dizaynlar | `templates-src/{luxe-vow,watercolor-garden,noir-gradient}` | 4-baza shu qatorga qo'shiladi: `templates-src/cinematic-3d` |
| Generator | `scripts/generate-taklif-templates.mjs` (`base:` maydoni, `fs.cpSync(baseDir, …)`) | Yangi baza nomini qo'llab-quvvatlaydi, alohida o'zgartirish deyarli kerak emas |
| Reja (katalog) | `scripts/templates-plan-taklif.json` | 3D shablonlar shu yerga yoziladi |
| Build | `scripts/build-templates.sh` → `BASES="…"` | `cinematic-3d` ni `BASES` ga qo'shish shart (aks holda bazaning o'zi ham build qilinadi) |
| Vite | `scripts/vite.template.config.ts` | Har shablon alohida bundle → `three` faqat 3D shablonlarga yuklanadi, qolgan 77 ta shablon og'irlashmaydi ✅ |
| Kontent | `window.__INV_CONFIG__` + `templates-src/config-shim.ts` | O'zgarmaydi: 3D sahna ism, sana, ranglarni shu config'dan o'qiydi |
| Ranglar | `src/lib/palettes.ts` — `--color-paper`, `--color-gold`, `--color-wine` | 3D materiallar shu CSS o'zgaruvchilarni `getComputedStyle` orqali o'qiydi → mijoz tanlagan rang 3D'da ham ishlaydi |
| Umumiy bo'limlar | `templates-src/core/components/*`, `core/taklif/sections.tsx` | RSVP, Wishes, Venue, Gift… qayta ishlatiladi, faqat ustiga 3D/scroll animatsiya qatlami qo'shiladi |
| Tariflar | `src/lib/pricing.ts` (`standard / premium / luxury`) | 3D = Luxury (yoki yangi «Signature» tarifi — 8-bo'lim) |

**Xulosa:** platforma qismi (buyurtma, to'lov, `/e/[slug]`, RSVP) deyarli
o'zgarmaydi. Asosiy ish — yangi baza shablon va undagi 3D sahna.

---

## 2. Texnologiya tanlovi

| Vazifa | Tanlov | Nega |
|---|---|---|
| 3D render | **three.js** + **@react-three/fiber** (R3F) | Shablonlar React'da; R3F deklarativ, React 19 bilan mos |
| Yordamchilar | **@react-three/drei** (`Text`/`Text3D`, `Environment`, `Float`, `Sparkles`, `useGLTF`, `MeshTransmissionMaterial`) | Tayyor material/yorug'lik/matn — vaqtni tejaydi |
| Animatsiya vaqt chizig'i | **GSAP** (+ `ScrollTrigger`, `SplitText`) | Ochilish «kino»si va scroll'ga bog'langan animatsiya uchun eng ishonchli; 2025-yildan barcha plaginlari bepul |
| Silliq scroll | **Lenis** | Scroll'ga bog'langan kamera harakati titramasligi uchun |
| Post-effektlar | **@react-three/postprocessing** (Bloom, Vignette, DOF) — faqat kuchli qurilmalarda | «Tilla nur» va kino effekti |
| 3D modellar | `.glb` (Blender'da yasaladi yoki CC0 manbalardan) → **gltf-transform** bilan Meshopt + KTX2 siqish | Hajm 5–10 barobar kichrayadi |
| Matn (ismlar) | drei `Text` (troika) + o'zbek lotin/kirill harflari bor TTF/WOFF | `o‘`, `g‘`, `ў`, `қ` to'g'ri chiqishi shart — har bir shriftni tekshirish kerak |

**Rad etilgan variantlar:**
- *Spline* — tez prototip, lekin runtime ~1 MB+, ism/sanani dinamik
  almashtirish va rang palitrasini boshqarish qiyin.
- *Faqat CSS 3D* — fallback sifatida ishlatiladi (6-bo'lim), lekin «wow»
  darajasi uchun yetarli emas (yorug'lik, aks, zarrachalar yo'q).
- *Oldindan render qilingan video* — eng chiroyli, lekin ism/sana/rang
  dinamik bo'lmaydi va hajmi katta. Faqat katalog preview'i uchun ishlatiladi.

---

## 3. Mehmon ko'radigan oqim (UX ssenariy)

```
[0] Yuklanish (0–1.5 s)
    Poster rasm (CSS) + «oltin chang» spinner. 3D bundle fonda yuklanadi.
        ↓
[1] Kutish sahnasi (idle)
    3D obyekt (konvert / darvoza / quti) sekin «nafas oladi», yorug'lik
    yuzasida aylanadi, telefon egilganda (gyro) yoki barmoq bilan
    parallaks. «Ochish uchun bosing» yozuvi miltillaydi.
        ↓  (bosish → musiqa shu yerda yoqiladi — brauzer talabi)
[2] Ochilish kinosi (2.5–4 s, GSAP timeline)
    Kamera yaqinlashadi → obyekt ochiladi → ichidan karta chiqadi →
    karta kameraga uchib keladi va butun ekranni egallaydi.
        ↓
[3] Hero (3D fon + HTML matn)
    Ismlar 3D/oltin matnda, atrofida zarrachalar, sekin aylanuvchi obyekt.
        ↓  (scroll)
[4] Bo'limlar — HTML (o'qilishi va SEO uchun), ustida scroll'ga bog'langan
    3D/2.5D animatsiyalar. Orqa fonda bitta yengil 3D sahna davom etadi.
        ↓
[5] RSVP yuborilganda — konfetti/oltin zarracha portlashi.
```

**Qoida:** matnlar (sana, manzil, RSVP forma) doim **HTML**da qoladi —
3D faqat bezak va kino. Shu sababli kirish imkoniyati, tarjima skripti va
mavjud `core` komponentlari ishlayveradi.

---

## 4. Ochilish effektlari (variantlar)

Bitta baza ichida bir nechta ochilish turi bo'ladi; generator rejasida
`"opening": "envelope3d"` kabi maydon bilan tanlanadi. Birinchi bosqichda
**2 tasi**, keyin qolganlari.

| # | Nomi | Tavsif | Murakkablik | Mos tadbir |
|---|---|---|---|---|
| A | **3D konvert + sinadigan mum muhr** | Konvert havoda aylanib turadi; bosilganda muhr bo'laklarga bo'linib uchadi (shard + fizika illyuziyasi), qopqoq 3D bukiladi, ichidan karta ko'tarilib kameraga uchadi. Atrofda oltin chang (Bloom). | O'rta | Hammasi |
| B | **Saroy darvozasi / ganch naqshli eshik** | Ikki tavaqali naqshli eshik (o'zbek ganch/yog'och o'ymakorligi), ochilganda ichkaridan hajmli nur (god rays) va gulbarglar uchib chiqadi, kamera ichkariga «kiradi». O'zbek auditoriyasi uchun eng o'ziga xos. | O'rta–yuqori | Nikoh, to'y, sunnat |
| C | **Uzuk qutichasi** | Baxmal quti qopqog'i ochiladi, ichida aylanuvchi olmos uzuk (refraksiya materiali), uzukdan nur chaqnab sahna oqaradi. | O'rta | Nikoh, fotiha, unashtiruv |
| D | **Kitob / albom** | Muqovasi oltin harfli kitob ochiladi, sahifalar 3D varaqlanadi (page-curl shader), oxirgi sahifa taklifnomaga aylanadi. | Yuqori | Yubiley, «bizning hikoyamiz» |
| E | **Parda (mato simulyatsiyasi)** | Sahna pardasi shamolda tebranib, ikki tomonga ochiladi; orqasida yorug'lik ostidagi ismlar. | Yuqori | Tug'ilgan kun, biznes, bazmlar |
| F | **Kosmik / yulduzli osmon** | Zarrachalar galaktikasi ismlar shakliga yig'iladi (particle morph). | O'rta | Noir uslubi, yoshlar, biznes |

**Tavsiya:** 1-bosqichda **A (konvert)** va **B (darvoza)** — biri universal,
ikkinchisi milliy va raqobatchilarda yo'q.

---

## 5. Ichki animatsiyalar (bo'limlar bo'yicha)

| Bo'lim | Effekt |
|---|---|
| Hero | 3D oltin monogramma (kelin-kuyov bosh harflari, `Text3D`, metall material + environment map), `Float` bilan suzish, atrofida `Sparkles`. Telefon egilganda parallaks (DeviceOrientation, iOS ruxsat so'rovi bilan). |
| Blessing / duo | `SplitText` — har bir so'z pastdan yorug'lik bilan chiqadi; orqada sekin aylanuvchi 3D islomiy geometrik naqsh (yulduz, girix). |
| Countdown | 3D «flip-clock» — raqam kartochkalari haqiqiy aylanib almashadi. |
| Calendar | Oy jadvali 3D qog'ozdek tushadi, tadbir kunida 3D yurak/uzuk «urib» turadi. |
| Kun tartibi (timeline) | Scroll bilan chiziq «chiziladi» (SVG stroke), har bir nuqtada kichik 3D ikonka (uzuk, qadah, musiqa) aylanib paydo bo'ladi. |
| Venue | 3D xarita pin + bino siluetiga kamera «uchib boradi», keyin Google/Yandex tugmalari. |
| Galereya | 3D cover-flow / egilgan karusel (WebGL tekisliklarda surat, scroll bilan to'lqinlanish shader'i). |
| Story («Bizning hikoyamiz») | Suratlar polaroid kabi 3D stolga tushadi, scroll bilan birma-bir ko'tariladi. |
| Dress-kod | Rang namunalari 3D mato bo'laklari bo'lib hilpiraydi. |
| RSVP | Yuborilganda oltin konfetti portlashi + «Rahmat» matni 3D'da yig'iladi. |
| Gift | Karta 3D aylanib (flip) raqam ko'rinadi. |
| Butun sahifa | Orqa fonda bitta doimiy, yengil 3D qatlam: sekin tushayotgan 3D gulbarglar (InstancedMesh, 60–120 dona), scroll'ga qarab kamera siljiydi; bo'limlar orasida «yorug'lik o'tishi». |

---

## 6. Ishlash (performance) — eng katta xavf

Mehmonlarning ko'pchiligi taklifnomani **Telegram ichki brauzerida, o'rta
darajali Android**da ochadi. «Wow» effekt sekin telefonda qotib qolsa — teskari
natija beradi. Shuning uchun:

1. **3 darajali sifat** (birinchi kadrda aniqlanadi: `navigator.hardwareConcurrency`,
   `deviceMemory`, WebGL renderer nomi, birinchi 30 kadr FPS):
   - `high` — post-effektlar, DPR ≤ 2, ko'p zarracha;
   - `medium` — Bloom yo'q, DPR ≤ 1.5, zarrachalar yarmi;
   - `low` / WebGL yo'q / `prefers-reduced-motion` — **CSS 3D fallback**
     (hozirgi `Envelope` uslubidagi animatsiya, `transform-style: preserve-3d`).
2. **Hajm byudjeti** (gzip): ochilish uchun JS ≤ 350 KB, modellar+teksturalar
   ≤ 1.2 MB, HDRI ≤ 150 KB (1k, yoki drei `Environment` preset o'rniga
   o'zimizning kichik `.hdr`). Musiqa alohida, keyin yuklanadi.
3. **Lazy loading:** avval poster rasm → `three` bundle dinamik `import()` →
   sahna tayyor bo'lgach poster so'nadi.
4. Ochilishdan keyin og'ir sahna **dispose** qilinadi; orqa fon sahnasi
   `frameloop="demand"` bilan faqat scroll paytida render qiladi; sahifa
   yashirilganda (`visibilitychange`) render to'xtaydi.
5. iOS Safari'da WebGL context yo'qolishini (`webglcontextlost`) ushlab,
   fallback'ga o'tish.
6. Maqsad: o'rta Android'da ochilish ≥ 45 FPS, hero'da ≥ 50 FPS,
   LCP ≤ 2.5 s (poster rasm hisobiga).

---

## 7. Fayl tuzilmasi (taklif)

```
templates-src/cinematic-3d/
  index.html
  src/
    App.tsx                 # mavjud bazalar kabi: sectionList() + Opening + Scene
    config-default.ts
    config.ts               # config-shim orqali
    index.css               # @source '../../core';  (majburiy!)
    three/
      quality.ts            # qurilma darajasini aniqlash
      palette.ts            # CSS var → THREE.Color
      Stage.tsx             # <Canvas>, kamera, yorug'lik, environment
      openings/
        EnvelopeOpening.tsx # A
        GateOpening.tsx     # B
        index.ts            # config.opening bo'yicha tanlash
      hero/Monogram.tsx
      fx/{GoldDust,Petals3D,Confetti}.tsx
    sections/               # core bo'limlar ustidagi animatsiya o'ramlari
    fallback/CssOpening.tsx # WebGL'siz variant
  public/models/*.glb       # siqilgan modellar
templates-src/core/motion/  # GSAP/Lenis yordamchilari (keyin boshqa oilalar ham ishlatishi mumkin)
```

O'zgaradigan mavjud fayllar:
- `scripts/build-templates.sh` — `BASES` ga `cinematic-3d`;
- `scripts/generate-taklif-templates.mjs` — yangi baza uchun palitra/typo,
  `opening` maydonini `config-default.ts` ga yozish;
- `scripts/templates-plan-taklif.json` — yangi shablonlar;
- `src/lib/templatePalettes.json` — 3D shablonlar palitralari;
- `package.json` — `three`, `@react-three/fiber`, `@react-three/drei`,
  `gsap`, `lenis`, (ixtiyoriy) `@react-three/postprocessing` → `devDependencies`
  (faqat shablon build'ida kerak, Next.js ilovasiga kirmaydi);
- `scripts/generate-thumbs.mjs` — 3D uchun statik rasm + qisqa `.webm`/`.mp4`
  preview (katalog kartasida hover/autoplay);
- `src/components/site/TemplateCard.tsx` — video preview va «3D» belgisi.

---

## 8. Katalog va biznes tomoni

- **Yangi shablonlar (1-to'lqin, 4 ta):**
  | slug | Ochilish | Palitra | Tadbir |
  |---|---|---|---|
  | `nikoh-saroy-3d` | B darvoza | fil suyagi + oltin | Nikoh / to'y |
  | `toy-konvert-3d` | A konvert | bordo + oltin | To'y, universal |
  | `nikoh-uzuk-3d` | C uzuk qutisi | oq + kumush | Fotiha, nikoh |
  | `tun-yulduz-3d` | F yulduzlar | qora + oltin | Tug'ilgan kun, biznes |
- **Narx:** hozirgi Luxury 249 000. 3D uchun ikki yo'l:
  1. Luxury ichida (narx 279–299 000) — `tierOf` o'zgarmaydi;
  2. Yangi «Signature 3D» tarifi (masalan 349 000) — `Tier` turiga yangi
     qiymat, `tierFeatures`, `TIER_PRICE`, forma va testlarni yangilash kerak.
  Tavsiya: avval **1-yo'l** (tez), talab bo'lsa keyin 2-yo'l.
- Katalogda **«3D» filtri/belgisi** va hover'da video preview.
- Jonli preview (buyurtma formasi) — iframe ichida sahna har tahrirda qayta
  yaratilmasligi kerak: config o'zgarsa faqat matn/rang yangilanadi.

---

## 9. Bosqichlar va taxminiy muddat

| Bosqich | Ish | Muddat |
|---|---|---|
| 0. Referens | Instagram postlarini ko'rish, 3–5 ta «albatta bo'lsin» effektini tanlash, moodboard | 0.5 kun |
| 1. Prototip | `cinematic-3d` baza, `<Canvas>` + sifat darajalari + CSS fallback, **A konvert** ochilishi (procedural geometriya, model'siz) | 3–4 kun |
| 2. Real qurilma testi | Telegram (iOS/Android), Instagram in-app, Safari, Chrome; FPS va hajm o'lchash; kerak bo'lsa soddalashtirish | 1 kun |
| 3. Modellar | Darvoza (ganch naqsh), uzuk qutisi — Blender'da yoki CC0 asosida, gltf-transform bilan siqish | 3–5 kun |
| 4. Ichki animatsiyalar | Hero monogramma, gulbarglar, countdown flip, timeline, galereya, RSVP konfetti | 4–6 kun |
| 5. Platformaga ulash | generator, reja JSON, palitralar, build skriptlari, thumbs/video, katalog belgisi, narx | 2 kun |
| 6. Sifat | Playwright smoke testi (WebGL SwiftShader bilan ochilish ishlashini tekshirish), typecheck/lint/test, Lighthouse | 1–2 kun |
| **Jami** | | **~15–20 ish kuni** (birinchi 4 shablon) |

---

## 10. Referens manbalar (Google qidiruvi)

- Konvert + parda + scroll xoreografiyali taklifnoma (statik HTML/JS) —
  oqim uchun namuna: https://github.com/samskruthilava-comp/wedding-invitationamogh
- Scroll'ga bog'langan 3D kamera (Apple uslubi) — waypoint'lar orqali
  interpolyatsiya: https://www.builder.io/blog/webgl-scroll-animation
- R3F + GSAP bilan 3D «buklanish» effekti (konvert qopqog'i / kitob sahifasi
  uchun moslashtirsa bo'ladi): https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/
- three.js scroll demo: https://github.com/fireship-io/threejs-scroll-animation-demo
- Raqobatchilar: animatsiyali konvert + mum muhr — bozorda standart
  (Greenvelope, The Digital Yes). Ya'ni oddiy konvert yetarli emas, **3D
  darvoza / uzuk qutisi / zarrachalar** kabi farqlovchi effektlar kerak:
  https://card.greenvelope.com/resources/animated-envelope-invitations ,
  https://www.thedigitalyes.com/blog/animated-wedding-invitation

---

## 11. Ochiq savollar (qaror kerak)

1. Instagram postlaridagi qaysi effekt eng muhim? (ochilish turi, kamera
   harakati, zarrachalar, video fon?)
2. 3D shablonlar alohida tarif bo'ladimi yoki Luxury ichidami?
3. 3D modellarni o'zimiz Blender'da yasaymizmi yoki dizaynerga buyurtma
   beramizmi (ganch darvoza — eng muhim model)?
4. Mijozning o'z surati 3D sahnaga tushadimi (masalan, ochilgan kartada yoki
   galereyada)? — tarif va hajmga ta'sir qiladi.

---

## 12. Bajarilgan ish (1-bosqich)

Referenslar tahlili: `docs/instagram-referens-tahlil.md` (5-bo'lim — haqiqiy
3D taklifnoma referenslari). Tanlangan uslub: **binafsha shisha mehrob +
oltin naqsh + fonarlar** (`digital_nameera24` posti).

**Texnologiya (rejadan farqi):** R3F/drei o'rniga to'g'ridan-to'g'ri
`three` + `gsap` — kamroq bog'liqlik, kichikroq bundle, kino ssenariysini
to'liq boshqarish. 3D chunk ≈ 187 KB gzip (dinamik `import()`), asosiy JS ≈ 77 KB.

| Fayl | Vazifa |
|---|---|
| `templates-src/cinematic-3d/src/three/scene.ts` | Sahna: shisha mehrob plaket (ExtrudeGeometry), tilla poydevor, fonarlar (Lathe + teshikli alphaMap), shamlar, 2.5D gortenziyalar, gulbarglar (InstancedMesh), bokeh va oltin chang (shader), shisha ustidan nur chizig'i, bloom; `intro()` va `open()` GSAP timeline'lari |
| `.../three/textures.ts` | Canvas teksturalar: plaketdagi ismlar/sana/hoshiya, girih panjara, saroy devori, gullar, alanga |
| `.../three/quality.ts` | `high` / `medium` / `off` aniqlash; `?q=` bilan qo'lda tanlash |
| `.../three/content.ts` | Palitrani CSS o'zgaruvchilardan o'qish, config'dan matn, shriftlarni kutish |
| `.../components/CinematicOpening.tsx` | Poster → intro → «Ochish uchun bosing» → ochilish kinosi → chaqnash → taklifnoma; WebGL bo'lmasa CSS konvert |

**Muhim qarorlar:**
- Shisha refraksiyasi (`transmission`) sinab ko'rildi — qorong'i va «sutdek»
  chiqdi. Shaffof fizik material referensga yaqinroq va arzonroq → hamma
  darajada shu ishlatiladi. `high` faqat bloom va ko'proq zarracha qo'shadi.
- Dastlabki ~2 soniyada sekin kadrlar ko'p bo'lsa, `high` → `medium` ga
  avtomatik tushadi (bloom o'chadi, DPR 1.25).
- Ranglar `:root` CSS o'zgaruvchilaridan → mijoz tanlagan palitra 3D'ga ham
  tushadi (Ametist / Zumrad / Shafaq — `src/lib/templatePalettes.json`).

**Ro'yxatdan o'tkazildi:** `scripts/templates-plan-taklif.json` (Luxury,
249 000), `src/lib/templatePalettes.json`, `scripts/build-templates.sh`
(`BASES` ga `cinematic-3d`). Generator (`generate-taklif-templates.mjs`)
ga qo'shilmadi — u plan JSON'ni `tier`/`categories`'siz qayta yozadi, bu
mavjud muammo, alohida hal qilish kerak.

**Keyingi qadamlar:**
1. Haqiqiy qurilmalarda (Telegram iOS/Android) FPS tekshiruvi.
2. Production bazada `npm run db:seed` (yangi shablon katalogga chiqishi uchun)
   va `npm run thumbs` (katalog rasmi).
3. Ichki bo'limlar uchun 3D/scroll animatsiyalar (5-bo'lim) — hozir ochilishdan
   keyin `noir-gradient` bo'limlari ishlatiladi.
4. Ikkinchi shablon: «Save the Date» / mis medalyon (`unique__invites` uslubi).

---

## 13. 2-bosqich: 3D shablonlar oilasi (6 ta)

3D dvigatel shablon ichidan **`templates-src/core/cinema/`** ga ko'chirildi —
endi har qanday baza uni ishlatadi, shablon esa faqat `config.scene3d` ni beradi:

```ts
scene3d: {
  hero: 'mehrab' | 'arch' | 'medallion' | 'card' | 'giftbox',
  mood: 'night' | 'day',
  lanterns, candles, flowers: 'hydrangea' | 'rose' | 'none',
  moon, floralArch, drape, pearls,
  arabic,    // medalyon yozuvi
  headline,  // karta sarlavhasi («Save the Date»)
}
```

| Fayl | Vazifa |
|---|---|
| `core/cinema/scene.ts` | Dvigatel: renderer, yorug'lik (tun/kunduz), pol/devor, bokeh, oltin chang, gulbarglar, bloom, kamera, intro/ochilish kinosi, `compileAsync` |
| `core/cinema/heroes.ts` | Markaziy obyektlar va ularning o'z ochilish harakati (medalyon aylanadi, karta egiladi, quti bandi uchib qopqog'i ochiladi) |
| `core/cinema/decor.ts` | Fonarlar, shamlar, gortenziya/atirgul, gulli arka, hilol, marvaridlar |
| `core/cinema/textures.ts` | Canvas teksturalar: plaket, medalyon (Amiri bilan arabcha yozuv), baxmal karta, quti yuzasi, atirgul, atlas mato, hilol |
| `core/cinema/content.ts` | `config.scene3d`, palitra (CSS o'zgaruvchilar → hex, `color-mix` ham), matn, shriftlar |
| `core/cinema/CinematicOpening.tsx` | Poster → intro → «Ochish uchun bosing» → kino → chaqnash; `fallback` — shablonning CSS konverti |

| Shablon | Baza (ichki dizayn) | 3D sahna | Kayfiyat | Palitralar |
|---|---|---|---|---|
| `nikoh-kristall-3d` | cinematic-3d (noir) | binafsha shisha mehrob, fonarlar, gortenziya | tun | Ametist, Zumrad, Shafaq |
| `fotiha-hilol-3d` | cinematic-3d (noir) | zumrad shisha mehrob, **hilol va yulduzlar**, oq atirgul | tun | Zumrad, Tungi moviy |
| `toy-bordo-3d` | cinematic-3d (noir) | molbertdagi **bordo baxmal «Save the Date» kartasi** | tun | Bordo, Qora oltin |
| `nikoh-medalyon-3d` | luxe-vow | molbertdagi **bronza medalyon + Bismillah**, atlas mato, marvarid | tun (iliq) | Bronza, Kumush |
| `toy-sovga-3d` | luxe-vow | **lentali sovg'a qutisi** — bant uchadi, qopqoq ochiladi, ichidan nur | kunduz | Pushti lenta, Oltin lenta |
| `qiz-bazmi-gulbog-3d` | watercolor-garden | yarim doira pushti shisha arka, **gulli arka** | kunduz | Atirgul, Lavanda |

Hammasi Luxury (249 000), `scripts/templates-plan-taklif.json` va
`src/lib/templatePalettes.json` da ro'yxatdan o'tgan.

**Topilgan va tuzatilgan muammolar:**
- Mijoz fon rangini tanlasa server `--tpl-grad-b`, `--color-blush` ga
  `color-mix(...)` yozadi — avval 3D sahna bu qiymatni o'qiy olmay qora
  bo'lib qolardi. Endi rang brauzerda hisoblanadi (1×1 canvas), sahna uchun
  esa alohida `--tpl-scene-a/b`, `--tpl-glass`, `--tpl-satin` o'zgaruvchilari bor.
- Kunduzgi sahnada metall folga oq atrofni aks ettirib yozuvni o'chirib
  yuborardi → kunduzda folga mat, «bo'rtma» soyasiz.
- Shader kompilyatsiyasi kuchsiz qurilmada asosiy oqimni band qilishi
  mumkin → `renderer.compileAsync` (KHR_parallel_shader_compile), poster shu
  vaqtgacha ko'rinadi.

Natijalar: `docs/referens/natija-*.jpg`.
