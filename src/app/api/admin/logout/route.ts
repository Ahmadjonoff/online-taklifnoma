import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/boshqaruv/login", req.url), 303);
  res.cookies.delete(COOKIE_NAME);
  return res;
}
