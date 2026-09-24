import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // `{ createdAt: _createdAt, ...rest }` — maydonni tashlab yuborishning odatiy usuli
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { ignoreRestSiblings: true, argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  globalIgnores([
    // eslint-config-next standart ro'yxati
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generatsiya qilingan va alohida (Vite) build qilinadigan kod
    "src/generated/**",
    "public/**",
    "templates-src/**",
    "scripts/**",
  ]),
]);

export default eslintConfig;
