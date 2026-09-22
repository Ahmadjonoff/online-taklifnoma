import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ShareCard } from "@/components/ShareCard";
import { BrandMark } from "@/components/site/BrandMark";
import { TelegramIcon } from "@/components/site/TelegramIcon";
import { telegramUrl } from "@/lib/contact";
import { getDictionary, t } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

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
    include: { template: true, invitation: true },
  });
  if (!order) notFound();

  const confirmed = order.status === "PAID";
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
                  <ShareCard slug={order.invitation.slug} dict={dict} />
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
                  <span className="font-semibold text-stone-800">{dict.common.priceShort}</span>
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
