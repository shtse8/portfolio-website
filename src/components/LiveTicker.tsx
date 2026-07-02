"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaCodeBranch, FaFire, FaClock } from "react-icons/fa6";
import { API_BASE } from "@/lib/api";
import { useCountUp } from "@/hooks/useCountUp";

/**
 * LiveTicker — a real-time commit velocity strip.
 *
 * Polls /activity every 30s for GitHub push events across all owners.
 * Numbers count-up on each refresh, giving the "stock ticker" feel.
 * Stars/downloads stay as static context; commits are the live, fast-moving number.
 */

interface Activity {
  commitsToday: number;
  commitsWeek: number;
  commitsMonth: number;
  reposActiveToday: number;
  lastPush: { repo: string; ago: string } | null;
}

export default function LiveTicker() {
  const [data, setData] = useState<Activity | null>(null);
  const [stale, setStale] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let alive = true;
    async function poll() {
      try {
        const res = await fetch(`${API_BASE}/activity`);
        if (!res.ok) return;
        const d = await res.json();
        if (!alive) return;
        setData(d);
        setStale(false);
      } catch {
        if (alive) setStale(true);
      }
    }
    poll();
    const interval = setInterval(poll, 30_000);
    return () => { alive = false; clearInterval(interval); };
  }, []);

  if (!data) return null;

  return (
    <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap py-1 text-xs sm:text-sm">
      <TickerItem
        icon={<FaCodeBranch className="h-3 w-3 text-accent" />}
        value={data.commitsToday}
        label="commits today"
        highlight={data.commitsToday > 0}
        reduce={!!reduce}
      />
      <Divider />
      <TickerItem
        icon={<FaFire className="h-3 w-3 text-positive" />}
        value={data.commitsWeek}
        label="this week"
        reduce={!!reduce}
      />
      <Divider />
      {data.lastPush && (
        <>
          <div className="flex items-center gap-1.5 font-mono text-text-tertiary">
            <FaClock className="h-2.5 w-2.5" />
            <span className="text-text-secondary">{data.lastPush.repo}</span>
            <span className="text-text-tertiary">{data.lastPush.ago}</span>
          </div>
          <Divider />
        </>
      )}
      <div className="flex items-center gap-1.5 font-mono text-text-tertiary">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-positive animate-ping-soft" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-positive" />
        </span>
        {data.reposActiveToday > 0
          ? `${data.reposActiveToday} repos active today`
          : stale ? "cached" : "live"}
      </div>
    </div>
  );
}

function Divider() {
  return <span className="text-border">·</span>;
}

function TickerItem({
  icon,
  value,
  label,
  highlight,
  reduce,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  highlight?: boolean;
  reduce: boolean;
}) {
  const animated = useCountUp(value, 800, true);
  return (
    <div className="flex items-center gap-1.5 font-mono">
      {icon}
      <motion.span
        key={value}
        initial={reduce ? { opacity: 0.5 } : { scale: 1.2, color: "var(--accent)" }}
        animate={{ scale: 1, color: "var(--text-primary)" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`font-semibold tabular-nums ${highlight ? "text-accent" : "text-text-primary"}`}
      >
        {animated}
      </motion.span>
      <span className="text-text-tertiary">{label}</span>
    </div>
  );
}
