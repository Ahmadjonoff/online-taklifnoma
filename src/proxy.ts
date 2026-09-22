import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/adminAuth";

/**
 * Admin himoyasi.
 *
 * DIQQAT: Next.js 16 da `middleware` fayl konvensiyasi `proxy` ga o'zgartirildi
 * (`middleware.ts` deprecatsiya qilingan). Bu fayl — o'sha kodning yangi nomi,
 * mantiq o'zgarmagan.
 *
 * Cookie endi parolning o'zini emas, imzolangan sessiya tokenini saqlaydi —
 * tekshirish `verifySessionToken` orqali bajariladi (@/lib/adminAuth).
 */

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthed = verifySessionToken(req.cookies.get(COOKIE_NAME)?.value);

  // API so'rovlari: faqat /api/admin himoyalanadi (login/logoutdan tashqari)
  if (pathname.startsWith("/api/admin")) {
    if (pathname === "/api/admin/login" || pathname === "/api/admin/logout" || isAuthed) {
      return NextResponse.next();
    }
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  // /admin sahifalari
  if (pathname.startsWith("/admin")) {
    // Login sahifasiga ruxsat
    if (pathname === "/admin/login") return NextResponse.next();

    if (isAuthed) return NextResponse.next();
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
