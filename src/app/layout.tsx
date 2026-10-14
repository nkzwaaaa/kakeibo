import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kakeibo",
  description: "家計簿アプリ Kakeibo",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
