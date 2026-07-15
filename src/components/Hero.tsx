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
    <section
      data-cinematic-hero="v2"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pb-28 pt-32 sm:px-8 sm:pb-32 sm:pt-36"
    >
      {/* Theater stage — forced dark frame so the opening is unmistakable in light or dark theme */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[oklch(0.09_0.015_268)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-3 bg-black sm:h-4"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3 bg-black sm:h-4"
      />
      <AmbientField variant="hero" />

      <div className="container-cinema relative z-[1] grid w-full items-center gap-x-14 gap-y-14 lg:grid-cols-[1.15fr_0.85fr]">
        {/* ── left: opening monologue ── */}
        <div>
          <motion.div
            {...rise(0.02, 12)}
            className="mb-6 font-mono text-[11px] uppercase tracking-[0.35em] text-white/45"
          >
            Act 01 · Opening · kylet.se
          </motion.div>

          <motion.div
            {...rise(0.05, 16)}
            className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-ping-soft" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Open to new ventures
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-white/40">
              {PERSONAL_INFO.location.base}
            </span>
          </motion.div>

          <motion.div
            {...rise(0.12, 18)}
            className="mb-5 font-mono text-sm text-white/55"
          >
            <span className="font-semibold text-white">
              {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}
            </span>
            <span className="mx-2 text-white/30">·</span>
            <span className="text-white/45">AI infrastructure engineer</span>
          </motion.div>

          {/* Line-by-line cinematic headline — pure white / accent on theater stage */}
          <h1 className="text-display-xl max-w-[13ch] text-white">
            <motion.span {...rise(0.18)} className="block">
              I build the
            </motion.span>
            <motion.span {...rise(0.28)} className="block">
              infrastructure
            </motion.span>
            <motion.span {...rise(0.38)} className="block text-[oklch(0.78_0.16_268)]">
              AI agents run on.
            </motion.span>
          </h1>

          <motion.p
            {...rise(0.5, 20)}
            className="mt-8 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg"
          >
            Open-source MCP servers and AI-native developer tools, plus{" "}
            <strong className="font-semibold text-white">Sylphx</strong> — an
            AI-native PaaS with its own AI Gateway. Twenty years shipping before
            this; 10M+ app downloads at a Hong Kong gaming studio.
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
              className="btn inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-base font-medium text-white hover:bg-white/10"
            >
              <FaGithub className="h-[18px] w-[18px]" /> GitHub
            </a>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-agent"));
              }}
              className="btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-medium text-white/75 hover:bg-white/5 hover:text-white"
            >
              <FaBolt className="h-3.5 w-3.5 text-[oklch(0.78_0.16_268)]" /> Ask
              my AI
            </button>
            <button
              type="button"
              onClick={() => navigate("contact")}
              className="btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-medium text-white/75 hover:bg-white/5 hover:text-white"
            >
              Get in touch
            </button>
          </motion.div>
        </div>

        {/* ── right: glass proof board ── */}
        <motion.div {...rise(0.42, 32)} className="lg:justify-self-end">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-cinema backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <span className="font-mono text-[11px] text-white/45">
                live · from GitHub &amp; npm
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-white/45">
                <span className="relative flex h-1.5 w-1.5">
                  {live && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-ping-soft" />
                  )}
                  <span
                    className={`relative inline-flex h-1.5 w-1.5 rounded-full ${live ? "bg-emerald-400" : "bg-white/30"}`}
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
              className="flex w-full items-center gap-2 border-t border-white/10 px-4 py-3 text-left transition-colors hover:bg-white/5"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[oklch(0.78_0.16_268)]/60 animate-ping-soft" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[oklch(0.78_0.16_268)]" />
              </span>
              <span className="truncate font-mono text-[12px] text-white/55">
                {lastShip ? (
                  <>
                    shipped{" "}
                    <span className="text-white">{lastShip.name}</span> ·{" "}
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
          <p className="mt-4 px-1 text-center font-mono text-[11px] text-white/35 lg:text-right">
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
      className={`group bg-black/25 px-4 py-5 text-left transition-all hover:bg-white/10 ${wide ? "col-span-2" : ""}`}
    >
      <div className="flex items-baseline gap-1 font-mono text-2xl font-semibold tracking-tight text-white tabular-nums transition-colors group-hover:text-[oklch(0.78_0.16_268)] sm:text-3xl">
        {display}
        <span className="text-base text-white/40 group-hover:text-[oklch(0.78_0.16_268)]">
          {suffix}
        </span>
      </div>
      <div className="mt-1.5 text-xs text-white/45">{label}</div>
      <div className="mt-0.5 font-mono text-[10.5px] text-white/30 group-hover:text-white/55">
        {hint}
      </div>
    </button>
  );
}
