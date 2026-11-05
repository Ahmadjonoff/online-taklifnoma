/* ============================================================================
 *  TAKLIFNOMA SOZLAMALARI
 *  ---------------------------------------------------------------------------
 *  Taklifnomani moslashtirish uchun FAQAT shu faylni tahrirlang.
 * ==========================================================================*/

export const config = {
  /* ---------------------------------------------------------- 3D SAHNA */
  /** Kinematik ochilish sahnasi (qarang: templates-src/core/cinema/kit.ts → Scene3D). */
  scene3d: {
    hero: 'arch',
    mood: 'day',
    floralArch: true,
    candles: true,
    flowers: 'rose',
    lanterns: false,
  },

  couple: {
    groom: 'Shahzod',
    bride: 'Mohinur',
    monogram: 'S&M',
    photo: '',
  },

  envelope: {
    kicker: 'Sizga taklifnoma keldi',
  },

  event: {
    dateISO: '2026-12-05T17:00:00',
    dateLabel: '05.12.2026',
    timeLabel: '17:00',
    kicker: 'Qiz bazmi',
  },

  blessing: {
    arabic: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    lines: ['Yaxshilik bilan boshlanadi', 'ezgu niyatlar'],
    source: '',
    greeting: 'Aziz Mehmonimiz',
    text: 'Sizni fotiha toʻyimiz munosabati bilan oʻtkaziladigan tantanamizga chin qalbdan taklif etamiz. Ushbu quvonchli kunda bizga hamroh boʻling.',
    heart: true,
  },

  dearGuests: {
    enabled: true,
    greeting: 'Aziz Mehmonimiz',
    text: 'Sizni farzandlarimiz fotiha toʻyi munosabati bilan oʻtkaziladigan tantanaga chin qalbdan taklif etamiz. Tashrifingiz biz uchun katta baxtdir.',
    signature: '',
  },

  countdown: {
    title: 'Fotiha toʻyigacha qolgan vaqt',
    finishedText: 'Bugun bizning kunimiz!',
  },

  calendar: {
    enabled: true,
    kicker: 'Sana va vaqt',
    title: 'Aprel',
  },

  events: {
    enabled: false,
    kicker: 'Dastur',
    title: 'Tadbir manzili',
    note: '',
    items: [
      {
        kicker: 'Asosiy marosim',
        title: 'Fotiha toʻyi',
        dateLabel: '17-Aprel, 2027-yil',
        timeLabel: '19:00',
        venueName: 'Banket zali «Delish»',
        venueAddress: 'Toshkent viloyati, Olmaliq shahar',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=40.8447,69.5983',
        yandexMapsUrl: 'https://yandex.uz/maps/?ll=69.5983%2C40.8447&z=17',
      },
    ],
  },

  timeline: {
    title: 'Kun tartibi',
    items: [
      { time: '17:00', label: 'Mehmonlarni kutib olish' },
      { time: '18:00', label: 'Fotiha marosimi' },
      { time: '19:00', label: 'Dasturxon' },
      { time: '20:30', label: 'Tabriklar' },
      { time: '21:30', label: 'Raqs va musiqa' },
    ],
  },

  details: {
    enabled: true,
  },

  venue: {
    title: 'Manzil',
    name: 'Banket zali «Delish»',
    address: 'Toshkent viloyati, Olmaliq shahar',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=40.8447,69.5983',
    yandexMapsUrl: 'https://yandex.uz/maps/?ll=69.5983%2C40.8447&z=17',
  },

  gallery: {
    enabled: true,
    title: 'Fotiha toʻyi albomi',
    photos: [
      'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/1244627/pexels-photo-1244627.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],
  },

  story: {
    enabled: true,
    kicker: 'Bizning xotiralarimiz',
    title: 'Bogʻda boshlangan yoʻl',
    text: 'Bahor oqshomida boshlangan suhbat bugun yangi oilaning ilk qadamiga aylandi. Bu quvonchni siz bilan baham koʻrishdan baxtiyormiz.',
    photo: '',
  },

  singers: {
    enabled: true,
    kicker: 'Maxsus mehmonlar',
    title: 'Bayramimiz mehmonlari',
    text: '',
    layout: 'list',
    items: [
      {
        name: 'Sardor Rahimxon',
        note: 'Kechki dasturxon davomida jonli ijro',
        photo: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        name: 'Nilufar Usmonova',
        note: 'Tabriklar qismida sahnada',
        photo: 'https://images.pexels.com/photos/761963/pexels-photo-761963.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
    ],
  },

  dressCode: {
    enabled: true,
    title: 'Kiyim uslubi',
    text: 'Nafis uslub — pushti, oq va oltin ranglar.',
    palette: ['#f4a9bd', '#e7c491', '#fff7f8'],
  },

  notes: [
    { title: 'Mehmonlar uchun', text: 'Bolalar uchun o‘yin maydonchasi tayyorlangan.' },
    { title: 'Sovgʻa haqida', text: 'Eng qimmatli sovgʻa — ezgu duolaringiz.' },
  ],

  rsvp: {
    enabled: true,
    title: 'Ishtirokni tasdiqlang',
    text: 'Dasturxonni toʻgʻri tayyorlashimiz uchun, iltimos, kelishingizni oldindan bildiring.',
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
    title: 'Tilaklar daftari',
    namePlaceholder: 'Ismingizni kiriting',
    messagePlaceholder: 'Xabaringizni yozing',
    submitLabel: 'Xabar yuborish',
    successText: 'Tilagingiz uchun rahmat!',
  },

  footer: {
    title: 'Sizni kutamiz!',
    signature: '',
    photo: '',
  },

  music: {
    enabled: true,
    src: '/music.mp3',
  },

  petals: {
    enabled: true,
    count: 14,
  },
} as const

export type Config = typeof config
