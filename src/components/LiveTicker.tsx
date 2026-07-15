"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaCodeBranch, FaFire, FaClock } from "react-icons/fa6";
import { API_BASE } from "@/lib/api";
import {
  fetchCpPublicSummary,
  HAS_CP_PUBLIC,
  mapCpSummaryToActivity,
} from "@/lib/controlPlanePublic";
import { useCountUp } from "@/hooks/useCountUp";

/**
 * LiveTicker — portfolio development throughput strip.
 *
 * Prefer Control Plane public profile projection (anonymous, privacy-filtered).
 * Fall back to website `/activity` only when CP public base is unset (legacy
 * compatibility path — time-bound dual authority).
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
}

export default function LiveTicker() {
  const [data, setData] = useState<Activity | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let alive = true;
    async function poll() {
      try {
        // 1) Control Plane public projection (authoritative for fleet throughput).
        if (HAS_CP_PUBLIC) {
          const summary = await fetchCpPublicSummary();
          if (summary && !summary.error) {
            if (!alive) return;
            setUnavailable(false);
            setData(mapCpSummaryToActivity(summary));
            return;
          }
        }

        // 2) Time-bound legacy website-owned activity (sunset 2026-08-15 UTC unless
        //    LEGACY_ACTIVITY_SUNSET=never on the API). Prefer CP public exclusively in prod.
        const res = await fetch(`${API_BASE}/activity`);
        if (!res.ok) {
          if (alive) setUnavailable(true);
          return;
        }
        const d = await res.json();
        if (!alive) return;
        setUnavailable(false);
        setData({
          commitsToday: d.commitsToday ?? d.commits_today ?? 0,
          commitsWeek: d.commitsWeek ?? d.commits_week ?? 0,
          commitsMonth: d.commitsMonth ?? d.commits_month,
          reposActiveToday: d.reposActiveToday ?? d.repos_active_today ?? 0,
          lastPush: d.lastPush ?? d.last_push ?? null,
          source: "legacy-website-activity",
          stale: !!d.stale,
          freshness: d.stale ? "stale" : "live",
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

  const stale = data.freshness === "stale" || data.freshness === "not_observed" || data.stale;

  return (
    <div
      className="flex items-center gap-2.5 text-xs font-mono sm:text-sm"
      data-activity-source={data.source ?? "unknown"}
      data-freshness={data.freshness ?? "live"}
    >
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
        label="7d"
        reduce={!!reduce}
      />
      {typeof data.commitsMonth === "number" && (
        <>
          <Dot />
          <Item
            icon={<FaFire className="h-3 w-3 text-text-tertiary" />}
            value={data.commitsMonth}
            label="30d"
            reduce={!!reduce}
          />
        </>
      )}
      {data.lastPush && data.source !== "control-plane-public" && (
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
