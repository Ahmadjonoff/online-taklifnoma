"use client";

import { useState, type ReactNode } from "react";
import { getSource } from "@/lib/attribution";
import { trackLead } from "@/components/site/Analytics";
import { InstagramIcon } from "@/components/site/InstagramIcon";
import { TelegramIcon } from "@/components/site/TelegramIcon";
import { INSTAGRAM_DM_URL, telegramUrl } from "@/lib/contact";
import { t, type Dictionary } from "@/lib/i18n/dictionary";
import { formatPrice } from "@/lib/pricing";

/**
 * Buyurtma sahifasining birinchi ko'rinishi: ism + telefon (+ ixtiyoriy sana) — operator
 * qo'ng'iroq qilib, taklifnomani o'zi to'ldiradi. Reklamadan kelgan, telefonda turgan odam
 * uchun 6 qadamli forma og'ir — u to'liq forma (`children`) tugma ortida qoladi.
 */
export function QuickOrder({
  templateSlug,
  templateName,
  templatePrice,
  dict,
  children,
}: {
  templateSlug: string;
  templateName: string;
  templatePrice: number;
  dict: Dictionary;
  children: ReactNode;
}) {
  const q = dict.quickOrder;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [eventDate, setEventDate] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [full, setFull] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateSlug, name, phone, eventDate, note, source: getSource() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? dict.order.genericError);
      trackLead(templatePrice);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.order.genericError);
    } finally {
      setSending(false);
    }
  }

  const input =
    "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100";
  const label = "mb-1 block text-sm font-medium text-stone-700";

  if (full) return <>{children}</>;

  return (
    <div className="space-y-6">
      <section
        id="tezkor"
        className="scroll-mt-24 rounded-3xl border border-amber-300 bg-gradient-to-b from-amber-50/90 to-white p-6 shadow-[0_30px_70px_-45px_rgba(120,85,20,0.9)] sm:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">{q.tag}</p>
        <h2 className="mt-1 font-serif text-2xl font-bold text-stone-900">{q.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          «{templateName}» · {t(dict.common.priceShort, { price: formatPrice(templatePrice) })}
        </p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600">{q.text}</p>

        {done ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="font-semibold text-emerald-900">✓ {q.doneTitle}</p>
            <p className="mt-1 text-sm text-emerald-900/80">{q.doneText}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={telegramUrl(t(dict.common.telegramOrderMsg, { name: templateName }))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white"
              >
                <TelegramIcon />
                Telegram
              </a>
              <a
                href={INSTAGRAM_DM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-600 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white"
              >
                <InstagramIcon />
                Instagram
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="q-name" className={label}>
                {q.name} *
              </label>
              <input
                id="q-name"
                required
                maxLength={80}
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={q.namePh}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="q-phone" className={label}>
                {q.phone} *
              </label>
              <input
                id="q-phone"
                required
                type="tel"
                inputMode="tel"
                maxLength={30}
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="q-date" className={label}>
                {q.date}
              </label>
              <input
                id="q-date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="q-note" className={label}>
                {q.note}
              </label>
              <input
                id="q-note"
                maxLength={300}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={q.notePh}
                className={input}
              />
            </div>
            {error && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 sm:col-span-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="rounded-full bg-gradient-to-r from-rose-600 to-rose-700 py-4 text-center font-semibold text-white shadow-lg shadow-rose-300/50 transition hover:-translate-y-0.5 disabled:opacity-60 sm:col-span-2"
            >
              {sending ? q.sending : q.submit}
            </button>
          </form>
        )}
      </section>

      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-stone-400">{q.orFull}</p>
        <button
          type="button"
          onClick={() => setFull(true)}
          className="mt-3 w-full rounded-full border border-stone-300 bg-white/80 px-6 py-3.5 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-white"
        >
          {q.fullBtn} →
        </button>
        <p className="mx-auto mt-2 max-w-md text-xs text-stone-500">{q.fullHint}</p>
      </div>
    </div>
  );
}
