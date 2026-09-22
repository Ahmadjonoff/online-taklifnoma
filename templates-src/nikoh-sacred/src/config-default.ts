/* ============================================================================
 *  TAKLIFNOMA SOZLAMALARI
 *  ---------------------------------------------------------------------------
 *  Bu fayl AVTOMATIK yaratilgan: scripts/generate-taklif-templates.mjs
 *  Mazmunni o'zgartirish uchun skriptdagi shablon yozuvini tahrirlang.
 * ==========================================================================*/

export const config = {
  "couple": {
    "groom": "Jasurbek",
    "bride": "Ozodaxon",
    "monogram": "J&O",
    "photo": ""
  },
  "envelope": {
    "kicker": "Sizga taklifnoma keldi"
  },
  "event": {
    "dateISO": "2027-05-15T17:00:00",
    "dateLabel": "15.05.2027",
    "timeLabel": "17:00",
    "kicker": "Nikoh kuni"
  },
  "blessing": {
    "arabic": "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    "lines": [
      "Ikki qalb",
      "Bitta taqdir"
    ],
    "source": "",
    "greeting": "Aziz Mehmonimiz",
    "text": "Sizni nikoh kuni munosabati bilan bo‘lib o‘tadigan “Visol oqshomi”ga taklif etamiz. Quvonchimizni biz bilan baham ko‘rishingizni intiqlik bilan kutamiz.",
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
        "title": "Nikoh kuni",
        "dateLabel": "15.05.2027",
        "timeLabel": "17:00",
        "venueName": "Bog‘i Eram marosimlar saroyi",
        "venueAddress": "Toshkent, Mirzo Ulug‘bek tumani, Buyuk Ipak Yo‘li ko‘chasi 84",
        "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=41.3255%2C69.3401",
        "yandexMapsUrl": "https://yandex.uz/maps/?ll=69.3401%2C41.3255&z=17&text=Bog%E2%80%98i%20Eram%20marosimlar%20saroyi"
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
    "name": "Bog‘i Eram marosimlar saroyi",
    "address": "Toshkent, Mirzo Ulug‘bek tumani, Buyuk Ipak Yo‘li ko‘chasi 84",
    "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=41.3255%2C69.3401",
    "yandexMapsUrl": "https://yandex.uz/maps/?ll=69.3401%2C41.3255&z=17&text=Bog%E2%80%98i%20Eram%20marosimlar%20saroyi"
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
    "enabled": true,
    "title": "Kiyim uslubi",
    "text": "Bayramona uslub. Iltimos, kiyimlaringiz mavzu palitrasiga mos bo‘lsin.",
    "palette": [
      "#7E8C55",
      "#F1EAD8",
      "#E2CDB4"
    ]
  },
  "notes": [
    {
      "title": "Kiyim uslubi",
      "text": "Bayramona uslub. Iltimos, to‘q qizil va bordo ranglardan voz keching."
    },
    {
      "title": "Sovg‘a haqida",
      "text": "Eng qimmatli sovg‘a — sizning ishtirokingiz."
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
