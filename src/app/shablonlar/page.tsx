import Link from "next/link";
import { getCatalog } from "@/lib/catalogData";
import { Reveal } from "@/components/site/Reveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { TemplateCatalog, type CatalogTemplate } from "@/components/site/TemplateCatalog";
import { getDictionary, t } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shablonlar katalogi — Online taklifnomalar",
  description:
    "To'y, nikoh, sunnat to'yi, qiz bazmi va boshqa tadbirlar uchun jonli online taklifnoma shablonlari.",
};

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ tadbir?: string; tarif?: string }>;
}) {
  const { tadbir, tarif } = await searchParams;
  const initialTier = tarif === "standard" || tarif === "premium" || tarif === "luxury" ? tarif : "all";
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const { eventTypes, templates } = await getCatalog();

  const catalog: CatalogTemplate[] = templates.map((t) => ({
    slug: t.slug,
    name: t.name,
    theme: t.theme,
    description: t.description,
    price: t.price,
    previewEmoji: t.previewEmoji,
    eventName: t.eventType.name,
    categories: t.categories.map(({ slug, name }) => ({ slug, name })),
  }));

  const activeType = eventTypes.find((e) => e.slug === tadbir);

  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans text-stone-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[26rem] w-[26rem] rounded-full bg-rose-100/50 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-[26rem] w-[26rem] rounded-full bg-amber-100/45 blur-3xl" />
      </div>

      <div className="relative z-10">
        <SiteHeader locale={locale} dict={dict} />

        <main className="mx-auto max-w-6xl px-6 pb-20 pt-10">
          <nav className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/" className="transition hover:text-rose-700">
              {dict.common.homeLink}
            </Link>
            <span className="text-stone-300">/</span>
            <span className="text-stone-700">
              {activeType ? activeType.name : dict.catalog.breadcrumbTemplates}
            </span>
          </nav>

          <Reveal>
            <div className="mt-5 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">
                {activeType ? `${activeType.emoji} ${activeType.name}` : dict.catalog.tagCatalog}
              </p>
              <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight sm:text-5xl">
                {activeType ? t(dict.catalog.titleForEvent, { event: activeType.name }) : dict.catalog.titleAll}
              </h1>
              <p className="mt-4 text-stone-600">
                {t(dict.catalog.subtitle, { count: templates.length })}
              </p>
            </div>
          </Reveal>

          <div className="mt-10">
            <TemplateCatalog
              templates={catalog}
              eventTypes={eventTypes.map((et) => ({
                slug: et.slug,
                name: et.name,
                emoji: et.emoji,
                count: et._count.templates,
              }))}
              initialEvent={tadbir && activeType ? tadbir : ""}
              initialTier={initialTier}
              dict={dict}
            />
          </div>
        </main>

        <SiteFooter
          eventTypes={eventTypes.map((e) => ({ slug: e.slug, name: e.name, emoji: e.emoji }))}
          dict={dict}
        />
      </div>
    </div>
  );
}
