"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGithub, FaStar, FaArrowRight, FaExternalLinkAlt, FaCodeBranch, FaNpm, FaDownload } from 'react-icons/fa';
import { PROJECTS } from '@/data/projects';
import { GITHUB_STATS } from '@/data/personal';
import { cn } from '@/lib/utils';

// Aggregate stats for the section
const AGGREGATE_STATS = [
  { value: '500+', label: 'Total Stars', icon: FaStar },
  { value: '106', label: 'Repositories', icon: FaCodeBranch },
  { value: '15+', label: 'npm Packages', icon: FaNpm },
];

export default function OpenSource() {
  // Filter for open source projects
  const { featuredProject, otherProjects } = useMemo(() => {
    const osProjects = PROJECTS.filter(
      (p) => p.category === 'Open Source' || p.category === 'Frameworks & Libraries' || p.category === 'AI & ML'
    );

    // Sort by stars (extracted from description)
    const withStars = osProjects.map(p => {
      const match = p.description.match(/(\d+)\+?\s*(?:GitHub\s*)?stars?/i);
      return { project: p, stars: match ? parseInt(match[1]) : 0 };
    }).sort((a, b) => b.stars - a.stars);

    return {
      featuredProject: withStars[0],
      otherProjects: withStars.slice(1, 7)
    };
  }, []);

  // Extract stars from description
  const getStars = (description: string) => {
    const match = description.match(/(\d+)\+?\s*(?:GitHub\s*)?stars?/i);
    return match ? parseInt(match[1]) : null;
  };

  const cleanDescription = (description: string) => {
    return description.replace(/\d+\+?\s*(?:GitHub\s*)?stars?\.?\s*/i, '').trim();
  };

  // Get project language/category tag
  const getProjectTag = (project: typeof PROJECTS[number]) => {
    if (project.skills?.includes('typescript')) return { label: 'TypeScript', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' };
    if (project.skills?.includes('python')) return { label: 'Python', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400' };
    if (project.skills?.includes('dart')) return { label: 'Dart', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400' };
    return { label: 'Open Source', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' };
  };

  return (
    <section
      id="open-source"
      className="py-24 px-6"
      aria-labelledby="opensource-heading"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 id="opensource-heading" className="text-3xl md:text-4xl font-medium tracking-tight text-text-primary mb-4">
            Open Source
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Building tools and libraries that help developers work faster.
          </p>
        </motion.div>

        {/* Aggregate stats */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-12 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {AGGREGATE_STATS.map((stat, index) => (
            <div key={stat.label} className="text-center p-3">
              <stat.icon className="w-5 h-5 text-accent mx-auto mb-2" />
              <div className="text-xl font-medium text-text-primary">{stat.value}</div>
              <div className="text-xs text-text-tertiary">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Featured project - large card */}
        {featuredProject && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Link
              href={featuredProject.project.urls?.repository || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 md:p-8 bg-gradient-to-br from-accent/5 to-accent/10 dark:from-accent/10 dark:to-accent/5 border border-accent/20 rounded-xl hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-medium">
                      Featured
                    </span>
                    {(() => {
                      const tag = getProjectTag(featuredProject.project);
                      return (
                        <span className={cn("text-xs px-2 py-1 rounded-full", tag.color)}>
                          {tag.label}
                        </span>
                      );
                    })()}
                  </div>
                  <h3 className="text-xl md:text-2xl font-medium text-text-primary group-hover:text-accent transition-colors duration-150 mb-2">
                    {featuredProject.project.title}
                    <FaExternalLinkAlt className="inline-block w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-text-secondary mb-4 leading-relaxed">
                    {cleanDescription(featuredProject.project.description)}
                  </p>

                  {/* Key features from details */}
                  {featuredProject.project.details && Array.isArray(featuredProject.project.details) && featuredProject.project.details.length > 0 && (
                    <ul className="space-y-1 mb-4">
                      {featuredProject.project.details.slice(0, 3).map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {featuredProject.project.skills.slice(0, 5).map(skill => (
                      <span key={skill} className="px-2.5 py-1 bg-surface border border-border rounded-md text-xs text-text-secondary">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex md:flex-col items-center gap-4 md:gap-2 md:text-right">
                  {featuredProject.stars > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-lg">
                      <FaStar className="w-5 h-5 text-accent" />
                      <span className="text-xl font-medium text-accent">{featuredProject.stars}+</span>
                    </div>
                  )}
                  <span className="text-sm text-text-tertiary">GitHub Stars</span>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Other projects - compact grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {otherProjects.map((item, index) => {
            const stars = getStars(item.project.description);
            const repoUrl = item.project.urls?.repository;
            const tag = getProjectTag(item.project);

            return (
              <motion.div
                key={item.project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={repoUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group block p-4 rounded-lg border border-border bg-surface h-full",
                    "hover:border-accent/30 hover:shadow-md transition-all duration-200"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-medium text-text-primary group-hover:text-accent transition-colors duration-150 truncate">
                          {item.project.title}
                        </h3>
                      </div>
                      <span className={cn("inline-block text-xs px-2 py-0.5 rounded-full mb-2", tag.color)}>
                        {tag.label}
                      </span>
                    </div>
                    {stars && (
                      <div className="flex items-center gap-1 text-text-tertiary shrink-0">
                        <FaStar className="w-3.5 h-3.5 text-yellow-500" />
                        <span className="text-sm font-medium">{stars}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary line-clamp-2">
                    {cleanDescription(item.project.description)}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View all link */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href={`https://github.com/${GITHUB_STATS.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-accent bg-accent-subtle rounded-lg hover:bg-accent hover:text-white transition-colors duration-200"
          >
            <FaGithub className="w-4 h-4" />
            View all {GITHUB_STATS.totalRepos} repositories
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
