#!/usr/bin/env node
/**
 * taklif-link.uz uslubidagi 17 ta shablonni generatsiya qiladi.
 *
 * Har bir shablon = yangi baza (`luxe-vow` / `watercolor-garden` / `noir-gradient`)
 *                    + o'z palitrasi (`index.css` @theme + :root tokenlari)
 *                    + o'z mazmuni va bo'limlari (`config-default.ts`)
 *
 * Boshqa generator (`generate-templates.mjs`) esa eski 60 shablonni yasaydi —
 * ular bir-biriga xalaqit bermasligi uchun bu alohida skript.
 *
 * Ishlatish: node scripts/generate-taklif-templates.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const SRC = path.join(ROOT, 'templates-src')

/* ============================================================
 *  TIPOGRAFIYA
 * ============================================================ */
const TYPOS = {
  classic: {
    script: "'Taklif Script', cursive",
    display: "'Playfair Display', Georgia, serif",
    body: "'Cormorant Garamond', Georgia, serif",
  },
  script: {
    script: "'Taklif Script', cursive",
    display: "'Taklif Script', cursive",
    body: "'Cormorant Garamond', Georgia, serif",
  },
  minimal: {
    script: "'Cormorant Garamond', Georgia, serif",
    display: "'Playfair Display', Georgia, serif",
    body: "'Playfair Display', Georgia, serif",
  },
}

/* ============================================================
 *  KUN TARTIBI (tadbir turi bo'yicha standart dastur)
 * ============================================================ */
const SCHEDULES = {
  toy: [
    { time: '17:00', label: 'Mehmonlarni kutib olish' },
    { time: '18:00', label: 'Nikoh marosimi' },
    { time: '19:00', label: 'Tabriklar' },
    { time: '20:00', label: 'Kechki ziyofat' },
    { time: '21:00', label: 'Raqs va musiqa' },
  ],
  'nikoh-toyi': [
    { time: '17:00', label: 'Mehmonlarni kutib olish' },
    { time: '18:00', label: 'Nikoh marosimi' },
    { time: '19:00', label: 'Tabriklar' },
    { time: '20:00', label: 'Kechki ziyofat' },
    { time: '21:00', label: 'Raqs va musiqa' },
  ],
  'fotiha-toyi': [
    { time: '17:00', label: 'Mehmonlarni kutib olish' },
    { time: '18:00', label: 'Fotiha o‘qilishi' },
    { time: '19:00', label: 'Dasturxon' },
    { time: '20:30', label: 'Duolar va tabriklar' },
  ],
  'sunnat-toyi': [
    { time: '16:00', label: 'Mehmonlarni kutib olish' },
    { time: '17:00', label: 'Marosim boshlanishi' },
    { time: '18:00', label: 'Dasturxon' },
    { time: '20:00', label: 'O‘yin-kulgi' },
  ],
  'qiz-bazmi': [
    { time: '17:00', label: 'Mehmonlarni kutib olish' },
    { time: '18:00', label: 'Kina marosimi' },
    { time: '19:00', label: 'Dasturxon' },
    { time: '20:30', label: 'Qo‘shiqlar va raqslar' },
  ],
}

/* ============================================================
 *  YANGI TADBIR TURI
 * ============================================================ */
const EVENT_TYPES = [
  {
    slug: 'qiz-bazmi',
    name: 'Qiz bazmi',
    emoji: '💃',
    order: 11,
  },
]

