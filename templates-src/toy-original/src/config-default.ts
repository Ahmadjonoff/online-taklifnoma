/* ============================================================================
 *  TAKLIFNOMA SOZLAMALARI
 *  ---------------------------------------------------------------------------
 *  Taklifnomani moslashtirish uchun FAQAT shu faylni tahrirlang.
 *  Boshqa hech qaysi faylga tegish shart emas.
 * ==========================================================================*/

export const config = {
  /* ---------------------------------------------------------------- KELIN-KUYOV */
  couple: {
    groom: 'Adhamjon',
    bride: 'Nargiza',
    /** Muhr ustidagi monogramma. Odatda ismlarning bosh harflari. */
    monogram: 'A&N',
  },

  /* ---------------------------------------------------------------------- SANA */
  event: {
    /** ISO formatda: YYYY-MM-DDTHH:mm:ss — countdown shu sanadan hisoblaydi. */
    dateISO: '2026-08-22T19:00:00',
    /** Ekranda ko'rinadigan sana matni. */
    dateLabel: '22.08.2026',
    timeLabel: '19:00',
    /** Hero ustidagi kichik yozuv. */
    kicker: 'Nikoh kuni',
  },

  /* -------------------------------------------------------------------- MUROJAAT */
  blessing: {
    /** Arabcha matn. Bo'sh qoldirsangiz — ko'rinmaydi. */
    arabic: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    /** Har biri alohida qatorda, yozma shriftda chiqadi. */
    lines: ['Alloh ularning qalbini', 'sevgi ila birlashtirdi'],
    /** Oyat manbasi. Bo'sh qoldirsangiz — ko'rinmaydi. */
    source: 'Anfol surasi, 63-oyat',
    greeting: 'Aziz doʻstlar va qarindoshlar!',
    text: 'Baʼzi uchrashuvlar tasodif emas, taqdirning goʻzal bitigidir. Alloh bizning qalblarimizni mehr ila birlashtirib, yoʻllarimizni bir umrga tutashtirdi. Hayotimizning eng baxtli kunida Sizni ham yonimizda koʻrish, quvonchimizni Siz bilan baham koʻrish biz uchun katta baxtdir. Ushbu muborak oqshomda duolaringiz va ezgu tilaklaringiz bilan bizga hamroh boʻling.',
    /** Matn oxiridagi oltin yurakcha. Kerak bo'lmasa — `false`. */
    heart: true,
  },

  /* -------------------------------------------------------------------- COUNTDOWN */
  countdown: {
    title: 'Bayramgacha qoldi',
    /** Sana o'tib ketganda ko'rinadigan matn. */
    finishedText: 'Bugun bizning kunimiz!',
  },

  /* ---------------------------------------------------------------------- DASTUR */
  timeline: {
    title: 'Kechaning tartibi',
    /**
     * Qatorlar soni ixtiyoriy — qo'shsangiz avtomatik chiziladi.
     * DIQQAT: bu vaqtlar 19:00 boshlanishiga qarab taxminan qo'yilgan —
     * o'zingizning haqiqiy tartibingizga moslab tuzatib chiqing.
     */
    items: [
      { time: '19:00', label: 'Mehmonlarni kutib olish' },
      { time: '19:30', label: 'Nikoh marosimi' },
      { time: '20:00', label: 'Tabriklar' },
      { time: '20:30', label: 'Kechki ziyofat' },
      { time: '21:30', label: 'Raqs va musiqa' },
    ],
  },

  /* ---------------------------------------------------------------------- MANZIL */
  venue: {
    title: 'Manzil',
    name: 'Parizod toʻyxonasi',
    /**
     * Shahar Yandex havolasidagi `/chust/` dan olindi — ko'cha nomi va
     * mo'ljalni o'zingiz qo'shib qo'ying, mehmonlarga qulay bo'ladi.
     * Bo'sh qoldirsangiz — ekranda ko'rinmaydi, faqat to'yxona nomi chiqadi.
     */
    address: 'Namangan viloyati, Chust shahri',
    /** Aniq nuqta: 41.011293, 71.225307 */
    googleMapsUrl:
      "https://www.google.com/maps/place/41%C2%B000'40.7%22N+71%C2%B013'31.1%22E/@41.011293,71.2227321,17z/data=!3m1!4b1!4m4!3m3!8m2!3d41.011293!4d71.225307",
    yandexMapsUrl:
      'https://yandex.uz/maps/189938/chust/?ll=71.225884%2C41.011446&mode=search&sll=71.225306%2C41.011306&text=41.011306%2C71.225306&z=18.81',
  },

  /* ----------------------------------------------------------------- QO'SHIMCHA */
  notes: [
    {
      title: 'Sovgʻa haqida',
      text: 'Eng qimmatli sovgʻa — sizning ishtirokingiz.',
    },
  ],

  /* ------------------------------------------------------------------------ RSVP */
  rsvp: {
    // So'rov kerak emas — bo'lim ko'rinmaydi.
    enabled: false,
    title: 'Ishtirokni tasdiqlang',
    text: 'Bayramga yaxshi tayyorgarlik koʻrishimiz uchun, iltimos, kelishingizni tasdiqlang.',
    sealText: 'RSVP',
    openHint: 'Ochish uchun bosing',
    /** Javob yuborilgandan keyingi rahmat matni. */
    successText: 'Rahmat! Javobingiz qabul qilindi.',
  },

  /* ---------------------------------------------------------------------- TO'YONA */
  gift: {
    /**
     * O'chirilgan: avvalgi demo raqam boshqa odamga tegishli edi, shuning uchun
     * olib tashlandi. Bu bo'lim kerak bo'lsa — o'z kartangizni yozib,
     * `enabled` ni `true` qiling.
     */
    enabled: false,
    title: 'Toʻyona',
    cardNumber: '',
    cardHolder: '',
    copyLabel: 'Karta raqamini nusxalash',
    copiedLabel: 'Nusxalandi!',
  },

  /* ---------------------------------------------------------------- TILAKLAR */
  wishes: {
    // Kerak emas — bo'lim ko'rinmaydi.
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
    /** Bo'sh qoldirsangiz — kelin-kuyov ismi avtomatik qo'yiladi. */
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
    count: 12,
  },
} as const

export type Config = typeof config
