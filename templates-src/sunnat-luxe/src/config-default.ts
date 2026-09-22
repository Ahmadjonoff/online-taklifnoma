/* ============================================================================
 *  TAKLIFNOMA SOZLAMALARI
 *  ---------------------------------------------------------------------------
 *  Bu fayl AVTOMATIK yaratilgan: scripts/generate-taklif-templates.mjs
 *  Mazmunni o'zgartirish uchun skriptdagi shablon yozuvini tahrirlang.
 * ==========================================================================*/

export const config = {
  "couple": {
    "groom": "Ozodbek",
    "bride": "",
    "monogram": "O",
    "photo": ""
  },
  "envelope": {
    "kicker": "Sizga taklifnoma keldi"
  },
  "event": {
    "dateISO": "2026-11-20T16:00:00",
    "dateLabel": "20.11.2026",
    "timeLabel": "16:00",
    "kicker": "Sunnat to‘yi"
  },
  "blessing": {
    "arabic": "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    "lines": [
      "Farzandimiz sharafiga",
      "tantanali dasturxon"
    ],
    "source": "",
    "greeting": "Aziz Mehmonimiz",
    "text": "Sizni sunnat to‘yi munosabati bilan bo‘lib o‘tadigan “Visol oqshomi”ga taklif etamiz. Quvonchimizni biz bilan baham ko‘rishingizni intiqlik bilan kutamiz.",
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
        "title": "Sunnat to‘yi",
        "dateLabel": "20.11.2026",
        "timeLabel": "16:00",
        "venueName": "«Turkiston saltanat saroyi»",
        "venueAddress": "Toshkent shahri, Amir Temur ko‘chasi 94",
        "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=41.3111%2C69.2797",
        "yandexMapsUrl": "https://yandex.uz/maps/?ll=69.2797%2C41.3111&z=17&text=%C2%ABTurkiston%20saltanat%20saroyi%C2%BB"
      }
    ]
  },
  "timeline": {
    "title": "Kun tartibi",
    "items": [
      {
        "time": "16:00",
        "label": "Mehmonlarni kutib olish"
      },
      {
        "time": "17:00",
        "label": "Marosim boshlanishi"
      },
      {
        "time": "18:00",
        "label": "Dasturxon"
      },
      {
        "time": "20:00",
        "label": "O‘yin-kulgi"
      }
    ]
  },
  "details": {
    "enabled": true
  },
  "venue": {
    "title": "Manzil",
    "name": "«Turkiston saltanat saroyi»",
    "address": "Toshkent shahri, Amir Temur ko‘chasi 94",
    "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=41.3111%2C69.2797",
    "yandexMapsUrl": "https://yandex.uz/maps/?ll=69.2797%2C41.3111&z=17&text=%C2%ABTurkiston%20saltanat%20saroyi%C2%BB"
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
      "#B76E79",
      "#F8ECE4",
      "#F0D9D2"
    ]
  },
  "notes": [
    {
      "title": "Farzandimiz",
      "text": "Ozodbek — 5 yosh. Kichik mehmonlar uchun shirinliklar tayyor."
    },
    {
      "title": "Sunnat to‘y egalari",
      "text": "Ulug‘bek–Nodira"
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
