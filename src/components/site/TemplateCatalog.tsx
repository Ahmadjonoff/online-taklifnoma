"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TemplateCard, type CardTemplate } from "./TemplateCard";
import { formatPrice, tierOf, type Tier } from "@/lib/catalog";
import { TIER_PRICE } from "@/lib/pricing";
import { t, type Dictionary } from "@/lib/i18n/dictionary";

/** `categories` — shablon ko'rinadigan barcha tadbir turlari (bitta dizayn bir nechta tadbirga mos) */
export type CatalogTemplate = CardTemplate & { categories: { slug: string; name: string }[] };

type EventTypeOption = { slug: string; name: string; emoji: string; count: number };

/**
 * Tartiblash.
 *
 * Narx bo'yicha tartiblash — narxlar ochiq (src/lib/pricing.ts).
 */
type SortKey = "featured" | "priceAsc" | "priceDesc" | "name";
export type TierFilter = "all" | Tier;

/**
 * Katalog — qidiruv, tadbir turi, daraja va tartiblash.
 *
 * Filtrlash mijoz tomonida bajariladi: shablonlar soni bir necha o'nlab, shu
 * sababli har bir filtr o'zgarishida serverga borish shart emas va natija
 * darhol ko'rinadi.
 */
export function TemplateCatalog({
  templates,
  eventTypes,
  initialEvent = "",
  initialTier = "all",
  dict,
}: {
  templates: CatalogTemplate[];
  eventTypes: EventTypeOption[];
  initialEvent?: string;
  /** ?tarif= — bosh sahifadagi tarif kartasidan kelinganda */
  initialTier?: TierFilter;
  dict: Dictionary;
}) {
  const SORT_LABEL: Record<SortKey, string> = {
    featured: dict.catalog.sortFeatured,
    priceAsc: dict.catalog.sortPriceAsc,
    priceDesc: dict.catalog.sortPriceDesc,
    name: dict.catalog.sortName,
  };

  // Tarif tugmalari arzonidan qimmatiga: narxi bilan birga ko'rinadi
  const TIER_OPTIONS: Array<{ value: TierFilter; label: string; price?: number }> = [
    { value: "all", label: dict.catalog.tierAll },
    { value: "standard", label: dict.catalog.tierStandard, price: TIER_PRICE.standard },
    { value: "premium", label: dict.catalog.tierPremium, price: TIER_PRICE.premium },
    { value: "luxury", label: dict.catalog.tierLuxury, price: TIER_PRICE.luxury },
  ];

  const [query, setQuery] = useState("");
  const [event, setEvent] = useState(initialEvent);
  const [tier, setTier] = useState<TierFilter>(initialTier);
  const [sort, setSort] = useState<SortKey>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeExtraFilters = sort !== "featured" ? 1 : 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = templates.filter((t) => {
      if (event && !t.categories.some((c) => c.slug === event)) return false;
      if (tier !== "all" && tierOf(t.price) !== tier) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.categories.some((c) => c.name.toLowerCase().includes(q))
      );
    });

    const sorted = [...list];
    if (sort === "priceAsc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sort === "priceDesc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name, "uz"));
    return sorted;
  }, [templates, query, event, tier, sort]);

  return (
    <div>
      {/* Boshqaruv paneli */}
      <div className="rounded-3xl border border-stone-200/80 bg-white/70 p-5 shadow-[0_20px_50px_-40px_rgba(60,45,20,0.6)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2.5">
            <label className="relative flex-1">
              <span className="sr-only">{dict.catalog.searchLabel}</span>
              <svg
                width="17"
                height="17"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
              >
                <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={dict.catalog.searchPlaceholder}
                className="w-full rounded-full border border-stone-300 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </label>

            {/* Daraja/tartiblash select'lari kichik ekranda joy egallamasin deb
                "Filtr" tugmasi ortiga yashiriladi — lg'dan boshlab doim ochiq. */}
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              aria-expanded={filtersOpen}
              className="relative flex shrink-0 items-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 lg:hidden"
            >
              {dict.catalog.filtersToggle}
              {activeExtraFilters > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-semibold text-white">
                  {activeExtraFilters}
                </span>
              )}
              <svg
                width="10" height="7" viewBox="0 0 10 7" fill="none" aria-hidden="true"
                className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`}
              >
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className={`${filtersOpen ? "flex" : "hidden"} flex-wrap items-center gap-2.5 lg:flex`}>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-700 outline-none transition focus:border-rose-400"
            >
              {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
                <option key={k} value={k}>
                  {SORT_LABEL[k]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tarif (narx) filtri — doim ko'rinib turadi */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-stone-500">
            {dict.catalog.tierFilterLabel}
          </span>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {TIER_OPTIONS.map((o) => {
              const active = tier === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setTier(o.value)}
                  aria-pressed={active}
                  className={`rounded-2xl border px-4 py-2 text-left text-sm transition ${
                    active
                      ? "border-amber-500 bg-amber-50 text-stone-900 ring-2 ring-amber-400/30"
                      : "border-stone-300 bg-white/70 text-stone-700 hover:border-stone-400 hover:bg-white"
                  }`}
                >
                  <span className="font-semibold">{o.label.replace(/^★\s*/, "")}</span>
                  {o.price !== undefined && (
                    <span className="block text-xs text-stone-500">
                      {t(dict.common.priceShort, { price: formatPrice(o.price) })}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tadbir turi chiplari — kichik ekranda ko'p qatorga cho'zilib
            ketmasin deb bitta qatorda gorizontal scroll qilinadi. */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:overflow-visible lg:pb-0">
          <button
            type="button"
            onClick={() => setEvent("")}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              !event
                ? "bg-stone-900 text-white shadow-md"
                : "border border-stone-300 bg-white/70 text-stone-700 hover:border-stone-400 hover:bg-white"
            }`}
          >
            {dict.catalog.chipAll}
          </button>

          {eventTypes.map((et) => (
            <button
              key={et.slug}
              type="button"
              onClick={() => setEvent(et.slug)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                event === et.slug
                  ? "bg-stone-900 text-white shadow-md"
                  : "border border-stone-300 bg-white/70 text-stone-700 hover:border-stone-400 hover:bg-white"
              }`}
            >
              {et.emoji} {et.name}
            </button>
          ))}
        </div>
      </div>

      {/* Natija */}
      <div className="mt-6 flex items-center justify-between text-sm text-stone-500">
        {/* Bo'lim/tadbir bo'yicha shablonlar soni ataylab ko'rsatilmaydi */}
        <span />
        {(query || event || tier !== "all") && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setEvent("");
              setTier("all");
            }}
            className="font-medium text-rose-700 transition hover:underline"
          >
            {dict.catalog.clearFilters}
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tpl) => (
          <TemplateCard
            key={tpl.slug}
            // Tadbir turi bo'yicha filtrlanganda kartada o'sha tur nomi ko'rinsin
            template={{
              ...tpl,
              eventName: tpl.categories.find((c) => c.slug === event)?.name ?? tpl.eventName,
            }}
            dict={dict}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-14 rounded-3xl border border-dashed border-stone-300 bg-white/60 p-16 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-4 font-serif text-lg font-semibold text-stone-800">{dict.catalog.emptyTitle}</p>
          <p className="mt-2 text-sm text-stone-500">{dict.catalog.emptyText}</p>
          <Link
            href="/shablonlar"
            className="mt-5 inline-block rounded-full bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700"
          >
            {dict.catalog.emptyCta}
          </Link>
        </div>
      )}
    </div>
  );
}
