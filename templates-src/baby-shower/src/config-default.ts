export const config = {
  couple: {
    groom: '',
    bride: 'Kichkintoyimiz',
    monogram: '✨',
  },
  event: {
    dateISO: '2027-05-08T15:00:00',
    dateLabel: '08.05.2027',
    timeLabel: '15:00',
    kicker: 'Baby Shower',
  },
  blessing: {
    arabic: '',
    lines: ['Tez orada', 'kichkintoyimiz keladi'],
    source: '',
    greeting: 'Aziz doʻstlar va yaqinlar!',
    text: 'Oilamizga yangi mehmon kelishi arafasida uyushtirilayotgan baby shower kechasiga Sizni taklif qilamiz. Quvonchimizni siz bilan baham koʻrishni orzu qilamiz.',
    heart: true,
  },
  countdown: {
    title: 'Bayramgacha qoldi',
    finishedText: 'Bugun bayram kuni!',
  },
  timeline: {
    title: 'Dastur',
    items: [
      { time: '15:00', label: 'Mehmonlar kelishi' },
      { time: '15:30', label: 'Oʻyinlar' },
      { time: '16:30', label: 'Tort va sovgʻalar' },
    ],
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
    enabled: false,
    title: '',
    text: '',
    colors: [] as string[],
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
    name: 'Oila uyida',
    address: 'Toshkent shahri',
    googleMapsUrl: '',
    yandexMapsUrl: '',
  },
  notes: [
    {
      title: 'Sovgʻalar roʻyxati',
      text: 'Chaqaloq buyumlari — eng yaxshi sovgʻa. Roʻyxat uchun biz bilan bogʻlaning.',
    },
  ] as Array<{ title: string; text: string }>,
  rsvp: {
    enabled: true,
    title: 'Ishtirokni tasdiqlang',
    text: 'Yaxshi tayyorgarlik koʻrishimiz uchun, iltimos, kelishingizni tasdiqlang.',
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
    enabled: true,
    title: 'Ezgu tilaklar',
    namePlaceholder: 'Ismingizni kiriting',
    messagePlaceholder: 'Samimiy tilaklaringizni yozing...',
    submitLabel: 'Tilak yuborish',
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
    count: 8,
  },
} as const

export type Config = typeof config
