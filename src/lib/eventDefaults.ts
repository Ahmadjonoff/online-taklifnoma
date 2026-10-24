/**
 * Tadbir turi bo'yicha standart kun tartibi va eslatmalar.
 *
 * Seed (shablonlarning standart qiymatlari) va buyurtma formasi (mijoz tadbir
 * turini tanlaganda kun tartibini oldindan to'ldirish) shu yerdan oladi.
 */

export type TimelineItem = { time: string; label: string };
export type NoteItem = { title: string; text: string };

export function defaultTimeline(eventType: string): TimelineItem[] {
  const T: Record<string, TimelineItem[]> = {
    toy: [
      { time: "18:00", label: "Mehmonlar kutib olish" },
      { time: "18:30", label: "Otam-qarashdosh marosimi" },
      { time: "19:00", label: "To'y boshlanishi" },
      { time: "21:00", label: "Dasturxon" },
      { time: "23:00", label: "Yakuniy raqs" },
    ],
    "nikoh-toyi": [
      { time: "17:00", label: "Mehmonlar kutib olish" },
      { time: "17:30", label: "Nikoh o'qilishi" },
      { time: "18:30", label: "Dasturxon" },
      { time: "21:00", label: "Tabriklar" },
    ],
    "fotiha-toyi": [
      { time: "17:00", label: "Mehmonlar kutib olish" },
      { time: "17:30", label: "Fotiha o'qilishi" },
      { time: "18:30", label: "Dasturxon" },
      { time: "20:00", label: "Duolar" },
    ],
    "sunnat-toyi": [
      { time: "16:00", label: "Mehmonlar kutib olish" },
      { time: "17:00", label: "Marosim boshlanishi" },
      { time: "18:00", label: "Dasturxon" },
      { time: "20:00", label: "O'yin-kulgu" },
    ],
    "beshik-toyi": [
      { time: "15:00", label: "Mehmonlar kutib olish" },
      { time: "16:00", label: "Beshik bezatilishi" },
      { time: "17:00", label: "Dasturxon" },
    ],
    "tugilgan-kun": [
      { time: "16:00", label: "Mehmonlar kelishi" },
      { time: "17:00", label: "Tort va sharlar" },
      { time: "18:00", label: "O'yinlar" },
      { time: "20:00", label: "Tabriklar" },
    ],
    yubiley: [
      { time: "18:00", label: "Mehmonlar kutib olish" },
      { time: "19:00", label: "Tabriklar" },
      { time: "20:00", label: "Dasturxon" },
      { time: "22:00", label: "Konsert" },
    ],
    bayramlar: [
      { time: "11:00", label: "Bayram boshlanishi" },
      { time: "13:00", label: "Milliy taomlar" },
      { time: "16:00", label: "Concert va o'yinlar" },
    ],
    biznes: [
      { time: "09:00", label: "Ro'yxatdan o'tish" },
      { time: "10:00", label: "Kongress ochilishi" },
      { time: "12:00", label: "Panel muhokamasi" },
      { time: "14:00", label: "Tannaraf va networking" },
    ],
    oilaviy: [
      { time: "12:00", label: "Yig'ilish" },
      { time: "13:00", label: "Dasturxon" },
      { time: "16:00", label: "Suhbat va esdaliklar" },
    ],
    "qiz-bazmi": [
      { time: "17:00", label: "Mehmonlarni kutib olish" },
      { time: "18:00", label: "Kina marosimi" },
      { time: "19:00", label: "Dasturxon" },
      { time: "20:30", label: "Qo'shiqlar va raqslar" },
    ],
  };
  return T[eventType] ?? T.toy;
}

export function defaultNotes(eventType: string): NoteItem[] {
  const N: Record<string, NoteItem[]> = {
    toy: [
      { title: "Kiyinish uslubi", text: "Zamonaviy yoki milliy liboslar" },
      { title: "Sovg'a haqida", text: "Ezgu duolaringiz eng qimmatli sovg'a" },
    ],
    // "Marosim haqida" olib tashlandi: vaqti ("17:30") qattiq yozilgan edi va
    // mijozning haqiqiy vaqtiga mos kelmasdi. Bo'sh ro'yxat — bo'lim ko'rinmaydi.
    "nikoh-toyi": [],
    "fotiha-toyi": [{ title: "Eslatma", text: "Marosimdan so'ng dasturxon ochiladi" }],
    "sunnat-toyi": [{ title: "Bolalar uchun", text: "O'yinlar va shirinliklar mavjud" }],
    "beshik-toyi": [{ title: "An'ana", text: "Beshikni opa-singillar bezatadi" }],
    "tugilgan-kun": [{ title: "Joy haqida", text: "Bolalar uchun o'yin maydonchasi bor" }],
    yubiley: [{ title: "Faxrli mehmonlar", text: "Tabrik so'zlari uchun mikrofon bor" }],
    bayramlar: [{ title: "Bayram dasturi", text: "Hamma uchun ochiq" }],
    biznes: [
      { title: "Ishtirok", text: "Ro'yxatdan o'tish shart" },
      { title: "Til", text: "Ma'ruzalar o'zbek va rus tillarida" },
    ],
    oilaviy: [{ title: "Kutamiz", text: "Oilangiz bilan keling" }],
    "qiz-bazmi": [{ title: "An'ana", text: "Kina marosimida milliy liboslar kutiladi" }],
  };
  return N[eventType] ?? N.toy;
}
