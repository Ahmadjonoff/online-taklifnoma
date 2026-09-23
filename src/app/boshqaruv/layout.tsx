import type { Metadata } from "next";

// Boshqaruv paneli saytda hech qayerda havola qilinmaydi — qidiruv
// tizimlari ham indekslamasin.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function BoshqaruvLayout({ children }: { children: React.ReactNode }) {
  return children;
}
