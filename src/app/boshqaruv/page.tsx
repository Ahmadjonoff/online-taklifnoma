import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { OrderActions } from "@/components/OrderActions";
import { customizationSummary, parseStoredCustomization } from "@/lib/customization";
import { musicTrack } from "@/lib/music";
import { tierLabel } from "@/lib/catalog";
import { formatPrice, tierOf } from "@/lib/pricing";

const TIER_NAMES = { tierStandard: "Standart", tierPremium: "Premium", tierLuxury: "Luxury" };
import { findPalette } from "@/lib/palettes";

export const dynamic = "force-dynamic";

// Bitta sahifada ko'rsatiladigan buyurtmalar soni
const PAGE_SIZE = 30;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const pageParam = Number((await searchParams).page);
  const page = Number.isInteger(pageParam) && pageParam > 1 ? pageParam : 1;

  // Statistika bazada hisoblanadi — barcha buyurtmalarni xotiraga yuklamaymiz
  const [counts, revenueRows, orders] = await Promise.all([
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
    // Narx 0 — narxlar ochiq bo'lishidan oldingi buyurtma: shablon narxi olinadi
    prisma.$queryRaw<{ revenue: bigint | number | null }[]>`
      SELECT SUM(CASE WHEN o."price" > 0 THEN o."price" ELSE t."price" END) AS revenue
      FROM "Order" o JOIN "Template" t ON t."id" = o."templateId"
      WHERE o."status" = 'PAID'`,
    prisma.order.findMany({
      include: {
        template: { include: { categories: { select: { slug: true, name: true } } } },
        invitation: true,
      },
      orderBy: { id: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const countOf = (status: string) => counts.find((c) => c.status === status)?._count._all ?? 0;
  const stats = {
    total: counts.reduce((sum, c) => sum + c._count._all, 0),
    pending: countOf("PENDING"),
    paid: countOf("PAID"),
    revenue: Number(revenueRows[0]?.revenue ?? 0),
  };
  const pageCount = Math.max(1, Math.ceil(stats.total / PAGE_SIZE));

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

        {/* Buyurtmalar */}
        <h2 className="mb-4 mt-10 font-serif text-xl font-bold text-stone-900">
          Buyurtmalar
        </h2>
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
                  <OrderActions orderId={order.id} status={order.status} />
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
              Hozircha buyurtmalar yo&apos;q.
            </div>
          )}
        </div>

        {pageCount > 1 && (
          <nav className="mt-8 flex items-center justify-center gap-4 text-sm">
            {page > 1 ? (
              <Link href={`/boshqaruv?page=${page - 1}`} className="rounded-full border border-stone-300 px-4 py-1.5 text-stone-700 hover:border-stone-500">
                ← Oldingi
              </Link>
            ) : (
              <span className="px-4 py-1.5 text-stone-300">← Oldingi</span>
            )}
            <span className="text-stone-500">
              {page} / {pageCount}
            </span>
            {page < pageCount ? (
              <Link href={`/boshqaruv?page=${page + 1}`} className="rounded-full border border-stone-300 px-4 py-1.5 text-stone-700 hover:border-stone-500">
                Keyingi →
              </Link>
            ) : (
              <span className="px-4 py-1.5 text-stone-300">Keyingi →</span>
            )}
          </nav>
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
