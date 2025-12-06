"use client";

import { useCallback, useState, useEffect } from 'react';
import { FaGithub, FaArrowRight, FaArrowDown, FaStar, FaDownload, FaCode, FaClock } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data/personal';
import { motion } from 'framer-motion';

// Key stats to display
const HERO_STATS = [
  { value: '18+', label: 'Years Experience', icon: FaClock },
  { value: '10M+', label: 'App Downloads', icon: FaDownload },
  { value: '500+', label: 'GitHub Stars', icon: FaStar },
  { value: '4.6K+', label: 'Commits', icon: FaCode },
];

// Roles for typewriter effect
const ROLES = PERSONAL_INFO.roles || [
  "Technical Founder",
  "Open Source Creator",
  "Full Stack Developer"
];

export default function Hero() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect for roles
  useEffect(() => {
    const currentRole = ROLES[currentRoleIndex];
    const typeSpeed = isDeleting ? 30 : 50;
    const pauseTime = isDeleting ? 500 : 2000;

    if (!isDeleting && displayedText === currentRole) {
      // Pause before deleting
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayedText === '') {
      // Move to next role
      setIsDeleting(false);
      setCurrentRoleIndex((prev) => (prev + 1) % ROLES.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedText(prev =>
        isDeleting
          ? prev.slice(0, -1)
          : currentRole.slice(0, prev.length + 1)
      );
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentRoleIndex]);

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

      <div className="w-full max-w-4xl mx-auto text-center">
        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 text-sm"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Available for new opportunities
        </motion.div>

        {/* Name */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight text-text-primary mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}
        </motion.h1>

        {/* Animated role with typewriter */}
        <motion.div
          className="h-8 sm:h-10 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <span className="text-xl sm:text-2xl text-accent font-medium">
            {displayedText}
            <span className="animate-pulse">|</span>
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {PERSONAL_INFO.tagline}
        </motion.p>

        {/* Key stats */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {HERO_STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
            >
              <div className="p-4 rounded-xl bg-surface border border-border group-hover:border-accent/30 transition-colors">
                <stat.icon className="w-4 h-4 text-accent mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-medium text-text-primary">
                  {stat.value}
                </div>
                <div className="text-xs text-text-tertiary">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <button
          onClick={scrollToNextSection}
          className="flex flex-col items-center gap-2 text-text-tertiary hover:text-text-secondary transition-colors duration-150"
          aria-label="Scroll to next section"
        >
          <span className="text-xs uppercase tracking-wider">Explore</span>
          <FaArrowDown className="w-3 h-3 animate-bounce" />
        </button>
      </motion.div>
    </section>
  );
}
