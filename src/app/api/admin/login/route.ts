import { NextResponse } from "next/server";
import {
  checkPassword,
  COOKIE_NAME,
  createSessionToken,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/adminAuth";
import { clientIp, rateLimit } from "@/lib/rateLimit";

// Brute-force himoyasi: bitta IP uchun 1 daqiqada ko'pi bilan 5 urinish.
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 60_000;

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`admin-login:${ip}`, LOGIN_LIMIT, LOGIN_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." },
      { status: 429 }
    );
  }

  try {
    const { password } = (await req.json()) as { password?: string };

    if (!password || !checkPassword(password)) {
      return NextResponse.json({ error: "Parol noto'g'ri" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, createSessionToken(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });
    return res;
  } catch (e) {
    console.error("Admin login xatosi:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
