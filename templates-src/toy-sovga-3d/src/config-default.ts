/* ============================================================================
 *  TAKLIFNOMA SOZLAMALARI
 *  ---------------------------------------------------------------------------
 *  Taklifnomani moslashtirish uchun FAQAT shu faylni tahrirlang.
 *  Generator (`scripts/generate-taklif-templates.mjs`) har bir shablon uchun
 *  shu faylni brend qiymatlari bilan qayta yozadi.
 * ==========================================================================*/

export const config = {
  /* ---------------------------------------------------------- 3D SAHNA */
  /** Kinematik ochilish sahnasi (qarang: templates-src/core/cinema/scene3d.ts → Scene3D). */
  scene3d: {
    hero: 'giftbox',
    mood: 'day',
    flowerWall: true,
    candles: true,
    flowers: 'rose',
    pearls: true,
    lanterns: false,
  },

  /* ---------------------------------------------------------------- KELIN-KUYOV */
  couple: {
    groom: 'Javohir',
    bride: 'Nilufar',
    /** Muhr va monogramma ustidagi bosh harflar. */
    monogram: 'J&N',
    /** Hero'dagi toq-ravoqli portret. `public/` ichiga rasm qo'yib, yo'lini yozing. */
    photo: '',
  },

  /* ------------------------------------------------------------------ KONVERT */
  envelope: {
    /** Konvert ustidagi kichik yozuv. */
    kicker: 'Sizga taklifnoma keldi',
  },

  /* ---------------------------------------------------------------------- SANA */
  event: {
    /** ISO formatda: YYYY-MM-DDTHH:mm:ss — countdown shu sanadan hisoblaydi. */
    dateISO: '2026-12-20T18:00:00',
    dateLabel: '20.12.2026',
    timeLabel: '18:00',
    /** Hero ustidagi kichik yozuv. */
    kicker: 'To‘y kechasi',
  },

  /* -------------------------------------------------------------------- MUROJAAT */
  blessing: {
    /** Arabcha matn. Bo'sh qoldirsangiz — ko'rinmaydi. */
    arabic: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    /** Har biri alohida qatorda, yozma shriftda chiqadi. */
    lines: ['Ikki qalb', 'Bitta taqdir'],
    /** Oyat manbasi. Bo'sh qoldirsangiz — ko'rinmaydi. */
    source: 'Anfol surasi, 63-oyat',
    greeting: 'Aziz va qadrli insonimiz!',
    text: 'Sizni nikoh toʻyimiz munosabati bilan boʻlib oʻtadigan “Visol oqshomi”ga taklif etamiz. Quvonchimizni biz bilan baham koʻrishingizni intiqlik bilan kutamiz.',
    heart: true,
  },

  /* --------------------------------------------------------------- MUROJAAT BLOKI */
  dearGuests: {
    enabled: true,
    greeting: 'Aziz Mehmonimiz',
    text: 'Sizni nikoh toʻyimiz munosabati bilan oʻtkaziladigan tantanamizga chin qalbdan taklif etamiz. Tashrifingiz biz uchun eng qimmatli sovgʻadir.',
    /** Bo'sh qoldirsangiz — kelin-kuyov ismi qo'yiladi. */
    signature: '',
  },

  /* -------------------------------------------------------------------- COUNTDOWN */
  countdown: {
    title: 'Bayramgacha qoldi',
    finishedText: 'Bugun bizning kunimiz!',
  },

  /* -------------------------------------------------------------------- KALENDAR */
  calendar: {
    enabled: true,
    kicker: 'Sana va vaqt',
    title: 'Kalendar',
  },

  /* ------------------------------------------------------- KO'P TADBIRLI DASTUR */
  events: {
    enabled: true,
    kicker: 'Ikki tadbir',
    title: "To'y dasturi va manzili",
    note: 'Ikkala marosimda ham sizni koʻrishdan baxtiyor boʻlamiz.',
    items: [
      {
        kicker: 'Bayram bazmi',
        title: "Qizlar bazmi",
        dateLabel: '27-Noyabr, 2026-yil',
        timeLabel: '19:00',
        venueName: '«Oʻzbegim» toʻyxonasi',
        venueAddress: 'Toshkent shahri',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=41.311081,69.240562',
        yandexMapsUrl: 'https://yandex.uz/maps/?ll=69.240562%2C41.311081&z=17',
      },
      {
        kicker: 'Asosiy marosim',
        title: 'Nikoh toʻyi',
        dateLabel: '28-Noyabr, 2026-yil',
        timeLabel: '19:00',
        venueName: '«Orasta» toʻyxonasi',
        venueAddress: 'Toshkent shahri',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=41.311081,69.240562',
        yandexMapsUrl: 'https://yandex.uz/maps/?ll=69.240562%2C41.311081&z=17',
      },
    ],
  },

  /* ---------------------------------------------------------------------- DASTUR */
  timeline: {
    title: 'Kun tartibi',
    items: [
      { time: '17:00', label: 'Mehmonlarni kutib olish' },
      { time: '18:00', label: 'Nikoh marosimi' },
      { time: '19:00', label: 'Tabriklar' },
      { time: '20:00', label: 'Kechki ziyofat' },
      { time: '21:00', label: 'Raqs va musiqa' },
    ],
  },

  /* --------------------------------------------------------- TADBIR TAFSILOTLARI */
  details: {
    enabled: true,
  },

  /* ---------------------------------------------------------------------- MANZIL */
  venue: {
    title: 'Toʻyxona',
    name: 'Bogʻi Eram marosimlar saroyi',
    address: 'Toshkent, Mirzo Ulugʻbek tumani, Buyuk Ipak Yoʻli koʻchasi 84',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=41.3255,69.3401',
    yandexMapsUrl: 'https://yandex.uz/maps/?ll=69.3401%2C41.3255&z=17',
  },

  /* -------------------------------------------------------------------- GALEREYA */
  gallery: {
    enabled: true,
    title: 'Bizning xotiralar',
    photos: [
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/1244627/pexels-photo-1244627.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],
  },

  /* -------------------------------------------------------------------- HIKOYA */
  story: {
    enabled: true,
    kicker: 'Bizning hikoyamiz',
    title: 'Bizning sayohatimiz',
    text: 'Ikki yurak bir-birini topdi. Bir oqshomda boshlangan suhbat butun umrlik sevgiga aylandi. Bugun siz bilan bu baxtli kunni nishonlashga taklif etamiz.',
    photo: '',
  },

  /* ----------------------------------------------------------- MAXSUS MEHMONLAR */
  singers: {
    enabled: true,
    kicker: 'Maxsus mehmonlar',
    title: 'Kechaning yulduzlari',
    text: 'Bayramimizni yanada yorqin qiladigan sanʼatkorlar.',
    /** 'slider' — surib ko'riladi, 'list' — hammasi birdaniga ko'rinadi. */
    layout: 'slider',
    items: [
      {
        name: 'Yulduz Usmonova',
        note: 'Soat 21:00 da jonli ijro',
        photo: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        name: 'Ozodbek Nazarbekov',
        note: 'Kechaning ochilish qoʻshigʻi',
        photo: 'https://images.pexels.com/photos/761963/pexels-photo-761963.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        name: 'Shahzoda',
        note: 'Raqs qismida sahnada',
        photo: 'https://images.pexels.com/photos/811838/pexels-photo-811838.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
    ],
  },

  /* -------------------------------------------------------------- KIYIM USLUBI */
  dressCode: {
    enabled: true,
    title: 'Kiyim uslubi',
    text: 'Yengil uslub — pushti, oltin va oq ranglar.',
    /** Ixtiyoriy rang namunalari. */
    palette: ['#f3d9df', '#e8cc95', '#fdf7f2'],
  },

  /* ----------------------------------------------------------------- QO'SHIMCHA */
  notes: [
    { title: 'Sovgʻa haqida', text: 'Eng qimmatli sovgʻa — sizning ishtirokingiz.' },
  ],

  /* ------------------------------------------------------------------------ RSVP */
  rsvp: {
    enabled: true,
    title: 'Ishtirokni tasdiqlang',
    text: 'Bayramni yaxshi tayyorlashimiz uchun, iltimos, kelishingizni tasdiqlang.',
    sealText: 'RSVP',
    openHint: 'Ochish uchun bosing',
    successText: 'Rahmat! Javobingiz qabul qilindi.',
  },

  /* ---------------------------------------------------------------------- TO'YONA */
  gift: {
    enabled: true,
    title: 'Toʻyona',
    cardNumber: '5614 6822 1499 0956',
    cardHolder: 'AZAMAT KOCHIMOV',
    copyLabel: 'Karta raqamini nusxalash',
    copiedLabel: 'Nusxalandi!',
  },

  /* ---------------------------------------------------------------- TILAKLAR */
  wishes: {
    enabled: true,
    title: 'Tilaklar daftari',
    namePlaceholder: 'Ismingizni kiriting',
    messagePlaceholder: 'Xabaringizni yozing',
    submitLabel: 'Xabar yuborish',
    successText: 'Tilagingiz uchun rahmat!',
  },

  /* ---------------------------------------------------------------------- FOOTER */
  footer: {
    title: 'Sizni koʻrishdan baxtiyor boʻlamiz!',
    /** Bo'sh qoldirsangiz — kelin-kuyov ismi avtomatik qo'yiladi. */
    signature: '',
    photo: '',
  },

  /* ----------------------------------------------------------------- FON MUSIQASI */
  music: {
    enabled: true,
    src: '/music.mp3',
  },

  /* ------------------------------------------------------------------ ANIMATSIYA */
  petals: {
    enabled: true,
    count: 14,
  },
} as const

export type Config = typeof config
