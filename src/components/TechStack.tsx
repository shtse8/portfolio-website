"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { getSkills } from '@/data/skills';
import { cn } from '@/lib/utils';
import { getSkillUrl } from '@/lib/skillUrls';

// Category display names
const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  devops: 'DevOps & Cloud',
  ai: 'AI & ML',
  game: 'Game Development',
  mobile: 'Mobile',
  database: 'Databases',
  blockchain: 'Blockchain',
};

// Get visual size based on years of experience - creates hierarchy
function getSkillStyle(years: number) {
  if (years >= 12) return {
    size: 'text-lg px-4 py-2',
    weight: 'font-medium',
    opacity: 'opacity-100',
    accent: true
  };
  if (years >= 8) return {
    size: 'text-base px-3.5 py-1.5',
    weight: 'font-medium',
    opacity: 'opacity-95',
    accent: true
  };
  if (years >= 5) return {
    size: 'text-sm px-3 py-1.5',
    weight: 'font-normal',
    opacity: 'opacity-90',
    accent: false
  };
  if (years >= 3) return {
    size: 'text-sm px-2.5 py-1',
    weight: 'font-normal',
    opacity: 'opacity-75',
    accent: false
  };
  return {
    size: 'text-xs px-2 py-0.5',
    weight: 'font-normal',
    opacity: 'opacity-60',
    accent: false
  };
}

export default function TechStack() {
  const skills = getSkills();

  // Split into featured (top 10 by experience) and grouped by category
  const { featuredSkills, skillsByCategory, sortedCategories } = useMemo(() => {
    const sorted = [...skills].sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
    const featured = sorted.slice(0, 10);
    const featuredIds = new Set(featured.map(s => s.id));

    // Group all skills by category
    const grouped: Record<string, typeof skills> = {};
    skills.forEach(skill => {
      const category = skill.category;
      if (!CATEGORY_LABELS[category]) return;
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(skill);
    });

    // Sort within categories by experience
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
    });

    // Sort categories by total experience
    const sortedCats = Object.keys(grouped).sort((a, b) => {
      const totalA = grouped[a].reduce((sum, s) => sum + s.yearsOfExperience, 0);
      const totalB = grouped[b].reduce((sum, s) => sum + s.yearsOfExperience, 0);
      return totalB - totalA;
    });

    return {
      featuredSkills: featured,
      featuredIds,
      skillsByCategory: grouped,
      sortedCategories: sortedCats
    };
  }, [skills]);

  const totalSkills = skills.length;
  const maxYears = Math.max(...skills.map(s => s.yearsOfExperience));

  return (
    <section
      id="tech-stack"
      className="py-24 px-6"
      aria-labelledby="skills-heading"
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
          <h2 id="skills-heading" className="text-3xl md:text-4xl font-medium tracking-tight text-text-primary mb-4">
            Technologies
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            {totalSkills}+ technologies with up to {maxYears}+ years of hands-on experience.
          </p>
        </motion.div>

        {/* Featured skills - prominently displayed */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex flex-wrap justify-center gap-3">
            {featuredSkills.map((skill, index) => {
              const style = getSkillStyle(skill.yearsOfExperience);
              const url = getSkillUrl(skill.id);
              const content = (
                <>
                  {skill.name}
                  <span className={cn(
                    "ml-1.5 text-xs",
                    style.accent ? "text-white/70" : "text-accent/60"
                  )}>
                    {skill.yearsOfExperience}y
                  </span>
                  {url && (
                    <FaExternalLinkAlt className={cn(
                      "ml-1.5 w-2.5 h-2.5 opacity-0 group-hover:opacity-70 transition-opacity",
                      style.accent ? "text-white/70" : "text-accent/60"
                    )} />
                  )}
                </>
              );

              return url ? (
                <motion.a
                  key={skill.id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className={cn(
                    "group inline-flex items-center rounded-lg cursor-pointer transition-all duration-200",
                    style.size, style.weight,
                    style.accent
                      ? "bg-accent text-white shadow-sm shadow-accent/25 hover:shadow-md hover:shadow-accent/30"
                      : "bg-accent-subtle text-accent border border-accent/20 hover:border-accent/40"
                  )}
                >
                  {content}
                </motion.a>
              ) : (
                <motion.span
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className={cn(
                    "inline-flex items-center rounded-lg cursor-default transition-all duration-200",
                    style.size, style.weight,
                    style.accent
                      ? "bg-accent text-white shadow-sm shadow-accent/25"
                      : "bg-accent-subtle text-accent border border-accent/20"
                  )}
                >
                  {content}
                </motion.span>
              );
            })}
          </div>
        </motion.div>

        {/* Skills by category - with size hierarchy */}
        <div className="space-y-10">
          {sortedCategories.map((category, categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: categoryIndex * 0.05 }}
            >
              <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-4">
                {CATEGORY_LABELS[category]}
              </h3>

              <div className="flex flex-wrap items-center gap-2">
                {skillsByCategory[category].map((skill) => {
                  const style = getSkillStyle(skill.yearsOfExperience);
                  const url = getSkillUrl(skill.id);
                  const classes = cn(
                    "inline-flex items-center bg-surface border border-border rounded-md",
                    "hover:border-accent hover:text-accent transition-all duration-150",
                    "text-text-secondary group",
                    style.size, style.weight, style.opacity
                  );

                  return url ? (
                    <a
                      key={skill.id}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(classes, "cursor-pointer")}
                    >
                      {skill.name}
                      <FaExternalLinkAlt className="ml-1 w-2 h-2 opacity-0 group-hover:opacity-50 transition-opacity" />
                    </a>
                  ) : (
                    <span key={skill.id} className={classes}>
                      {skill.name}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
