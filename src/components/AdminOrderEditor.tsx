"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { TimelineItem } from "@/lib/eventDefaults";
import { approxMapUrls } from "@/lib/maps";
import { CONTENT_LIMITS } from "@/lib/validation";

export type EditableOrder = {
  customerName: string;
  phone: string;
  partner1: string;
  partner2: string;
  eventDate: string; // YYYY-MM-DD
  eventTime: string;
  venueName: string;
  venueAddress: string;
  message: string;
  kicker: string;
  scheduleOn: boolean;
  timeline: TimelineItem[];
  googleMapsUrl: string;
  yandexMapsUrl: string;
  mapConfirmed: boolean;
  rsvp: boolean;
  wishes: boolean;
  petals: boolean;
};

// Kenglik alohida: `w-full` qator ichidagi `w-32`/`flex-1` bilan to'qnashmasin
const field =
  "rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-100";
const input = `w-full ${field}`;
const label = "mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500";

/** Admin: buyurtma va taklifnoma matnini tahrirlash. */
export function AdminOrderEditor({
  orderId,
  slug,
  paid,
  initial,
}: {
  orderId: number;
  slug: string;
  paid: boolean;
  initial: EditableOrder;
}) {
  const router = useRouter();
  const [f, setF] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const set = <K extends keyof EditableOrder>(k: K, v: EditableOrder[K]) => setF((x) => ({ ...x, [k]: v }));
  const approx = approxMapUrls(f.venueName, f.venueAddress);
  const noLinks = !f.googleMapsUrl.trim() && !f.yandexMapsUrl.trim();

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/invitation`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: {
            customerName: f.customerName,
            phone: f.phone,
            partner1: f.partner1,
            partner2: f.partner2,
            eventDate: f.eventDate,
            eventTime: f.eventTime,
            venueName: f.venueName,
            venueAddress: f.venueAddress,
            message: f.message,
          },
          options: {
            kicker: f.kicker,
            // [] — kun tartibi taklifnomada ko'rsatilmaydi
            timeline: f.scheduleOn ? f.timeline.filter((r) => r.label.trim()) : [],
            googleMapsUrl: f.googleMapsUrl,
            yandexMapsUrl: f.yandexMapsUrl,
            mapConfirmed: f.mapConfirmed,
            rsvp: f.rsvp,
            wishes: f.wishes,
            petals: f.petals,
          },
        }),
      });
      if (res.status === 401) {
        router.push("/boshqaruv/login");
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Saqlab bo'lmadi");
      setMessage({ ok: true, text: "Saqlandi ✓ Taklifnoma yangilandi." });
      router.refresh();
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Saqlab bo'lmadi" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-serif text-lg font-bold">Mijoz</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Ism</label>
            <input required maxLength={CONTENT_LIMITS.customerName} value={f.customerName} onChange={(e) => set("customerName", e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Telefon</label>
            <input required type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} className={input} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-serif text-lg font-bold">Taklifnoma</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>1-ism</label>
            <input required maxLength={CONTENT_LIMITS.partner} value={f.partner1} onChange={(e) => set("partner1", e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>2-ism (juftlik uchun)</label>
            <input maxLength={CONTENT_LIMITS.partner} value={f.partner2} onChange={(e) => set("partner2", e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Sana</label>
            <input required type="date" value={f.eventDate} onChange={(e) => set("eventDate", e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Vaqt</label>
            <input required type="time" value={f.eventTime} onChange={(e) => set("eventTime", e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Ismlar ustidagi yozuv</label>
            <input maxLength={60} value={f.kicker} onChange={(e) => set("kicker", e.target.value)} className={input} placeholder="Masalan: Nikoh to'yi" />
          </div>
          <div>
            <label className={label}>Joy nomi</label>
            <input required maxLength={CONTENT_LIMITS.venueName} value={f.venueName} onChange={(e) => set("venueName", e.target.value)} className={input} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Manzil</label>
            <input maxLength={CONTENT_LIMITS.venueAddress} value={f.venueAddress} onChange={(e) => set("venueAddress", e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Google Maps havolasi</label>
            <input type="url" value={f.googleMapsUrl} onChange={(e) => set("googleMapsUrl", e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Yandex Maps havolasi</label>
            <input type="url" value={f.yandexMapsUrl} onChange={(e) => set("yandexMapsUrl", e.target.value)} className={input} />
          </div>
          {noLinks && approx && (
            <label className="flex items-start gap-2.5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:col-span-2">
              <input type="checkbox" checked={f.mapConfirmed} onChange={(e) => set("mapConfirmed", e.target.checked)} className="mt-0.5 h-4 w-4 accent-stone-800" />
              <span>
                Havola yo&apos;q — manzil bo&apos;yicha taxminiy joylashuv qo&apos;yilsin (
                <a href={approx.google} target="_blank" rel="noopener noreferrer" className="underline">Google</a>,{" "}
                <a href={approx.yandex} target="_blank" rel="noopener noreferrer" className="underline">Yandex</a>)
              </span>
            </label>
          )}
          <div className="sm:col-span-2">
            <label className={label}>Taklif matni</label>
            <textarea rows={4} maxLength={CONTENT_LIMITS.message} value={f.message} onChange={(e) => set("message", e.target.value)} className={`${input} resize-y`} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <label className="flex items-center gap-2.5 font-serif text-lg font-bold">
          <input type="checkbox" checked={f.scheduleOn} onChange={(e) => set("scheduleOn", e.target.checked)} className="h-4 w-4 accent-stone-800" />
          Kun tartibi
        </label>
        {!f.scheduleOn ? (
          <p className="mt-2 text-sm text-stone-500">Taklifnomada kun tartibi bo&apos;limi bo&apos;lmaydi.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {f.timeline.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="time"
                  value={row.time}
                  onChange={(e) => set("timeline", f.timeline.map((r, j) => (j === i ? { ...r, time: e.target.value } : r)))}
                  className={`${field} w-32 shrink-0`}
                  aria-label="Vaqt"
                />
                <input
                  value={row.label}
                  maxLength={80}
                  onChange={(e) => set("timeline", f.timeline.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)))}
                  className={`${field} min-w-0 flex-1`}
                  placeholder="Band nomi"
                />
                <button
                  type="button"
                  onClick={() => set("timeline", f.timeline.filter((_, j) => j !== i))}
                  className="shrink-0 rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-red-600"
                  aria-label="Olib tashlash"
                >
                  ✕
                </button>
              </div>
            ))}
            {f.timeline.length < 12 && (
              <button
                type="button"
                onClick={() => set("timeline", [...f.timeline, { time: "", label: "" }])}
                className="text-sm font-semibold text-stone-700 underline"
              >
                + Band qo&apos;shish
              </button>
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-serif text-lg font-bold">Bo&apos;limlar</h2>
        <div className="flex flex-wrap gap-5 text-sm text-stone-700">
          {(
            [
              ["rsvp", "RSVP"],
              ["wishes", "Tilaklar"],
              ["petals", "Gulbarglar"],
            ] as const
          ).map(([k, text]) => (
            <label key={k} className="flex items-center gap-2">
              <input type="checkbox" checked={f[k]} onChange={(e) => set(k, e.target.checked)} className="h-4 w-4 accent-stone-800" />
              {text}
            </label>
          ))}
        </div>
      </section>

      {message && (
        <p className={`rounded-xl px-4 py-3 text-sm ${message.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`} role="status">
          {message.text}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-stone-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-50"
        >
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </button>
        {paid && (
          <Link href={`/e/${slug}`} target="_blank" className="text-sm font-medium text-rose-600 underline">
            Taklifnomani ochish →
          </Link>
        )}
        <Link href="/boshqaruv" className="text-sm text-stone-500 hover:text-stone-800">
          ← Buyurtmalar
        </Link>
      </div>
    </form>
  );
}
