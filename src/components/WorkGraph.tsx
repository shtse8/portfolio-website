"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import {
  FaArrowRightLong,
  FaArrowUpRightFromSquare,
  FaGithub,
  FaXmark,
} from "react-icons/fa6";
import {
  CAPABILITY_LABEL,
  CAPABILITY_ORDER,
  REPO_NPM,
  repoCapabilities,
  useWorkGraph,
} from "@/context/WorkGraphContext";
import {
  catalogForRepoName,
  type ProjectCatalogEntry,
} from "@/data/project-catalog";
import {
  compact,
  fetchDownloads,
  sparkline,
  type TermRepo,
  timeAgo,
} from "@/lib/terminal";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

const SKELETON_CARD_KEYS = [
  "skeleton-card-1",
  "skeleton-card-2",
  "skeleton-card-3",
  "skeleton-card-4",
  "skeleton-card-5",
  "skeleton-card-6",
];

/**
 * WorkGraph — visual product grid with deep project detail.
 * Each open-source product has ambient art + a full intro panel on open.
 */
export default function WorkGraph() {
  const {
    projects,
    loading,
    capability,
    setCapability,
    isHighlighted,
    highlight,
    selected,
    setSelected,
  } = useWorkGraph();

  const counts = CAPABILITY_ORDER.map((c) => ({
    c,
    n: projects.filter((p) => repoCapabilities(p).includes(c)).length,
  })).filter((x) => x.n > 0);

  const shown = capability
    ? projects.filter((p) => repoCapabilities(p).includes(capability))
    : projects;

  const selectedRepo = selected
    ? (projects.find((p) => p.repo === selected) ?? null)
    : null;

  // Escape closes detail
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, setSelected]);

  // Lock body scroll while detail open
  useEffect(() => {
    if (!selected) return;
    const prev = document.documentElement.classList.contains("modal-open");
    document.documentElement.classList.add("modal-open");
    return () => {
      if (!prev) document.documentElement.classList.remove("modal-open");
    };
  }, [selected]);

  return (
    <div className="container-wide">
      <SectionHeader
        index="02"
        eyebrow="Open source · live"
        title="Tools with proof — open a product."
        description="Live GitHub stars and npm downloads. Click a card for a modal intro — the grid stays still; nothing reflows under you."
      />

      <Reveal delay={0.05}>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <FilterChip
            active={capability === null}
            onClick={() => setCapability(null)}
            label="All"
            n={projects.length}
          />
          {counts.map(({ c, n }) => (
            <FilterChip
              key={c}
              active={capability === c}
              onClick={() => setCapability(c)}
              label={CAPABILITY_LABEL[c]}
              n={n}
            />
          ))}
        </div>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading && projects.length === 0
          ? SKELETON_CARD_KEYS.map((key) => <SkeletonCard key={key} />)
          : shown.map((p, i) => (
              <ProjectCard
                key={p.repo}
                repo={p}
                index={i}
                dimmed={highlight !== null && !isHighlighted(p)}
                lit={highlight !== null && isHighlighted(p)}
                onOpen={() => setSelected(p.repo)}
              />
            ))}
      </div>

      {!loading && shown.length === 0 && (
        <p className="mt-8 text-sm text-text-tertiary">
          No projects match that filter yet.
        </p>
      )}

      <AnimatePresence>
        {selectedRepo && (
          <ProjectDetail
            repo={selectedRepo}
            catalog={catalogForRepoName(selectedRepo.name)}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  n,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  n: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-accent bg-accent text-accent-contrast"
          : "border-border bg-surface text-text-secondary hover:border-accent hover:text-text-primary"
      }`}
    >
      {label}
      <span
        className={`font-mono text-[10px] ${active ? "text-accent-contrast/70" : "text-text-tertiary"}`}
      >
        {n}
      </span>
    </button>
  );
}

function ProjectCard({
  repo,
  index,
  dimmed,
  lit,
  onOpen,
}: {
  repo: TermRepo;
  index: number;
  dimmed: boolean;
  lit: boolean;
  onOpen: () => void;
}) {
  const catalog = catalogForRepoName(repo.name);
  const caps = repoCapabilities(repo);
  const art = catalog?.art;
  const title = catalog?.title ?? repo.name;
  const tagline = catalog?.tagline ?? repo.description ?? "";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.24) }}
      animate={{ opacity: dimmed ? 0.45 : 1 }}
      className={`card group relative flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-md ${
        lit ? "ring-1 ring-accent" : ""
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex flex-1 flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60"
        aria-label={`Open ${title}`}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-sunken">
          {art ? (
            <Image
              src={art}
              alt=""
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-surface-sunken to-surface" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="truncate font-mono text-sm font-semibold text-text-primary drop-shadow-sm">
                  {title}
                </span>
                {catalog?.flagship && (
                  <span className="rounded bg-accent px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-accent-contrast">
                    flagship
                  </span>
                )}
              </div>
            </div>
            <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-text-primary">
              {compact(repo.stars)}★
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="line-clamp-2 text-[13px] leading-relaxed text-text-secondary">
            {tagline}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {caps.map((c) => (
              <span
                key={c}
                className="rounded border border-border-subtle px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary"
              >
                {CAPABILITY_LABEL[c]}
              </span>
            ))}
            <span className="ml-auto font-mono text-[10.5px] text-text-tertiary">
              {timeAgo(repo.pushedAt)}
            </span>
          </div>
          <div className="mt-3 font-mono text-[11px] font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
            Open product →
          </div>
        </div>
      </button>
    </motion.article>
  );
}

function ProjectDetail({
  repo,
  catalog,
  onClose,
}: {
  repo: TermRepo;
  catalog?: ProjectCatalogEntry;
  onClose: () => void;
}) {
  const { ask } = useWorkGraph();
  const titleId = useId();
  const npm = catalog?.npm ?? REPO_NPM[repo.name];
  const [spark, setSpark] = useState<{ s: string; total: number } | null>(null);

  useEffect(() => {
    if (!npm) return;
    let alive = true;
    fetchDownloads(npm)
      .then((d) => {
        if (alive)
          setSpark({
            s: sparkline(d.series.map((x) => x.downloads)),
            total: d.total,
          });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [npm]);

  const title = catalog?.title ?? repo.name;
  const intro =
    catalog?.intro ??
    repo.description ??
    "Open-source work shipping in production.";
  const highlights = catalog?.highlights ?? [];
  const art = catalog?.art;

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
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
        aria-label="Close product detail"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[1] flex max-h-[min(92svh,880px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-border bg-surface shadow-lg sm:rounded-3xl"
      >
        {/* Hero art band */}
        <div className="relative h-44 shrink-0 overflow-hidden sm:h-52">
          {art ? (
            <Image
              src={art}
              alt={catalog?.artAlt ?? ""}
              fill
              className="object-cover"
              sizes="768px"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-surface-sunken to-surface" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-surface/80 text-text-secondary backdrop-blur-sm transition-colors hover:text-text-primary"
            aria-label="Close"
          >
            <FaXmark className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-1 sm:px-8 sm:pb-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  id={titleId}
                  className="font-display text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl"
                >
                  {title}
                </h3>
                {catalog?.flagship && (
                  <span className="rounded bg-accent-subtle px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent">
                    flagship
                  </span>
                )}
              </div>
              {catalog?.tagline && (
                <p className="mt-1 text-sm text-text-secondary">
                  {catalog.tagline}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="font-mono text-xl font-semibold tabular-nums text-text-primary">
                {compact(repo.stars)}★
              </div>
              {repo.language && (
                <div className="mt-0.5 font-mono text-[11px] text-text-tertiary">
                  {repo.language}
                </div>
              )}
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
            {intro}
          </p>

          {highlights.length > 0 && (
            <ul className="mt-5 space-y-2">
              {highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2.5 text-sm text-text-secondary"
                >
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border-subtle bg-surface-sunken/50 p-4">
              <div className="font-mono text-[10.5px] uppercase tracking-wide text-text-tertiary">
                npm · last 30 days
              </div>
              {npm ? (
                <>
                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="font-mono text-lg text-accent">
                      {spark?.s ?? "▁▁▁▁▁▁▁▁▁▁"}
                    </span>
                    <span className="font-mono text-sm text-text-primary">
                      {spark ? `${compact(spark.total)} dl` : "…"}
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-text-tertiary">
                    {npm}
                  </div>
                </>
              ) : (
                <p className="mt-2 text-sm text-text-tertiary">
                  Source-only project — no npm package.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-border-subtle bg-surface-sunken/50 p-4">
              <div className="font-mono text-[10.5px] uppercase tracking-wide text-text-tertiary">
                Links
              </div>
              <div className="mt-2 flex flex-col gap-2">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
                >
                  <FaGithub className="h-3.5 w-3.5" /> {repo.repo}
                </a>
                {(catalog?.docsUrl || repo.homepage) && (
                  <a
                    href={catalog?.docsUrl || repo.homepage || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
                  >
                    <FaArrowUpRightFromSquare className="h-3 w-3" />{" "}
                    {catalog?.docsUrl ? "npm / docs" : "homepage"}
                  </a>
                )}
                <div className="font-mono text-[10.5px] text-text-tertiary">
                  Updated {timeAgo(repo.pushedAt)}
                </div>
              </div>
            </div>
          </div>

          {repo.topics.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {repo.topics.slice(0, 12).map((t) => (
                <span
                  key={t}
                  className="rounded border border-border-subtle px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 rounded-xl border border-border bg-surface p-4">
            <div className="font-mono text-[10.5px] uppercase tracking-wide text-text-tertiary">
              Ask the AI about this product
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              {[
                `Why does ${title} matter?`,
                `How is ${repo.name} used in production?`,
                `What should I try first with ${repo.name}?`,
              ].map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => {
                    ask(q);
                    onClose();
                  }}
                  className="group flex items-center justify-between gap-2 rounded-lg border border-border-subtle bg-surface-sunken/40 px-3 py-2 text-left text-[13px] text-text-secondary transition-colors hover:border-accent hover:text-text-primary"
                >
                  {q}
                  <FaArrowRightLong className="h-3 w-3 shrink-0 text-text-tertiary group-hover:text-accent" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="card animate-pulse overflow-hidden">
      <div className="aspect-[16/10] bg-surface-sunken" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-2/3 rounded bg-surface-sunken" />
        <div className="h-3 w-full rounded bg-surface-sunken" />
        <div className="h-3 w-1/2 rounded bg-surface-sunken" />
      </div>
    </div>
  );
}
