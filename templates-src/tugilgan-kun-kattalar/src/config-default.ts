export const config = {
  couple: {
    groom: 'Nodir',
    bride: '',
    monogram: '30',
  },
  event: {
    dateISO: '2027-05-18T19:00:00',
    dateLabel: '18.05.2027',
    timeLabel: '19:00',
    kicker: 'Yubiley kechasi',
  },
  blessing: {
    arabic: '',
    lines: ['Umrimning eng goʻzal sahifasi', '30 yosh — yangi bosqich!'],
    source: '',
    greeting: 'Aziz doʻstlar va yaqinlar!',
    text: 'Mening 30 yoshli yubileyimga bag\'ishlangan tantanali kechada sizni ko\'rishdan bag\'oyat xursand bo\'laman. Ushbu quvonchli kunimda yonimda bo\'lishingizni so\'rayman.',
    heart: true,
  },
  countdown: {
    title: 'Marosimgacha qoldi',
    finishedText: 'Bugun yubiley kuni!',
  },
  timeline: {
    title: 'Kecha dasturi',
    items: [
      { time: '19:00', label: 'Mehmonlar kelishi' },
      { time: '19:30', label: 'Tabriklar' },
      { time: '20:00', label: 'Ziyofat' },
      { time: '21:00', label: 'Tort marosimi' },
      { time: '21:30', label: 'Raqs va musiqa' },
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
    name: 'Milliy taomlar restorani',
    address: 'Buxoro',
    googleMapsUrl: '',
    yandexMapsUrl: '',
  },
  notes: [
    {
      title: 'Kiyinish uslubi',
      text: 'Dress-kod: Elegant evening',
    },
    {
      title: 'Sovgʻa',
      text: 'Eng qimmatli sovgʻa — sizning ishtirokingiz',
    },
  ],
  rsvp: {
    enabled: true,
    title: 'Ishtirokni tasdiqlang',
    text: 'Marosimga yaxshi tayyorgarlik koʻrishimiz uchun, iltimos, kelishingizni tasdiqlang.',
    sealText: 'RSVP',
    openHint: 'Ochish uchun bosing',
    successText: 'Rahmat! Javobingiz qabul qilindi.',
  },
  gift: {
    enabled: true,
    title: 'Toʻyona',
    cardNumber: '8600 **** **** 5678',
    cardHolder: 'NODIR KARIMOV',
    copyLabel: 'Karta raqamini nusxalash',
    copiedLabel: 'Nusxalandi!',
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
    title: 'Sizni koʻrishdan xursand boʻlaman!',
    signature: 'Nodir',
    photo: '',
  },
  music: {
    enabled: true,
    src: '/music.mp3',
  },
  petals: {
    enabled: true,
    count: 16,
  },
} as const

export type Config = typeof config
