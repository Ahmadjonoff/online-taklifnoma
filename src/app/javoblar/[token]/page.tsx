import Link from "next/link";
import { notFound } from "next/navigation";
import { AutoRefresh } from "@/components/AutoRefresh";
import { DATE_INVITE_THEME, GuestResponses } from "@/components/GuestResponses";
import { BrandMark } from "@/components/site/BrandMark";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";
import { getBotUsername } from "@/lib/telegramBot";

export const dynamic = "force-dynamic";

// Shaxsiy sahifa (token bilan) — qidiruv tizimlariga tushmasin
export const metadata = { title: "Mehmonlar javoblari", robots: { index: false, follow: false } };

/**
 * Mijozning javoblar sahifasi — admin buyurtmani tasdiqlagach shu havolani
 * mijozga yuboradi (admin panel → «Javoblar havolasi»). Botga ulanmagan mijoz
 * ham mehmonlar javoblari va tilaklarini shu yerda ko'radi. Barcha shablonlar
 * uchun bir xil; token — buyurtmaning tasodifiy `accessToken`i.
 */
export default async function ResponsesPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-z0-9]{10,40}$/i.test(token)) notFound();
  const dict = getDictionary(await getLocale());
  const os = dict.orderStatus;

  const order = await prisma.order.findUnique({
    where: { accessToken: token },
    select: {
      status: true,
      notifyChatId: true,
      template: { select: { theme: true } },
      invitation: {
        select: {
          slug: true,
          title: true,
          rsvps: { orderBy: { createdAt: "desc" } },
          wishes: { orderBy: { createdAt: "desc" } },
        },
      },
    },
  });
  if (!order) notFound();

  const confirmed = order.status === "PAID" && order.invitation;
  const botUsername = confirmed && !order.notifyChatId ? await getBotUsername() : "";

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

      <main className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a3762f]">{os.responsesKicker}</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-stone-900">{order.invitation?.title || os.guestsTitle}</h1>

        {!confirmed ? (
          <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">{os.responsesNotReady}</p>
        ) : (
          <>
            <p className="mt-3 text-sm text-stone-600">{os.responsesText}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <Link
                href={`/e/${order.invitation!.slug}`}
                target="_blank"
                className="rounded-full bg-stone-900 px-5 py-2.5 font-semibold text-white transition hover:bg-stone-800"
              >
                {os.openInvitation}
              </Link>
              <span className="text-xs text-stone-400">↻ {os.responsesRefresh}</span>
            </div>

            <GuestResponses
              token={token}
              rsvps={order.invitation!.rsvps}
              wishes={order.invitation!.wishes}
              os={os}
              dateInvite={order.template.theme === DATE_INVITE_THEME}
            />

            {botUsername && (
              <p className="mt-6 text-center text-sm text-stone-500">
                {os.responsesBotHint}{" "}
                <a
                  href={`https://t.me/${botUsername}?start=${token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-sky-700 hover:underline"
                >
                  ✈️ {os.notifyButton}
                </a>
              </p>
            )}
            <AutoRefresh seconds={30} />
          </>
        )}
      </main>
    </div>
  );
}
