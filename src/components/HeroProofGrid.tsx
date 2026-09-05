"use client";

import type { HighlightKind } from "@/context/WorkGraphContext";
import { useCountUp } from "@/hooks/useCountUp";
import type { HeroProofCell } from "@/lib/hero-proof-board";

/**
 * Exact proof-board grid Hero renders. Extra cells belong here — the
 * honesty oracle renders this component, not a parallel unused array.
 */
export function HeroProofGrid({
  cells,
  onHover,
  onClick,
}: {
  cells: HeroProofCell[];
  onHover: (h: HighlightKind) => void;
  onClick: (h: HighlightKind) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-px bg-border-subtle">
      {cells.map((cell) => (
        <ProofNode
          key={cell.id}
          label={cell.label}
          value={cell.display}
          suffix={cell.suffix}
          kind={cell.kind}
          hint={cell.hint}
          onHover={onHover}
          onClick={onClick}
          wide={cell.wide}
          numeric={cell.numeric}
        />
      ))}
    </div>
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
  const animated = useCountUp(numeric ?? 0, 1400, true);
  const display = numeric ? animated.toLocaleString() : value;
  return (
    <button
      type="button"
      onMouseEnter={() => onHover(kind)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(kind)}
      onBlur={() => onHover(null)}
      onClick={() => onClick(kind)}
      className={`group bg-surface/70 px-4 py-4 text-left transition-colors hover:bg-accent-subtle/50 ${wide ? "col-span-2" : ""}`}
    >
      <div className="flex items-baseline gap-1 font-mono text-xl font-semibold tracking-tight text-text-primary tabular-nums transition-colors group-hover:text-accent sm:text-2xl">
        {display}
        <span className="text-sm text-text-tertiary group-hover:text-accent">
          {suffix}
        </span>
      </div>
      <div className="mt-1 text-xs text-text-tertiary">{label}</div>
      <div className="mt-0.5 font-mono text-[10.5px] text-text-tertiary/70 group-hover:text-text-secondary">
        {hint}
      </div>
    </button>
  );
}
