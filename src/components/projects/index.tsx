"use client";

import { useState, useEffect, useRef } from 'react';
import { Project, Experience, COMPANIES, EXPERIENCES, PROJECTS, CATEGORIES } from '../../data/portfolioData';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import ExperienceModal from './ExperienceModal';
import CompanyModal from './CompanyModal';
import { parseMarkdownLinks } from './utils';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaChevronRight } from 'react-icons/fa';

export default function FeaturedProjects() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(PROJECTS);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [mounted, setMounted] = useState<boolean>(false);
  
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
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10
      }
    }
  };
  
  // Set mounted state after hydration is complete
  useEffect(() => {
    setMounted(true);
  }, []);
  
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
  }, [activeCategory]);
  
  // Navigation functions
  const nextProject = () => {
    setSelectedProjectIndex((prev) => (prev + 1) % filteredProjects.length);
  };
  
  const prevProject = () => {
    setSelectedProjectIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };
  
  const handleImageError = (projectId: string) => {
    setImageError((prev) => ({ ...prev, [projectId]: true }));
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
      if (modalType === 'project') {
        nextProject();
      }
    } else if (diff < -threshold) {
      // Swipe right, previous item
      if (modalType === 'project') {
        prevProject();
      }
    }
    
    // Reset touch state
    touchStartX.current = 0;
    touchEndX.current = 0;
  };
  
  const selectedExperience = selectedExperienceIndex !== null && filteredExperiences.length > 0
    ? filteredExperiences[selectedExperienceIndex]
    : null;
  
  const openCompanyModal = (companyId: string) => {
    // Check if the company exists
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

  if (!mounted) return null;

  return (
    <section id="projects" className="py-20 relative overflow-hidden min-h-screen flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-primary-400/10 dark:bg-primary-600/5 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/5 w-72 h-72 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <div className="container mx-auto px-4 flex-1 flex flex-col">
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative">
            <span className="relative inline-block">
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-indigo-600"></span>
              <span>Featured Projects</span>
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A showcase of my most impactful work across various domains
          </p>
        </motion.div>
        
        {/* Categories Tabs */}
        <motion.div 
          className="flex flex-wrap justify-center mb-8 gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 mb-2 mr-2">
            <FaFilter className="text-primary-500 dark:text-primary-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
          </div>
          {CATEGORIES.map(category => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category 
                  ? 'bg-gradient-to-r from-primary-500 to-indigo-600 text-white shadow-lg shadow-primary-500/20' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Projects Grid */}
        {filteredProjects.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
              >
                <ProjectCard
                  project={project}
                  index={index}
                  openProjectModal={openProjectModal}
                  openCompanyModal={openCompanyModal}
                  handleImageError={handleImageError}
                  imageError={imageError}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Experiences List (for Professional Experience category) */}
        {filteredExperiences.length > 0 && (
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredExperiences.map((experience, index) => (
              <motion.div 
                key={experience.id} 
                className="glass-effect rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 duration-300 border border-white/20 dark:border-gray-700/30"
                onClick={() => openExperienceModal(index)}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{experience.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <motion.button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openCompanyModal(experience.company);
                        }}
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        whileHover={{ x: 3 }}
                      >
                        <div className="w-6 h-6 rounded-full overflow-hidden mr-2 border border-gray-200 dark:border-gray-600 shadow-sm">
                          <Image 
                            src={COMPANIES[experience.company].logo} 
                            alt={COMPANIES[experience.company].name}
                            width={24}
                            height={24}
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{COMPANIES[experience.company].name}</span>
                      </motion.button>
                      <span className="text-gray-400 dark:text-gray-500">•</span>
                      <span className="text-gray-600 dark:text-gray-400">{experience.period}</span>
                      {experience.location && (
                        <>
                          <span className="text-gray-400 dark:text-gray-500">•</span>
                          <span className="text-gray-600 dark:text-gray-400">{experience.location}</span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{experience.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {experience.tags.slice(0, 5).map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {experience.tags.length > 5 && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                        +{experience.tags.length - 5}
                      </span>
                    )}
                  </div>
                  
                  <motion.div 
                    className="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    View Details <FaChevronRight className="ml-1 h-3 w-3" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm" 
              onClick={closeModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-full max-w-4xl" 
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
} 