/* ============================================================================
 *  UCHRASHUVGA TAKLIF — standart qiymatlar
 *  ---------------------------------------------------------------------------
 *  Platformada `config.ts` (shim) shu qiymatlar ustiga bazadagi buyurtmani
 *  qo'yadi (src/lib/invitationConfig.ts → buildInvitationConfig):
 *    couple.groom  — taklif qiluvchi (formadagi «Ism 1»)
 *    couple.bride  — taklif qilinuvchi (formadagi «Ism 2»)
 *    blessing.text — maktub matni
 *    venue         — taklif qiluvchi tavsiya qilgan joy (birinchi variant; xarita havolasi bilan)
 *    event         — taklif qiluvchi tavsiya qilgan sana va vaqt (birinchi variantlar)
 *    timeline      — qo'shimcha vaqt variantlari (faqat `time`)
 *  Mehmon «Ha» degach: uchrashuv turi, joy, sana va vaqtni tanlaydi (yoki o'zi yozadi).
 * ==========================================================================*/

export const config = {
  couple: {
    groom: 'Jasur',
    bride: 'Madina',
    monogram: 'J&M',
  },
  event: {
    dateISO: '2026-12-19T18:00:00',
    dateLabel: '19.12.2026',
    timeLabel: '18:00',
    kicker: 'Shaxsiy taklif',
  },
  blessing: {
    lines: [] as string[],
    text: "Har bir kun siz bilan yanada mazmunli bo'lishiga ishonaman. Birga vaqt o'tkazsak, men uchun katta baxt bo'lardi.",
    greeting: '',
  },
  /** Taklif qiluvchi qo'shimcha vaqt variantlari bersa (buyurtmadagi dastur) — faqat `time` olinadi */
  timeline: {
    title: '',
    items: [] as { time: string; label: string }[],
  },
  venue: {
    title: 'Qayerga?',
    name: '',
    address: '',
    googleMapsUrl: '',
    yandexMapsUrl: '',
  },
  /** Uchrashuv turlari — mehmon «Ha» degach birini tanlaydi */
  places: [
    { icon: 'cafe', label: 'Kafe', note: 'Qahva va suhbat' },
    { icon: 'dinner', label: 'Kechki ovqat', note: 'Shinam restoranda' },
    { icon: 'cinema', label: 'Kino', note: 'Yangi film premyerasi' },
    { icon: 'walk', label: 'Oqshom sayri', note: 'Shahar chiroqlari ostida' },
  ],
  rsvp: { enabled: true },
  music: { enabled: false, src: '' },
  envelope: { kicker: '' },
  guest: { name: '' },
  promo: {
    enabled: true,
    title: '',
    text: '',
    siteUrl: 'https://online-taklifnoma-neon.vercel.app',
    siteLabel: 'Sayt',
    telegramUrl: '',
    instagramUrl: '',
  },
}
