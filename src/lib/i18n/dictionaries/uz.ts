/**
 * Manba lug'at — o'zbekcha (lotin).
 *
 * Bu fayl yagona "haqiqat manbai": kirill (`uzc`) shundan avtomatik
 * transliteratsiya qilinadi (@/lib/i18n/cyrillic). Rus va ingliz lug'atlari
 * (`ru.ts`, `en.ts`) xuddi shu shakl (shape)ni takrorlashi SHART — bittasiga
 * kalit qo'shsangiz, ikkalasiga ham qo'shing (TypeScript buni typecheck
 * paytida tekshiradi, @/lib/i18n/dictionary).
 */
export const uz = {
  common: {
    brand: "Online taklifnomalar",
    telegramLabel: "@Abdurauf_Ahmadjonov",
    priceShort: "Kelishuv asosida",
    priceNote:
      "Narx — kelishuv asosida. Tadbir turi, bo'limlar soni va muddatga qarab operator bilan kelishiladi.",
    tierPremium: "Premium",
    tierStandard: "Standart",
    telegramGenericMsg: "Assalomu alaykum! Taklifnoma bo'yicha maslahat olmoqchi edim.",
    telegramQuestionMsg: "Assalomu alaykum! Taklifnoma bo'yicha savolim bor edi.",
    telegramTemplateMsg: "Assalomu alaykum! «{name}» shabloni bo'yicha ma'lumot olmoqchi edim.",
    telegramOrderMsg: "Assalomu alaykum! «{name}» shabloni bo'yicha taklifnoma kerak edi.",
    homeLink: "Bosh sahifa",
    templatesLink: "Shablonlar",
  },

  nav: {
    templates: "Shablonlar",
    features: "Xususiyatlar",
    howItWorks: "Qanday ishlaydi",
    pricing: "Narxlar",
    faq: "Savollar",
    telegram: "Telegram",
    chooseTemplate: "Shablon tanlash",
    menu: "Menyu",
  },

  footer: {
    tagline:
      "To'y, nikoh, sunnat to'yi va boshqa tantanalar uchun jonli online taklifnomalar — bir havola, cheksiz mehmon.",
    priceLine: "Narx — kelishuv asosida.",
    customDesignLine: "Faqat shablon emas — mijoz xohlagan dizaynda ham tayyorlab beramiz.",
    eventTypesTitle: "Tadbir turlari",
    pagesTitle: "Sahifalar",
    templatesCatalog: "Shablonlar katalogi",
    pricing: "Narxlar",
    howItWorks: "Qanday ishlaydi",
    faq: "Ko'p so'raladigan savollar",
    contactTitle: "Aloqa",
    telegramContact: "Telegram: {label}",
    orderLink: "Buyurtma qoldirish",
    orderHint: "Buyurtma qoldiring — operator o'zi yozadi va narxni kelishamiz.",
    manageTitle: "Boshqaruv",
    adminPanel: "Admin panel",
    adminResponses: "RSVP va tilaklar",
    orderSubmit: "Buyurtma berish",
    copyright: "© {year} Online taklifnomalar — barcha huquqlar himoyalangan.",
    quote: "«Eng chiroyli taklifnomalar — bir tugma bilan»",
  },

  home: {
    badge: "{total} ta premium shablon · RSVP · QR kod",
    heroTitle: "Tadbiringiz uchun {highlight} raqamli taklifnoma",
    heroTitleHighlight: "esda qoladigan",
    heroText:
      "Konvert bilan ochiladigan jonli taklifnomalar. Shablonni tanlang — mehmonlaringizga havola yoki QR kod yuboring, javoblarni bir joydan kuzatib boring.",
    ctaViewTemplates: "Shablonlarni ko'rish",
    ctaHowItWorks: "Qanday ishlaydi?",
    statTemplates: "shablon",
    statEventTypes: "tadbir turi",
    statFast: "5 daq",
    statFastLabel: "ichida tayyor",
    liveSampleLabel: "Jonli namuna",
    liveSampleView: "Ko'rish",

    templatesTag: "Tanlangan",
    templatesTitle: "Ommabop shablonlar",
    templatesText: "Har bir shablon jonli namuna bilan ko'rsatilgan — konvertni bosib ochib, animatsiyalarni ko'ring.",
    templatesAll: "Barcha {total} shablon →",

    compareTag: "Nega aynan taklifnoma?",
    compareTitle: "To'yingiz alohida taassurotga loyiq",
    compareText:
      "Mehmonlar ilgari ko'rmagan taklifnomani olganda yuzidagi hayratni tasavvur qiling. Bu oddiy taklifnoma emas — to'yingizning ilk sehrli lahzasi.",
    compareOldTitle: "An'anaviy taklifnoma",
    compareOld: [
      "Javonda unutilib qoladi",
      "Hammasi bir xil, shaxsiylik yo'q",
      "Faqat qog'oz — hissiyot yo'q",
      "Kim kelishini bilish qiyin",
      "Bosma va yetkazish xarajati",
    ],
    compareNewTitle: "Online taklifnomalar bilan",
    compareNew: [
      "Mehmon yodida qoladigan tajriba",
      "Nom, sana va manzilga mos noyob dizayn",
      "Musiqa, animatsiya va jonli tafsilotlar",
      "Barcha RSVP javoblari bitta panelda",
      "Bir zumda yetadi, yashirin xarajat yo'q",
    ],

    featuresTag: "Imkoniyatlar",
    featuresTitle: "Mukammal to'y uchun barcha imkoniyatlar",
    featuresText: "Mehmonlarni taklif qilishdan xotiralarni ulashishgacha — hammasi bitta havolada.",
    features: [
      {
        icon: "✉️",
        title: "Konvert bilan ochilish",
        text: "Mehmon havolani ochganda konvert va mum muhr paydo bo'ladi — taklifnoma bir harakat bilan «ochiladi».",
      },
      {
        icon: "✅",
        title: "RSVP boshqaruvi",
        text: "Mehmon kelish-kelmasligini, mehmonlar sonini va izohini bildiradi. Barcha javoblar bitta panelda.",
      },
      {
        icon: "💌",
        title: "Tilaklar daftari",
        text: "Mehmonlar tilak qoldiradi va bir-birining xatolarini o'qiydi — to'y xotirasiga aylanadi.",
      },
      {
        icon: "📲",
        title: "QR kod va ulashish",
        text: "Shaxsiy havola va QR kod: Telegram, WhatsApp orqali bir bosishda yuboriladi.",
      },
      {
        icon: "🗺️",
        title: "Xarita va manzil",
        text: "To'yxona manzili Google va Yandex xaritalariga ulangan — mehmon yo'lni oson topadi.",
      },
      {
        icon: "🎼",
        title: "Musiqa va animatsiya",
        text: "Fon musiqasi, gulbarglar va mayin o'tishlar — taklifnoma jonli taassurot qoldiradi.",
      },
    ],

    stepsTag: "4 qadam",
    stepsTitle: "Qanday ishlaydi?",
    steps: [
      {
        n: "01",
        title: "Shablon tanlang",
        text: "Ko'plab shablon ichidan tadbiringizga mosini tanlang — har birini jonli ko'rish mumkin.",
      },
      {
        n: "02",
        title: "Ma'lumot kiriting",
        text: "Ismlar, sana, manzil va dasturni yozing — preview darhol yangilanadi.",
      },
      {
        n: "03",
        title: "Telegram orqali kelishamiz",
        text: "Onlayn to'lov yo'q: operator yozadi, narxni va tafsilotlarni kelishamiz.",
      },
      {
        n: "04",
        title: "Havolani ulashing",
        text: "QR kod yoki havolani mehmonlarga yuboring va javoblarni kuzatib boring.",
      },
    ],

    pricingTag: "To'plamlar",
    pricingTitle: "Narx kelishuv asosida",
    pricingText:
      "Bizda qat'iy narx yo'q: to'plamni ko'ring, buyurtma qoldiring — operator Telegram orqali bog'lanib, ishlar hajmi va byudjetga qarab narxni kelishadi. Yashirin to'lovlar yo'q.",
    plans: [
      {
        key: "standard",
        name: "Standart",
        badge: "",
        text: "Kichik va samimiy tadbirlar uchun.",
        items: [
          "Jonli taklifnoma (konvert bilan)",
          "Countdown va tadbir dasturi",
          "Xarita va manzil havolalari",
          "RSVP — mehmonlar javoblari",
          "Shaxsiy havola + QR kod",
        ],
      },
      {
        key: "premium",
        name: "Premium",
        badge: "Eng ommabop",
        text: "To'y va yubileylar uchun to'liq to'plam.",
        items: [
          "Barcha Standart imkoniyatlar",
          "Tilaklar daftari va galereya",
          "Fon musiqasi va gulbarg animatsiyasi",
          "Kiyim uslubi va sovg'a bo'limlari",
          "Maxsus mehmonlar bloki",
        ],
      },
      {
        key: "deluxe",
        name: "Deluxe",
        badge: "",
        text: "Hashamatli va ko'p bosqichli tantanalar uchun.",
        items: [
          "Barcha Premium imkoniyatlar",
          "Ko'p tadbirli dastur (2+ marosim)",
          "Oylik kalendar va tafsilotlar",
          "Shaxsiy brending va ustuvor yordam",
          "Cheksiz mehmon va javoblar",
        ],
      },
    ],
    plansCtaButton: "Shablonlarni ko'rish",
    pricingFooterNote: "{total} ta shablondan {premium} tasi {tier} darajaga ega — narx baribir kelishuv asosida belgilanadi.",
    customDesignText: "Tayyor shablon yoqmadimi? Muammo emas — mijoz xohlagan dizaynda, alohida taklifnomani ham tayyorlab beramiz.",
    customDesignCta: "Buyurtma berish",
    customDesignTelegramMsg: "Assalomu alaykum! Menga alohida (shablonsiz) taklifnoma kerak edi.",

    faqTag: "Savollar",
    faqTitle: "Ko'p so'raladigan savollar",

    ctaTag: "Bir havola — butun tantana",
    ctaTitle: "To'yingiz uchun mukammal taklifnomani yarating",
    ctaText:
      "Shablon tanlang, ma'lumotlarni kiriting va havolani mehmonlarga yuboring — qolganini biz bajaramiz. Narx kelishuv asosida.",
    ctaTemplateBtn: "Shablon tanlash",
    ctaOrderBtn: "Buyurtma berish",
  },

  faq: [
    {
      q: "Taklifnoma tayyor bo'lishi qancha vaqt oladi?",
      a: "Shablon tanlab, ma'lumotlarni kiritganingizdan so'ng taklifnoma bir necha daqiqada tayyor bo'ladi. Operator Telegram orqali tafsilotlarni kelishib, tasdiqlagach havola faollashadi va uni mehmonlarga yuborishingiz mumkin.",
    },
    {
      q: "Mehmonlar javobini qanday kuzataman?",
      a: "Har bir taklifnomada RSVP bo'limi bor: mehmon o'z ismini yozib, kelish-kelmasligi va mehmonlar sonini bildiradi. Barcha javoblar admin panelning «Javoblar» bo'limida bir joyda yig'iladi.",
    },
    {
      q: "Taklifnomani mehmonlarga qanday yuboraman?",
      a: "Har bir taklifnoma uchun shaxsiy havola va QR kod beriladi. Havolani Telegram yoki WhatsApp orqali bir tugma bilan ulashish, QR kodni esa to'y taklifnomasiga bosib chiqarish mumkin.",
    },
    {
      q: "Bir shablonni bir necha marta ishlatsam bo'ladimi?",
      a: "Ha. Bir marta buyurtma qilingan shablon doirasida matn, ismlar, sana, manzil va tadbir dasturini o'zingizga moslab o'zgartirish mumkin — buning uchun yangi dizayn tanlash shart emas.",
    },
    {
      q: "Musiqa va rasmlarni o'zim qo'sha olamanmi?",
      a: "Ha. Taklifnomaga fon musiqasi qo'shiladi va galereya bo'limiga o'z suratlaringizni joylash mumkin. Barcha shablonlar telefonda ham, kompyuterda ham birdek chiroyli ochiladi.",
    },
    {
      q: "Narx qancha va qanday to'lanadi?",
      a: "Saytda qat'iy narx yo'q — narx kelishuv asosida belgilanadi. Buyurtma formasini to'ldirasiz yoki Telegram orqali yozasiz, operator tadbir turi, bo'limlar soni va muddatga qarab summani kelishadi. Onlayn to'lov talab qilinmaydi.",
    },
    {
      q: "Telegram orqali bog'lanishim mumkinmi?",
      a: "Ha. Saytdagi «Telegram orqali yozish» tugmalari operator bilan chatni ochadi — xabar va buyurtma raqami avtomatik qo'shiladi. Formani to'ldirish shart emas, lekin forma orqali yuborsangiz ma'lumotlar bazaga saqlanadi va tezroq ishlaymiz.",
    },
  ],

  catalog: {
    breadcrumbTemplates: "Shablonlar",
    tagCatalog: "Katalog",
    titleAll: "Barcha shablonlar",
    titleForEvent: "{event} shablonlari",
    subtitle: "{count} ta shablon — har biri jonli namuna bilan. Kartadagi konvertni bosib ochib, animatsiya va musiqani ko'ring.",
    searchPlaceholder: "Shablon nomi yoki tavsifi bo'yicha qidiring...",
    searchLabel: "Shablon qidirish",
    tierAll: "Barcha darajalar",
    tierPremium: "★ Premium",
    tierStandard: "Standart",
    sortFeatured: "Tavsiya etilgan",
    sortPremiumFirst: "Premium avval",
    sortStandardFirst: "Standart avval",
    sortName: "Nomi bo'yicha (A–Z)",
    filtersToggle: "Filtr",
    chipAll: "Barchasi",
    resultCount: "{count} ta shablon topildi",
    clearFilters: "Filtrni tozalash",
    emptyTitle: "Hech narsa topilmadi",
    emptyText: "Boshqa so'z bilan qidirib ko'ring yoki filtrni tozalang.",
    emptyCta: "Barcha shablonlar",
  },

  templateCard: {
    view: "Ko'rish",
  },

  templateDetail: {
    breadcrumbTemplates: "Shablonlar",
    tierBadge: "{tier} daraja",
    paymentLabel: "To'lov",
    programTitle: "Namunadagi dastur",
    notesTitle: "Eslatmalar",
    orderBtn: "Buyurtma berish",
    telegramBtn: "Telegram orqali yozish",
    noOnlinePayment: "Onlayn to'lov yo'q — buyurtma yuborilgach operator Telegram orqali bog'lanadi va narxni kelishamiz.",
    livePreviewHint: "☝️ Jonli namuna — konvertni bosib oching",
    statPhone: "Telefon",
    statPhoneLabel: "uchun mos",
    statQr: "QR",
    statQrLabel: "kod bilan",
    statRsvp: "RSVP",
    statRsvpLabel: "javoblar",
    relatedTag: "Yana ko'ring",
    relatedTitle: "{event} uchun boshqa shablonlar",
    relatedAll: "Barchasi ({total} shablon) →",
    featuresStandard: [
      "Konvert bilan ochiladigan jonli taklifnoma",
      "Countdown — tadbirgacha qolgan vaqt",
      "Tadbir dasturi va manzil",
      "Xarita havolalari (Google / Yandex)",
      "RSVP — mehmonlar javoblari",
      "Shaxsiy havola + QR kod",
    ],
    featuresPremium: [
      "Standart darajadagi barcha imkoniyatlar",
      "Tilaklar daftari va galereya bo'limi",
      "Fon musiqasi va gulbarg animatsiyasi",
      "Muqaddas duo va murojaat bloklari",
      "Kiyim uslubi va sovg'a bo'limlari",
      "Oylik kalendar va ikki tadbirli dastur",
    ],
  },

  order: {
    tag: "Buyurtma",
    title: "Taklifnomangizni shakllantiring",
    text: "Ma'lumotlarni to'ldiring — o'ng tomonda jonli ko'rinish darhol yangilanadi. Buyurtma bepul: onlayn to'lov yo'q, narxni Telegram orqali kelishamiz.",
    noTemplateWarning: "Shablon tanlanmagan. Iltimos,",
    noTemplateWarningLink: "shablonlar sahifasidan",
    noTemplateWarningEnd: "birini tanlang.",
    section1Title: "1. Buyurtmachi ma'lumotlari",
    yourName: "Ismingiz *",
    yourNamePlaceholder: "Masalan: Sardor",
    phone: "Telefon *",
    section2Title: "2. Taklifnoma ma'lumotlari",
    name1: "Ism 1 *",
    name1Placeholder: "Ali",
    name2: "Ism 2 (juftlik uchun)",
    name2Placeholder: "Dilnoza",
    date: "Sana *",
    time: "Vaqt",
    venueName: "Joy nomi *",
    venueNamePlaceholder: "Masalan: «Chorsu» to'yxonasi",
    venueAddress: "Manzil",
    venueAddressPlaceholder: "Toshkent, Chilonzor 5-kvartal",
    message: "Taklifnoma matni",
    messagePlaceholder: "Sizni to'yimizda ko'rishdan baxtiyor bo'lamiz!",
    submit: "Buyurtmani yuborish",
    submitting: "Yuborilmoqda...",
    noPaymentTitle: "To'lash shart emas",
    noPaymentText: "Buyurtma yuboring — operator Telegram orqali bog'lanadi, tafsilotlarni kelishib, keyin davom etamiz.",
    telegramBtn: "Telegram: {label}",
    livePreview: "Jonli ko'rinish",
    genericError: "Xatolik yuz berdi",
  },

  orderStatus: {
    telegramMsg: "Assalomu alaykum! «{template}» shabloni bo'yicha taklifnoma kerak edi. Buyurtma raqami: #{orderId}. Ismim: {name}.",
    confirmedTitle: "Buyurtma tasdiqlandi!",
    confirmedText: "Taklifnomangiz faol. Mehmonlaringizga yuborishingiz mumkin.",
    openInvitation: "Taklifnomani ochish →",
    pendingTitle: "Buyurtmangiz qabul qilindi!",
    orderNumber: "Buyurtma raqami:",
    telegramBoxTitle: "Endi Telegram orqali bog'lanamiz",
    telegramBoxText:
      "Onlayn to'lov talab qilinmaydi. Operator siz bilan Telegram'da bog'lanib, tafsilotlarni aniqlashtiradi va narxni kelishadi — keyin taklifnomani tayyorlab beramiz.",
    telegramBoxBtn: "Telegram'da yozish — {label}",
    telegramBoxHint: "Xabar matni va buyurtma raqami avtomatik qo'shiladi.",
    priceLabel: "Narx",
    linkBoxTitle: "Taklifnoma linki (operator tasdiqlagach ishlaydi):",
    questionsText: "Savollar bo'lsa:",
    telegramContact: "Telegram: {label}",
  },

  shareCard: {
    title: "Mehmonlarga ulashish",
    text: "Linkni yoki QR kodni mehmonlaringizga yuboring.",
    copy: "Nusxalash",
    copied: "✓ Nusxalandi",
    telegram: "Telegram",
    whatsapp: "WhatsApp",
    qrCode: "QR kod",
    qrHint: "Telefon kamerasi bilan skanerlash yetarli",
    qrDownload: "⬇ Yuklab olish",
    shareText: "Sizni tadbirimizga taklif qilamiz! 💌",
  },

  notFound: {
    title: "Sahifa topilmadi",
    text: "Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.",
    home: "Bosh sahifaga qaytish",
    templates: "Shablonlarni ko'rish",
  },

  adminLogin: {
    title: "Admin panel",
    subtitle: "Davom etish uchun parolni kiriting",
    placeholder: "Parol",
    submit: "Kirish",
    submitting: "Tekshirilmoqda...",
    wrongPassword: "Parol noto'g'ri. Qaytadan urinib ko'ring.",
    rateLimited: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring.",
  },
};

// DIQQAT: `as const` ataylab ishlatilmaydi — aks holda `Dictionary` tipi har
// bir satrni o'zining literal qiymatiga (masalan `"Shablonlar"`) qattiq
// bog'lab qo'yadi va `ru`/`en` lug'atlari boshqa satr yoza olmaydi. Bizga
// shakl (qaysi kalitlar, qaysi joyda massiv/obyekt) kerak, qiymatlar emas.
export type Dictionary = DeepWidenStrings<typeof uz>;

type DeepWidenStrings<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? DeepWidenStrings<U>[]
    : T extends object
      ? { -readonly [K in keyof T]: DeepWidenStrings<T[K]> }
      : T;
