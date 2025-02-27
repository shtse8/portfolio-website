"use client";

import { useState, useRef, useEffect } from 'react';
import { FaLink, FaBuilding, FaExternalLinkAlt, FaChevronRight, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS, COMPANIES, EXPERIENCES, Project } from '@/data/portfolioData';
import type { Experience } from '@/data/portfolioData';
import ExperienceModal from './ExperienceModal';
import { parseMarkdownLinks } from '../projects/utils';

export default function Experience() {
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<number>(0);
  const [modalType, setModalType] = useState<'experience' | 'company'>('experience');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  
  // Touch swipe handling
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const modalContentRef = useRef<HTMLDivElement>(null);
  
  // Use the actual experiences from data
  const experiences = EXPERIENCES;
  
  // Sort experiences by start year (descending)
  const sortedExperiences = [...experiences].sort((a, b) => {
    const yearA = parseInt(a.period.split(' - ')[0]);
    const yearB = parseInt(b.period.split(' - ')[0]);
    return yearB - yearA;
  });
  
  // Set mounted state after hydration is complete
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Open experience modal
  const openExperienceModal = (index: number) => {
    setSelectedExperienceIndex(index);
    setIsModalOpen(true);
    setModalType('experience');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };
  
  // Open company modal
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
    } else {
      console.error("No company found for ID:", companyId);
      alert(`No company details found for: ${companyId}`);
    }
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Restore background scrolling
  };
  
  // Get projects by company
  const getProjectsByCompany = (companyId: string): Project[] => {
    return PROJECTS.filter((project: Project) => project.company === companyId);
  };
  
  // Get experiences by company
  const getExperiencesByCompany = (companyId: string): Experience[] => {
    return experiences.filter(exp => exp.company === companyId);
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
      setSelectedExperienceIndex((prev) => (prev + 1) % experiences.length);
    } else if (diff < -threshold) {
      // Swipe right, previous item
      setSelectedExperienceIndex((prev) => (prev - 1 + experiences.length) % experiences.length);
    }
    
    // Reset touch state
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section id="experience" className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
            <span className="relative z-10">Experience</span>
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Over 20 years of experience building innovative solutions and managing teams. Full stack expertise across multiple industries with strong leadership and marketing skills.
          </p>
        </div>
        
        {/* Timeline View - With responsive layout changes */}
        <div className="max-w-4xl mx-auto mb-16 relative">
          {/* Timeline Line - Longer to extend below the last card */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-blue-200 dark:bg-blue-900/50 h-[calc(100%+50px)]"></div>
          
          {sortedExperiences.map((exp, index) => {
            const startYear = exp.period.split(' - ')[0];
            const isEven = index % 2 === 0;
            const companyName = COMPANIES[exp.company]?.name || exp.company;
            
            return (
              <div 
                key={exp.id} 
                className={`relative ${index === 0 ? 'mt-8' : ''} mb-16
                           flex flex-col items-center
                           md:flex-row md:items-center md:mb-10
                           ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Timeline dot - positioned at top on mobile, centered on desktop */}
                <div className="mb-8 flex flex-col items-center z-10 md:mb-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2">
                  <div className="bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-1 mb-2 whitespace-nowrap">
                    {startYear}
                  </div>
                  <div className="w-5 h-5 rounded-full bg-white dark:bg-gray-800 border-4 border-blue-500 dark:border-blue-400"></div>
                </div>
                
                {/* Content - Mobile: below dot, Desktop: alternating sides */}
                <div 
                  className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg 
                            transition-shadow border border-gray-100 dark:border-gray-700 cursor-pointer
                            w-11/12 max-w-sm
                            md:w-5/12 md:mx-0
                            ${isEven ? 'md:mr-auto md:pr-6' : 'md:ml-auto md:pl-6'}`}
                  onClick={() => openExperienceModal(sortedExperiences.findIndex(e => e.id === exp.id))}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0 border border-gray-200 dark:border-gray-600">
                      <Image 
                        src={exp.logo} 
                        alt={companyName} 
                        width={40} 
                        height={40} 
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{exp.title}</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{companyName}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{exp.period}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{exp.description}</p>
                  <div className="flex justify-end mt-2">
                    <span className="text-blue-500 dark:text-blue-400 text-xs font-medium flex items-center">
                      Details <FaChevronRight className="ml-1 h-2 w-2" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Experience details modal - only render on client side */}
        {mounted && isModalOpen && modalType === 'experience' && experiences[selectedExperienceIndex] && (
          <div 
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" 
            onClick={closeModal}
          >
            <ExperienceModal
              experience={experiences[selectedExperienceIndex]}
              experiences={experiences}
              selectedExperienceIndex={selectedExperienceIndex}
              setSelectedExperienceIndex={setSelectedExperienceIndex}
              closeModal={closeModal}
              openCompanyModal={openCompanyModal}
              parseMarkdownLinks={parseMarkdownLinks}
              handleTouchStart={handleTouchStart}
              handleTouchMove={handleTouchMove}
              handleTouchEnd={handleTouchEnd}
              modalContentRef={modalContentRef as React.RefObject<HTMLDivElement>}
            />
          </div>
        )}
        
        {/* Company details modal - only render on client side */}
        {mounted && isModalOpen && modalType === 'company' && selectedCompanyId && COMPANIES[selectedCompanyId] && (
          <div 
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" 
            onClick={closeModal}
          >
            <div 
              ref={modalContentRef}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={closeModal}
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
                                  onClick={() => {
                                    setSelectedExperienceIndex(
                                      experiences.findIndex(e => e.id === exp.id)
                                    );
                                    setModalType('experience');
                                  }}
                                >
                                  <div className="flex items-center">
                                    <div>
                                      <h5 className="font-medium text-gray-900 dark:text-white">{exp.title}</h5>
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
                              {relatedProjects.map((project: Project) => (
                                <div 
                                  key={project.id}
                                  className="flex items-center bg-white dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all"
                                  onClick={() => {
                                    // Navigate to projects section
                                    closeModal();
                                    setTimeout(() => {
                                      const projectsSection = document.getElementById('projects');
                                      if (projectsSection) {
                                        projectsSection.scrollIntoView({ behavior: 'smooth' });
                                      }
                                    }, 300);
                                  }}
                                >
                                  <div className="relative w-12 h-12 rounded-lg overflow-hidden mr-3">
                                    <Image 
                                      src={project.image}
                                      alt={project.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-gray-900 dark:text-white text-sm">{project.title}</h5>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{project.category}</p>
                                  </div>
                                </div>
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