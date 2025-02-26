"use client";

import { useState, useEffect, useRef } from 'react';
import { Project, Experience, COMPANIES, EXPERIENCES, PROJECTS, CATEGORIES } from '../../data/portfolioData';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import ExperienceModal from './ExperienceModal';
import CompanyModal from './CompanyModal';
import { parseMarkdownLinks } from './utils';
import Image from 'next/image';

export default function FeaturedProjects() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(PROJECTS);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  
  // Project modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number>(0);
  
  // Experience modal state
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<number>(0);
  
  // Modal type state - 'project', 'experience', or 'company'
  const [modalType, setModalType] = useState<'project' | 'experience' | 'company'>('project');
  
  // Selected company for company modal
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  
  // Image error tracking
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  
  // Touch swipe handling
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const modalContentRef = useRef<HTMLDivElement>(null);
  
  // Filter projects and experiences
  useEffect(() => {
    if (activeCategory === "Professional Experience") {
      setFilteredProjects([]);
      setFilteredExperiences(EXPERIENCES);
      setSelectedExperienceIndex(0);
    } else {
      if (activeCategory === "All") {
        setFilteredProjects(PROJECTS);
      } else {
        setFilteredProjects(PROJECTS.filter(project => project.category === activeCategory));
      }
      setFilteredExperiences([]);
    }
    setSelectedProjectIndex(0);
    setSelectedExperienceIndex(0);
  }, [activeCategory]);
  
  const nextProject = () => {
    setSelectedProjectIndex((prev) => (prev + 1) % filteredProjects.length);
  };
  
  const prevProject = () => {
    setSelectedProjectIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };
  
  const selectedExperience = filteredExperiences[selectedExperienceIndex];

  const handleImageError = (projectId: string) => {
    setImageError(prev => ({ ...prev, [projectId]: true }));
  };

  const openProjectModal = (index: number) => {
    setSelectedProjectIndex(index);
    setIsModalOpen(true);
    setModalType('project');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const openExperienceModal = (index: number) => {
    setSelectedExperienceIndex(index);
    setIsModalOpen(true);
    setModalType('experience');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Restore background scrolling
  };
  
  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // Swipe must exceed this threshold to trigger page turn
    
    if (diff > threshold) {
      // Swipe left, next item
      nextProject();
    } else if (diff < -threshold) {
      // Swipe right, previous item
      prevProject();
    }
    
    // Reset touch state
    touchStartX.current = 0;
    touchEndX.current = 0;
  };
  
  // Open company modal
  const openCompanyModal = (companyId: string) => {
    const company = COMPANIES[companyId];
    if (company) {
      setSelectedCompanyId(companyId);
      setIsModalOpen(true);
      setModalType('company');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      console.error("No company found for ID:", companyId);
    }
  };

  return (
    <section id="projects" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Projects</h2>
        
        {/* Categories Tabs */}
        <div className="flex flex-wrap justify-center mb-8 gap-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Projects Grid */}
        {filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                openProjectModal={openProjectModal}
                openCompanyModal={openCompanyModal}
                handleImageError={handleImageError}
                imageError={imageError}
              />
            ))}
          </div>
        )}
        
        {/* Experiences List (for Professional Experience category) */}
        {filteredExperiences.length > 0 && (
          <div className="space-y-6">
            {filteredExperiences.map((experience, index) => (
              <div 
                key={experience.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => openExperienceModal(index)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{experience.title}</h3>
                      <div className="flex items-center mt-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openCompanyModal(experience.company);
                          }}
                          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <span className="w-5 h-5 mr-2 relative">
                            <Image 
                              src={COMPANIES[experience.company].logo} 
                              alt={COMPANIES[experience.company].name}
                              fill
                              style={{ objectFit: 'cover' }}
                              className="rounded-sm"
                            />
                          </span>
                          {COMPANIES[experience.company].name}
                        </button>
                        <span className="mx-2 text-gray-500 dark:text-gray-400">|</span>
                        <span className="text-gray-600 dark:text-gray-400">{experience.period}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{experience.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {experience.tags.slice(0, 5).map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                    {experience.tags.length > 5 && (
                      <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                        +{experience.tags.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-75" onClick={closeModal}>
            <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              {modalType === 'project' && selectedProjectIndex !== null && (
                <ProjectModal 
                  project={filteredProjects[selectedProjectIndex]}
                  closeModal={closeModal}
                  nextProject={nextProject}
                  prevProject={prevProject}
                  openExperienceModal={openExperienceModal}
                  openCompanyModal={openCompanyModal}
                  parseMarkdownLinks={parseMarkdownLinks}
                  handleTouchStart={handleTouchStart}
                  handleTouchMove={handleTouchMove}
                  handleTouchEnd={handleTouchEnd}
                  modalContentRef={modalContentRef as React.RefObject<HTMLDivElement>}
                />
              )}
              
              {modalType === 'experience' && selectedExperience && (
                <ExperienceModal 
                  experience={selectedExperience}
                  closeModal={closeModal}
                  openCompanyModal={openCompanyModal}
                  parseMarkdownLinks={parseMarkdownLinks}
                  modalContentRef={modalContentRef as React.RefObject<HTMLDivElement>}
                />
              )}
              
              {modalType === 'company' && selectedCompanyId && COMPANIES[selectedCompanyId] && (
                <CompanyModal 
                  company={COMPANIES[selectedCompanyId]}
                  closeModal={closeModal}
                  openProjectModal={openProjectModal}
                  openExperienceModal={openExperienceModal}
                  modalContentRef={modalContentRef as React.RefObject<HTMLDivElement>}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 