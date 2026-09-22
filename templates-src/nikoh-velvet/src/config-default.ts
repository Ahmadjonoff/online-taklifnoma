/* ============================================================================
 *  TAKLIFNOMA SOZLAMALARI
 *  ---------------------------------------------------------------------------
 *  Bu fayl AVTOMATIK yaratilgan: scripts/generate-taklif-templates.mjs
 *  Mazmunni o'zgartirish uchun skriptdagi shablon yozuvini tahrirlang.
 * ==========================================================================*/

export const config = {
  "couple": {
    "groom": "Oybek",
    "bride": "Nigora",
    "monogram": "O&N",
    "photo": ""
  },
  "envelope": {
    "kicker": "Sizga taklifnoma keldi"
  },
  "event": {
    "dateISO": "2026-11-07T18:00:00",
    "dateLabel": "07.11.2026",
    "timeLabel": "18:00",
    "kicker": "Nikoh kechasi"
  },
  "blessing": {
    "arabic": "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    "lines": [
      "Alloh ularning qalblarini",
      "birlashtirdi"
    ],
    "source": "",
    "greeting": "Aziz Mehmonimiz",
    "text": "Sizni nikoh kechasi munosabati bilan bo‘lib o‘tadigan “Visol oqshomi”ga taklif etamiz. Quvonchimizni biz bilan baham ko‘rishingizni intiqlik bilan kutamiz.",
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
    "enabled": false,
    "kicker": "Dastur",
    "title": "Tadbir manzili",
    "note": "",
    "items": [
      {
        "kicker": "Asosiy marosim",
        "title": "Nikoh kechasi",
        "dateLabel": "07.11.2026",
        "timeLabel": "18:00",
        "venueName": "Zarafshon to‘yxonasi",
        "venueAddress": "Toshkent shahri",
        "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=41.3111%2C69.2797",
        "yandexMapsUrl": "https://yandex.uz/maps/?ll=69.2797%2C41.3111&z=17&text=Zarafshon%20to%E2%80%98yxonasi"
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
    "name": "Zarafshon to‘yxonasi",
    "address": "Toshkent shahri",
    "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=41.3111%2C69.2797",
    "yandexMapsUrl": "https://yandex.uz/maps/?ll=69.2797%2C41.3111&z=17&text=Zarafshon%20to%E2%80%98yxonasi"
  },
  "gallery": {
    "enabled": true,
    "title": "Bizning xotiralar",
    "photos": [
      "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=900",
      "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=900",
      "https://images.pexels.com/photos/1244627/pexels-photo-1244627.jpeg?auto=compress&cs=tinysrgb&w=900"
    ]
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
    "enabled": false,
    "title": "Kiyim uslubi",
    "text": "Bayramona uslub. Iltimos, kiyimlaringiz mavzu palitrasiga mos bo‘lsin.",
    "palette": [
      "#D4A87C",
      "#1A060F",
      "#4A0F24"
    ]
  },
  "notes": [
    {
      "title": "Kechki uslub",
      "text": "Kechki qorong‘i liboslar va oltin aksessuarlar."
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
