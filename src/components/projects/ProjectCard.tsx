"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Project, COMPANIES } from '../../data/portfolioData';

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
    <div
      className="flex flex-col h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer transition-all duration-300"
      onClick={() => openProjectModal(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ 
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      <div className="relative h-48 overflow-hidden">
        {project.category && (
          <span className="absolute top-3 right-3 z-10 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-normal px-3 py-1 border border-gray-200 dark:border-gray-700">
            {project.category}
          </span>
        )}
        <div className="absolute inset-0 bg-black/5 dark:bg-black/20 z-10"></div>
        <Image
          src={imageError[project.id] ? 'https://placehold.co/600x400/222222/FFFFFF?text=No+Image' : project.image}
          alt={project.title}
          fill
          style={{ objectFit: 'cover' }}
          className={`transition-transform duration-500 ease-in-out ${hovered ? 'scale-105' : 'scale-100'}`}
          onError={() => handleImageError(project.id)}
        />
      </div>
      <div className="p-5 flex-grow bg-white dark:bg-gray-800">
        <h3 className="text-lg font-normal mb-3 text-gray-900 dark:text-white">{project.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 font-light">{project.description}</p>
        
        {project.company && COMPANIES[project.company] && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openCompanyModal(project.company as string);
            }}
            className="flex items-center text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-3"
          >
            <span className="flex items-center">
              <span className="w-4 h-4 mr-2 relative">
                <Image
                  src={COMPANIES[project.company].logo}
                  alt={COMPANIES[project.company].name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-none"
                />
              </span>
              {COMPANIES[project.company].name}
            </span>
          </button>
        )}
        
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          {project.tags.slice(0, 3).map((tag, tagIndex) => (
            <span 
              key={tagIndex} 
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-light"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-light">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 