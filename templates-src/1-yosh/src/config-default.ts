export const config = {
  couple: {
    groom: '',
    bride: 'Amira',
    monogram: '1',
  },
  event: {
    dateISO: '2027-03-02T15:00:00',
    dateLabel: '02.03.2027',
    timeLabel: '15:00',
    kicker: 'Birinchi tugʻilgan kunimiz',
  },
  blessing: {
    arabic: '',
    lines: ['Bir yil oldin', 'hayotimiz yorishdi'],
    source: '',
    greeting: 'Aziz qarindosh va doʻstlar!',
    text: 'Bir yil oldin hayotimizga kirib, uni yorugʻ va maʼnoli qilgan qizaloqimiz Amiraning birinchi tugʻilgan kunini nishonlaymiz. Ushbu quvonchli lahzada Sizni ham yonimizda koʻrishni istaymiz.',
    heart: true,
  },
  countdown: {
    title: 'Bayramgacha qoldi',
    finishedText: 'Bugun bayram kuni!',
  },
  timeline: {
    title: 'Bayram dasturi',
    items: [
      { time: '15:00', label: 'Mehmonlar kelishi' },
      { time: '15:30', label: 'Tabriklar' },
      { time: '16:00', label: 'Tort marosimi' },
      { time: '16:30', label: 'Suratga tushish' },
    ],
  },
  /* -------------------------------------------------------------------- GALEREYA */
  gallery: {
    enabled: false,
    title: 'Bir yillik xotiralar',
    /** public/ papkasiga rasm tashlab, shu yerga yo'llarini yozing: ['/g1.jpg', ...] */
    photos: [] as string[],
  },

  /* ----------------------------------------------------------------- KATTA RAQAM */
  bigNumber: {
    enabled: true,
    value: '1',
    title: 'Bizning kichkintoyimiz',
    subtitle: 'Bir yil — kichik qadamlar, katta baxt va son-sanoqsiz yorugʻ lahzalar.',
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
    name: 'Kids Cafe',
    address: 'Samarqand shahri',
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
    title: 'Sovgʻa',
    cardNumber: '',
    cardHolder: '',
    copyLabel: 'Nusxalash',
    copiedLabel: 'Nusxalandi!',
  },
  wishes: {
    enabled: true,
    title: 'Ezgu tilaklar',
    namePlaceholder: 'Ismingizni kiriting',
    messagePlaceholder: 'Amiraga samimiy tilaklaringizni yozing...',
    submitLabel: 'Tilak yuborish',
    successText: 'Tilagingiz uchun rahmat!',
  },
  footer: {
    title: 'Sizni koʻrishdan baxtiyor boʻlamiz!',
    signature: 'Amira va oilasi',
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
