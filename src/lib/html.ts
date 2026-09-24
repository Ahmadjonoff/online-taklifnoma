/**
 * Foydalanuvchi matnini `<script>` ichiga JSON sifatida qo'yish.
 *
 * Faqat `</script` ni escape qilish yetarli emas: `<!--` va `<script`
 * ketma-ketligi HTML parser'ni "escaped" holatga o'tkazib, sahifani buzishi
 * mumkin. Har bir `<` ni `<` ga almashtiramiz — JSON ma'nosi o'zgarmaydi,
 * brauzer esa hech qanday tegni ko'rmaydi.
 */
export function scriptJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
