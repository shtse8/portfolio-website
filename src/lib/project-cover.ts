/**
 * Non-AI product covers: solid brand panels + monogram.
 * Designed to sit next to real game screenshots without sci-fi clash.
 */

export type CoverTone = {
  from: string;
  to: string;
  ink: string;
  accent: string;
};

const TONES: Record<string, CoverTone> = {
  mcp: {
    from: "#1a2332",
    to: "#2d4a6f",
    ink: "#f3f6fb",
    accent: "#7eb6ff",
  },
  rag: {
    from: "#1c2430",
    to: "#3a5068",
    ink: "#f2f5f8",
    accent: "#9fd0c0",
  },
  "ai-infra": {
    from: "#1b1f2a",
    to: "#3d3560",
    ink: "#f5f3fb",
    accent: "#b8a4ff",
  },
  tooling: {
    from: "#222018",
    to: "#4a4030",
    ink: "#faf6ef",
    accent: "#e0c48a",
  },
  default: {
    from: "#1e2228",
    to: "#343b46",
    ink: "#f4f5f7",
    accent: "#a8b3c4",
  },
};

export function coverToneFor(haystack: string): CoverTone {
  const h = haystack.toLowerCase();
  if (/mcp|protocol|agent.?tool|reader/.test(h)) return TONES.mcp;
  if (/rag|search|embed|semantic|coderag/.test(h)) return TONES.rag;
  if (/gateway|paas|platform|infra|deploy|flow|orchestr/.test(h)) return TONES["ai-infra"];
  if (/css|state|immutable|util|cli|lib|sdk|tool/.test(h)) return TONES.tooling;
  return TONES.default;
}

export function monogram(name: string): string {
  const clean = name.replace(/[-_]/g, " ").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  const compact = name.replace(/[^a-zA-Z0-9]/g, "");
  return compact.slice(0, 2).toUpperCase() || "??";
}
