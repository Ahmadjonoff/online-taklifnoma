import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { OrderActions } from "@/components/OrderActions";
import { customizationSummary, parseStoredCustomization } from "@/lib/customization";
import { musicTrack } from "@/lib/music";
import { tierLabel } from "@/lib/catalog";
import { formatPrice, tierOf } from "@/lib/pricing";

const TIER_NAMES = { tierStandard: "Standart", tierPremium: "Premium", tierLuxury: "Luxury" };
import { findPalette } from "@/lib/palettes";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;
const FILTERS = [
  { key: "", label: "Hammasi" },
  { key: "PENDING", label: "Kutilmoqda" },
  { key: "PAID", label: "Tasdiqlangan" },
  { key: "REJECTED", label: "Bekor qilingan" },
  { key: "demo", label: "🧪 Demo" },
] as const;

type Search = { holat?: string; q?: string; sahifa?: string };

function adminHref(sp: Search, patch: Partial<Search>) {
  const next = { ...sp, ...patch };
  const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]).toString();
  return `/boshqaruv${qs ? `?${qs}` : ""}`;
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const filter = FILTERS.some((f) => f.key === sp.holat) ? (sp.holat ?? "") : "";
  const q = (sp.q ?? "").trim().slice(0, 80);
  const page = Math.max(1, Number(sp.sahifa) || 1);
  const idQuery = Number(q.replace(/^#/, ""));

  // Demo buyurtmalar faqat «Demo» tabida; qolgan tablarda — haqiqiy buyurtmalar
  const where: Prisma.OrderWhereInput = {
    ...(filter === "demo" ? { isDemo: true } : { isDemo: false, ...(filter ? { status: filter } : {}) }),
    ...(q
      ? {
          OR: [
            { customerName: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
            { invitation: { is: { title: { contains: q, mode: "insensitive" } } } },
            { invitation: { is: { slug: { contains: q.toLowerCase() } } } },
            ...(Number.isInteger(idQuery) && idQuery > 0 ? [{ id: idQuery }] : []),
          ],
        }
      : {}),
  };

  const [orders, found, real, demoCount] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        template: { include: { categories: { select: { slug: true, name: true } } } },
        invitation: true,
      },
      orderBy: { id: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
    prisma.order.findMany({
      where: { isDemo: false },
      select: { status: true, price: true, template: { select: { price: true } } },
    }),
    prisma.order.count({ where: { isDemo: true } }),
  ]);
  const pages = Math.max(1, Math.ceil(found / PAGE_SIZE));

  // Statistika — faqat haqiqiy (demo bo'lmagan) buyurtmalar
  const stats = {
    total: real.length,
    pending: real.filter((o) => o.status === "PENDING").length,
    paid: real.filter((o) => o.status === "PAID").length,
    revenue: real
      .filter((o) => o.status === "PAID")
      .reduce((sum, o) => sum + (o.price || o.template.price), 0),
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <header className="bg-stone-900 py-5 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <h1 className="font-serif text-lg font-bold">Admin panel</h1>
          <div className="flex items-center gap-5 text-sm">
            <Link href="/boshqaruv/javoblar" className="text-stone-300 hover:text-white">
              RSVP va tilaklar
            </Link>
            <Link href="/" className="text-stone-300 hover:text-white">
              ← Saytga
            </Link>
            <form action="/api/admin/logout" method="post">
              <button className="rounded-full border border-stone-700 px-3 py-1 text-xs text-stone-400 transition hover:border-stone-500 hover:text-white">
                Chiqish
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Statistika */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Jami buyurtma", value: String(stats.total), emoji: "📦" },
            { label: "Kutilmoqda", value: String(stats.pending), emoji: "⏳" },
            { label: "Tasdiqlangan", value: String(stats.paid), emoji: "✅" },
            {
              label: "To'langan buyurtmalar summasi",
              value: `${formatPrice(stats.revenue)} so'm`,
              emoji: "💰",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-stone-500">{s.label}</p>
                <span className="text-lg">{s.emoji}</span>
              </div>
              <p className="mt-1 font-serif text-2xl font-bold text-stone-900">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-stone-400">
          Statistika faqat haqiqiy buyurtmalar bo&apos;yicha — {demoCount} ta demo/test buyurtma hisobga olinmagan.
        </p>

        {/* Buyurtmalar */}
        <div className="mb-4 mt-10 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">Buyurtmalar</h2>
          <form action="/boshqaruv" className="flex gap-2">
            {filter && <input type="hidden" name="holat" value={filter} />}
            <input
              name="q"
              defaultValue={q}
              placeholder="Ism, telefon, #raqam yoki havola"
              className="w-64 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm outline-none focus:border-stone-500"
            />
            <button className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white">Qidirish</button>
          </form>
        </div>
        <nav className="mb-5 flex flex-wrap gap-2 text-sm">
          {FILTERS.map((f) => (
            <Link
              key={f.key}
              href={adminHref({ q }, { holat: f.key })}
              className={`rounded-full border px-4 py-1.5 transition ${
                filter === f.key ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white text-stone-600 hover:border-stone-400"
              }`}
            >
              {f.label}
            </Link>
          ))}
          <span className="self-center pl-2 text-xs text-stone-400">{found} ta topildi</span>
        </nav>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-stone-900">
                      #{order.id}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status === "PAID"
                          ? "bg-emerald-100 text-emerald-700"
                          : order.status === "PENDING"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status === "PAID"
                        ? "Tasdiqlangan"
                        : order.status === "PENDING"
                          ? "Kutilmoqda"
                          : "Bekor qilingan"}
                    </span>
                    {order.isDemo && (
                      <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">🧪 Demo</span>
                    )}
                    {order.source && (
                      <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">📍 {order.source}</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-stone-700">
                    <strong>{order.customerName}</strong> • {order.phone}
                  </p>
                  <p className="text-sm text-stone-500">
                    {order.template.name} — {tierLabel(tierOf(order.template.price), TIER_NAMES)} tarif, narx:{" "}
                    {formatPrice(order.price || order.template.price)} so&apos;m
                  </p>
                  {order.invitation && (
                    <p className="mt-1 text-xs text-stone-400">
                      Link: /e/{order.invitation.slug} • {order.invitation.title} •{" "}
                      {order.invitation.views} ko&apos;rish
                    </p>
                  )}
                  {order.invitation && <OrderOptions order={order} />}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <OrderActions orderId={order.id} status={order.status} isDemo={order.isDemo} />
                  {order.status === "PAID" && order.invitation && (
                    <div className="flex gap-3 text-xs">
                      <Link
                        href={`/e/${order.invitation.slug}`}
                        className="text-rose-600 underline"
                        target="_blank"
                      >
                        Taklifnoma →
                      </Link>
                      <a
                        href={`/api/qr/${order.invitation.slug}`}
                        download={`qr-${order.invitation.slug}.png`}
                        className="text-stone-500 underline"
                      >
                        QR yuklab olish
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white/50 p-12 text-center text-stone-500">
              {q || filter ? "Hech narsa topilmadi." : "Hozircha buyurtmalar yo'q."}
            </div>
          )}
        </div>

        {pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3 text-sm">
            {page > 1 && (
              <Link href={adminHref({ holat: filter, q }, { sahifa: String(page - 1) })} className="rounded-full border border-stone-300 bg-white px-4 py-2">
                ← Oldingi
              </Link>
            )}
            <span className="text-stone-500">
              {page} / {pages}
            </span>
            {page < pages && (
              <Link href={adminHref({ holat: filter, q }, { sahifa: String(page + 1) })} className="rounded-full border border-stone-300 bg-white px-4 py-2">
                Keyingi →
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/** Mijoz buyurtmada tanlagan sozlamalar (rang, musiqa, xarita ...). */
function OrderOptions({
  order,
}: {
  order: {
    template: { theme: string; categories: { slug: string; name: string }[] };
    invitation: { options: string } | null;
  };
}) {
  const c = parseStoredCustomization(order.invitation?.options);
  const lines = customizationSummary(c, {
    eventType: order.template.categories.find((e) => e.slug === c.eventType)?.name,
    palette: c.palette ? findPalette(order.template.theme, c.palette)?.name : undefined,
    music: musicTrack(c.music)?.name,
  });
  return (
    <div className="mt-2 space-y-0.5 text-xs text-stone-500">
      {lines.map((l) => (
        <p key={l}>{l}</p>
      ))}
      {c.timeline && c.timeline.length > 0 && (
        <p>{c.timeline.map((r) => `${r.time} ${r.label}`.trim()).join(" · ")}</p>
      )}
      {(c.googleMapsUrl || c.yandexMapsUrl) && (
        <p className="space-x-3">
          {c.googleMapsUrl && (
            <a href={c.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="underline">
              Google Maps
            </a>
          )}
          {c.yandexMapsUrl && (
            <a href={c.yandexMapsUrl} target="_blank" rel="noopener noreferrer" className="underline">
              Yandex Maps
            </a>
          )}
        </p>
      )}
    </div>
  );
}
