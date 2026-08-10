"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaClock, FaCodeBranch, FaFire } from "react-icons/fa6";
import { useCountUp } from "@/hooks/useCountUp";
import { API_BASE } from "@/lib/api";

/**
 * LiveTicker — portfolio development throughput strip.
 *
 * Single metric authority: same-origin BFF `/activity` only.
 * BFF computes live GitHub commit activity (today/7d/30d); on GitHub failure
 * it may return the last verified snapshot with stale=true / freshness=stale.
 */

interface Activity {
  commitsToday: number;
  commitsWeek: number;
  commitsMonth?: number;
  reposActiveToday: number;
  lastPush: { repo: string; ago: string } | null;
  source?: string;
  freshness?: string;
  stale?: boolean;
  projectionRevision?: string;
}

function activityUrl(): string {
  // Empty API_BASE → relative same-origin `/activity` (nginx BFF proxy).
  return `${API_BASE}/activity`;
}

export default function LiveTicker() {
  const [data, setData] = useState<Activity | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let alive = true;
    async function poll() {
      try {
        const res = await fetch(activityUrl());
        if (!res.ok) {
          if (alive) setUnavailable(true);
          return;
        }
        const d = await res.json();
        if (!alive) return;
        setUnavailable(false);
        const freshness: string | undefined =
          d.freshness ?? (d.stale ? "stale" : undefined);
        const stale =
          !!d.stale || freshness === "stale" || freshness === "not_observed";
        setData({
          commitsToday: d.commitsToday ?? d.commits_today ?? 0,
          commitsWeek: d.commitsWeek ?? d.commits_week ?? 0,
          commitsMonth: d.commitsMonth ?? d.commits_month,
          reposActiveToday: d.reposActiveToday ?? d.repos_active_today ?? 0,
          lastPush: d.lastPush ?? d.last_push ?? null,
          source: d.source ?? "bff",
          stale,
          freshness: freshness ?? (stale ? "stale" : "live"),
          projectionRevision: d.projectionRevision ?? d.projection_revision,
        });
      } catch {
        if (alive) setUnavailable(true);
      }
    }
    poll();
    const interval = setInterval(poll, 30_000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  if (unavailable && !data) {
    return (
      <div className="text-xs font-mono text-text-tertiary" role="status">
        activity unavailable
      </div>
    );
  }
  if (!data) return null;

  const stale =
    data.freshness === "stale" ||
    data.freshness === "not_observed" ||
    data.stale;

  return (
    <div
      className="flex items-center gap-2.5 text-xs font-mono sm:text-sm"
      data-activity-source={data.source ?? "unknown"}
      data-freshness={data.freshness ?? "live"}
    >
      <Item
        icon={<FaCodeBranch className="h-3 w-3 text-accent" />}
        value={data.commitsToday}
        label="commits today"
        highlight={data.commitsToday > 0}
        reduce={!!reduce}
      />
      <Dot />
      <Item
        icon={<FaFire className="h-3 w-3 text-positive" />}
        value={data.commitsWeek}
        label="commits 7d"
        reduce={!!reduce}
      />
      {typeof data.commitsMonth === "number" && (
        <>
          <Dot />
          <Item
            icon={<FaFire className="h-3 w-3 text-text-tertiary" />}
            value={data.commitsMonth}
            label="commits 30d"
            reduce={!!reduce}
          />
        </>
      )}
      {data.lastPush &&
        !String(data.source ?? "").startsWith("control-plane") && (
          <>
            <Dot />
            <div className="flex items-center gap-1 truncate text-text-tertiary">
              <FaClock className="h-2.5 w-2.5 shrink-0" />
              <span className="truncate text-text-secondary">
                {data.lastPush.repo}
              </span>
              <span className="shrink-0">{data.lastPush.ago}</span>
            </div>
          </>
        )}
      <Dot />
      <div className="flex shrink-0 items-center gap-1.5 text-text-tertiary">
        <span className="relative flex h-1.5 w-1.5">
          {!reduce && !stale && (
            <span className="absolute inline-flex h-full w-full rounded-full bg-positive animate-ping-soft" />
          )}
          <span
            className={`relative inline-flex h-1.5 w-1.5 rounded-full ${stale ? "bg-amber-400" : "bg-positive"}`}
          />
        </span>
        {stale
          ? "stale"
          : data.reposActiveToday > 0
            ? `${data.reposActiveToday} active`
            : "live"}
      </div>
    </div>
  );
}

function Dot() {
  return <span className="shrink-0 text-border">·</span>;
}

function Item({
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
    <div className="flex shrink-0 items-center gap-1.5">
      {icon}
      <motion.span
        key={value}
        initial={reduce ? { opacity: 0.5 } : { scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`font-semibold tabular-nums ${highlight ? "text-accent" : "text-text-primary"}`}
      >
        {reduce ? value : animated}
      </motion.span>
      <span className="text-text-tertiary">{label}</span>
    </div>
  );
}
