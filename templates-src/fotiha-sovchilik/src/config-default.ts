/* ============================================================================
 *  TAKLIFNOMA SOZLAMALARI — FOTIHA / SOVCHILIK
 *  ---------------------------------------------------------------------------
 *  Taklifnomani moslashtirish uchun FAQAT shu faylni tahrirlang.
 *  Boshqa hech qaysi faylga tegish shart emas.
 * ==========================================================================*/

export const config = {
  /* ---------------------------------------------------------------- KELIN-KUYOV */
  couple: {
    groom: 'Sardor',
    bride: 'Madina',
    /** Muhr ustidagi monogramma. Odatda ismlarning bosh harflari. */
    monogram: 'S&M',
  },

  /* ---------------------------------------------------------------------- SANA */
  event: {
    /** ISO formatda: YYYY-MM-DDTHH:mm:ss — countdown shu sanadan hisoblaydi. */
    dateISO: '2026-11-14T18:00:00',
    /** Ekranda ko'rinadigan sana matni. */
    dateLabel: '14.11.2026',
    timeLabel: '18:00',
    /** Hero ustidagi kichik yozuv. */
    kicker: 'Fotiha marosimi',
  },

  /* -------------------------------------------------------------------- MUROJAAT */
  blessing: {
    /** Arabcha matn. Bo'sh qoldirsangiz — ko'rinmaydi. */
    arabic: '',
    /** Har biri alohida qatorda, yozma shriftda chiqadi. */
    lines: ['Ikki oilaning', 'quvonchli kuni'],
    /** Oyat manbasi. Bo'sh qoldirsangiz — ko'rinmaydi. */
    source: '',
    greeting: 'Aziz qarindosh va yaqinlar!',
    text: 'Farzandlarimizning fotiha marosimi munosabati bilan uyushtiriladigan oilaviy suhbatga Sizni taklif etishdan behad xursandmiz. Ushbu quvonchli kunda yonimizda boʻlib, ezgu duolaringiz bilan bizga hamroh boʻling.',
    /** Matn oxiridagi oltin yurakcha. Kerak bo'lmasa — `false`. */
    heart: true,
  },

  /* -------------------------------------------------------------------- COUNTDOWN */
  countdown: {
    title: 'Marosimgacha qoldi',
    /** Sana o'tib ketganda ko'rinadigan matn. */
    finishedText: 'Bugun fotiha kuni!',
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
    name: 'Oila mehmonxonasi',
    /**
     * Bo'sh qoldirsangiz — ekranda ko'rinmaydi, faqat joy nomi chiqadi.
     */
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

  /* ---------------------------------------------------------------------- TO'YONA */
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
    enabled: false,
    title: 'Tilaklar daftari',
    namePlaceholder: 'Ismingizni kiriting',
    messagePlaceholder: 'Xabaringizni yozing',
    submitLabel: 'Xabar yuborish',
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
