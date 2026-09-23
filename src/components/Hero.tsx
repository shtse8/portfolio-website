"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FaArrowRight, FaBolt, FaGithub } from "react-icons/fa6";
import { useNavigationStore } from "@/context/NavigationContext";
import { type HighlightKind, useWorkGraph } from "@/context/WorkGraphContext";
import { PERSONAL_INFO } from "@/data/personal";
import { heroProofBoard } from "@/lib/hero-proof-board";
import { proofBoardDotClass, proofBoardObservation } from "@/lib/proof-board";
import { BAKED_STATS } from "@/lib/stats";
import { timeAgo } from "@/lib/terminal";
import { HeroProofGrid } from "./HeroProofGrid";
import LiveTicker from "./LiveTicker";

/**
 * Hero — the site's weather: drifting twin-accent aurora, fine grid, grain.
 * Content-first; the proof board floats in the light field as glass.
 */
export default function Hero() {
  const reduce = useReducedMotion();
  const { stats, recent, live, setHighlight, flashHighlight, setSelected } =
    useWorkGraph();
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

  const cells = heroProofBoard(stats);
  const lastShip = recent[0];
  const board = proofBoardObservation({
    live,
    stats,
    bakedVerifiedAt: BAKED_STATS.verifiedAt,
  });
  const liveDot = board.freshness === "live";

  function jump(highlight: HighlightKind) {
    setSelected(null);
    flashHighlight(highlight);
    navigate("work");
  }

  return (
    <section
      data-design="aurora-studio"
      className="relative flex min-h-[min(100svh,880px)] items-center overflow-hidden"
    >
      {/* Atmosphere — drifting light fields + fine grid (grain is global) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-[0.3] dark:opacity-30" />
        <div className="aurora-blob aurora-blob--accent -left-[18vw] -top-[12vh] h-[62vh] w-[62vh]" />
        <div className="aurora-blob aurora-blob--warm -right-[14vw] bottom-[-8vh] h-[52vh] w-[52vh]" />
        <div className="aurora-blob aurora-blob--accent left-[38%] top-[24%] h-[34vh] w-[34vh] opacity-60" />
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
            <span className="text-text-tertiary">
              AI infrastructure engineer
            </span>
          </motion.div>

          <motion.h1 {...rise(0.08)} className="text-display text-text-primary">
            I build the infrastructure{" "}
            <span className="text-gradient">AI agents</span> run on.
          </motion.h1>

          <motion.p
            {...rise(0.12)}
            className="mt-5 text-[15px] leading-relaxed text-text-secondary sm:text-base"
          >
            Open-source MCP servers and AI-native developer tools, plus{" "}
            <strong className="font-semibold text-text-primary">Sylphx</strong>{" "}
            — an AI-native PaaS with its own AI Gateway. Career since 2006 is on
            Story as self-attested history, not live GitHub/npm.
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
              onClick={() =>
                window.dispatchEvent(new CustomEvent("open-agent"))
              }
              className="btn-ghost btn-lg"
            >
              <FaBolt className="h-3.5 w-3.5 text-accent-2" /> Ask my AI
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

        {/* Proof board — glass instrument panel floating in the light */}
        <motion.div {...rise(0.14, 18)} className="lg:justify-self-end">
          <div className="glass glow-ring w-full max-w-md overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2.5">
              <span className="font-mono text-[11px] text-text-tertiary">
                from GitHub &amp; npm
              </span>
              <span
                className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-text-tertiary"
                data-freshness={board.freshness}
                data-observed-at={board.observedAt ?? ""}
              >
                <span className="relative flex h-1.5 w-1.5">
                  {liveDot && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-positive animate-ping-soft" />
                  )}
                  <span
                    className={`relative inline-flex h-1.5 w-1.5 rounded-full ${proofBoardDotClass(board.freshness)}`}
                  />
                </span>
                {board.freshness}
                {board.observedAt ? (
                  <>
                    {" "}
                    ·{" "}
                    <time dateTime={board.observedAt}>{board.observedAt}</time>
                  </>
                ) : null}
              </span>
            </div>

            <HeroProofGrid
              cells={cells}
              onHover={setHighlight}
              onClick={jump}
            />

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
                  <>actively shipping — live GitHub activity on this board</>
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
