"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useMemo } from 'react';
import { FaGithub, FaStar, FaExternalLinkAlt, FaNpm, FaRocket } from 'react-icons/fa';
import { PROJECTS } from '@/data/projects';
import { GITHUB_STATS } from '@/data/personal';
import GitHubStats from './GitHubStats';

interface ProjectCardProps {
  project: typeof PROJECTS[number];
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const repoUrl = project.urls?.repository;
  const npmUrl = project.urls?.documentation;

  // Extract metrics from description if available
  const starsMatch = project.description.match(/(\d+)\+?\s*(?:GitHub\s*)?stars?/i);
  const stars = starsMatch ? starsMatch[1] : null;

  const speedMatch = project.description.match(/(\d+(?:\.\d+)?(?:-\d+(?:\.\d+)?)?x)\s*faster/i);
  const speedBoost = speedMatch ? speedMatch[1] : null;

  return (
    <motion.div
      className="group relative p-5 rounded-xl bg-white/60 dark:bg-gray-800/40
                 border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm
                 hover:border-blue-200 dark:hover:border-blue-700/50
                 hover:shadow-lg hover:shadow-blue-500/5
                 transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      {/* Category Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30
                       text-blue-600 dark:text-blue-400 font-medium">
          {project.category}
        </span>
        {stars && (
          <div className="flex items-center gap-1 text-yellow-500">
            <FaStar className="w-3 h-3" />
            <span className="text-xs font-medium">{stars}+</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2
                   group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {project.description.replace(/\d+\+?\s*(?:GitHub\s*)?stars?\.?\s*/i, '')}
      </p>

      {/* Performance Badge */}
      {speedBoost && (
        <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-green-50 dark:bg-green-900/20
                       border border-green-100 dark:border-green-800/30">
          <FaRocket className="w-3 h-3 text-green-500" />
          <span className="text-xs font-medium text-green-600 dark:text-green-400">
            {speedBoost} faster than alternatives
          </span>
        </div>
      )}

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700/50
                     text-gray-600 dark:text-gray-400"
          >
            {skill}
          </span>
        ))}
        {project.skills.length > 4 && (
          <span className="text-xs px-2 py-0.5 text-gray-400">
            +{project.skills.length - 4}
          </span>
        )}
      </div>

      {/* Links */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900
                     dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <FaGithub className="w-3.5 h-3.5" />
            <span>Source</span>
          </a>
        )}
        {npmUrl && (
          <a
            href={npmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500
                     dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          >
            <FaNpm className="w-3.5 h-3.5" />
            <span>NPM</span>
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default function OpenSource() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Filter for open source and framework projects
  const openSourceProjects = useMemo(() => {
    return PROJECTS.filter(
      (p) => p.category === 'Open Source' || p.category === 'Frameworks & Libraries'
    ).slice(0, 6); // Show top 6
  }, []);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [60, 0, 0, 60]);

  return (
    <motion.section
      id="open-source"
      ref={sectionRef}
      className="w-full relative py-16 md:py-24 overflow-hidden"
      style={{ opacity, y }}
      aria-labelledby="opensource-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent" />
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
          <div className="h-full w-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                       bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400
                       text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <FaGithub className="w-4 h-4" />
            <span>Open Source</span>
          </motion.div>

          <motion.h2
            id="opensource-heading"
            className="text-3xl sm:text-4xl font-light mb-5 tracking-wide text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Building the <span className="text-blue-600 dark:text-blue-400">Developer Ecosystem</span>
          </motion.h2>

          <motion.p
            className="text-gray-600 dark:text-gray-400 text-base sm:text-lg font-light max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Founder of <a href="https://github.com/SylphxAI" target="_blank" rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">@SylphxAI</a>,
            creating high-performance tools and frameworks that help developers build faster.
          </motion.p>

          {/* Divider */}
          <motion.div
            className="w-20 h-0.5 bg-blue-500 dark:bg-blue-400 mx-auto rounded-full mt-8"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </motion.div>

        {/* GitHub Stats */}
        <div className="max-w-3xl mx-auto mb-16">
          <GitHubStats />
        </div>

        {/* Featured Projects */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-8">
            Featured Open Source Projects
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {openSourceProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </motion.div>

        {/* View All Link */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <a
            href={`https://github.com/${GITHUB_STATS.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                     bg-gray-900 dark:bg-white text-white dark:text-gray-900
                     hover:bg-gray-800 dark:hover:bg-gray-100
                     transition-colors duration-300 font-medium"
          >
            <FaGithub className="w-5 h-5" />
            <span>View All {GITHUB_STATS.totalRepos} Repositories</span>
            <FaExternalLinkAlt className="w-3 h-3 opacity-60" />
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
}
