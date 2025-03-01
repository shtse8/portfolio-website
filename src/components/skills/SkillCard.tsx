"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { SKILLS, PROJECTS, Project, EXPERIENCES, Experience } from '@/data/portfolioData';

// Get projects related to the selected skill
const getRelatedProjects = (skillId: string): Project[] => {
  const skill = SKILLS.find(s => s.id === skillId);
  if (!skill) return [];

  // Get projects that explicitly list this skill in their skills array
  return PROJECTS.filter(project => 
    project.skills.includes(skillId)
  );
};

// Get experiences related to the selected skill
const getRelatedExperiences = (skillId: string): Experience[] => {
  return EXPERIENCES.filter(experience => 
    experience.skills.includes(skillId)
  );
};

// Animation variants
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

// SkillCard component for individual skill display
interface SkillCardProps {
  skill: typeof SKILLS[0];
  onClick: (skillId: string) => void;
  getSkillIcon: (skillId: string) => React.ReactNode;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onClick, getSkillIcon }) => {
  const relatedProjects = getRelatedProjects(skill.id);
  const relatedExperiences = getRelatedExperiences(skill.id);
  const relationshipCount = relatedProjects.length + relatedExperiences.length;
  
  return (
    <motion.div 
      variants={itemVariants}
      className={`group relative bg-gray-50 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl overflow-hidden 
                transition-all duration-300 ${relationshipCount > 0 ? 'cursor-pointer' : ''}`}
      whileHover={relationshipCount > 0 ? { 
        y: -3,
        backgroundColor: relationshipCount > 0 ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.8)"
      } : {}}
      onClick={() => relationshipCount > 0 && onClick(skill.id)}
    >
      {/* Colored accent in a minimal way */}
      <div className={`h-0.5 w-full ${skill.bgColor}`}></div>
      
      <div className="p-8">
        {/* Icon and title with more spacing and flatter design */}
        <div className="flex items-center mb-6">
          <div className={`${skill.color} p-3 rounded-lg mr-5`}>
            {getSkillIcon(skill.id)}
          </div>
          <h3 className="text-xl font-light tracking-wide">{skill.name}</h3>
        </div>
        
        {/* Description with better spacing */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">{skill.description}</p>
        
        {/* Simplified related items info */}
        {relationshipCount > 0 && (
          <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-light">
                {relationshipCount} related {relationshipCount === 1 ? 'item' : 'items'}
              </span>
              <div className="text-blue-500 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SkillCard; 