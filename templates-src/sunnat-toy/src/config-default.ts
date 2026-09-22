export const config = {
  couple: {
    groom: 'Muhammad Ismoil',
    bride: '',
    monogram: '☪',
  },
  event: {
    dateISO: '2027-09-05T17:00:00',
    dateLabel: '05.09.2027',
    timeLabel: '17:00',
    kicker: 'Sunnat toʻyi',
  },
  blessing: {
    arabic: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    lines: ['Farzandimiz sunnat toʻyiga', 'Sizni taklif qilamiz!'],
    source: '',
    greeting: 'Aziz qarindosh va doʻstlar!',
    text: 'Farzandimiz Muhammad Ismoilning sunnat toʻyi munosabati bilan yoziladigan dasturxonimizga tashrif buyurib, aziz mehmonimiz boʻlishingizni hamda farzandimiz haqiga ezgu duolar qilishingizni soʻraymiz.',
    heart: false,
  },
  countdown: {
    title: 'Toʻygacha qoldi',
    finishedText: 'Bugun sunnat toʻyi!',
  },
  timeline: {
    title: 'Dastur',
    items: [
      { time: '17:00', label: 'Mehmonlar kutib olish' },
      { time: '17:30', label: 'Qur\'on tilovati' },
      { time: '18:00', label: 'Tabriklar va duo' },
      { time: '18:30', label: 'Dasturxon' },
      { time: '20:00', label: 'Xayrlashuv' },
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
    name: 'Oila bog\'i to\'yxonasi',
    address: 'Farg\'ona',
    googleMapsUrl: '',
    yandexMapsUrl: '',
  },
  notes: [
    {
      title: 'Sovgʻa haqida',
      text: 'Eng yaxshi sovg\'a — ezgu duolaringiz',
    },
    {
      title: 'Kiyinish uslubi',
      text: 'Milliy liboslar tavsiya etiladi',
    },
  ],
  rsvp: {
    enabled: true,
    title: 'Ishtirokni tasdiqlang',
    text: 'Iltimos, kelishingizni tasdiqlang.',
    sealText: 'RSVP',
    openHint: 'Ochish uchun bosing',
    successText: 'Rahmat! Javobingiz qabul qilindi.',
  },
  gift: {
    enabled: false,
    title: 'Toʻyona',
    cardNumber: '',
    cardHolder: '',
    copyLabel: 'Nusxalash',
    copiedLabel: 'Nusxalandi!',
  },
  wishes: {
    enabled: true,
    title: 'Duo va tilaklar',
    namePlaceholder: 'Ismingizni kiriting',
    messagePlaceholder: 'Ezgu tilaklaringizni yozing...',
    submitLabel: 'Yuborish',
    successText: 'Rahmat!',
  },
  footer: {
    title: 'Duolaringizni kutamiz!',
    signature: 'Karimov oilasi',
    photo: '',
  },
  music: {
    enabled: true,
    src: '/music.mp3',
  },
  petals: {
    enabled: true,
    count: 14,
  },
} as const

export type Config = typeof config
