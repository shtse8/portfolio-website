"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { formatNumber } from "@/data";
import {
  calculateTotalExperience,
  getRolesSortedByDate,
} from "@/data/roles";
import type { Role } from "@/data/types";
import { getOrganization } from "@/data/organizations";
import { PROJECTS } from "@/data/projects";
import { useCountUp } from "@/hooks/useCountUp";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";
import { useWorkGraph } from "@/context/WorkGraphContext";

/**
 * StoryArc — a scroll-driven narrative of Kyle's 20-year career.
 *
 * Each era is a sticky-pinned chapter with a massive year, a scale number,
 * and key achievements. Scroll-triggered reveals make each number feel
 * like a discovery rather than a résumé bullet.
 */

interface EraChapter {
  role: Role;
  era: string;
  startYear: string;
  headline: string;
  scaleNumber?: { value: number; label: string; display: string };
  gradient: string; // tailwind gradient classes
  projects?: string[]; // representative project names from static data
}

/** Representative project names for an org from the static data (top 4). */
function eraProjects(orgId: string): string[] {
  return PROJECTS
    .filter((p) => p.organizationId === orgId)
    .sort((a, b) => (b.details?.length ?? 0) - (a.details?.length ?? 0))
    .slice(0, 4)
    .map((p) => p.title);
}

const ERA_META: Record<string, { era: string; headline: string; gradient: string }> = {
  "nakuz-cto": {
    era: "Web · Community",
    headline: "Hong Kong's gaming portal",
    gradient: "from-blue-500/10 to-transparent",
  },
  "minimax-ceo": {
    era: "Social Gaming",
    headline: "Facebook games at 10M scale",
    gradient: "from-purple-500/10 to-transparent",
  },
  "cubeage-founder": {
    era: "Mobile Gaming",
    headline: "25+ games, 10M downloads",
    gradient: "from-green-500/10 to-transparent",
  },
  "epiow-cto": {
    era: "Consultancy",
    headline: "Building for clients",
    gradient: "from-orange-500/10 to-transparent",
  },
  "sylphx-founder": {
    era: "AI · Open Source",
    headline: "The infrastructure AI agents run on",
    gradient: "from-accent/15 to-transparent",
  },
};

function getScaleNumber(role: Role): { value: number; label: string; display: string } | undefined {
  if (!role.metrics.length) return undefined;
  // Pick the most impressive metric
  const m = role.metrics.reduce((best, cur) => {
    if (typeof cur.value !== "number") return best;
    if (!best || (typeof best.value !== "number") || cur.value > best.value) return cur;
    return best;
  });
  if (typeof m.value !== "number" || m.value < 1000) return undefined;
  return {
    value: m.value,
    label: m.label || m.unit || (m.type === "downloads" ? "Downloads" : m.type === "users" ? "Users" : "Scale"),
    display: formatNumber(m.value),
  };
}

export default function StoryArc() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const roles = getRolesSortedByDate();
  const years = calculateTotalExperience();
  const { ask } = useWorkGraph();

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
        gradient: meta.gradient,
        projects: eraProjects(role.organizationId),
      };
    })
    .filter(Boolean) as EraChapter[];

  return (
    <div className="container-content">
      <SectionHeader
        index="01"
        eyebrow="The journey"
        title="Twenty years. Five eras. One builder."
        description={`From a Hong Kong gaming forum in 2006 to AI infrastructure today — every chapter proved Kyle can ship and scale.`}
      />

      {/* Era summary bar */}
      <Reveal delay={0.1}>
        <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs text-text-tertiary">
          {chapters.map((ch, i) => (
            <span key={ch.role.id} className="flex items-center gap-3">
              {i > 0 && <span className="text-border">→</span>}
              <span className="text-text-secondary">{ch.startYear}</span>
              <span className="text-text-tertiary">{ch.era.split(" · ")[0]}</span>
            </span>
          ))}
        </div>
      </Reveal>

      {/* Scroll-driven era chapters */}
      <div ref={containerRef as React.RefObject<HTMLDivElement>} className="mt-14">
        {chapters.map((ch, i) => (
          <EraChapterView key={ch.role.id} chapter={ch} index={i} reduce={reduce} ask={ask} />
        ))}
      </div>

      {/* Total experience summary */}
      <Reveal>
        <div className="mt-16 flex flex-col items-center gap-2 py-12 text-center">
          <div className="font-mono text-6xl font-bold tracking-tight text-accent sm:text-7xl">
            {years}+
          </div>
          <div className="text-sm text-text-tertiary">years of building</div>
        </div>
      </Reveal>
    </div>
  );
}

