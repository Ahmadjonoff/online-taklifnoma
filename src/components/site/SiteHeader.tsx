"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "./BrandMark";
import { InstagramIcon } from "./InstagramIcon";
import { TelegramIcon } from "./TelegramIcon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { INSTAGRAM_DM_URL, telegramUrl } from "@/lib/contact";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const NAV = [
    { href: "/#shablonlar", label: dict.nav.templates },
    { href: "/#xususiyatlar", label: dict.nav.features },
    { href: "/#qanday", label: dict.nav.howItWorks },
    { href: "/#narxlar", label: dict.nav.pricing },
    { href: "/#savollar", label: dict.nav.faq },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-stone-200/80 bg-[#faf7f2]/85 backdrop-blur-xl shadow-[0_10px_30px_-24px_rgba(60,45,20,0.5)]"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <BrandMark />
          <span className="font-serif text-xl font-bold tracking-tight text-stone-900">
            {dict.common.brand}
          </span>
        </Link>

        <nav className="hidden items-center gap-5 whitespace-nowrap text-sm font-medium text-stone-600 xl:flex xl:gap-6">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="shrink-0 transition hover:text-rose-700">
              {item.label}
            </Link>
          ))}
          <a
            href={telegramUrl(dict.common.telegramQuestionMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-stone-300 bg-white/70 px-4 py-2.5 text-stone-700 transition hover:border-sky-300 hover:text-sky-800"
          >
            <TelegramIcon />
            {dict.nav.telegram}
          </a>
          <Link
            href="/shablonlar"
            className="shrink-0 rounded-full bg-stone-900 px-5 py-2.5 text-white shadow-lg shadow-stone-900/15 transition hover:-translate-y-0.5 hover:bg-rose-700"
          >
            {dict.nav.chooseTemplate}
          </Link>
          <LanguageSwitcher locale={locale} />
        </nav>

        <div className="flex items-center gap-2 xl:hidden">
          <LanguageSwitcher locale={locale} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={dict.nav.menu}
            aria-expanded={open}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-300 text-stone-700 transition hover:bg-white"
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
              {open ? (
                <path d="M2 2l14 10M16 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M1 1h16M1 7h16M1 13h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-stone-200/80 bg-[#faf7f2]/95 px-6 py-4 backdrop-blur-xl xl:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-stone-700 transition hover:bg-white"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={telegramUrl(dict.common.telegramQuestionMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-sky-300 bg-sky-50 px-5 py-3 text-center text-sm font-semibold text-sky-800"
            >
              <TelegramIcon />
              Telegram: {dict.common.telegramLabel}
            </a>
            <a
              href={INSTAGRAM_DM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-fuchsia-300 bg-fuchsia-50 px-5 py-3 text-center text-sm font-semibold text-fuchsia-800"
            >
              <InstagramIcon />
              {dict.common.instagramDm}
            </a>
            <Link
              href="/shablonlar"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-stone-900 px-5 py-3 text-center text-sm font-semibold text-white"
            >
              {dict.nav.chooseTemplate}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
