import type { NextConfig } from "next";

// DIQQAT: templates-src/* shablonlari Next.js ilovasi tomonidan import
// qilinmaydi — ular alohida `scripts/vite.template.config.ts` orqali
// build qilinib, statik HTML sifatida `public/t/<slug>/` ichiga chiqariladi
// va `src/app/e/[slug]/route.ts` shu statik faylni o'qiydi. Shu sababli
// bu yerda @core/@ui/@decor/@config kabi alias kerak emas (avval bu yerda
// noto'g'ri, ishlatilmaydigan "SHABLON" literal yo'li bilan o'lik alias bor
// edi — olib tashlandi).
const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
