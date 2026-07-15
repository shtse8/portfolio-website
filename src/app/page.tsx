"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import FilmGrain from "@/components/cinematic/FilmGrain";
import ErrorBoundary from "@/components/ErrorBoundary";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LoadingSpinner from "@/components/LoadingSpinner";
import { WorkGraphProvider } from "@/context/WorkGraphContext";
import { cn } from "@/lib/utils";

const sectionFallback = (
  <div className="flex w-full justify-center py-24">
    <LoadingSpinner />
  </div>
);

const WorkGraph = dynamic(() => import("@/components/WorkGraph"), {
  loading: () => sectionFallback,
});
const StoryArc = dynamic(() => import("@/components/StoryArc"), {
  loading: () => sectionFallback,
});
const FloatingAgent = dynamic(() => import("@/components/FloatingAgent"), {
  ssr: false,
});
const ScrollProgress = dynamic(() => import("@/components/ScrollProgress"), {
  ssr: false,
});
const Contact = dynamic(() => import("@/components/Contact"), {
  loading: () => sectionFallback,
});

interface HomeProps {
  initialSection?: string;
}

const PAD = "scroll-mt-20 py-28 sm:py-36";

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
    <section id={id} className={cn(PAD, "scene-cut", className)}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </section>
  );
}

export default function Home({ initialSection }: HomeProps) {
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (
      !initialSection ||
      typeof window === "undefined" ||
      hasNavigated.current
    )
      return;
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
    <WorkGraphProvider>
      <FilmGrain />
      <ScrollProgress />
      <Header />

      <section id="hero" className="scroll-mt-0">
        <ErrorBoundary>
          <Hero />
        </ErrorBoundary>
      </section>

      <Section id="story">
        <StoryArc />
      </Section>

      <Section id="work">
        <WorkGraph />
      </Section>

      <Section id="contact" className="bg-surface-sunken/30">
        <Contact />
      </Section>

      <FloatingAgent />
      <Footer />
    </WorkGraphProvider>
  );
}
