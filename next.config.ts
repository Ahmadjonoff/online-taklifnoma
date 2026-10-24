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
  // Route handler'lar shablon HTML'ini `fs` bilan o'qiydi — Vercel
  // function bundle'iga bu fayllar aniq kiritilishi shart (public/ odatda
  // faqat CDN orqali beriladi).
  outputFileTracingIncludes: {
    "/e/[slug]": ["./public/t/*/index.html"],
    "/preview/[theme]": ["./public/t/*/index.html"],
  },
  images: {
    // Katalog rasmlari (public/thumbs) faqat `npm run thumbs` bilan
    // o'zgaradi — optimallashtirilgan nusxa 31 kun keshda tursin (standart
    // 4 soatda Vercel har safar qayta optimallashtirardi)
    minimumCacheTTL: 60 * 60 * 24 * 31,
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        // Vite chiqargan JS/CSS/shriftlar nomida hash bor — o'zgarsa nomi
        // ham o'zgaradi, shuning uchun brauzer ularni qayta so'ramasin.
        source: "/t/:theme/assets/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Nomida hash yo'q — bir kun keshlanadi, keyin fonda yangilanadi
        source: "/thumbs/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        source: "/music.mp3",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
      {
        // Musiqa kutubxonasi (public/music) — bir hafta
        source: "/music/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
    ];
  },
};

export default nextConfig;
