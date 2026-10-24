"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LOCALES, LOCALE_COOKIE, LOCALE_LABEL, type Locale } from "@/lib/i18n/locales";

const SHORT_LABEL: Record<Locale, string> = {
  uz: "UZ",
  uzc: "ЎЗ",
  ru: "RU",
  en: "EN",
};

/**
 * Til almashtirgich.
 *
 * NEGA SHUNDAY: sahifalar `force-dynamic` server komponent bo'lgani uchun
 * URL prefiksiga (/en/...) hojat yo'q — cookie o'rnatib `router.refresh()`
 * chaqirish yetarli, server komponentlar yangi tilni o'qib qayta render
 * qiladi.
 */
/** Komponentdan tashqarida: cookie — brauzerning global holati (react-hooks/immutability) */
function saveLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function choose(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    saveLocaleCookie(next);
    startTransition(() => router.refresh());
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Til / Язык / Language"
        aria-expanded={open}
        disabled={pending}
        className="flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-stone-300 bg-white/70 px-3.5 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-white disabled:opacity-60"
      >
        {SHORT_LABEL[locale]}
        <svg width="9" height="6" viewBox="0 0 9 6" fill="none" aria-hidden="true">
          <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-stone-200 bg-white py-1.5 shadow-xl shadow-stone-200/60">
            {LOCALES.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => choose(l)}
                className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition ${
                  l === locale ? "font-semibold text-rose-700" : "text-stone-700 hover:bg-stone-50"
                }`}
              >
                {LOCALE_LABEL[l]}
                {l === locale && <span aria-hidden="true">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
