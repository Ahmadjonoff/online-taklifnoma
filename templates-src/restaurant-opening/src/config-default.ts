export const config = {
  couple: {
    groom: 'Osh Vokzal',
    bride: '',
    monogram: 'OV',
  },
  event: {
    dateISO: '2027-04-05T12:00:00',
    dateLabel: '05.04.2027',
    timeLabel: '12:00',
    kicker: 'Restoran ochilishi',
  },
  blessing: {
    arabic: '',
    lines: [] as string[],
    source: '',
    greeting: '',
    text: 'Shaharning yangi milliy taomlar restorani — "Osh Vokzal" ochilishi munosabati bilan Sizni taklif qilamiz. Anʼanaviy taomlar, zamonaviy muhit va sizga maxsus sovgʻalar kutmoqda.',
    heart: false,
  },
  countdown: {
    title: 'Ochilishgacha qoldi',
    finishedText: 'Bugun ochilish kuni!',
  },
  timeline: {
    title: 'Dastur',
    items: [
      { time: '12:00', label: 'Mehmonlarni kutib olish' },
      { time: '12:30', label: 'Lenta kesish marosimi' },
      { time: '13:00', label: 'Taomlardan tatib koʻrish' },
      { time: '14:00', label: 'Musiqa va sovgʻalar' },
    ],
  },
  /* -------------------------------------------------------------------- GALEREYA */
  gallery: {
    enabled: true,
    title: 'Taomlarimiz',
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
    enabled: true,
    badge: 'Ochilish haftasi',
    title: 'Har bir buyurtmaga — sovgʻa desert',
    text: 'Ochilishdan keyingi birinchi hafta davomida har bir buyurtmaga bepul desert taqdim etamiz.',
  },
  /* --------------------------------------------------------------- KIYINISH USLUBI */
  dressCode: {
    enabled: false,
    title: 'Kiyinish uslubi',
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
    name: 'Osh Vokzal',
    address: 'Toshkent shahri, Mirzo Ulugʻbek tumani',
    googleMapsUrl: '',
    yandexMapsUrl: '',
  },
  notes: [] as Array<{ title: string; text: string }>,
  rsvp: {
    enabled: false,
    title: '',
    text: '',
    sealText: '',
    openHint: 'Ochish uchun bosing',
    successText: '',
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
    title: 'Tashrifingizni kutamiz!',
    signature: 'Osh Vokzal jamoasi',
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
