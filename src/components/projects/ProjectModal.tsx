"use client";

import { useState, ReactNode } from 'react';
import Image from 'next/image';
import { FaGithub, FaExternalLinkAlt, FaCalendarAlt, FaBuilding, FaChevronLeft, FaChevronRight, 
  FaGooglePlay, FaApple, FaWikipediaW, FaLink, FaFileAlt, FaVideo, FaNewspaper, FaBook } from 'react-icons/fa';
import type { Project, Experience } from '@/data/types';
import { COMPANIES } from '@/data/companies';
import { EXPERIENCES } from '@/data/experiences';
import { formatPeriod } from '@/data';
import { motion } from 'framer-motion';
import { getSkillNames } from '@/utils/skillHelpers';
import ProjectImage from '@/components/shared/ProjectImage';
import { useRouter } from 'next/navigation';

type ProjectModalProps = {
  project: Project;
  openExperienceModal: (experienceIndex: number) => void;
  openCompanyModal: (companyId: string) => void;
  parseMarkdownLinks: (text: string) => ReactNode;
  closeModal?: () => void;
  nextProject?: () => void;
  prevProject?: () => void;
};

export default function ProjectModal({
  project,
  openExperienceModal,
  openCompanyModal,
  parseMarkdownLinks,
  closeModal
}: ProjectModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const router = useRouter();
  
  // Get images from project using the new structure
  const projectImages = project.images || [];
  
  // Function to handle skill tag clicks
  const handleSkillClick = (skillId: string) => {
    // Close the current modal if a close function is provided
    if (closeModal) {
      closeModal();
    }
    
    // Navigate to projects page with skill filter
    router.push(`/projects?skill=${skillId}`);
  };
  
  // Function to get the appropriate icon for a media item based on its type
  const getMediaTypeIcon = (type?: string) => {
    switch(type) {
      case 'review': return <FaNewspaper className="text-indigo-500" />;
      case 'article': return <FaNewspaper className="text-blue-500" />;
      case 'video': return <FaVideo className="text-red-500" />;
      case 'social': return <FaLink className="text-blue-400" />;
      case 'award': return <FaFileAlt className="text-yellow-500" />;
      case 'resource': return <FaBook className="text-green-500" />;
      case 'tool': return <FaLink className="text-gray-500" />;
      default: return <FaLink className="text-gray-500" />;
    }
  };
  
  const getExperienceForProject = (): Experience | null => {
    // First check if there's an experience that lists this project
    const relatedExperience = EXPERIENCES.find(exp => 
      exp.projects?.includes(project.id)
    );
    
    // If not found, fall back to experience match
    if (!relatedExperience && project.related_experience_id) {
      const companyExperiences = EXPERIENCES.filter(exp => exp.company === project.related_experience_id);
      return companyExperiences.length > 0 ? companyExperiences[0] : null;
    }
    
    return relatedExperience || null;
  };

  const nextImage = () => {
    if (projectImages.length > 0) {
      setActiveImageIndex((activeImageIndex + 1) % projectImages.length);
    }
  };

  const prevImage = () => {
    if (projectImages.length > 0) {
      setActiveImageIndex((activeImageIndex - 1 + projectImages.length) % projectImages.length);
    }
  };
  
  // Image gallery section
  const renderImageGallery = () => {
    return (
      <div className="relative aspect-video bg-gray-50 dark:bg-gray-800/30 rounded-2xl overflow-hidden">
        {/* Main image */}
        <div className="relative w-full h-full">
          <ProjectImage
            src={projectImages}
            index={activeImageIndex}
            alt={`${project.title} - Image ${activeImageIndex + 1}`}
            fill
            style={{ objectFit: 'cover' }}
            className="w-full h-full"
          />
        </div>
        
        {/* Image navigation controls */}
        {projectImages.length > 1 && (
          <>
            <motion.button 
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/60 dark:bg-gray-800/70 p-3 rounded-full text-gray-800 dark:text-white z-10"
              onClick={prevImage}
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <FaChevronLeft size={16} />
            </motion.button>
            
            <motion.button 
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/60 dark:bg-gray-800/70 p-3 rounded-full text-gray-800 dark:text-white z-10"
              onClick={nextImage}
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <FaChevronRight size={16} />
            </motion.button>
            
            {/* Image dots indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {projectImages.map((_, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeImageIndex 
                      ? 'bg-white/90 w-4' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full shadow-xl overflow-hidden max-h-[85vh] flex flex-col">
      {/* Project Header */}
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-10">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="w-full md:w-auto flex-shrink-0">
              <div className="w-full md:w-28 h-28 relative overflow-hidden rounded-xl shadow-sm">
                <ProjectImage
                  src={project.images}
                  alt={project.title}
                  fill
                  className="object-cover"
                  index={0}
                />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-light tracking-wide text-gray-900 dark:text-white mb-3">
                {project.title}
              </h2>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {project.skills && project.skills.length > 0 && project.skills.map((skillId, index) => (
                  <button 
                    key={index} 
                    onClick={() => handleSkillClick(skillId)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs
                    hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    {getSkillNames([skillId])[0]}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                {project.start_date && (
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-500 dark:text-blue-400" />
                    <span>
                      {new Date(project.start_date).getFullYear()}
                      {project.end_date && ` - ${new Date(project.end_date).getFullYear()}`}
                    </span>
                  </div>
                )}
                
                {/* Company button */}
                {project.related_experience_id && (
                  <button
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={() => openCompanyModal(project.related_experience_id as string)}
                  >
                    <FaBuilding className="mr-2" />
                    <span className="underline-offset-4 hover:underline">
                      {COMPANIES[project.related_experience_id]?.name || project.related_experience_id}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {/* Project Content */}
        <div className="p-10 grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="prose dark:prose-invert prose-lg max-w-none">
              <h3 className="text-2xl font-light mb-6 text-gray-900 dark:text-white">Overview</h3>
              
              <div className="text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                {parseMarkdownLinks(project.description)}
              </div>
              
              {project.details && (
                <>
                  <h3 className="text-2xl font-light mt-10 mb-6 text-gray-900 dark:text-white">Key Features</h3>
                  <ul className="space-y-4">
                    {Array.isArray(project.details) ? (
                      project.details.map((detail: string, index: number) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300 font-light">
                          {parseMarkdownLinks(detail)}
                        </li>
                      ))
                    ) : (
                      <div className="text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                        {parseMarkdownLinks(project.details as string)}
                      </div>
                    )}
                  </ul>
                </>
              )}
              
              {project.challenges && project.challenges.length > 0 && (
                <>
                  <h3 className="text-2xl font-light mt-10 mb-6 text-gray-900 dark:text-white">Challenges & Solutions</h3>
                  <div className="space-y-8">
                    {project.challenges.map((challenge, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-xl">
                        <h4 className="font-medium text-lg mb-3 text-gray-900 dark:text-white">{challenge.title}</h4>
                        <div className="text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                          {parseMarkdownLinks(challenge.description)}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {/* Related Experience Section */}
              {getExperienceForProject() && (
                <>
                  <h3 className="text-2xl font-light mt-10 mb-6 text-gray-900 dark:text-white">Related Experience</h3>
                  
                  <div 
                    className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                    onClick={() => {
                      const exp = getExperienceForProject();
                      if (exp) {
                        const expIndex = EXPERIENCES.findIndex(e => e.id === exp.id);
                        if (expIndex !== -1) {
                          openExperienceModal(expIndex);
                        }
                      }
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        {getExperienceForProject()?.logo && (
                          <Image
                            src={getExperienceForProject()?.logo || ''}
                            alt={getExperienceForProject()?.title || ''}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">{getExperienceForProject()?.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {getExperienceForProject()?.company} • {getExperienceForProject()?.period ? formatPeriod(getExperienceForProject()!.period) : ''}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 font-light">
                          {getExperienceForProject()?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {/* Project Gallery */}
            {projectImages.length > 0 && (
              <div className="mb-10">
                {renderImageGallery()}
              </div>
            )}
            
            {/* Project Links */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Project Links</h3>
              <div className="flex flex-col gap-3">
                {/* Modern url structure links */}
                {project.urls?.website && (
                  <a
                    href={project.urls.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FaExternalLinkAlt />
                    <span>View Website</span>
                  </a>
                )}
                
                {project.urls?.repository && (
                  <a
                    href={project.urls.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FaGithub />
                    <span>View Repository</span>
                  </a>
                )}
                
                {project.urls?.googlePlay && (
                  <a
                    href={project.urls.googlePlay}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FaGooglePlay />
                    <span>Google Play Store</span>
                  </a>
                )}
                
                {project.urls?.appStore && (
                  <a
                    href={project.urls.appStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                  >
                    <FaApple />
                    <span>App Store</span>
                  </a>
                )}
                
                {project.urls?.demo && (
                  <a
                    href={project.urls.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <FaExternalLinkAlt />
                    <span>View Demo</span>
                  </a>
                )}
                
                {project.urls?.documentation && (
                  <a
                    href={project.urls.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    <FaFileAlt />
                    <span>Documentation</span>
                  </a>
                )}
                
                {project.urls?.wikipedia && (
                  <a
                    href={project.urls.wikipedia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FaWikipediaW />
                    <span>Wikipedia</span>
                  </a>
                )}
                
                {/* Legacy url structure fallbacks */}
                {!project.urls?.website && project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FaExternalLinkAlt />
                    <span>View Live Project</span>
                  </a>
                )}
                
                {!project.urls?.repository && project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FaGithub />
                    <span>View on GitHub</span>
                  </a>
                )}
              </div>
            </div>
            
            {/* Other References Section */}
            {project.urls?.other && project.urls.other.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">References & Media</h3>
                <div className="space-y-3">
                  {project.urls.other.map((item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="mt-1 flex-shrink-0">
                        {getMediaTypeIcon(item.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">{item.name}</h4>
                        {item.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* Internet Archive link if available */}
            {project.urls?.timemachine && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Internet Archive</h3>
                <a
                  href={project.urls.timemachine}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-100 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                >
                  <FaLink />
                  <span>View on Wayback Machine</span>
                </a>
              </div>
            )}
            
            {/* Technologies Used */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.skills && project.skills.length > 0 && project.skills.map((skillId, index) => (
                  <button
                    key={index}
                    onClick={() => handleSkillClick(skillId)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg text-sm
                    hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    {getSkillNames([skillId])[0]}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Additional Metadata */}
            {(project.teamSize || project.duration || project.role) && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Project Details</h3>
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-5 space-y-4">
                  {project.role && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">My Role</span>
                      <span className="text-gray-900 dark:text-white font-medium">{project.role}</span>
                    </div>
                  )}
                  
                  {project.teamSize && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Team Size</span>
                      <span className="text-gray-900 dark:text-white font-medium">{project.teamSize}</span>
                    </div>
                  )}
                  
                  {project.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duration</span>
                      <span className="text-gray-900 dark:text-white font-medium">{project.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 