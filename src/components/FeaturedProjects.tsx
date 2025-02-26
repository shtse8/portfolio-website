"use client";

import { useState, useEffect, useRef } from 'react';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaTimes, FaGooglePlay, FaApple, FaBuilding, FaLink } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { Experience, Project, COMPANIES, EXPERIENCES, PROJECTS, CATEGORIES } from '../data/portfolioData';

// Define the three main entity types with proper relationships

// Company type - represents a company entity
// type Company = {
//   id: string;
//   name: string;
//   description: string;
//   logo: string;
//   website?: string;
//   location?: string;
// };

// Experience type - represents work experience at a company
// type Experience = {
//   id: string;
//   title: string;       // Job title
//   company: string;     // References Company.id
//   period: string;      // Employment period
//   location?: string;
//   description: string;
//   image: string;       // Cover image for experience
//   logo: string;        // Company logo
//   tags: string[];      // Skills/technologies
//   liveUrl?: string;
//   details: string[];   // Bullet points of achievements
//   relatedProjects?: string[]; // References Project.id list
// };

// Project type - represents a specific project
// type Project = {
//   id: string;
//   title: string;
//   description: string;
//   image: string;
//   images?: string[];
//   tags: string[];
//   github?: string;
//   liveUrl?: string;
//   androidUrl?: string;
//   iosUrl?: string;
//   details: string[];
//   category: string;
//   company?: string | null; // References Company.id
//   experience?: string | null; // References Experience.id
//   relatedExperiences?: string[]; // References Experience.id list
// };

// Define project categories
// const CATEGORIES = [...]; - removed, now imported

// Define projects data
// const PROJECTS: Project[] = [...]; - removed, now imported

// Define companies data
// const COMPANIES: Record<string, Company> = {...}; - removed, now imported

