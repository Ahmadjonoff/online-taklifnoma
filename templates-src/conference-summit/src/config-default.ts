export const config = {
  couple: {
    groom: 'Digital Summit 2027',
    bride: '',
    monogram: 'DS',
  },
  event: {
    dateISO: '2027-05-20T09:00:00',
    dateLabel: '20.05.2027',
    timeLabel: '09:00',
    kicker: 'Texnologiya sammiti',
  },
  blessing: {
    arabic: '',
    lines: [] as string[],
    source: '',
    greeting: '',
    text: 'Mintaqaning yetakchi texnologiya mutaxassislarini bir joyga jamlaydigan yillik sammitga taklif qilamiz. Sunʼiy intellekt, startaplar va raqamli transformatsiya boʻyicha ochiq muhokamalar.',
    heart: false,
  },
  countdown: {
    title: 'Sammitgacha qoldi',
    finishedText: 'Bugun sammit kuni!',
  },
  timeline: {
    title: 'Kun tartibi',
    items: [
      { time: '09:00', label: 'Roʻyxatdan oʻtish' },
      { time: '09:30', label: 'Ochilish sessiyasi' },
      { time: '10:30', label: 'AI va kelajak texnologiyalari' },
      { time: '12:00', label: 'Tushlik' },
      { time: '13:30', label: 'Startap pitching' },
      { time: '15:30', label: 'Panel muhokamasi' },
      { time: '17:00', label: 'Networking' },
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
    enabled: true,
    title: 'Maʻruzachilar',
    people: [
      { name: 'Sardor Aliyev', role: 'CTO, Fintech Solutions' },
      { name: 'Gulnora Tosheva', role: 'AI tadqiqotchisi' },
      { name: 'Jasur Nazarov', role: 'Startap asoschisi' },
      { name: 'Kamola Rustamova', role: 'Investor, VC Partner' },
    ] as Array<{ name: string; role: string; photo?: string }>,
  },

  /* ---------------------------------------------------------------- HAMKORLAR */
  sponsors: {
    enabled: true,
    title: 'Hamkorlar',
    names: ['TechHub', 'Fintech Solutions', 'Digital Bank', 'StartApp Ventures'] as string[],
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
    name: 'Tashkent Congress Hall',
    address: 'Toshkent shahri, Yunusobod tumani',
    googleMapsUrl: '',
    yandexMapsUrl: '',
  },
  notes: [] as Array<{ title: string; text: string }>,
  rsvp: {
    enabled: true,
    title: 'Roʻyxatdan oʻting',
    text: 'Oʻrinlar soni cheklangan — ishtirok etish uchun roʻyxatdan oʻting.',
    sealText: 'Roʻyxat',
    openHint: 'Roʻyxatdan oʻtish uchun bosing',
    successText: 'Rahmat! Roʻyxatga olindingiz.',
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
    title: 'Sammitda koʻrishguncha!',
    signature: 'Tashkilotchilar',
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
