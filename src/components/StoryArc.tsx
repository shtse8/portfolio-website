"use client";

import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { useWorkGraph } from "@/context/WorkGraphContext";
import { formatNumber } from "@/data";
import { getOrganization } from "@/data/organizations";
import { PROJECTS } from "@/data/projects";
import { calculateTotalExperience, getRolesSortedByDate } from "@/data/roles";
import type { Role } from "@/data/types";
import { useCountUp } from "@/hooks/useCountUp";
import AmbientField from "./cinematic/AmbientField";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

/**
 * StoryArc — cinematic career reel.
 *
 * Each era is a sticky full-viewport "scene." Scroll drives opacity, scale, and
 * a progress rail — like scrubbing through chapters of a film. Massive year
 * watermarks + display headlines carry the visual weight; proof stays legible.
 */

interface EraChapter {
  role: Role;
  era: string;
  startYear: string;
  headline: string;
  scaleNumber?: { value: number; label: string; display: string };
  projects?: string[];
}

function eraProjects(orgId: string): string[] {
  return PROJECTS.filter((p) => p.organizationId === orgId)
    .sort((a, b) => (b.details?.length ?? 0) - (a.details?.length ?? 0))
    .slice(0, 4)
    .map((p) => p.title);
}

const ERA_META: Record<string, { era: string; headline: string }> = {
  "nakuz-cto": {
    era: "Web · Community",
    headline: "Hong Kong's gaming portal",
  },
  "minimax-ceo": {
    era: "Social Gaming",
    headline: "Facebook games at 10M scale",
  },
  "cubeage-founder": {
    era: "Mobile Gaming",
    headline: "25+ games, 10M downloads",
  },
  "epiow-cto": {
    era: "Consultancy",
    headline: "Building for clients",
  },
  "sylphx-founder": {
    era: "AI · Open Source",
    headline: "The infrastructure AI agents run on",
  },
};

function getScaleNumber(
  role: Role,
): { value: number; label: string; display: string } | undefined {
  if (!role.metrics.length) return undefined;
  const m = role.metrics.reduce((best, cur) => {
    if (typeof cur.value !== "number") return best;
    if (!best || typeof best.value !== "number" || cur.value > best.value)
      return cur;
    return best;
  });
  if (typeof m.value !== "number" || m.value < 1000) return undefined;
  return {
    value: m.value,
    label:
      m.label ||
      m.unit ||
      (m.type === "downloads"
        ? "Downloads"
        : m.type === "users"
          ? "Users"
          : "Scale"),
    display: formatNumber(m.value),
  };
}

