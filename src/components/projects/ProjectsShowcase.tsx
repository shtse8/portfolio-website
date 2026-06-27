"use client";

import { useMemo, useState } from "react";
import { PROJECTS } from "@/data/projects";
import type { Project } from "@/data/types";
import { ORGANIZATIONS } from "@/data/organizations";
import { useModalManager } from "@/hooks/useModalManager";
import { cn } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import CompanyModal from "../shared/CompanyModal";
import { parseMarkdownLinks } from "./utils";

/** Curated category order — only those with projects are rendered as chips. */
const CATEGORY_ORDER = [
  "All",
  "Mobile Games",
  "Web Apps",
  "Frameworks & Libraries",
  "AI & ML",
  "Blockchain",
  "Tools & Utilities",
  "Open Source",
] as const;

const INITIAL_VISIBLE = 9;
const STEP = 9;

/** Lead with the strongest signal: shipped, image-rich, linked work first. */
function curationScore(p: Project): number {
  let score = 0;
  if (p.images && p.images.length > 0) score += 4;
  if (p.urls?.googlePlay || p.urls?.appStore) score += 3;
  if (p.urls?.website || p.liveUrl) score += 2;
  if (p.urls?.repository || p.github) score += 1;
  return score;
}

export default function ProjectsShowcase() {
  const { openProject, openCompany } = useModalManager();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  const categories = useMemo(
    () => CATEGORY_ORDER.filter((c) => c === "All" || PROJECTS.some((p) => p.category === c)),
    []
  );

  const filtered = useMemo(() => {
    const list =
      activeCategory === "All"
        ? PROJECTS
        : PROJECTS.filter((p) => p.category === activeCategory);
    return [...list].sort((a, b) => curationScore(b) - curationScore(a));
  }, [activeCategory]);

  const shown = filtered.slice(0, visible);
  const remaining = filtered.length - shown.length;

  const handleFilter = (category: string) => {
    setActiveCategory(category);
    setVisible(INITIAL_VISIBLE);
  };

  const handleOpenCompany = (companyId: string) => {
    openCompany(
      CompanyModal,
      { company: ORGANIZATIONS[companyId], closeModal: () => {}, openProjectModal: () => {} },
      { modalKey: companyId }
    );
  };

  // Open a project's modal, wiring prev/next to cycle the current filtered set.
  const openAt = (list: Project[], index: number) => {
    const project = list[index];
    const goNext = () => openAt(list, (index + 1) % list.length);
    const goPrev = () => openAt(list, (index - 1 + list.length) % list.length);

    openProject(
      ProjectModal,
      {
        project,
        openCompanyModal: handleOpenCompany,
        openExperienceModal: () => {
          window.location.href = "/#experience";
        },
        parseMarkdownLinks,
        closeModal: () => {},
        nextProject: goNext,
        prevProject: goPrev,
      },
      { modalKey: project.id, hasNavigation: list.length > 1, onNext: goNext, onPrevious: goPrev }
    );
  };

  return (
    <div className="container-content">
      <SectionHeader
        index="04"
        eyebrow="Projects"
        title="Selected work"
        description="Two decades of shipped products — mobile games with millions of players, web platforms, developer tools, and open-source libraries. Pick a lane, or browse it all."
      />

      {/* Filter bar */}
      <Reveal delay={0.05}>
        <div className="mt-10 flex flex-wrap items-center gap-2">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleFilter(category)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors duration-150",
                  isActive
                    ? "border-accent bg-accent text-accent-contrast"
                    : "border-border bg-surface text-text-secondary hover:border-text-tertiary hover:text-text-primary"
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      </Reveal>

      <p className="mt-4 font-mono text-xs text-text-tertiary">
        {filtered.length} {filtered.length === 1 ? "project" : "projects"}
      </p>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((project, i) => (
          <Reveal key={`${activeCategory}-${project.id}`} delay={(i % 3) * 0.05} className="h-full">
            <ProjectCard project={project} onOpen={() => openAt(filtered, filtered.indexOf(project))} />
          </Reveal>
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-10 flex justify-center">
          <button type="button" onClick={() => setVisible((v) => v + STEP)} className="btn-secondary btn-md">
            Show more
            <span className="font-mono text-xs text-text-tertiary">+{Math.min(STEP, remaining)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
