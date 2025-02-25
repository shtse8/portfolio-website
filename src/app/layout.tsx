import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kyle Tse | Backend Engineer & Game Developer",
  description: "Portfolio of Kyle Tse, a Backend Engineer with 20+ years of experience in distributed systems, game platforms, blockchain solutions, and AI-driven automation.",
  keywords: "Kyle Tse, Backend Engineer, Game Developer, Blockchain, AI, Python, Java, Node.js, Unity3D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
