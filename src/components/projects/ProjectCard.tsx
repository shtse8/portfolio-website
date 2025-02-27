"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Project, COMPANIES } from '../../data/portfolioData';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCalendarAlt, FaTags } from 'react-icons/fa';

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

  return (
    <motion.div
      className="flex flex-col h-full glass-effect rounded-xl overflow-hidden shadow-lg border border-white/20 dark:border-gray-700/30"
      onClick={() => openProjectModal(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ 
        y: -8,
        transition: {
          type: "spring",
          stiffness: 150,
          damping: 15
        },
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative h-48 overflow-hidden">
        {project.category && (
          <motion.span 
            className="absolute top-3 right-3 z-10 bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {project.category}
          </motion.span>
        )}
        
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 z-[1]"
          animate={{ opacity: hovered ? 1 : 0 }}
        />
        
        <div className="relative w-full h-full">
          <Image
            src={imageError[project.id] ? 'https://placehold.co/600x400/222222/FFFFFF?text=No+Image' : project.image}
            alt={project.title}
            fill
            style={{ 
              objectFit: 'cover',
              transform: hovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 500ms ease-in-out'
            }}
            className="transition-transform duration-500 ease-in-out"
            onError={() => handleImageError(project.id)}
          />
        </div>
        
        {/* Show details on hover overlay */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center opacity-0 z-10"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.span 
            className="bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-lg font-medium shadow-lg"
          >
            View Details
          </motion.span>
        </motion.div>
      </div>
      
      <div className="p-5 flex-grow bg-gradient-to-b from-white/80 to-white/40 dark:from-gray-800/95 dark:to-gray-800/90 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.title}</h3>
          
          {project.company && (
            <div 
              className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                if (project.company) {
                  openCompanyModal(project.company);
                }
              }}
            >
              <Image 
                src={project.company ? COMPANIES[project.company].logo : ''}
                alt={project.company ? COMPANIES[project.company].name : ''}
                width={24}
                height={24}
                className="object-cover"
              />
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{project.description}</p>
        
        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex items-center gap-1 mb-4">
            <FaTags className="text-xs text-primary-500 dark:text-primary-400" />
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map((tag, tagIndex) => (
                <span 
                  key={tagIndex} 
                  className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-md text-xs"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-xs">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Bottom links */}
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100 dark:border-gray-700/30">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <FaCalendarAlt className="mr-1" />
            <span>{project.category}</span>
          </div>
          
          <div className="flex gap-3">
            {project.github && (
              <motion.a 
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGithub size={16} />
              </motion.a>
            )}
            
            {project.liveUrl && (
              <motion.a 
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaExternalLinkAlt size={14} />
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 