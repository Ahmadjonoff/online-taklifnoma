"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { PreviewFrame } from "@/components/site/PreviewFrame";
import { TelegramIcon } from "@/components/site/TelegramIcon";
import { telegramUrl } from "@/lib/contact";
import {
  INVITATION_LANGS,
  LANG_LABEL,
  LIMITS,
  tierFeatures,
  TRANSLATED_LANGS,
  type Customization,
  type InvitationLang,
  type TextTranslation,
  type TranslatedLang,
} from "@/lib/customization";
import { eventDateRange } from "@/lib/dates";
import type { TimelineItem } from "@/lib/eventDefaults";
import { t, type Dictionary } from "@/lib/i18n/dictionary";
import {
  CUSTOM_MUSIC_MAX_BYTES,
  CUSTOM_MUSIC_TYPES,
  MUSIC_CUSTOM,
  MUSIC_NONE,
  type MusicTrack,
} from "@/lib/music";
import type { ColorRole, MainColors } from "@/lib/palettes";
import { uploadPhoto } from "@/lib/photoUpload";
import { CUSTOM_MUSIC_PRICE, formatPrice, orderPrice, type Tier } from "@/lib/pricing";
import { CONTENT_LIMITS } from "@/lib/validation";

/** `strip` — kartadagi 5 rangli chiziq, `main` — shu palitraning 3 ta asosiy rangi */
export type OrderPalette = { id: string; name: string; strip: string[]; main: MainColors };
export type OrderCategory = { slug: string; name: string; timeline: TimelineItem[] };

// Jonli preview har harf bosilganda emas, yozish to'xtagach yangilanadi —
// har yangilanishda shablon qaytadan yuklanadi.
const PREVIEW_DEBOUNCE_MS = 600;

const STEPS = ["design", "details", "schedule", "music", "extras", "send"] as const;
type Step = (typeof STEPS)[number];

