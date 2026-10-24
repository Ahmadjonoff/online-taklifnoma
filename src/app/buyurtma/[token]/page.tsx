import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { GuestLinks } from "@/components/GuestLinks";
import { getBotUsername } from "@/lib/telegramBot";
import { tierFeatures } from "@/lib/customization";
import { listGuests } from "@/lib/guests";
import { tierOf } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";
import { ShareCard } from "@/components/ShareCard";
import { BrandMark } from "@/components/site/BrandMark";
import { TelegramIcon } from "@/components/site/TelegramIcon";
import { formatPrice } from "@/lib/catalog";
import { telegramUrl } from "@/lib/contact";
import { getDictionary, t } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

// Shaxsiy sahifa (token bilan) — qidiruv tizimlariga tushmasin
export const metadata = { robots: { index: false, follow: false } };

const dateFmt = new Intl.DateTimeFormat("uz-UZ", {
  timeZone: "Asia/Tashkent",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const os = dict.orderStatus;

  // Ketma-ket `id` o'rniga tasodifiy `accessToken` bo'yicha qidiramiz — aks
  // holda ID'ni sanab, boshqa mijozning buyurtma holati va (to'langan
  // bo'lsa) taklifnoma havolasini har kim ko'ra olardi.
  const order = await prisma.order.findUnique({
    where: { accessToken: token },
    include: {
      template: true,
      invitation: {
        include: {
          rsvps: { orderBy: { createdAt: "desc" } },
          wishes: { orderBy: { createdAt: "desc" } },
        },
      },
    },
  });
  if (!order) notFound();

  const confirmed = order.status === "PAID";
  const botUsername = confirmed ? await getBotUsername() : "";
  const luxury = tierFeatures(tierOf(order.template.price)).guestLinks;
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;
  const guests = confirmed && luxury && order.invitation ? await listGuests(order.invitation.id) : [];
  const tgText = t(os.telegramMsg, {
    template: order.template.name,
    orderId: order.id,
    name: order.customerName,
  });

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <header className="border-b border-stone-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2.5 font-serif text-xl font-bold">
            <BrandMark className="h-8 w-auto" />
            {dict.common.brand}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-xl shadow-stone-200/60 sm:p-10">
          {confirmed ? (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-4xl shadow-lg shadow-emerald-200">
                🎉
              </div>
              <h1 className="mt-6 font-serif text-3xl font-bold">{os.confirmedTitle}</h1>
              <p className="mt-3 text-stone-600">{os.confirmedText}</p>

              {order.invitation && (
                <div className="mt-8">
                  <ShareCard slug={order.invitation.slug} link={`${origin}/e/${order.invitation.slug}`} dict={dict} />
                </div>
              )}

              <Link
                href={`/e/${order.invitation?.slug}`}
                className="mt-6 inline-block rounded-full bg-stone-900 px-8 py-3.5 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-stone-800"
              >
                {os.openInvitation}
              </Link>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-4xl shadow-lg shadow-amber-200">
                ⏳
              </div>
              <h1 className="mt-6 font-serif text-3xl font-bold">{os.pendingTitle}</h1>
              <p className="mt-3 text-stone-600">
                {os.orderNumber} <span className="font-bold text-stone-900">#{order.id}</span>
              </p>

              <div className="mt-8 rounded-2xl border border-sky-200 bg-sky-50/70 p-6 text-left">
                <h2 className="flex items-center gap-2 font-semibold text-sky-900">
                  <TelegramIcon size={18} />
                  {os.telegramBoxTitle}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-sky-900/80">{os.telegramBoxText}</p>

                <a
                  href={telegramUrl(tgText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-3.5 font-semibold text-white shadow-md transition hover:bg-sky-400"
                >
                  <TelegramIcon />
                  {t(os.telegramBoxBtn, { label: dict.common.telegramLabel })}
                </a>
                <p className="mt-3 text-center text-xs text-sky-900/60">{os.telegramBoxHint}</p>
              </div>

              <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-5 text-left">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-stone-500">{os.priceLabel}</span>
                  <span className="font-semibold text-stone-800">
                    {t(dict.common.priceShort, {
                      // 0 — narxlar ochiq bo'lishidan oldingi buyurtma: shablon narxi
                      price: formatPrice(order.price || order.template.price),
                    })}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-stone-500">{dict.common.priceNote}</p>
              </div>

              <div className="mt-6 rounded-2xl bg-stone-100 p-4">
                <p className="text-xs text-stone-500">{os.linkBoxTitle}</p>
                <code className="mt-1 block text-sm font-semibold text-stone-800">
                  /e/{order.invitation?.slug}
                </code>
              </div>
            </>
          )}
        </div>

        {confirmed && luxury && order.invitation && (
          <>
            <GuestLinks
              token={token}
              invitationUrl={`${origin}/e/${order.invitation.slug}`}
              initial={guests}
              os={os}
            />
            <section className="mt-8 rounded-3xl border border-amber-200 bg-white p-6 shadow-xl shadow-stone-200/60 sm:p-8">
              <h2 className="font-serif text-2xl font-bold">🖼 {os.shareImagesTitle}</h2>
              <p className="mt-2 text-sm text-stone-500">{os.shareImagesHint}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {[
                  { href: `/buyurtma/${token}/story.png`, label: os.storyImage },
                  { href: `/buyurtma/${token}/postcard.png`, label: os.postcardImage },
                ].map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
                  >
                    ⬇ {l.label}
                  </a>
                ))}
              </div>
            </section>
          </>
        )}

        {confirmed && order.invitation && botUsername && (
          <section className="mt-8 rounded-3xl border border-sky-200 bg-white p-6 shadow-xl shadow-stone-200/60 sm:p-8">
            <h2 className="font-serif text-2xl font-bold">📲 {os.notifyTitle}</h2>
            {order.notifyChatId ? (
              <p className="mt-2 text-sm text-emerald-700">{os.notifyOn}</p>
            ) : (
              <>
                <p className="mt-2 text-sm text-stone-500">{os.notifyText}</p>
                <a
                  href={`https://t.me/${botUsername}?start=${token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  ✈️ {os.notifyButton}
                </a>
              </>
            )}
          </section>
        )}

        {confirmed && order.invitation && (
          <GuestResponses
            token={token}
            rsvps={order.invitation.rsvps}
            wishes={order.invitation.wishes}
            os={os}
          />
        )}

        <p className="mt-6 text-center text-sm text-stone-500">
          {os.questionsText}{" "}
          <a href={telegramUrl(tgText)} className="font-medium text-rose-600 hover:underline">
            {t(os.telegramContact, { label: dict.common.telegramLabel })}
          </a>
        </p>
      </main>
    </div>
  );
}

/**
 * Mijozning shaxsiy "Mehmonlar javoblari" bo'limi: RSVP va tilaklar.
 * Faqat tasdiqlangan (havola mehmonlarga yuborilgan) buyurtmada ko'rinadi.
 */
function GuestResponses({
  token,
  rsvps,
  wishes,
  os,
}: {
  token: string;
  rsvps: { id: number; guestName: string; attending: boolean; guestsCount: number; comment: string; createdAt: Date }[];
  wishes: { id: number; guestName: string; message: string; createdAt: Date }[];
  os: ReturnType<typeof getDictionary>["orderStatus"];
}) {
  const coming = rsvps.filter((r) => r.attending);
  const stats = [
    { label: os.guestsAttending, value: coming.length, tone: "text-emerald-700" },
    { label: os.guestsNotAttending, value: rsvps.length - coming.length, tone: "text-rose-700" },
    { label: os.guestsTotal, value: coming.reduce((s, r) => s + r.guestsCount, 0), tone: "text-stone-900" },
  ];

  return (
    <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/60 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="font-serif text-2xl font-bold">{os.guestsTitle}</h2>
        {rsvps.length > 0 && (
          <a
            href={`/buyurtma/${token}/mehmonlar.csv`}
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-400"
          >
            ⬇ {os.downloadCsv}
          </a>
        )}
      </div>
      <p className="mt-2 text-sm text-stone-500">{os.guestsHint}</p>

      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-stone-50 px-3 py-4">
            <p className={`font-serif text-3xl font-bold ${s.tone}`}>{s.value}</p>
            <p className="mt-1 text-xs text-stone-500">{s.label}</p>
          </div>
        ))}
      </div>

      {rsvps.length === 0 ? (
        <p className="mt-6 text-sm text-stone-500">{os.guestsNone}</p>
      ) : (
        <ul className="mt-6 divide-y divide-stone-100">
          {rsvps.map((r) => (
            <li key={r.id} className="flex items-start justify-between gap-3 py-3 text-sm">
              <div className="min-w-0">
                <p className="font-medium text-stone-900">{r.guestName}</p>
                {r.comment && <p className="mt-0.5 text-stone-500">{r.comment}</p>}
                <p className="mt-0.5 text-xs text-stone-400">{dateFmt.format(r.createdAt)}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  r.attending ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                }`}
              >
                {r.attending ? `${os.guestsAttending} · ${r.guestsCount}` : os.guestsNotAttending}
              </span>
            </li>
          ))}
        </ul>
      )}

      <h3 className="mt-8 font-serif text-xl font-bold">{os.wishesTitle}</h3>
      {wishes.length === 0 ? (
        <p className="mt-3 text-sm text-stone-500">{os.wishesNone}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {wishes.map((w) => (
            <li key={w.id} className="rounded-2xl bg-stone-50 px-4 py-3 text-sm">
              <p className="text-stone-800">{w.message}</p>
              <p className="mt-1 text-xs text-stone-500">
                — {w.guestName} · {dateFmt.format(w.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
