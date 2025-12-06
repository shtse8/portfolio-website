"use client";

import { useCallback } from 'react';
import { FaGithub, FaArrowRight, FaArrowDown } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data/personal';
import { motion } from 'framer-motion';

export default function Hero() {
  const scrollToProjects = useCallback(() => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToNextSection = useCallback(() => {
    const nextSection = document.getElementById('tech-stack');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6"
      aria-label="Introduction"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent-subtle/30 to-transparent dark:from-accent-subtle/10" />

      <div className="w-full max-w-3xl mx-auto text-center">
        {/* Name */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight text-text-primary mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}
        </motion.h1>

        {/* Role */}
        <motion.p
          className="text-xl sm:text-2xl text-text-secondary mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {PERSONAL_INFO.title}
        </motion.p>

        {/* Tagline */}
        {PERSONAL_INFO.tagline && (
          <motion.p
            className="text-base sm:text-lg text-text-tertiary max-w-xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {PERSONAL_INFO.tagline}
          </motion.p>
        )}

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={scrollToProjects}
            className="btn-primary inline-flex items-center gap-2 px-6 py-3"
          >
            View Projects
            <FaArrowRight className="w-3.5 h-3.5" />
          </button>

          <a
            href={PERSONAL_INFO.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2 px-6 py-3"
          >
            <FaGithub className="w-4 h-4" />
            GitHub
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <button
          onClick={scrollToNextSection}
          className="flex flex-col items-center gap-3 text-text-tertiary hover:text-text-secondary transition-colors duration-150"
          aria-label="Scroll to next section"
        >
          <span className="w-px h-12 bg-border" />
          <FaArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </button>
      </motion.div>
    </section>
  );
}