const PHOTOS = {
  warm: [
    'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/1244627/pexels-photo-1244627.jpeg?auto=compress&cs=tinysrgb&w=900',
  ],
  venue: [
    'https://images.pexels.com/photos/8251571/pexels-photo-8251571.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/16120244/pexels-photo-16120244.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
}

const SINGERS = [
  {
    name: 'Yulduz Usmonova',
    note: 'Soat 21:00 da jonli ijro',
    photo: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Ozodbek Nazarbekov',
    note: 'Kechaning ochilish qo‘shig‘i',
    photo: 'https://images.pexels.com/photos/761963/pexels-photo-761963.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Shahzoda',
    note: 'Raqs qismida sahnada',
    photo: 'https://images.pexels.com/photos/811838/pexels-photo-811838.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
]

/* ============================================================
 *  17 TA SHABLON — nomi, palitrasi (skreypingdan olingan ranglar) va mazmuni
 * ============================================================ */
const T = [
  /* ---------------------------------------------------------- PREMIUM: luxe-vow */
  {
    slug: 'toy-yoqut',
    name: 'Yoqut 🌹',
    base: 'luxe-vow',
    eventType: 'toy',
    price: 119000,
    emoji: '🌹',
    typo: 'script',
    kicker: 'Baxt to‘yi',
    desc: 'Bordo va tilla rangda, gulbarglar yog‘iladigan ikki tadbirli taklifnoma',
    pal: {
      paper: '#0F0204', paper2: '#1A0506', paper3: '#241013',
      gold: '#E8CE7A', goldLight: '#F5E3AC', goldDark: '#B89542',
      ink: '#F5E8D0', inkSoft: '#C6B08A',
      wine: '#8E1F2A', wineDark: '#5C1018',
      sage: '#6E6242', blush: '#2A1214',
      petalA: '#8E1F2A', petalB: '#E8CE7A',
      gradA: '#0F0204', gradB: '#1A0506', accent: '#E8CE7A',
    },
    demo: {
      groom: 'Davron', bride: 'Diyora', monogram: 'D&D',
      dateISO: '2026-11-28T19:00:00', dateLabel: '28.11.2026', timeLabel: '19:00',
      blessingLines: ['Bismillohir Rohmanir Rohiym', 'Sizni baxt to‘yimizga taklif etamiz'],
      blessingSource: 'Anfol surasi, 63-oyat',
      venueName: '«Orasta» to‘yxonasi', venueAddress: 'Toshkent shahri',
      lat: '41.311081', lng: '69.240562',
    },
    sec: { calendar: false, events: true, details: false, gallery: false, story: true, singers: false, dressCode: true },
    events: [
      { kicker: 'Bayram bazmi', title: 'Qizlar bazmi', dateLabel: '27-Noyabr, 2026-yil', timeLabel: '19:00', venueName: '«O‘zbegim» to‘yxonasi', venueAddress: '', lat: '41.311081', lng: '69.240562' },
      { kicker: 'Asosiy marosim', title: 'Nikoh to‘yi', dateLabel: '28-Noyabr, 2026-yil', timeLabel: '19:00', venueName: '«Orasta» to‘yxonasi', venueAddress: 'Toshkent shahri', lat: '41.311081', lng: '69.240562' },
    ],
    notes: [
      { title: 'Kiyinish uslubi', text: 'Zamonaviy yoki milliy liboslar.' },
      { title: 'Sovg‘a haqida', text: 'Ezgu duolaringiz eng qimmatli sovg‘a.' },
    ],
  },
  {
    slug: 'nikoh-imperial',
    name: 'Imperial ✨',
    base: 'luxe-vow',
    eventType: 'nikoh-toyi',
    price: 129000,
    emoji: '✨',
    typo: 'classic',
    kicker: 'Tantanali marosim',
    desc: 'Fil suyagi fonda oltin naqsh, muqaddas duo va tantanali kun tartibi',
    pal: {
      paper: '#FFFEFB', paper2: '#F6F6F4', paper3: '#EDE7DA',
      gold: '#A9842F', goldLight: '#E0C172', goldDark: '#7D5F22',
      ink: '#1A1A1A', inkSoft: '#3A3A3A',
      wine: '#9B8347', wineDark: '#6F5F2E',
      sage: '#B08F4D', blush: '#E6DDC8',
      petalA: '#E7CD86', petalB: '#FFF3CF',
      gradA: '#FFFEFB', gradB: '#EDE7DA', accent: '#C9A96E',
    },
    demo: {
      groom: 'Ulug‘bek', bride: 'Malika', monogram: 'U&M',
      dateISO: '2026-12-05T18:00:00', dateLabel: '05.12.2026', timeLabel: '18:00',
      blessingLines: ['Va U ularning qalblarini', 'sevgi ila birlashtirdi'],
      blessingSource: 'Anfol surasi, 63-oyat',
      venueName: 'Restaurant «Baxtiyor»',
      venueAddress: 'Toshkent viloyati, Qibray tumani, Olmazor ko‘chasi 72',
      lat: '41.3486', lng: '69.392',
    },
    sec: { calendar: true, events: false, details: true, gallery: true, story: false, singers: false, dressCode: false },
    notes: [
      { title: 'Tashrifingiz uchun', text: 'Avtomobil uchun qulay to‘xtash joyi tayyorlangan.' },
      { title: 'Sovg‘a haqida', text: 'Sizning ishtirokingiz — biz uchun eng qimmatli sovg‘a.' },
    ],
  },
  {
    slug: 'nikoh-royal',
    name: 'Royal 💌',
    base: 'luxe-vow',
    eventType: 'nikoh-toyi',
    price: 119000,
    emoji: '💌',
    typo: 'classic',
    kicker: 'Nikoh kuni',
    desc: 'To‘q ko‘k va tilla rang, muhrli konvert bilan ochiladigan taklifnoma',
    pal: {
      paper: '#FFFDF6', paper2: '#F4F1E6', paper3: '#E4E1D3',
      gold: '#C9A96E', goldLight: '#E5CD96', goldDark: '#96793F',
      ink: '#112250', inkSoft: '#3B4A78',
      wine: '#1B2F63', wineDark: '#112250',
      sage: '#6C7BA6', blush: '#DCE2F2',
      petalA: '#112250', petalB: '#C9A96E',
      gradA: '#FFFDF6', gradB: '#E4E1D3', accent: '#112250',
    },
    demo: {
      groom: 'Azizbek', bride: 'Nargizaxon', monogram: 'A&N',
      dateISO: '2027-03-27T18:00:00', dateLabel: '27.03.2027', timeLabel: '18:00',
      blessingLines: ['Alloh ularning qalblarini', 'sevgi ila birlashtirdi'],
      blessingSource: 'Anfol surasi, 63-oyat',
      venueName: 'Dvorets torjestv «Rohat»',
      venueAddress: 'Toshkent, Chilonzor tumani, Arnasoy ko‘chasi 7/2',
      lat: '41.2856', lng: '69.2034',
    },
    sec: { calendar: true, events: false, details: true, gallery: true, story: false, singers: false, dressCode: false },
    notes: [{ title: 'Kiyinish uslubi', text: 'Bayramona uslub — to‘q ko‘k va oltin ranglar.' }],
  },
  {
    slug: 'nikoh-ivory',
    name: 'Ivory ✉️',
    base: 'luxe-vow',
    eventType: 'nikoh-toyi',
    price: 109000,
    emoji: '✉️',
    typo: 'classic',
    kicker: 'Nikoh kuni',
    desc: 'Naqshli fil suyagi konverti, bordo muhr va tilla yozuv',
    pal: {
      paper: '#F9F0E0', paper2: '#F2E7D2', paper3: '#E9DCC2',
      gold: '#8A6A34', goldLight: '#C9A961', goldDark: '#6C513F',
      ink: '#3C2F24', inkSoft: '#6C513F',
      wine: '#7D1F28', wineDark: '#4E1016',
      sage: '#8A9A7B', blush: '#E2CDB4',
      petalA: '#E2CDB4', petalB: '#C9A961',
      gradA: '#F9F0E0', gradB: '#E9DCC2', accent: '#8A6A34',
    },
    demo: {
      groom: 'Sardor', bride: 'Sevara', monogram: 'S&S',
      dateISO: '2027-09-27T17:00:00', dateLabel: '27.09.2027', timeLabel: '17:00',
      blessingLines: ['Ikki qalb', 'Bitta taqdir'],
      blessingSource: 'Anfol surasi, 63-oyat',
      venueName: 'Bog‘i Eram marosimlar saroyi',
      venueAddress: 'Toshkent, Mirzo Ulug‘bek tumani, Buyuk Ipak Yo‘li ko‘chasi 84',
      lat: '41.3255', lng: '69.3401',
    },
    sec: { calendar: false, events: false, details: true, gallery: true, story: false, singers: true, dressCode: true },
    notes: [
      { title: 'Sovg‘a haqida', text: 'Sizning tashrifingiz — biz uchun eng yaxshi sovg‘a!' },
    ],
  },
  {
    slug: 'nikoh-sacred',
    name: 'Garden 🤍',
    base: 'luxe-vow',
    eventType: 'nikoh-toyi',
    price: 109000,
    emoji: '🤍',
    typo: 'classic',
    kicker: 'Nikoh kuni',
    desc: 'Nikoh uchun: fil suyagi rangi, bog‘ yashilligi va tilla naqsh',
    pal: {
      paper: '#F9F0E0', paper2: '#F1EAD8', paper3: '#E6DCC5',
      gold: '#7E8C55', goldLight: '#A8B87C', goldDark: '#59633A',
      ink: '#33392C', inkSoft: '#5C6550',
      wine: '#7D1F28', wineDark: '#4E1016',
      sage: '#89916B', blush: '#E2CDB4',
      petalA: '#DDE6CE', petalB: '#E2CDB4',
      gradA: '#F9F0E0', gradB: '#E6DCC5', accent: '#89916B',
    },
    demo: {
      groom: 'Jasurbek', bride: 'Ozodaxon', monogram: 'J&O',
      dateISO: '2027-05-15T17:00:00', dateLabel: '15.05.2027', timeLabel: '17:00',
      blessingLines: ['Ikki qalb', 'Bitta taqdir'],
      blessingSource: '',
      venueName: 'Bog‘i Eram marosimlar saroyi',
      venueAddress: 'Toshkent, Mirzo Ulug‘bek tumani, Buyuk Ipak Yo‘li ko‘chasi 84',
      lat: '41.3255', lng: '69.3401',
    },
    sec: { calendar: false, events: false, details: true, gallery: false, story: false, singers: false, dressCode: true },
    notes: [
      { title: 'Kiyim uslubi', text: 'Bayramona uslub. Iltimos, to‘q qizil va bordo ranglardan voz keching.' },
      { title: 'Sovg‘a haqida', text: 'Eng qimmatli sovg‘a — sizning ishtirokingiz.' },
    ],
  },
  {
    slug: 'qiz-bazmi-nafis',
    name: 'Qiz bazmi — Nafis',
    base: 'luxe-vow',
    eventType: 'qiz-bazmi',
    price: 99000,
    emoji: '🌿',
    typo: 'script',
    kicker: 'Qiz bazmi',
    desc: 'Nozik yashil akvarel, muhrli konvert va oq gullar',
    pal: {
      paper: '#F7F6EC', paper2: '#EFF1E1', paper3: '#E3E7D2',
      gold: '#8A6A34', goldLight: '#CFA95E', goldDark: '#54603A',
      ink: '#2E3A1E', inkSoft: '#4A5232',
      wine: '#77894E', wineDark: '#54603A',
      sage: '#7B8C53', blush: '#ECD9A4',
      petalA: '#CFA95E', petalB: '#7B8C53',
      gradA: '#F7F6EC', gradB: '#E3E7D2', accent: '#8A6A34',
    },
    demo: {
      groom: 'Nilufar', bride: '', monogram: 'N',
      dateISO: '2026-12-19T17:00:00', dateLabel: '19.12.2026', timeLabel: '17:00',
      blessingLines: ['Aziz mehmonlar', 'Keling, bazmimizni birga nishonlaymiz'],
      blessingSource: '',
      venueName: 'Gulzor Saroyi',
      venueAddress: 'Toshkent, Yunusobod tumani, Bog‘ishamol ko‘chasi 12',
      lat: '41.3671', lng: '69.2887',
    },
    sec: { calendar: true, events: false, details: true, gallery: false, story: false, singers: false, dressCode: false },
    notes: [{ title: 'Bazm haqida', text: 'Kina marosimi soat 18:00 da boshlanadi.' }],
  },
  {
    slug: 'qiz-bazmi-sharqona',
    name: 'Qiz bazmi — Sharqona',
    base: 'luxe-vow',
    eventType: 'qiz-bazmi',
    price: 99000,
    emoji: '🕌',
    typo: 'classic',
    kicker: 'Kina kechasi',
    desc: 'Bordo gilam, chiroqlar va tilla naqsh — sharqona uslub',
    pal: {
      paper: '#FBF6E6', paper2: '#F1E6C6', paper3: '#E4D5AC',
      gold: '#9A6A2F', goldLight: '#E0C07F', goldDark: '#5A3B28',
      ink: '#3A241A', inkSoft: '#5A3B28',
      wine: '#7A1F2B', wineDark: '#4A3222',
      sage: '#8A6A34', blush: '#D8B978',
      petalA: '#E0C07F', petalB: '#7A1F2B',
      gradA: '#FFF9EC', gradB: '#E4D5AC', accent: '#9A6A2F',
    },
    demo: {
      groom: 'Farida', bride: '', monogram: 'F',
      dateISO: '2026-12-12T11:00:00', dateLabel: '12.12.2026', timeLabel: '11:00',
      blessingLines: ['Sevinchimizga sherik bo‘ling', 'kinamizni birga yoqamiz'],
      blessingSource: '',
      venueName: 'Marğilon Restoranı',
      venueAddress: 'Mustaqillik ko‘chasi 663, Marg‘ilon, Farg‘ona',
      lat: '40.4711', lng: '71.7243',
    },
    sec: { calendar: true, events: false, details: true, gallery: false, story: false, singers: false, dressCode: false },
    notes: [{ title: 'An’ana', text: 'Kina marosimida milliy liboslar kutiladi.' }],
  },
  {
    slug: 'milliy-anor',
    name: 'Milliy',
    base: 'luxe-vow',
    eventType: 'toy',
    price: 109000,
    emoji: '🍎',
    typo: 'classic',
    kicker: 'To‘y marosimi',
    desc: 'Milliy uslub: anor naqshi, krem qog‘oz va tilla hoshiya',
    pal: {
      paper: '#F4EEE4', paper2: '#FFF4EA', paper3: '#EADFCF',
      gold: '#B07B2E', goldLight: '#D9B266', goldDark: '#5F211F',
      ink: '#3A2422', inkSoft: '#6B4A44',
      wine: '#5F211F', wineDark: '#3F1413',
      sage: '#7E8B62', blush: '#E4C9A8',
      petalA: '#5F211F', petalB: '#D9B266',
      gradA: '#F4EEE4', gradB: '#EADFCF', accent: '#5F211F',
    },
    demo: {
      groom: 'Bekzod', bride: 'Malikaxon', monogram: 'B&M',
      dateISO: '2027-05-08T18:00:00', dateLabel: '08.05.2027', timeLabel: '18:00',
      blessingLines: ['Muhabbat ila', 'ikki yurak bir bo‘ldi'],
      blessingSource: '',
      venueName: 'Yakka Saroy to‘yxonasi',
      venueAddress: 'Qashqadaryo viloyati, Qarshi shahri, Qarshi–Beshkent yo‘li 3-km',
      lat: '38.8606', lng: '65.7891',
    },
    sec: { calendar: true, events: false, details: true, gallery: true, story: false, singers: false, dressCode: false },
    notes: [{ title: 'Milliy urf-odat', text: 'To‘y dasturxonida milliy taomlar taqdim etiladi.' }],
  },
  {
    slug: 'sunnat-luxe',
    name: 'Sunnat to‘y 🤍',
    base: 'luxe-vow',
    eventType: 'sunnat-toyi',
    price: 89000,
    emoji: '🌙',
    typo: 'script',
    kicker: 'Sunnat to‘yi',
    desc: 'Fil suyagi va rose-gold rangda, doiraviy naqshinkor ramka',
    pal: {
      paper: '#FFFAF2', paper2: '#F8ECE4', paper3: '#F0DFD6',
      gold: '#B76E79', goldLight: '#E0A8B0', goldDark: '#8C4A54',
      ink: '#3A2A28', inkSoft: '#6A4F4C',
      wine: '#B76E79', wineDark: '#8C4A54',
      sage: '#A8A48C', blush: '#F0D9D2',
      petalA: '#F0D9D2', petalB: '#E0A8B0',
      gradA: '#FFFAF2', gradB: '#F0DFD6', accent: '#B76E79',
    },
    demo: {
      groom: 'Ozodbek', bride: '', monogram: 'O',
      dateISO: '2026-11-20T16:00:00', dateLabel: '20.11.2026', timeLabel: '16:00',
      blessingLines: ['Farzandimiz sharafiga', 'tantanali dasturxon'],
      blessingSource: '',
      venueName: '«Turkiston saltanat saroyi»',
      venueAddress: 'Toshkent shahri, Amir Temur ko‘chasi 94',
      lat: '41.3111', lng: '69.2797',
    },
    sec: { calendar: true, events: false, details: true, gallery: false, story: false, singers: false, dressCode: false },
    notes: [
      { title: 'Farzandimiz', text: 'Ozodbek — 5 yosh. Kichik mehmonlar uchun shirinliklar tayyor.' },
      { title: 'Sunnat to‘y egalari', text: 'Ulug‘bek–Nodira' },
    ],
  },
  {
    slug: 'nikoh-pearl',
    name: 'Pearl',
    base: 'luxe-vow',
    eventType: 'nikoh-toyi',
    price: 99000,
    emoji: '🤍',
    typo: 'minimal',
    kicker: 'To‘y nashri',
    desc: 'Nozik va oqimtir dizayn — eng muhim kunning sofligini aks ettiradi',
    pal: {
      paper: '#F8F5F0', paper2: '#F0E8DF', paper3: '#E5DCCC',
      gold: '#C9A96E', goldLight: '#E3CD9C', goldDark: '#8A7647',
      ink: '#1A1A1A', inkSoft: '#5A5A5A',
      wine: '#8A8A8A', wineDark: '#4A4A4A',
      sage: '#C8B89E', blush: '#EDE2D0',
      petalA: '#EDE2D0', petalB: '#C8B89E',
      gradA: '#F8F5F0', gradB: '#E5DCCC', accent: '#C9A96E',
    },
    demo: {
      groom: 'Bekzod', bride: 'Madina', monogram: 'B&M',
      dateISO: '2026-11-14T17:00:00', dateLabel: '14.11.2026', timeLabel: '17:00',
      blessingLines: ['Alloh ularning qalblarini', 'birlashtirdi'],
      blessingSource: '',
      venueName: 'Marvarid saroyi',
      venueAddress: 'Buxoro, Bahouddin Naqshband ko‘chasi 24',
      lat: '39.7747', lng: '64.4286',
    },
    sec: { calendar: false, events: false, details: true, gallery: true, story: true, singers: false, dressCode: false },
    notes: [{ title: 'To‘y nashri', text: 'Ushbu taklifnoma «Pearl» nashri asosida tayyorlandi.' }],
  },
  {
    slug: 'nikoh-velvet',
    name: 'Velvet',
    base: 'luxe-vow',
    eventType: 'nikoh-toyi',
    price: 99000,
    emoji: '🍷',
    typo: 'classic',
    kicker: 'Nikoh kechasi',
    desc: 'Boy ranglar va hashamatli bezaklar bilan to‘y taklifnomasining mukammal uslubi',
    pal: {
      paper: '#150509', paper2: '#1A060F', paper3: '#2A0810',
      gold: '#D4A87C', goldLight: '#F3D9A8', goldDark: '#8A5A3A',
      ink: '#F5E6D3', inkSoft: '#C9A98C',
      wine: '#5A1432', wineDark: '#3D0A1F',
      sage: '#8A5A3A', blush: '#4A0F24',
      petalA: '#5A1432', petalB: '#F3D9A8',
      gradA: '#0A0307', gradB: '#2A0810', accent: '#D4A87C',
    },
    demo: {
      groom: 'Oybek', bride: 'Nigora', monogram: 'O&N',
      dateISO: '2026-11-07T18:00:00', dateLabel: '07.11.2026', timeLabel: '18:00',
      blessingLines: ['Alloh ularning qalblarini', 'birlashtirdi'],
      blessingSource: '',
      venueName: 'Zarafshon to‘yxonasi',
      venueAddress: 'Toshkent shahri',
      lat: '41.3111', lng: '69.2797',
    },
    sec: { calendar: false, events: false, details: true, gallery: true, story: true, singers: false, dressCode: false },
    notes: [{ title: 'Kechki uslub', text: 'Kechki qorong‘i liboslar va oltin aksessuarlar.' }],
  },

  /* ------------------------------------------------- PREMIUM: watercolor-garden */
  {
    slug: 'nikoh-floral',
    name: 'Floral 💐',
    base: 'watercolor-garden',
    eventType: 'nikoh-toyi',
    price: 89000,
    emoji: '💐',
    typo: 'script',
    kicker: 'Nikoh to‘yi',
    desc: 'Akvarel gullar, nozik yashil bog‘ uslubi',
    pal: {
      paper: '#F4F6EF', paper2: '#EEF2E6', paper3: '#E2E9D6',
      gold: '#7D9160', goldLight: '#A8BD8A', goldDark: '#54683C',
      ink: '#33392C', inkSoft: '#5C6550',
      wine: '#A9545E', wineDark: '#8F565A',
      sage: '#7D9160', blush: '#E6D3D8',
      petalA: '#DBE8CD', petalB: '#E6D3D8',
      gradA: '#F4F6EF', gradB: '#E2E9D6', accent: '#7D9160',
    },
    demo: {
      groom: 'Azamat', bride: 'Shahnoza', monogram: 'A&S',
      dateISO: '2027-04-17T19:00:00', dateLabel: '17.04.2027', timeLabel: '19:00',
      blessingLines: ['Marosim haqida', 'tantanaga chin qalbdan taklif etamiz'],
      blessingSource: '',
      venueName: 'Banket zali «Delish»',
      venueAddress: 'Toshkent viloyati, Olmaliq shahar',
      lat: '40.8447', lng: '69.5983',
    },
    sec: { calendar: true, events: false, details: true, gallery: true, story: true, singers: true, dressCode: true },
    notes: [
      { title: 'Mehmonlar uchun', text: 'Bolalar uchun o‘yin maydonchasi tayyorlangan.' },
      { title: 'Sovg‘a haqida', text: 'Eng qimmatli sovg‘a — ezgu duolaringiz.' },
    ],
  },
  {
    slug: 'fotiha-floral',
    name: 'Floral Fotiha 💐',
    base: 'watercolor-garden',
    eventType: 'fotiha-toyi',
    price: 79000,
    emoji: '📖',
    typo: 'classic',
    kicker: 'Fotiha to‘yi',
    desc: 'Akvarel gullar, nozik yashil bog‘ uslubi — fotiha to‘yi uchun',
    pal: {
      paper: '#F4F6EF', paper2: '#EDF2E4', paper3: '#E0E8D3',
      gold: '#6F8552', goldLight: '#9FB37C', goldDark: '#4C5A32',
      ink: '#33392C', inkSoft: '#5C6550',
      wine: '#A9545E', wineDark: '#8F565A',
      sage: '#6F8552', blush: '#E6D3D8',
      petalA: '#D8E6C8', petalB: '#E6D3D8',
      gradA: '#F4F6EF', gradB: '#E0E8D3', accent: '#6F8552',
    },
    demo: {
      groom: 'Azamat', bride: 'Shahnoza', monogram: 'A&S',
      dateISO: '2027-04-17T19:00:00', dateLabel: '17.04.2027', timeLabel: '19:00',
      blessingLines: ['Yaxshilik bilan boshlanadi', 'ezgu niyatlar'],
      blessingSource: '',
      venueName: 'Banket zali «Delish»',
      venueAddress: 'Toshkent viloyati, Olmaliq shahar',
      lat: '40.8447', lng: '69.5983',
    },
    sec: { calendar: true, events: false, details: true, gallery: true, story: true, singers: false, dressCode: false },
    notes: [{ title: 'Eslatma', text: 'Marosimdan so‘ng dasturxon ochiladi.' }],
  },
  {
    slug: 'nikoh-gul',
    name: 'Gul',
    base: 'watercolor-garden',
    eventType: 'nikoh-toyi',
    price: 89000,
    emoji: '🌸',
    typo: 'script',
    kicker: 'Bir sevgi',
    desc: 'Romantik gulli dizayn — nozik va bezakli gullar bilan',
    pal: {
      paper: '#F9F1E7', paper2: '#F2E6D8', paper3: '#E8D9C6',
      gold: '#8B7355', goldLight: '#DCBFA0', goldDark: '#5F4E38',
      ink: '#3B3B3B', inkSoft: '#6B6B6B',
      wine: '#FB7185', wineDark: '#E05575',
      sage: '#A8B48C', blush: '#FBD9DF',
      petalA: '#FBC7D4', petalB: '#DCBFA0',
      gradA: '#F9F1E7', gradB: '#E8D9C6', accent: '#FB7185',
    },
    demo: {
      groom: 'Farhod', bride: 'Shirin', monogram: 'F&S',
      dateISO: '2026-10-24T17:00:00', dateLabel: '24.10.2026', timeLabel: '17:00',
      blessingLines: ['Bir sevgi', 'bir umr'],
      blessingSource: '',
      venueName: '«Bog‘ Restorani»',
      venueAddress: 'Toshkent, Amir Temur shoh ko‘chasi 107',
      lat: '41.3111', lng: '69.2797',
    },
    sec: { calendar: true, events: false, details: true, gallery: true, story: true, singers: false, dressCode: false },
    notes: [{ title: 'Xotiralarimiz', text: 'Go‘zal xotiralaringizni biz bilan ulashing.' }],
  },

  /* ------------------------------------------------------- ODDIY: noir-gradient */
  {
    slug: 'nikoh-aurora',
    name: 'Aurora',
    base: 'noir-gradient',
    eventType: 'nikoh-toyi',
    price: 89000,
    emoji: '🌌',
    typo: 'classic',
    kicker: 'Visol oqshomi',
    desc: 'Sirli va romantik muhit yaratuvchi noyob gradient dizayn',
    pal: {
      paper: '#1A1530', paper2: '#221A3C', paper3: '#2B2148',
      gold: '#C9B6E3', goldLight: '#E8D4F5', goldDark: '#A8D0E6',
      ink: '#F4F1FA', inkSoft: '#C3BAD8',
      wine: '#FFB6D2', wineDark: '#FF9EC0',
      sage: '#88E5D3', blush: '#B8A3FF',
      petalA: '#B8A3FF', petalB: '#FFB6D2',
      gradA: '#0F0A25', gradB: '#2A1F4A', accent: '#88E5D3',
    },
    demo: {
      groom: 'Ali', bride: 'Aziza', monogram: 'A&A',
      dateISO: '2026-11-21T19:00:00', dateLabel: '21.11.2026', timeLabel: '19:00',
      blessingLines: ['Allah ularning qalblarini', 'birlashtirdi'],
      blessingSource: '',
      venueName: 'Nur Palace',
      venueAddress: 'Toshkent shahri',
      lat: '41.3111', lng: '69.2797',
    },
    sec: { calendar: false, events: false, details: true, gallery: false, story: true, singers: false, dressCode: false },
    notes: [{ title: 'Shafaq kechasi', text: 'Kechqurun soat 19:00 da marosim boshlanadi.' }],
  },
  {
    slug: 'nikoh-epic',
    name: 'Epic',
    base: 'noir-gradient',
    eventType: 'nikoh-toyi',
    price: 89000,
    emoji: '🎬',
    typo: 'minimal',
    kicker: 'Katta kun',
    desc: 'Dadil, kinematografik dizayn — ta’sirchan va salobatli ko‘rinish',
    pal: {
      paper: '#12100C', paper2: '#1A0E00', paper3: '#241A0C',
      gold: '#FBBF24', goldLight: '#FDE08A', goldDark: '#F59E0B',
      ink: '#FDF6E7', inkSoft: '#CDBB99',
      wine: '#1976D2', wineDark: '#1565C0',
      sage: '#1976D2', blush: '#2B3550',
      petalA: '#FBBF24', petalB: '#1976D2',
      gradA: '#0A0806', gradB: '#1A0E00', accent: '#1976D2',
    },
    demo: {
      groom: 'Temur', bride: 'Lola', monogram: 'T&L',
      dateISO: '2026-10-17T18:00:00', dateLabel: '17.10.2026', timeLabel: '18:00',
      blessingLines: ['Bizning sevgi hikoyamiz', 'shu kunda yangi bosqichga chiqadi'],
      blessingSource: '',
      venueName: 'Anhor Lounge',
      venueAddress: 'Toshkent, Navoiy ko‘chasi 30',
      lat: '41.3111', lng: '69.2797',
    },
    sec: { calendar: false, events: false, details: true, gallery: false, story: true, singers: false, dressCode: false },
    notes: [{ title: 'Kinematik kechа', text: 'Kechaning boshida maxsus video taqdim etiladi.' }],
  },
  {
    slug: 'nikoh-modern',
    name: 'Zamonaviy',
    base: 'noir-gradient',
    eventType: 'nikoh-toyi',
    price: 79000,
    emoji: '🖤',
    typo: 'minimal',
    kicker: 'Nikoh kuni',
    desc: 'Mobil qurilmalar uchun optimallashtirilgan zamonaviy va nafis dizayn',
    pal: {
      paper: '#070707', paper2: '#16171A', paper3: '#21231F',
      gold: '#C9A96E', goldLight: '#F5E0A0', goldDark: '#8B6045',
      ink: '#F4EAD8', inkSoft: '#B48A58',
      wine: '#A07840', wineDark: '#6F4C33',
      sage: '#8B6045', blush: '#D6BB8F',
      petalA: '#D6BB8F', petalB: '#C9A96E',
      gradA: '#050505', gradB: '#21231F', accent: '#C9A96E',
    },
    demo: {
      groom: 'Sarvar', bride: 'Surayyo', monogram: 'S&S',
      dateISO: '2026-10-10T16:00:00', dateLabel: '10.10.2026', timeLabel: '16:00',
      blessingLines: ['Allah ularning qalblarini', 'birlashtirdi'],
      blessingSource: '',
      venueName: 'Hilton Tashkent City',
      venueAddress: 'Toshkent, Islom Karimov ko‘chasi 2',
      lat: '41.3169', lng: '69.2797',
    },
    sec: { calendar: true, events: false, details: true, gallery: true, story: true, singers: false, dressCode: true },
    notes: [{ title: 'Xush kelibsiz', text: 'Avtomobil uchun bepul to‘xtash joyi mavjud.' }],
  },
]

/* ============================================================
 *  CONFIG QURISH
 * ============================================================ */
const maps = (lat, lng, name) => ({
  googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}`,
  yandexMapsUrl: `https://yandex.uz/maps/?ll=${lng}%2C${lat}&z=17&text=${encodeURIComponent(name)}`,
})

function buildConfig(t) {
  const d = t.demo
  const s = t.sec
  const schedule = SCHEDULES[t.eventType] ?? SCHEDULES['nikoh-toyi']
  const m = maps(d.lat, d.lng, d.venueName)

  return {
    couple: {
      groom: d.groom,
      bride: d.bride,
      monogram: d.monogram,
      photo: '',
    },
    envelope: { kicker: 'Sizga taklifnoma keldi' },
    event: {
      dateISO: d.dateISO,
      dateLabel: d.dateLabel,
      timeLabel: d.timeLabel,
      kicker: t.kicker,
    },
    blessing: {
      arabic: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
      lines: d.blessingLines,
      source: d.blessingSource,
      greeting: 'Aziz Mehmonimiz',
      text: `Sizni ${t.kicker.toLowerCase()} munosabati bilan bo‘lib o‘tadigan “Visol oqshomi”ga taklif etamiz. Quvonchimizni biz bilan baham ko‘rishingizni intiqlik bilan kutamiz.`,
      heart: true,
    },
    dearGuests: {
      enabled: true,
      greeting: 'Aziz va qadrli insonimiz!',
      text: 'Ushbu quvonchli kunda bizga hamroh bo‘lishingizni va ezgu tilaklaringiz bilan duo qilishingizni so‘raymiz.',
      signature: '',
    },
    countdown: {
      title: 'Bayramgacha qoldi',
      finishedText: 'Bugun bizning kunimiz!',
    },
    calendar: {
      enabled: !!s.calendar,
      kicker: 'Sana va vaqt',
      title: 'Kalendar',
    },
    events: {
      enabled: !!s.events,
      kicker: 'Dastur',
      title: t.events?.length > 1 ? 'To‘y dasturi va manzili' : 'Tadbir manzili',
      note: t.events?.length > 1 ? 'Ikkala marosimda ham sizni ko‘rishdan baxtiyor bo‘lamiz.' : '',
      items: (t.events ?? [
        {
          kicker: 'Asosiy marosim',
          title: t.kicker,
          dateLabel: d.dateLabel,
          timeLabel: d.timeLabel,
          venueName: d.venueName,
          venueAddress: d.venueAddress,
          lat: d.lat,
          lng: d.lng,
        },
      ]).map((ev) => ({
        kicker: ev.kicker,
        title: ev.title,
        dateLabel: ev.dateLabel,
        timeLabel: ev.timeLabel,
        venueName: ev.venueName,
        venueAddress: ev.venueAddress ?? '',
        ...maps(ev.lat, ev.lng, ev.venueName),
      })),
    },
    timeline: { title: 'Kun tartibi', items: schedule },
    details: { enabled: true },
    venue: {
      title: 'Manzil',
      name: d.venueName,
      address: d.venueAddress,
      ...m,
    },
    gallery: {
      enabled: !!s.gallery,
      title: 'Bizning xotiralar',
      photos: s.gallery ? PHOTOS.warm : [],
    },
    story: {
      enabled: !!s.story,
      kicker: 'Bizning hikoyamiz',
      title: 'Bizning sayohatimiz',
      text: 'Ikki yurak bir-birini topdi. Bir oqshomda boshlangan suhbat butun umrlik sevgiga aylandi. Bugun siz bilan bu baxtli kunni nishonlashga taklif etamiz.',
      photo: '',
    },
    singers: {
      enabled: !!s.singers,
      kicker: 'Maxsus mehmonlar',
      title: 'Kechaning yulduzlari',
      text: 'Bayramimizni yanada yorqin qiladigan san’atkorlar.',
      layout: 'slider',
      items: s.singers ? SINGERS : [],
    },
    dressCode: {
      enabled: !!s.dressCode,
      title: 'Kiyim uslubi',
      text: 'Bayramona uslub. Iltimos, kiyimlaringiz mavzu palitrasiga mos bo‘lsin.',
      palette: [t.pal.gold, t.pal.paper2, t.pal.blush],
    },
    notes: t.notes,
    rsvp: {
      enabled: true,
      title: 'Ishtirokni tasdiqlang',
      text: 'Dasturxonni to‘g‘ri tayyorlashimiz uchun, iltimos, kelishingizni oldindan bildiring.',
      sealText: 'RSVP',
      openHint: 'Ochish uchun bosing',
      successText: 'Rahmat! Javobingiz qabul qilindi.',
    },
    gift: {
      enabled: true,
      title: 'To‘yona',
      cardNumber: '5614 6822 1499 0956',
      cardHolder: 'AZAMAT KOCHIMOV',
      copyLabel: 'Karta raqamini nusxalash',
      copiedLabel: 'Nusxalandi!',
    },
    wishes: {
      enabled: true,
      title: 'Tilaklar daftari',
      namePlaceholder: 'Ismingizni kiriting',
      messagePlaceholder: 'Xabaringizni yozing',
      submitLabel: 'Xabar yuborish',
      successText: 'Tilagingiz uchun rahmat!',
    },
    footer: {
      title: 'Sizni ko‘rishdan baxtiyor bo‘lamiz!',
      signature: '',
      photo: '',
    },
    music: { enabled: true, src: '/music.mp3' },
    petals: { enabled: true, count: 14 },
  }
}

const HEADER = `/* ============================================================================
 *  TAKLIFNOMA SOZLAMALARI
 *  ---------------------------------------------------------------------------
 *  Bu fayl AVTOMATIK yaratilgan: scripts/generate-taklif-templates.mjs
 *  Mazmunni o'zgartirish uchun skriptdagi shablon yozuvini tahrirlang.
 * ==========================================================================*/

`

function buildConfigFile(t) {
  return `${HEADER}export const config = ${JSON.stringify(buildConfig(t), null, 2)} as const

export type Config = typeof config
`
}

/* ============================================================
 *  CSS QURISH
 * ============================================================ */
function buildCss(t) {
  const p = t.pal
  const f = TYPOS[t.typo]

  return `@import 'tailwindcss';

/* Umumiy core/ moduli: Tailwind avtomatik skaneri faqat shablon papkasini
   ko'radi, shu sababli umumiy komponentlardagi sinflar (grid, flex, bg-paper-2,
   py-20 ...) generatsiya qilinmay qolardi — natijada bo'limlar buzuq chiqardi. */
@source '../../core';

/* Shriftlar loyiha ichidan yuklanadi — tashqi so'rov yo'q. Qarang: core/fonts.css */
@import '../../core/fonts.css';

/* ===========================================================================
   DIZAYN TIZIMI — palitra: ${t.slug} · tipografiya: ${t.typo} · baza: ${t.base}
   Bu fayl avtomatik yaratilgan: scripts/generate-taklif-templates.mjs
   =========================================================================== */
@theme {
  --color-paper: ${p.paper};
  --color-paper-2: ${p.paper2};
  --color-paper-3: ${p.paper3};

  --color-gold: ${p.gold};
  --color-gold-light: ${p.goldLight};
  --color-gold-dark: ${p.goldDark};

  --color-ink: ${p.ink};
  --color-ink-soft: ${p.inkSoft};

  --color-wine: ${p.wine};
  --color-wine-dark: ${p.wineDark};

  --color-sage: ${p.sage};
  --color-blush: ${p.blush};

  --font-script: ${f.script};
  --font-display: ${f.display};
  --font-body: ${f.body};
  --font-arabic: 'Amiri', 'Times New Roman', serif;

  --animate-fall: fall linear infinite;
  --animate-shimmer: shimmer 6s ease-in-out infinite;
  --animate-pulse-soft: pulse-soft 2.6s ease-in-out infinite;
  --animate-float: float 5s ease-in-out infinite;
}

/* Palitra o'zgaruvchilari — SVG bezaklar va gradientlar shu yerdan rang oladi */
:root {
  --tpl-petal-a: ${p.petalA};
  --tpl-petal-b: ${p.petalB};
  --tpl-grad-a: ${p.gradA};
  --tpl-grad-b: ${p.gradB};
  --tpl-accent: ${p.accent};
}

@keyframes fall {
  0% {
    transform: translate3d(0, -10vh, 0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.85;
  }
  90% {
    opacity: 0.85;
  }
  100% {
    transform: translate3d(var(--drift, 40px), 110vh, 0) rotate(var(--spin, 360deg));
    opacity: 0;
  }
}

@keyframes shimmer {
  0%,
  100% {
    opacity: 0.35;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes pulse-soft {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.045);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* ===========================================================================
   ASOSIY
   =========================================================================== */
html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  background-color: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
  font-size: 18px;
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Konvert ochilmaguncha sahifa qimirlamasin */
body.is-locked {
  overflow: hidden;
}

/* Telefonda tugmani bosganda matn belgilanib qolmasin */
button,
a,
svg {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

/* ===========================================================================
   YORDAMCHI SINFLAR
   =========================================================================== */
.paper-grain::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.5;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E");
}

.text-gilded {
  background: linear-gradient(
    100deg,
    var(--color-gold-dark) 0%,
    var(--color-gold-light) 42%,
    var(--color-gold) 62%,
    var(--color-gold-dark) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.tracking-wider-caps {
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 1s cubic-bezier(0.22, 1, 0.36, 1),
    transform 1s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}
.reveal.is-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
  }
}

@keyframes reveal-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
`
}

const HTML = `<!doctype html>
<html lang="uz">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./src/main.tsx"></script>
  </body>
</html>
`

/* ============================================================
 *  GENERATSIYA
 * ============================================================ */
let created = 0
const skipped = []

for (const t of T) {
  const baseDir = path.join(SRC, t.base)
  const destDir = path.join(SRC, t.slug)

  if (!fs.existsSync(path.join(baseDir, 'src', 'App.tsx'))) {
    skipped.push(`${t.slug} (baza topilmadi: ${t.base})`)
    continue
  }

  // 1. Baza fayllarini nusxalash (faqat birinchi marta — qo'lda qilingan
  //    o'zgarishlar yo'qolmasin)
  if (!fs.existsSync(destDir)) {
    fs.cpSync(baseDir, destDir, { recursive: true })
  }

  // 2. Palitra + tipografiya
  fs.writeFileSync(path.join(destDir, 'src', 'index.css'), buildCss(t))
  // 3. Mazmun va bo'limlar
  fs.writeFileSync(path.join(destDir, 'src', 'config-default.ts'), buildConfigFile(t))
  // 4. index.html
  fs.writeFileSync(path.join(destDir, 'index.html'), HTML)

  created++
  console.log(`✓ ${t.slug.padEnd(22)} ${t.base.padEnd(18)} ${t.eventType}`)
}

/* ============================================================
 *  SEED UCHUN PLAN — `prisma/seed.ts` shu faylni o'qiydi
 * ============================================================ */
const plan = {
  eventTypes: EVENT_TYPES,
  templates: T.map((t) => ({
    slug: t.slug,
    name: t.name,
    base: t.base,
    eventType: t.eventType,
    palette: t.slug,
    typo: t.typo,
    desc: t.desc,
    price: t.price,
    emoji: t.emoji,
    kicker: t.kicker,
    tier: t.price >= 99000 ? 'premium' : 'standard',
  })),
}

fs.writeFileSync(
  path.join(__dirname, 'templates-plan-taklif.json'),
  `${JSON.stringify(plan, null, 2)}\n`
)

console.log(`\nTayyor: ${created} shablon yozildi.`)
console.log(`Plan: scripts/templates-plan-taklif.json (${plan.templates.length} shablon, ${EVENT_TYPES.length} tadbir turi)`)
if (skipped.length) console.log(`O'tkazib yuborildi: ${skipped.join(', ')}`)
