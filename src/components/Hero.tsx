"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FaArrowRight, FaGithub, FaBolt } from "react-icons/fa6";
import { useCountUp } from "@/hooks/useCountUp";
import { PERSONAL_INFO } from "@/data/personal";
import { STATS } from "@/lib/stats";
import { useWorkGraph, type HighlightKind } from "@/context/WorkGraphContext";
import { compact, timeAgo } from "@/lib/terminal";
import { useNavigationStore } from "@/context/NavigationContext";

/**
 * Hero — a proof board, not a billboard.
 *
 * The positioning line is present but no longer eats the screen: the live proof
 * sits beside it with equal weight. Each number is a node — hover it and the
 * repos that compose it light up in the work graph below; click it and you jump
 * there. The visitor's first question ("credible? senior? active?") is answered
 * with evidence in the first glance.
 */
export default function Hero() {
  const reduce = useReducedMotion();
  const { stats, recent, live, loading, setHighlight, flashHighlight, setSelected } = useWorkGraph();
  const navigate = useNavigationStore((s) => s.navigateToSection);

  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3, delay } }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  // live values, with build-time fallbacks so the board is never empty
  const stars = stats ? compact(stats.githubStars) : "~990";
  const downloads = stats ? compact(stats.npmDownloads) : "27K+";
  const flagStars = stats ? compact(stats.flagshipStars) : "800+";
  const flagDl = stats ? compact(stats.flagshipDownloads) : "24K+";
  const lastShip = recent[0];

  function jump(highlight: HighlightKind) {
    setSelected(null);
    // carry the linkage into the work graph: the repos that compose this number
    // flash for a few seconds when you land (managed in the context, so the
    // navigation's mouse-leave can't clear it).
    flashHighlight(highlight);
    navigate("work");
  }

  const liveLabel = loading ? "loading" : live ? "live" : "cached";

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pt-24 pb-16 sm:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-30" />
        <motion.div
          className="absolute left-[10%] top-[-15%] h-[60vh] w-[60vh] rounded-full bg-accent/10 blur-[120px]"
          animate={reduce ? undefined : {
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[5%] top-[20%] h-[45vh] w-[45vh] rounded-full bg-accent/8 blur-[100px]"
          animate={reduce ? undefined : {
            x: [0, -25, 0],
            y: [0, 15, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="container-content grid w-full items-center gap-x-12 gap-y-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ── left: who + positioning + actions ── */}
        <div>
          <motion.div {...rise(0)} className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-positive/30 bg-positive-subtle px-3 py-1 text-xs font-medium text-positive">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-positive animate-ping-soft" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-positive" />
              </span>
              Open to new ventures
            </span>
            <span className="eyebrow">{PERSONAL_INFO.location.base}</span>
          </motion.div>

          <motion.div {...rise(0.05)} className="mb-3 font-mono text-sm text-text-secondary">
            <span className="font-semibold text-text-primary">{PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}</span>
            <span className="mx-2 text-text-tertiary">·</span>
            <span className="text-text-tertiary">AI infrastructure engineer</span>
          </motion.div>

          <motion.h1 {...rise(0.1)} className="max-w-[16ch] text-4xl font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-5xl">
            I build the infrastructure <span className="text-accent">AI agents</span> run on.
          </motion.h1>

          <motion.p {...rise(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary">
            Open-source MCP servers and AI-native developer tools, plus{" "}
            <strong className="font-semibold text-text-primary">Sylphx</strong> — an AI-native PaaS with its own
            AI Gateway. Twenty years shipping before this; 10M+ app downloads at a Hong Kong gaming studio.
          </motion.p>

          <motion.div {...rise(0.22)} className="mt-8 flex flex-wrap items-center gap-3">
            <button onClick={() => jump("stars")} className="btn-primary btn-lg">
              Explore the work <FaArrowRight className="h-3.5 w-3.5" />
            </button>
            <a href={PERSONAL_INFO.social.github} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-lg">
              <FaGithub className="h-[18px] w-[18px]" /> GitHub
            </a>
            <button
              onClick={() => {
                const ev = new CustomEvent("open-agent");
                window.dispatchEvent(ev);
              }}
              className="btn-ghost btn-lg"
            >
              <FaBolt className="h-3.5 w-3.5 text-accent" /> Ask my AI
            </button>
            <button onClick={() => navigate("contact")} className="btn-ghost btn-lg">
              Get in touch
            </button>
          </motion.div>
        </div>

        {/* ── right: the live proof board (interactive nodes) ── */}
        <motion.div {...rise(0.18)} className="lg:justify-self-end">
          <div className="card w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2.5">
              <span className="font-mono text-[11px] text-text-tertiary">live · from GitHub &amp; npm</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-text-tertiary">
                <span className="relative flex h-1.5 w-1.5">
                  {live && <span className="absolute inline-flex h-full w-full rounded-full bg-positive animate-ping-soft" />}
                  <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${live ? "bg-positive" : "bg-text-tertiary"}`} />
                </span>
                {liveLabel}
              </span>
            </div>

            {/* three interactive number nodes */}
            <div className="grid grid-cols-2 gap-px bg-border-subtle">
              <ProofNode label="GitHub stars" value={stars} suffix="★" kind="stars" hint="across all repos" onHover={setHighlight} onClick={jump} numeric={stats?.githubStars} />
              <ProofNode label="npm downloads" value={downloads} suffix="/mo" kind="downloads" hint="across packages" onHover={setHighlight} onClick={jump} numeric={stats?.npmDownloads} />
              <ProofNode label="pdf-reader-mcp" value={flagStars} suffix="★" kind="flagship" hint={`${flagDl}/mo · the flagship`} onHover={setHighlight} onClick={jump} wide numeric={stats?.flagshipStars} />
            </div>

            {/* active-now pulse */}
            <button
              onClick={() => jump("stars")}
              className="flex w-full items-center gap-2 border-t border-border-subtle px-4 py-3 text-left transition-colors hover:bg-surface-sunken/50"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent/60 animate-ping-soft" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="truncate font-mono text-[12px] text-text-secondary">
                {lastShip ? (
                  <>shipped <span className="text-text-primary">{lastShip.name}</span> · {timeAgo(lastShip.pushedAt)}</>
                ) : (
                  <>actively shipping — {STATS.yearsExperience?.display ?? "20+"} years building</>
                )}
              </span>
            </button>
          </div>
          <p className="mt-3 px-1 text-center font-mono text-[11px] text-text-tertiary lg:text-right">
            Nothing here is a claim — hover a number to see what it&apos;s made of.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ProofNode({
  label, value, suffix, kind, hint, onHover, onClick, wide, numeric,
}: {
  label: string;
  value: string;
  suffix: string;
  kind: HighlightKind;
  hint: string;
  onHover: (h: HighlightKind) => void;
  onClick: (h: HighlightKind) => void;
  wide?: boolean;
  numeric?: number; // if provided, count-up animates to this
}) {
  const animated = useCountUp(numeric ?? 0, 1500, true);
  const display = numeric ? animated.toLocaleString() : value;
  return (
    <button
      onMouseEnter={() => onHover(kind)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(kind)}
      onBlur={() => onHover(null)}
      onClick={() => onClick(kind)}
      className={`group bg-surface px-4 py-4 text-left transition-all hover:bg-accent-subtle/40 hover:shadow-sm ${wide ? "col-span-2" : ""}`}
    >
      <div className="flex items-baseline gap-1 font-mono text-2xl font-semibold tracking-tight text-text-primary tabular-nums transition-colors group-hover:text-accent sm:text-3xl">
        {display}
        <span className="text-base text-text-tertiary group-hover:text-accent">{suffix}</span>
      </div>
      <div className="mt-1 text-xs text-text-tertiary">{label}</div>
      <div className="mt-0.5 font-mono text-[10.5px] text-text-tertiary/70 group-hover:text-text-secondary">{hint}</div>
    </button>
  );
}
