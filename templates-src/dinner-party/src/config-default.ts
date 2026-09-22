export const config = {
  couple: {
    groom: 'Aziz va Dilnoza',
    bride: '',
    monogram: 'A&D',
  },
  event: {
    dateISO: '2027-05-15T19:30:00',
    dateLabel: '15.05.2027',
    timeLabel: '19:30',
    kicker: 'Kechki taklif',
  },
  blessing: {
    arabic: '',
    lines: ['Nafis kech,', 'yaqin doʻstlar davrasida'],
    source: '',
    greeting: 'Aziz doʻstlar!',
    text: 'Sizni uyimizda oʻtkaziladigan intim kechki ziyofatga taklif qilishdan mamnunmiz. Yaxshi ovqat, mayin musiqa va suhbat kutmoqda.',
    heart: false,
  },
  countdown: {
    title: 'Kechagacha qoldi',
    finishedText: 'Bugun kech kuni!',
  },
  /* -------------------------------------------------------------------- GALEREYA */
  gallery: {
    enabled: false,
    title: 'Suratlar',
    photos: [] as string[],
  },

  /* ----------------------------------------------------------------- KATTA RAQAM */
  bigNumber: {
    enabled: false,
    value: '',
    title: '',
    subtitle: '',
  },

  /* ------------------------------------------------------------- MA'RUZACHILAR */
  speakers: {
    enabled: false,
    title: '',
    people: [] as Array<{ name: string; role: string; photo?: string }>,
  },

  /* ---------------------------------------------------------------- HAMKORLAR */
  sponsors: {
    enabled: false,
    title: '',
    names: [] as string[],
  },

  /* ------------------------------------------------------------- MAXSUS TAKLIF */
  specialOffer: {
    enabled: false,
    badge: '',
    title: '',
    text: '',
  },

  /* --------------------------------------------------------------- KIYINISH USLUBI */
  dressCode: {
    enabled: true,
    title: 'Kiyinish uslubi',
    text: 'Smart casual — nafis, lekin erkin uslubda kelishingizni soʻraymiz.',
    colors: ['#3c2a20', '#7d1f28', '#c9a961', '#f3e9d8'] as string[],
  },

  /* ----------------------------------------------------------------- BITIRUV */
  achievement: {
    enabled: false,
    degree: '',
    institution: '',
    text: '',
  },

  venue: {
    title: 'Manzil',
    name: 'Uyimizda',
    address: 'Toshkent shahri',
    googleMapsUrl: '',
    yandexMapsUrl: '',
  },
  notes: [] as Array<{ title: string; text: string }>,
  rsvp: {
    enabled: true,
    title: 'Ishtirokni tasdiqlang',
    text: 'Dasturxon tayyorlashimiz uchun, iltimos, kelishingizni tasdiqlang.',
    sealText: 'RSVP',
    openHint: 'Ochish uchun bosing',
    successText: 'Rahmat! Javobingiz qabul qilindi.',
  },
  gift: {
    enabled: false,
    title: '',
    cardNumber: '',
    cardHolder: '',
    copyLabel: '',
    copiedLabel: '',
  },
  wishes: {
    enabled: false,
    title: '',
    namePlaceholder: '',
    messagePlaceholder: '',
    submitLabel: '',
    successText: '',
  },
  footer: {
    title: 'Kechqurun koʻrishguncha!',
    signature: 'Aziz va Dilnoza',
    photo: '',
  },
  music: {
    enabled: true,
    src: '/music.mp3',
  },
  petals: {
    enabled: false,
    count: 0,
  },
} as const

export type Config = typeof config
