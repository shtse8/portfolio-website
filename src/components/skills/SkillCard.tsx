"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS, Project, EXPERIENCES, Experience, TechSkill } from '@/data/portfolioData';

// Interfaces for component props
interface SkillCardProps {
  skill: TechSkill;
  onClick: (skillId: string) => void;
  getSkillIcon: (skillId: string) => React.ReactNode;
}

interface RelatedItemsProps {
  count: number;
}

// Animation variants with improved configuration
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 15,
      mass: 1.2,
      duration: 0.7
    }
  }
};

// Separate component for related items indicator
const RelatedItemsIndicator: React.FC<RelatedItemsProps> = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800/50">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-light">
          {count} related {count === 1 ? 'item' : 'items'}
        </span>
        <div className="text-blue-500 dark:text-blue-400" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Utility functions to get related data
const getRelatedProjects = (skillId: string): Project[] => {
  return PROJECTS.filter(project => project.skills.includes(skillId));
};

const getRelatedExperiences = (skillId: string): Experience[] => {
  return EXPERIENCES.filter(experience => experience.skills.includes(skillId));
};

// Main SkillCard component
const SkillCard: React.FC<SkillCardProps> = ({ skill, onClick, getSkillIcon }) => {
  // Memoize expensive calculations to improve performance
  const relatedData = useMemo(() => {
    const projects = getRelatedProjects(skill.id);
    const experiences = getRelatedExperiences(skill.id);
    return {
      projects,
      experiences,
      totalCount: projects.length + experiences.length
    };
  }, [skill.id]);
  
  // Determine if card is interactive based on related items
  const isInteractive = relatedData.totalCount > 0;
  
  // Memoize hover animation to prevent recreation on each render
  const hoverAnimation = useMemo(() => {
    if (!isInteractive) return {};
    
    return {
      y: -3,
      backgroundColor: "rgba(255, 255, 255, 0.9)"
    };
  }, [isInteractive]);
  
  return (
    <motion.div 
      variants={itemVariants}
      className={`group relative bg-gray-50 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl overflow-hidden 
                transition-all duration-300 ${isInteractive ? 'cursor-pointer' : ''}`}
      whileHover={hoverAnimation}
      onClick={() => isInteractive && onClick(skill.id)}
      role={isInteractive ? "button" : "article"}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={`${skill.name}: ${skill.description}`}
    >
      {/* Colored accent */}
      <div className={`h-0.5 w-full ${skill.bgColor}`} aria-hidden="true"></div>
      
      <div className="p-8">
        {/* Icon and title */}
        <div className="flex items-center mb-6">
          <div className={`${skill.color} p-3 rounded-lg mr-5`} aria-hidden="true">
            {getSkillIcon(skill.id)}
          </div>
          <h3 className="text-xl font-light tracking-wide">{skill.name}</h3>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">{skill.description}</p>
        
        {/* Related items info */}
        <RelatedItemsIndicator count={relatedData.totalCount} />
      </div>
    </motion.div>
  );
};

export default SkillCard; 