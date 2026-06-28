"use client";

import Link from "next/link";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { getCurrentRoles } from "@/data/roles";
import { getOrganization } from "@/data/organizations";
import { formatPeriod } from "@/data";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

export default function Now() {
  const roles = getCurrentRoles();

  return (
    <div className="container-content">
      <SectionHeader
        index="02"
        eyebrow="Now"
        title="What I'm building right now"
        description="Two UK-based ventures: open-source developer tools, and a software consultancy."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {roles.map((role, i) => {
          const org = getOrganization(role.organizationId);
          if (!org) return null;
          return (
            <Reveal key={role.id} delay={i * 0.08}>
              <article className="card card-hover group h-full p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-h3 text-text-primary">{org.name}</h3>
                    <p className="mt-0.5 font-mono text-xs text-text-tertiary">
                      {role.title} · {formatPeriod(role.period)}
                    </p>
                  </div>
                  {role.liveUrl && (
                    <Link
                      href={role.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${org.name}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-text-secondary transition-colors group-hover:border-accent group-hover:text-accent"
                    >
                      <FaArrowUpRightFromSquare className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>

                <p className="mt-4 text-text-secondary">{role.description}.</p>

                {role.keyAchievements && role.keyAchievements.length > 0 && (
                  <ul className="mt-5 space-y-2">
                    {role.keyAchievements.slice(0, 2).map((a) => (
                      <li key={a} className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}

                {role.skills && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {role.skills.slice(0, 5).map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
