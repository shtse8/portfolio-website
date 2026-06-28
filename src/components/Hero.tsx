"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowRight, FaGithub, FaArrowDown } from "react-icons/fa";
import { PERSONAL_INFO } from "@/data/personal";
import { HERO_STATS } from "@/lib/stats";
import { useLiveStats, liveDisplay } from "@/lib/liveStats";
import { useNavigationStore } from "@/context/NavigationContext";

const ROLES = PERSONAL_INFO.roles ?? ["Technical Founder"];
const LIVE_IDS = new Set(["stars", "npm-downloads", "flagship-stars", "flagship-downloads"]);

export default function Hero() {
  const reduce = useReducedMotion();
  const live = useLiveStats();
  const navigate = useNavigationStore((s) => s.navigateToSection);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 2600);
    return () => clearInterval(t);
  }, []);

  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3, delay } }
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pt-24 pb-16 sm:px-8">
      {/* Editorial grid + accent glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-60" />
        <div className="absolute left-1/2 top-[-10%] h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />
      </div>

      <div className="container-content">
        {/* Eyebrow */}
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

        {/* Kicker: name + rotating role */}
        <motion.div {...rise(0.06)} className="mb-5 flex h-7 flex-wrap items-center gap-x-2 font-mono text-base text-text-secondary sm:text-lg">
          <span className="font-semibold text-text-primary">{PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}</span>
          <span className="text-text-tertiary">·</span>
          <span className="text-accent">▍</span>
          <span className="relative inline-block">
            {ROLES.map((role, i) => (
              <motion.span
                key={role}
                className="absolute left-0 whitespace-nowrap"
                initial={false}
                animate={{ opacity: i === roleIndex ? 1 : 0, y: reduce ? 0 : i === roleIndex ? 0 : 6 }}
                transition={{ duration: 0.4 }}
                aria-hidden={i !== roleIndex}
              >
                {role}
              </motion.span>
            ))}
            {/* reserve width */}
            <span className="invisible">AI-Native Platform Builder</span>
          </span>
        </motion.div>

        {/* Headline — positioning statement */}
        <motion.h1 {...rise(0.12)} className="text-display max-w-[19ch] text-text-primary">
          I build the infrastructure <span className="text-accent">AI agents</span> run on.
        </motion.h1>

        {/* Subhead */}
        <motion.p {...rise(0.18)} className="lead mt-7 max-w-2xl">
          MCP servers and AI-native developer tools. My PDF reader for AI agents passed{" "}
          <strong className="font-semibold text-text-primary">800★ and ~24K downloads a month</strong>; I&rsquo;m
          building <strong className="font-semibold text-text-primary">Sylphx</strong>, an AI-native PaaS, plus
          RAG &amp; semantic-search tooling. Twenty years shipping software before this —{" "}
          <strong className="font-semibold text-text-primary">10M+ app downloads</strong> at a Hong Kong gaming studio.
        </motion.p>

        {/* CTAs */}
        <motion.div {...rise(0.24)} className="mt-9 flex flex-wrap items-center gap-3">
          <button onClick={() => navigate("open-source")} className="btn-primary btn-lg">
            View work <FaArrowRight className="h-3.5 w-3.5" />
          </button>
          <a href={PERSONAL_INFO.social.github} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-lg">
            <FaGithub className="h-[18px] w-[18px]" /> GitHub
          </a>
          <button onClick={() => navigate("contact")} className="btn-ghost btn-lg">
            Get in touch
          </button>
        </motion.div>

        {/* Proof stats */}
        <motion.dl {...rise(0.32)} className="mt-14 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
          {HERO_STATS.map((stat) => {
            const isLive = live !== null && LIVE_IDS.has(stat.id);
            return (
              <div key={stat.id} className="bg-surface p-4 sm:p-5">
                <dt className="flex items-center gap-1.5 font-mono text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                  {liveDisplay(stat.id, live, stat.display)}
                  {isLive && (
                    <span
                      className="relative inline-flex h-1.5 w-1.5"
                      title="Live from GitHub & npm"
                      aria-label="live"
                    >
                      <span className="absolute inline-flex h-full w-full rounded-full bg-positive animate-ping-soft" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-positive" />
                    </span>
                  )}
                </dt>
                <dd className="mt-1 text-xs text-text-tertiary">{stat.label}</dd>
              </div>
            );
          })}
        </motion.dl>
      </div>

      {/* Scroll cue */}
      <motion.button
        {...rise(0.5)}
        onClick={() => navigate("now")}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-text-tertiary transition-colors hover:text-text-secondary sm:flex"
        aria-label="Scroll down"
      >
        <span className="eyebrow">Scroll</span>
        <FaArrowDown className="h-3 w-3 animate-bounce" />
      </motion.button>
    </section>
  );
}
