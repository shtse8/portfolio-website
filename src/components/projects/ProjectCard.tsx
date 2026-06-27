"use client";

import { FaGithub, FaGooglePlay, FaAppStoreIos } from "react-icons/fa";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import type { IconType } from "react-icons";
import type { Project } from "@/data/types";
import { formatProjectPeriod } from "@/data";
import { getSkillNames } from "@/utils/skillHelpers";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  onOpen: () => void;
};

/** Initials for the no-image monogram (handles latin + CJK titles). */
function getMonogram(title: string): string {
  const words = title.split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map((w) => w.charAt(0)).join("");
  return (initials || title.charAt(0)).toUpperCase();
}

export default function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const image = project.images?.[0];
  const period = formatProjectPeriod(project);
  const techs = getSkillNames(project.skills ?? []).slice(0, 3);

  const links: { icon: IconType; label: string }[] = [];
  if (project.urls?.googlePlay) links.push({ icon: FaGooglePlay, label: "Google Play" });
  if (project.urls?.appStore) links.push({ icon: FaAppStoreIos, label: "App Store" });
  if (project.urls?.repository || project.github) links.push({ icon: FaGithub, label: "Repository" });
  if (project.urls?.website || project.liveUrl) links.push({ icon: FaArrowUpRightFromSquare, label: "Website" });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${project.title}`}
      className={cn(
        "card card-hover group flex h-full cursor-pointer flex-col overflow-hidden text-left",
        "transition-transform duration-200 hover:-translate-y-1"
      )}
    >
      {/* Media — image or tasteful monogram block */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border-subtle bg-surface-sunken">
        {image ? (
          <img
            src={image}
            alt=""
            width={640}
            height={400}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-subtle via-surface-sunken to-surface"
          >
            <span className="font-mono text-4xl font-semibold tracking-tight text-accent/60 sm:text-5xl">
              {getMonogram(project.title)}
            </span>
          </div>
        )}

        {links.length > 0 && (
          <div className="absolute right-3 top-3 flex gap-1.5">
            {links.slice(0, 3).map(({ icon: Icon, label }) => (
              <span
                key={label}
                title={label}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface/85 text-text-secondary backdrop-blur-sm"
              >
                <Icon className="h-3 w-3" />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="badge">{project.category}</span>
          {period && <span className="font-mono text-xs text-text-tertiary">{period}</span>}
        </div>

        <h3 className="mt-3 text-base font-semibold tracking-tight text-text-primary transition-colors group-hover:text-accent line-clamp-1 sm:text-lg">
          {project.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary line-clamp-2">
          {project.description}
        </p>

        {techs.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {techs.map((tech) => (
              <span key={tech} className="chip">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
