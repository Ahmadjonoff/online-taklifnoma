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
    kicker: 'Qurbon hayit',
  },

  /* ------------------------------------------------------------------ ANIMATSIYA */
  petals: {
    enabled: true,
    /** Ekrandagi barglar soni. Sekin telefonlarda 8-10 tavsiya etiladi. */
    count: 10,
  },
} as const

export type Config = typeof config
