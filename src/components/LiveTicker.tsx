"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaCodeBranch, FaFire, FaClock } from "react-icons/fa6";
import { API_BASE } from "@/lib/api";
import { useCountUp } from "@/hooks/useCountUp";

/**
 * LiveTicker — compact real-time commit activity strip.
 * Polls /activity every 30s. Numbers count-up on refresh.
 * Layout is compact and truncates on small screens to prevent overflow.
 */

interface Activity {
  commitsToday: number;
  commitsWeek: number;
  reposActiveToday: number;
  lastPush: { repo: string; ago: string } | null;
}

export default function LiveTicker() {
  const [data, setData] = useState<Activity | null>(null);
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
      } catch { /* skip */ }
    }
    poll();
    const interval = setInterval(poll, 30_000);
    return () => { alive = false; clearInterval(interval); };
  }, []);

  if (!data) return null;

  return (
    <div className="flex items-center gap-2.5 text-xs font-mono sm:text-sm">
      <Item
        icon={<FaCodeBranch className="h-3 w-3 text-accent" />}
        value={data.commitsToday}
        label="today"
        highlight={data.commitsToday > 0}
        reduce={!!reduce}
      />
      <Dot />
      <Item
        icon={<FaFire className="h-3 w-3 text-positive" />}
        value={data.commitsWeek}
        label="week"
        reduce={!!reduce}
      />
      {data.lastPush && (
        <>
          <Dot />
          <div className="flex items-center gap-1 truncate text-text-tertiary">
            <FaClock className="h-2.5 w-2.5 shrink-0" />
            <span className="truncate text-text-secondary">{data.lastPush.repo}</span>
            <span className="shrink-0">{data.lastPush.ago}</span>
          </div>
        </>
      )}
      <Dot />
      <div className="flex shrink-0 items-center gap-1.5 text-text-tertiary">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-positive animate-ping-soft" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-positive" />
        </span>
        {data.reposActiveToday > 0 ? `${data.reposActiveToday} active` : "live"}
      </div>
    </div>
  );
}

function Dot() { return <span className="shrink-0 text-border">·</span>; }

function Item({
  icon, value, label, highlight, reduce,
}: {
  icon: React.ReactNode; value: number; label: string;
  highlight?: boolean; reduce: boolean;
}) {
  const animated = useCountUp(value, 800, true);
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {icon}
      <motion.span
        key={value}
        initial={reduce ? { opacity: 0.5 } : { scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`font-semibold tabular-nums ${highlight ? "text-accent" : "text-text-primary"}`}
      >
        {animated}
      </motion.span>
      <span className="text-text-tertiary">{label}</span>
    </div>
  );
}
