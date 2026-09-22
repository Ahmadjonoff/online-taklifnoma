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
    kicker: 'Beshik to\'yi',
  },

  /* ------------------------------------------------------------------ ANIMATSIYA */
  petals: {
    enabled: true,
    /** Ekrandagi barglar soni. Sekin telefonlarda 8-10 tavsiya etiladi. */
    count: 12,
  },
} as const

export type Config = typeof config
