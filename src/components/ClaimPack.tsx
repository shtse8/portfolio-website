"use client";

import { useEffect, useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa6";
import { API_BASE, HAS_API } from "@/lib/api";

/**
 * Claim Pack — one structured, copyable identity snapshot for recruiters
 * and external agents. Live numbers when `/claims` is available.
 */

type ClaimPackPayload = {
  promise?: string;
  person?: { name?: string; title?: string; email?: string; location?: string };
  flagship?: { repo?: string; stars?: number; npm?: string; url?: string };
  metrics?: {
    githubStars?: number;
    npmDownloads?: number;
    flagshipStars?: number;
    flagshipDownloads?: number;
    updatedAt?: string;
  };
  activityDefinition?: { unit?: string; includes?: string };
  updatedAt?: string;
};

export default function ClaimPack() {
  const [pack, setPack] = useState<ClaimPackPayload | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!HAS_API) return;
    let alive = true;
    fetch(`${API_BASE}/claims`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d) setPack(d as ClaimPackPayload);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!pack) return null;

  const lines = [
    pack.person?.name && pack.person?.title
      ? `${pack.person.name} — ${pack.person.title}`
      : null,
    pack.promise ? `Promise: ${pack.promise}` : null,
    pack.person?.location ? `Location: ${pack.person.location}` : null,
    pack.person?.email ? `Contact: ${pack.person.email}` : null,
    pack.flagship
      ? `Flagship: ${pack.flagship.repo} · ${pack.flagship.stars ?? "—"}★ · npm ${pack.flagship.npm ?? ""}`
      : null,
    pack.metrics
      ? `Live: ${pack.metrics.githubStars ?? "—"} GitHub stars · ${pack.metrics.npmDownloads ?? "—"} npm downloads/mo (as of ${pack.metrics.updatedAt ?? pack.updatedAt ?? "live"})`
      : null,
    pack.activityDefinition?.unit
      ? `Activity unit: ${pack.activityDefinition.unit} — ${pack.activityDefinition.includes ?? ""}`
      : null,
    "Site: https://kylet.se · Claims API: https://kylet.se/claims",
  ].filter(Boolean) as string[];

  const text = lines.join("\n");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-border-subtle bg-surface/60 p-5 text-left">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
            Claim pack
          </div>
          <p className="mt-1 text-sm text-text-secondary">
            One verified snapshot — copy into hiring notes or feed an agent.
          </p>
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-text-primary"
        >
          {copied ? (
            <>
              <FaCheck className="h-3 w-3 text-positive" /> Copied
            </>
          ) : (
            <>
              <FaCopy className="h-3 w-3" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-text-tertiary">
        {text}
      </pre>
    </div>
  );
}
