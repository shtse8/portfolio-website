import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PERSONAL_INFO } from '@/data/personal';
import ScrollAnimationProvider from '@/components/ScrollAnimationProvider';
import { ModalProvider } from '@/context/ModalContext';
import ModalPortal from '@/components/shared/ModalPortal';
import { NavigationProvider } from '@/context/NavigationContext';
import AppShell from '@/components/layout/AppShell';

const inter = Inter({ subsets: ["latin"] });

// Client-side theme initialization script - simplified to reduce hydration issues
const clientThemeScript = `
  (function() {
    try {
      const isDark = localStorage.getItem('themePreference') === 'dark' || 
        (!localStorage.getItem('themePreference') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      // Fail silently if localStorage is not available
    }
  })();
`;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
};

export const metadata: Metadata = {
  title: `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName} - Full Stack Developer`,
  description: "Professional portfolio showcasing full-stack development expertise, leadership experience, and innovative projects across web, mobile, and blockchain technologies.",
  keywords: "full stack developer, web development, react, typescript, nodejs, blockchain, tech lead",
  authors: [{ name: `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName}` }],
  robots: "index, follow",
  creator: `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName}`,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: PERSONAL_INFO.portfolioUrl,
    title: `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName} - Full Stack Developer`,
    description: "Professional portfolio showcasing full-stack development expertise, leadership experience, and innovative projects.",
    siteName: `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName} Portfolio`,
    images: [
      {
        url: `${PERSONAL_INFO.portfolioUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName}'s Portfolio`
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName} - Full Stack Developer`,
    description: "Professional portfolio showcasing full-stack development expertise and innovative projects.",
    creator: "@kyletse",
    images: [{
      url: `${PERSONAL_INFO.portfolioUrl}/og-image.svg`,
      width: 1200,
      height: 630,
      alt: `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName}'s Portfolio`
    }],
  },
  alternates: {
    canonical: PERSONAL_INFO.portfolioUrl,
    languages: {
      'en-US': `${PERSONAL_INFO.portfolioUrl}/en`,
      'zh-HK': `${PERSONAL_INFO.portfolioUrl}/zh`
    },
    types: {
      // Define alternate URLs for different sections
      'tech-stack': `${PERSONAL_INFO.portfolioUrl}/tech-stack`,
      'philosophy': `${PERSONAL_INFO.portfolioUrl}/philosophy`,
      'projects': `${PERSONAL_INFO.portfolioUrl}/projects`,
      'experience': `${PERSONAL_INFO.portfolioUrl}/experience`,
      'contact': `${PERSONAL_INFO.portfolioUrl}/contact`,
    }
  },
  metadataBase: new URL(PERSONAL_INFO.portfolioUrl),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/og-icon-temp.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-512x512.svg" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.svg" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName}`,
              "url": PERSONAL_INFO.portfolioUrl,
              "jobTitle": "Full Stack Developer",
              "sameAs": [
                PERSONAL_INFO.social.github,
                PERSONAL_INFO.social.linkedin,
                PERSONAL_INFO.social.stackoverflow
              ],
              "worksFor": {
                "@type": "Organization",
                "name": PERSONAL_INFO.company
              },
              "knowsAbout": [
                "Full Stack Development",
                "React",
                "TypeScript",
                "Node.js",
                "Blockchain",
                "Project Management",
                "Team Leadership"
              ]
            })
          }}
        />
        
        {/* WebSite schema with SiteNavigationElement for structured navigation data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName} - Portfolio`,
              "url": PERSONAL_INFO.portfolioUrl,
              "description": "Professional portfolio showcasing full-stack development expertise, leadership experience, and innovative projects.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${PERSONAL_INFO.portfolioUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              },
              "author": {
                "@type": "Person",
                "name": `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName}`,
                "url": PERSONAL_INFO.portfolioUrl
              },
              "hasPart": [
                {
                  "@type": "WebPage",
                  "name": "Home",
                  "url": PERSONAL_INFO.portfolioUrl,
                  "description": "Homepage featuring an introduction to Kyle Tse"
                },
                {
                  "@type": "WebPage",
                  "name": "Skills",
                  "url": `${PERSONAL_INFO.portfolioUrl}/tech-stack`,
                  "description": "Technical skills and expertise"
                },
                {
                  "@type": "WebPage",
                  "name": "Philosophy",
                  "url": `${PERSONAL_INFO.portfolioUrl}/philosophy`,
                  "description": "Development philosophy and approach"
                },
                {
                  "@type": "WebPage",
                  "name": "Projects",
                  "url": `${PERSONAL_INFO.portfolioUrl}/projects`,
                  "description": "Featured projects and case studies"
                },
                {
                  "@type": "WebPage",
                  "name": "Experience",
                  "url": `${PERSONAL_INFO.portfolioUrl}/experience`,
                  "description": "Professional experience and work history"
                },
                {
                  "@type": "WebPage",
                  "name": "Contact",
                  "url": `${PERSONAL_INFO.portfolioUrl}/contact`,
                  "description": "Contact information and form"
                }
              ]
            })
          }}
        />
        {/* Client-side theme initialization - simplified version */}
        <script dangerouslySetInnerHTML={{ __html: clientThemeScript }} />
      </head>
      <body className={`${inter.className} scroll-smooth overflow-hidden`}>
        <ModalProvider>
          <NavigationProvider>
            <ScrollAnimationProvider>
              <AppShell>
                {children}
              </AppShell>
            </ScrollAnimationProvider>
          </NavigationProvider>
          <ModalPortal />
        </ModalProvider>
      </body>
    </html>
  );
}
