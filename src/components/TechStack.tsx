"use client";

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getSkills } from '@/data/skills';

// Group skills by category with display names
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

export default function TechStack() {
  const skills = getSkills();

  // Group skills by category, sorted by years of experience
  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, typeof skills> = {};

    skills.forEach(skill => {
      const category = skill.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(skill);
    });

    // Sort skills within each category by experience
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
    });

    return grouped;
  }, [skills]);

  // Get categories sorted by total experience
  const sortedCategories = useMemo(() => {
    return Object.keys(skillsByCategory)
      .filter(cat => CATEGORY_LABELS[cat])
      .sort((a, b) => {
        const totalA = skillsByCategory[a].reduce((sum, s) => sum + s.yearsOfExperience, 0);
        const totalB = skillsByCategory[b].reduce((sum, s) => sum + s.yearsOfExperience, 0);
        return totalB - totalA;
      });
  }, [skillsByCategory]);

  // Calculate summary stats
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
            {totalSkills}+ technologies across {sortedCategories.length} domains, with {maxYears}+ years of experience building production systems.
          </p>
        </motion.div>

        {/* Skills grid by category */}
        <div className="space-y-12">
          {sortedCategories.map((category, categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-4">
                {CATEGORY_LABELS[category] || category}
              </h3>

              <div className="flex flex-wrap gap-2">
                {skillsByCategory[category].slice(0, 12).map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-md hover:border-accent hover:text-accent transition-colors duration-150"
                  >
                    {skill.name}
                    {skill.yearsOfExperience >= 5 && (
                      <span className="ml-1.5 text-xs text-text-tertiary">
                        {skill.yearsOfExperience}y
                      </span>
                    )}
                  </span>
                ))}
                {skillsByCategory[category].length > 12 && (
                  <span className="inline-flex items-center px-3 py-1.5 text-sm text-text-tertiary">
                    +{skillsByCategory[category].length - 12} more
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
