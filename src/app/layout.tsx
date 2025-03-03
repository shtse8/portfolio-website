import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PERSONAL_INFO } from '@/data/personal';
import ScrollAnimationProvider from '@/components/ScrollAnimationProvider';
import { ModalProvider } from '@/context/ModalContext';
import ModalPortal from '@/components/shared/ModalPortal';

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
  themeColor: '#3b82f6',
};

export const metadata: Metadata = {
  title: `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName} - Full Stack Developer & Founder`,
  description: "Professional portfolio showcasing full-stack development expertise, leadership experience, and innovative projects across web, mobile, and blockchain technologies.",
  keywords: "full stack developer, web development, react, typescript, nodejs, blockchain, founder, tech lead",
  authors: [{ name: `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName}` }],
  robots: "index, follow",
  creator: `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName}`,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: PERSONAL_INFO.portfolioUrl,
    title: `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName} - Full Stack Developer & Founder`,
    description: "Professional portfolio showcasing full-stack development expertise, leadership experience, and innovative projects.",
    siteName: `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName} Portfolio`,
    images: [
      {
        url: `${PERSONAL_INFO.portfolioUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName}`
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName} - Full Stack Developer`,
    description: "Professional portfolio showcasing full-stack development expertise and innovative projects.",
    images: [`${PERSONAL_INFO.portfolioUrl}/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName}`,
              "url": PERSONAL_INFO.portfolioUrl,
              "jobTitle": "Full Stack Developer & Founder",
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
        {/* Client-side theme initialization - simplified version */}
        <script dangerouslySetInnerHTML={{ __html: clientThemeScript }} />
      </head>
      <body className={`${inter.className} scroll-smooth`}>
        <ModalProvider>
          <ScrollAnimationProvider>
            {children}
          </ScrollAnimationProvider>
          <ModalPortal />
        </ModalProvider>
      </body>
    </html>
  );
}
