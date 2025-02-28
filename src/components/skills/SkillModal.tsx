"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import { FaProjectDiagram, FaBriefcase, FaExternalLinkAlt, FaGithub, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { SKILLS, PROJECTS, Project, EXPERIENCES, Experience } from '@/data/portfolioData';

type SkillModalProps = {
  skillId: string;
  closeModal: () => void;
  nextSkill: () => void;
  prevSkill: () => void;
  getSkillIcon: (id: string) => React.ReactNode;
};

// Get projects related to the selected skill
const getRelatedProjects = (skillId: string): Project[] => {
  const skill = SKILLS.find(s => s.id === skillId);
  if (!skill) return [];

  // PRIMARY CONNECTION: Get projects that explicitly list this skill in their relatedSkills array
  const explicitlyRelatedProjects = PROJECTS.filter(project => 
    project.relatedSkills?.includes(skillId)
  );
  
  // If we have explicit connections, prefer those
  if (explicitlyRelatedProjects.length > 0) {
    return explicitlyRelatedProjects;
  }
  
  // SECONDARY CONNECTION (FALLBACK): Find projects by matching skill keywords against project tags
  const keywordMatchedProjects = PROJECTS.filter(project => 
    project.tags.some(tag => 
      skill.keywords.some(keyword => 
        tag.toLowerCase().includes(keyword.toLowerCase())
      )
    )
  );
  
  return keywordMatchedProjects;
};

// Get experiences related to the selected skill
const getRelatedExperiences = (skillId: string): Experience[] => {
  return EXPERIENCES.filter(experience => 
    experience.relatedSkills?.includes(skillId)
  );
};

export default function SkillModal({
  skillId,
  closeModal,
  nextSkill,
  prevSkill,
  getSkillIcon,
}: SkillModalProps) {
  const skill = SKILLS.find(s => s.id === skillId);
  
  // Move these variables up before the useEffect
  const relatedProjects = skill ? getRelatedProjects(skillId) : [];
  const relatedExperiences = skill ? getRelatedExperiences(skillId) : [];

  // Add keyboard navigation - placed before the return statement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight') {
        nextSkill();
      } else if (e.key === 'ArrowLeft') {
        prevSkill();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal, nextSkill, prevSkill]);

  // Early return moved after the useEffect hook
  if (!skill) return null;

  // Enhanced animation variants for smoother transitions with directional support
  const contentVariants = {
    hidden: { 
      opacity: 0, 
      y: 10 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.98,
      transition: { 
        duration: 0.15,
        ease: "easeInOut" 
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.25,
        delay: 0.1 // Slight delay to ensure parent container appears first
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.1 }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full relative shadow-xl overflow-hidden">
      {/* Header with gradient background */}
      <motion.div 
        className="relative bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 p-8 rounded-t-2xl"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key={`skill-header-${skillId}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.div 
              className={`${skill.bgColor} text-white p-4 rounded-xl mr-5`}
              variants={itemVariants}
            >
              {getSkillIcon(skillId)}
            </motion.div>
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-light tracking-wide text-gray-900 dark:text-white">
                {skill.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2 font-light">
                {skill.description}
              </p>
            </motion.div>
          </div>
          
          {/* Add navigation controls */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevSkill}
              className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800"
            >
              <FaChevronLeft size={14} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextSkill}
              className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800"
            >
              <FaChevronRight size={14} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="p-8"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key={`skill-content-${skillId}`}
      >
        {/* Related Experiences Section */}
        {relatedExperiences.length > 0 && (
          <motion.div 
            className="mb-10"
            variants={itemVariants}
          >
            <h4 className="text-xl font-light tracking-wide mb-6 flex items-center text-gray-900 dark:text-white">
              <FaBriefcase className="mr-3 text-indigo-500 dark:text-indigo-400" />
              Related Experiences
            </h4>
            
            <div className="grid grid-cols-1 gap-5">
              {relatedExperiences.map((experience) => (
                <motion.div
                  key={experience.id}
                  className="bg-gray-50 dark:bg-gray-800/20 rounded-xl overflow-hidden p-6 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800/30 cursor-pointer shadow-sm"
                  variants={itemVariants}
                  whileHover={{ x: 2, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-start">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 mr-5">
                      <Image
                        src={experience.logo}
                        alt={experience.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-light text-lg mb-2 text-gray-900 dark:text-white tracking-wide">{experience.title}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{experience.company}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">{experience.period}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                        {experience.description || experience.details?.[0] || ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <motion.div
            variants={itemVariants}
          >
            <h4 className="text-xl font-light tracking-wide mb-6 flex items-center text-gray-900 dark:text-white">
              <FaProjectDiagram className="mr-3 text-blue-500 dark:text-blue-400" />
              Related Projects
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {relatedProjects.map((project) => (
                <motion.div
                  key={project.id}
                  className="bg-gray-50 dark:bg-gray-800/20 rounded-xl overflow-hidden transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800/30 cursor-pointer shadow-sm"
                  variants={itemVariants}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="relative h-44">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h5 className="font-light text-lg mb-3 text-gray-900 dark:text-white tracking-wide">{project.title}</h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 font-light line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-full">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/80 hover:bg-blue-500/80 text-white rounded-full transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaExternalLinkAlt size={10} /> Live Demo
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-full transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaGithub size={10} /> GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {relatedProjects.length === 0 && relatedExperiences.length === 0 && (
          <motion.div 
            className="text-center py-12 text-gray-500 dark:text-gray-400 font-light"
            variants={itemVariants}
          >
            No related items found for this skill.
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 