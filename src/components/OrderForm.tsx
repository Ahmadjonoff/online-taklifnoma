"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { TelegramIcon } from "@/components/site/TelegramIcon";
import { telegramUrl } from "@/lib/contact";
import { t, type Dictionary } from "@/lib/i18n/dictionary";

export function OrderForm({
  templateSlug,
  templateName,
  templateTheme,
  dict,
}: {
  templateSlug: string;
  templateName: string;
  templateTheme: string;
  dict: Dictionary;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("18:00");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [message, setMessage] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");

  const { minDate, maxDate } = useMemo(() => {
    const toIso = (d: Date) => d.toISOString().slice(0, 10);
    const today = new Date();
    const max = new Date(today);
    max.setFullYear(max.getFullYear() + 3);
    return { minDate: toIso(today), maxDate: toIso(max) };
  }, []);

  const previewSrc = useMemo(() => {
    const cfg = {
      couple: {
        groom: partner1 || "Ismingiz",
        bride: partner2 || "",
        monogram:
          [partner1[0], partner2[0]].filter(Boolean).join("&").toUpperCase() ||
          "✦",
      },
      event: {
        dateISO: eventDate ? `${eventDate}T${eventTime}:00` : "2026-12-31T18:00:00",
        dateLabel: eventDate
          ? eventDate.split("-").reverse().join(".")
          : "31.12.2026",
        timeLabel: eventTime,
        kicker: templateName,
      },
      blessing: {
        lines: message ? [message.slice(0, 40)] : [],
        text: message || "Sizni tadbirimizda ko'rishdan baxtiyor bo'lamiz!",
        greeting: "",
      },
      countdown: { title: "Tadbirgacha qoldi", finishedText: "Bugun katta kun!" },
      timeline: { title: "Dastur", items: [] },
      venue: {
        title: "Manzil",
        name: venueName || "To'yxona nomi",
        address: venueAddress || "",
        googleMapsUrl: "",
        yandexMapsUrl: "",
      },
      notes: [],
      rsvp: { enabled: true },
      wishes: { enabled: true },
      gift: { enabled: false },
      gallery: { enabled: false, photos: [] },
      petals: { enabled: true, count: 14 },
      music: { enabled: false, src: "" },
      specialOffer: { enabled: false, title: "", text: "", badge: "" },
      speakers: { enabled: false, title: "", people: [] },
      sponsors: { enabled: false, title: "", names: [] },
      dressCode: { enabled: false, title: "", text: "", colors: [] },
      bigNumber: { enabled: false, value: "", title: "", subtitle: "" },
      achievement: { enabled: false, degree: "", institution: "", text: "" },
      footer: {
        title: "Sizni kutamiz!",
        signature: partner1 || "Oilangiz",
      },
    };
    const params = new URLSearchParams({ cfg: JSON.stringify(cfg) });
    return `/preview/${templateTheme}?${params}`;
  }, [
    partner1,
    partner2,
    eventDate,
    eventTime,
    venueName,
    venueAddress,
    message,
    templateTheme,
    templateName,
  ]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateSlug,
          customerName,
          phone,
          title: title || (partner2 ? `${partner1} & ${partner2}` : partner1),
          partner1,
          partner2,
          eventDate,
          eventTime,
          venueName,
          venueAddress,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? dict.order.genericError);
      router.push(`/buyurtma/${data.orderToken}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.order.genericError);
      setSubmitting(false);
    }
  }

  if (!templateSlug) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-800">
        {dict.order.noTemplateWarning}{" "}
        <a href="/shablonlar" className="font-semibold underline">
          {dict.order.noTemplateWarningLink}
        </a>{" "}
        {dict.order.noTemplateWarningEnd}
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/40">
          <h2 className="mb-4 font-serif text-lg font-bold text-stone-900">{dict.order.section1Title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">{dict.order.yourName}</label>
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={inputClass}
                placeholder={dict.order.yourNamePlaceholder}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">{dict.order.phone}</label>
              <input
                required
                type="tel"
                inputMode="tel"
                pattern="^(\+?998)?[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$"
                title="Masalan: +998 90 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="+998 90 123 45 67"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/40">
          <h2 className="mb-4 font-serif text-lg font-bold text-stone-900">{dict.order.section2Title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">{dict.order.name1}</label>
              <input
                required
                value={partner1}
                onChange={(e) => setPartner1(e.target.value)}
                className={inputClass}
                placeholder={dict.order.name1Placeholder}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">{dict.order.name2}</label>
              <input
                value={partner2}
                onChange={(e) => setPartner2(e.target.value)}
                className={inputClass}
                placeholder={dict.order.name2Placeholder}
              />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">{dict.order.date}</label>
              <input
                required
                type="date"
                min={minDate}
                max={maxDate}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">{dict.order.time}</label>
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-stone-700">{dict.order.venueName}</label>
            <input
              required
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              className={inputClass}
              placeholder={dict.order.venueNamePlaceholder}
            />
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-stone-700">{dict.order.venueAddress}</label>
            <input
              value={venueAddress}
              onChange={(e) => setVenueAddress(e.target.value)}
              className={inputClass}
              placeholder={dict.order.venueAddressPlaceholder}
            />
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-stone-700">{dict.order.message}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className={inputClass}
              placeholder={dict.order.messagePlaceholder}
            />
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-gradient-to-r from-rose-600 to-rose-700 py-4 font-semibold text-white shadow-lg shadow-rose-300/50 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50"
        >
          {submitting ? dict.order.submitting : dict.order.submit}
        </button>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-sm">
          <p className="text-sm font-semibold text-stone-800">{dict.order.noPaymentTitle}</p>
          <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-stone-500">
            {dict.common.priceNote} {dict.order.noPaymentText}
          </p>
          <a
            href={telegramUrl(t(dict.common.telegramOrderMsg, { name: templateName }))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-sky-400"
          >
            <TelegramIcon />
            {t(dict.order.telegramBtn, { label: dict.common.telegramLabel })}
          </a>
        </div>
      </form>

      {/* Jonli ko'rinish */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-3 text-center text-sm font-medium text-stone-500">{dict.order.livePreview}</p>
        <div className="overflow-hidden rounded-[2rem] border-8 border-stone-800 bg-stone-800 shadow-2xl">
          <iframe
            key={previewSrc}
            src={previewSrc}
            title={dict.order.livePreview}
            className="h-[640px] w-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