export function OrderForm({
  templateSlug,
  templateName,
  templateTheme,
  templatePrice,
  tier,
  palettes,
  swatches,
  categories,
  defaultEventType,
  musicTracks,
  dict,
}: {
  templateSlug: string;
  templateName: string;
  templateTheme: string;
  templatePrice: number;
  tier: Tier;
  palettes: OrderPalette[];
  /** Har bir asosiy rang uchun namunalar */
  swatches: Record<ColorRole, string[]>;
  categories: OrderCategory[];
  defaultEventType: string;
  musicTracks: MusicTrack[];
  dict: Dictionary;
}) {
  const router = useRouter();
  const o = dict.order;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Qadamlar
  const [stepIndex, setStepIndex] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);
  const step: Step = STEPS[stepIndex];
  const stepBoxRef = useRef<HTMLDivElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  // Buyurtma yuborilgach preview'ni yopamiz: iframe ichidagi yuklanishlar
  // (shablon, shriftlar) keyingi sahifaga o'tishga xalaqit bermasin
  const [leaving, setLeaving] = useState(false);

  // --- Taklifnoma ma'lumotlari
  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
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
  const [colors, setColors] = useState<MainColors>(palettes[0]?.main ?? { paper: "", gold: "", wine: "" });
  const [eventType, setEventType] = useState(initialCategory?.slug ?? "");
  const [kicker, setKicker] = useState(initialCategory?.name ?? "");
  const [timeline, setTimeline] = useState<TimelineItem[]>(initialCategory?.timeline ?? []);
  // Mijoz o'zi tahrirlagan bo'lsa — tadbir turini almashtirganda ustidan yozmaymiz
  const [kickerTouched, setKickerTouched] = useState(false);
  const [timelineTouched, setTimelineTouched] = useState(false);
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [yandexMapsUrl, setYandexMapsUrl] = useState("");
  const [music, setMusic] = useState(musicTracks[0]?.id ?? MUSIC_NONE);
  const [customMusic, setCustomMusic] = useState<{ url: string; name: string } | null>(null);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dressText, setDressText] = useState("");
  const [dressColors, setDressColors] = useState<string[]>([]);
  const [giftCard, setGiftCard] = useState("");
  const [giftHolder, setGiftHolder] = useState("");
  const [rsvp, setRsvp] = useState(true);
  const [wishes, setWishes] = useState(true);
  const [petals, setPetals] = useState(true);
  // Premium/Luxury
  // Tillar: birinchisi — ochilganda ko'rinadigan til
  const [langs, setLangs] = useState<InvitationLang[]>(["uz"]);
  const [translations, setTranslations] = useState<Customization["translations"]>({});
  function toggleLang(l: InvitationLang) {
    setLangs((cur) => {
      if (cur.includes(l)) return cur.length > 1 ? cur.filter((x) => x !== l) : cur; // kamida bitta til
      return [...cur, l];
    });
  }
  function setDefaultLang(l: InvitationLang) {
    setLangs((cur) => [l, ...cur.filter((x) => x !== l)]);
  }
  function setTr(l: TranslatedLang, key: keyof TextTranslation, value: string) {
    setTranslations((cur) => ({
      ...cur,
      [l]: { kicker: "", message: "", storyTitle: "", storyText: "", ...cur[l], [key]: value },
    }));
  }
  const [storyTitle, setStoryTitle] = useState("");
  const [storyText, setStoryText] = useState("");
  const [storyPhoto, setStoryPhoto] = useState("");
  // Luxury
  const [gallery, setGallery] = useState<string[]>([]);
  const [calendar, setCalendar] = useState(true);
  const features = tierFeatures(tier);
  // Surat yuklash holati: qaysi joy (hikoya / galereya) va foiz
  const [photoBusy, setPhotoBusy] = useState<{ target: "story" | "gallery"; pct: number } | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  async function addPhotos(files: File[], target: "story" | "gallery") {
    setPhotoError(null);
    for (const file of files) {
      if (target === "gallery" && galleryRef.current.length >= LIMITS.galleryPhotos) break;
      setPhotoBusy({ target, pct: 0 });
      try {
        const url = await uploadPhoto(file, (pct) => setPhotoBusy({ target, pct }));
        if (target === "story") setStoryPhoto(url);
        else setGallery((g) => (g.length < LIMITS.galleryPhotos ? [...g, url] : g));
      } catch (e) {
        setPhotoError(t(o.photoError, { error: e instanceof Error ? e.message : "" }));
      }
    }
    setPhotoBusy(null);
  }
  // Yuklash sikli (await) davomida galereyaning eng so'nggi holatini o'qish uchun
  const galleryRef = useRef(gallery);
  useEffect(() => {
    galleryRef.current = gallery;
  }, [gallery]);

  // Server bilan bir xil oraliq (Toshkent vaqti bo'yicha bugundan 3 yilgacha)
  const { min: minDate, max: maxDate } = useMemo(() => eventDateRange(), []);

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

  const title = partner2 ? `${partner1} & ${partner2}` : partner1;

  const options: Customization = useMemo(
    () => ({
      palette,
      colors,
      eventType,
      kicker,
      timeline,
      googleMapsUrl,
      yandexMapsUrl,
      music,
      customMusicUrl: music === MUSIC_CUSTOM ? (customMusic?.url ?? "") : "",
      dressCode: { text: dressText, colors: dressText ? dressColors : [] },
      gift: { cardNumber: giftCard, cardHolder: giftHolder },
      rsvp,
      wishes,
      petals,
      langs,
      translations,
      story: { title: storyTitle, text: storyText, photo: storyPhoto },
      gallery,
      calendar,
    }),
    [palette, colors, eventType, kicker, timeline, googleMapsUrl, yandexMapsUrl, music, customMusic, dressText, dressColors, giftCard, giftHolder, rsvp, wishes, petals, langs, translations, storyTitle, storyText, storyPhoto, gallery, calendar]
  );

  const price = orderPrice(templatePrice, options);

  const draftSrc = useMemo(() => {
    const content = { title, partner1, partner2, eventDate, eventTime, venueName, venueAddress, message };
    // Tanlangan musiqa namunada eshitilmaydi — u faqat buyurtmada saqlanib,
    // tayyor taklifnomaga qo'shiladi (musiqani ro'yxatdagi ▶ bilan tinglash mumkin).
    // Shu sababli musiqa o'zgarganda namuna qayta yuklanmaydi ham.
    const previewOptions = { ...options, music: MUSIC_NONE, customMusicUrl: "" };
    const params = new URLSearchParams({ draft: JSON.stringify({ content, options: previewOptions }) });
    return `/preview/${templateTheme}?${params}`;
  }, [title, partner1, partner2, eventDate, eventTime, venueName, venueAddress, message, options, templateTheme]);

  const [previewSrc, setPreviewSrc] = useState(draftSrc);
  useEffect(() => {
    const id = setTimeout(() => setPreviewSrc(draftSrc), PREVIEW_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [draftSrc]);

  // --- Musiqani tinglab ko'rish
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  // Fayl yuklanib, tovush haqiqatan boshlanguncha — "yuklanmoqda" belgisi
  // (sekin internetda bir necha soniya jimlik bo'lib, ishlamayapti deb o'ylanmasin)
  const [buffering, setBuffering] = useState(false);
  function togglePlay(id: string, src: string) {
    audioRef.current?.pause();
    if (playing === id) {
      setPlaying(null);
      setBuffering(false);
      return;
    }
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.onended = () => setPlaying(null);
    audio.onwaiting = () => setBuffering(true);
    audio.onplaying = () => setBuffering(false);
    setBuffering(true);
    audio.play().catch(() => {
      setPlaying(null);
      setBuffering(false);
    });
    audioRef.current = audio;
    setPlaying(id);
  }
  useEffect(() => () => audioRef.current?.pause(), []);

  // --- Mijoz musiqasini yuklash: fayl to'g'ridan-to'g'ri Vercel Blob'ga
  // ketadi, server faqat qisqa muddatli token beradi (/api/upload/music)
  async function uploadMusic(file: File) {
    setUploadError(null);
    if (file.size > CUSTOM_MUSIC_MAX_BYTES) {
      setUploadError(o.musicTooBig);
      return;
    }
    const safeName = file.name.replace(/[^\w.-]+/g, "-").slice(-60) || "music.mp3";
    setUploadPct(0);
    try {
      const blob = await upload(`music/${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload/music",
        contentType: file.type || "audio/mpeg",
        onUploadProgress: (e) => setUploadPct(Math.round(e.percentage)),
      });
      setCustomMusic({ url: blob.url, name: file.name });
      setMusic(MUSIC_CUSTOM);
    } catch (e) {
      setUploadError(t(o.musicUploadError, { error: e instanceof Error ? e.message : "" }));
    } finally {
      setUploadPct(null);
    }
  }

  // --- Qadamlar orasida yurish: joriy qadamdagi majburiy maydonlar to'lmasa
  // brauzerning o'z xabari ko'rsatiladi
  function currentStepValid(): boolean {
    const fields = stepBoxRef.current?.querySelectorAll<HTMLInputElement>("input, select, textarea") ?? [];
    for (const el of fields) {
      if (!el.checkValidity()) {
        el.reportValidity();
        return false;
      }
    }
    return true;
  }

  function goTo(i: number) {
    setError(null);
    setStepIndex(i);
    setMaxVisited((m) => Math.max(m, i));
    stepBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function next() {
    if (!currentStepValid()) return;
    goTo(Math.min(stepIndex + 1, STEPS.length - 1));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step !== "send") {
      next();
      return;
    }
    if (!currentStepValid()) return;
    // Oldingi qadamdagi majburiy maydonlar (mijoz qadamlarni sakrab o'tgan bo'lsa)
    if (!partner1 || !eventDate || !venueName) {
      setError(o.requiredMissing);
      goTo(STEPS.indexOf("details"));
      return;
    }
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
          title,
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
      if (!res.ok) throw new Error(data.error ?? o.genericError);
      audioRef.current?.pause();
      setLeaving(true);
      router.push(`/buyurtma/${data.orderToken}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : o.genericError);
      setSubmitting(false);
    }
  }

  if (!templateSlug) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-800">
        {o.noTemplateWarning}{" "}
        <a href="/shablonlar" className="font-semibold underline">
          {o.noTemplateWarningLink}
        </a>{" "}
        {o.noTemplateWarningEnd}
      </div>
    );
  }

  const STEP_LABEL: Record<Step, string> = {
    design: o.stepDesign,
    details: o.stepDetails,
    schedule: o.stepSchedule,
    music: o.stepMusic,
    extras: o.stepExtras,
    send: o.stepSend,
  };

  const inputClass =
    "w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100";
  // Kun tartibi qatori uchun: `w-full` bo'lsa vaqt maydoni butun qatorni egallab oladi
  const rowInputClass = inputClass.replace("w-full ", "");
  const labelClass = "mb-1 block text-sm font-medium text-stone-700";
  const selectable = (active: boolean) =>
    `rounded-2xl border p-3 text-left transition ${
      active
        ? "border-stone-900 bg-white ring-2 ring-stone-900/15"
        : "border-stone-200 bg-white hover:border-stone-400"
    }`;

  const preview = (
    <PreviewFrame
      key={previewSrc}
      mode="gated"
      src={previewSrc}
      title={o.livePreview}
      className="block h-[640px] w-full border-0"
    />
  );

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      {/* minmax(0,1fr) + min-w-0: aks holda "Kun tartibi" qadamidagi input'larning
          tabiiy kengligi ustunni cho'zib, telefonda sahifa ekrandan kengayib ketardi */}
      <form onSubmit={handleSubmit} noValidate={false} className="min-w-0 space-y-5 pb-20 lg:pb-0">
        {/* ------------------------------------------------ Qadamlar */}
        <nav aria-label={t(o.stepOf, { n: stepIndex + 1, total: STEPS.length })}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-rose-600">
            {t(o.stepOf, { n: stepIndex + 1, total: STEPS.length })}
          </p>
          <ol className="flex gap-1.5">
            {STEPS.map((s, i) => (
              <li key={s} className="flex-1">
                <button
                  type="button"
                  disabled={i > maxVisited}
                  onClick={() => (i < stepIndex || currentStepValid()) && goTo(i)}
                  aria-current={i === stepIndex ? "step" : undefined}
                  className="group w-full text-left disabled:cursor-not-allowed"
                >
                  <span
                    className={`block h-1.5 rounded-full transition ${
                      i <= stepIndex ? "bg-rose-600" : i <= maxVisited ? "bg-rose-200" : "bg-stone-200"
                    }`}
                  />
                  <span
                    className={`mt-1.5 hidden truncate text-xs sm:block ${
                      i === stepIndex ? "font-semibold text-stone-900" : "text-stone-500"
                    }`}
                  >
                    {STEP_LABEL[s]}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div
          ref={stepBoxRef}
          className="scroll-mt-24 rounded-2xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/40"
        >
          <h2 className="mb-5 font-serif text-xl font-bold text-stone-900">{STEP_LABEL[step]}</h2>

          {/* ------------------------------------------------ 1. Dizayn */}
          {step === "design" && (
            <div className="space-y-6">
              {palettes.length > 1 && (
                <fieldset>
                  <legend className={labelClass}>{o.colorPresets}</legend>
                  <div className="mt-1 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {palettes.map((p) => {
                      const active =
                        palette === p.id &&
                        colors.paper === p.main.paper &&
                        colors.gold === p.main.gold &&
                        colors.wine === p.main.wine;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setPalette(p.id);
                            setColors(p.main);
                          }}
                          aria-pressed={active}
                          className={selectable(active)}
                        >
                          <span className="flex h-8 overflow-hidden rounded-lg border border-stone-200">
                            {p.strip.map((c, i) => (
                              <span key={i} className="flex-1" style={{ background: c }} />
                            ))}
                          </span>
                          <span className="mt-1.5 block truncate text-xs font-medium text-stone-700">{p.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {/* 3 ta asosiy rang: har biri namunadan yoki o'zi tanlagan rang */}
              <div className="space-y-4">
                <p className="text-xs text-stone-500">{o.colorsHint}</p>
                {(
                  [
                    ["paper", o.colorPaper],
                    ["gold", o.colorGold],
                    ["wine", o.colorWine],
                  ] as Array<[ColorRole, string]>
                ).map(([role, label]) => {
                  const value = colors[role];
                  const custom = value !== "" && !swatches[role].includes(value);
                  const setRole = (v: string) => setColors((c) => ({ ...c, [role]: v.toLowerCase() }));
                  return (
                    <fieldset key={role}>
                      <legend className="mb-1.5 flex items-center gap-2 text-sm font-medium text-stone-700">
                        <span
                          className="inline-block h-4 w-4 rounded-full border border-stone-300"
                          style={{ background: value }}
                        />
                        {label}
                        <code className="text-xs font-normal text-stone-400">{value}</code>
                      </legend>
                      <div className="flex flex-wrap items-center gap-2">
                        {swatches[role].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setRole(c)}
                            aria-pressed={value === c}
                            aria-label={`${label} ${c}`}
                            title={c}
                            className={`h-9 w-9 rounded-full border shadow-sm transition ${
                              value === c
                                ? "border-stone-900 ring-2 ring-stone-900/25 ring-offset-2"
                                : "border-stone-300 hover:scale-110"
                            }`}
                            style={{ background: c }}
                          />
                        ))}
                        <label
                          title={o.colorCustom}
                          className={`relative h-9 w-9 cursor-pointer overflow-hidden rounded-full border shadow-sm transition ${
                            custom
                              ? "border-stone-900 ring-2 ring-stone-900/25 ring-offset-2"
                              : "border-stone-300 hover:scale-110"
                          }`}
                        >
                          <span
                            className="absolute inset-0"
                            style={{
                              background: custom
                                ? value
                                : "conic-gradient(from 0deg, #e11d48, #f59e0b, #84cc16, #06b6d4, #6366f1, #d946ef, #e11d48)",
                            }}
                          />
                          {!custom && (
                            <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-white drop-shadow">
                              +
                            </span>
                          )}
                          <input
                            type="color"
                            value={value || "#c9a96e"}
                            onChange={(e) => setRole(e.target.value)}
                            className="absolute inset-0 cursor-pointer opacity-0"
                            aria-label={`${label}: ${o.colorCustom}`}
                          />
                        </label>
                      </div>
                    </fieldset>
                  );
                })}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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

              {features.languages ? (
                <div>
                  <p className={labelClass}>{o.langLabel}</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {INVITATION_LANGS.map((l) => {
                      const on = langs.includes(l);
                      return (
                        <button
                          key={l}
                          type="button"
                          onClick={() => toggleLang(l)}
                          aria-pressed={on}
                          className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm transition ${
                            on
                              ? "border-stone-900 bg-stone-900 text-white"
                              : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                          }`}
                        >
                          <span aria-hidden="true">{on ? "✓" : "+"}</span>
                          {LANG_LABEL[l]}
                        </button>
                      );
                    })}
                  </div>
                  {langs.length > 1 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-stone-600">{o.langDefault}:</span>
                      <select
                        value={langs[0]}
                        onChange={(e) => setDefaultLang(e.target.value as InvitationLang)}
                        className={`${rowInputClass} w-auto py-1.5`}
                      >
                        {langs.map((l) => (
                          <option key={l} value={l}>
                            {LANG_LABEL[l]}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <p className="mt-2 text-xs text-stone-500">{o.langHint}</p>
                </div>
              ) : (
                <p className="rounded-xl bg-stone-50 px-4 py-3 text-xs text-stone-500">{o.lockedLang}</p>
              )}
            </div>
          )}

          {/* ------------------------------------------------ 2. Ma'lumotlar */}
          {step === "details" && (
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>{o.name1}</label>
                  <input
                    required
                    value={partner1}
                    maxLength={CONTENT_LIMITS.partner}
                    onChange={(e) => setPartner1(e.target.value)}
                    className={inputClass}
                    placeholder={o.name1Placeholder}
                  />
                </div>
                <div>
                  <label className={labelClass}>{o.name2}</label>
                  <input
                    value={partner2}
                    maxLength={CONTENT_LIMITS.partner}
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
                  maxLength={CONTENT_LIMITS.venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className={inputClass}
                  placeholder={o.venueNamePlaceholder}
                />
              </div>
              <div className="mt-4">
                <label className={labelClass}>{o.venueAddress}</label>
                <input
                  value={venueAddress}
                  maxLength={CONTENT_LIMITS.venueAddress}
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
                  maxLength={CONTENT_LIMITS.message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className={inputClass}
                  placeholder={o.messagePlaceholder}
                />
              </div>

              {features.story ? (
                <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50/60 p-4">
                  <p className="text-sm font-semibold text-stone-800">{o.storySection}</p>
                  <p className="mt-0.5 text-xs text-stone-500">{o.storyHint}</p>
                  <div className="mt-3">
                    <label className={labelClass}>{o.storyTitleLabel}</label>
                    <input
                      value={storyTitle}
                      maxLength={LIMITS.storyTitle}
                      onChange={(e) => setStoryTitle(e.target.value)}
                      className={inputClass}
                      placeholder={o.storyTitlePlaceholder}
                    />
                  </div>
                  <div className="mt-3">
                    <label className={labelClass}>{o.storyTextLabel}</label>
                    <textarea
                      value={storyText}
                      maxLength={LIMITS.storyText}
                      onChange={(e) => setStoryText(e.target.value)}
                      rows={4}
                      className={inputClass}
                      placeholder={o.storyTextPlaceholder}
                    />
                  </div>
                  <div className="mt-3">
                    <p className={labelClass}>{o.storyPhoto}</p>
                    <div className="flex items-center gap-3">
                      {storyPhoto && (
                        // Blob'dagi kichik ko'rinish — next/image optimizatsiyasi shart emas
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={storyPhoto} alt="" className="h-20 w-16 rounded-lg object-cover" />
                      )}
                      <label className="cursor-pointer rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 transition hover:border-stone-400">
                        {o.photoChoose}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="sr-only"
                          disabled={photoBusy !== null}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) addPhotos([f], "story");
                            e.target.value = "";
                          }}
                        />
                      </label>
                      {storyPhoto && (
                        <button type="button" onClick={() => setStoryPhoto("")} className="text-xs font-medium text-rose-700">
                          {o.photoRemove}
                        </button>
                      )}
                      {photoBusy?.target === "story" && (
                        <span className="text-xs text-stone-500">{t(o.photoUploading, { pct: photoBusy.pct })}</span>
                      )}
                    </div>
                  </div>
                  {photoError && <p className="mt-2 text-xs text-red-600">{photoError}</p>}
                </div>
              ) : (
                <p className="mt-6 rounded-xl bg-stone-50 px-4 py-3 text-xs text-stone-500">{o.lockedStory}</p>
              )}

              {features.languages &&
                TRANSLATED_LANGS.filter((l) => langs.includes(l)).map((l) => (
                  <div key={l} className="mt-6 rounded-2xl border border-sky-200 bg-sky-50/40 p-4">
                    <p className="text-sm font-semibold text-stone-800">🌐 {t(o.trTitle, { lang: LANG_LABEL[l] })}</p>
                    <p className="mt-0.5 text-xs text-stone-500">{o.trHint}</p>
                    <div className="mt-3 grid gap-3">
                      <div>
                        <label className={labelClass}>{o.kicker}</label>
                        <input
                          value={translations[l]?.kicker ?? ""}
                          maxLength={LIMITS.kicker}
                          onChange={(e) => setTr(l, "kicker", e.target.value)}
                          className={inputClass}
                          placeholder={kicker}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{o.message}</label>
                        <textarea
                          value={translations[l]?.message ?? ""}
                          onChange={(e) => setTr(l, "message", e.target.value)}
                          rows={3}
                          className={inputClass}
                          placeholder={message || o.messagePlaceholder}
                        />
                      </div>
                      {features.story && storyText && (
                        <>
                          <div>
                            <label className={labelClass}>{o.storyTitleLabel}</label>
                            <input
                              value={translations[l]?.storyTitle ?? ""}
                              maxLength={LIMITS.storyTitle}
                              onChange={(e) => setTr(l, "storyTitle", e.target.value)}
                              className={inputClass}
                              placeholder={storyTitle || o.storyTitlePlaceholder}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>{o.storyTextLabel}</label>
                            <textarea
                              value={translations[l]?.storyText ?? ""}
                              maxLength={LIMITS.storyText}
                              onChange={(e) => setTr(l, "storyText", e.target.value)}
                              rows={4}
                              className={inputClass}
                              placeholder={storyText}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* ------------------------------------------------ 3. Kun tartibi */}
          {step === "schedule" && (
            <div>
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
                      className={`${rowInputClass} w-32 shrink-0`}
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
          )}

          {/* ------------------------------------------------ 4. Musiqa */}
          {step === "music" && (
            <div className="space-y-2.5">
              {musicTracks.map((track) => (
                <div key={track.id} className={`flex items-center gap-3 ${selectable(music === track.id)}`}>
                  <button
                    type="button"
                    onClick={() => togglePlay(track.id, track.src)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm text-white transition hover:bg-rose-700"
                    aria-label={playing === track.id ? o.musicStop : o.musicPlay}
                  >
                    {playing === track.id ? (buffering ? <Spinner /> : "❚❚") : "▶"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMusic(track.id)}
                    aria-pressed={music === track.id}
                    className="min-w-0 flex-1 truncate text-left text-sm font-medium text-stone-800"
                  >
                    {track.name}
                  </button>
                  {music === track.id && <span className="text-sm text-rose-600">✓</span>}
                </div>
              ))}

              {/* O'z musiqasi */}
              <div className={selectable(music === MUSIC_CUSTOM)}>
                <div className="flex items-center gap-3">
                  {customMusic ? (
                    <button
                      type="button"
                      onClick={() => togglePlay(MUSIC_CUSTOM, customMusic.url)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm text-white transition hover:bg-rose-700"
                      aria-label={playing === MUSIC_CUSTOM ? o.musicStop : o.musicPlay}
                    >
                      {playing === MUSIC_CUSTOM ? (buffering ? <Spinner /> : "❚❚") : "▶"}
                    </button>
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                      ⬆
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      disabled={!customMusic}
                      onClick={() => setMusic(MUSIC_CUSTOM)}
                      className="block truncate text-left text-sm font-medium text-stone-800 disabled:cursor-default"
                    >
                      {o.musicCustom}{" "}
                      <span className="font-normal text-stone-500">
                        (+{t(dict.common.priceShort, { price: formatPrice(CUSTOM_MUSIC_PRICE) })})
                      </span>
                    </button>
                    {customMusic && (
                      <p className="truncate text-xs text-stone-500">
                        {t(o.musicUploaded, { name: customMusic.name })}
                      </p>
                    )}
                    {uploadPct !== null && (
                      <p className="text-xs text-stone-500">{t(o.musicUploading, { pct: uploadPct })}</p>
                    )}
                  </div>
                  {music === MUSIC_CUSTOM && <span className="text-sm text-rose-600">✓</span>}
                  <label className="shrink-0 cursor-pointer rounded-full border border-stone-300 px-3.5 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-stone-400">
                    {o.musicUpload}
                    <input
                      type="file"
                      accept={CUSTOM_MUSIC_TYPES.join(",")}
                      className="sr-only"
                      disabled={uploadPct !== null}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadMusic(f);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
                <p className="mt-2 text-xs text-stone-500">
                  {t(o.musicUploadHint, { price: formatPrice(CUSTOM_MUSIC_PRICE) })}
                </p>
                {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
              </div>

              <button
                type="button"
                onClick={() => setMusic(MUSIC_NONE)}
                aria-pressed={music === MUSIC_NONE}
                className={`flex w-full items-center gap-3 ${selectable(music === MUSIC_NONE)}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100">🔇</span>
                <span className="flex-1 text-sm font-medium text-stone-800">{o.musicNone}</span>
                {music === MUSIC_NONE && <span className="text-sm text-rose-600">✓</span>}
              </button>
            </div>
          )}

          {/* ------------------------------------------------ 5. Qo'shimcha */}
          {step === "extras" && (
            <div>
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

              {features.gallery && (
                <div className="mt-6">
                  <p className={labelClass}>{o.gallerySection}</p>
                  <p className="-mt-0.5 mb-2 text-xs text-stone-500">{o.galleryHint}</p>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {gallery.map((url) => (
                      <div key={url} className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element -- Blob'dagi kichik ko'rinish */}
                        <img src={url} alt="" className="aspect-square w-full rounded-lg object-cover" />
                        <button
                          type="button"
                          onClick={() => setGallery((g) => g.filter((x) => x !== url))}
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-[10px] text-white"
                          aria-label={o.photoRemove}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {gallery.length < LIMITS.galleryPhotos && (
                      <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 text-center text-[11px] font-semibold text-stone-600 transition hover:border-stone-400">
                        {photoBusy?.target === "gallery" ? `${photoBusy.pct}%` : o.galleryAdd}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          className="sr-only"
                          disabled={photoBusy !== null}
                          onChange={(e) => {
                            const files = Array.from(e.target.files ?? []);
                            if (files.length) addPhotos(files, "gallery");
                            e.target.value = "";
                          }}
                        />
                      </label>
                    )}
                  </div>
                  {photoError && <p className="mt-2 text-xs text-red-600">{photoError}</p>}
                </div>
              )}

              <fieldset className="mt-6">
                <legend className={labelClass}>{o.sectionsTitle}</legend>
                <div className="mt-1 space-y-2">
                  {[
                    { label: o.toggleRsvp, value: rsvp, set: setRsvp },
                    { label: o.toggleWishes, value: wishes, set: setWishes },
                    { label: o.togglePetals, value: petals, set: setPetals },
                    ...(features.calendar ? [{ label: o.toggleCalendar, value: calendar, set: setCalendar }] : []),
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

              <p className="mt-6 rounded-xl bg-stone-50 px-4 py-3 text-xs leading-relaxed text-stone-500">
                {features.guestLinks ? `✨ ${o.luxuryAfterOrder}` : o.lockedLuxury}
              </p>
            </div>
          )}

          {/* ------------------------------------------------ 6. Yuborish */}
          {step === "send" && (
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>{o.yourName}</label>
                  <input
                    required
                    value={customerName}
                    maxLength={CONTENT_LIMITS.customerName}
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
                    // Chrome pattern'ni "v" rejimida tekshiradi: sinf ichida "-" ekranlanishi shart
                    pattern="^(\+?998)?[\s\-]?\d{2}[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$"
                    title="Masalan: +998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="+998 90 123 45 67"
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-5">
                <p className="text-sm font-semibold text-stone-800">{o.priceTitle}</p>
                <dl className="mt-3 space-y-1.5 text-sm">
                  {price.lines.map((l) => (
                    <div key={l.key} className="flex justify-between gap-3 text-stone-600">
                      <dt>
                        {l.key === "template" ? t(o.priceTemplate, { name: templateName }) : o.priceCustomMusic}
                      </dt>
                      <dd>{t(dict.common.priceShort, { price: formatPrice(l.amount) })}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between gap-3 border-t border-stone-200 pt-2 font-serif text-lg font-bold text-stone-900">
                    <dt>{o.priceTotal}</dt>
                    <dd>{t(dict.common.priceShort, { price: formatPrice(price.total) })}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-stone-500">{o.noPaymentText}</p>
              </div>
            </div>
          )}
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        {/* ------------------------------------------------ Navigatsiya */}
        <div className="flex items-center gap-3">
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={() => goTo(stepIndex - 1)}
              className="rounded-full border border-stone-300 bg-white px-6 py-3.5 text-sm font-semibold text-stone-700 transition hover:border-stone-400"
            >
              ← {o.back}
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || uploadPct !== null}
            className="flex-1 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 py-3.5 font-semibold text-white shadow-lg shadow-rose-300/50 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50"
          >
            {step === "send"
              ? submitting
                ? o.submitting
                : `${o.submit} · ${t(dict.common.priceShort, { price: formatPrice(price.total) })}`
              : `${o.next} →`}
          </button>
        </div>

        {step === "send" && (
          <div className="rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-sm">
            <p className="text-sm font-semibold text-stone-800">{o.noPaymentTitle}</p>
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
        )}
      </form>

      {/* Jonli ko'rinish — kompyuterda yonida */}
      <div className="hidden lg:sticky lg:top-6 lg:block lg:self-start">
        <p className="mb-3 text-center text-sm font-medium text-stone-500">{o.livePreview}</p>
        <div className="overflow-hidden rounded-[2rem] border-8 border-stone-800 bg-stone-800 shadow-2xl">
          {!previewOpen && !leaving && preview}
        </div>
      </div>

      {/* Telefonda — pastdagi tugma orqali to'liq ekranda */}
      <button
        type="button"
        onClick={() => setPreviewOpen(true)}
        className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-xl lg:hidden"
      >
        {o.showPreview}
      </button>
      {previewOpen && !leaving && (
        <div className="fixed inset-0 z-50 flex flex-col bg-stone-950/90 p-3 lg:hidden" role="dialog" aria-modal="true">
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white"
            >
              ✕ {o.hidePreview}
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden rounded-[1.5rem] bg-stone-800 [&_iframe]:!h-full [&>div]:h-full">
            {preview}
          </div>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
      aria-hidden="true"
    />
  );
}
