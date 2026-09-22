export const config = {
  couple: {
    groom: 'Tech Forum 2027',
    bride: '',
    monogram: 'TF',
  },
  event: {
    dateISO: '2027-04-15T10:00:00',
    dateLabel: '15.04.2027',
    timeLabel: '10:00',
    kicker: 'Biznes konferensiya',
  },
  blessing: {
    arabic: '',
    lines: [] as string[],
    source: '',
    greeting: 'Hurmatli hamkasblar!',
    text: 'Kompaniyamiz tashkil etayotgan yillik biznes forumiga sizni taklif qilamiz. Soha yetakchilari bilan tajriba almashish, yangi aloqalar oʻrnatish va sohadagi eng dolzarb mavzularni muhokama qilish imkoniyati.',
    heart: false,
  },
  countdown: {
    title: 'Tadbirgacha qoldi',
    finishedText: 'Bugun tadbir kuni!',
  },
  timeline: {
    title: 'Dastur',
    items: [
      { time: '10:00', label: 'Roʻyxatdan oʻtish va kofe-brek' },
      { time: '10:30', label: 'Ochilish nutqi' },
      { time: '11:00', label: 'Asosiy sessiyalar' },
      { time: '13:00', label: 'Tushlik va networking' },
      { time: '14:00', label: 'Panel muhokamasi' },
      { time: '16:00', label: 'Yakunlash' },
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
      { name: 'Aziz Karimov', role: 'CEO, TechHub' },
      { name: 'Malika Yusupova', role: 'Marketing direktori' },
      { name: 'Bobur Rashidov', role: 'Mahsulot menejeri' },
      { name: 'Nilufar Saidova', role: 'Investitsiya analitigi' },
    ] as Array<{ name: string; role: string; photo?: string }>,
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
    name: 'International Business Center',
    address: 'Toshkent shahri, Amir Temur shoh koʻchasi',
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
    title: 'Tadbirda koʻrishguncha!',
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
