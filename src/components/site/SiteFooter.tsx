import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { InstagramIcon } from "./InstagramIcon";
import { TelegramIcon } from "./TelegramIcon";
import { INSTAGRAM_DM_URL, telegramUrl } from "@/lib/contact";
import { t, type Dictionary } from "@/lib/i18n/dictionary";

/** Sayt pastidagi umumiy blok. */
export function SiteFooter({
  eventTypes = [],
  dict,
}: {
  eventTypes?: Array<{ slug: string; name: string; emoji: string }>;
  dict: Dictionary;
}) {
  return (
    <footer className="relative border-t border-stone-200/80 bg-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <BrandMark />
            <span className="font-serif text-lg font-bold text-stone-900">{dict.common.brand}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-500">{dict.footer.tagline}</p>
          <p className="mt-3 text-xs text-stone-500">{dict.footer.priceLine}</p>
          <p className="mt-1 text-xs text-stone-500">{dict.footer.customDesignLine}</p>
          <a
            href={telegramUrl(dict.common.telegramGenericMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-sky-300 hover:text-sky-800"
          >
            <TelegramIcon />
            {dict.common.telegramLabel}
          </a>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            {dict.footer.eventTypesTitle}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-stone-600">
            {eventTypes.slice(0, 6).map((et) => (
              <li key={et.slug}>
                <Link href={`/shablonlar?tadbir=${et.slug}`} className="transition hover:text-rose-700">
                  {et.emoji} {et.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400">{dict.footer.pagesTitle}</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-stone-600">
            <li>
              <Link href="/shablonlar" className="transition hover:text-rose-700">
                {dict.footer.templatesCatalog}
              </Link>
            </li>
            <li>
              <Link href="/#narxlar" className="transition hover:text-rose-700">
                {dict.footer.pricing}
              </Link>
            </li>
            <li>
              <Link href="/#qanday" className="transition hover:text-rose-700">
                {dict.footer.howItWorks}
              </Link>
            </li>
            <li>
              <Link href="/#savollar" className="transition hover:text-rose-700">
                {dict.footer.faq}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            {dict.footer.contactTitle}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-stone-600">
            <li>
              <a
                href={telegramUrl(dict.common.telegramQuestionMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition hover:text-rose-700"
              >
                <TelegramIcon />
                {t(dict.footer.telegramContact, { label: dict.common.telegramLabel })}
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM_DM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition hover:text-rose-700"
              >
                <InstagramIcon />
                {dict.common.instagramDm}
              </a>
            </li>
            <li>
              <Link href="/buyurtma" className="transition hover:text-rose-700">
                {dict.footer.orderLink}
              </Link>
            </li>
            <li className="text-xs text-stone-500">{dict.footer.orderHint}</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-stone-200/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-stone-500 sm:flex-row">
          <p>{t(dict.footer.copyright, { year: new Date().getFullYear() })}</p>
          <p className="font-serif italic text-stone-400">{dict.footer.quote}</p>
        </div>
      </div>
    </footer>
  );
}
