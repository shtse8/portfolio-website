"use client";

import Link from "next/link";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import type { Metric } from "@/data";
import { formatNumber, formatPeriod } from "@/data";
import {
  calculateTotalExperience,
  getRolesSortedByDate,
} from "@/data/roles";
import { getOrganization } from "@/data/organizations";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

/** Era tag per role — the four chapters of one builder's arc. */
const ERA: Record<string, string> = {
  "sylphx-founder": "AI · Open Source",
  "epiow-cto": "Consultancy",
  "cubeage-founder": "Mobile Gaming",
  "minimax-ceo": "Social Gaming",
  "nakuz-cto": "Web · Community",
};

const METRIC_LABEL: Record<Metric["type"], string> = {
  users: "Users",
  downloads: "Downloads",
  stars: "GitHub Stars",
  revenue: "Revenue",
  engagement: "Engagement",
  projects: "Projects",
  partners: "Partners",
  custom: "",
};

/** Compact, honest value straight from the data ("10M", "500K", "UK"). */
function metricValue(metric: Metric): string {
  return typeof metric.value === "number"
    ? formatNumber(metric.value)
    : String(metric.value);
}

/** Human label, preferring explicit label/unit, then a context-aware fallback. */
function metricLabel(metric: Metric): string {
  if (metric.label) return metric.label;
  if (metric.unit) return metric.unit;
  const base = METRIC_LABEL[metric.type] || metric.type;
  if (metric.context && metric.context !== "total") {
    const ctx = metric.context[0].toUpperCase() + metric.context.slice(1);
    return `${ctx} ${base}`;
  }
  return base;
}

export default function Experience() {
  const roles = getRolesSortedByDate();
  const years = calculateTotalExperience();

  return (
    <div className="container-content">
      <SectionHeader
        index="03"
        eyebrow="Experience"
        title="Twenty years of shipping at scale"
        description="Five companies across four eras — from a Hong Kong gaming forum to social and mobile platforms with 10M+ users, now open-source AI tooling."
      />

      {/* Honest summary, all derived from the data */}
      <Reveal delay={0.15}>
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-sm text-text-tertiary">
          <span>
            <strong className="font-semibold text-text-primary">{years}</strong> years building
          </span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-border" />
          <span>
            <strong className="font-semibold text-text-primary">{roles.length}</strong> companies
          </span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-border" />
          <span>
            Teams across <strong className="font-semibold text-text-primary">HK &amp; UK</strong>
          </span>
        </div>
      </Reveal>

      {/* Career-arc timeline — newest first, single left rail */}
      <ol className="mt-14">
        {roles.map((role, i) => {
          const org = getOrganization(role.organizationId);
          if (!org) return null;

          const isCurrent = !role.period.end;
          const isLast = i === roles.length - 1;
          const era = ERA[role.id];

          return (
            <li key={role.id} className="relative pl-10 pb-10 last:pb-0 sm:pl-14">
              {/* Rail connector (skip on last) */}
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute left-2 top-7 bottom-0 w-px -translate-x-1/2 bg-border sm:top-8"
                />
              )}

              {/* Node */}
              <span
                aria-hidden
                className="absolute left-0 top-6 z-10 flex h-4 w-4 items-center justify-center sm:top-7"
              >
                {isCurrent ? (
                  <>
                    <span className="absolute h-4 w-4 rounded-full bg-accent/20" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-background" />
                  </>
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full border-2 border-text-tertiary bg-background ring-4 ring-background" />
                )}
              </span>

              <Reveal delay={Math.min(i, 4) * 0.06}>
                <article className="card card-hover group p-6 sm:p-7">
                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    {era && <span className="eyebrow">{era}</span>}
                    <span aria-hidden className="h-1 w-1 rounded-full bg-border" />
                    <span className="font-mono text-xs text-text-tertiary">
                      {formatPeriod(role.period)}
                    </span>
                    {isCurrent && (
                      <span className="badge">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        Now
                      </span>
                    )}
                  </div>

                  {/* Title + link */}
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-h3 text-text-primary">{org.name}</h3>
                      <p className="mt-1 font-mono text-sm text-text-secondary">
                        {role.title}
                        {role.location ? ` · ${role.location}` : ""}
                      </p>
                    </div>
                    {role.liveUrl && (
                      <Link
                        href={role.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${org.name}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-text-secondary transition-colors group-hover:border-accent group-hover:text-accent"
                      >
                        <FaArrowUpRightFromSquare className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>

                  <p className="mt-4 text-text-secondary">{role.description}.</p>

                  {/* Strongest achievements */}
                  {role.keyAchievements && role.keyAchievements.length > 0 && (
                    <ul className="mt-5 space-y-2">
                      {role.keyAchievements.slice(0, 3).map((a) => (
                        <li
                          key={a}
                          className="flex items-start gap-2.5 text-sm text-text-secondary"
                        >
                          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Metric stat tiles */}
                  {role.metrics.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                      {role.metrics.map((m, idx) => (
                        <div
                          key={`${role.id}-${idx}`}
                          className="rounded-xl border border-border-subtle bg-surface-sunken px-3.5 py-2.5"
                        >
                          <span className="block font-mono text-lg font-semibold leading-none tracking-tight text-text-primary">
                            {metricValue(m)}
                          </span>
                          <span className="mt-1.5 block text-[11px] leading-tight text-text-tertiary">
                            {metricLabel(m)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech */}
                  {role.skills && role.skills.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {role.skills.slice(0, 5).map((s) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
