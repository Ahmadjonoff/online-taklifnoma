export const config = {
  couple: {
    groom: 'Karimovlar oilasi',
    bride: '',
    monogram: 'K',
  },
  event: {
    dateISO: '2027-06-12T13:00:00',
    dateLabel: '12.06.2027',
    timeLabel: '13:00',
    kicker: 'Oilaviy yigʻilish',
  },
  blessing: {
    arabic: '',
    lines: ['Barchamiz birga', 'yigʻilamiz!'],
    source: '',
    greeting: 'Aziz qarindoshlar!',
    text: 'Butun oilamiz birga yigʻilib, quvonchli damlarni baham koʻrish uchun Sizni ushbu oilaviy marosimga lutfan taklif etamiz. Yaqinlarimiz bilan birga oʻtirib, suhbatlashib, xotira qoldiramiz.',
    heart: false,
  },
  countdown: {
    title: 'Tadbirgacha qoldi',
    finishedText: 'Bugun tadbir kuni!',
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
    name: 'Oila bogʻi',
    address: 'Andijon shahri',
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
    title: 'Sovgʻa',
    cardNumber: '',
    cardHolder: '',
    copyLabel: 'Karta raqamini nusxalash',
    copiedLabel: 'Nusxalandi!',
  },
  wishes: {
    enabled: false,
    title: 'Ezgu tilaklar',
    namePlaceholder: 'Ismingizni kiriting',
    messagePlaceholder: 'Xabaringizni yozing',
    submitLabel: 'Xabar yuborish',
    successText: 'Tilagingiz uchun rahmat!',
  },
  footer: {
    title: 'Sizni kutib qolamiz!',
    signature: 'Karimovlar oilasi',
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
