"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FaArrowRight, FaBolt, FaGithub } from "react-icons/fa6";
import { useNavigationStore } from "@/context/NavigationContext";
import { type HighlightKind, useWorkGraph } from "@/context/WorkGraphContext";
import { PERSONAL_INFO } from "@/data/personal";
import { useCountUp } from "@/hooks/useCountUp";
import { STATS } from "@/lib/stats";
import { compact, timeAgo } from "@/lib/terminal";
import AmbientField from "./cinematic/AmbientField";
import ScrollCue from "./cinematic/ScrollCue";
import LiveTicker from "./LiveTicker";

/**
 * Hero — cinematic opening frame.
 *
 * Full-viewport first act: display-type headline with line-by-line rise,
 * ambient light field, glass proof board as the only "prop." Scroll cue
 * invites the next scene. Evidence still answers credibility in one glance.
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

  const rise = (delay: number, y = 28) =>
    reduce
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.35, delay },
        }
      : {
          initial: { opacity: 0, y, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: {
            duration: 0.95,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  const stars = stats ? compact(stats.githubStars) : "~990";
  const downloads = stats ? compact(stats.npmDownloads) : "27K+";
  const flagStars = stats ? compact(stats.flagshipStars) : "800+";
  const flagDl = stats ? compact(stats.flagshipDownloads) : "24K+";
  const lastShip = recent[0];

  function jump(highlight: HighlightKind) {
    setSelected(null);
    flashHighlight(highlight);
    navigate("work");
  }

  const liveLabel = loading ? "loading" : live ? "live" : "cached";

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pb-24 pt-28 sm:px-8 sm:pb-28 sm:pt-32">
      <AmbientField variant="hero" />

      <div className="container-cinema grid w-full items-center gap-x-14 gap-y-14 lg:grid-cols-[1.15fr_0.85fr]">
        {/* ── left: opening monologue ── */}
        <div>
          <motion.div
            {...rise(0.05, 16)}
            className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2"
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
            {...rise(0.12, 18)}
            className="mb-5 font-mono text-sm text-text-secondary"
          >
            <span className="font-semibold text-text-primary">
              {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}
            </span>
            <span className="mx-2 text-text-tertiary">·</span>
            <span className="text-text-tertiary">
              AI infrastructure engineer
            </span>
          </motion.div>

          {/* Line-by-line cinematic headline */}
          <h1 className="text-display-xl max-w-[13ch] text-text-primary">
            <motion.span {...rise(0.18)} className="block">
              I build the
            </motion.span>
            <motion.span {...rise(0.28)} className="block">
              infrastructure
            </motion.span>
            <motion.span {...rise(0.38)} className="block text-accent">
              AI agents run on.
            </motion.span>
          </h1>

          <motion.p
            {...rise(0.5, 20)}
            className="mt-8 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg"
          >
            Open-source MCP servers and AI-native developer tools, plus{" "}
            <strong className="font-semibold text-text-primary">Sylphx</strong>{" "}
            — an AI-native PaaS with its own AI Gateway. Twenty years shipping
            before this; 10M+ app downloads at a Hong Kong gaming studio.
          </motion.p>

          <motion.div {...rise(0.58, 16)} className="mt-7">
            <LiveTicker />
          </motion.div>

          <motion.div
            {...rise(0.66, 16)}
            className="mt-9 flex flex-wrap items-center gap-3"
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
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-agent"));
              }}
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

        {/* ── right: glass proof board ── */}
        <motion.div {...rise(0.42, 32)} className="lg:justify-self-end">
          <div className="card-glass w-full max-w-md overflow-hidden shadow-cinema">
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

            <div className="grid grid-cols-2 gap-px bg-border-subtle/80">
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
              className="flex w-full items-center gap-2 border-t border-border-subtle px-4 py-3 text-left transition-colors hover:bg-surface-sunken/40"
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
          <p className="mt-4 px-1 text-center font-mono text-[11px] text-text-tertiary lg:text-right">
            Nothing here is a claim — hover a number to see what it&apos;s made
            of.
          </p>
        </motion.div>
      </div>

      <ScrollCue label="Enter" />
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
  const animated = useCountUp(numeric ?? 0, 1600, true);
  const display = numeric ? animated.toLocaleString() : value;
  return (
    <button
      type="button"
      onMouseEnter={() => onHover(kind)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(kind)}
      onBlur={() => onHover(null)}
      onClick={() => onClick(kind)}
      className={`group bg-surface/60 px-4 py-5 text-left transition-all hover:bg-accent-subtle/50 ${wide ? "col-span-2" : ""}`}
    >
      <div className="flex items-baseline gap-1 font-mono text-2xl font-semibold tracking-tight text-text-primary tabular-nums transition-colors group-hover:text-accent sm:text-3xl">
        {display}
        <span className="text-base text-text-tertiary group-hover:text-accent">
          {suffix}
        </span>
      </div>
      <div className="mt-1.5 text-xs text-text-tertiary">{label}</div>
      <div className="mt-0.5 font-mono text-[10.5px] text-text-tertiary/70 group-hover:text-text-secondary">
        {hint}
      </div>
    </button>
  );
}
