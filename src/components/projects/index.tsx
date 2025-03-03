"use client";

import { useState, useEffect } from 'react';
import type { Project, Experience } from '@/data/types';
import { COMPANIES } from '@/data/companies';
import { EXPERIENCES } from '@/data/experiences';
import { PROJECTS, PROJECT_CATEGORIES } from '@/data/projects';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import ExperienceModal from '../experience/ExperienceModal';
import CompanyModal from '../shared/CompanyModal';
import { parseMarkdownLinks } from './utils';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useModalManager } from '@/hooks/useModalManager';
import { getSkillNames } from '@/utils/skillHelpers';

export default function FeaturedProjects() {
  const { openProject, openExperience, openCompany } = useModalManager();
  const [activeCategory, setActiveCategory] = useState<typeof PROJECT_CATEGORIES[number]>("All");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(PROJECTS);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  
  // Image error tracking
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  
  // Filter projects and experiences
  useEffect(() => {
    if (activeCategory === "Professional Experience") {
      setFilteredProjects([]);
      setFilteredExperiences(EXPERIENCES);
    } else {
      if (activeCategory === "All") {
        setFilteredProjects(PROJECTS);
      } else {
        setFilteredProjects(PROJECTS.filter(project => project.category === activeCategory));
      }
      setFilteredExperiences([]);
    }
  }, [activeCategory]);
  
  const handleImageError = (projectId: string) => {
    setImageError(prev => ({ ...prev, [projectId]: true }));
  };

  const handleOpenProject = (index: number) => {
    const project = filteredProjects[index];
    
    // Create navigation functions - always provide them for all items
    const goToNext = () => {
      if (index < filteredProjects.length - 1) {
        handleOpenProject(index + 1);
      }
      // No action for last item, but function still exists
    };
    
    const goToPrev = () => {
      if (index > 0) {
        handleOpenProject(index - 1);
      }
      // No action for first item, but function still exists
    };
    
    openProject(ProjectModal, {
      project,
      openExperienceModal: handleOpenExperience,
      openCompanyModal: handleOpenCompany,
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

  // Adapter function for experience modal
  const handleOpenExperience = (index: number) => {
    const experience = EXPERIENCES[index];
    
    const handleNext = () => {
      const nextIndex = (index + 1) % EXPERIENCES.length;
      handleOpenExperience(nextIndex);
    };
    
    const handlePrev = () => {
      const prevIndex = (index - 1 + EXPERIENCES.length) % EXPERIENCES.length;
      handleOpenExperience(prevIndex);
    };
    
    openExperience(ExperienceModal, {
      experience,
      openCompanyModal: handleOpenCompany,
      parseMarkdownLinks,
      nextExperience: handleNext,
      prevExperience: handlePrev,
      closeModal: () => {}
    }, {
      modalKey: experience.id,
      hasNavigation: true,
      onNext: handleNext,
      onPrevious: handlePrev
    });
  };
  
  // Adapter function for company modal
  const handleOpenCompany = (companyId: string) => {
    openCompany(CompanyModal, {
      company: COMPANIES[companyId],
      closeModal: () => {},
      openProjectModal: handleOpenProject,
      openExperienceModal: handleOpenExperience
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
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section id="projects" className="relative py-32">
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
          className="mb-20 text-center"
        >
          <h2 className="font-light text-5xl mb-6 tracking-wide text-gray-800 dark:text-gray-100">
            My <span className="font-medium text-blue-500 dark:text-blue-400">Work</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-400 leading-relaxed">
            A collection of projects and professional experiences that showcase my skills and expertise in creating solutions that are both functional and aesthetically pleasing.
          </p>
        </motion.div>
        
        {/* Categories Tabs */}
        <div className="flex flex-wrap justify-center mb-16 gap-3">
          {PROJECT_CATEGORIES.map(category => (
            <motion.button
              key={category}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ y: -2 }}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-3 rounded-md text-sm transition-all duration-300 font-light tracking-wide ${
                activeCategory === category 
                  ? 'bg-blue-500/80 text-white' 
                  : 'bg-white dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
        
        {/* Projects Grid */}
        {filteredProjects.length > 0 && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div key={project.id} variants={itemVariants}>
                <ProjectCard
                  project={project}
                  index={index}
                  openProjectModal={handleOpenProject}
                  openCompanyModal={handleOpenCompany}
                  handleImageError={handleImageError}
                  imageError={imageError}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Experiences List */}
        {filteredExperiences.length > 0 && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            {filteredExperiences.map((experience, index) => (
              <motion.div 
                key={experience.id} 
                variants={itemVariants}
                className="bg-white dark:bg-gray-800/70 backdrop-blur-sm rounded-xl overflow-hidden 
                          cursor-pointer transition-all duration-300 border border-gray-100 dark:border-gray-700/50
                          hover:shadow-lg hover:border-blue-100 dark:hover:border-blue-900/30"
                onClick={() => handleOpenExperience(index)}
              >
                <div className="p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                      <h3 className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white tracking-wide">{experience.title}</h3>
                      <div className="flex items-center mt-2 text-sm">
                        {experience.company && (
                          <>
                            <button 
                              onClick={(e) => handleCompanyClick(e, experience.company)}
                              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 group transition-colors"
                            >
                              <span className="w-6 h-6 mr-2 relative overflow-hidden rounded">
                                <Image 
                                  src={COMPANIES[experience.company].logo} 
                                  alt={COMPANIES[experience.company].name}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                  className="rounded-sm group-hover:scale-105 transition-transform duration-300"
                                />
                              </span>
                              <span className="underline-offset-4 group-hover:underline">
                                {COMPANIES[experience.company].name}
                              </span>
                            </button>
                            <span className="mx-3 text-gray-400 dark:text-gray-500">•</span>
                          </>
                        )}
                        <span className="text-gray-600 dark:text-gray-400 font-light tracking-wider">{experience.period}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{experience.description}</p>
                  
                  {/* Technologies used */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    {experience.skills && getSkillNames(experience.skills).slice(0, 5).map((skillName, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                      >
                        {skillName}
                      </span>
                    ))}
                    {experience.skills && experience.skills.length > 5 && (
                      <span className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">
                        +{experience.skills.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
} 