"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLink, FaBuilding, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { PROJECTS, PROJECT_CATEGORIES } from '@/data/projects';
import { COMPANIES } from '@/data/companies';
import type { Project } from '@/data/types';
import { useModalManager } from '@/hooks/useModalManager';
import ProjectModal from './ProjectModal';
import CompanyModal from '../shared/CompanyModal';
import { parseMarkdownLinks } from './utils';
import { getSkillNames } from '@/utils/skillHelpers';
import ProjectImage from '@/components/shared/ProjectImage';

// Filter out the "Professional Experience" category since we'll use a separate section
const PROJECT_CATEGORIES_FILTERED = PROJECT_CATEGORIES.filter(
  category => category !== "Professional Experience"
);

export default function ProjectsShowcase() {
  const { openProject, openCompany } = useModalManager();
  const [activeCategory, setActiveCategory] = useState<typeof PROJECT_CATEGORIES_FILTERED[number]>("All");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(PROJECTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [viewMode, setViewMode] = useState<'showcase' | 'grid'>('showcase');
  
  // Refs for scroll animations
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Stub function for openExperienceModal to satisfy ProjectModal props
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOpenExperience = (index: number) => {
    // Redirect to the experiences section instead
    window.location.href = '/#experience';
  };
  
  // Filter projects
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredProjects(PROJECTS);
    } else {
      setFilteredProjects(PROJECTS.filter(project => project.category === activeCategory));
    }
    setCurrentIndex(0);
  }, [activeCategory]);

  // Handle project navigation
  const navigateProject = (direction: 'prev' | 'next') => {
    if (isTransitioning || filteredProjects.length <= 1) return;
    
    setIsTransitioning(true);
    
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % filteredProjects.length
      : (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
    
    setCurrentIndex(newIndex);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  // Modal handlers
  const handleOpenProject = (index: number) => {
    const project = filteredProjects[index];
    
    // Create navigation functions
    const goToNext = () => {
      if (index < filteredProjects.length - 1) {
        handleOpenProject(index + 1);
      }
    };
    
    const goToPrev = () => {
      if (index > 0) {
        handleOpenProject(index - 1);
      }
    };
    
    openProject(ProjectModal, {
      project,
      openCompanyModal: handleOpenCompany,
      openExperienceModal: handleOpenExperience,
      parseMarkdownLinks,
      closeModal: () => {},
      nextProject: goToNext,
      prevProject: goToPrev
    }, {
      modalKey: project.id,
      hasNavigation: true,
      onNext: goToNext, 
      onPrevious: goToPrev
    });
  };
  
  const handleOpenCompany = (companyId: string) => {
    openCompany(CompanyModal, {
      company: COMPANIES[companyId],
      closeModal: () => {},
      openProjectModal: handleOpenProject
    }, {
      modalKey: companyId
    });
  };

  // Helper function to handle company click with null check
  const handleCompanyClick = (e: React.MouseEvent, companyId: string | null) => {
    e.stopPropagation();
    if (companyId) {
      handleOpenCompany(companyId);
    }
  };

  // Function to render the featured project showcase
  const renderShowcase = () => {
    if (filteredProjects.length === 0) return null;
    
    const currentProject = filteredProjects[currentIndex];
    
    return (
      <div className="relative w-full overflow-hidden rounded-xl h-[70vh] lg:h-[65vh]">
        {/* Background image with blur and overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40 z-10"></div>
          <ProjectImage 
            src={currentProject.images}
            alt={currentProject.title}
            fill
            className="object-cover blur-sm scale-105 opacity-80"
            priority
          />
        </div>
        
        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col md:flex-row items-center">
          {/* Left side - Project details */}
          <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center h-full">
            <motion.div
              key={currentProject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-5"
            >
              {currentProject.category && (
                <span className="inline-block bg-blue-500/80 text-white text-xs px-3 py-1.5 rounded-full">
                  {currentProject.category}
                </span>
              )}
              
              <h2 className="text-3xl md:text-4xl font-light text-white tracking-wide">
                {currentProject.title}
              </h2>
              
              <p className="text-base md:text-lg text-gray-300">
                {currentProject.description}
              </p>
              
              <div className="flex flex-wrap gap-2 pt-1">
                {currentProject.skills && getSkillNames(currentProject.skills).slice(0, 4).map((skillName, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1.5 bg-white/10 text-gray-200 rounded-full text-xs backdrop-blur-sm"
                  >
                    {skillName}
                  </span>
                ))}
              </div>
              
              <div className="pt-6 flex gap-4 items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenProject(currentIndex);
                  }}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white py-2 px-5 rounded-full 
                           transition-all duration-300 border border-white/20 text-sm"
                >
                  View Details
                </button>
                
                <div className="flex items-center gap-3">
                  {currentProject.liveUrl && (
                    <a 
                      href={currentProject.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-white hover:text-blue-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="View live project"
                      title="View live project"
                    >
                      <FaLink size={16} />
                    </a>
                  )}
                  {currentProject.github && (
                    <a 
                      href={currentProject.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-white hover:text-gray-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="View source code on GitHub"
                      title="View source code on GitHub"
                    >
                      <FaGithub size={18} />
                    </a>
                  )}
                </div>
              </div>
              
              {/* Company link */}
              {currentProject.related_experience_id && COMPANIES[currentProject.related_experience_id] && (
                <button
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm group ml-auto"
                  onClick={(e) => handleCompanyClick(e, currentProject.related_experience_id)}
                  aria-label={`View company: ${COMPANIES[currentProject.related_experience_id].name}`}
                  title={`View company: ${COMPANIES[currentProject.related_experience_id].name}`}
                >
                  <FaBuilding className="mr-1.5 text-gray-500 dark:text-gray-500" />
                  <span className="group-hover:underline">
                    {COMPANIES[currentProject.related_experience_id].name}
                  </span>
                </button>
              )}
            </motion.div>
          </div>
          
          {/* Right side - Featured project image */}
          <div className="w-full md:w-1/2 h-full flex items-center justify-center p-6 md:p-10">
            <motion.div 
              key={`image-${currentProject.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="relative w-full h-full max-h-[450px] overflow-hidden rounded-lg shadow-2xl"
            >
              <ProjectImage 
                src={currentProject.images}
                alt={currentProject.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </div>
        </div>
        
        {/* Navigation controls */}
        {filteredProjects.length > 1 && (
          <div className="absolute z-20 bottom-6 left-0 right-0 flex justify-center gap-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigateProject('prev');
              }}
              disabled={isTransitioning}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 
                       flex items-center justify-center transition-all duration-300 
                       border border-white/20 text-white"
              aria-label="Previous project"
            >
              <FaChevronLeft size={14} />
            </button>
            
            <div className="flex items-center gap-1.5">
              {filteredProjects.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isTransitioning && index !== currentIndex) {
                      setIsTransitioning(true);
                      setCurrentIndex(index);
                      setTimeout(() => setIsTransitioning(false), 500);
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index 
                      ? 'bg-white scale-100' 
                      : 'bg-white/40 scale-75 hover:bg-white/60'
                  }`}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigateProject('next');
              }}
              disabled={isTransitioning}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 
                       flex items-center justify-center transition-all duration-300 
                       border border-white/20 text-white"
              aria-label="Next project"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    );
  };

  // Function to render the grid layout for all projects
  const renderProjectsGrid = () => {
    if (filteredProjects.length === 0) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
      >
        {filteredProjects.map((project, index) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.05,
              ease: "easeOut" 
            }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800/20 h-[250px] md:h-[280px]"
            onClick={() => handleOpenProject(index)}
          >
            {/* Background with gradient overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
            
            {/* Project image */}
            <div className="absolute inset-0 z-0">
              <ProjectImage 
                src={project.images}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
            </div>
            
            {/* Category tag */}
            <div className="absolute top-3 left-3 z-10">
              {project.category && (
                <span className="inline-block bg-blue-500/80 text-white text-[10px] px-2 py-1 rounded-full">
                  {project.category}
                </span>
              )}
            </div>
            
            {/* Project info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10 transform translate-y-1 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-300">
              <h3 className="text-sm md:text-base font-normal text-white tracking-wide mb-1 line-clamp-1">{project.title}</h3>
              <p className="text-xs text-gray-200 mb-2 line-clamp-2 opacity-80 group-hover:opacity-100">{project.description}</p>
              
              <div className="flex flex-wrap gap-1 pt-1">
                {project.skills && getSkillNames(project.skills).slice(0, 2).map((skillName, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-white/10 text-gray-200 rounded-full text-[10px] backdrop-blur-sm"
                  >
                    {skillName}
                  </span>
                ))}
              </div>
              
              <div className="pt-2 flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-3">
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-white hover:text-blue-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="View live project"
                      title="View live project"
                    >
                      <FaLink size={14} />
                    </a>
                  )}
                  {project.github && (
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-white hover:text-gray-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="View source code on GitHub"
                      title="View source code on GitHub"
                    >
                      <FaGithub size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <section 
      id="projects" 
      ref={containerRef}
      className="relative py-32"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-neutral-100 to-transparent dark:from-gray-900 dark:to-transparent opacity-60 -z-10"></div>
      <div className="absolute inset-0 -z-20">
        <div className="absolute top-40 left-10 w-64 h-64 rounded-full bg-blue-50 dark:bg-blue-900/10 blur-3xl opacity-40"></div>
        <div className="absolute bottom-40 right-10 w-80 h-80 rounded-full bg-blue-50 dark:bg-blue-900/10 blur-3xl opacity-30"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-center"
        >
          <h2 className="font-light text-5xl mb-6 tracking-wide text-gray-800 dark:text-gray-100">
            My <span className="font-medium text-blue-500 dark:text-blue-400">Work</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-400 leading-relaxed">
            A collection of projects that showcase my skills and expertise in creating solutions that are both functional and aesthetically pleasing.
          </p>
        </motion.div>
        
        {/* Combined filters and view toggle in one row */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Categories filter */}
          <div className="overflow-x-auto pb-2 hide-scrollbar max-w-full md:max-w-[75%]">
            <div className="flex gap-2 min-w-max">
              {PROJECT_CATEGORIES_FILTERED.map(category => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ y: -2 }}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-md text-xs transition-all duration-300 font-light tracking-wide ${
                    activeCategory === category 
                      ? 'bg-blue-500/80 text-white' 
                      : 'bg-white dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* View toggle */}
          {filteredProjects.length > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => setViewMode(viewMode === 'showcase' ? 'grid' : 'showcase')}
              className="px-4 py-2 rounded-full text-xs bg-white dark:bg-gray-800/90 text-gray-700 dark:text-gray-200
                      transition-all duration-300 shadow-sm hover:shadow border border-gray-100 dark:border-gray-700/50
                      hover:border-blue-100 dark:hover:border-blue-900/30 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              {viewMode === 'showcase' ? 'Grid View' : 'Showcase View'}
            </motion.button>
          )}
        </div>
        
        {/* Project showcase or grid view */}
        <AnimatePresence mode="wait">
          <div key="projects" className="space-y-16">
            {viewMode === 'showcase' && renderShowcase()}
            {viewMode === 'grid' && renderProjectsGrid()}
          </div>
        </AnimatePresence>
      </div>
    </section>
  );
} 