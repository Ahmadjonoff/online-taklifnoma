import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// scripts/build-templates.sh tomonidan ishlatiladi:
//   TPL_SLUG=shablon-nomi TPL_OUT=chiqish-papkasi npx vite build --config bu-fayl
const slug = process.env.TPL_SLUG!;
const PROJ = fileURLToPath(new URL("..", import.meta.url));
const r = (p: string) => PROJ + p;

export default defineConfig({
  root: r(`templates-src/${slug}`),
  plugins: [react(), tailwindcss()],
  base: `/t/${slug}/`,
  build: {
    outDir: process.env.TPL_OUT!,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@core": r("./templates-src/core"),
      "@ui": r(`./templates-src/${slug}/src/components/ui.tsx`),
      "@decor": r(`./templates-src/${slug}/src/components/decor`),
      "@config": r(`./templates-src/${slug}/src/config.ts`),
    },
  },
});
