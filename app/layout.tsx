import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Cultivate — Grow generosity",
  description:
    "Simple, honest fundraising software for growing nonprofits. Donation pages, donor records, recurring gifts, and IRS-ready receipts.",
  metadataBase: new URL("https://cultivate-fundraising.vercel.app"),
  openGraph: {
    title: "Cultivate — Grow generosity",
    description: "Simple, honest fundraising software for growing nonprofits.",
    type: "website",
    siteName: "Cultivate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cultivate — Grow generosity",
    description: "Simple, honest fundraising software for growing nonprofits.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
