export const config = {
  couple: {
    groom: 'Bobur',
    bride: 'Shahlo',
    monogram: 'B&Sh',
  },
  event: {
    dateISO: '2027-08-30T10:00:00',
    dateLabel: '30.08.2027',
    timeLabel: '10:00',
    kicker: 'Kelin salom marosimi',
  },
  blessing: {
    arabic: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    lines: ['Oilaga yangi gul qoʻshildi', 'Kelin salomga marhamat!'],
    source: '',
    greeting: 'Hurmatli qarindoshlar!',
    text: 'Yangi xonadonimizga qadam qoʻygan kelinimizning salomini olish, oilamiz quvonchiga sherik boʻlish va ezgu duolaringiz ila davramizni fayzli qilish uchun Sizni "Kelin salom" marosimimizga lutfan taklif etamiz. Tashrifingiz xonadonimizga fayz va qut-baraka bagʻishlaydi.',
    heart: true,
  },
  countdown: {
    title: 'Marosimgacha qoldi',
    finishedText: 'Bugun kelin salom kuni!',
  },
  timeline: {
    title: 'Marosim tartibi',
    items: [
      { time: '10:00', label: 'Mehmonlar kelishi' },
      { time: '10:30', label: 'Kelin salom marosimi' },
      { time: '11:00', label: 'Tabriklar' },
      { time: '11:30', label: 'Nonushta dasturxoni' },
      { time: '13:00', label: 'Xayrlashuv' },
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
    name: 'Kuyov ota uyi',
    address: 'Andijon, Bog\'ishamol mahallasi',
    googleMapsUrl: '',
    yandexMapsUrl: '',
  },
  notes: [
    {
      title: 'Sovgʻa haqida',
      text: 'Oila uchun uy jihozlari — eng yaxshi sovg\'a',
    },
    {
      title: 'Kiyinish uslubi (Dress-kod)',
      text: 'Milliy libosda keling',
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
    copyLabel: 'Karta raqamini nusxalash',
    copiedLabel: 'Nusxalandi!',
  },
  wishes: {
    enabled: true,
    title: 'Ezgu tilaklar',
    namePlaceholder: 'Ismingizni kiriting',
    messagePlaceholder: 'Kelin-kuyovga samimiy tilaklaringizni yozing...',
    submitLabel: 'Tilak yuborish',
    successText: 'Tilagingiz uchun rahmat!',
  },
  footer: {
    title: 'Sizni kutib qolamiz!',
    signature: 'Bobur va Shahlo',
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
