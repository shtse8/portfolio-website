"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGithub, FaStar, FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';
import { PROJECTS } from '@/data/projects';
import { GITHUB_STATS } from '@/data/personal';
import { cn } from '@/lib/utils';

export default function OpenSource() {
  // Filter for open source projects
  const { featuredProject, otherProjects } = useMemo(() => {
    const osProjects = PROJECTS.filter(
      (p) => p.category === 'Open Source' || p.category === 'Frameworks & Libraries'
    );

    // Sort by stars (extracted from description)
    const withStars = osProjects.map(p => {
      const match = p.description.match(/(\d+)\+?\s*(?:GitHub\s*)?stars?/i);
      return { project: p, stars: match ? parseInt(match[1]) : 0 };
    }).sort((a, b) => b.stars - a.stars);

    return {
      featuredProject: withStars[0],
      otherProjects: withStars.slice(1, 6)
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

  return (
    <section
      id="open-source"
      className="py-24 px-6"
      aria-labelledby="opensource-heading"
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
          <h2 id="opensource-heading" className="text-3xl md:text-4xl font-medium tracking-tight text-text-primary mb-4">
            Open Source
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Building tools and libraries that help developers work faster.
          </p>
        </motion.div>

        {/* Featured project - large card */}
        {featuredProject && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link
              href={featuredProject.project.urls?.repository || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 md:p-8 bg-surface border border-border rounded-xl hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl md:text-2xl font-medium text-text-primary group-hover:text-accent transition-colors duration-150">
                      {featuredProject.project.title}
                    </h3>
                    <FaExternalLinkAlt className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-text-secondary mb-4 leading-relaxed">
                    {cleanDescription(featuredProject.project.description)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {featuredProject.project.skills.slice(0, 4).map(skill => (
                      <span key={skill} className="px-2.5 py-1 bg-surface-elevated border border-border rounded-md text-xs text-text-secondary">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex md:flex-col items-center gap-4 md:gap-2 md:text-right">
                  {featuredProject.stars > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-accent-subtle rounded-lg">
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

        {/* Other projects - compact list with visual hierarchy */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {otherProjects.map((item, index) => {
            const stars = getStars(item.project.description);
            const repoUrl = item.project.urls?.repository;

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
                    "group block p-4 rounded-lg border border-border bg-surface",
                    "hover:border-accent/30 hover:bg-surface-elevated transition-all duration-200"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-text-primary group-hover:text-accent transition-colors duration-150 mb-1">
                        {item.project.title}
                      </h3>
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {cleanDescription(item.project.description)}
                      </p>
                    </div>
                    {stars && (
                      <div className="flex items-center gap-1 text-text-tertiary shrink-0">
                        <FaStar className="w-3.5 h-3.5" />
                        <span className="text-sm font-medium">{stars}</span>
                      </div>
                    )}
                  </div>
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
            View all on GitHub
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