function EraChapterView({
  chapter,
  index,
  reduce,
  ask,
}: {
  chapter: EraChapter;
  index: number;
  reduce: boolean | null;
  ask: (q: string) => void;
}) {
  const { role, era, startYear, headline, scaleNumber, gradient } = chapter;
  const org = getOrganization(role.organizationId);
  if (!org) return null;

  const isCurrent = !role.period.end;

  return (
    <section className="relative min-h-[45vh] py-10 sm:min-h-[65vh] sm:py-20">
      {/* Gradient backdrop */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b ${gradient}`}
      />

      <div>
        <div className="grid items-center gap-8 lg:grid-cols-[0.4fr_0.6fr]">
          {/* ── Left: Massive year + era ── */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={`font-mono text-7xl font-bold leading-none tracking-tighter text-text-primary/15 sm:text-8xl ${index === 0 ? "text-accent/20" : ""}`}>
              {startYear}
            </div>
            <div className="mt-2 eyebrow">{era}</div>
            {isCurrent && (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-positive-subtle px-2.5 py-0.5 text-[11px] font-medium text-positive">
                <span className="h-1.5 w-1.5 rounded-full bg-positive" /> Now
              </div>
            )}
          </motion.div>

          {/* ── Right: Headline + scale number + achievements ── */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Scale number hero */}
            {scaleNumber && (
              <AnimatedScale value={scaleNumber.value} display={scaleNumber.display} label={scaleNumber.label} />
            )}
            {!scaleNumber && isCurrent && (
              <div className="mb-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-positive-subtle px-3 py-1 font-mono text-xs font-medium text-positive">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-positive animate-ping-soft" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-positive" />
                  </span>
                  Just started
                </div>
              </div>
            )}

            <h3 className="mt-4 text-h2 text-text-primary">{headline}</h3>

            <div className="mt-2 flex items-center gap-3">
              <span className="text-lg font-semibold text-text-secondary">{org.name}</span>
              <span className="font-mono text-xs text-text-tertiary">{role.title}</span>
              {role.location && (
                <>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-border" />
                  <span className="font-mono text-xs text-text-tertiary">{role.location}</span>
                </>
              )}
            </div>

            <p className="mt-4 max-w-prose text-text-secondary">{role.description}.</p>

            {/* Key achievements */}
            {role.keyAchievements && role.keyAchievements.length > 0 && (
              <ul className="mt-5 space-y-2">
                {role.keyAchievements.slice(0, 3).map((a) => (
                  <li key={a} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {a}
                  </li>
                ))}
              </ul>
            )}

            {/* Metric tiles */}
            {role.metrics.length > 0 && !scaleNumber && (
              <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {role.metrics.slice(0, 4).map((m, idx) => (
                  <div key={idx} className="rounded-xl border border-border-subtle bg-surface-sunken px-3.5 py-2.5">
                    <span className="block font-mono text-lg font-semibold leading-none text-text-primary">
                      {typeof m.value === "number" ? formatNumber(m.value) : String(m.value)}
                    </span>
                    <span className="mt-1.5 block text-[11px] text-text-tertiary">
                      {m.label || m.unit || m.type}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Representative projects from this era */}
            {chapter.projects && chapter.projects.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {chapter.projects.map((proj) => (
                  <span key={proj} className="rounded-lg bg-surface-sunken px-2.5 py-1 text-xs font-medium text-text-secondary">
                    {proj}
                  </span>
                ))}
              </div>
            )}

            {/* Tech tags + explore */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {role.skills?.slice(0, 4).map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
              <button
                onClick={() => ask(`Tell me more about Kyle's work at ${org.name}.`)}
                className="ml-1 text-xs font-medium text-accent transition-colors hover:text-accent-hover"
              >
                Ask AI →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Animated scale number (count-up on scroll reveal) ────────────────────────

function AnimatedScale({ value, display, label }: { value: number; display: string; label: string }) {
  const animated = useCountUp(value, 1800, true);
  const shown = value >= 1_000_000 ? `${(animated / 1_000_000).toFixed(0)}M` : value >= 1000 ? `${(animated / 1000).toFixed(0)}K` : animated.toString();

  return (
    <div className="mb-4">
      <div className="font-mono text-4xl font-bold tracking-tight text-accent sm:text-5xl">
        {shown}
      </div>
      <div className="mt-1 text-xs text-text-tertiary">{label}</div>
    </div>
  );
}
