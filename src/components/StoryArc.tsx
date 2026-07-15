"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useWorkGraph } from "@/context/WorkGraphContext";
import { formatNumber } from "@/data";
import { getOrganization } from "@/data/organizations";
import { PROJECTS } from "@/data/projects";
import { calculateTotalExperience, getRolesSortedByDate } from "@/data/roles";
import type { Role } from "@/data/types";
import { useCountUp } from "@/hooks/useCountUp";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

/**
 * StoryArc — career timeline with brand-related ambient art fused into each card.
 * Art is a background wash (masked), not a separate framed photo grid.
 */

interface EraChapter {
  role: Role;
  era: string;
  startYear: string;
  headline: string;
  image: string;
  imageAlt: string;
  scaleNumber?: { value: number; label: string; display: string };
  projects?: string[];
}

function eraProjects(orgId: string): string[] {
  return PROJECTS.filter((p) => p.organizationId === orgId)
    .sort((a, b) => (b.details?.length ?? 0) - (a.details?.length ?? 0))
    .slice(0, 4)
    .map((p) => p.title);
}

const ERA_META: Record<
  string,
  { era: string; headline: string; image: string; imageAlt: string }
> = {
  "nakuz-cto": {
    era: "Web · Community",
    headline: "Hong Kong's gaming portal",
    image: "/art/era-web.jpg",
    imageAlt: "Ambient visual derived from Nakuz brand and portal materials",
  },
  "minimax-ceo": {
    era: "Social Gaming",
    headline: "Facebook games at 10M scale",
    image: "/art/era-social.jpg",
    imageAlt: "Ambient visual derived from MiniMax / Funimax social games",
  },
  "cubeage-founder": {
    era: "Mobile Gaming",
    headline: "25+ games, 10M downloads",
    image: "/art/era-mobile.jpg",
    imageAlt: "Ambient visual derived from Cubeage mobile game products",
  },
  "epiow-cto": {
    era: "Consultancy",
    headline: "Building for clients",
    image: "/art/era-consulting.jpg",
    imageAlt: "Ambient visual derived from Epiow brand mark and product identity",
  },
  "sylphx-founder": {
    era: "AI · Open Source",
    headline: "The infrastructure AI agents run on",
    image: "/art/era-ai.jpg",
    imageAlt: "Ambient visual derived from Sylphx brand mark and AI platform identity",
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
  const reduce = useReducedMotion();
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
        image: meta.image,
        imageAlt: meta.imageAlt,
        scaleNumber: getScaleNumber(role),
        projects: eraProjects(role.organizationId),
      };
    })
    .filter(Boolean) as EraChapter[];

  return (
    <div className="container-wide">
      <SectionHeader
        index="01"
        eyebrow="The journey"
        title="Twenty years. Five eras. One builder."
        description="From a Hong Kong gaming forum in 2006 to AI infrastructure today — every chapter proved Kyle can ship and scale."
      />

      <Reveal delay={0.08}>
        <div className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-2 font-mono text-[11px] text-text-tertiary">
          {chapters.map((ch, i) => (
            <span key={ch.role.id} className="flex items-center gap-2.5">
              {i > 0 && <span className="text-border">→</span>}
              <span className="text-text-secondary">{ch.startYear}</span>
              <span>{ch.era.split(" · ")[0]}</span>
            </span>
          ))}
        </div>
      </Reveal>

      <ol className="relative mt-12 space-y-6 sm:space-y-7">
        <div
          aria-hidden
          className="absolute bottom-6 left-[1.15rem] top-6 hidden w-px bg-gradient-to-b from-accent/40 via-border to-border sm:block"
        />

        {chapters.map((ch, i) => (
          <EraCard
            key={ch.role.id}
            chapter={ch}
            index={i}
            reduce={!!reduce}
            ask={ask}
          />
        ))}
      </ol>

      <Reveal>
        <div className="mt-14 flex flex-col items-center gap-1.5 py-8 text-center">
          <div className="font-display text-4xl font-semibold tracking-tight text-accent sm:text-5xl">
            {years}+
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-text-tertiary">
            years of building
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function EraCard({
  chapter,
  index,
  reduce,
  ask,
}: {
  chapter: EraChapter;
  index: number;
  reduce: boolean;
  ask: (q: string) => void;
}) {
  const { role, era, startYear, headline, scaleNumber, image, imageAlt } =
    chapter;
  const org = getOrganization(role.organizationId);
  if (!org) return null;
  const isCurrent = !role.period.end;

  return (
    <motion.li
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.03 }}
      className="relative list-none sm:pl-12"
    >
      <span
        aria-hidden
        className="absolute left-[0.85rem] top-10 hidden h-2.5 w-2.5 rounded-full border-2 border-accent bg-background sm:block"
      />

      <article className="card group relative overflow-hidden transition-shadow duration-300 hover:shadow-md">
        {/* Fused ambient art — full card backdrop, not a photo cell */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Image
            src={image}
            alt=""
            fill
            className="object-cover object-center opacity-[0.55] transition-transform duration-700 group-hover:scale-[1.03] dark:opacity-45"
            sizes="(max-width: 1024px) 100vw, 960px"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/92 to-surface/55 dark:from-surface dark:via-surface/90 dark:to-surface/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface/30" />
        </div>

        <div className="relative z-[1] max-w-2xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-sm font-semibold tabular-nums text-accent">
              {startYear}
            </span>
            <span className="eyebrow !mb-0">{era}</span>
            {isCurrent && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-positive-subtle px-2 py-0.5 text-[10px] font-medium text-positive">
                <span className="h-1.5 w-1.5 rounded-full bg-positive" /> Now
              </span>
            )}
          </div>

          {scaleNumber && (
            <AnimatedScale value={scaleNumber.value} label={scaleNumber.label} />
          )}

          <h3 className="mt-3 text-h2 text-text-primary">{headline}</h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="font-semibold text-text-secondary">{org.name}</span>
            <span className="font-mono text-[11px] text-text-tertiary">
              {role.title}
            </span>
            {role.location && (
              <span className="font-mono text-[11px] text-text-tertiary">
                · {role.location}
              </span>
            )}
          </div>

          <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-text-secondary">
            {role.description}.
          </p>

          {role.keyAchievements && role.keyAchievements.length > 0 && (
            <ul className="mt-4 space-y-1.5">
              {role.keyAchievements.slice(0, 3).map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-2 text-sm text-text-secondary"
                >
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {a}
                </li>
              ))}
            </ul>
          )}

          {chapter.projects && chapter.projects.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {chapter.projects.map((proj) => (
                <span
                  key={proj}
                  className="rounded-md border border-border/70 bg-surface/70 px-2 py-0.5 text-[11px] font-medium text-text-secondary backdrop-blur-sm"
                >
                  {proj}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {role.skills?.slice(0, 4).map((s) => (
              <span key={s} className="chip bg-surface/70 backdrop-blur-sm">
                {s}
              </span>
            ))}
            <button
              type="button"
              onClick={() =>
                ask(`Tell me more about Kyle's work at ${org.name}.`)
              }
              className="ml-0.5 text-xs font-medium text-accent transition-colors hover:text-accent-hover"
            >
              Ask AI →
            </button>
          </div>
        </div>
        {/* decorative alt for a11y — art is purely ambient */}
        <span className="sr-only">{imageAlt}</span>
      </article>
    </motion.li>
  );
}

function AnimatedScale({ value, label }: { value: number; label: string }) {
  const animated = useCountUp(value, 1400, true);
  const shown =
    value >= 1_000_000
      ? `${(animated / 1_000_000).toFixed(0)}M`
      : value >= 1000
        ? `${(animated / 1000).toFixed(0)}K`
        : animated.toString();

  return (
    <div className="mt-3">
      <div className="font-mono text-2xl font-semibold tracking-tight text-accent sm:text-3xl">
        {shown}
      </div>
      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary">
        {label}
      </div>
    </div>
  );
}
