"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { FaArrowRight, FaBolt, FaGithub } from "react-icons/fa6";
import { useNavigationStore } from "@/context/NavigationContext";
import { type HighlightKind, useWorkGraph } from "@/context/WorkGraphContext";
import { PERSONAL_INFO } from "@/data/personal";
import { useCountUp } from "@/hooks/useCountUp";
import { STATS } from "@/lib/stats";
import { compact, timeAgo } from "@/lib/terminal";
import LiveTicker from "./LiveTicker";

/**
 * Hero — content-first with full-bleed ambient art that dissolves into the page.
 * Art is background atmosphere (masked), never a framed thumbnail box.
 */
export default function Hero() {
  const reduce = useReducedMotion();
  const {
    stats,
    recent,
    live,
    loading,
    setHighlight,
    flashHighlight,
    setSelected,
  } = useWorkGraph();
  const navigate = useNavigationStore((s) => s.navigateToSection);

  const rise = (delay: number, y = 14) =>
    reduce
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.25, delay },
        }
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.5,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  const stars = stats ? compact(stats.githubStars) : "~990";
  const downloads = stats ? compact(stats.npmDownloads) : "27K+";
  const flagStars = stats ? compact(stats.flagshipStars) : "800+";
  const flagDl = stats ? compact(stats.flagshipDownloads) : "24K+";
  const lastShip = recent[0];
  const liveLabel = loading ? "loading" : live ? "live" : "cached";

  function jump(highlight: HighlightKind) {
    setSelected(null);
    flashHighlight(highlight);
    navigate("work");
  }

  return (
    <section
      data-design="signal-craft"
      className="relative flex min-h-[min(100svh,880px)] items-center overflow-hidden"
    >
      {/* Full-bleed ambient art — fused into the canvas */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/art/hero-infra.jpg"
          alt=""
          fill
          priority
          className="object-cover object-[70%_center] opacity-90 dark:opacity-80"
          sizes="100vw"
        />
        {/* Readability washes — blend art into background tokens */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/25 sm:via-background/85 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        <div className="absolute inset-0 bg-background/20 dark:bg-background/35" />
      </div>

      <div className="container-wide relative z-[1] grid w-full items-center gap-10 px-5 py-24 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
        <div className="max-w-xl">
          <motion.div
            {...rise(0.02)}
            className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-positive/30 bg-positive-subtle/90 px-3 py-1 text-xs font-medium text-positive backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-positive animate-ping-soft" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-positive" />
              </span>
              Open to new ventures
            </span>
            <span className="eyebrow">{PERSONAL_INFO.location.base}</span>
          </motion.div>

          <motion.div
            {...rise(0.05)}
            className="mb-3 font-mono text-sm text-text-secondary"
          >
            <span className="font-semibold text-text-primary">
              {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}
            </span>
            <span className="mx-2 text-text-tertiary">·</span>
            <span className="text-text-tertiary">AI infrastructure engineer</span>
          </motion.div>

          <motion.h1 {...rise(0.08)} className="text-display text-text-primary">
            I build the infrastructure{" "}
            <span className="text-accent">AI agents</span> run on.
          </motion.h1>

          <motion.p
            {...rise(0.12)}
            className="mt-5 text-[15px] leading-relaxed text-text-secondary sm:text-base"
          >
            Open-source MCP servers and AI-native developer tools, plus{" "}
            <strong className="font-semibold text-text-primary">Sylphx</strong> —
            an AI-native PaaS with its own AI Gateway. Twenty years shipping
            before this; 10M+ app downloads at a Hong Kong gaming studio.
          </motion.p>

          <motion.div {...rise(0.16)} className="mt-5">
            <LiveTicker />
          </motion.div>

          <motion.div
            {...rise(0.2)}
            className="mt-7 flex flex-wrap items-center gap-2.5"
          >
            <button
              type="button"
              onClick={() => jump("stars")}
              className="btn-primary btn-lg"
            >
              Explore the work <FaArrowRight className="h-3.5 w-3.5" />
            </button>
            <a
              href={PERSONAL_INFO.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-lg backdrop-blur-sm"
            >
              <FaGithub className="h-[18px] w-[18px]" /> GitHub
            </a>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-agent"))}
              className="btn-ghost btn-lg"
            >
              <FaBolt className="h-3.5 w-3.5 text-accent" /> Ask my AI
            </button>
            <button
              type="button"
              onClick={() => navigate("contact")}
              className="btn-ghost btn-lg"
            >
              Get in touch
            </button>
          </motion.div>
        </div>

        {/* Proof board floats in the atmospheric field — no art thumbnail */}
        <motion.div {...rise(0.14, 18)} className="lg:justify-self-end">
          <div className="card w-full max-w-md overflow-hidden border-border/80 bg-surface/80 shadow-md backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2.5">
              <span className="font-mono text-[11px] text-text-tertiary">
                live · from GitHub &amp; npm
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-text-tertiary">
                <span className="relative flex h-1.5 w-1.5">
                  {live && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-positive animate-ping-soft" />
                  )}
                  <span
                    className={`relative inline-flex h-1.5 w-1.5 rounded-full ${live ? "bg-positive" : "bg-text-tertiary"}`}
                  />
                </span>
                {liveLabel}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-px bg-border-subtle">
              <ProofNode
                label="GitHub stars"
                value={stars}
                suffix="★"
                kind="stars"
                hint="across all repos"
                onHover={setHighlight}
                onClick={jump}
                numeric={stats?.githubStars}
              />
              <ProofNode
                label="npm downloads"
                value={downloads}
                suffix="/mo"
                kind="downloads"
                hint="across packages"
                onHover={setHighlight}
                onClick={jump}
                numeric={stats?.npmDownloads}
              />
              <ProofNode
                label="pdf-reader-mcp"
                value={flagStars}
                suffix="★"
                kind="flagship"
                hint={`${flagDl}/mo · the flagship`}
                onHover={setHighlight}
                onClick={jump}
                wide
                numeric={stats?.flagshipStars}
              />
            </div>

            <button
              type="button"
              onClick={() => jump("stars")}
              className="flex w-full items-center gap-2 border-t border-border-subtle px-4 py-3 text-left transition-colors hover:bg-surface-sunken/50"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent/60 animate-ping-soft" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="truncate font-mono text-[12px] text-text-secondary">
                {lastShip ? (
                  <>
                    shipped{" "}
                    <span className="text-text-primary">{lastShip.name}</span> ·{" "}
                    {timeAgo(lastShip.pushedAt)}
                  </>
                ) : (
                  <>
                    actively shipping —{" "}
                    {STATS.yearsExperience?.display ?? "20+"} years building
                  </>
                )}
              </span>
            </button>
          </div>
          <p className="mt-3 px-1 text-center font-mono text-[11px] text-text-tertiary lg:text-right">
            Hover a number to see what it&apos;s made of.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ProofNode({
  label,
  value,
  suffix,
  kind,
  hint,
  onHover,
  onClick,
  wide,
  numeric,
}: {
  label: string;
  value: string;
  suffix: string;
  kind: HighlightKind;
  hint: string;
  onHover: (h: HighlightKind) => void;
  onClick: (h: HighlightKind) => void;
  wide?: boolean;
  numeric?: number;
}) {
  const animated = useCountUp(numeric ?? 0, 1400, true);
  const display = numeric ? animated.toLocaleString() : value;
  return (
    <button
      type="button"
      onMouseEnter={() => onHover(kind)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(kind)}
      onBlur={() => onHover(null)}
      onClick={() => onClick(kind)}
      className={`group bg-surface/70 px-4 py-4 text-left transition-colors hover:bg-accent-subtle/50 ${wide ? "col-span-2" : ""}`}
    >
      <div className="flex items-baseline gap-1 font-mono text-xl font-semibold tracking-tight text-text-primary tabular-nums transition-colors group-hover:text-accent sm:text-2xl">
        {display}
        <span className="text-sm text-text-tertiary group-hover:text-accent">
          {suffix}
        </span>
      </div>
      <div className="mt-1 text-xs text-text-tertiary">{label}</div>
      <div className="mt-0.5 font-mono text-[10.5px] text-text-tertiary/70 group-hover:text-text-secondary">
        {hint}
      </div>
    </button>
  );
}
