import Image from "next/image";
import Link from "next/link";
import { getCatalog } from "@/lib/catalogData";
import { Faq } from "@/components/site/Faq";
import { PreviewFrame } from "@/components/site/PreviewFrame";
import { thumbUrl } from "@/lib/thumbs";
import { Reveal } from "@/components/site/Reveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { TelegramIcon } from "@/components/site/TelegramIcon";
import { TemplateCard } from "@/components/site/TemplateCard";
import { formatPrice } from "@/lib/catalog";
import { CUSTOM_MUSIC_PRICE, TIER_PRICE, type Tier } from "@/lib/pricing";
import { telegramUrl } from "@/lib/contact";
import { getDictionary, t } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

const HERO_TEMPLATE = "nikoh-imperial";

export default async function HomePage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const home = dict.home;

  const { eventTypes, templates } = await getCatalog();
  const featured = templates.slice(0, 6);
  const total = templates.length;

  // Bosh sahifadagi jonli namuna — eng chiroyli ko'rinadigan Imperial
  const hero = templates.find((tpl) => tpl.slug === HERO_TEMPLATE) ?? featured[0];

  const [heroTitleBefore, heroTitleAfter] = home.heroTitle.split("{highlight}");

  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans text-stone-900">
      {/* Dekorativ fon */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[26rem] w-[26rem] rounded-full bg-rose-100/60 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-[26rem] w-[26rem] rounded-full bg-amber-100/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-stone-200/40 blur-3xl" />
      </div>

      <div className="relative z-10">
        <SiteHeader locale={locale} dict={dict} />

        {/* ============================================================ HERO */}
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 lg:pb-24 lg:pt-16">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Reveal>
                <p className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-1.5 text-[13px] font-medium text-amber-800 shadow-sm backdrop-blur">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {t(home.badge, { total })}
                </p>
              </Reveal>

              <Reveal delay={120}>
                <h1 className="mt-6 font-serif text-[2.7rem] font-bold leading-[1.06] tracking-tight sm:text-6xl">
                  {heroTitleBefore}
                  <span className="text-gold-gradient">{home.heroTitleHighlight}</span>
                  {heroTitleAfter}
                </h1>
              </Reveal>

              <Reveal delay={240}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">{home.heroText}</p>
              </Reveal>

              <Reveal delay={360}>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Link
                    href="/shablonlar"
                    className="group relative overflow-hidden rounded-full bg-stone-900 px-8 py-4 font-semibold text-white shadow-xl shadow-stone-900/20 transition hover:-translate-y-0.5 hover:shadow-2xl"
                  >
                    <span className="relative z-10">{home.ctaViewTemplates}</span>
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-rose-600 to-amber-600 transition-transform duration-500 group-hover:translate-x-0" />
                  </Link>
                  <Link
                    href="#qanday"
                    className="rounded-full border border-stone-300 bg-white/70 px-8 py-4 font-semibold text-stone-700 backdrop-blur transition hover:border-stone-400 hover:bg-white"
                  >
                    {home.ctaHowItWorks}
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={480}>
                <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4">
                  {[
                    { v: String(total), l: home.statTemplates },
                    { v: String(eventTypes.length), l: home.statEventTypes },
                    { v: home.statFast, l: home.statFastLabel },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="rounded-2xl border border-stone-200/80 bg-white/70 px-4 py-5 text-center backdrop-blur"
                    >
                      <dt className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl">
                        {s.v}
                      </dt>
                      <dd className="mt-1 text-xs text-stone-500">{s.l}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            {/* Jonli namuna — telefon ramkasida */}
            <Reveal delay={300} className="justify-self-center">
              <div className="relative">
                <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-amber-100/70 via-rose-100/50 to-transparent blur-2xl" />

                <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-[2.75rem] border-[10px] border-stone-900 bg-stone-900 shadow-[0_40px_80px_-40px_rgba(60,45,20,0.7)]">
                  <div className="overflow-hidden rounded-[2.1rem]">
                    {hero &&
                      (thumbUrl(hero.theme, "phone") ? (
                        // Birinchi ekrandagi asosiy rasm (LCP) — darhol yuklanadi
                        <Image
                          src={thumbUrl(hero.theme, "phone")!}
                          alt={hero.name}
                          width={320}
                          height={600}
                          priority
                          sizes="320px"
                          className="block h-[600px] w-full object-cover object-top"
                        />
                      ) : (
                        <PreviewFrame
                          mode="showcase"
                          src={`/preview/${hero.theme}`}
                          title={hero.name}
                          className="block h-[600px] w-full border-0"
                        />
                      ))}
                  </div>
                </div>

                {hero && (
                  <div className="absolute -bottom-10 left-1/2 w-[78%] -translate-x-1/2 rounded-2xl border border-stone-200 bg-white/95 px-5 py-3.5 shadow-xl backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-stone-400">
                          {home.liveSampleLabel}
                        </p>
                        <p className="font-serif text-sm font-bold text-stone-900">
                          {hero.name}
                        </p>
                      </div>
                      <Link
                        href={`/shablon/${hero.slug}`}
                        className="rounded-full bg-stone-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-rose-700"
                      >
                        {home.liveSampleView}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ==================================================== SHABLONLAR */}
        <section id="shablonlar" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-20">
          <Reveal>
            <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">
                  {home.templatesTag}
                </p>
                <h2 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">
                  {home.templatesTitle}
                </h2>
                <p className="mt-3 max-w-xl text-stone-600">{home.templatesText}</p>
              </div>
              <Link
                href="/shablonlar"
                className="rounded-full border border-stone-300 bg-white/70 px-6 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-white"
              >
                {t(home.templatesAll, { total })}
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((tpl, i) => (
              <Reveal key={tpl.id} delay={i * 80}>
                <TemplateCard
                  template={{
                    slug: tpl.slug,
                    name: tpl.name,
                    theme: tpl.theme,
                    description: tpl.description,
                    price: tpl.price,
                    previewEmoji: tpl.previewEmoji,
                    eventName: tpl.eventType.name,
                  }}
                  dict={dict}
                />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================================================== TAQQOSLASH */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white/70 backdrop-blur">
              <div className="border-b border-stone-200/80 px-8 py-9 text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">
                  {home.compareTag}
                </p>
                <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">{home.compareTitle}</h2>
                <p className="mx-auto mt-3 max-w-2xl text-stone-600">{home.compareText}</p>
              </div>

              <div className="grid gap-px bg-stone-200/80 sm:grid-cols-2">
                <div className="bg-white/80 p-8">
                  <h3 className="font-serif text-lg font-bold text-stone-500">{home.compareOldTitle}</h3>
                  <ul className="mt-5 space-y-3.5 text-sm text-stone-500">
                    {home.compareOld.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-200 text-[10px] text-stone-500">
                          ✕
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-amber-50/80 to-white p-8">
                  <h3 className="font-serif text-lg font-bold text-stone-900">{home.compareNewTitle}</h3>
                  <ul className="mt-5 space-y-3.5 text-sm text-stone-700">
                    {home.compareNew.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-700">
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ================================================== XUSUSIYATLAR */}
        <section id="xususiyatlar" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-20">
          <Reveal>
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">
                {home.featuresTag}
              </p>
              <h2 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">{home.featuresTitle}</h2>
              <p className="mx-auto mt-3 max-w-2xl text-stone-600">{home.featuresText}</p>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {home.features.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <div className="h-full rounded-3xl border border-stone-200/80 bg-white/80 p-7 transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_28px_60px_-40px_rgba(60,45,20,0.7)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 text-xl">
                    {f.icon}
                  </span>
                  <h3 className="mt-5 font-serif text-lg font-bold text-stone-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================================================= QANDAY ISHLAYDI */}
        <section id="qanday" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-20">
          <Reveal>
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">{home.stepsTag}</p>
              <h2 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">{home.stepsTitle}</h2>
            </div>
          </Reveal>

          <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-11 hidden border-t-2 border-dashed border-stone-300 lg:block" />
            {home.steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <div className="relative h-full rounded-3xl border border-stone-200/80 bg-white p-7 shadow-sm">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 font-serif text-lg font-bold text-white shadow-lg shadow-rose-200">
                    {s.n}
                  </div>
                  <h3 className="mt-5 font-semibold text-stone-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ======================================================== NARXLAR */}
        <section id="narxlar" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-20">
          <Reveal>
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">{home.pricingTag}</p>
              <h2 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">{home.pricingTitle}</h2>
              <p className="mx-auto mt-3 max-w-2xl text-stone-600">{home.pricingText}</p>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {home.plans.map((p, i) => (
              <Reveal key={p.key} delay={i * 90}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl border p-8 transition duration-300 ${
                    p.badge
                      ? "border-amber-300 bg-gradient-to-b from-amber-50/90 to-white shadow-[0_30px_70px_-45px_rgba(120,85,20,0.9)]"
                      : "border-stone-200/80 bg-white/80"
                  }`}
                >
                  {p.badge && (
                    <span className="absolute -top-3 left-8 rounded-full bg-stone-900 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                      {p.badge}
                    </span>
                  )}

                  <h3 className="font-serif text-xl font-bold text-stone-900">{p.name}</h3>
                  <p className="mt-1.5 text-sm text-stone-500">{p.text}</p>

                  <p className="mt-6 font-serif text-3xl font-bold text-stone-900">
                    {t(dict.common.priceShort, { price: formatPrice(TIER_PRICE[p.key as Tier]) })}
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-stone-600">
                    {p.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-700">
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/shablonlar?tarif=${p.key}`}
                    className={`mt-8 rounded-full py-3.5 text-center text-sm font-semibold transition ${
                      p.badge
                        ? "bg-stone-900 text-white hover:bg-rose-700"
                        : "border border-stone-300 text-stone-700 hover:border-stone-400 hover:bg-white"
                    }`}
                  >
                    {home.plansCtaButton}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-stone-500">
            {t(home.pricingFooterNote, { music: formatPrice(CUSTOM_MUSIC_PRICE) })}
          </p>

          <Reveal>
            <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-3 rounded-3xl border border-dashed border-amber-300/70 bg-amber-50/50 px-6 py-6 text-center sm:flex-row sm:text-left">
              <span className="text-3xl">🎨</span>
              <p className="flex-1 text-sm text-stone-700">{home.customDesignText}</p>
              <a
                href={telegramUrl(home.customDesignTelegramMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                {home.customDesignCta}
              </a>
            </div>
          </Reveal>
        </section>

        {/* ======================================================= SAVOLLAR */}
        <section id="savollar" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-20">
          <Reveal>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">{home.faqTag}</p>
              <h2 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">{home.faqTitle}</h2>
            </div>
          </Reveal>
          <Faq items={dict.faq} />
        </section>

        {/* ============================================================= CTA */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-14 text-center shadow-[0_40px_90px_-50px_rgba(20,18,16,0.9)]">
              <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-amber-500/35 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-rose-500/35 blur-3xl" />

              <p className="relative text-xs font-semibold uppercase tracking-[0.28em] text-amber-300/90">
                {home.ctaTag}
              </p>
              <h2 className="relative mt-4 font-serif text-3xl font-bold text-white sm:text-4xl">
                {home.ctaTitle}
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-stone-300">{home.ctaText}</p>
              <div className="relative mt-9 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/shablonlar"
                  className="rounded-full bg-white px-8 py-4 font-semibold text-stone-900 shadow-xl transition hover:-translate-y-0.5"
                >
                  {home.ctaTemplateBtn}
                </Link>
                <Link
                  href="/buyurtma"
                  className="rounded-full border border-white/25 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
                >
                  {home.ctaOrderBtn}
                </Link>
                <a
                  href={telegramUrl(dict.common.telegramGenericMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-8 py-4 font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-sky-400"
                >
                  <TelegramIcon />
                  Telegram: {dict.common.telegramLabel}
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        <SiteFooter
          eventTypes={eventTypes.map((e) => ({ slug: e.slug, name: e.name, emoji: e.emoji }))}
          dict={dict}
        />
      </div>
    </div>
  );
}
