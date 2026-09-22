/**
 * Lug'at satrlaridagi `{token}` joy-tutuvchilarini almashtiradi.
 *
 * NEGA SHUNDAY: lug'at qiymatlari funksiya emas, oddiy satr bo'lishi kerak —
 * shunda kirill lug'ati `deepToCyrillicUz` bilan avtomatik, xavfsiz hosil
 * qilinadi (funksiyani transliteratsiya qilib bo'lmaydi).
 */
export function t(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match
  );
}
