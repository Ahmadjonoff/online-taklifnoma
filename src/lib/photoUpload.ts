"use client";

import { upload } from "@vercel/blob/client";

const MAX_SIDE = 1800;

/**
 * Suratni brauzerda kichraytirib (eng uzun tomoni 1800px, JPEG) Blob'ga
 * yuklaydi. Telefon suratlari 5–10 MB bo'ladi — taklifnoma sekin ochilmasin.
 */
export async function uploadPhoto(file: File, onProgress?: (pct: number) => void): Promise<string> {
  const blob = await shrink(file);
  const name = (file.name.replace(/\.[^.]+$/, "").replace(/[^\w-]+/g, "-").slice(-40) || "photo") + ".jpg";
  const res = await upload(`photos/${name}`, blob, {
    access: "public",
    handleUploadUrl: "/api/upload/photo",
    contentType: "image/jpeg",
    onUploadProgress: (e) => onProgress?.(Math.round(e.percentage)),
  });
  return res.url;
}

async function shrink(file: File): Promise<Blob> {
  const img = await createImageBitmap(file).catch(() => null);
  if (!img) return file; // brauzer o'qiy olmasa — asl fayl (server turini tekshiradi)
  const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b ?? file), "image/jpeg", 0.86));
}
