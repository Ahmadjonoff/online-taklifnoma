/**
 * Lotin yozuvidagi o'zbekcha matnni kirill yozuviga o'giradi.
 *
 * NEGA SHUNDAY: kirill lug'atini alohida qo'lda yozib, ikkalasini sinxron
 * saqlash xatoga moyil va qo'sh mehnat. O'zbek lotin->kirill o'girilishi
 * deyarli mexanik (bir nechta diagraf bundan mustasno) bo'lgani uchun `uz`
 * lug'ati yagona manba bo'lib qoladi, kirill esa shundan avtomatik hosil
 * qilinadi (@/lib/i18n/dictionary).
 */

const APOSTROPHES = new Set(["'", "ʻ", "ʼ", "‘", "’", "`"]);

/**
 * Xalqaro brend nomlari va qisqartmalar — o'zbek kirillida ham odatda lotin
 * yozuvida qoldiriladi ("Telegram", "QR" kabi so'zlar mexanik harflab
 * o'girilsa, "Телеграм"/"ҚР" kabi noto'g'ri natija chiqadi). Uzunroqlari
 * oldin tekshiriladi, shu sabab uzunlik bo'yicha kamayish tartibida.
 */
const NO_TRANSLITERATE = ["WhatsApp", "Telegram", "RSVP", "Online", "QR", "SMS", "URL"].sort(
  (a, b) => b.length - a.length
);

function isWordChar(ch: string | undefined): boolean {
  return !!ch && /[a-zA-Z0-9]/.test(ch);
}

/** Ikki harfli diagraflar — har biri bitta kirill harfiga mos keladi. */
const DIGRAPHS: Array<[string, string]> = [
  ["sh", "ш"],
  ["ch", "ч"],
  ["yo", "ё"],
  ["yu", "ю"],
  ["ya", "я"],
];

const SINGLE: Record<string, string> = {
  a: "а",
  b: "б",
  d: "д",
  e: "е",
  f: "ф",
  g: "г",
  h: "ҳ",
  i: "и",
  j: "ж",
  k: "к",
  l: "л",
  m: "м",
  n: "н",
  o: "о",
  p: "п",
  q: "қ",
  r: "р",
  s: "с",
  t: "т",
  u: "у",
  v: "в",
  x: "х",
  y: "й",
  z: "з",
  // Standart o'zbek lotin alifbosida yo'q, lekin nom/atama sifatida uchrashi
  // mumkin — eng yaqin talaffuzga moslab beriladi.
  c: "к",
  w: "в",
};

function applyCase(latinSample: string, cyr: string): string {
  const isAllUpper = latinSample === latinSample.toUpperCase() && latinSample !== latinSample.toLowerCase();
  if (isAllUpper) return cyr.toUpperCase();
  const firstIsUpper = latinSample[0] === latinSample[0].toUpperCase() && latinSample[0] !== latinSample[0].toLowerCase();
  if (firstIsUpper) return cyr[0].toUpperCase() + cyr.slice(1);
  return cyr;
}

/** Bitta so'z/satrni lotin-o'zbekchadan kirill-o'zbekchaga o'giradi. */
export function toCyrillicUz(text: string): string {
  let out = "";
  let i = 0;
  const lower = text.toLowerCase();

  while (i < text.length) {
    const ch = text[i];
    const chLower = lower[i];

    // `{token}` joy-tutuvchilar (masalan "{total}", "{highlight}") — bular
    // @/lib/i18n/format.ts orqali dasturiy ravishda almashtiriladi, shu
    // sababli harflari o'zgarishsiz (lotin) qolishi SHART. Aks holda
    // "{highlight}" "{ҳигҳлигҳт}"ga aylanib, keyin hech narsaga mos
    // kelmay qoladi.
    if (ch === "{") {
      const close = text.indexOf("}", i);
      if (close !== -1) {
        out += text.slice(i, close + 1);
        i = close + 1;
        continue;
      }
    }

    // Xalqaro brend/qisqartma so'zlar — faqat so'z chegarasida (oldingi va
    // keyingi belgi harf/raqam bo'lmasa) va katta-kichik harfdan qat'i nazar.
    const wordMatch = NO_TRANSLITERATE.find(
      (w) =>
        lower.startsWith(w.toLowerCase(), i) &&
        !isWordChar(text[i - 1]) &&
        !isWordChar(text[i + w.length])
    );
    if (wordMatch) {
      out += text.slice(i, i + wordMatch.length);
      i += wordMatch.length;
      continue;
    }

    // o' / g' — apostrofning bir nechta unicode ko'rinishini hisobga oladi
    if ((chLower === "o" || chLower === "g") && i + 1 < text.length && APOSTROPHES.has(text[i + 1])) {
      out += applyCase(ch, chLower === "o" ? "ў" : "ғ");
      i += 2;
      continue;
    }

    if (i + 1 < text.length) {
      const two = chLower + lower[i + 1];
      const digraph = DIGRAPHS.find(([lat]) => lat === two);
      if (digraph) {
        out += applyCase(text.slice(i, i + 2), digraph[1]);
        i += 2;
        continue;
      }
    }

    // Tutuq belgisi (masalan "san'at" -> "санъат")
    if (APOSTROPHES.has(ch)) {
      out += "ъ";
      i += 1;
      continue;
    }

    const mapped = SINGLE[chLower];
    if (mapped) {
      out += applyCase(ch, mapped);
      i += 1;
      continue;
    }

    // Harf bo'lmagan belgilar (bo'shliq, tinish belgilari, raqamlar,
    // emoji) o'zgarishsiz qoladi.
    out += ch;
    i += 1;
  }

  return out;
}

/** Chuqur (recursive) transliteratsiya — obyekt/massiv ichidagi barcha satr qiymatlarini o'giradi. */
export function deepToCyrillicUz<T>(value: T): T {
  if (typeof value === "string") {
    return toCyrillicUz(value) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((v) => deepToCyrillicUz(v)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = deepToCyrillicUz(v);
    }
    return out as T;
  }
  return value;
}
