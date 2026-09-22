export const config = {
  couple: {
    groom: '',
    bride: 'Nilufar',
    monogram: 'N',
  },
  event: {
    dateISO: '2027-06-20T15:00:00',
    dateLabel: '20.06.2027',
    timeLabel: '15:00',
    kicker: 'Bridal Shower',
  },
  blessing: {
    arabic: '',
    lines: ['Kelinchakning', 'quvonchli kuni'],
    source: '',
    greeting: 'Aziz qizlar!',
    text: 'Nilufarning kelinchaklikka boʻlgan quvonchli davrini nishonlash uchun uni bir kunlik ajoyib bridal shower kechasiga taklif qilyapmiz. Siz ham shu quvonchli damda yonimizda boʻling!',
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
      { time: '15:30', label: 'Oʻyinlar va konkurslar' },
      { time: '16:30', label: 'Tort va sovgʻalar' },
      { time: '17:30', label: 'Suratga tushish' },
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
    enabled: true,
    title: 'Kiyinish uslubi',
    text: 'Pushti va oq ranglardagi nafis liboslarda kelishingizni istaymiz.',
    colors: ['#f3d6d6', '#f8ecec', '#e8c9dd', '#ffffff'] as string[],
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
    name: 'Rosa Lounge',
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
    enabled: true,
    title: 'Ezgu tilaklar',
    namePlaceholder: 'Ismingizni kiriting',
    messagePlaceholder: 'Nilufarga samimiy tilaklaringizni yozing...',
    submitLabel: 'Tilak yuborish',
    successText: 'Tilagingiz uchun rahmat!',
  },
  footer: {
    title: 'Sizni koʻrishdan baxtiyor boʻlamiz!',
    signature: 'Nilufar',
    photo: '',
  },
  music: {
    enabled: true,
    src: '/music.mp3',
  },
  petals: {
    enabled: true,
    count: 10,
  },
} as const

export type Config = typeof config
