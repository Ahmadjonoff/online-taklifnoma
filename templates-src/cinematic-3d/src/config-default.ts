/* ============================================================================
 *  TAKLIFNOMA SOZLAMALARI
 *  ---------------------------------------------------------------------------
 *  Taklifnomani moslashtirish uchun FAQAT shu faylni tahrirlang.
 * ==========================================================================*/

export const config = {
  /* ---------------------------------------------------------- 3D SAHNA */
  /** Kinematik ochilish sahnasi (qarang: templates-src/core/cinema/scene3d.ts → Scene3D). */
  scene3d: {
    hero: 'mehrab',
    mood: 'night',
    lanterns: true,
    candles: true,
    flowers: 'hydrangea',
  },

  couple: {
    groom: 'Sarvar',
    bride: 'Surayyo',
    monogram: 'S&S',
    photo:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
  },

  envelope: {
    kicker: 'Sizga taklifnoma keldi',
  },

  event: {
    dateISO: '2026-10-10T16:00:00',
    dateLabel: '10.10.2026',
    timeLabel: '16:00',
    kicker: 'Nikoh kuni',
  },

  blessing: {
    arabic: '',
    lines: ['Alloh ularning qalblarini', 'sevgi ila birlashtirdi'],
    source: '',
    greeting: 'Aziz Mehmonimiz',
    text: 'Sizni nikoh toʻyimiz munosabati bilan boʻlib oʻtadigan «Visol oqshomi»ga taklif etamiz.',
    heart: false,
  },

  dearGuests: {
    enabled: true,
    greeting: 'Aziz Mehmonimiz',
    text: 'Sizni nikoh toʻyimiz munosabati bilan oʻtkaziladigan tantanamizga taklif etamiz. Bu kechani siz bilan birga nishonlashni istaymiz.',
    signature: '',
  },

  countdown: {
    title: 'Toʻygacha qolgan vaqt',
    finishedText: 'Bugun katta kun!',
  },

  calendar: {
    enabled: true,
    kicker: 'Sana va vaqt',
    title: 'Oktabr',
  },

  events: {
    enabled: false,
    kicker: 'Dastur',
    title: 'Tadbir manzili',
    note: '',
    items: [
      {
        kicker: 'Asosiy marosim',
        title: 'Nikoh toʻyi',
        dateLabel: '10-Oktabr, 2026-yil',
        timeLabel: '16:00',
        venueName: 'Hilton Tashkent City',
        venueAddress: 'Toshkent, Islom Karimov koʻchasi 2',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=41.3169,69.2797',
        yandexMapsUrl: 'https://yandex.uz/maps/?ll=69.2797%2C41.3169&z=17',
      },
    ],
  },

  timeline: {
    title: 'Kun tartibi',
    items: [
      { time: '16:00', label: 'Mehmonlarni kutib olish' },
      { time: '17:00', label: 'Nikoh marosimi' },
      { time: '18:30', label: 'Ziyofat' },
      { time: '20:00', label: 'Tabriklar' },
      { time: '21:30', label: 'Raqs va musiqa' },
    ],
  },

  details: {
    enabled: true,
  },

  venue: {
    title: 'Manzil',
    name: 'Hilton Tashkent City',
    address: 'Toshkent, Islom Karimov koʻchasi 2',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=41.3169,69.2797',
    yandexMapsUrl: 'https://yandex.uz/maps/?ll=69.2797%2C41.3169&z=17',
  },

  gallery: {
    enabled: true,
    title: 'Bizning xotiralar',
    photos: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80',
      'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/1244627/pexels-photo-1244627.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],
  },

  story: {
    enabled: true,
    kicker: 'Bizning hikoyamiz',
    title: 'Bizning sayohatimiz',
    text: 'Ikki yurak bir-birini topdi. Bir oqshomda boshlangan suhbat butun umrlik sevgiga aylandi. Bugun siz bilan bu baxtli kunni nishonlashga taklif etamiz.',
    photo: '',
  },

  singers: {
    enabled: false,
    kicker: 'Maxsus mehmonlar',
    title: 'Kechaning yulduzlari',
    text: '',
    layout: 'slider',
    items: [
      {
        name: 'DJ Shahzod',
        note: 'Kechqurun DJ set',
        photo: 'https://images.pexels.com/photos/811838/pexels-photo-811838.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
    ],
  },

  dressCode: {
    enabled: true,
    title: 'Kiyim uslubi',
    text: 'Zamonaviy kechki uslub — qora, oltin va kumush ranglar uygʻunligi.',
    palette: ['#070707', '#c9a96e', '#e8d8bf'],
  },

  notes: [
    { title: 'Xush kelibsiz', text: 'Avtomobil uchun bepul to‘xtash joyi mavjud.' },
  ],

  rsvp: {
    enabled: true,
    title: 'Tadbirga javob',
    text: 'Siz bilan nishonlashni intiqlik bilan kutamiz!',
    sealText: 'RSVP',
    openHint: 'Ochish uchun bosing',
    successText: 'Rahmat! Javobingiz qabul qilindi.',
  },

  gift: {
    enabled: true,
    title: 'Toʻyona',
    cardNumber: '5614 6822 1499 0956',
    cardHolder: 'AZAMAT KOCHIMOV',
    copyLabel: 'Karta raqamini nusxalash',
    copiedLabel: 'Nusxalandi!',
  },

  wishes: {
    enabled: true,
    title: 'Mehmonlar kitobi',
    namePlaceholder: 'Ismingizni kiriting',
    messagePlaceholder: 'Xabaringizni yozing',
    submitLabel: 'Xabar yuborish',
    successText: 'Tilagingiz uchun rahmat!',
  },

  footer: {
    title: 'Sizni koʻrishdan baxtiyor boʻlamiz!',
    signature: '',
    photo: '',
  },

  music: {
    enabled: true,
    src: '/music.mp3',
  },

  petals: {
    enabled: true,
    count: 12,
  },
} as const

export type Config = typeof config
