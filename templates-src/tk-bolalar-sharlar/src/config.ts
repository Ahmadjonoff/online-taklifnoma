/**
 * Config shim — platforma uchun.
 *
 * Shablon ichidagi `config` ni runtime'da almashtiradi:
 * /e/<slug> sahifasi bazadan o'qilgan kontentni `window.__INV_CONFIG__` ga
 * qo'yadi, shim esa uni default config ustiga merge qiladi.
 *
 * Default config — shu papkadagi config-default.ts (generator yozadi,
 * shablonning "brand" qiymatlari: palitra, kicker, timeline, notes).
 */

type Plain = Record<string, unknown>;

function isPlainObject(v: unknown): v is Plain {
  return (
    typeof v === "object" &&
    v !== null &&
    !Array.isArray(v) &&
    !(v instanceof Date)
  );
}

function deepMerge<T>(base: T, patch: unknown): T {
  if (!isPlainObject(patch)) return base;
  if (!isPlainObject(base)) return patch as T;
  const out: Plain = { ...(base as Plain) };
  for (const [k, v] of Object.entries(patch)) {
    out[k] =
      isPlainObject(v) && isPlainObject(out[k])
        ? deepMerge(out[k], v)
        : (v as unknown);
  }
  return out as T;
}

declare global {
  interface Window {
    __INV_CONFIG__?: unknown;
  }
}

import { config as defaultConfig } from "./config-default";

const merged = deepMerge(defaultConfig, window.__INV_CONFIG__ ?? {});

export const config = merged;
export type Config = typeof merged;
