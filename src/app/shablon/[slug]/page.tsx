import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/site/Reveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { TemplateCard } from "@/components/site/TemplateCard";
import { TelegramIcon } from "@/components/site/TelegramIcon";
import { TIER_STYLE, tierOf } from "@/lib/catalog";
import { telegramUrl } from "@/lib/contact";
import { getDictionary, t } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = await prisma.template.findUnique({
    where: { slug },
    include: { eventType: true },
  });

  if (!template) return { title: "Shablon topilmadi" };

  return {
    title: `${template.name} — ${template.eventType.name} shabloni`,
    description: template.description,
  };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const td = dict.templateDetail;

  const template = await prisma.template.findUnique({
    where: { slug },
    include: { eventType: true },
  });

  if (!template || !template.isActive) notFound();

  const tier = tierOf(template.price);
  const tierLabel = tier === "premium" ? dict.common.tierPremium : dict.common.tierStandard;
  const tierFeatures = tier === "premium" ? td.featuresPremium : td.featuresStandard;

  const [related, eventTypes, total] = await Promise.all([
    prisma.template.findMany({
      where: { isActive: true, eventTypeId: template.eventTypeId, NOT: { id: template.id } },
      include: { eventType: true },
      orderBy: [{ price: "desc" }, { id: "asc" }],
      take: 3,
    }),
    prisma.eventType.findMany({ orderBy: { order: "asc" } }),
    prisma.template.count({ where: { isActive: true } }),
  ]);

  let timeline: Array<{ time: string; label: string }> = [];
  try {
    timeline = JSON.parse(template.timeline || "[]");
  } catch {
    timeline = [];
  }

  let notes: Array<{ title: string; text: string }> = [];
  try {
    notes = JSON.parse(template.notes || "[]");
  } catch {
    notes = [];
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans text-stone-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[26rem] w-[26rem] rounded-full bg-rose-100/50 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-amber-100/45 blur-3xl" />
      </div>

      <div className="relative z-10">
        <SiteHeader locale={locale} dict={dict} />

        <main className="mx-auto max-w-6xl px-6 pb-20 pt-8">
          <nav className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/" className="transition hover:text-rose-700">
              {dict.common.homeLink}
            </Link>
            <span className="text-stone-300">/</span>
            <Link href="/shablonlar" className="transition hover:text-rose-700">
              {td.breadcrumbTemplates}
            </Link>
            <span className="text-stone-300">/</span>
            <span className="text-stone-700">{template.name}</span>
          </nav>

          <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px]">
            {/* -------------------------------------------------- Chap panel */}
            <div className="lg:order-2 lg:sticky lg:top-24 lg:self-start">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider ${TIER_STYLE[tier]}`}
              >
                {tier === "premium" ? "★ " : ""}
                {t(td.tierBadge, { tier: tierLabel })}
              </span>

              <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight">
                {template.name}
              </h1>

              <p className="mt-2 text-sm text-stone-500">
                {template.previewEmoji} {template.eventType.name}
              </p>

              <p className="mt-4 leading-relaxed text-stone-600">{template.description}</p>

              <div className="mt-7 rounded-3xl border border-stone-200 bg-white p-7 shadow-[0_30px_70px_-50px_rgba(60,45,20,0.9)]">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-stone-500">{td.paymentLabel}</span>
                  <span className="font-serif text-2xl font-bold text-stone-900">
                    {dict.common.priceShort}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-stone-500">{dict.common.priceNote}</p>

                <ul className="mt-6 space-y-3 text-sm text-stone-600">
                  {tierFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-700">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/buyurtma?shablon=${template.slug}`}
                  className="group mt-7 block rounded-full bg-gradient-to-r from-rose-600 to-rose-700 py-4 text-center font-semibold text-white shadow-lg shadow-rose-300/50 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {td.orderBtn}
                  <span className="ml-1 inline-block transition group-hover:translate-x-1">→</span>
                </Link>

                <a
                  href={telegramUrl(t(dict.common.telegramTemplateMsg, { name: template.name }))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 rounded-full border border-stone-300 py-3.5 text-center text-sm font-semibold text-stone-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                >
                  <TelegramIcon />
                  {td.telegramBtn}
                </a>

                <p className="mt-3 text-center text-xs text-stone-400">{td.noOnlinePayment}</p>
              </div>

              {/* Dastur va eslatmalar */}
              {(timeline.length > 0 || notes.length > 0) && (
                <div className="mt-6 rounded-3xl border border-stone-200/80 bg-white/70 p-6">
                  {timeline.length > 0 && (
                    <>
                      <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                        {td.programTitle}
                      </h2>
                      <ol className="mt-4 space-y-2.5">
                        {timeline.map((item, i) => (
                          <li key={`${item.time}-${i}`} className="flex items-baseline gap-3 text-sm">
                            <span className="w-12 shrink-0 font-serif font-semibold text-stone-800">
                              {item.time}
                            </span>
                            <span className="text-stone-600">{item.label}</span>
                          </li>
                        ))}
                      </ol>
                    </>
                  )}

                  {notes.length > 0 && (
                    <div className={timeline.length > 0 ? "mt-6 border-t border-stone-200/80 pt-5" : ""}>
                      <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                        {td.notesTitle}
                      </h2>
                      <ul className="mt-4 space-y-3">
                        {notes.map((n) => (
                          <li key={n.title}>
                            <p className="text-sm font-medium text-stone-800">{n.title}</p>
                            <p className="text-sm text-stone-500">{n.text}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ------------------------------------------------- O'ng panel */}
            <div className="lg:order-1">
              <p className="mb-4 text-center text-sm font-medium text-stone-500">{td.livePreviewHint}</p>

              <Reveal>
                <div className="relative mx-auto w-full max-w-[380px]">
                  <div className="absolute -inset-5 -z-10 rounded-[3rem] bg-gradient-to-br from-amber-100/70 via-rose-100/40 to-transparent blur-2xl" />
                  <div className="overflow-hidden rounded-[2.75rem] border-[10px] border-stone-900 bg-stone-900 shadow-[0_40px_80px_-45px_rgba(60,45,20,0.8)]">
                    <div className="overflow-hidden rounded-[2.1rem]">
                      <iframe
                        src={`/preview/${template.theme}`}
                        title={template.name}
                        loading="lazy"
                        className="h-[720px] w-full border-0"
                        sandbox="allow-scripts allow-same-origin"
                      />
                    </div>
                  </div>
                </div>
              </Reveal>

              <div className="mx-auto mt-8 grid max-w-[380px] grid-cols-3 gap-3 text-center">
                {[
                  { v: td.statPhone, l: td.statPhoneLabel },
                  { v: td.statQr, l: td.statQrLabel },
                  { v: td.statRsvp, l: td.statRsvpLabel },
                ].map((s) => (
                  <div key={s.l} className="rounded-2xl border border-stone-200/80 bg-white/70 px-3 py-4">
                    <p className="font-serif text-sm font-bold text-stone-900">{s.v}</p>
                    <p className="mt-0.5 text-[11px] text-stone-500">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --------------------------------------------- O'xshash shablonlar */}
          {related.length > 0 && (
            <section className="mt-20">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">
                    {td.relatedTag}
                  </p>
                  <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
                    {t(td.relatedTitle, { event: template.eventType.name })}
                  </h2>
                </div>
                <Link
                  href={`/shablonlar?tadbir=${template.eventType.slug}`}
                  className="text-sm font-medium text-stone-600 transition hover:text-rose-700"
                >
                  {t(td.relatedAll, { total })}
                </Link>
              </div>

              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((rel, i) => (
                  <Reveal key={rel.id} delay={i * 80}>
                    <TemplateCard
                      template={{
                        slug: rel.slug,
                        name: rel.name,
                        theme: rel.theme,
                        description: rel.description,
                        price: rel.price,
                        previewEmoji: rel.previewEmoji,
                        eventName: rel.eventType.name,
                      }}
                      dict={dict}
                    />
                  </Reveal>
                ))}
              </div>
            </section>
          )}
        </main>

        <SiteFooter
          eventTypes={eventTypes.map((e) => ({ slug: e.slug, name: e.name, emoji: e.emoji }))}
          dict={dict}
        />
      </div>
    </div>
  );
}
