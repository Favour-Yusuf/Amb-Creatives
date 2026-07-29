import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Serif, Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";

import { Cursor } from "@/components/chrome/cursor";
import { Grain } from "@/components/chrome/grain";
import { Preloader } from "@/components/chrome/preloader";
import { ScrollRail } from "@/components/chrome/scroll-rail";
import { SiteNav } from "@/components/chrome/site-nav";
import { SmoothScroll } from "@/components/chrome/smooth-scroll";
import { CheckoutProvider } from "@/components/checkout/checkout-provider";
import { SITE } from "@/lib/content";

/* Display: geometric, slightly eccentric — carries every headline. */
const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-syne",
  display: "swap",
});

/* Body: a grotesk with enough character to hold its own next to Syne. */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

/* Editorial accent: used italic, sparingly, for emphasised phrases. */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

/* Micro-labels, indices and technical furniture. */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const description =
  "A private creative learning ecosystem for creators, designers, filmmakers and entrepreneurs building with AI. Lifetime membership — one-time ₦5,000.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description,
  keywords: [
    "AMB Creatives",
    "creative community",
    "AI for creatives",
    "creative learning ecosystem",
    "Attah Moses Bob",
    "Nigerian creative community",
  ],
  authors: [{ name: "Attah Moses Bob" }],
  creator: "Attah Moses Bob",
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description,
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${spaceGrotesk.variable} ${instrumentSerif.variable} ${geistMono.variable} antialiased`}
    >
      <body className="bg-ink text-paper">
        <SmoothScroll>
          <CheckoutProvider>
            <a
              href="#definition"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-200 focus:rounded-full focus:bg-flare focus:px-5 focus:py-3 focus:text-ink"
            >
              Skip to content
            </a>
            <Preloader />
            <Cursor />
            <Grain />
            <SiteNav />
            <ScrollRail />
            {children}
          </CheckoutProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
