"use client";

import { useState } from "react";
import type { GuestRow } from "@/lib/guests";
import { t, type Dictionary } from "@/lib/i18n/dictionary";

/**
 * Luxury: mehmonlar uchun shaxsiy havolalar (mijozning shaxsiy sahifasida).
 * Ruxsat — URL'dagi buyurtma tokeni.
 */
export function GuestLinks({
  token,
  invitationUrl,
  initial,
  os,
}: {
  token: string;
  invitationUrl: string;
  initial: GuestRow[];
  os: Dictionary["orderStatus"];
}) {
  const [guests, setGuests] = useState(initial);
  const [names, setNames] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const linkOf = (g: GuestRow) => `${invitationUrl}?g=${g.code}`;

  async function call(method: "POST" | "DELETE", body: unknown) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/buyurtma/${token}/guests`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Xatolik");
      setGuests(data.guests);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xatolik");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
    } catch {}
  }

  return (
    <section className="mt-8 rounded-3xl border border-amber-200 bg-white p-6 shadow-xl shadow-stone-200/60 sm:p-8">
      <h2 className="font-serif text-2xl font-bold">✨ {os.guestLinksTitle}</h2>
      <p className="mt-2 text-sm text-stone-500">{os.guestLinksHint}</p>

      <form
        className="mt-5"
        onSubmit={async (e) => {
          e.preventDefault();
          const list = names.split("\n").map((n) => n.trim()).filter(Boolean);
          if (list.length && (await call("POST", { names: list }))) setNames("");
        }}
      >
        <label className="mb-1 block text-sm font-medium text-stone-700">{os.guestNamesLabel}</label>
        <textarea
          value={names}
          onChange={(e) => setNames(e.target.value)}
          rows={4}
          placeholder={os.guestNamesPlaceholder}
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
        />
        <div className="mt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={busy || !names.trim()}
            className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
          >
            {busy ? os.adding : os.addGuests}
          </button>
          {guests.length > 0 && (
            <button
              type="button"
              onClick={() => copy(guests.map((g) => `${g.name} — ${linkOf(g)}`).join("\n"), "all")}
              className="rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:border-stone-400"
            >
              {copied === "all" ? os.copied : os.copyAll}
            </button>
          )}
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </form>

      {guests.length > 0 && (
        <ul className="mt-6 divide-y divide-stone-100">
          {guests.map((g) => {
            const status = g.rsvp
              ? g.rsvp.attending
                ? { text: t(os.statusComing, { n: g.rsvp.count }), cls: "bg-emerald-50 text-emerald-700" }
                : { text: os.statusNotComing, cls: "bg-rose-50 text-rose-700" }
              : g.opened
                ? { text: os.statusOpened, cls: "bg-sky-50 text-sky-700" }
                : { text: os.statusNotOpened, cls: "bg-stone-100 text-stone-500" };
            const share = `https://t.me/share/url?url=${encodeURIComponent(linkOf(g))}&text=${encodeURIComponent(
              t(os.guestInviteText, { name: g.name })
            )}`;
            return (
              <li key={g.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-stone-900">{g.name}</p>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.cls}`}>
                    {status.text}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => copy(linkOf(g), String(g.id))}
                    className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:border-stone-400"
                  >
                    {copied === String(g.id) ? os.copied : os.copyLink}
                  </button>
                  <a
                    href={share}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-400"
                  >
                    {os.shareTelegram}
                  </a>
                  <button
                    type="button"
                    onClick={() => call("DELETE", { id: g.id })}
                    disabled={busy}
                    className="rounded-full px-2 py-1.5 text-xs text-stone-400 hover:text-rose-600"
                    aria-label={os.removeGuest}
                    title={os.removeGuest}
                  >
                    ✕
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