export default function StoryArc() {
  const roles = getRolesSortedByDate();
  const years = calculateTotalExperience();
  const { ask } = useWorkGraph();
  const reelRef = useRef<HTMLDivElement>(null);

  const chapters: EraChapter[] = roles
    .map((role) => {
      const meta = ERA_META[role.id];
      if (!meta) return null;
      return {
        role,
        era: meta.era,
        startYear: role.period.start.substring(0, 4),
        headline: meta.headline,
        scaleNumber: getScaleNumber(role),
        projects: eraProjects(role.organizationId),
      };
    })
    .filter(Boolean) as EraChapter[];

  const { scrollYProgress } = useScroll({
    target: reelRef,
    offset: ["start start", "end end"],
  });
  const reelProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div className="relative">
      <AmbientField variant="story" />

      <div className="container-cinema">
        <SectionHeader
          index="01"
          eyebrow="The journey"
          title={
            <>
              Twenty years.
              <br className="hidden sm:block" /> Five eras. One builder.
            </>
          }
          description="From a Hong Kong gaming forum in 2006 to AI infrastructure today — every chapter proved Kyle can ship and scale."
        />

        {/* Chapter index rail */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-text-tertiary">
            {chapters.map((ch, i) => (
              <span key={ch.role.id} className="flex items-center gap-3">
                {i > 0 && <span className="text-border">→</span>}
                <span className="text-text-secondary">{ch.startYear}</span>
                <span>{ch.era.split(" · ")[0]}</span>
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Film reel — sticky scenes */}
      <div ref={reelRef} className="relative mt-10">
        {/* Fixed progress tick while reel is in view */}
        <ReelProgress progress={reelProgress} count={chapters.length} />

        {chapters.map((ch, i) => (
          <EraScene
            key={ch.role.id}
            chapter={ch}
            index={i}
            total={chapters.length}
            ask={ask}
          />
        ))}
      </div>

      {/* End card */}
      <Reveal>
        <div className="container-cinema flex flex-col items-center gap-3 py-24 text-center sm:py-32">
          <div className="font-display text-7xl font-bold tracking-tighter text-accent sm:text-8xl lg:text-9xl">
            {years}+
          </div>
          <div className="font-mono text-sm uppercase tracking-[0.28em] text-text-tertiary">
            years of building
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function ReelProgress({
  progress,
  count,
}: {
  progress: MotionValue<number>;
  count: number;
}) {
  const scaleX = useTransform(progress, [0, 1], [0, 1]);
  return (
    <div
      aria-hidden
      className="pointer-events-none sticky top-[4.5rem] z-20 mx-auto mb-0 hidden h-0 w-full max-w-[72rem] px-5 sm:block sm:px-8"
    >
      <div className="relative h-px w-full overflow-hidden bg-border/50">
        <motion.div
          style={{ scaleX }}
          className="h-full origin-left bg-accent"
        />
      </div>
      <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-text-tertiary">
        <span>Act I</span>
        <span>{count} scenes</span>
      </div>
    </div>
  );
}

function EraScene({
  chapter,
  index,
  total,
  ask,
}: {
  chapter: EraChapter;
  index: number;
  total: number;
  ask: (q: string) => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { role, era, startYear, headline, scaleNumber } = chapter;
  const org = getOrganization(role.organizationId);
  const isCurrent = !role.period.end;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax / focus curve while the sticky scene is on screen
  const yearY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduce ? [0, 0, 0] : [40, 0, -40],
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduce ? [0, 0, 0] : [60, 0, -30],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.75, 1],
    [0.25, 1, 1, 0.35],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    reduce ? [1, 1, 1, 1] : [0.96, 1, 1, 0.98],
  );

  if (!org) return null;

  return (
    <section
      ref={ref}
      className="relative min-h-[140vh] sm:min-h-[160vh]"
      aria-label={`${startYear} — ${era}`}
    >
      <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden py-20 sm:py-24">
        <motion.div
          style={{ opacity, scale }}
          className="container-cinema w-full will-change-transform"
        >
          <div className="grid items-center gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:gap-16">
            {/* Massive year watermark */}
            <motion.div style={{ y: yearY }} className="relative">
              <div className="text-year-watermark select-none" aria-hidden>
                {startYear}
              </div>
              <div className="relative -mt-6 sm:-mt-10">
                <div className="font-mono text-xs uppercase tracking-[0.28em] text-text-tertiary">
                  Scene {String(index + 1).padStart(2, "0")} /{" "}
                  {String(total).padStart(2, "0")}
                </div>
                <div className="mt-3 eyebrow text-accent">{era}</div>
                {isCurrent && (
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-positive-subtle px-2.5 py-0.5 text-[11px] font-medium text-positive">
                    <span className="h-1.5 w-1.5 rounded-full bg-positive" />{" "}
                    Now
                  </div>
                )}
              </div>
            </motion.div>

            {/* Scene body */}
            <motion.div style={{ y: contentY }} className="relative">
              {scaleNumber && (
                <AnimatedScale
                  value={scaleNumber.value}
                  label={scaleNumber.label}
                />
              )}
              {!scaleNumber && isCurrent && (
                <div className="mb-5">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-positive-subtle px-3 py-1 font-mono text-xs font-medium text-positive">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-positive animate-ping-soft" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-positive" />
                    </span>
                    Just started
                  </div>
                </div>
              )}

              <h3 className="text-h2 text-text-primary">{headline}</h3>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-lg font-semibold text-text-secondary">
                  {org.name}
                </span>
                <span className="font-mono text-xs text-text-tertiary">
                  {role.title}
                </span>
                {role.location && (
                  <>
                    <span
                      aria-hidden
                      className="hidden h-1 w-1 rounded-full bg-border sm:inline-block"
                    />
                    <span className="font-mono text-xs text-text-tertiary">
                      {role.location}
                    </span>
                  </>
                )}
              </div>

              <p className="mt-5 max-w-prose text-base leading-relaxed text-text-secondary sm:text-lg">
                {role.description}.
              </p>

              {role.keyAchievements && role.keyAchievements.length > 0 && (
                <ul className="mt-6 space-y-2.5">
                  {role.keyAchievements.slice(0, 3).map((a) => (
                    <li
                      key={a}
                      className="flex items-start gap-2.5 text-sm text-text-secondary sm:text-[15px]"
                    >
                      <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {a}
                    </li>
                  ))}
                </ul>
              )}

              {role.metrics.length > 0 && !scaleNumber && (
                <div className="mt-7 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  {role.metrics.slice(0, 4).map((m) => (
                    <div
                      key={`${m.label ?? m.type ?? "metric"}-${m.unit ?? ""}-${typeof m.value === "number" ? m.value : String(m.value)}`}
                      className="rounded-xl border border-border-subtle bg-surface/60 px-3.5 py-2.5 backdrop-blur-sm"
                    >
                      <span className="block font-mono text-lg font-semibold leading-none text-text-primary">
                        {typeof m.value === "number"
                          ? formatNumber(m.value)
                          : String(m.value)}
                      </span>
                      <span className="mt-1.5 block text-[11px] text-text-tertiary">
                        {m.label || m.unit || m.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {chapter.projects && chapter.projects.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {chapter.projects.map((proj) => (
                    <span
                      key={proj}
                      className="rounded-lg border border-border-subtle bg-surface-sunken/60 px-2.5 py-1 text-xs font-medium text-text-secondary"
                    >
                      {proj}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-2">
                {role.skills?.slice(0, 4).map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    ask(`Tell me more about Kyle's work at ${org.name}.`)
                  }
                  className="ml-1 text-xs font-medium text-accent transition-colors hover:text-accent-hover"
                >
                  Ask AI →
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedScale({ value, label }: { value: number; label: string }) {
  const animated = useCountUp(value, 1800, true);
  const shown =
    value >= 1_000_000
      ? `${(animated / 1_000_000).toFixed(0)}M`
      : value >= 1000
        ? `${(animated / 1000).toFixed(0)}K`
        : animated.toString();

  return (
    <div className="mb-5">
      <div className="font-mono text-5xl font-bold tracking-tight text-accent sm:text-6xl">
        {shown}
      </div>
      <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-text-tertiary">
        {label}
      </div>
    </div>
  );
}
