import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PERSONAL_INFO } from "@/data/personal";
import { SECTIONS } from "@/config/sections";
import ModalPortal from "@/components/shared/ModalPortal";
import { NavigationProvider } from "@/context/NavigationContext";
import AppShell from "@/components/layout/AppShell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

const fullName = `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName}`;
const TITLE = `${fullName} — Technical Founder & Builder`;
const DESCRIPTION =
  "Kyle Tse is a technical founder with 20 years building products at scale — from a Hong Kong gaming studio (10M+ downloads, 10M+ players) to open-source AI developer tools. Currently building MCP tools at Sylphx.";

// Theme bootstrap — runs before paint to avoid a flash of the wrong theme.
const themeScript = `
(function(){try{
  var p = localStorage.getItem('themePreference');
  var dark = p === 'dark' || (!p && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (dark) document.documentElement.classList.add('dark');
}catch(e){}})();
`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Pinch-zoom intentionally allowed (WCAG 1.4.4) — no maximum-scale / user-scalable lock.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(PERSONAL_INFO.portfolioUrl),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "technical founder",
    "open source",
    "MCP",
    "developer tools",
    "TypeScript",
    "full stack developer",
    "game developer",
    "startup founder",
  ],
  authors: [{ name: fullName, url: PERSONAL_INFO.portfolioUrl }],
  creator: fullName,
  robots: "index, follow",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: PERSONAL_INFO.portfolioUrl,
    title: TITLE,
    description: DESCRIPTION,
    siteName: `${fullName} — Portfolio`,
    images: [{ url: "/og-image.jpeg", width: 1200, height: 630, alt: `${fullName} — Technical Founder & Builder` }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@kyletse",
    images: ["/og-image.jpeg"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: fullName,
  url: PERSONAL_INFO.portfolioUrl,
  jobTitle: "Technical Founder",
  description: DESCRIPTION,
  email: `mailto:${PERSONAL_INFO.email}`,
  sameAs: [PERSONAL_INFO.social.github, PERSONAL_INFO.social.linkedin, PERSONAL_INFO.social.stackoverflow],
  worksFor: { "@type": "Organization", name: PERSONAL_INFO.company, url: "https://sylphx.com" },
  knowsAbout: [
    "Open Source Development",
    "Model Context Protocol",
    "Developer Tools",
    "TypeScript",
    "Full Stack Development",
    "Game Development",
    "System Architecture",
  ],
};

// Single indexable page (/) — sections are in-page anchors, not separate WebPage URLs.
const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `${fullName} — Portfolio`,
  url: PERSONAL_INFO.portfolioUrl,
  description: DESCRIPTION,
  author: { "@type": "Person", name: fullName, url: PERSONAL_INFO.portfolioUrl },
  hasPart: SECTIONS.filter((s) => s.id !== "hero").map((s) => ({
    "@type": "WebPageElement",
    name: s.label,
    url: `${PERSONAL_INFO.portfolioUrl}/#${s.id}`,
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/og-icon-temp.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-512x512.svg" />
        <link rel="manifest" href="/manifest.json" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh antialiased">
        <NavigationProvider>
          <AppShell>{children}</AppShell>
        </NavigationProvider>
        <ModalPortal />
      </body>
    </html>
  );
}
