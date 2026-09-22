export const config = {
  couple: {
    groom: 'Lumina Beauty Clinic',
    bride: '',
    monogram: 'L',
  },
  event: {
    dateISO: '2027-05-01T11:00:00',
    dateLabel: '01.05.2027',
    timeLabel: '11:00',
    kicker: 'Katta ochilish',
  },
  blessing: {
    arabic: '',
    lines: [] as string[],
    source: '',
    greeting: '',
    text: 'Shaharning yangi goʻzallik klinikasi — Lumina Beauty Clinic ochilishi munosabati bilan Sizni tantanali marosimga taklif qilamiz. Zamonaviy uskunalar, professional mutaxassislar va Sizga maxsus sovgʻalar kutmoqda.',
    heart: false,
  },
  countdown: {
    title: 'Ochilishgacha qoldi',
    finishedText: 'Bugun katta ochilish!',
  },
  timeline: {
    title: 'Dastur',
    items: [
      { time: '11:00', label: 'Mehmonlarni kutib olish' },
      { time: '11:30', label: 'Lenta kesish marosimi' },
      { time: '12:00', label: 'Klinika bilan tanishuv' },
      { time: '13:00', label: 'Fursh va sovgʻalar' },
    ],
  },
  /* -------------------------------------------------------------------- GALEREYA */
  gallery: {
    enabled: true,
    title: 'Klinikamiz',
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
    badge: 'Faqat ochilish kuni',
    title: 'Birinchi tashrif — 30% chegirma',
    text: 'Ochilish kuni tashrif buyurgan barcha mijozlarimizga barcha xizmatlar uchun 30% chegirma taqdim etamiz.',
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
    name: 'Lumina Beauty Clinic',
    address: 'Toshkent shahri, Chilonzor tumani',
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
    title: 'Sizni kutib qolamiz!',
    signature: 'Lumina Beauty Clinic jamoasi',
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
