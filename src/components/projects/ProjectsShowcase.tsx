"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaGooglePlay, FaAppStoreIos, FaChevronDown, FaGamepad, FaGlobe, FaLink, FaCube, FaTools } from 'react-icons/fa';
import { PROJECTS } from '@/data/projects';
import type { Project } from '@/data/types';
import { useModalManager } from '@/hooks/useModalManager';
import ProjectModal from './ProjectModal';
import CompanyModal from '../shared/CompanyModal';
import { parseMarkdownLinks } from './utils';
import { getSkillNames } from '@/utils/skillHelpers';
import ProjectImage from '@/components/shared/ProjectImage';
import { ORGANIZATIONS } from '@/data/organizations';
import { cn } from '@/lib/utils';

// Categories for the Projects section (excluding open source which has its own section)
const PROJECT_CATEGORIES = [
  { id: 'games', label: 'Games', icon: FaGamepad, filter: (p: Project) => p.category === 'Mobile Games' },
  { id: 'web', label: 'Web Apps', icon: FaGlobe, filter: (p: Project) => p.category === 'Web Apps' },
  { id: 'blockchain', label: 'Blockchain', icon: FaLink, filter: (p: Project) => p.category === 'Blockchain' },
  { id: 'tools', label: 'Tools', icon: FaTools, filter: (p: Project) => p.category === 'Tools & Utilities' },
] as const;

// Filter out Open Source and Frameworks & Libraries (they have their own section)
const DISPLAY_PROJECTS = PROJECTS.filter(
  p => p.category !== 'Open Source' &&
       p.category !== 'Frameworks & Libraries' &&
       p.category !== 'AI & ML'
);

// Get featured projects (those with images or notable metrics)
function getFeaturedProjects(projects: Project[]): Project[] {
  return projects
    .filter(p => p.images && p.images.length > 0)
    .sort((a, b) => {
      // Prioritize by: has live URL, has app store links, description length
      const scoreA = (a.urls?.googlePlay ? 2 : 0) + (a.urls?.appStore ? 2 : 0) + (a.urls?.website ? 1 : 0);
      const scoreB = (b.urls?.googlePlay ? 2 : 0) + (b.urls?.appStore ? 2 : 0) + (b.urls?.website ? 1 : 0);
      return scoreB - scoreA;
    })
    .slice(0, 6);
}

