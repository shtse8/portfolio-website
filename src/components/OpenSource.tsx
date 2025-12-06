"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGithub, FaStar, FaArrowRight } from 'react-icons/fa';
import { PROJECTS } from '@/data/projects';
import { GITHUB_STATS } from '@/data/personal';

export default function OpenSource() {
  // Filter for open source projects
  const openSourceProjects = useMemo(() => {
    return PROJECTS.filter(
      (p) => p.category === 'Open Source' || p.category === 'Frameworks & Libraries'
    ).slice(0, 6);
  }, []);

  // Extract stars from description
  const getStars = (description: string) => {
    const match = description.match(/(\d+)\+?\s*(?:GitHub\s*)?stars?/i);
    return match ? match[1] : null;
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

        {/* Projects list */}
        <div className="space-y-4 mb-12">
          {openSourceProjects.map((project, index) => {
            const stars = getStars(project.description);
            const repoUrl = project.urls?.repository;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {repoUrl ? (
                  <Link
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 p-4 -mx-4 rounded-lg hover:bg-surface-elevated transition-colors duration-150"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-medium text-text-primary group-hover:text-accent transition-colors duration-150">
                          {project.title}
                        </h3>
                        {stars && (
                          <span className="inline-flex items-center gap-1 text-xs text-text-tertiary">
                            <FaStar className="w-3 h-3" />
                            {stars}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-1">
                        {project.description.replace(/\d+\+?\s*(?:GitHub\s*)?stars?\.?\s*/i, '')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-tertiary">
                      {project.skills.slice(0, 2).map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-surface border border-border rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-start gap-4 p-4 -mx-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-medium text-text-primary">
                          {project.title}
                        </h3>
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-1">
                        {project.description}
                      </p>
                    </div>
                  </div>
                )}
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
            className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors duration-150"
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
