"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaArrowUpRightFromSquare, FaArrowRightLong } from "react-icons/fa6";
import {
  useWorkGraph,
  repoCapabilities,
  CAPABILITY_LABEL,
  CAPABILITY_ORDER,
  REPO_NPM,
  type Capability,
} from "@/context/WorkGraphContext";
import { compact, sparkline, timeAgo, fetchDownloads, type TermRepo } from "@/lib/terminal";
import SectionHeader from "./ui/SectionHeader";
import Reveal from "./ui/Reveal";

/**
 * WorkGraph — the heart of the site: projects, stars, downloads and activity as
 * ONE interconnected, live, explorable dataset (not three stacked sections).
 *
 * Hover a number in the hero → the repos that compose it light up here. Filter
 * by capability → the same data narrows (it doesn't reset). Click a project →
 * it opens with its live download trend, links, and questions that hand the
 * thread to the AI panel. Every figure is fetched live; the visitor can always
 * trace it back to GitHub / npm.
 */
export default function WorkGraph() {
  const { projects, loading, capability, setCapability, isHighlighted, highlight } = useWorkGraph();

  const counts = CAPABILITY_ORDER.map((c) => ({
    c,
    n: projects.filter((p) => repoCapabilities(p).includes(c)).length,
  })).filter((x) => x.n > 0);

  const shown = capability ? projects.filter((p) => repoCapabilities(p).includes(capability)) : projects;

  return (
    <div className="container-content">
      <SectionHeader
        index="01"
        eyebrow="The work · live"
        title="Everything here is real, and connected"
        description="Open-source projects, their live stars and downloads, and what shipped lately — one dataset. Hover a number in the proof board; filter by what I build; open a project to trace it to source."
      />

      {/* capability filter — narrows the same graph */}
      <Reveal delay={0.05}>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <FilterChip active={capability === null} onClick={() => setCapability(null)} label="All" n={projects.length} />
          {counts.map(({ c, n }) => (
            <FilterChip key={c} active={capability === c} onClick={() => setCapability(c)} label={CAPABILITY_LABEL[c]} n={n} />
          ))}
        </div>
      </Reveal>

      {/* the graph */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {loading && projects.length === 0
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : shown.map((p) => (
              <ProjectNode key={p.repo} repo={p} dimmed={highlight !== null && !isHighlighted(p)} lit={highlight !== null && isHighlighted(p)} />
            ))}
      </div>

      {!loading && shown.length === 0 && (
        <p className="mt-8 text-sm text-text-tertiary">No projects match that filter yet.</p>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, label, n }: { active: boolean; onClick: () => void; label: string; n: number }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-accent bg-accent text-white"
          : "border-border bg-surface text-text-secondary hover:border-accent hover:text-text-primary"
      }`}
    >
      {label}
      <span className={`font-mono text-[10px] ${active ? "text-white/70" : "text-text-tertiary"}`}>{n}</span>
    </button>
  );
}

function ProjectNode({ repo, dimmed, lit }: { repo: TermRepo; dimmed: boolean; lit: boolean }) {
  const { selected, setSelected, ask } = useWorkGraph();
  const open = selected === repo.repo;
  const caps = repoCapabilities(repo);
  const npm = REPO_NPM[repo.name];

  // live 30-day download trend, fetched lazily when the card opens
  const [spark, setSpark] = useState<{ s: string; total: number } | null>(null);
  useEffect(() => {
    if (!open || !npm || spark) return;
    let alive = true;
    fetchDownloads(npm)
      .then((d) => { if (alive) setSpark({ s: sparkline(d.series.map((x) => x.downloads)), total: d.total }); })
      .catch(() => {});
    return () => { alive = false; };
  }, [open, npm, spark]);

  return (
    <motion.div
      layout
      animate={{ opacity: dimmed ? 0.4 : 1 }}
      transition={{ duration: 0.25 }}
      className={`card flex flex-col p-4 transition-shadow ${open ? "sm:col-span-2 lg:col-span-3" : ""} ${
        lit ? "ring-1 ring-accent shadow-lg shadow-accent/5" : ""
      }`}
    >
      <button
        onClick={() => setSelected(open ? null : repo.repo)}
        aria-expanded={open}
        aria-label={`${repo.name} — ${open ? "collapse" : "expand"} details`}
        className="flex items-start justify-between gap-3 rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-mono text-sm font-semibold text-text-primary">{repo.name}</span>
            {/pdf-reader-mcp/i.test(repo.name) && (
              <span className="rounded bg-accent-subtle px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-accent">flagship</span>
            )}
          </div>
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-text-secondary">{repo.description}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-sm font-semibold tabular-nums text-text-primary">{compact(repo.stars)}★</div>
          {repo.language && <div className="mt-0.5 text-[10.5px] text-text-tertiary">{repo.language}</div>}
        </div>
      </button>

      {/* compact footer always visible */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {caps.map((c) => (
          <span key={c} className="rounded border border-border-subtle px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary">
            {CAPABILITY_LABEL[c]}
          </span>
        ))}
        <span className="ml-auto font-mono text-[10.5px] text-text-tertiary">{timeAgo(repo.pushedAt)}</span>
      </div>

      {/* expanded detail — live trend, links, hand-off to AI */}
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 border-t border-border-subtle pt-4"
        >
          <div className="grid gap-5 sm:grid-cols-[1.4fr_1fr]">
            <div>
              {npm ? (
                <div>
                  <div className="font-mono text-[11px] text-text-tertiary">npm · last 30 days</div>
                  <div className="mt-1.5 flex items-baseline gap-3">
                    <span className="font-mono text-lg text-accent">{spark?.s ?? "▁▁▁▁▁▁▁▁▁▁"}</span>
                    <span className="font-mono text-sm text-text-primary">{spark ? `${compact(spark.total)} dl` : "…"}</span>
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-text-tertiary">{npm}</div>
                </div>
              ) : (
                <div className="font-mono text-[11px] text-text-tertiary">No npm package — source-only project.</div>
              )}

              {repo.topics.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {repo.topics.slice(0, 8).map((t) => (
                    <span key={t} className="rounded border border-border-subtle px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary">{t}</span>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[12px] text-text-secondary transition-colors hover:text-accent">
                  <FaGithub className="h-3.5 w-3.5" /> {repo.repo}
                </a>
                {repo.homepage && (
                  <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[12px] text-text-secondary transition-colors hover:text-accent">
                    <FaArrowUpRightFromSquare className="h-3 w-3" /> site
                  </a>
                )}
              </div>
            </div>

            {/* hand the thread to the AI navigator */}
            <div className="rounded-lg border border-border-subtle bg-surface-sunken/40 p-3.5">
              <div className="font-mono text-[10.5px] uppercase tracking-wide text-text-tertiary">Ask about this</div>
              <div className="mt-2 flex flex-col gap-1.5">
                {[
                  `Why does ${repo.name} matter?`,
                  `How is ${repo.name} used in production?`,
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => ask(q)}
                    className="group flex items-center justify-between gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 text-left text-[12px] text-text-secondary transition-colors hover:border-accent hover:text-text-primary"
                  >
                    {q}
                    <FaArrowRightLong className="h-3 w-3 shrink-0 text-text-tertiary group-hover:text-accent" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="card animate-pulse p-4">
      <div className="h-4 w-1/2 rounded bg-surface-sunken" />
      <div className="mt-3 h-3 w-full rounded bg-surface-sunken" />
      <div className="mt-2 h-3 w-2/3 rounded bg-surface-sunken" />
      <div className="mt-4 h-3 w-1/3 rounded bg-surface-sunken" />
    </div>
  );
}
