import { OrderForm } from "@/components/OrderForm";
import { BrandMark } from "@/components/site/BrandMark";
import { TelegramIcon } from "@/components/site/TelegramIcon";
import { telegramUrl } from "@/lib/contact";
import { getCatalog } from "@/lib/catalogData";
import { defaultTimeline } from "@/lib/eventDefaults";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";
import { MUSIC_TRACKS } from "@/lib/music";
import { getPalettes, mainColors, roleSwatches } from "@/lib/palettes";
import { tierOf } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ shablon?: string; tadbir?: string }>;
}) {
  const { shablon, tadbir } = await searchParams;
  const locale = await getLocale();
  const dict = getDictionary(locale);

  // Katalogda faqat faol shablonlar bor — nofaol shablonga buyurtma berilmaydi
  const { templates } = await getCatalog();
  const template = shablon ? templates.find((tpl) => tpl.slug === shablon) : undefined;

  const palettes = template
    ? getPalettes(template.theme).map((p) => ({
        id: p.id,
        name: p.name,
        // Palitra kartasidagi chiziq: fon → ikkinchi fon → urg'u → ikkinchi urg'u → matn
        strip: ["--color-paper", "--color-paper-3", "--color-gold", "--color-wine", "--color-ink"]
          .map((k) => p.vars[k])
          .filter(Boolean),
        main: mainColors(p),
      }))
    : [];
  const categories = (template?.categories ?? []).map((c) => ({
    slug: c.slug,
    name: c.name,
    timeline: defaultTimeline(c.slug),
  }));
  // Katalogdan tadbir turi bo'yicha kelgan bo'lsa (?tadbir=) — o'sha, aks holda asosiy turi
  const defaultEventType =
    categories.find((c) => c.slug === tadbir)?.slug ?? template?.eventType.slug ?? "";

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-rose-100/50 blur-3xl" />
        <div className="absolute -right-40 top-1/2 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-stone-200/70 bg-[#faf7f2]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-2.5 font-serif text-xl font-bold">
            <BrandMark className="h-8 w-auto" />
            {dict.common.brand}
          </a>
          <a
            href={telegramUrl(dict.common.telegramQuestionMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/70 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-sky-300 hover:text-sky-800"
          >
            <TelegramIcon />
            <span className="hidden sm:inline">{dict.common.telegramLabel}</span>
            <span className="sm:hidden">{dict.nav.telegram}</span>
          </a>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">{dict.order.tag}</p>
        <h1 className="mt-1 font-serif text-4xl font-bold tracking-tight">{dict.order.title}</h1>
        <p className="mt-3 max-w-xl text-stone-600">{dict.order.text}</p>
        <p className="mt-4 max-w-xl rounded-2xl border border-amber-200 bg-amber-50/70 px-5 py-4 text-sm leading-relaxed text-amber-900">
          {dict.common.priceNote}
        </p>

        <div className="mt-10">
          <OrderForm
            templateSlug={template?.slug ?? ""}
            templateName={template?.name ?? dict.order.title}
            templateTheme={template?.theme ?? ""}
            templatePrice={template?.price ?? 0}
            tier={tierOf(template?.price ?? 0)}
            palettes={palettes}
            swatches={template ? roleSwatches(template.theme) : { paper: [], gold: [], wine: [] }}
            categories={categories}
            defaultEventType={defaultEventType}
            musicTracks={MUSIC_TRACKS}
            dict={dict}
          />
        </div>
      </main>
    </div>
  );
}
