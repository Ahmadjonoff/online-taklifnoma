import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LOCALE_HTML_LANG } from "@/lib/i18n/locales";
import { getLocale } from "@/lib/i18n/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Online taklifnomalar — Premium raqamli taklifnomalar",
    template: "%s | Online taklifnomalar",
  },
  description:
    "To'y, nikoh, sunnat to'yi, qiz bazmi va boshqa tadbirlar uchun jonli online taklifnomalar. 21 ta noyob dizayn, o'zingiz tanlaydigan ranglar, RSVP, tilaklar daftari, QR kod — hammasi bir joyda.",
  keywords: [
    "taklifnoma",
    "to'y taklifnomasi",
    "online taklifnoma",
    "nikoh taklifnomasi",
    "sunnat to'yi taklifnomasi",
    "RSVP",
  ],
  openGraph: {
    title: "Online taklifnomalar — Premium raqamli taklifnomalar",
    description:
      "Tadbiringiz uchun esda qoladigan raqamli taklifnoma: 21 ta noyob dizayn, RSVP, QR kod.",
    type: "website",
    locale: "uz_UZ",
  },
};

const REVEAL_ABOVE_FOLD =
  "document.querySelectorAll('.reveal-up').forEach(function(e){if(e.getBoundingClientRect().top<innerHeight)e.classList.add('is-visible')})";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={LOCALE_HTML_LANG[locale]}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        {children}
        {/* Birinchi ekrandagi `Reveal` bloklari JS yuklanib, gidratsiya
            tugashini kutmasin — aks holda sekin tarmoqda sahifa bir necha
            soniya bo'sh turadi. Pastdagilar odatdagidek scroll'da ochiladi. */}
        <script dangerouslySetInnerHTML={{ __html: REVEAL_ABOVE_FOLD }} />
      </body>
    </html>
  );
}
