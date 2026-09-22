/* ============================================================================
 *  TAKLIFNOMA SOZLAMALARI — NIKOH YILLIGI (ANNIVERSARY)
 *  ---------------------------------------------------------------------------
 *  Taklifnomani moslashtirish uchun FAQAT shu faylni tahrirlang.
 *  Boshqa hech qaysi faylga tegish shart emas.
 * ==========================================================================*/

export const config = {
  /* ---------------------------------------------------------------- ER-XOTIN */
  couple: {
    groom: 'Jahongir',
    bride: 'Zarina',
    /** Muhr ustidagi monogramma. Odatda ismlarning bosh harflari. */
    monogram: '10',
  },

  /* ---------------------------------------------------------------------- SANA */
  event: {
    /** ISO formatda: YYYY-MM-DDTHH:mm:ss — countdown shu sanadan hisoblaydi. */
    dateISO: '2026-10-03T19:00:00',
    /** Ekranda ko'rinadigan sana matni. */
    dateLabel: '03.10.2026',
    timeLabel: '19:00',
    /** Hero ustidagi kichik yozuv. */
    kicker: '10 yillik nikoh sanamiz',
  },

  /* -------------------------------------------------------------------- BIZNING HIKOYAMIZ */
  blessing: {
    /** Arabcha matn. Bo'sh qoldirsangiz — ko'rinmaydi. */
    arabic: '',
    /** Har biri alohida qatorda, yozma shriftda chiqadi. */
    lines: ['10 yil sevgi,', 'sabr va baxt'],
    /** Oyat manbasi. Bo'sh qoldirsangiz — ko'rinmaydi. */
    source: '',
    greeting: 'Aziz doʻstlar va qarindoshlar!',
    text: 'Nikohimizning 10 yilligini nishonlash uchun sizni ushbu quvonchli kechaga taklif qilamiz. Shu yillar davomida yonimizda boʻlgan har biringizga minnatdormiz — kelib, quvonchimizni biz bilan baham koʻring.',
    /** Matn oxiridagi oltin yurakcha. Kerak bo'lmasa — `false`. */
    heart: true,
  },

  /* -------------------------------------------------------------------- COUNTDOWN */
  countdown: {
    title: 'Kechagacha qoldi',
    /** Sana o'tib ketganda ko'rinadigan matn. */
    finishedText: 'Bugun bizning kunimiz!',
  },

  /* ------------------------------------------------------------------- BIZNING YO'LIMIZ */
  timeline: {
    title: 'Bizning yoʻlimiz',
    /**
     * Bu yerda vaqt o'rniga yil, matn o'rniga hikoya lahzasi yoziladi —
     * Timeline komponenti ikkalasini bir xil chizadi.
     */
    items: [
      { time: '2014', label: 'Birinchi uchrashuv' },
      { time: '2015', label: 'Unashtiruv' },
      { time: '2016', label: 'Toʻy kuni' },
      { time: '2019', label: 'Birinchi farzandimiz' },
      { time: '2026', label: '10 yil birga' },
    ],
  },

  /* -------------------------------------------------------------------- GALEREYA */
  gallery: {
    enabled: false,
    title: 'Eski va yangi suratlar',
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

  /* ---------------------------------------------------------------------- MANZIL */
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
    name: 'Family Hall toʻyxonasi',
    address: 'Toshkent shahri',
    googleMapsUrl: '',
    yandexMapsUrl: '',
  },

  /* ----------------------------------------------------------------- QO'SHIMCHA */
  notes: [] as Array<{ title: string; text: string }>,

  /* ------------------------------------------------------------------------ RSVP */
  rsvp: {
    enabled: true,
    title: 'Ishtirokni tasdiqlang',
    text: 'Yaxshi tayyorgarlik koʻrishimiz uchun, iltimos, kelishingizni tasdiqlang.',
    sealText: 'RSVP',
    openHint: 'Ochish uchun bosing',
    /** Javob yuborilgandan keyingi rahmat matni. */
    successText: 'Rahmat! Javobingiz qabul qilindi.',
  },

  /* ---------------------------------------------------------------------- SOVGʻA */
  gift: {
    enabled: false,
    title: 'Sovgʻa',
    cardNumber: '',
    cardHolder: '',
    copyLabel: 'Karta raqamini nusxalash',
    copiedLabel: 'Nusxalandi!',
  },

  /* ---------------------------------------------------------------- TILAKLAR */
  wishes: {
    enabled: true,
    title: 'Ezgu tilaklar',
    namePlaceholder: 'Ismingizni kiriting',
    messagePlaceholder: 'Bizga tilaklaringizni yozing...',
    submitLabel: 'Tilak yuborish',
    successText: 'Tilagingiz uchun rahmat!',
  },

  /* ---------------------------------------------------------------------- FOOTER */
  footer: {
    title: 'Sizni koʻrishdan baxtiyor boʻlamiz!',
    /** Bo'sh qoldirsangiz — ismlar avtomatik qo'yiladi. */
    signature: '',
    /** public/ papkasiga rasm tashlab, shu yerga nomini yozing: '/photo.jpg' */
    photo: '',
  },

  /* ----------------------------------------------------------------- FON MUSIQASI */
  music: {
    enabled: true,
    /** public/ papkasiga mp3 tashlang va yo'lini yozing: '/music.mp3' */
    src: '/music.mp3',
  },

  /* ------------------------------------------------------------------ ANIMATSIYA */
  petals: {
    enabled: true,
    /** Ekrandagi barglar soni. Sekin telefonlarda 8-10 tavsiya etiladi. */
    count: 10,
  },
} as const

export type Config = typeof config
