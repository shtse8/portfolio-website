"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FaBuilding } from 'react-icons/fa';
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
      className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:-translate-y-1 duration-300"
      onClick={() => openProjectModal(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        {project.category && (
          <span className="absolute top-2 right-2 z-10 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            {project.category}
          </span>
        )}
        <Image
          src={imageError[project.id] ? 'https://placehold.co/600x400/222222/FFFFFF?text=No+Image' : project.image}
          alt={project.title}
          fill
          style={{ objectFit: 'cover' }}
          className={`transition-transform duration-500 ease-in-out ${hovered ? 'scale-110' : 'scale-100'}`}
          onError={() => handleImageError(project.id)}
        />
      </div>
      <div className="p-4 flex-grow bg-white dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{project.description}</p>
        
        {project.company && COMPANIES[project.company] && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openCompanyModal(project.company as string);
            }}
            className="flex items-center text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-2"
          >
            <span className="flex items-center">
              <span className="w-5 h-5 mr-1 relative">
                <Image
                  src={COMPANIES[project.company].logo}
                  alt={COMPANIES[project.company].name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-sm"
                />
              </span>
              {COMPANIES[project.company].name}
            </span>
          </button>
        )}
        
        <div className="flex flex-wrap gap-1 mt-2">
          {project.tags.slice(0, 3).map((tag, tagIndex) => (
            <span 
              key={tagIndex} 
              className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 