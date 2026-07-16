"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { FaArrowUpRightFromSquare, FaGithub, FaXmark } from "react-icons/fa6";
import { useWorkGraph } from "@/context/WorkGraphContext";
import { formatNumber } from "@/data";
import { getOrganization, ORGANIZATIONS } from "@/data/organizations";
import { PROJECTS } from "@/data/projects";
import {
  calculateTotalExperience,
  getRole,
  getRolesByOrganization,
  getRolesSortedByDate,
} from "@/data/roles";
import type { Organization, Role } from "@/data/types";
import { useCountUp } from "@/hooks/useCountUp";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

/**
 * StoryArc — career timeline. Company logos + real brand marks (no AI art).
 * Click company name / logo for a detail modal.
 */

interface EraChapter {
  role: Role;
  era: string;
  startYear: string;
  headline: string;
  scaleNumber?: { value: number; label: string; display: string };
  projects?: string[];
}

function eraProjects(roleId: string, orgId: string): string[] {
  return PROJECTS.filter((p) => {
    if (p.roleId === roleId) return true;
    if (p.organizationId === orgId) return true;
    if (p.roleId) {
      const role = getRole(p.roleId);
      return role?.organizationId === orgId;
    }
    return false;
  })
    .sort((a, b) => (b.details?.length ?? 0) - (a.details?.length ?? 0))
    .slice(0, 5)
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
  const reduce = useReducedMotion();
  const roles = getRolesSortedByDate();
  const years = calculateTotalExperience();
  const { ask } = useWorkGraph();
  const [orgId, setOrgId] = useState<string | null>(null);

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
        projects: eraProjects(role.id, role.organizationId),
      };
    })
    .filter(Boolean) as EraChapter[];

  const selectedOrg = orgId ? ORGANIZATIONS[orgId] : null;

  useEffect(() => {
    if (!selectedOrg) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOrgId(null);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("modal-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("modal-open");
    };
  }, [selectedOrg]);

  return (
    <div className="container-wide">
      <SectionHeader
        index="01"
        eyebrow="The journey"
        title="Twenty years. Five eras. One builder."
        description="From a Hong Kong gaming forum in 2006 to AI infrastructure today — click a company logo for details."
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

      <ol className="relative mt-12 space-y-5 sm:space-y-6">
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
            onOpenCompany={(id) => setOrgId(id)}
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

      <AnimatePresence>
        {selectedOrg && (
          <CompanyDetailModal
            org={selectedOrg}
            onClose={() => setOrgId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EraCard({
  chapter,
  index,
  reduce,
  ask,
  onOpenCompany,
}: {
  chapter: EraChapter;
  index: number;
  reduce: boolean;
  ask: (q: string) => void;
  onOpenCompany: (orgId: string) => void;
}) {
  const { role, era, startYear, headline, scaleNumber } = chapter;
  const org = getOrganization(role.organizationId);
  if (!org) return null;
  const isCurrent = !role.period.end;

  return (
    <motion.li
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.03 }}
      className="relative list-none sm:pl-12"
    >
      <span
        aria-hidden
        className="absolute left-[0.85rem] top-10 hidden h-2.5 w-2.5 rounded-full border-2 border-accent bg-background sm:block"
      />

      <article className="card overflow-hidden">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:gap-6 sm:p-7">
          {/* Real company logo — clickable */}
          <button
            type="button"
            onClick={() => onOpenCompany(org.id)}
            className="group flex shrink-0 flex-col items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-accent/50 sm:w-28"
            aria-label={`Open ${org.name} details`}
          >
            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface-sunken transition-shadow group-hover:shadow-md sm:h-20 sm:w-20">
              <Image
                src={org.logo}
                alt={`${org.name} logo`}
                width={80}
                height={80}
                className="h-full w-full object-contain p-2"
              />
            </div>
            <span className="text-center text-xs font-medium text-text-secondary group-hover:text-accent">
              {org.name}
            </span>
          </button>

          <div className="min-w-0 flex-1">
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
              <AnimatedScale
                value={scaleNumber.value}
                label={scaleNumber.label}
              />
            )}

            <h3 className="mt-2 text-h2 text-text-primary">{headline}</h3>

            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <button
                type="button"
                onClick={() => onOpenCompany(org.id)}
                className="font-semibold text-text-secondary underline-offset-2 hover:text-accent hover:underline"
              >
                {org.name}
              </button>
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
                    className="rounded-md border border-border-subtle bg-surface-sunken/60 px-2 py-0.5 text-[11px] font-medium text-text-secondary"
                  >
                    {proj}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2">
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
                className="ml-0.5 text-xs font-medium text-accent transition-colors hover:text-accent-hover"
              >
                Ask AI →
              </button>
            </div>
          </div>
        </div>
      </article>
    </motion.li>
  );
}

function CompanyDetailModal({
  org,
  onClose,
}: {
  org: Organization;
  onClose: () => void;
}) {
  const titleId = useId();
  const roles = getRolesByOrganization(org.id);
  const related = PROJECTS.filter((p) => {
    if (p.organizationId === org.id) return true;
    if (p.roleId) return getRole(p.roleId)?.organizationId === org.id;
    return false;
  }).slice(0, 14);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-background/75 backdrop-blur-md"
        aria-label="Close company detail"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="relative z-[1] max-h-[min(90svh,720px)] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-surface p-6 shadow-lg sm:rounded-3xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-secondary hover:text-text-primary"
          aria-label="Close"
        >
          <FaXmark className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4 pr-10">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface-sunken">
            <Image
              src={org.logo}
              alt={`${org.name} logo`}
              width={64}
              height={64}
              className="h-full w-full object-contain p-1.5"
            />
          </div>
          <div>
            <h3
              id={titleId}
              className="font-display text-2xl font-semibold text-text-primary"
            >
              {org.name}
            </h3>
            {org.legalName && (
              <p className="text-sm text-text-tertiary">{org.legalName}</p>
            )}
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-text-tertiary">
              {org.status}
              {org.founded ? ` · ${org.founded.slice(0, 4)}` : ""}
              {org.location ? ` · ${org.location}` : ""}
            </p>
          </div>
        </div>

        <p className="mt-5 text-[15px] leading-relaxed text-text-secondary">
          {org.description}
        </p>

        {roles.length > 0 && (
          <div className="mt-5">
            <div className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
              Roles
            </div>
            <ul className="mt-2 space-y-1">
              {roles.map((r) => (
                <li key={r.id} className="text-sm text-text-secondary">
                  <span className="font-medium text-text-primary">{r.title}</span>
                  {r.period?.start && (
                    <span className="text-text-tertiary">
                      {" "}
                      · {r.period.start.slice(0, 4)}
                      {r.period.end ? `–${r.period.end.slice(0, 4)}` : "–now"}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-5">
            <div className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
              Related products ({related.length})
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {related.map((p) => (
                <span
                  key={p.id}
                  className="rounded-md border border-border-subtle bg-surface-sunken/50 px-2 py-0.5 text-[11px] text-text-secondary"
                >
                  {p.title}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {org.website && (
            <a
              href={org.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover"
            >
              <FaArrowUpRightFromSquare className="h-3 w-3" /> Website
            </a>
          )}
          {org.github && (
            <a
              href={`https://github.com/${org.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover"
            >
              <FaGithub className="h-3.5 w-3.5" /> github.com/{org.github}
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
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
