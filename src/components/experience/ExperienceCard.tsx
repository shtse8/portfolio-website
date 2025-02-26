"use client";

import Image from 'next/image';
import { FaCalendarAlt, FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaLink, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import { PROJECTS, COMPANIES, Project, Experience } from '@/data/portfolioData';
import { parseMarkdownLinks } from '../projects/utils';

type ExperienceCardProps = {
  experience: Experience;
  expandedId: string | null;
  toggleExpand: (id: string) => void;
  openExperienceModal: (index: number) => void;
  openCompanyModal: (companyId: string) => void;
  experienceIndex: number;
};

export default function ExperienceCard({
  experience,
  expandedId,
  toggleExpand,
  openExperienceModal,
  openCompanyModal,
  experienceIndex
}: ExperienceCardProps) {
  const companyName = COMPANIES[experience.company]?.name || experience.company;
  
  return (
    <div 
      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1 duration-300 cursor-pointer"
      onClick={() => openExperienceModal(experienceIndex)}
    >
      <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-500">
        {/* Company Logo */}
        <div 
          className="absolute -bottom-10 left-6 w-20 h-20 rounded-full bg-white dark:bg-gray-700 p-1 shadow-lg cursor-pointer z-10"
          onClick={(e) => {
            e.stopPropagation();
            openCompanyModal(experience.company);
          }}
          title={`View ${companyName} details`}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image
              src={experience.logo}
              alt={companyName}
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Period badge */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-md">
          <FaCalendarAlt className="mr-2 text-blue-500" />
          {experience.period}
        </div>
      </div>
      
      <div className="pt-12 px-6 pb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{experience.title}</h3>
            <button 
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                openCompanyModal(experience.company);
              }}
            >
              {companyName}
            </button>
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
              <FaMapMarkerAlt className="mr-1" />
              <span>{experience.location || 'Remote'}</span>
            </div>
          </div>
          <button 
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(experience.id);
            }}
            aria-label={expandedId === experience.id ? "Collapse details" : "Expand details"}
          >
            {expandedId === experience.id ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {experience.tags.slice(0, expandedId === experience.id ? experience.tags.length : 5).map((tech: string, idx: number) => (
            <span 
              key={idx}
              className="bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-medium"
            >
              {tech}
            </span>
          ))}
          {expandedId !== experience.id && experience.tags.length > 5 && (
            <span className="text-gray-500 dark:text-gray-400 text-xs font-medium px-2.5 py-0.5">
              +{experience.tags.length - 5} more
            </span>
          )}
        </div>
        
        {/* Quick preview of achievements */}
        {expandedId !== experience.id && (
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
            {experience.details[0]}
          </p>
        )}
        
        {/* Website link if available */}
        {experience.liveUrl && (
          <Link 
            href={experience.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline mb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <FaLink className="mr-1 text-xs" /> {experience.liveUrl.replace(/(^\w+:|^)\/\//, '')}
          </Link>
        )}
        
        {/* Expandable content */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            expandedId === experience.id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
            <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">Key Achievements:</h4>
            <ul className="space-y-3">
              {experience.details.map((detail: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{parseMarkdownLinks(detail)}</span>
                </li>
              ))}
            </ul>
            
            {/* Related Projects Section */}
            {experience.relatedProjects && experience.relatedProjects.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                  <FaLink className="mr-2 text-blue-600" /> Related Projects
                </h4>
                <div className="flex flex-wrap gap-2">
                  {experience.relatedProjects.map((projectId: string) => {
                    const project = PROJECTS.find((p: Project) => p.id === projectId);
                    if (!project) return null;
                    return (
                      <button 
                        key={projectId}
                        className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Navigate to projects section
                          const projectsSection = document.getElementById('projects');
                          if (projectsSection) {
                            projectsSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                        {project.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* View details button */}
        <div className="flex justify-end mt-4">
          <span className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
            View Details <FaChevronRight className="ml-1 text-xs" />
          </span>
        </div>
      </div>
    </div>
  );
} 