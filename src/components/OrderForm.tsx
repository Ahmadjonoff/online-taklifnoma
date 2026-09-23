"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { PreviewFrame } from "@/components/site/PreviewFrame";
import { TelegramIcon } from "@/components/site/TelegramIcon";
import { telegramUrl } from "@/lib/contact";
import { LIMITS, type Customization } from "@/lib/customization";
import type { TimelineItem } from "@/lib/eventDefaults";
import { t, type Dictionary } from "@/lib/i18n/dictionary";
import { MUSIC_NONE, type MusicTrack } from "@/lib/music";

export type OrderPalette = { id: string; name: string; swatch: string[] };
export type OrderCategory = { slug: string; name: string; timeline: TimelineItem[] };

// Jonli preview har harf bosilganda emas, yozish to'xtagach yangilanadi —
// har yangilanishda shablon qaytadan yuklanadi.
const PREVIEW_DEBOUNCE_MS = 600;

export function OrderForm({
  templateSlug,
  templateName,
  templateTheme,
  palettes,
  categories,
  defaultEventType,
  musicTracks,
  dict,
}: {
  templateSlug: string;
  templateName: string;
  templateTheme: string;
  palettes: OrderPalette[];
  categories: OrderCategory[];
  defaultEventType: string;
  musicTracks: MusicTrack[];
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

  // --- Mijoz sozlamalari (Invitation.options)
  const initialCategory = categories.find((c) => c.slug === defaultEventType) ?? categories[0];
  const [palette, setPalette] = useState(palettes[0]?.id ?? "");
  const [eventType, setEventType] = useState(initialCategory?.slug ?? "");
  const [kicker, setKicker] = useState(initialCategory?.name ?? "");
  const [timeline, setTimeline] = useState<TimelineItem[]>(initialCategory?.timeline ?? []);
  // Mijoz o'zi tahrirlagan bo'lsa — tadbir turini almashtirganda ustidan yozmaymiz
  const [kickerTouched, setKickerTouched] = useState(false);
  const [timelineTouched, setTimelineTouched] = useState(false);
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [yandexMapsUrl, setYandexMapsUrl] = useState("");
  const [music, setMusic] = useState(musicTracks[0]?.id ?? MUSIC_NONE);
  const [dressText, setDressText] = useState("");
  const [dressColors, setDressColors] = useState<string[]>([]);
  const [giftCard, setGiftCard] = useState("");
  const [giftHolder, setGiftHolder] = useState("");
  const [rsvp, setRsvp] = useState(true);
  const [wishes, setWishes] = useState(true);
  const [petals, setPetals] = useState(true);

  const { minDate, maxDate } = useMemo(() => {
    const toIso = (d: Date) => d.toISOString().slice(0, 10);
    const today = new Date();
    const max = new Date(today);
    max.setFullYear(max.getFullYear() + 3);
    return { minDate: toIso(today), maxDate: toIso(max) };
  }, []);

  function changeEventType(slug: string) {
    setEventType(slug);
    const cat = categories.find((c) => c.slug === slug);
    if (!cat) return;
    if (!kickerTouched) setKicker(cat.name);
    if (!timelineTouched) setTimeline(cat.timeline);
  }

  function editTimeline(next: TimelineItem[]) {
    setTimelineTouched(true);
    setTimeline(next);
  }

  const options: Customization = useMemo(
    () => ({
      palette,
      eventType,
      kicker,
      timeline,
      googleMapsUrl,
      yandexMapsUrl,
      music,
      dressCode: { text: dressText, colors: dressText ? dressColors : [] },
      gift: { cardNumber: giftCard, cardHolder: giftHolder },
      rsvp,
      wishes,
      petals,
    }),
    [palette, eventType, kicker, timeline, googleMapsUrl, yandexMapsUrl, music, dressText, dressColors, giftCard, giftHolder, rsvp, wishes, petals]
  );

  const draftSrc = useMemo(() => {
    const content = { title, partner1, partner2, eventDate, eventTime, venueName, venueAddress, message };
    const params = new URLSearchParams({ draft: JSON.stringify({ content, options }) });
    return `/preview/${templateTheme}?${params}`;
  }, [title, partner1, partner2, eventDate, eventTime, venueName, venueAddress, message, options, templateTheme]);

  const [previewSrc, setPreviewSrc] = useState(draftSrc);
  useEffect(() => {
    const id = setTimeout(() => setPreviewSrc(draftSrc), PREVIEW_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [draftSrc]);

  // Musiqani tinglab ko'rish
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  function togglePlay(track: MusicTrack) {
    audioRef.current?.pause();
    if (playing === track.id) {
      setPlaying(null);
      return;
    }
    const audio = new Audio(track.src);
    audio.onended = () => setPlaying(null);
    audio.play().catch(() => setPlaying(null));
    audioRef.current = audio;
    setPlaying(track.id);
  }
  useEffect(() => () => audioRef.current?.pause(), []);

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
          options,
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

  const o = dict.order;
  const inputClass =
    "w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100";
  // Kun tartibi qatori uchun: `w-full` bo'lsa vaqt maydoni butun qatorni egallab oladi
  const rowInputClass = inputClass.replace("w-full ", "");
  const labelClass = "mb-1 block text-sm font-medium text-stone-700";
  const cardClass = "rounded-2xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/40";
  const sectionTitle = "mb-4 font-serif text-lg font-bold text-stone-900";
  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition ${
      active
        ? "border-stone-900 bg-stone-900 text-white"
        : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
    }`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ------------------------------------------------ 1. Buyurtmachi */}
        <div className={cardClass}>
          <h2 className={sectionTitle}>{o.section1Title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>{o.yourName}</label>
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={inputClass}
                placeholder={o.yourNamePlaceholder}
              />
            </div>
            <div>
              <label className={labelClass}>{o.phone}</label>
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

        {/* ------------------------------------------------ 2. Taklifnoma */}
        <div className={cardClass}>
          <h2 className={sectionTitle}>{o.section2Title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>{o.name1}</label>
              <input
                required
                value={partner1}
                onChange={(e) => setPartner1(e.target.value)}
                className={inputClass}
                placeholder={o.name1Placeholder}
              />
            </div>
            <div>
              <label className={labelClass}>{o.name2}</label>
              <input
                value={partner2}
                onChange={(e) => setPartner2(e.target.value)}
                className={inputClass}
                placeholder={o.name2Placeholder}
              />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>{o.date}</label>
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
              <label className={labelClass}>{o.time}</label>
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelClass}>{o.venueName}</label>
            <input
              required
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              className={inputClass}
              placeholder={o.venueNamePlaceholder}
            />
          </div>
          <div className="mt-4">
            <label className={labelClass}>{o.venueAddress}</label>
            <input
              value={venueAddress}
              onChange={(e) => setVenueAddress(e.target.value)}
              className={inputClass}
              placeholder={o.venueAddressPlaceholder}
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>{o.googleMaps}</label>
              <input
                type="url"
                inputMode="url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                className={inputClass}
                placeholder="https://maps.app.goo.gl/..."
              />
            </div>
            <div>
              <label className={labelClass}>{o.yandexMaps}</label>
              <input
                type="url"
                inputMode="url"
                value={yandexMapsUrl}
                onChange={(e) => setYandexMapsUrl(e.target.value)}
                className={inputClass}
                placeholder="https://yandex.uz/maps/..."
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-stone-500">{o.venueMapsHint}</p>
          <div className="mt-4">
            <label className={labelClass}>{o.message}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className={inputClass}
              placeholder={o.messagePlaceholder}
            />
          </div>
        </div>

        {/* ------------------------------------------------ 3. Dizayn */}
        <div className={cardClass}>
          <h2 className={sectionTitle}>{o.designTitle}</h2>

          {palettes.length > 1 && (
            <fieldset>
              <legend className={labelClass}>{o.colors}</legend>
              <div className="mt-1 flex flex-wrap gap-2.5">
                {palettes.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPalette(p.id)}
                    aria-pressed={palette === p.id}
                    className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-sm transition ${
                      palette === p.id
                        ? "border-stone-900 ring-2 ring-stone-900/15"
                        : "border-stone-300 hover:border-stone-400"
                    }`}
                  >
                    <span className="flex -space-x-1.5">
                      {p.swatch.map((c) => (
                        <span
                          key={c}
                          className="h-6 w-6 rounded-full border border-white shadow-sm"
                          style={{ background: c }}
                        />
                      ))}
                    </span>
                    <span className="text-stone-700">{p.name}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className={`grid gap-4 sm:grid-cols-2 ${palettes.length > 1 ? "mt-5" : ""}`}>
            {categories.length > 1 && (
              <div>
                <label className={labelClass}>{o.eventType}</label>
                <select
                  value={eventType}
                  onChange={(e) => changeEventType(e.target.value)}
                  className={inputClass}
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className={labelClass}>{o.kicker}</label>
              <input
                value={kicker}
                maxLength={LIMITS.kicker}
                onChange={(e) => {
                  setKickerTouched(true);
                  setKicker(e.target.value);
                }}
                className={inputClass}
                placeholder={o.kickerPlaceholder}
              />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ 4. Kun tartibi */}
        <div className={cardClass}>
          <h2 className={sectionTitle}>{o.scheduleTitle}</h2>
          <p className="-mt-2 mb-4 text-sm text-stone-500">{o.scheduleHint}</p>
          <div className="space-y-2.5">
            {timeline.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="time"
                  value={row.time}
                  onChange={(e) =>
                    editTimeline(timeline.map((r, j) => (j === i ? { ...r, time: e.target.value } : r)))
                  }
                  className={`${rowInputClass} w-28 shrink-0`}
                  aria-label={o.time}
                />
                <input
                  value={row.label}
                  maxLength={LIMITS.timelineLabel}
                  onChange={(e) =>
                    editTimeline(timeline.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)))
                  }
                  className={`${rowInputClass} min-w-0 flex-1`}
                  placeholder={o.scheduleItemPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => editTimeline(timeline.filter((_, j) => j !== i))}
                  className="shrink-0 rounded-full p-2 text-stone-400 transition hover:bg-stone-100 hover:text-rose-600"
                  aria-label={o.scheduleRemove}
                  title={o.scheduleRemove}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {timeline.length === 0 && <p className="text-sm text-stone-500">{o.scheduleEmpty}</p>}
          {timeline.length < LIMITS.timelineItems && (
            <button
              type="button"
              onClick={() => editTimeline([...timeline, { time: "", label: "" }])}
              className="mt-3 text-sm font-semibold text-rose-700 hover:text-rose-800"
            >
              {o.scheduleAdd}
            </button>
          )}
        </div>

        {/* ------------------------------------------------ 5. Musiqa */}
        <div className={cardClass}>
          <h2 className={sectionTitle}>{o.musicTitle}</h2>
          <div className="flex flex-wrap gap-2.5">
            {musicTracks.map((track) => (
              <div key={track.id} className="flex items-center gap-1">
                <button type="button" onClick={() => setMusic(track.id)} className={chip(music === track.id)}>
                  🎵 {track.name}
                </button>
                <button
                  type="button"
                  onClick={() => togglePlay(track)}
                  className="rounded-full px-2.5 py-2 text-xs font-medium text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
                >
                  {playing === track.id ? `⏸ ${o.musicStop}` : `▶ ${o.musicPlay}`}
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setMusic(MUSIC_NONE)} className={chip(music === MUSIC_NONE)}>
              🔇 {o.musicNone}
            </button>
          </div>
        </div>

        {/* ------------------------------------------------ 6. Qo'shimcha */}
        <div className={cardClass}>
          <h2 className={sectionTitle}>{o.extrasTitle}</h2>

          <label className={labelClass}>{o.dressCode}</label>
          <input
            value={dressText}
            maxLength={LIMITS.dressCodeText}
            onChange={(e) => setDressText(e.target.value)}
            className={inputClass}
            placeholder={o.dressCodePlaceholder}
          />
          {dressText && (
            <div className="mt-3">
              <p className="mb-1.5 text-xs font-medium text-stone-600">{o.dressCodeColors}</p>
              <div className="flex flex-wrap items-center gap-2">
                {dressColors.map((c, i) => (
                  <span key={i} className="relative">
                    <input
                      type="color"
                      value={c}
                      onChange={(e) => setDressColors(dressColors.map((x, j) => (j === i ? e.target.value : x)))}
                      className="h-9 w-9 cursor-pointer rounded-full border border-stone-300 bg-white p-0.5"
                    />
                    <button
                      type="button"
                      onClick={() => setDressColors(dressColors.filter((_, j) => j !== i))}
                      className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-stone-800 text-[9px] text-white"
                      aria-label={o.removeColor}
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {dressColors.length < LIMITS.dressCodeColors && (
                  <button
                    type="button"
                    onClick={() => setDressColors([...dressColors, "#c9a96e"])}
                    className="rounded-full border border-dashed border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:border-stone-400"
                  >
                    {o.addColor}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className={labelClass}>{o.giftTitle}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                inputMode="numeric"
                autoComplete="off"
                value={giftCard}
                onChange={(e) => setGiftCard(e.target.value.replace(/[^\d ]/g, "").slice(0, 19))}
                className={inputClass}
                placeholder="8600 0000 0000 0000"
                aria-label={o.giftCard}
              />
              <input
                value={giftHolder}
                maxLength={LIMITS.cardHolder}
                onChange={(e) => setGiftHolder(e.target.value)}
                className={inputClass}
                placeholder={o.giftHolder}
                aria-label={o.giftHolder}
              />
            </div>
            <p className="mt-2 text-xs text-stone-500">{o.giftHint}</p>
          </div>

          <fieldset className="mt-6">
            <legend className={labelClass}>{o.sectionsTitle}</legend>
            <div className="mt-1 space-y-2">
              {[
                { label: o.toggleRsvp, value: rsvp, set: setRsvp },
                { label: o.toggleWishes, value: wishes, set: setWishes },
                { label: o.togglePetals, value: petals, set: setPetals },
              ].map((x) => (
                <label key={x.label} className="flex cursor-pointer items-center gap-3 text-sm text-stone-700">
                  <input
                    type="checkbox"
                    checked={x.value}
                    onChange={(e) => x.set(e.target.checked)}
                    className="h-4 w-4 accent-rose-600"
                  />
                  {x.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-gradient-to-r from-rose-600 to-rose-700 py-4 font-semibold text-white shadow-lg shadow-rose-300/50 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50"
        >
          {submitting ? o.submitting : o.submit}
        </button>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-sm">
          <p className="text-sm font-semibold text-stone-800">{o.noPaymentTitle}</p>
          <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-stone-500">
            {dict.common.priceNote} {o.noPaymentText}
          </p>
          <a
            href={telegramUrl(t(dict.common.telegramOrderMsg, { name: templateName }))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-sky-400"
          >
            <TelegramIcon />
            {t(o.telegramBtn, { label: dict.common.telegramLabel })}
          </a>
        </div>
      </form>

      {/* Jonli ko'rinish */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-3 text-center text-sm font-medium text-stone-500">{o.livePreview}</p>
        <div className="overflow-hidden rounded-[2rem] border-8 border-stone-800 bg-stone-800 shadow-2xl">
          {/* key: ma'lumot o'zgarsa preview qaytadan yuklanadi (konvert yana
              yopiq) — qatlam ham qaytadan paydo bo'lishi kerak */}
          <PreviewFrame
            key={previewSrc}
            mode="gated"
            src={previewSrc}
            title={o.livePreview}
            className="block h-[640px] w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
