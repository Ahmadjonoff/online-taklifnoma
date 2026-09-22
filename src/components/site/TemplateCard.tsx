import Link from "next/link";
import { TIER_STYLE, tierOf } from "@/lib/catalog";
import type { Dictionary } from "@/lib/i18n/dictionary";

export type CardTemplate = {
  slug: string;
  name: string;
  theme: string;
  description: string;
  price: number;
  previewEmoji: string;
  eventName: string;
};

/**
 * Shablon kartasi — ichida jonli preview (iframe) turadi.
 *
 * MUHIM: iframe `scale` bilan kichraytiriladi va `width: 238%` bilan
 * kengaytiriladi, shu tariqa telefon ekrani karta ichiga sig'adi.
 */
export function TemplateCard({ template, dict }: { template: CardTemplate; dict: Dictionary }) {
  const tier = tierOf(template.price);
  const tierLabel = tier === "premium" ? dict.common.tierPremium : dict.common.tierStandard;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm transition duration-500 hover:-translate-y-1.5 hover:border-amber-200 hover:shadow-[0_28px_60px_-30px_rgba(60,45,20,0.4)]">
      {/* Jonli preview */}
      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-stone-100 to-stone-50">
        {/* pointer-events-none: bu shunchaki karta ichidagi vitrina —
            sichqoncha ustiga kelib scroll qilinganda iframe o'zining ichki
            kontentini emas, sahifani scroll qilishi kerak. Shablonni
            ko'rish uchun pastdagi "Ko'rish" tugmasi bosilib, alohida
            sahifaga o'tiladi. */}
        <iframe
          src={`/preview/${template.theme}`}
          title={template.name}
          loading="lazy"
          className="pointer-events-none h-[640px] w-full scale-[0.42] border-0 transition-transform duration-[900ms] group-hover:scale-[0.45]"
          style={{ transformOrigin: "top left", width: "238%" }}
          sandbox="allow-scripts allow-same-origin"
          tabIndex={-1}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-transparent" />

        <span
          className={`absolute left-3 top-3 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider shadow-sm backdrop-blur ${TIER_STYLE[tier]}`}
        >
          {tier === "premium" ? "★ " : ""}
          {tierLabel}
        </span>

        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-stone-600 shadow backdrop-blur">
          {template.previewEmoji} {template.eventName}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg font-bold text-stone-900">{template.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-stone-500">
          {template.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-5">
          <span className="text-sm font-semibold text-amber-800">
            {dict.common.priceShort}
          </span>
          <Link
            href={`/shablon/${template.slug}`}
            prefetch={false}
            className="group/btn inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
          >
            {dict.templateCard.view}
            <span className="transition group-hover/btn:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
