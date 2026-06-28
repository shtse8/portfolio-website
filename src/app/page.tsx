"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { cn } from "@/lib/utils";

const sectionFallback = (
  <div className="flex w-full justify-center py-24">
    <LoadingSpinner />
  </div>
);

const AskAI = dynamic(() => import("@/components/AskAI"), { loading: () => sectionFallback });
const Now = dynamic(() => import("@/components/Now"), { loading: () => sectionFallback });
const OpenSource = dynamic(() => import("@/components/OpenSource"), { loading: () => sectionFallback });
const Experience = dynamic(() => import("@/components/Experience"), { loading: () => sectionFallback });
const FeaturedProjects = dynamic(() => import("@/components/FeaturedProjects"), { loading: () => sectionFallback });
const Capabilities = dynamic(() => import("@/components/TechStack"), { loading: () => sectionFallback });
const Philosophy = dynamic(() => import("@/components/Philosophy"), { loading: () => sectionFallback });
const Contact = dynamic(() => import("@/components/Contact"), { loading: () => sectionFallback });

interface HomeProps {
  initialSection?: string;
}

const PAD = "scroll-mt-20 py-24 sm:py-32";

function Section({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn(PAD, className)}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </section>
  );
}

export default function Home({ initialSection }: HomeProps) {
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (!initialSection || typeof window === "undefined" || hasNavigated.current) return;
    hasNavigated.current = true;
    const t = setTimeout(() => {
      const el = document.getElementById(initialSection);
      if (el) {
        const path = initialSection === "hero" ? "/" : `/${initialSection}`;
        window.history.replaceState({ path }, "", path);
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 250);
    return () => clearTimeout(t);
  }, [initialSection]);

  return (
    <>
      <Header />

      <section id="hero" className="scroll-mt-0">
        <ErrorBoundary>
          <Hero />
        </ErrorBoundary>
      </section>

      <Section id="ask-ai" className="border-t border-border-subtle bg-surface-sunken/40">
        <AskAI />
      </Section>

      <Section id="now">
        <Now />
      </Section>

      <Section id="open-source" className="border-t border-border-subtle bg-surface-sunken/40">
        <OpenSource />
      </Section>

      <Section id="experience">
        <Experience />
      </Section>

      <Section id="projects" className="border-t border-border-subtle bg-surface-sunken/40">
        <FeaturedProjects />
      </Section>

      <Section id="capabilities">
        <Capabilities />
      </Section>

      <Section id="philosophy" className="border-t border-border-subtle bg-surface-sunken/40">
        <Philosophy />
      </Section>

      <Section id="contact">
        <Contact />
      </Section>

      <Footer />
    </>
  );
}
