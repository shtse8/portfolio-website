"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS } from '@/data/projects';
import { ROLES } from '@/data/roles';
import type { Project, Role, TechSkill } from '@/data/types';
import { cn } from '@/lib/utils';

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
const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 40,
      damping: 15,
      mass: 1,
      duration: 0.6
    }
  }
};

// Utility functions to get related data
const getRelatedProjects = (skillId: string): Project[] => {
  return PROJECTS.filter(project => project.skills.includes(skillId));
};

const getRelatedRoles = (skillId: string): Role[] => {
  return ROLES.filter(role => role.skills?.includes(skillId));
};

// Separate component for related items indicator
const RelatedItemsIndicator: React.FC<RelatedItemsProps> = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-light">
          {count} related {count === 1 ? 'item' : 'items'}
        </span>
        <div 
          className="text-blue-500 dark:text-blue-400 transition-transform duration-200 group-hover:translate-x-1" 
          aria-hidden="true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Main SkillCard component
const SkillCard: React.FC<SkillCardProps> = ({ skill, onClick, getSkillIcon }) => {
  // Memoize expensive calculations to improve performance
  const relatedData = useMemo(() => {
    const projects = getRelatedProjects(skill.id);
    const roles = getRelatedRoles(skill.id);
    return {
      projects,
      roles,
      totalCount: projects.length + roles.length
    };
  }, [skill.id]);
  
  // Determine if card is interactive based on related items
  const isInteractive = relatedData.totalCount > 0;
  
  // Generate a proper aria-label for the card
  const ariaLabel = useMemo(() => {
    let label = `${skill.name}: ${skill.description}`;
    if (isInteractive) {
      label += `. ${relatedData.totalCount} related ${relatedData.totalCount === 1 ? 'item' : 'items'}. Click to view details.`;
    }
    return label;
  }, [skill.name, skill.description, isInteractive, relatedData.totalCount]);
  
  return (
    <motion.div 
      variants={cardVariants}
      className={cn(
        "group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden",
        "shadow-sm border border-gray-100 dark:border-gray-700",
        "transition-all duration-200 h-full flex flex-col",
        isInteractive && "hover:shadow-md hover:-translate-y-1 cursor-pointer"
      )}
      whileHover={isInteractive ? { scale: 1.01 } : {}}
      onClick={() => isInteractive && onClick(skill.id)}
      role={isInteractive ? "button" : "article"}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(skill.id);
        }
      }}
    >
      {/* Colored accent top bar */}
      <div 
        className={cn("h-1 w-full", skill.bgColor || "bg-blue-500")} 
        aria-hidden="true"
      />
      
      <div className="p-6 flex flex-col h-full">
        {/* Icon and title */}
        <div className="flex items-center mb-4">
          <div 
            className={cn(
              "p-2 rounded-lg mr-4",
              skill.color || "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
            )} 
            aria-hidden="true"
          >
            {getSkillIcon(skill.id)}
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {skill.name}
          </h3>
        </div>
        
        {/* Experience level */}
        <div className="mb-2">
          <div className="flex items-center">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className={cn(
                  "h-1.5 rounded-full",
                  skill.bgColor || "bg-blue-500"
                )}
                style={{ width: `${Math.min(100, skill.yearsOfExperience * 10)}%` }}
                aria-hidden="true"
              />
            </div>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'}
            </span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
          {skill.description}
        </p>
        
        {/* Related items info */}
        <RelatedItemsIndicator count={relatedData.totalCount} />
      </div>
    </motion.div>
  );
};

export default SkillCard; 