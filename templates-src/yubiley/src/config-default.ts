export const config = {
  couple: {
    groom: 'Rustam',
    bride: '',
    monogram: '50',
  },
  event: {
    dateISO: '2027-05-18T19:00:00',
    dateLabel: '18.05.2027',
    timeLabel: '19:00',
    kicker: 'Yubiley kechasi',
  },
  blessing: {
    arabic: '',
    lines: ['Umrning eng goʻzal sahifasi —', '50 yil mazmunli hayot!'],
    source: '',
    greeting: 'Aziz doʻstlar va qadrdon yaqinlar!',
    text: 'Hayotimning 50 yilligiga bagʻishlangan tantanali kechada sizni koʻrishdan behad baxtiyorman. Shu yillar davomida yonimda boʻlgan har bir insonga minnatdorchilik bildirish uchun, ushbu quvonchli oqshomda birga boʻlishingizni soʻraymiz.',
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
      { time: '19:30', label: 'Tabriklar va nutqlar' },
      { time: '20:00', label: 'Kechki ziyofat' },
      { time: '21:00', label: 'Tort marosimi' },
      { time: '21:30', label: 'Raqs va musiqa' },
    ],
  },
  /* -------------------------------------------------------------------- GALEREYA */
  gallery: {
    enabled: false,
    title: 'Yillar aro suratlar',
    /** public/ papkasiga rasm tashlab, shu yerga yo'llarini yozing: ['/g1.jpg', ...] */
    photos: [] as string[],
  },

  /* ----------------------------------------------------------------- KATTA RAQAM */
  bigNumber: {
    enabled: true,
    value: '50',
    title: 'Yillar aro yurilgan yoʻl',
    subtitle: 'Har bir yil — yangi tajriba, yangi quvonch va qadrdon insonlar bilan oʻtgan yaxshi xotiralar.',
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
    address: 'Buxoro shahri',
    googleMapsUrl: '',
    yandexMapsUrl: '',
  },
  notes: [
    {
      title: 'Kiyinish uslubi',
      text: 'Dress-kod: Elegant evening',
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
    title: 'Sovgʻa',
    cardNumber: '',
    cardHolder: '',
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
    signature: 'Rustam',
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