// Define experiences data
// const EXPERIENCES: Experience[] = [...]; - removed, now imported

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
  
  // Function to parse markdown links in text
  const parseMarkdownLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Add the link component
      parts.push(
        <Link 
          key={match.index} 
          href={match[2]} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {match[1]}
        </Link>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };
  
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
  
  const selectedProject = filteredProjects[selectedProjectIndex];
  const selectedExperience = filteredExperiences[selectedExperienceIndex];

  const handleImageError = (projectId: string) => {
    setImageError(prev => ({ ...prev, [projectId]: true }));
  };

  const getProjectColor = (index: number) => {
    const colors = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B'];
    return colors[index % colors.length];
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

  const closeProjectModal = () => {
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
  
  // 打開公司詳情模態窗口
  const openCompanyModal = (companyId: string) => {
    console.log("openCompanyModal called with companyId:", companyId);
    
    // Check if the company exists
    const company = COMPANIES[companyId];
    if (company) {
      // Open the company modal directly
      setSelectedCompanyId(companyId);
      setIsModalOpen(true);
      setModalType('company');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      
      // Find related experiences
      const relatedExperiences = EXPERIENCES.filter(exp => exp.company === companyId);
      console.log("Related experiences:", relatedExperiences.length);
    } else {
      console.error("No company found for ID:", companyId);
      alert(`No company details found for: ${companyId}`);
    }
  };

  // Add a function to find projects related to a company
  const getProjectsByCompany = (companyId: string): Project[] => {
    return PROJECTS.filter(project => project.company === companyId);
  };

  // Add a function to find experiences related to a company
  const getExperiencesByCompany = (companyId: string): Experience[] => {
    return EXPERIENCES.filter(exp => exp.company === companyId);
  };

  // Add a function to find the most relevant experience for a project
  const getExperienceForProject = (project: Project): Experience | null => {
    // If the project has relatedExperiences defined, use the first one
    if (project.relatedExperiences && project.relatedExperiences.length > 0) {
      const experience = EXPERIENCES.find(exp => exp.id === project.relatedExperiences![0]);
      if (experience) return experience;
    }
    
    // Otherwise, try to find an experience based on the company
    if (project.company) {
      return EXPERIENCES.find(exp => exp.company === project.company) || null;
    }
    
    return null;
  };

  return (
    <section id="projects" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
            <span className="relative z-10">Featured Projects</span>
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Showcasing my professional experience and innovative projects across different domains and technologies.
          </p>
        </div>
        
        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                category === activeCategory
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Grid view for projects */}
        {filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-16">
            {filteredProjects.map((project, idx) => {
              const relatedCompany = project.company ? COMPANIES[project.company] : null;
              return (
                <div 
                  key={project.id}
                  onClick={() => openProjectModal(idx)}
                  className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1 duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className="relative h-52 overflow-hidden">
                    {imageError[project.id] ? (
                      <div 
                        className="absolute inset-0 flex items-center justify-center" 
                        style={{ backgroundColor: getProjectColor(idx) }}
                      >
                        <span className="text-white text-5xl font-bold">{project.title.charAt(0)}</span>
                      </div>
                    ) : (
                      <>
                        <Image 
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={() => handleImageError(project.id)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </>
                    )}
                    
                    {/* Category badge */}
                    <div className="absolute top-3 right-3 bg-blue-600/90 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
                      {project.category}
                    </div>
                    
                    {/* Company identification - on project card */}
                    {relatedCompany && (
                      <button 
                        type="button"
                        className="absolute top-3 left-3 flex items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full py-1 px-2 shadow-md cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-2 border-gray-200 dark:border-gray-700"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (project.company) {
                            openCompanyModal(project.company);
                          }
                        }}
                        title={`View ${relatedCompany.name} work experience`}
                      >
                        <div className="relative w-5 h-5 rounded-full overflow-hidden">
                          <Image
                            src={relatedCompany.logo}
                            alt={relatedCompany.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="ml-1 text-xs font-medium text-gray-800 dark:text-gray-200">{relatedCompany.name}</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{project.title}</h3>
                    
                    {/* Project metadata - Category and Experience Period */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {/* Category */}
                      <span className="flex items-center bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {project.category}
                      </span>
                      
                      {/* Related experience period if available */}
                      {(() => {
                        // Find related experience using getExperienceForProject function
                        const relatedExp = getExperienceForProject(project);
                        if (relatedExp) {
                          return (
                            <button 
                              type="button"
                              className="flex items-center gap-1 px-3 py-1 bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors shadow-sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Find experience index
                                const expIndex = EXPERIENCES.findIndex(exp => exp.id === relatedExp.id);
                                if (expIndex !== -1) {
                                  setSelectedExperienceIndex(expIndex);
                                  setIsModalOpen(true);
                                  setModalType('experience');
                                  document.body.style.overflow = 'hidden'; // Prevent background scrolling
                                }
                              }}
                              title={`View experience at ${project.company ? COMPANIES[project.company]?.name || '' : ''}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="whitespace-nowrap">{relatedExp.period}</span>
                            </button>
                          );
                        }
                        return null;
                      })()}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tags.slice(0, 3).map((tag, idx) => (
                        <span 
                          key={idx}
                          className="bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">+{project.tags.length - 3} more</span>
                      )}
                    </div>
                    
                    {/* View details button */}
                    <div className="flex justify-end mt-2">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                        View Details <FaChevronRight className="ml-1 text-xs" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Grid view for experiences */}
        {filteredExperiences.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {filteredExperiences.map((experience, idx) => (
              <div 
                key={experience.id}
                onClick={() => openExperienceModal(idx)}
                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1 duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-700">
                    <Image 
                      src={experience.logo}
                      alt={experience.company}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(experience.id)}
                    />
                  </div>
                  <div className="ml-6">
                    <h3 className="font-bold text-xl mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{experience.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{COMPANIES[experience.company]?.name || experience.company}</p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs">{experience.period}</p>
                  </div>
                </div>
                
                <div className="p-5">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {experience.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {experience.tags.slice(0, 3).map((tag, idx) => (
                      <span 
                        key={idx}
                        className="bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2.5 py-1 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {experience.tags.length > 3 && (
                      <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">+{experience.tags.length - 3} more</span>
                    )}
                  </div>
                  
                  {/* Related Projects */}
                  {experience.relatedProjects && experience.relatedProjects.length > 0 && (
                    <div className="mt-8">
                      <h4 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                        <FaLink className="mr-2 text-blue-600 dark:text-blue-400" />
                        Related Projects
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {experience.relatedProjects.map(projectId => {
                          const project = PROJECTS.find(p => p.id === projectId);
                          if (!project) return null;
                          return (
                            <button 
                              key={projectId}
                              type="button"
                              className={`flex items-center bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all ${
                                selectedCompanyId === experience.id && projectId === selectedProject.id ? 'ring-2 ring-blue-500' : ''
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (project.company) {
                                  openCompanyModal(project.company);
                                }
                              }}
                            >
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden mr-3">
                                <Image 
                                  src={project.image}
                                  alt={project.title}
                                  fill
                                  className="object-cover"
                                  onError={() => handleImageError(project.id)}
                                />
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900 dark:text-white text-sm">{project.title}</h5>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{project.category}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* View details button */}
                  <div className="flex justify-end mt-2">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                      View Details <FaChevronRight className="ml-1 text-xs" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Project details modal */}
        {isModalOpen && modalType === 'project' && selectedProject && (
          <div 
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" 
            onClick={closeProjectModal}
          >
            <div 
              ref={modalContentRef}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <button 
                onClick={closeProjectModal}
                className="absolute right-4 top-4 z-20 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-full p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-md"
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
              
              {filteredProjects.length > 1 && (
                <>
                  <button 
                    onClick={prevProject}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors animate-pulseLight"
                    aria-label="Previous project"
                  >
                    <FaChevronLeft />
                  </button>
                  
                  <button 
                    onClick={nextProject}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors animate-pulseLight"
                    aria-label="Next project"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
              
              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="order-2 md:order-1 animate-slideInRight">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {/* Category tag */}
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
                        {selectedProject.category}
                      </span>
                      
                      {/* Company tag */}
                      {selectedProject.company && COMPANIES[selectedProject.company] && (
                        <button 
                          type="button"
                          className="flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-xs font-medium rounded-full hover:bg-purple-200 dark:hover:bg-purple-800/40 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (selectedProject.company) {
                              openCompanyModal(selectedProject.company);
                            }
                          }}
                          title={`View ${COMPANIES[selectedProject.company]?.name} details`}
                        >
                          <FaBuilding className="text-xs mr-1" /> 
                          {COMPANIES[selectedProject.company]?.name}
                        </button>
                      )}
                      
                      {/* Experience period tag */}
                      {(() => {
                        if (selectedProject.company) {
                          const relatedExp = getExperienceForProject(selectedProject);
                          if (relatedExp) {
                            return (
                              <button 
                                type="button"
                                className="flex items-center gap-1 px-4 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-sm font-medium rounded-full hover:bg-green-200 dark:hover:bg-green-900/70 transition-colors shadow-sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // Find experience index
                                  const expIndex = EXPERIENCES.findIndex(exp => exp.id === relatedExp.id);
                                  if (expIndex !== -1) {
                                    setSelectedExperienceIndex(expIndex);
                                    setModalType('experience');
                                  }
                                }}
                                title={`View experience at ${relatedExp.company ? COMPANIES[relatedExp.company]?.name : ''}`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="whitespace-nowrap">{relatedExp.period}</span>
                              </button>
                            );
                          }
                        }
                        return null;
                      })()}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">{selectedProject.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">{selectedProject.description}</p>
                    
                    {/* Related Experience Section - Removed (already shown in tags above) */}
                    
                    {/* Project Details */}
                    <div className="mb-8 bg-white dark:bg-gray-900/30 p-5 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                      <h4 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Project Details
                      </h4>
                      <ul className="space-y-3">
                        {selectedProject.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</span>
                            <span className="text-gray-700 dark:text-gray-300">{parseMarkdownLinks(detail)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {selectedProject.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-4 flex-wrap">
                      {selectedProject.github && (
                        <Link 
                          href={selectedProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 duration-300 shadow-md"
                        >
                          <FaGithub /> View Code
                        </Link>
                      )}
                      
                      {selectedProject.liveUrl && (
                        <Link 
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 duration-300 shadow-md"
                        >
                          <FaExternalLinkAlt /> Live Demo
                        </Link>
                      )}
                      
                      {selectedProject.androidUrl && (
                        <Link 
                          href={selectedProject.androidUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-[#01875f] hover:bg-[#017352] text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 duration-300 shadow-md"
                        >
                          <FaGooglePlay /> Google Play
                        </Link>
                      )}
                      
                      {selectedProject.iosUrl && (
                        <Link 
                          href={selectedProject.iosUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-black hover:bg-[#1a1a1a] text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 duration-300 shadow-md"
                        >
                          <FaApple /> App Store
                        </Link>
                      )}
                    </div>
                  </div>
                  
                  <div className="order-1 md:order-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl shadow-lg animate-slideInLeft">
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                      {imageError[selectedProject.id] ? (
                        <div 
                          className="absolute inset-0 flex flex-col items-center justify-center" 
                          style={{ backgroundColor: getProjectColor(selectedProjectIndex) }}
                        >
                          <div className="text-white text-6xl font-bold mb-4">
                            {selectedProject.title.charAt(0)}
                          </div>
                          <div className="text-white text-xl font-medium">
                            {selectedProject.title}
                          </div>
                          <div className="flex flex-wrap justify-center mt-4 gap-2 max-w-xs">
                            {selectedProject.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="bg-white/20 text-white px-2 py-1 rounded-md text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                          <Image 
                            src={selectedProject.image}
                            alt={selectedProject.title}
                            fill
                            className="object-cover relative z-10"
                            onError={() => handleImageError(selectedProject.id)}
                          />
                        </>
                      )}
                      
                      {/* 公司標記 - 在圖片右下角 (項目詳情頁) */}
                      {selectedProject.company && (
                        <button 
                          type="button"
                          className="absolute bottom-2 right-2 z-20 flex items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full py-1 px-2 shadow-md cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border border-gray-200 dark:border-gray-700"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (selectedProject.company) {
                              openCompanyModal(selectedProject.company);
                              console.log("Opening company modal for:", selectedProject.company);
                            }
                          }}
                          title={`View ${selectedProject.company ? COMPANIES[selectedProject.company]?.name : ''} work experience`}
                        >
                          <div className="relative w-5 h-5 rounded-full overflow-hidden">
                            <Image
                              src={selectedProject.company ? COMPANIES[selectedProject.company]?.logo || '' : ''}
                              alt={selectedProject.company ? COMPANIES[selectedProject.company]?.name || '' : ''}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="ml-1 text-xs font-medium text-gray-800 dark:text-gray-200">
                            {selectedProject.company ? COMPANIES[selectedProject.company]?.name : ''}
                          </span>
                        </button>
                      )}
                    </div>
                    
                    {/* Project multiple image preview - display if there are multiple images */}
                    {selectedProject.images && selectedProject.images.length > 1 && (
                      <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                        {selectedProject.images.map((img, idx) => {
                          const isActive = selectedProject.image === img;
                          return (
                            <div 
                              key={idx}
                              onClick={() => {
                                const updatedProject = {...selectedProject, image: img};
                                const newFilteredProjects = [...filteredProjects];
                                newFilteredProjects[selectedProjectIndex] = updatedProject;
                                setFilteredProjects(newFilteredProjects);
                              }}
                              className={`cursor-pointer flex-shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all duration-300 
                                ${isActive ? 'ring-2 ring-blue-500 scale-110 shadow-md' : 'opacity-70 hover:opacity-100'}`}
                            >
                              <div className="relative w-full h-full">
                                <Image 
                                  src={img}
                                  alt={`${selectedProject.title} - image ${idx+1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Project navigation overview - Removed */}
                
              </div>
            </div>
          </div>
        )}
        
        {/* Experience details modal */}
        {isModalOpen && modalType === 'experience' && selectedExperience && (
          <div 
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" 
            onClick={closeProjectModal}
          >
            <div 
              ref={modalContentRef}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <button 
                onClick={closeProjectModal}
                className="absolute right-4 top-4 z-20 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-full p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-md"
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
              
              {filteredExperiences.length > 1 && (
                <>
                  <button 
                    onClick={() => setSelectedExperienceIndex((prev) => (prev - 1 + filteredExperiences.length) % filteredExperiences.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors animate-pulseLight"
                    aria-label="Previous experience"
                  >
                    <FaChevronLeft />
                  </button>
                  
                  <button 
                    onClick={() => setSelectedExperienceIndex((prev) => (prev + 1) % filteredExperiences.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors animate-pulseLight"
                    aria-label="Next experience"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
              
              <div className="p-6 md:p-8">
                <div className="flex items-center mb-8">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-700">
                    <Image 
                      src={selectedExperience.logo}
                      alt={selectedExperience.company}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(selectedExperience.id)}
                    />
                  </div>
                  <div className="ml-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-xs font-medium rounded-full">
                        Professional Experience
                      </span>
                      
                      {/* Link to related company */}
                      {selectedExperience.company && (
                        <button 
                          type="button"
                          className="flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-xs font-medium rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/70 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openCompanyModal(selectedExperience.company);
                          }}
                          title={`View ${COMPANIES[selectedExperience.company]?.name || ''} details`}
                        >
                          <FaBuilding className="text-xs mr-1" /> 
                          {COMPANIES[selectedExperience.company]?.name || selectedExperience.company}
                        </button>
                      )}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-1 text-gray-900 dark:text-white">Founder & Lead Developer</h3>
                    <div className="flex items-center">
                      <p className="text-gray-600 dark:text-gray-400 text-lg">{COMPANIES[selectedExperience.company]?.name || selectedExperience.company}</p>
                      <span className="mx-2 text-gray-400">•</span>
                      <p className="text-gray-500 dark:text-gray-500">{selectedExperience.period}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="order-2 md:order-1 animate-slideInRight">
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">{selectedExperience.description}</p>
                    
                    <div className="mb-8 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-100 dark:border-gray-700">
                      <h4 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                        <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        Responsibilities & Achievements
                      </h4>
                      <ul className="space-y-3">
                        {selectedExperience.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</span>
                            <span className="text-gray-700 dark:text-gray-300">{parseMarkdownLinks(detail)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {selectedExperience.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {selectedExperience.liveUrl && (
                      <div className="flex gap-4">
                        <Link 
                          href={selectedExperience.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 duration-300 shadow-md"
                        >
                          <FaExternalLinkAlt /> Visit Website
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  <div className="order-1 md:order-2 animate-slideInLeft">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl shadow-lg">
                      <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                        <Image 
                          src={selectedExperience.image}
                          alt={selectedExperience.company}
                          fill
                          className="object-cover"
                          onError={() => handleImageError(selectedExperience.id)}
                        />
                      </div>
                    </div>
                    
                    {/* Related Projects */}
                    {selectedExperience.relatedProjects && selectedExperience.relatedProjects.length > 0 && (
                      <div className="mt-8">
                        <h4 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                          <FaLink className="mr-2 text-blue-600 dark:text-blue-400" />
                          Related Projects
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedExperience.relatedProjects.map(projectId => {
                            const project = PROJECTS.find(p => p.id === projectId);
                            if (!project) return null;
                            return (
                              <button 
                                key={projectId}
                                type="button"
                                className={`flex items-center bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all ${
                                  selectedCompanyId === selectedExperience.id && projectId === selectedProject.id ? 'ring-2 ring-blue-500' : ''
                                }`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (project.company) {
                                    openCompanyModal(project.company);
                                  }
                                }}
                              >
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden mr-3">
                                  <Image 
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                    onError={() => handleImageError(project.id)}
                                  />
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900 dark:text-white text-sm">{project.title}</h5>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{project.category}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Company details modal */}
        {isModalOpen && modalType === 'company' && selectedCompanyId && (
          <div 
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" 
            onClick={closeProjectModal}
          >
            <div 
              ref={modalContentRef}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={closeProjectModal}
                className="absolute right-4 top-4 z-20 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-full p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-md"
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
              
              {(() => {
                const company = COMPANIES[selectedCompanyId];
                const relatedProjects = getProjectsByCompany(selectedCompanyId);
                const relatedExperiences = getExperiencesByCompany(selectedCompanyId);
                
                return (
                  <div className="p-6 md:p-8">
                    <div className="flex items-center mb-8">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-700">
                        <Image 
                          src={company.logo}
                          alt={company.name}
                          fill
                          className="object-cover"
                          onError={() => handleImageError(company.id)}
                        />
                      </div>
                      <div className="ml-6">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-xs font-medium rounded-full">
                            Company
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-1 text-gray-900 dark:text-white">{company.name}</h3>
                        {company.location && (
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                            </svg>
                            <span>{company.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                      <div className="order-2 md:order-1 animate-slideInRight">
                        <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">{company.description}</p>
                        
                        {/* Company Website */}
                        {company.website && (
                          <div className="flex gap-4 mb-8">
                            <Link 
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 duration-300 shadow-md"
                            >
                              <FaExternalLinkAlt /> Visit Website
                            </Link>
                          </div>
                        )}
                        
                        {/* Related Work Experiences */}
                        {relatedExperiences.length > 0 && (
                          <div className="mb-8 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-100 dark:border-gray-700">
                            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                              <FaBuilding className="mr-2 text-purple-600 dark:text-purple-400" />
                              Work Experiences
                            </h4>
                            <div className="space-y-4">
                              {relatedExperiences.map((exp) => (
                                <button
                                  key={exp.id}
                                  type="button"
                                  className="w-full text-left bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // Find experience index in filtered experiences
                                    const expIndex = EXPERIENCES.findIndex(experience => experience.id === exp.id);
                                    if (expIndex !== -1) {
                                      setSelectedExperienceIndex(expIndex);
                                      setModalType('experience');
                                    }
                                  }}
                                >
                                  <div className="flex items-center">
                                    <div>
                                      <h5 className="font-medium text-gray-900 dark:text-white">Founder & Lead Developer</h5>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">{exp.period}</p>
                                    </div>
                                    <div className="ml-auto">
                                      <FaChevronRight className="text-purple-500" />
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="order-1 md:order-2 animate-slideInLeft">
                        {/* Related Projects */}
                        {relatedProjects.length > 0 && (
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl shadow-lg">
                            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                              <FaLink className="mr-2 text-purple-600 dark:text-purple-400" />
                              Related Projects
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                              {relatedProjects.map(project => (
                                <button 
                                  key={project.id}
                                  type="button"
                                  className="flex items-center bg-white dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // Find project index in filtered projects
                                    const projectIndex = filteredProjects.findIndex(p => p.id === project.id);
                                    if (projectIndex !== -1) {
                                      setSelectedProjectIndex(projectIndex);
                                      setModalType('project');
                                    } else {
                                      // If not in filtered projects, add it temporarily
                                      setFilteredProjects([...filteredProjects, project]);
                                      setSelectedProjectIndex(filteredProjects.length);
                                      setModalType('project');
                                    }
                                  }}
                                >
                                  <div className="relative w-12 h-12 rounded-lg overflow-hidden mr-3">
                                    <Image 
                                      src={project.image}
                                      alt={project.title}
                                      fill
                                      className="object-cover"
                                      onError={() => handleImageError(project.id)}
                                    />
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-gray-900 dark:text-white text-sm">{project.title}</h5>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{project.category}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Add CSS animation classes
// Add the following to globals.css

// @keyframes fadeIn {
//   from { opacity: 0; }
//   to { opacity: 1; }
// }

// @keyframes scaleIn {
//   from { transform: scale(0.95); opacity: 0; }
//   to { transform: scale(1); opacity: 1; }
// }

// @keyframes slideInLeft {
//   from { transform: translateX(-30px); opacity: 0; }
//   to { transform: translateX(0); opacity: 1; }
// }

// @keyframes slideInRight {
//   from { transform: translateX(30px); opacity: 0; }
//   to { transform: translateX(0); opacity: 1; }
// }

// @keyframes pulseLight {
//   0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
//   70% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
//   100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
// }

// .animate-fadeIn {
//   animation: fadeIn 0.3s ease-out forwards;
// }

// .animate-scaleIn {
//   animation: scaleIn 0.3s ease-out forwards;
// }

// .animate-slideInLeft {
//   animation: slideInLeft 0.5s ease-out forwards;
// }

// .animate-slideInRight {
//   animation: slideInRight 0.5s ease-out forwards;
// }

// .animate-pulseLight {
//   animation: pulseLight 2s infinite;
// } 