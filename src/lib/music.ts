/**
 * Taklifnoma fon musiqalari.
 *
 * Yangi kuy qo'shish: mp3 faylni `public/music/` ga qo'ying va shu ro'yxatga
 * yozing (`id` o'zgarmas bo'lsin — buyurtmalarda shu saqlanadi). Faqat
 * foydalanish huquqi bor musiqalarni qo'shing.
 */
import { isOwnBlobUrl } from "./blob";

export type MusicTrack = {
  id: string;
  name: string;
  src: string;
  /** Tanlov ro'yxatida ko'rinmaydi — faqat avval tanlagan buyurtmalar uchun ishlab turadi */
  hidden?: boolean;
};

export const MUSIC_TRACKS: MusicTrack[] = [
  { id: "classic", name: "Nafis kuy", src: "/music.mp3" },
  // Quyidagilar — public domain / CC0 yozuvlar (zamonaviy fortepiano
  // ijrolari), manbalar: public/music/CREDITS.md
  { id: "chopin-nocturne", name: "Shopen — Nokturn (fortepiano)", src: "/music/chopin-nocturne.mp3" },
  { id: "bach-goldberg-aria", name: "Bax — Aria (fortepiano)", src: "/music/bach-goldberg-aria.mp3" },
  { id: "satie-gymnopedie", name: "Sati — Gimnopediya (fortepiano)", src: "/music/satie-gymnopedie.mp3" },
  { id: "schumann-traumerei", name: "Shuman — Orzu (fortepiano)", src: "/music/schumann-traumerei.mp3" },
  { id: "wedding-march", name: "Mendelson — To'y marshi", src: "/music/wedding-march.mp3" },
  // Xristian madhiyasi — o'zbek to'ylariga mos emas: yangi buyurtmalarda taklif qilinmaydi
  { id: "ave-maria", name: "Shubert — Ave Maria", src: "/music/ave-maria.mp3", hidden: true },
];

/** Buyurtma formasidagi tanlov ro'yxati */
export const PICKER_TRACKS = MUSIC_TRACKS.filter((t) => !t.hidden);

export const MUSIC_NONE = "none";
/** Mijoz o'zi yuklagan musiqa (`Customization.customMusicUrl`) */
export const MUSIC_CUSTOM = "custom";
export const DEFAULT_MUSIC = MUSIC_TRACKS[0].id;

// Mijoz yuklaydigan musiqa: MP3/M4A/AAC/OGG, 15 MB gacha (≈ 10 daqiqa MP3)
export const CUSTOM_MUSIC_TYPES = ["audio/mpeg", "audio/mp3", "audio/mp4", "audio/x-m4a", "audio/aac", "audio/ogg"];
export const CUSTOM_MUSIC_MAX_BYTES = 15 * 1024 * 1024;

/** Yuklangan musiqa havolasi haqiqatan bizning Blob store'dagi `music/` papkasidanmi */
export function isOwnMusicUrl(url: string): boolean {
  return isOwnBlobUrl(url, "/music/");
}

export function musicTrack(id: string): MusicTrack | null {
  return MUSIC_TRACKS.find((t) => t.id === id) ?? null;
}
