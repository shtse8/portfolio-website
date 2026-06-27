"use client";

import { useMemo } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { getSkills } from "@/data/skills";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";
import SkillIcon from "./capabilities/SkillIcon";
import { buildCapabilities, type DomainGroup } from "./capabilities/domains";

function SkillChip({ name, icon }: { name: string; icon: string }) {
  return (
    <span className="chip gap-1.5">
      <SkillIcon name={icon} className="h-3 w-3 text-text-tertiary" />
      {name}
    </span>
  );
}

function DomainCard({ domain }: { domain: DomainGroup }) {
  return (
    <article className="card card-hover h-full p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-mono text-[0.8rem] font-medium uppercase tracking-[0.18em] text-text-primary">
          {domain.label}
        </h3>
        <span className="shrink-0 font-mono text-xs tabular-nums text-text-tertiary">
          {domain.count}
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-text-tertiary">{domain.blurb}</p>

      <ul className="mt-5 flex flex-wrap gap-1.5">
        {domain.headliners.map((skill) => (
          <li key={skill.id}>
            <SkillChip name={skill.name} icon={skill.icon} />
          </li>
        ))}
      </ul>

      {/* Progressive disclosure — native, keyboard-accessible, no JS state. */}
      {domain.rest.length > 0 && (
        <details className="group mt-1.5">
          <summary className="chip cursor-pointer list-none gap-1.5 border-dashed text-text-tertiary transition-colors marker:content-none hover:border-accent/40 hover:text-text-secondary [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">+{domain.remainder} more</span>
            <span className="hidden group-open:inline">Show fewer</span>
            <FaChevronDown
              aria-hidden
              className="h-2.5 w-2.5 transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {domain.rest.map((skill) => (
              <li key={skill.id}>
                <SkillChip name={skill.name} icon={skill.icon} />
              </li>
            ))}
          </ul>
        </details>
      )}
    </article>
  );
}

export default function TechStack() {
  const { domains, core, total } = useMemo(
    () => buildCapabilities(getSkills()),
    [],
  );

  return (
    <div className="container-content">
      <SectionHeader
        index="05"
        eyebrow="Capabilities"
        title="Range across the full stack"
        description={`${total} technologies from two decades of shipping — grouped into the domains I actually build in, not a flat list.`}
      />

      {/* Signature stack — the curated core I reach for most */}
      {core.length > 0 && (
        <div className="mt-12">
          <Reveal>
            <p className="eyebrow mb-4">Signature stack</p>
          </Reveal>
          <Reveal delay={0.05}>
            <ul className="flex flex-wrap gap-2">
              {core.map((skill) => (
                <li
                  key={skill.id}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 transition-colors hover:border-accent/40"
                >
                  <SkillIcon name={skill.icon} className="h-3.5 w-3.5 text-accent" />
                  <span className="font-mono text-sm text-text-primary">{skill.name}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      )}

      {/* Domain grid — breadth made scannable */}
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {domains.map((domain, i) => (
          <Reveal key={domain.key} delay={i * 0.06}>
            <DomainCard domain={domain} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