export default function ProjectsShowcase() {
  const { openProject, openCompany } = useModalManager();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Get projects organized by category
  const projectsByCategory = useMemo(() => {
    const result: Record<string, { featured: Project[]; others: Project[] }> = {};

    PROJECT_CATEGORIES.forEach(cat => {
      const categoryProjects = DISPLAY_PROJECTS.filter(cat.filter);
      const featured = getFeaturedProjects(categoryProjects).slice(0, 3);
      const featuredIds = new Set(featured.map(p => p.id));
      const others = categoryProjects.filter(p => !featuredIds.has(p.id));

      result[cat.id] = { featured, others };
    });

    return result;
  }, []);

  // Get overall featured projects (hero section)
  const heroProjects = useMemo(() => {
    return getFeaturedProjects(DISPLAY_PROJECTS).slice(0, 3);
  }, []);

  // Modal handlers
  const handleOpenProject = (project: Project) => {
    openProject(ProjectModal, {
      project,
      openCompanyModal: (id: string) => handleOpenCompany(id),
      openExperienceModal: () => { window.location.href = '/#experience'; },
      parseMarkdownLinks,
      closeModal: () => {},
      nextProject: () => {},
      prevProject: () => {}
    }, {
      modalKey: project.id
    });
  };

  const handleOpenCompany = (companyId: string) => {
    openCompany(CompanyModal, {
      company: ORGANIZATIONS[companyId],
      closeModal: () => {},
      openProjectModal: () => {}
    }, {
      modalKey: companyId
    });
  };

  return (
    <section
      id="projects"
      className="py-24 px-6"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 id="projects-heading" className="text-3xl md:text-4xl font-medium tracking-tight text-text-primary mb-4">
            Projects
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Games, web applications, and tools I've built over the years.
          </p>
        </motion.div>

        {/* Hero featured projects - large cards */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-6">
            Featured
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {heroProjects.map((project, index) => (
              <FeaturedProjectCard
                key={project.id}
                project={project}
                index={index}
                onClick={() => handleOpenProject(project)}
              />
            ))}
          </div>
        </motion.div>

        {/* Projects by category */}
        <div className="space-y-12">
          {PROJECT_CATEGORIES.map((category, catIndex) => {
            const { featured, others } = projectsByCategory[category.id];
            const totalCount = featured.length + others.length;
            const isExpanded = expandedCategory === category.id;
            const Icon = category.icon;

            if (totalCount === 0) return null;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: catIndex * 0.05 }}
              >
                {/* Category header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-text-tertiary" />
                    <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider">
                      {category.label}
                    </h3>
                    <span className="text-xs text-text-tertiary bg-surface-elevated px-2 py-0.5 rounded-full">
                      {totalCount}
                    </span>
                  </div>
                </div>

                {/* Featured projects in this category */}
                <div className="grid md:grid-cols-3 gap-3 mb-3">
                  {featured.map((project, index) => (
                    <CompactProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      onClick={() => handleOpenProject(project)}
                    />
                  ))}
                </div>

                {/* Expandable list for other projects */}
                {others.length > 0 && (
                  <>
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 py-2 text-sm",
                        "text-text-tertiary hover:text-text-secondary transition-colors"
                      )}
                    >
                      <span>{isExpanded ? 'Show less' : `Show ${others.length} more`}</span>
                      <FaChevronDown className={cn(
                        "w-3 h-3 transition-transform duration-300",
                        isExpanded && "rotate-180"
                      )} />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="grid md:grid-cols-2 gap-2 pt-2">
                            {others.map((project) => (
                              <MiniProjectCard
                                key={project.id}
                                project={project}
                                onClick={() => handleOpenProject(project)}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Featured project card (large, with image)
function FeaturedProjectCard({
  project,
  index,
  onClick
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl cursor-pointer",
        "bg-surface border border-border hover:border-accent/30",
        "hover:shadow-lg transition-all duration-300"
      )}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <ProjectImage
          src={project.images}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* App store badges */}
        <div className="absolute top-2 right-2 flex gap-1">
          {project.urls?.googlePlay && (
            <span className="p-1.5 bg-black/50 rounded-full backdrop-blur-sm">
              <FaGooglePlay className="w-3 h-3 text-white" />
            </span>
          )}
          {project.urls?.appStore && (
            <span className="p-1.5 bg-black/50 rounded-full backdrop-blur-sm">
              <FaAppStoreIos className="w-3 h-3 text-white" />
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-medium text-text-primary group-hover:text-accent transition-colors mb-1 line-clamp-1">
          {project.title}
        </h4>
        <p className="text-sm text-text-secondary line-clamp-2 mb-3">
          {project.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1">
          {getSkillNames(project.skills || []).slice(0, 3).map((skill, i) => (
            <span key={i} className="text-xs px-2 py-0.5 bg-surface-elevated rounded text-text-tertiary">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Compact project card (medium size, for category sections)
function CompactProjectCard({
  project,
  index,
  onClick
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex gap-3 p-3 rounded-lg cursor-pointer",
        "bg-surface border border-border hover:border-accent/30",
        "hover:shadow-md transition-all duration-200"
      )}
    >
      {/* Thumbnail */}
      {project.images && project.images.length > 0 && (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
          <ProjectImage
            src={project.images}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-text-primary group-hover:text-accent transition-colors line-clamp-1">
          {project.title}
        </h4>
        <p className="text-xs text-text-tertiary line-clamp-2 mt-0.5">
          {project.description}
        </p>

        {/* Links */}
        <div className="flex items-center gap-2 mt-2">
          {project.urls?.googlePlay && (
            <FaGooglePlay className="w-3 h-3 text-text-tertiary" />
          )}
          {project.urls?.appStore && (
            <FaAppStoreIos className="w-3 h-3 text-text-tertiary" />
          )}
          {project.urls?.website && (
            <FaExternalLinkAlt className="w-2.5 h-2.5 text-text-tertiary" />
          )}
          {project.urls?.repository && (
            <FaGithub className="w-3 h-3 text-text-tertiary" />
          )}
        </div>
      </div>
    </div>
  );
}

// Mini project card (for expanded list)
function MiniProjectCard({
  project,
  onClick
}: {
  project: Project;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 p-2 rounded-lg cursor-pointer",
        "hover:bg-surface-elevated transition-colors duration-200"
      )}
    >
      {/* Thumbnail or placeholder */}
      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-elevated border border-border">
        {project.images && project.images.length > 0 ? (
          <ProjectImage
            src={project.images}
            alt={project.title}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaCube className="w-4 h-4 text-text-tertiary" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm text-text-primary group-hover:text-accent transition-colors line-clamp-1">
          {project.title}
        </h4>
        <p className="text-xs text-text-tertiary line-clamp-1">
          {project.period?.start ? new Date(project.period.start).getFullYear() : ''}
          {project.period?.end ? ` — ${new Date(project.period.end).getFullYear()}` : ' — Present'}
        </p>
      </div>

      {/* Links indicator */}
      <div className="flex items-center gap-1 shrink-0">
        {(project.urls?.googlePlay || project.urls?.appStore) && (
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Available on app stores" />
        )}
      </div>
    </div>
  );
}
