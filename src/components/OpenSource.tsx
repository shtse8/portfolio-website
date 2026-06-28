"use client";

import { useMemo } from "react";
import Link from "next/link";
import { FaGithub, FaStar, FaArrowRight, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { SiNpm } from "react-icons/si";
import { PROJECTS } from "@/data/projects";
import { formatProjectPeriod } from "@/data";
import { PERSONAL_INFO } from "@/data/personal";
import { STATS } from "@/lib/stats";
import type { Project } from "@/data/types";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

const FLAGSHIP_ID = "pdf-reader-mcp";
const OSS_CATEGORIES = new Set(["Open Source", "AI & ML", "Frameworks & Libraries"]);
const GITHUB_ORG = "https://github.com/SylphxAI";

/** Strip a trailing "NNN GitHub stars." claim so star figures live only in STATS. */
function cleanDescription(text: string): string {
  return text.replace(/\s*\d[\d,]*\+?\s*GitHub stars\.?/i, "").trim();
}

function asBullets(details: Project["details"]): string[] {
  return Array.isArray(details) ? details : [details];
}

export default function OpenSource() {
  const { flagship, others, ossCount } = useMemo(() => {
    const oss = PROJECTS.filter((p) => OSS_CATEGORIES.has(p.category));
    return {
      flagship: PROJECTS.find((p) => p.id === FLAGSHIP_ID),
      others: oss.filter((p) => p.id !== FLAGSHIP_ID).slice(0, 6),
      ossCount: oss.length,
    };
  }, []);

  // Aggregate proof — every figure reads from the STATS single source of truth.
  const proof = [
    STATS.npmDownloads,
    STATS.githubStars,
    { display: String(ossCount), label: "Open-source projects" },
  ];

  // First detail repeats the description, so lead with the more specific proof bullets.
  const flagshipBullets = flagship ? asBullets(flagship.details).slice(1, 4) : [];

  return (
    <div className="container-content">
      <SectionHeader
        index="02"
        eyebrow="AI tooling · Open Source"
        title="The tools AI agents — and developers — run on"
        description="MCP servers, RAG and semantic-search engines, AI dev platforms, and the high-performance libraries under them. I design, ship, and maintain each one in the open, solo and fully tested — led by pdf-reader-mcp, used by thousands."
      />

      {/* Aggregate proof — mono numbers, single source of truth */}
      <Reveal delay={0.05}>
        <dl className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
          {proof.map((stat) => (
            <div key={stat.label} className="bg-surface p-4 sm:p-5">
              <dt className="font-mono text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                {stat.display}
              </dt>
              <dd className="mt-1 text-xs text-text-tertiary">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* Flagship: pdf-reader-mcp */}
      {flagship && (
        <Reveal delay={0.1}>
          <article className="card mt-6 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col-reverse gap-7 lg:flex-row lg:gap-10">
              <div className="lg:flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="badge">
                    <FaGithub className="h-3.5 w-3.5" /> Flagship
                  </span>
                  <span className="font-mono text-xs text-text-tertiary">
                    {formatProjectPeriod(flagship)} · {flagship.role}
                  </span>
                </div>

                <h3 className="text-h3 mt-4 text-text-primary">{flagship.title}</h3>
                <p className="mt-3 max-w-xl text-text-secondary">
                  {cleanDescription(flagship.description)}
                </p>

                {flagshipBullets.length > 0 && (
                  <ul className="mt-6 space-y-2.5">
                    {flagshipBullets.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {flagship.skills.slice(0, 6).map((skill) => (
                    <span key={skill} className="chip">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  {flagship.urls?.repository && (
                    <a
                      href={flagship.urls.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary btn-md"
                    >
                      <FaGithub className="h-[18px] w-[18px]" /> View source
                    </a>
                  )}
                  {flagship.urls?.documentation && (
                    <a
                      href={flagship.urls.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary btn-md"
                    >
                      <SiNpm className="h-[18px] w-[18px]" /> npm package
                    </a>
                  )}
                </div>
              </div>

              {/* Star highlight */}
              <div className="lg:w-52 lg:shrink-0">
                <div className="flex items-center gap-4 rounded-2xl border border-accent/20 bg-accent-subtle p-5 lg:h-full lg:flex-col lg:items-start lg:justify-center lg:gap-1">
                  <FaStar className="h-6 w-6 shrink-0 text-accent lg:h-7 lg:w-7" />
                  <div>
                    <div className="font-mono text-4xl font-semibold tracking-tight text-accent lg:text-5xl">
                      {STATS.flagshipStars.display}
                    </div>
                    <div className="mt-0.5 text-xs text-text-tertiary">GitHub stars</div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      )}

      {/* More open-source work */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((project, i) => {
          const repo = project.urls?.repository;
          if (!repo) return null;
          return (
            <Reveal key={project.id} delay={0.05 + i * 0.05}>
              <Link
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} on GitHub`}
                className="card card-hover group flex h-full flex-col p-5 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold tracking-tight text-text-primary transition-colors group-hover:text-accent">
                    {project.title}
                  </h3>
                  <FaArrowUpRightFromSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-tertiary transition-colors group-hover:text-accent" />
                </div>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
                  {cleanDescription(project.description)}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      {/* View all */}
      <Reveal delay={0.1}>
        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
          <a
            href={PERSONAL_INFO.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-md"
          >
            <FaGithub className="h-[18px] w-[18px] " /> View all repositories on GitHub
            <FaArrowRight className="h-3.5 w-3.5" />
          </a>
          <span className="font-mono text-xs text-text-tertiary">
            @shtse8 · org work on{" "}
            <Link href={GITHUB_ORG} target="_blank" rel="noopener noreferrer" className="link">
              SylphxAI
            </Link>
          </span>
        </div>
      </Reveal>
    </div>
  );
}
