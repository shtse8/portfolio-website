import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { SECTIONS } from "@/config/sections";
import { NavigationProvider } from "@/context/NavigationContext";
import { PERSONAL_INFO, SITE_DESCRIPTION } from "@/data/personal";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "sans-serif",
  ],
});

/** Display face for cinematic headlines — geometric, high presence. */
const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  fallback: ["system-ui", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

const fullName = `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName}`;
const TITLE = `${fullName} — AI infrastructure builder`;
const DESCRIPTION = SITE_DESCRIPTION;

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
    "AI infrastructure",
    "MCP",
    "Model Context Protocol",
    "AI agent tools",
    "developer tools",
    "TypeScript",
    "AI-native platform",
    "RAG",
    "semantic search",
    "open source",
    "technical founder",
    "full stack developer",
    "game developer",
    "startup founder",
    "Sylphx",
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
    images: [
      {
        url: "/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: `${fullName} — AI infrastructure builder`,
      },
    ],
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
  jobTitle: "AI Infrastructure Builder",
  description: DESCRIPTION,
  email: `mailto:${PERSONAL_INFO.email}`,
  sameAs: [
    PERSONAL_INFO.social.github,
    PERSONAL_INFO.social.linkedin,
    PERSONAL_INFO.social.stackoverflow,
  ],
  worksFor: {
    "@type": "Organization",
    name: PERSONAL_INFO.company,
    url: "https://sylphx.com",
  },
  knowsAbout: [
    "Model Context Protocol",
    "AI Agents & Tooling",
    "RAG & Semantic Search",
    "AI-Native Platform Engineering",
    "Developer Tools",
    "TypeScript",
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
  author: {
    "@type": "Person",
    name: fullName,
    url: PERSONAL_INFO.portfolioUrl,
  },
  hasPart: SECTIONS.filter((s) => s.id !== "hero").map((s) => ({
    "@type": "WebPageElement",
    name: s.label,
    url: `${PERSONAL_INFO.portfolioUrl}/#${s.id}`,
  })),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="icon" href="/icons/icon-192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script src="/theme-init.js" />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static structured data serialized from module-scoped constants, not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static structured data serialized from module-scoped constants, not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <NavigationProvider>
          <AppShell>{children}</AppShell>
        </NavigationProvider>
      </body>
    </html>
  );
}
