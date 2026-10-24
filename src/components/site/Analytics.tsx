"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import Script from "next/script";
import { useEffect } from "react";
import { rememberSource } from "@/lib/attribution";

/** Meta Pixel ID — Vercel'da NEXT_PUBLIC_META_PIXEL_ID; bo'sh bo'lsa Pixel yuklanmaydi */
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Buyurtma yuborilganda — target reklama natijasini o'lchash uchun (Pixel bo'lsa) */
export function trackLead(value: number): void {
  window.fbq?.("track", "Lead", { value, currency: "UZS" });
}

/**
 * Sayt analitikasi: Vercel Web Analytics (sahifa ko'rishlar, manbalar), Meta Pixel (ixtiyoriy)
 * va birinchi tashrif manbasini eslab qolish (`src/lib/attribution.ts`).
 */
export function SiteAnalytics() {
  useEffect(() => rememberSource(), []);
  return (
    <>
      <VercelAnalytics />
      {PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID.replace(/\D/g, "")}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
