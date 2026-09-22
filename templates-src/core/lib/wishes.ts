/**
 * Tilaklar API — /api/forms dan o'qish va yozish.
 */

export type WishItem = {
  id: number;
  guestName: string;
  message: string;
  createdAt: string;
};

function invitationSlug(): string {
  if (typeof window === "undefined") return "";
  const m = window.location.pathname.match(/^\/e\/([^/]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

/** `true` — bu namuna/preview sahifasi, tilak saqlanmaydi. */
export function isPreviewContext(): boolean {
  return invitationSlug() === "";
}

/** Tilaklarni serverdan olish (ochiq taklifnomalar uchun). */
export async function fetchWishes(): Promise<WishItem[]> {
  const slug = invitationSlug();
  if (!slug) return [];
  try {
    const res = await fetch(`/api/forms?slug=${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { wishes?: WishItem[] };
    return data.wishes ?? [];
  } catch {
    return [];
  }
}

export async function submitWish(name: string, message: string): Promise<void> {
  const res = await fetch("/api/forms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "wish", slug: invitationSlug(), name, message }),
  });
  if (!res.ok) throw new Error(`Tilak xatosi: ${res.status}`);
}
