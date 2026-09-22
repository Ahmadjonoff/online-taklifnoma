/* ============================================================================
 *  TAKLIFNOMA SOZLAMALARI
 *  ---------------------------------------------------------------------------
 *  Bu fayl AVTOMATIK yaratilgan: scripts/generate-taklif-templates.mjs
 *  Mazmunni o'zgartirish uchun skriptdagi shablon yozuvini tahrirlang.
 * ==========================================================================*/

export const config = {
  "couple": {
    "groom": "Davron",
    "bride": "Diyora",
    "monogram": "D&D",
    "photo": ""
  },
  "envelope": {
    "kicker": "Sizga taklifnoma keldi"
  },
  "event": {
    "dateISO": "2026-11-28T19:00:00",
    "dateLabel": "28.11.2026",
    "timeLabel": "19:00",
    "kicker": "Baxt to‘yi"
  },
  "blessing": {
    "arabic": "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    "lines": [
      "Bismillohir Rohmanir Rohiym",
      "Sizni baxt to‘yimizga taklif etamiz"
    ],
    "source": "Anfol surasi, 63-oyat",
    "greeting": "Aziz Mehmonimiz",
    "text": "Sizni baxt to‘yi munosabati bilan bo‘lib o‘tadigan “Visol oqshomi”ga taklif etamiz. Quvonchimizni biz bilan baham ko‘rishingizni intiqlik bilan kutamiz.",
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
    "enabled": false,
    "kicker": "Sana va vaqt",
    "title": "Kalendar"
  },
  "events": {
    "enabled": true,
    "kicker": "Dastur",
    "title": "To‘y dasturi va manzili",
    "note": "Ikkala marosimda ham sizni ko‘rishdan baxtiyor bo‘lamiz.",
    "items": [
      {
        "kicker": "Bayram bazmi",
        "title": "Qizlar bazmi",
        "dateLabel": "27-Noyabr, 2026-yil",
        "timeLabel": "19:00",
        "venueName": "«O‘zbegim» to‘yxonasi",
        "venueAddress": "",
        "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=41.311081%2C69.240562",
        "yandexMapsUrl": "https://yandex.uz/maps/?ll=69.240562%2C41.311081&z=17&text=%C2%ABO%E2%80%98zbegim%C2%BB%20to%E2%80%98yxonasi"
      },
      {
        "kicker": "Asosiy marosim",
        "title": "Nikoh to‘yi",
        "dateLabel": "28-Noyabr, 2026-yil",
        "timeLabel": "19:00",
        "venueName": "«Orasta» to‘yxonasi",
        "venueAddress": "Toshkent shahri",
        "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=41.311081%2C69.240562",
        "yandexMapsUrl": "https://yandex.uz/maps/?ll=69.240562%2C41.311081&z=17&text=%C2%ABOrasta%C2%BB%20to%E2%80%98yxonasi"
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
        "label": "Nikoh marosimi"
      },
      {
        "time": "19:00",
        "label": "Tabriklar"
      },
      {
        "time": "20:00",
        "label": "Kechki ziyofat"
      },
      {
        "time": "21:00",
        "label": "Raqs va musiqa"
      }
    ]
  },
  "details": {
    "enabled": true
  },
  "venue": {
    "title": "Manzil",
    "name": "«Orasta» to‘yxonasi",
    "address": "Toshkent shahri",
    "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=41.311081%2C69.240562",
    "yandexMapsUrl": "https://yandex.uz/maps/?ll=69.240562%2C41.311081&z=17&text=%C2%ABOrasta%C2%BB%20to%E2%80%98yxonasi"
  },
  "gallery": {
    "enabled": false,
    "title": "Bizning xotiralar",
    "photos": []
  },
  "story": {
    "enabled": true,
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
    "enabled": true,
    "title": "Kiyim uslubi",
    "text": "Bayramona uslub. Iltimos, kiyimlaringiz mavzu palitrasiga mos bo‘lsin.",
    "palette": [
      "#E8CE7A",
      "#1A0506",
      "#2A1214"
    ]
  },
  "notes": [
    {
      "title": "Kiyinish uslubi",
      "text": "Zamonaviy yoki milliy liboslar."
    },
    {
      "title": "Sovg‘a haqida",
      "text": "Ezgu duolaringiz eng qimmatli sovg‘a."
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
