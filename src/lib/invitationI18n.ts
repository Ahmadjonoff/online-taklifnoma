/**
 * Taklifnoma tili (Premium/Luxury): o'zbek (lotin), o'zbek (kirill), rus, ingliz.
 *
 * NEGA SAHIFADA TARJIMA: 40+ shablonning har birida o'zbekcha matnlar
 * (tugmalar, sarlavhalar, standart config) yozilgan. Ularni bittalab
 * tahrirlash o'rniga server taklifnomaga kichik skript qo'shadi — u sahifadagi
 * matnlarni (va placeholder/aria-label'larni) kuzatib, o'giradi:
 *  - kirill: hamma matn (mijoz yozgani ham) lotindan kirillga o'giriladi;
 *  - rus/ingliz: shablon matnlari lug'at bo'yicha tarjima qilinadi, mijozning
 *    o'z matni (ismlar, taklif matni) u yozgandek qoladi.
 */
import type { InvitationLang } from "./customization";

type Dict = Record<string, string>;

// Kalitlar: o'zbekcha matn (apostroflar ' ga keltirilgan). Qiymat: [rus, ingliz]
const T: Record<string, [string, string]> = {
  // Konvert / umumiy
  "Sizga taklifnoma keldi": ["Вам пришло приглашение", "You're invited"],
  "Ochish uchun bosing": ["Нажмите, чтобы открыть", "Tap to open"],
  "Ochish uchun muhrga bosing": ["Нажмите на печать, чтобы открыть", "Tap the seal to open"],
  "Muhrni bosib ochish": ["Открыть, нажав на печать", "Open by tapping the seal"],
  "BOSHLASH UCHUN BOSING": ["НАЖМИТЕ, ЧТОБЫ НАЧАТЬ", "TAP TO BEGIN"],
  "Taklifnomani ochish": ["Открыть приглашение", "Open the invitation"],
  "Pastga suring": ["Листайте вниз", "Scroll down"],
  "Musiqani yoqish": ["Включить музыку", "Play music"],
  "Musiqani to'xtatish": ["Выключить музыку", "Pause music"],
  "Yopish": ["Закрыть", "Close"],
  and: ["и", "and"],
  va: ["и", "and"],
  // Murojaat / duo
  "Aziz va qadrli insonimiz!": ["Дорогой и уважаемый гость!", "Dear and cherished guest!"],
  "Aziz Mehmonimiz": ["Дорогой гость", "Dear guest"],
  "Ushbu quvonchli kunda bizga hamroh bo'lishingizni va ezgu tilaklaringiz bilan duo qilishingizni so'raymiz.": [
    "Просим вас разделить с нами этот радостный день и благословить нас добрыми пожеланиями.",
    "We would be honoured to have you with us on this joyful day and to receive your kind wishes and blessings.",
  ],
  "Hurmat bilan,": ["С уважением,", "With respect,"],
  "Anfol surasi, 63-oyat": ["Сура «Аль-Анфаль», аят 63", "Surah Al-Anfal, verse 63"],
  // Sanoq
  "Tadbirgacha qoldi": ["До торжества осталось", "Counting down to the celebration"],
  "Bayramgacha qoldi": ["До праздника осталось", "Counting down to the celebration"],
  "Bugun katta kun!": ["Сегодня большой день!", "Today is the big day!"],
  "Bugun bizning kunimiz!": ["Сегодня наш день!", "Today is our day!"],
  Kun: ["Дней", "Days"],
  Soat: ["Часов", "Hours"],
  Daqiqa: ["Минут", "Minutes"],
  Soniya: ["Секунд", "Seconds"],
  // Kalendar va tafsilotlar
  "Sana va vaqt": ["Дата и время", "Date & time"],
  Kalendar: ["Календарь", "Calendar"],
  "Kalendarga qo'shish": ["Добавить в календарь", "Add to calendar"],
  "Qachon & Qayerda": ["Когда и где", "When & Where"],
  "To'y tafsilotlari": ["Детали торжества", "Celebration details"],
  Qachon: ["Когда", "When"],
  Qayerda: ["Где", "Where"],
  Marosim: ["Начало церемонии в", "Ceremony begins at"],
  "da boshlanadi": ["", ""],
  Sana: ["Дата", "Date"],
  Vaqt: ["Время", "Time"],
  Dastur: ["Программа", "Programme"],
  "Kun tartibi": ["Программа дня", "Schedule"],
  Manzil: ["Адрес", "Venue"],
  "Manzilni ko'rish": ["Посмотреть адрес", "View location"],
  "Yandex xarita": ["Яндекс Карты", "Yandex Maps"],
  "Google xarita": ["Google Карты", "Google Maps"],
  Yanvar: ["Январь", "January"],
  Fevral: ["Февраль", "February"],
  Mart: ["Март", "March"],
  Aprel: ["Апрель", "April"],
  May: ["Май", "May"],
  Iyun: ["Июнь", "June"],
  Iyul: ["Июль", "July"],
  Avgust: ["Август", "August"],
  Sentabr: ["Сентябрь", "September"],
  Oktabr: ["Октябрь", "October"],
  Noyabr: ["Ноябрь", "November"],
  Dekabr: ["Декабрь", "December"],
  Du: ["Пн", "Mo"],
  Se: ["Вт", "Tu"],
  Cho: ["Ср", "We"],
  Pa: ["Чт", "Th"],
  Ju: ["Пт", "Fr"],
  Sha: ["Сб", "Sa"],
  Ya: ["Вс", "Su"],
  // Hikoya, galereya, dress-kod, sovg'a
  "Bizning hikoyamiz": ["Наша история", "Our story"],
  "Bizning sayohatimiz": ["Наш путь", "Our journey"],
  "Bizning xotiralar": ["Наши воспоминания", "Our memories"],
  "Kiyinish uslubi": ["Дресс-код", "Dress code"],
  "Kiyim uslubi": ["Дресс-код", "Dress code"],
  "To'yona uchun": ["Для подарка", "For gifts"],
  "To'yona": ["Подарок", "Gift"],
  Nusxalash: ["Копировать", "Copy"],
  "Karta raqamini nusxalash": ["Скопировать номер карты", "Copy card number"],
  "Nusxalandi!": ["Скопировано!", "Copied!"],
  // RSVP
  "Ishtirokni tasdiqlang": ["Подтвердите присутствие", "Please RSVP"],
  "Dasturxonni to'g'ri tayyorlashimiz uchun, iltimos, kelishingizni oldindan bildiring.": [
    "Пожалуйста, сообщите заранее, придёте ли вы, чтобы мы всё подготовили.",
    "Please let us know in advance whether you can come, so we can prepare everything.",
  ],
  "Ism familiyangiz": ["Ваше имя и фамилия", "Your full name"],
  Ismingiz: ["Ваше имя", "Your name"],
  "Ismingizni kiriting": ["Введите ваше имя", "Enter your name"],
  "Kela olasizmi?": ["Сможете прийти?", "Will you attend?"],
  "Albatta kelaman": ["Обязательно приду", "Yes, I'll be there"],
  "Kela olmayman": ["Не смогу прийти", "Sorry, I can't make it"],
  "Necha kishi bilan?": ["Сколько вас будет?", "How many guests?"],
  "Izoh (ixtiyoriy)": ["Комментарий (необязательно)", "Comment (optional)"],
  "Qo'shimcha yozmoqchi bo'lsangiz...": ["Если хотите что-то добавить...", "Anything you'd like to add..."],
  "Javobni yuborish": ["Отправить ответ", "Send reply"],
  "Yuborilmoqda...": ["Отправка...", "Sending..."],
  "Yuborishda xatolik. Iltimos, qaytadan urinib ko'ring.": ["Ошибка отправки. Попробуйте ещё раз.", "Couldn't send. Please try again."],
  "Rahmat! Javobingiz qabul qilindi.": ["Спасибо! Ваш ответ принят.", "Thank you! Your reply has been received."],
  "Bu — namuna. RSVP faqat haqiqiy (sotib olingan) taklifnomada ishlaydi.": [
    "Это образец. RSVP работает только в настоящем приглашении.",
    "This is a sample. RSVP works only in a real invitation.",
  ],
  // Tilaklar
  "Tilaklar daftari": ["Книга пожеланий", "Guest book"],
  "Siz ham tilak qoldiring ✍️": ["Оставьте и вы пожелание ✍️", "Leave your wishes too ✍️"],
  "Xabaringizni yozing": ["Напишите пожелание", "Write your message"],
  "Xabar yuborish": ["Отправить", "Send"],
  "Tilagingiz uchun rahmat!": ["Спасибо за пожелание!", "Thank you for your wishes!"],
  "Bu — namuna. Tilaklar faqat haqiqiy (sotib olingan) taklifnomada saqlanadi.": [
    "Это образец. Пожелания сохраняются только в настоящем приглашении.",
    "This is a sample. Wishes are saved only in a real invitation.",
  ],
  // Yakun va reklama
  "Sizni kutamiz!": ["Ждём вас!", "We look forward to seeing you!"],
  "Sizni ko'rishdan baxtiyor bo'lamiz!": ["Будем счастливы вас видеть!", "We'll be happy to see you!"],
  "Sizga ham shunday taklifnoma kerakmi?": ["Хотите такое же приглашение?", "Want an invitation like this?"],
  "Online taklifnomalar — bir necha daqiqada buyurtma bering": [
    "Онлайн-приглашения — закажите за пару минут",
    "Online invitations — order in a few minutes",
  ],
  Sayt: ["Сайт", "Website"],
  // Tadbir turlari (ismlar ustidagi standart yozuv)
  "To'y": ["Свадьба", "Wedding"],
  "Nikoh to'yi": ["Никах", "Nikah ceremony"],
  "Fotiha / Sovchilik": ["Фатиха", "Engagement"],
  "Sunnat to'yi": ["Суннат-той", "Sunnat celebration"],
  "Beshik to'yi": ["Бешик-той", "Cradle celebration"],
  "Tug'ilgan kun": ["День рождения", "Birthday"],
  Yubiley: ["Юбилей", "Anniversary"],
  Bayramlar: ["Праздник", "Celebration"],
  "Biznes tadbirlar": ["Деловое мероприятие", "Business event"],
  "Oilaviy tadbirlar": ["Семейное торжество", "Family celebration"],
  "Qiz bazmi": ["Девичник", "Bridal party"],
  // Standart kun tartibi bandlari
  "Mehmonlar kutib olish": ["Встреча гостей", "Welcoming guests"],
  "Mehmonlarni kutib olish": ["Встреча гостей", "Welcoming guests"],
  "Mehmonlar kelishi": ["Сбор гостей", "Guests arrive"],
  "Otam-qarashdosh marosimi": ["Обряд встречи", "Traditional ceremony"],
  "To'y boshlanishi": ["Начало свадьбы", "Celebration begins"],
  Dasturxon: ["Праздничный стол", "Dinner"],
  "Yakuniy raqs": ["Финальный танец", "Last dance"],
  "Nikoh o'qilishi": ["Никах", "Nikah"],
  Tabriklar: ["Поздравления", "Toasts & wishes"],
  "Fotiha o'qilishi": ["Чтение фатихи", "Fatiha blessing"],
  Duolar: ["Молитвы и пожелания", "Prayers & blessings"],
  "Marosim boshlanishi": ["Начало церемонии", "Ceremony begins"],
  "O'yin-kulgu": ["Развлечения", "Entertainment"],
  "Beshik bezatilishi": ["Украшение бешика", "Cradle decorating"],
  "Tort va sharlar": ["Торт и шары", "Cake & balloons"],
  "O'yinlar": ["Игры", "Games"],
  Konsert: ["Концерт", "Concert"],
  "Bayram boshlanishi": ["Начало праздника", "Celebration begins"],
  "Milliy taomlar": ["Национальные блюда", "Traditional food"],
  "Concert va o'yinlar": ["Концерт и игры", "Concert & games"],
  "Ro'yxatdan o'tish": ["Регистрация", "Registration"],
  "Kongress ochilishi": ["Открытие", "Opening"],
  "Panel muhokamasi": ["Панельная дискуссия", "Panel discussion"],
  "Tannaraf va networking": ["Кофе-брейк и нетворкинг", "Coffee break & networking"],
  "Yig'ilish": ["Сбор", "Gathering"],
  "Suhbat va esdaliklar": ["Беседы и воспоминания", "Stories & memories"],
  "Kina marosimi": ["Обряд хны", "Henna ceremony"],
  "Qo'shiqlar va raqslar": ["Песни и танцы", "Songs & dances"],
  "Kechki ziyofat": ["Вечерний приём", "Evening reception"],
  "Nikoh marosimi": ["Церемония никаха", "Nikah ceremony"],
  "Raqs va musiqa": ["Танцы и музыка", "Dance & music"],
  // Standart eslatmalar
  "Marosim haqida": ["О церемонии", "About the ceremony"],
  "Nikoh o'qilishi 17:30 da boshlanadi": ["Никах начнётся в 17:30", "The nikah begins at 17:30"],
  "Zamonaviy yoki milliy liboslar": ["Современные или национальные наряды", "Modern or traditional attire"],
  "Sovg'a haqida": ["О подарках", "About gifts"],
  "Ezgu duolaringiz eng qimmatli sovg'a": ["Ваши добрые пожелания — лучший подарок", "Your kind wishes are the best gift"],
  Eslatma: ["Примечание", "Note"],
  "Marosimdan so'ng dasturxon ochiladi": ["После церемонии — праздничный стол", "Dinner follows the ceremony"],
  "Bolalar uchun": ["Для детей", "For children"],
  "O'yinlar va shirinliklar mavjud": ["Будут игры и сладости", "Games and sweets are provided"],
  "An'ana": ["Традиция", "Tradition"],
  "Beshikni opa-singillar bezatadi": ["Бешик украшают сёстры", "The cradle is decorated by the sisters"],
  "Joy haqida": ["О месте", "About the venue"],
  "Bolalar uchun o'yin maydonchasi bor": ["Есть детская площадка", "There is a play area for children"],
  "Faxrli mehmonlar": ["Почётные гости", "Guests of honour"],
  "Tabrik so'zlari uchun mikrofon bor": ["Для поздравлений будет микрофон", "A microphone is available for toasts"],
  "Bayram dasturi": ["Программа праздника", "Programme"],
  "Hamma uchun ochiq": ["Для всех желающих", "Open to everyone"],
  Ishtirok: ["Участие", "Attendance"],
  "Ro'yxatdan o'tish shart": ["Требуется регистрация", "Registration required"],
  Til: ["Язык", "Language"],
  "Ma'ruzalar o'zbek va rus tillarida": ["Доклады на узбекском и русском", "Talks in Uzbek and Russian"],
  Kutamiz: ["Ждём вас", "We look forward to it"],
  "Oilangiz bilan keling": ["Приходите всей семьёй", "Come with your family"],
  "Kina marosimida milliy liboslar kutiladi": ["На обряд хны — в национальных нарядах", "Traditional attire for the henna ceremony"],
  "Mehmonlar uchun": ["Для гостей", "For guests"],
  "Avtomobil uchun qulay to'xtash joyi tayyorlangan.": ["Для гостей подготовлена парковка.", "Parking is available for guests."],
  "Tashrifingiz uchun": ["Спасибо за визит", "Thank you for coming"],
  "Sizning ishtirokingiz — biz uchun eng qimmatli sovg'a.": ["Ваше присутствие — лучший подарок для нас.", "Your presence is the greatest gift to us."],
  "Eng qimmatli sovg'a — ezgu duolaringiz.": ["Лучший подарок — ваши добрые пожелания.", "The best gift is your kind wishes."],
};

