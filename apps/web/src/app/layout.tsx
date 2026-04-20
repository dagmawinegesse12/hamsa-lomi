import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/shared/providers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hamsalomi.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hamsa Lomi Ethiopian Association",
    template: "%s | Hamsa Lomi"
  },
  description:
    "A Nashville-based Ethiopian mutual aid association providing financial assistance, funeral support, and community care through the Edir tradition.",
  keywords: ["Edir", "Ethiopian", "Nashville", "mutual aid", "Hamsa Lomi", "community", "funeral assistance"],
  authors: [{ name: "Hamsa Lomi Ethiopian Association" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Hamsa Lomi Ethiopian Association",
    title: "Hamsa Lomi Ethiopian Association",
    description:
      "A Nashville-based Ethiopian mutual aid association providing financial assistance and funeral support through the Edir tradition.",
    locale: "en_US"
  },
  twitter: {
    card: "summary",
    title: "Hamsa Lomi Ethiopian Association",
    description:
      "Supporting Nashville's Ethiopian community through tradition, compassion, and shared responsibility."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
