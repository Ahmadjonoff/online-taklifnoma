export const config = {
  couple: {
    groom: '',
    bride: 'Zulfiya',
    monogram: '✨',
  },
  event: {
    dateISO: '2027-07-12T16:00:00',
    dateLabel: '12.07.2027',
    timeLabel: '16:00',
    kicker: 'Beshik toʻyi',
  },
  blessing: {
    arabic: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    lines: ['Yangi mehmon keldi olamga', 'Beshik toʻyiga marhamat!'],
    source: '',
    greeting: 'Qadrli mehmonlar!',
    text: 'Jajji farzandimizning beshikka belash marosimida ishtirok etish va unga ezgu duolar qilish uchun barchangizni lutfan taklif qilamiz.',
    heart: true,
  },
  countdown: {
    title: 'Marosimgacha qoldi',
    finishedText: 'Bugun beshik toʻyi!',
  },
  timeline: {
    title: 'Marosim tartibi',
    items: [
      { time: '16:00', label: 'Mehmonlar kutib olish' },
      { time: '16:30', label: 'Beshik marosimi' },
      { time: '17:00', label: 'Duo va tabriklar' },
      { time: '17:30', label: 'Dasturxon' },
      { time: '19:00', label: 'Xayrlashuv' },
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
    name: 'Oila uyida',
    address: 'Namangan',
    googleMapsUrl: '',
    yandexMapsUrl: '',
  },
  notes: [
    {
      title: 'Sovgʻa haqida',
      text: 'Chaqaloq uchun kiyimlar — eng yaxshi sovgʻa.',
    },
    {
      title: 'Kiyinish uslubi',
      text: 'Qulay kiyimda keling.',
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
    enabled: false,
    title: 'Toʻyona',
    cardNumber: '',
    cardHolder: '',
    copyLabel: 'Nusxalash',
    copiedLabel: 'Nusxalandi!',
  },
  wishes: {
    enabled: true,
    title: 'Tilak va duolar',
    namePlaceholder: 'Ismingizni kiriting',
    messagePlaceholder: 'Samimiy tilaklaringizni yozing...',
    submitLabel: 'Tilak yuborish',
    successText: 'Tilagingiz uchun rahmat!',
  },
  footer: {
    title: 'Quvonchimizni baham koʻring!',
    signature: 'Rahimov oilasi',
    photo: '',
  },
  music: {
    enabled: true,
    src: '/music.mp3',
  },
  petals: {
    enabled: true,
    count: 12,
  },
} as const;

export type Config = typeof config;
