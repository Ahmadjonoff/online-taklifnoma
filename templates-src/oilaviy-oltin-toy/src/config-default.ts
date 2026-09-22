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
    kicker: 'Oltin to\'y',
  },

  /* ------------------------------------------------------------------ ANIMATSIYA */
  petals: {
    enabled: true,
    /** Ekrandagi barglar soni. Sekin telefonlarda 8-10 tavsiya etiladi. */
    count: 10,
  },
} as const

export type Config = typeof config
