"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Project, COMPANIES } from '../../data/portfolioData';
import { motion } from 'framer-motion';
import { FaLink, FaGithub, FaBuilding } from 'react-icons/fa';

type ProjectCardProps = {
  project: Project;
  index: number;
  openProjectModal: (index: number) => void;
  openCompanyModal: (companyId: string) => void;
  handleImageError: (projectId: string) => void;
  imageError: Record<string, boolean>;
};

export default function ProjectCard({
  project,
  index,
  openProjectModal,
  openCompanyModal,
  handleImageError,
  imageError
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  
  // Helper function for company click with null check
  const handleCompanyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.company) {
      openCompanyModal(project.company);
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
        <Image
          src={imageError[project.id] ? 'https://placehold.co/600x400/222222/FFFFFF?text=No+Image' : project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className={`transition-transform duration-700 ease-out ${hovered ? 'scale-105' : 'scale-100'}`}
          onError={() => handleImageError(project.id)}
        />
      </div>
      
      <div className="p-8 flex-grow flex flex-col">
        <h3 className="text-xl font-light text-gray-900 dark:text-white tracking-wide mb-3">{project.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 line-clamp-2 leading-relaxed font-light">{project.description}</p>
        
        <div className="mt-auto flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300 
                        rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/30 text-gray-500 dark:text-gray-400 
                           rounded-full text-xs">
              +{project.tags.length - 3} more
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
          
          {project.company && (
            <button
              onClick={handleCompanyClick}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-xs group"
              aria-label={`View company: ${COMPANIES[project.company].name}`}
              title={`View company: ${COMPANIES[project.company].name}`}
            >
              <FaBuilding className="mr-1.5 text-gray-500 dark:text-gray-500" />
              <span className="group-hover:underline">{COMPANIES[project.company].name}</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
} 