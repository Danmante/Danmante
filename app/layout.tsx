import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://danmante.github.io/Danmante"),
  title: {
    default: "Danmante | Healthcare access, connected.",
    template: "%s | Danmante",
  },
  description:
    "Danmante connects patients with verified healthcare professionals and certified pharmacies through secure digital healthcare workflows.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Danmante | Healthcare access, connected.",
    description: "A jurisdiction-aware digital health foundation for safer access and professional workflows.",
    type: "website",
    url: "/",
    siteName: "Danmante",
  },
  twitter: { card: "summary", title: "Danmante | Healthcare access, connected.", description: "A jurisdiction-aware digital health foundation for safer access and professional workflows." },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
