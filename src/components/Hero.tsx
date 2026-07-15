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
 * Hero — clear first impression, balanced type, live proof, related abstract art.
 * No forced theater chrome, no progress bars, no sticky holds.
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

  const rise = (delay: number, y = 16) =>
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
            duration: 0.55,
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
      className="relative flex min-h-[min(100svh,920px)] items-center overflow-hidden px-5 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-28"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-25 dark:opacity-30" />
        <div className="absolute -left-24 top-10 h-[42vh] w-[42vh] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute -right-16 bottom-0 h-[36vh] w-[36vh] rounded-full bg-accent/8 blur-[90px]" />
      </div>

      <div className="container-wide grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <motion.div
            {...rise(0.02)}
            className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-positive/30 bg-positive-subtle px-3 py-1 text-xs font-medium text-positive">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-positive animate-ping-soft" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-positive" />
              </span>
              Open to new ventures
            </span>
            <span className="eyebrow">{PERSONAL_INFO.location.base}</span>
          </motion.div>

          <motion.div
            {...rise(0.06)}
            className="mb-3 font-mono text-sm text-text-secondary"
          >
            <span className="font-semibold text-text-primary">
              {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}
            </span>
            <span className="mx-2 text-text-tertiary">·</span>
            <span className="text-text-tertiary">
              AI infrastructure engineer
            </span>
          </motion.div>

          <motion.h1
            {...rise(0.1)}
            className="text-display max-w-[18ch] text-text-primary"
          >
            I build the infrastructure{" "}
            <span className="text-accent">AI agents</span> run on.
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mt-5 max-w-xl text-[15px] leading-relaxed text-text-secondary sm:text-base"
          >
            Open-source MCP servers and AI-native developer tools, plus{" "}
            <strong className="font-semibold text-text-primary">Sylphx</strong>{" "}
            — an AI-native PaaS with its own AI Gateway. Twenty years shipping
            before this; 10M+ app downloads at a Hong Kong gaming studio.
          </motion.p>

          <motion.div {...rise(0.2)} className="mt-5">
            <LiveTicker />
          </motion.div>

          <motion.div
            {...rise(0.24)}
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
              className="btn-secondary btn-lg"
            >
              <FaGithub className="h-[18px] w-[18px]" /> GitHub
            </a>
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("open-agent"))
              }
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

        <motion.div
          {...rise(0.14, 20)}
          className="space-y-4 lg:justify-self-end"
        >
          {/* Related abstract art — AI infrastructure mesh */}
          <div className="art-frame aspect-[16/10] w-full max-w-lg shadow-md">
            <Image
              src="/art/hero-infra.jpg"
              alt="Abstract visualization of AI agent infrastructure as a luminous network of nodes"
              width={1280}
              height={800}
              priority
              className="h-full w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 520px"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent"
            />
          </div>

          {/* Live proof board */}
          <div className="card w-full max-w-lg overflow-hidden">
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
          <p className="px-1 text-center font-mono text-[11px] text-text-tertiary lg:text-right">
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
      className={`group bg-surface px-4 py-4 text-left transition-colors hover:bg-accent-subtle/40 ${wide ? "col-span-2" : ""}`}
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
