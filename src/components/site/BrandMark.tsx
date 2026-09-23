import Image from "next/image";

/**
 * Sayt logotipi.
 *
 * next/image: asl PNG 400px / 95 KB — eng katta ko'rinishi 56px (h-14),
 * shuning uchun kichraytirilgan WebP beriladi. width/height faqat nisbat va
 * srcset uchun, ko'rinadigan o'lchamni `className` belgilaydi.
 */
export function BrandMark({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/brand/logo-mark.png"
      alt="Online taklifnomalar"
      width={138}
      height={112}
      className={`shrink-0 object-contain ${className}`}
    />
  );
}
