"use client";

import * as Fa from "react-icons/fa";
import type { IconType } from "react-icons";
import { PHILOSOPHY_PRINCIPLES } from "@/data/philosophy";
import type { PhilosophyPrinciple } from "@/data/types";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

/** Resolve a `react-icons/fa` name string to a component — never crash on an unknown name. */
function resolveIcon(name: string): IconType {
  const icons = Fa as unknown as Record<string, IconType | undefined>;
  return icons[name] ?? Fa.FaRegCircle;
}

function KeyPoints({ points }: { points: string[] }) {
  return (
    <ul className="mt-5 grid gap-x-5 gap-y-2 sm:grid-cols-2">
      {points.map((point) => (
        <li key={point} className="flex items-start gap-2.5 text-sm text-text-secondary">
          <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
          {point}
        </li>
      ))}
    </ul>
  );
}

function IconBadge({ icon }: { icon: string }) {
  const Icon = resolveIcon(icon);
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-accent ring-1 ring-inset ring-accent/10">
      <Icon className="h-5 w-5" aria-hidden />
    </span>
  );
}

/** Standard principle card — icon, mono index, title, one-liner, body, key points. */
function PrincipleCard({ principle, index }: { principle: PhilosophyPrinciple; index: number }) {
  return (
    <article className="card card-hover flex h-full flex-col p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <IconBadge icon={principle.icon} />
        <span className="font-mono text-xs text-text-tertiary">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="text-h3 mt-5 text-text-primary">{principle.title}</h3>
      <p className="mt-1.5 font-mono text-xs text-text-tertiary">{principle.shortDescription}</p>
      <p className="mt-4 text-text-secondary">{principle.fullDescription}</p>

      {principle.keyPoints && principle.keyPoints.length > 0 && (
        <KeyPoints points={principle.keyPoints} />
      )}
    </article>
  );
}

/** Quiet closing thought — full-width, sunken, two-column on desktop. */
function ClosingPrinciple({ principle, index }: { principle: PhilosophyPrinciple; index: number }) {
  return (
    <article className="card border-border-subtle bg-surface-sunken/60 p-6 sm:p-9">
      <div className="grid gap-7 sm:grid-cols-[minmax(0,0.9fr)_1.3fr] sm:gap-12">
        <div>
          <div className="flex items-center gap-3">
            <IconBadge icon={principle.icon} />
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-text-tertiary">
              {String(index + 1).padStart(2, "0")} · closing thought
            </span>
          </div>
          <h3 className="text-h3 mt-5 text-text-primary">{principle.title}</h3>
          <p className="mt-1.5 font-mono text-xs text-text-tertiary">{principle.shortDescription}</p>
        </div>

        <div>
          <p className="lead">{principle.fullDescription}</p>
          {principle.keyPoints && principle.keyPoints.length > 0 && (
            <KeyPoints points={principle.keyPoints} />
          )}
        </div>
      </div>
    </article>
  );
}

export default function Philosophy() {
  const principles = PHILOSOPHY_PRINCIPLES;
  const lastIndex = principles.length - 1;
  const main = principles.slice(0, lastIndex);
  const closing = principles[lastIndex];

  return (
    <div className="container-content">
      <SectionHeader
        index="06"
        eyebrow="Philosophy"
        title="How I build"
        description="Five principles I keep coming back to — the quiet constraints behind every interface and line of code I ship."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5">
        {main.map((principle, i) => (
          <Reveal key={principle.id} className="h-full" delay={i * 0.06}>
            <PrincipleCard principle={principle} index={i} />
          </Reveal>
        ))}

        {closing && (
          <Reveal key={closing.id} className="sm:col-span-2" delay={0.12}>
            <ClosingPrinciple principle={closing} index={lastIndex} />
          </Reveal>
        )}
      </div>
    </div>
  );
}
