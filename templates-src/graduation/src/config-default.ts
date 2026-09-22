export const config = {
  couple: {
    groom: 'Madina Yusupova',
    bride: '',
    monogram: 'MY',
  },
  event: {
    dateISO: '2027-06-25T17:00:00',
    dateLabel: '25.06.2027',
    timeLabel: '17:00',
    kicker: 'Bitiruv kechasi',
  },
  blessing: {
    arabic: '',
    lines: [] as string[],
    source: '',
    greeting: '',
    text: 'Toʻrt yillik mehnat va intilish nihoyasiga yetdi! Bitiruv kechamda yonimda boʻlishingizni va bu quvonchli lahzani men bilan baham koʻrishingizni istardim.',
    heart: false,
  },
  countdown: {
    title: 'Kechagacha qoldi',
    finishedText: 'Bugun bitiruv kuni!',
  },
  timeline: {
    title: 'Dastur',
    items: [
      { time: '17:00', label: 'Mehmonlar kelishi' },
      { time: '17:30', label: 'Diplom topshirish' },
      { time: '18:00', label: 'Tabriklar' },
      { time: '19:00', label: 'Ziyofat va musiqa' },
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
    enabled: true,
    degree: 'Bakalavr darajasi',
    institution: 'Toshkent Axborot Texnologiyalari Universiteti',
    text: 'Kompyuter injiniringi yoʻnalishi boʻyicha aʼlo baholarga bitirdim.',
  },

  venue: {
    title: 'Manzil',
    name: 'University Hall',
    address: 'Toshkent shahri',
    googleMapsUrl: '',
    yandexMapsUrl: '',
  },
  notes: [] as Array<{ title: string; text: string }>,
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
    enabled: false,
    title: '',
    namePlaceholder: '',
    messagePlaceholder: '',
    submitLabel: '',
    successText: '',
  },
  footer: {
    title: 'Kechada koʻrishguncha!',
    signature: 'Madina',
    photo: '',
  },
  music: {
    enabled: false,
    src: '/music.mp3',
  },
  petals: {
    enabled: false,
    count: 0,
  },
} as const

export type Config = typeof config
