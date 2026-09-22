"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function ShareCard({ slug, dict }: { slug: string; dict: Dictionary }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/e/${slug}`
      : `/e/${slug}`;

  const text = encodeURIComponent(dict.shareCard.shareText);
  const tg = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${text}`;
  const wa = `https://wa.me/?text=${text}%20${encodeURIComponent(link)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-stone-900">{dict.shareCard.title}</h3>
      <p className="mt-1 text-sm text-stone-500">{dict.shareCard.text}</p>

      {/* Link + nusxalash */}
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5">
        <span className="truncate text-sm text-stone-600">{link}</span>
        <button
          onClick={copy}
          className="ml-auto shrink-0 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-stone-700"
        >
          {copied ? dict.shareCard.copied : dict.shareCard.copy}
        </button>
      </div>

      {/* Tugmalar */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <a
          href={tg}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#229ED9] px-3 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.9 4.6c.2-1.1-.8-1.9-1.8-1.5L2.7 10.4c-1.1.4-1 2 .1 2.3l4.4 1.4 1.7 5.4c.3 1 1.6 1.2 2.2.4l2.4-2.9 4.5 3.3c.9.7 2.2.2 2.4-.9l3-14.8zM8.5 13.4l9.3-5.8c.4-.3.8.3.5.6l-7.6 7-.3 3-1.9-4.8z" />
          </svg>
          {dict.shareCard.telegram}
        </a>
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 017 2.9 9.83 9.83 0 012.89 7c0 5.45-4.44 9.87-9.9 9.87zm8.42-18.29A11.8 11.8 0 0012.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.95L.05 24l6.3-1.65a11.9 11.9 0 005.7 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.48-8.4z" />
          </svg>
          {dict.shareCard.whatsapp}
        </a>
        <button
          onClick={() => setShowQr(!showQr)}
          className="flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-400"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <path d="M14 14h3v3h-3zM19 19h2v2h-2z" />
          </svg>
          {dict.shareCard.qrCode}
        </button>
      </div>

      {/* QR kod */}
      {showQr && (
        <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-5 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/qr/${slug}`}
            alt={dict.shareCard.qrCode}
            className="mx-auto h-44 w-44 rounded-xl bg-white shadow-sm"
          />
          <p className="mt-3 text-xs text-stone-500">{dict.shareCard.qrHint}</p>
          <a
            href={`/api/qr/${slug}`}
            download={`qr-${slug}.png`}
            className="mt-3 inline-block rounded-full border border-stone-300 bg-white px-5 py-2 text-xs font-semibold text-stone-700 transition hover:border-stone-400"
          >
            {dict.shareCard.qrDownload}
          </a>
        </div>
      )}
    </div>
  );
}
