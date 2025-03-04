"use client";

import { useState } from 'react';
import type { Project } from '@/data/types';
import { COMPANIES } from '@/data/companies';
import { motion } from 'framer-motion';
import { FaLink, FaGithub, FaBuilding } from 'react-icons/fa';
import { getSkillNames } from '@/utils/skillHelpers';
import ProjectImage from '@/components/shared/ProjectImage';

type ProjectCardProps = {
  project: Project;
  index: number;
  openProjectModal: (index: number) => void;
  openCompanyModal: (companyId: string) => void;
};

export default function ProjectCard({
  project,
  index,
  openProjectModal,
  openCompanyModal,
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  
  // Helper function for company click with null check
  const handleCompanyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.related_experience_id) {
      openCompanyModal(project.related_experience_id);
    }
  };

  return (
    <motion.div
      className="flex flex-col h-full bg-gray-50 dark:bg-gray-800/20 rounded-xl overflow-hidden
                transition-all duration-300 cursor-pointer"
      onClick={() => openProjectModal(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative h-52 overflow-hidden">
        {project.category && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-blue-500/70 text-white text-xs px-3 py-1.5 rounded-full">
              {project.category}
            </span>
          </div>
        )}
        <ProjectImage
          src={project.images}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className={`transition-transform duration-700 ease-out ${hovered ? 'scale-105' : 'scale-100'}`}
        />
      </div>
      
      <div className="p-8 flex-grow flex flex-col">
        <h3 className="text-xl font-light text-gray-900 dark:text-white tracking-wide mb-3">{project.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 line-clamp-2 leading-relaxed font-light">{project.description}</p>
        
        <div className="mt-auto flex flex-wrap gap-2">
          {project.skills && getSkillNames(project.skills).slice(0, 3).map((skillName, index) => (
            <span 
              key={index} 
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300 
                        rounded-full text-xs"
            >
              {skillName}
            </span>
          ))}
          {project.skills && project.skills.length > 3 && (
            <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/30 text-gray-500 dark:text-gray-400 
                           rounded-full text-xs">
              +{project.skills.length - 3} more
            </span>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {project.liveUrl && (
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                onClick={(e) => e.stopPropagation()}
                aria-label="View live project"
                title="View live project"
              >
                <FaLink size={16} />
              </a>
            )}
            {project.github && (
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
                aria-label="View source code on GitHub"
                title="View source code on GitHub"
              >
                <FaGithub size={16} />
              </a>
            )}
          </div>
          
          {project.related_experience_id && COMPANIES[project.related_experience_id] && (
            <button
              onClick={handleCompanyClick}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-xs group"
              aria-label={`View company: ${COMPANIES[project.related_experience_id].name}`}
              title={`View company: ${COMPANIES[project.related_experience_id].name}`}
            >
              <FaBuilding className="mr-1.5 text-gray-500 dark:text-gray-500" />
              <span className="group-hover:underline">{COMPANIES[project.related_experience_id].name}</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
} 