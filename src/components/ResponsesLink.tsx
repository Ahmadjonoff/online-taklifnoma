"use client";

import { useState } from "react";

/**
 * Admin: mijozga beriladigan javoblar sahifasi havolasi (/javoblar/<token>).
 * Nusxalash yoki Telegram orqali yuborish — mijoz botga ulanmagan bo'lsa ham
 * mehmonlar javoblarini shu havoladan ko'radi.
 */
export function ResponsesLink({ token, title }: { token: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = () => `${window.location.origin}/javoblar/${token}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Havolani nusxalang:", url());
    }
  }

  function share() {
    const text = `«${title}» — mehmonlaringiz javoblari va tilaklari shu sahifada (havolani saqlab qo'ying):`;
    const q = new URLSearchParams({ url: url(), text });
    window.open(`https://t.me/share/url?${q}`, "_blank", "noopener");
  }

  return (
    <div className="flex items-center gap-3 text-xs">
      <button type="button" onClick={copy} className="font-medium text-emerald-700 underline hover:text-emerald-900">
        {copied ? "✓ Nusxalandi" : "📋 Javoblar havolasi"}
      </button>
      <button type="button" onClick={share} className="text-sky-700 underline hover:text-sky-900">
        ✈️ Telegramda yuborish
      </button>
    </div>
  );
}