// Qolipli matnlar (son qo'shilgan): [regex, rus, ingliz]
const PATTERNS: Array<[string, string, string]> = [
  ["^va yana (\\d+) ta tilak\\.\\.\\.$", "и ещё $1 пожеланий...", "and $1 more wishes..."],
];

// Kirillga o'girilmaydigan brend/texnik so'zlar
const KEEP_LATIN = ["Google", "Maps", "Calendar", "Yandex", "Telegram", "Instagram", "Apple", "Outlook", "RSVP", "Online"];

function norm(s: string): string {
  return s.replace(/[‘’ʻʼ`]/g, "'").replace(/\s+/g, " ").trim();
}

function dictFor(lang: "ru" | "en"): Dict {
  const i = lang === "ru" ? 0 : 1;
  const d: Dict = {};
  for (const [k, v] of Object.entries(T)) d[norm(k)] = v[i];
  return d;
}

/** Brauzerda ishlaydigan qism (matn ko'rinishida sahifaga qo'yiladi) */
const RUNTIME = String.raw`
(function (LANGS, DICTS, PATS, KEEP) {
  var APOS = /[‘’ʻʼ\x60]/g;
  var LABEL = { uz: "UZ", "uz-cyrl": "ЎЗ", ru: "RU", en: "EN" };
  var HTML_LANG = { uz: "uz", "uz-cyrl": "uz-Cyrl", ru: "ru", en: "en" };
  function norm(s) { return s.replace(APOS, "'").replace(/\s+/g, " ").trim(); }
  var LAT = { a:"а",b:"б",d:"д",f:"ф",g:"г",h:"ҳ",i:"и",j:"ж",k:"к",l:"л",m:"м",n:"н",o:"о",p:"п",q:"қ",r:"р",s:"с",t:"т",u:"у",v:"в",x:"х",y:"й",z:"з",c:"с",w:"в" };
  function word(w) {
    if (KEEP.indexOf(w) >= 0) return w;
    var s = w.replace(APOS, "'");
    s = s.replace(/O'/g,"Ў").replace(/o'/g,"ў").replace(/G'/g,"Ғ").replace(/g'/g,"ғ")
         .replace(/SH/g,"Ш").replace(/Sh/g,"Ш").replace(/sh/g,"ш")
         .replace(/CH/g,"Ч").replace(/Ch/g,"Ч").replace(/ch/g,"ч")
         .replace(/YO/g,"Ё").replace(/Yo/g,"Ё").replace(/yo/g,"ё")
         .replace(/YU/g,"Ю").replace(/Yu/g,"Ю").replace(/yu/g,"ю")
         .replace(/YA/g,"Я").replace(/Ya/g,"Я").replace(/ya/g,"я")
         .replace(/YE/g,"Е").replace(/Ye/g,"Е").replace(/ye/g,"е")
         .replace(/^E/,"Э").replace(/^e/,"э").replace(/E/g,"Е").replace(/e/g,"е")
         .replace(/'/g,"ъ");
    var out = "";
    for (var i = 0; i < s.length; i++) {
      var c = s[i], lc = c.toLowerCase(), m = LAT[lc];
      out += m ? (c === lc ? m : m.toUpperCase()) : c;
    }
    return out;
  }
  function cyr(text) {
    if (/https?:|www\.|@/.test(text)) return text;
    return text.replace(/[A-Za-z][A-Za-z‘’ʻʼ\x60']*/g, word);
  }
  function tr(text, L) {
    if (L === "uz" || !text || !/[A-Za-z]/.test(text)) return text;
    if (L === "uz-cyrl") return cyr(text);
    var D = DICTS[L] || {}, k = norm(text);
    if (Object.prototype.hasOwnProperty.call(D, k)) {
      return text.match(/^\s*/)[0] + D[k] + text.match(/\s*$/)[0];
    }
    var P = PATS[L] || [];
    for (var i = 0; i < P.length; i++) {
      var re = new RegExp(P[i][0]);
      if (re.test(k)) return k.replace(re, P[i][1]);
    }
    return text;
  }

  var cur = LANGS[0];
  try {
    var q = new URLSearchParams(location.search).get("lang");
    var saved = localStorage.getItem("inv-lang");
    if (q && LANGS.indexOf(q) >= 0) cur = q;
    else if (saved && LANGS.indexOf(saved) >= 0) cur = saved;
  } catch (e) {}

  // Har bir matnning asl (o'zbekcha) nusxasi saqlanadi — tillar orasida
  // qayta-qayta almashtirilsa ham matn buzilmaydi. React matnni o'zgartirsa
  // (masalan sanoq), yangi qiymat asl nusxa bo'ladi.
  var ATTRS = ["placeholder", "aria-label", "title", "alt"];
  function textNode(n) {
    if (n.__invLast === undefined || n.nodeValue !== n.__invLast) n.__invOrig = n.nodeValue;
    var v = tr(n.__invOrig, cur);
    n.__invLast = v;
    if (n.nodeValue !== v) n.nodeValue = v;
  }
  function attr(el, a) {
    var val = el.getAttribute(a);
    if (val == null) return;
    var st = el.__invAttr || (el.__invAttr = {});
    var rec = st[a];
    if (!rec || val !== rec.last) rec = st[a] = { orig: val };
    var v = tr(rec.orig, cur);
    rec.last = v;
    if (val !== v) el.setAttribute(a, v);
  }
  // Til tugmalari (va boshqa [data-inv-skip]) hech qachon o'girilmaydi —
  // kuzatuvchi ichki tugunlarni alohida ham tekshiradi
  function skipped(el) { return !!(el && el.closest && el.closest("[data-inv-skip]")); }
  function walk(n) {
    if (n.nodeType === 3) return skipped(n.parentElement) ? undefined : textNode(n);
    if (n.nodeType !== 1) return;
    var tag = n.tagName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA" || skipped(n)) return;
    for (var a = 0; a < ATTRS.length; a++) attr(n, ATTRS[a]);
    for (var c = n.firstChild; c; c = c.nextSibling) walk(c);
  }

  var bar;
  function renderBar() {
    if (LANGS.length < 2) return;
    if (!bar) {
      bar = document.createElement("div");
      bar.setAttribute("data-inv-skip", "");
      bar.setAttribute("role", "group");
      bar.setAttribute("aria-label", "Language");
      // O'ng chetda ixcham vertikal ustun — markazdagi sarlavhalarga tegmaydi
      bar.style.cssText = "position:fixed;top:10px;right:8px;z-index:2147483000;display:flex;flex-direction:column;gap:2px;padding:3px;border-radius:14px;background:rgba(20,16,12,.55);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:0 6px 20px -8px rgba(0,0,0,.5);font:600 11px/1 system-ui,-apple-system,sans-serif;letter-spacing:.06em";
      document.body.appendChild(bar);
    }
    bar.innerHTML = "";
    LANGS.forEach(function (l) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = LABEL[l] || l;
      b.setAttribute("aria-pressed", String(l === cur));
      b.style.cssText = "border:0;cursor:pointer;min-width:34px;padding:7px 6px;border-radius:11px;font:inherit;letter-spacing:inherit;" +
        (l === cur ? "background:#fff;color:#1c1917" : "background:transparent;color:rgba(255,255,255,.85)");
      b.addEventListener("click", function (e) {
        e.stopPropagation(); // konvert ochilib ketmasin
        setLang(l);
      });
      bar.appendChild(b);
    });
  }
  function setLang(l) {
    cur = l;
    try { localStorage.setItem("inv-lang", l); } catch (e) {}
    document.documentElement.lang = HTML_LANG[l] || l;
    walk(document.body);
    renderBar();
  }
  function start() {
    setLang(cur);
    new MutationObserver(function (list) {
      for (var i = 0; i < list.length; i++) {
        var m = list[i];
        if (m.type === "characterData" || m.type === "attributes") walk(m.target);
        else for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
      }
    }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})`;

/**
 * Taklifnomaga qo'yiladigan `<script>`: mehmon tanlangan tillar orasida
 * almashtiradi. Faqat o'zbek (lotin) bo'lsa — skript kerak emas.
 *
 * `overrides` — mijozning o'z matnlari tarjimasi ({ ru: { asl: tarjima } }).
 */
export function i18nScriptTag(langs: InvitationLang[], overrides: Record<string, Dict> = {}): string {
  if (!langs.length || (langs.length === 1 && langs[0] === "uz")) return "";
  const dicts: Record<string, Dict> = {};
  const pats: Record<string, string[][]> = {};
  for (const l of ["ru", "en"] as const) {
    if (!langs.includes(l)) continue;
    const custom: Dict = {};
    for (const [k, v] of Object.entries(overrides[l] ?? {})) custom[norm(k)] = v;
    // Mijoz matni lug'atdagi standart tarjimadan ustun
    dicts[l] = { ...dictFor(l), ...custom };
    pats[l] = PATTERNS.map(([re, ru, en]) => [re, l === "ru" ? ru : en]);
  }
  const args = [langs, dicts, pats, KEEP_LATIN].map((a) => JSON.stringify(a)).join(",");
  const code = `${RUNTIME}(${args});`.replace(/<\/script/gi, "<\\/script");
  return `<script>${code}</script>`;
}
