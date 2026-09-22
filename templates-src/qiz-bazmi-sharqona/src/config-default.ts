/* ============================================================================
 *  TAKLIFNOMA SOZLAMALARI
 *  ---------------------------------------------------------------------------
 *  Bu fayl AVTOMATIK yaratilgan: scripts/generate-taklif-templates.mjs
 *  Mazmunni o'zgartirish uchun skriptdagi shablon yozuvini tahrirlang.
 * ==========================================================================*/

export const config = {
  "couple": {
    "groom": "Farida",
    "bride": "",
    "monogram": "F",
    "photo": ""
  },
  "envelope": {
    "kicker": "Sizga taklifnoma keldi"
  },
  "event": {
    "dateISO": "2026-12-12T11:00:00",
    "dateLabel": "12.12.2026",
    "timeLabel": "11:00",
    "kicker": "Kina kechasi"
  },
  "blessing": {
    "arabic": "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    "lines": [
      "Sevinchimizga sherik bo‘ling",
      "kinamizni birga yoqamiz"
    ],
    "source": "",
    "greeting": "Aziz Mehmonimiz",
    "text": "Sizni kina kechasi munosabati bilan bo‘lib o‘tadigan “Visol oqshomi”ga taklif etamiz. Quvonchimizni biz bilan baham ko‘rishingizni intiqlik bilan kutamiz.",
    "heart": true
  },
  "dearGuests": {
    "enabled": true,
    "greeting": "Aziz va qadrli insonimiz!",
    "text": "Ushbu quvonchli kunda bizga hamroh bo‘lishingizni va ezgu tilaklaringiz bilan duo qilishingizni so‘raymiz.",
    "signature": ""
  },
  "countdown": {
    "title": "Bayramgacha qoldi",
    "finishedText": "Bugun bizning kunimiz!"
  },
  "calendar": {
    "enabled": true,
    "kicker": "Sana va vaqt",
    "title": "Kalendar"
  },
  "events": {
    "enabled": false,
    "kicker": "Dastur",
    "title": "Tadbir manzili",
    "note": "",
    "items": [
      {
        "kicker": "Asosiy marosim",
        "title": "Kina kechasi",
        "dateLabel": "12.12.2026",
        "timeLabel": "11:00",
        "venueName": "Marğilon Restoranı",
        "venueAddress": "Mustaqillik ko‘chasi 663, Marg‘ilon, Farg‘ona",
        "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=40.4711%2C71.7243",
        "yandexMapsUrl": "https://yandex.uz/maps/?ll=71.7243%2C40.4711&z=17&text=Mar%C4%9Filon%20Restoran%C4%B1"
      }
    ]
  },
  "timeline": {
    "title": "Kun tartibi",
    "items": [
      {
        "time": "17:00",
        "label": "Mehmonlarni kutib olish"
      },
      {
        "time": "18:00",
        "label": "Kina marosimi"
      },
      {
        "time": "19:00",
        "label": "Dasturxon"
      },
      {
        "time": "20:30",
        "label": "Qo‘shiqlar va raqslar"
      }
    ]
  },
  "details": {
    "enabled": true
  },
  "venue": {
    "title": "Manzil",
    "name": "Marğilon Restoranı",
    "address": "Mustaqillik ko‘chasi 663, Marg‘ilon, Farg‘ona",
    "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=40.4711%2C71.7243",
    "yandexMapsUrl": "https://yandex.uz/maps/?ll=71.7243%2C40.4711&z=17&text=Mar%C4%9Filon%20Restoran%C4%B1"
  },
  "gallery": {
    "enabled": false,
    "title": "Bizning xotiralar",
    "photos": []
  },
  "story": {
    "enabled": false,
    "kicker": "Bizning hikoyamiz",
    "title": "Bizning sayohatimiz",
    "text": "Ikki yurak bir-birini topdi. Bir oqshomda boshlangan suhbat butun umrlik sevgiga aylandi. Bugun siz bilan bu baxtli kunni nishonlashga taklif etamiz.",
    "photo": ""
  },
  "singers": {
    "enabled": false,
    "kicker": "Maxsus mehmonlar",
    "title": "Kechaning yulduzlari",
    "text": "Bayramimizni yanada yorqin qiladigan san’atkorlar.",
    "layout": "slider",
    "items": []
  },
  "dressCode": {
    "enabled": false,
    "title": "Kiyim uslubi",
    "text": "Bayramona uslub. Iltimos, kiyimlaringiz mavzu palitrasiga mos bo‘lsin.",
    "palette": [
      "#9A6A2F",
      "#F1E6C6",
      "#D8B978"
    ]
  },
  "notes": [
    {
      "title": "An’ana",
      "text": "Kina marosimida milliy liboslar kutiladi."
    }
  ],
  "rsvp": {
    "enabled": true,
    "title": "Ishtirokni tasdiqlang",
    "text": "Dasturxonni to‘g‘ri tayyorlashimiz uchun, iltimos, kelishingizni oldindan bildiring.",
    "sealText": "RSVP",
    "openHint": "Ochish uchun bosing",
    "successText": "Rahmat! Javobingiz qabul qilindi."
  },
  "gift": {
    "enabled": true,
    "title": "To‘yona",
    "cardNumber": "5614 6822 1499 0956",
    "cardHolder": "AZAMAT KOCHIMOV",
    "copyLabel": "Karta raqamini nusxalash",
    "copiedLabel": "Nusxalandi!"
  },
  "wishes": {
    "enabled": true,
    "title": "Tilaklar daftari",
    "namePlaceholder": "Ismingizni kiriting",
    "messagePlaceholder": "Xabaringizni yozing",
    "submitLabel": "Xabar yuborish",
    "successText": "Tilagingiz uchun rahmat!"
  },
  "footer": {
    "title": "Sizni ko‘rishdan baxtiyor bo‘lamiz!",
    "signature": "",
    "photo": ""
  },
  "music": {
    "enabled": true,
    "src": "/music.mp3"
  },
  "petals": {
    "enabled": true,
    "count": 14
  }
} as const

export type Config = typeof config
