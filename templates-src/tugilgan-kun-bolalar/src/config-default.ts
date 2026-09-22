export const config = {
  couple: {
    groom: 'Amirbek',
    bride: '',
    monogram: '7',
  },
  event: {
    dateISO: '2027-04-10T15:00:00',
    dateLabel: '10.04.2027',
    timeLabel: '15:00',
    kicker: 'Tug\'ilgan kun bayrami',
  },
  blessing: {
    arabic: '',
    lines: ['Keling birga nishonlaymiz!', 'Amirbek 7 yoshda!'],
    source: '',
    greeting: 'Hurmatli ota-onalar va bolalar!',
    text: 'Amirbekning 7 yoshga to\'lishi munosabati bilan o\'tkaziladigan tug\'ilgan kun bayramiga lutfan taklif etamiz. Qiziqarli o\'yinlar, konkurslar va mazali tort sizni kutmoqda!',
    heart: false,
  },
  countdown: {
    title: 'Bayramgacha qoldi',
    finishedText: 'Bugun bayram kuni!',
  },
  timeline: {
    title: 'Bayram dasturi',
    items: [
      { time: '15:00', label: 'Mehmonlar kelishi' },
      { time: '15:30', label: "O'yinlar va konkurslar" },
      { time: '16:30', label: 'Tort va tabriklar' },
      { time: '17:00', label: 'Diskoteka' },
      { time: '18:00', label: 'Xayrlashuv' },
    ],
  },
  /* -------------------------------------------------------------------- GALEREYA */
  gallery: {
    enabled: false,
    title: 'Suratlar',
    /** public/ papkasiga rasm tashlab, shu yerga yo'llarini yozing: ['/g1.jpg', ...] */
    photos: [] as string[],
  },

  /* ----------------------------------------------------------------- KATTA RAQAM */
  bigNumber: {
    enabled: false,
    /** Masalan: '50', '1', '30' */
    value: '',
    title: '',
    subtitle: '',
  },
  /* ------------------------------------------------------------- MA'RUZACHILAR */
  speakers: {
    enabled: false,
    title: 'Ma\'ruzachilar',
    people: [] as Array<{ name: string; role: string; photo?: string }>,
  },

  /* ---------------------------------------------------------------- HAMKORLAR */
  sponsors: {
    enabled: false,
    title: 'Hamkorlar',
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
    name: 'Happy Land bolalar markazi',
    address: 'Samarqand',
    googleMapsUrl: '',
    yandexMapsUrl: '',
  },
  notes: [
    {
      title: 'Muhim',
      text: 'Bolangizga qulay kiyim kiying',
    },
    {
      title: 'Kayfiyat',
      text: 'Bayramona kayfiyat olib keling!',
    },
  ],
  rsvp: {
    enabled: true,
    title: 'Ishtirokni tasdiqlang',
    text: 'Bayramga yaxshi tayyorgarlik koʻrishimiz uchun, iltimos, kelishingizni tasdiqlang.',
    sealText: 'RSVP',
    openHint: 'Ochish uchun bosing',
    successText: 'Rahmat! Javobingiz qabul qilindi.',
  },
  gift: {
    enabled: false,
    title: 'Sovg\'a',
    cardNumber: '',
    cardHolder: '',
    copyLabel: 'Nusxalash',
    copiedLabel: 'Nusxalandi!',
  },
  wishes: {
    enabled: true,
    title: 'Ezgu tilaklar',
    namePlaceholder: 'Ismingizni kiriting',
    messagePlaceholder: 'Amirbekka samimiy tilaklaringizni yozing...',
    submitLabel: 'Tilak yuborish',
    successText: 'Tilagingiz uchun rahmat!',
  },
  footer: {
    title: 'Sizni kutib qolamiz!',
    signature: 'Amirbek va oilasi',
    photo: '',
  },
  music: {
    enabled: true,
    src: '/music.mp3',
  },
  petals: {
    enabled: true,
    count: 20,
  },
} as const

export type Config = typeof config
