/**
 * Platforma submit.ts — RSVP va tilaklar /api/forms ga yuboriladi.
 * Invitation slug'i URL'dan olinadi (/e/<slug>).
 */

const ENDPOINT = "/api/forms";

export type RsvpPayload = {
  kind: "rsvp";
  name: string;
  attending: "keladi" | "kelolmaydi";
  guests: number;
  comment: string;
};

export type WishPayload = {
  kind: "wish";
  name: string;
  message: string;
};

export type Payload = RsvpPayload | WishPayload;

function invitationSlug(): string {
  if (typeof window === "undefined") return "";
  const m = window.location.pathname.match(/^\/e\/([^/]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

/**
 * `true` bo'lsa — bu sahifa haqiqiy taklifnoma emas (namuna/preview), RSVP va
 * tilaklar hech qachon saqlanmaydi, chunki biriktiriladigan haqiqiy buyurtma
 * yo'q. Komponentlar bu holatda forma o'rniga tushuntirish ko'rsatishi kerak.
 */
export function isPreviewContext(): boolean {
  return invitationSlug() === "";
}

export async function submit(payload: Payload): Promise<void> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, slug: invitationSlug() }),
  });
  if (!res.ok) {
    throw new Error(`Forma xatosi: ${res.status}`);
  }
}
