/**
 * Taklifnoma fon musiqalari.
 *
 * Yangi kuy qo'shish: mp3 faylni `public/music/` ga qo'ying va shu ro'yxatga
 * yozing (`id` o'zgarmas bo'lsin — buyurtmalarda shu saqlanadi). Faqat
 * foydalanish huquqi bor musiqalarni qo'shing.
 */
export type MusicTrack = { id: string; name: string; src: string };

export const MUSIC_TRACKS: MusicTrack[] = [
  { id: "classic", name: "Nafis kuy", src: "/music.mp3" },
];

export const MUSIC_NONE = "none";
export const DEFAULT_MUSIC = MUSIC_TRACKS[0].id;

export function musicTrack(id: string): MusicTrack | null {
  return MUSIC_TRACKS.find((t) => t.id === id) ?? null;
}
