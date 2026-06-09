import type { Metadata, Viewport } from "next";
import "./globals.css";
import { COMPANY, PUBLIC_URL, siteBaseUrl } from "@/lib/company";

const siteUrl = siteBaseUrl();
const title = "Epic Agent Studio — Multimodal AI Creative Platform";
const description =
  "Epic Tech AI — generate text, images, audio, and video with one prompt. Subscribe, sign in with Google, and create in your private studio workspace.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: COMPANY.product,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  description,
  url: PUBLIC_URL,
  author: {
    "@type": "Organization",
    name: COMPANY.name,
    url: COMPANY.x.url,
  },
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: "9.99",
    description: "Weekly subscription — full studio access",
  },
};

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s · ${COMPANY.product}`,
  },
  description,
  keywords: [
    "AI studio",
    "multimodal AI",
    "text generation",
    "image generation",
    "audio generation",
    "video generation",
    "Epic Tech AI",
    "creative AI",
  ],
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: COMPANY.product },
  metadataBase: new URL(siteUrl),
  alternates: { canonical: PUBLIC_URL },
  openGraph: {
    title,
    description,
    url: PUBLIC_URL,
    siteName: COMPANY.product,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Epic Agent Studio — multimodal AI creative platform by Epic Tech AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.svg"],
    creator: COMPANY.x.handle,
    site: COMPANY.x.handle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#07070f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}