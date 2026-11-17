/* ============================================================================
 *  UCHRASHUVGA TAKLIF — standart qiymatlar
 *  ---------------------------------------------------------------------------
 *  Platformada `config.ts` (shim) shu qiymatlar ustiga bazadagi buyurtmani
 *  qo'yadi (src/lib/invitationConfig.ts → buildInvitationConfig):
 *    couple.groom  — taklif qiluvchi (formadagi «Ism 1»)
 *    couple.bride  — taklif qilinuvchi (formadagi «Ism 2»)
 *    blessing.text — maktub matni
 *    venue.name    — taklif qilinayotgan joy (birinchi variant bo'lib chiqadi)
 *    timeline      — «Qachon?» variantlari: { time, label } → «label, time»
 *    event         — variantlar bo'lmasa: sana va vaqt
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
    kicker: 'Uchrashuvga taklif',
  },
  blessing: {
    lines: [] as string[],
    text: "Har bir kun siz bilan yanada mazmunli bo'lishiga ishonaman. Birga vaqt o'tkazsak, men uchun katta baxt bo'lardi.",
    greeting: '',
  },
  timeline: {
    title: 'Qachon?',
    items: [
      { time: '18:00', label: 'Shanba' },
      { time: '16:00', label: 'Yakshanba' },
    ] as { time: string; label: string }[],
  },
  venue: {
    title: 'Qayerga?',
    name: '',
    address: '',
    googleMapsUrl: '',
    yandexMapsUrl: '',
  },
  /** Joy variantlari — mijoz joy yozsa, u birinchi bo'lib qo'shiladi. */
  places: [
    { emoji: '☕', label: 'Kafe' },
    { emoji: '🍽️', label: 'Restoran' },
    { emoji: '🎬', label: 'Kino' },
    { emoji: '🌳', label: 'Sayr' },
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
