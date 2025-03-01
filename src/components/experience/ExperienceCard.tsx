"use client";

import Image from 'next/image';
import { FaCalendarAlt, FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaLink, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import { PROJECTS, COMPANIES, Project, Experience } from '@/data/portfolioData';
import { parseMarkdownLinks } from '../projects/utils';
import { motion } from 'framer-motion';
import { getSkillNames } from '@/utils/skillHelpers';

type ExperienceCardProps = {
  experience: Experience;
  expandedId: string | null;
  toggleExpand: (id: string) => void;
  openExperienceModal: (index: number) => void;
  openCompanyModal: (companyId: string) => void;
  experienceIndex: number;
};

// Extend the Experience type to include optional relatedProjects
interface ExperienceWithRelatedProjects extends Experience {
  relatedProjects?: string[];
}

export default function ExperienceCard({
  experience,
  expandedId,
  toggleExpand,
  openExperienceModal,
  openCompanyModal,
  experienceIndex
}: ExperienceCardProps) {
  const companyName = experience.company ? COMPANIES[experience.company]?.name || experience.company : "";
  
  // Check if experience has relatedProjects property
  const experienceWithProjects = experience as ExperienceWithRelatedProjects;
  const hasRelatedProjects = experienceWithProjects.relatedProjects && experienceWithProjects.relatedProjects.length > 0;
  
  return (
    <div 
      className="group relative bg-gray-50 dark:bg-gray-800/20 rounded-xl overflow-hidden
                hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-all duration-300 cursor-pointer"
      onClick={() => openExperienceModal(experienceIndex)}
    >
      <div className="p-8">
        {/* Header with company logo */}
        <div className="flex gap-6 mb-6">
          <div 
            className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (experience.company) {
                openCompanyModal(experience.company);
              }
            }}
            title={`View ${companyName} details`}
          >
            <Image
              src={experience.logo}
              alt={companyName}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-light tracking-wide text-gray-800 dark:text-white mb-2">{experience.title}</h3>
            {experience.company && (
              <button 
                className="text-blue-600 dark:text-blue-400 font-light hover:underline inline-flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  if (experience.company) {
                    openCompanyModal(experience.company);
                  }
                }}
              >
                {companyName}
                <FaChevronRight className="text-xs opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </button>
            )}
          </div>
        </div>
        
        {/* Meta information */}
        <div className="flex flex-wrap gap-5 mb-6 text-sm">
          <div className="inline-flex items-center text-gray-600 dark:text-gray-300">
            <FaCalendarAlt className="mr-2 text-blue-500/70 dark:text-blue-400/70" />
            {experience.period}
          </div>
          
          {experience.location && (
            <div className="inline-flex items-center text-gray-600 dark:text-gray-300">
              <FaMapMarkerAlt className="mr-2 text-blue-500/70 dark:text-blue-400/70" />
              {experience.location}
            </div>
          )}
          
          <button 
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(experience.id);
            }}
            aria-label={expandedId === experience.id ? "Collapse details" : "Expand details"}
          >
            {expandedId === experience.id ? "Less details" : "More details"}
            {expandedId === experience.id ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
          </button>
        </div>
        
        {/* Quick preview or detailed achievements */}
        {expandedId !== experience.id ? (
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mb-6 font-light">
            {experience.details[0]}
          </p>
        ) : (
          <div className="mb-6">
            <ul className="space-y-4">
              {experience.details.map((detail: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-1.5 rounded-full mr-3 mt-0.5 flex-shrink-0">
                    <span className="block w-1.5 h-1.5 bg-current rounded-full"></span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 font-light">{parseMarkdownLinks(detail)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Skills tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {experience.skills && getSkillNames(experience.skills).slice(0, expandedId === experience.id ? experience.skills.length : 3).map((skillName, idx) => (
            <span 
              key={idx} 
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800/30 rounded-full text-gray-600 dark:text-gray-300"
            >
              {skillName}
            </span>
          ))}
          {expandedId !== experience.id && experience.skills && experience.skills.length > 3 && (
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800/30 rounded-full text-gray-600 dark:text-gray-300">
              +{experience.skills.length - 3} more
            </span>
          )}
        </div>
        
        {/* Expandable related projects section */}
        {expandedId === experience.id && hasRelatedProjects && (
          <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/30">
            <h4 className="font-light mb-4 text-gray-700 dark:text-gray-200">
              Related Projects
            </h4>
            <div className="flex flex-wrap gap-3">
              {experienceWithProjects.relatedProjects?.map((projectId: string) => {
                const project = PROJECTS.find((p: Project) => p.id === projectId);
                if (!project) return null;
                return (
                  <button 
                    key={projectId}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800/40 px-3 py-1.5 rounded-full text-gray-700 dark:text-gray-200 text-xs font-light transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Navigate to projects section
                      const projectsSection = document.getElementById('projects');
                      if (projectsSection) {
                        projectsSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <div className="relative w-4 h-4 rounded-full overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {project.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Website link if available */}
        {experience.liveUrl && (
          <div className="mt-4">
            <Link 
              href={experience.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 text-sm font-light hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <FaLink className="mr-1 text-xs" /> {experience.liveUrl.replace(/(^\w+:|^)\/\//, '')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 