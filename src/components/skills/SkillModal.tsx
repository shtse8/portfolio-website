"use client";

import React, { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { FaProjectDiagram, FaBriefcase, FaGithub, FaReact, FaNodeJs, FaPython, FaJava, FaDocker, FaDatabase, 
  FaGamepad, FaRobot, FaUsers, FaChartLine, FaNetworkWired, FaFileCode, FaSortAmountUp, FaApple, FaAndroid, 
  FaMobileAlt, FaSearch, FaVuejs, FaPhp, FaFacebook, FaCreditCard, FaImages, FaVideo, FaFingerprint, FaBolt, 
  FaMoneyBillWave, FaTelegram, FaChevronLeft, FaChevronRight, FaGlobe } from 'react-icons/fa';
import { SiTypescript, SiKubernetes, SiGooglecloud, SiFirebase, SiUnity, SiEthereum, SiSharp, SiNextdotjs, 
  SiNestjs, SiGooglechrome, SiGo, SiPytorch } from 'react-icons/si';
import { motion } from 'framer-motion';
import { PROJECTS } from '@/data/projects';
import { ROLES } from '@/data/roles';
import { formatPeriod } from '@/data';
import type { Project, Role } from '@/data/types';
import { getSkillNames } from '@/utils/skillHelpers';
import { cn } from '@/lib/utils';
import ProjectImage from '@/components/shared/ProjectImage';
import { getSkills } from '@/data/skills';

interface SkillModalProps {
  skillId: string;
  closeModal?: () => void;
  nextSkill?: () => void;
  prevSkill?: () => void;
}

// Animation variants for smooth transitions
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
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.06
    }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.15,
      ease: "easeInOut" as const
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
      ease: [0.22, 1, 0.36, 1] as const
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 }
  }
};

// Get projects related to the selected skill
const getRelatedProjects = (skillId: string): Project[] => {
  return PROJECTS.filter(project => project.skills.includes(skillId));
};

// Get roles related to the selected skill
const getRelatedRoles = (skillId: string): Role[] => {
  return ROLES.filter(role => role.skills?.includes(skillId));
};

// Icon mapping function using a memoized object
const iconComponents: Record<string, React.ReactNode> = {
  // Fa icons
  'FaReact': <FaReact className="text-4xl" aria-hidden="true" />,
  'FaNodeJs': <FaNodeJs className="text-4xl" aria-hidden="true" />,
  'FaPython': <FaPython className="text-4xl" aria-hidden="true" />,
  'FaJava': <FaJava className="text-4xl" aria-hidden="true" />,
  'FaDocker': <FaDocker className="text-4xl" aria-hidden="true" />,
  'FaDatabase': <FaDatabase className="text-4xl" aria-hidden="true" />,
  'FaGamepad': <FaGamepad className="text-4xl" aria-hidden="true" />,
  'FaRobot': <FaRobot className="text-4xl" aria-hidden="true" />,
  'FaUsers': <FaUsers className="text-4xl" aria-hidden="true" />,
  'FaChartLine': <FaChartLine className="text-4xl" aria-hidden="true" />,
  'FaNetworkWired': <FaNetworkWired className="text-4xl" aria-hidden="true" />,
  'FaFileCode': <FaFileCode className="text-4xl" aria-hidden="true" />,
  'FaSortAmountUp': <FaSortAmountUp className="text-4xl" aria-hidden="true" />,
  'FaApple': <FaApple className="text-4xl" aria-hidden="true" />,
  'FaAndroid': <FaAndroid className="text-4xl" aria-hidden="true" />,
  'FaMobileAlt': <FaMobileAlt className="text-4xl" aria-hidden="true" />,
  'FaSearch': <FaSearch className="text-4xl" aria-hidden="true" />,
  'FaVuejs': <FaVuejs className="text-4xl" aria-hidden="true" />,
  'FaPhp': <FaPhp className="text-4xl" aria-hidden="true" />,
  'FaFacebook': <FaFacebook className="text-4xl" aria-hidden="true" />,
  'FaCreditCard': <FaCreditCard className="text-4xl" aria-hidden="true" />,
  'FaImages': <FaImages className="text-4xl" aria-hidden="true" />,
  'FaVideo': <FaVideo className="text-4xl" aria-hidden="true" />,
  'FaFingerprint': <FaFingerprint className="text-4xl" aria-hidden="true" />,
  'FaBolt': <FaBolt className="text-4xl" aria-hidden="true" />,
  'FaMoneyBillWave': <FaMoneyBillWave className="text-4xl" aria-hidden="true" />,
  'FaTelegram': <FaTelegram className="text-4xl" aria-hidden="true" />,
  
  // Si icons
  'SiTypescript': <SiTypescript className="text-4xl" aria-hidden="true" />,
  'SiKubernetes': <SiKubernetes className="text-4xl" aria-hidden="true" />,
  'SiGooglecloud': <SiGooglecloud className="text-4xl" aria-hidden="true" />,
  'SiFirebase': <SiFirebase className="text-4xl" aria-hidden="true" />,
  'SiUnity': <SiUnity className="text-4xl" aria-hidden="true" />,
  'SiEthereum': <SiEthereum className="text-4xl" aria-hidden="true" />,
  'SiCsharp': <SiSharp className="text-4xl" aria-hidden="true" />,
  'SiNextdotjs': <SiNextdotjs className="text-4xl" aria-hidden="true" />,
  'SiNestjs': <SiNestjs className="text-4xl" aria-hidden="true" />,
  'SiGooglechrome': <SiGooglechrome className="text-4xl" aria-hidden="true" />,
  'SiGo': <SiGo className="text-4xl" aria-hidden="true" />,
  'SiPytorch': <SiPytorch className="text-4xl" aria-hidden="true" />,
};

// Get the appropriate icon component for a skill
const getSkillIcon = (iconName: string) => {
  return iconComponents[iconName] || iconComponents['FaReact'];
};

export default function SkillModal({
  skillId,
  closeModal,
  nextSkill,
  prevSkill,
}: SkillModalProps) {
  const skills = getSkills();
  const skill = skills.find(s => s.id === skillId);
  
  // Get related data - memoize for performance
  const relatedData = useMemo(() => {
    if (!skill) return { projects: [], roles: [] };

    return {
      projects: getRelatedProjects(skillId),
      roles: getRelatedRoles(skillId)
    };
  }, [skillId, skill]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeModal) {
        closeModal();
      } else if (e.key === 'ArrowRight' && nextSkill) {
        nextSkill();
      } else if (e.key === 'ArrowLeft' && prevSkill) {
        prevSkill();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal, nextSkill, prevSkill]);

  // Early return if skill not found
  if (!skill) return null;

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl w-full relative shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
      aria-labelledby={`skill-modal-title-${skillId}`}
    >
      {/* Navigation buttons */}
      {prevSkill && (
        <button
          onClick={prevSkill}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors"
          aria-label="Previous skill"
        >
          <FaChevronLeft className="h-4 w-4" />
        </button>
      )}
      
      {nextSkill && (
        <button
          onClick={nextSkill}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors"
          aria-label="Next skill"
        >
          <FaChevronRight className="h-4 w-4" />
        </button>
      )}
      
      {/* Header with skill information */}
      <motion.div 
        className="relative bg-gray-50 dark:bg-gray-900 p-6 sm:p-8"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key={`skill-header-${skillId}`}
      >
        <div className="flex items-center">
          <motion.div 
            className={cn(
              "text-white p-4 rounded-lg mr-4 sm:mr-5",
              skill.bgColor || "bg-blue-600"
            )}
            variants={itemVariants}
          >
            {getSkillIcon(skill.icon)}
          </motion.div>
          <motion.div variants={itemVariants} className="flex-1">
            <h3 
              id={`skill-modal-title-${skillId}`}
              className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white"
            >
              {skill.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
              {skill.description}
            </p>

            {/* Experience level indicator */}
            <div className="mt-4 flex items-center">
              <div className="flex-1 max-w-xs">
                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className={cn(
                      "h-1.5 rounded-full",
                      skill.bgColor || "bg-blue-600"
                    )}
                    style={{ width: `${Math.min(100, skill.yearsOfExperience * 10)}%` }}
                  />
                </div>
              </div>
              <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'} experience
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="p-6 sm:p-8"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key={`skill-content-${skillId}`}
      >
        {/* Related Roles Section */}
        {relatedData.roles.length > 0 && (
          <motion.div
            className="mb-8"
            variants={itemVariants}
          >
            <h4 className="text-lg font-medium mb-4 flex items-center text-gray-900 dark:text-gray-100">
              <FaBriefcase className="mr-3 text-blue-500 dark:text-blue-400" aria-hidden="true" />
              Work Experience
            </h4>

            <div className="grid grid-cols-1 gap-4">
              {relatedData.roles.map((role) => (
                <motion.div
                  key={role.id}
                  className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden p-4 sm:p-5 transition-all duration-200 hover:shadow-md border border-gray-100 dark:border-gray-700"
                  variants={itemVariants}
                  whileHover={{ x: 2, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-start">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden flex-shrink-0 mr-4 sm:mr-5 bg-gray-100 dark:bg-gray-800">
                      {role.logo && (
                        <Image
                          src={role.logo}
                          alt={`${role.title} logo`}
                          fill
                          className="object-contain p-1"
                          sizes="(max-width: 768px) 48px, 56px"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-base sm:text-lg mb-1 text-gray-900 dark:text-white">
                        {role.title}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{role.organizationId}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">{formatPeriod(role.period)}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                        {role.description || role.responsibilities?.[0] || ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Projects Section */}
        {relatedData.projects.length > 0 && (
          <motion.div
            variants={itemVariants}
          >
            <h4 className="text-lg font-medium mb-4 flex items-center text-gray-900 dark:text-gray-100">
              <FaProjectDiagram className="mr-3 text-blue-500 dark:text-blue-400" aria-hidden="true" />
              Projects
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedData.projects.map((project) => (
                <motion.div
                  key={project.id}
                  className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-100 dark:border-gray-700"
                  variants={itemVariants}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                    <ProjectImage
                      src={project.images}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      index={0}
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <h5 className="font-medium text-base sm:text-lg mb-2 text-gray-900 dark:text-white">
                      {project.title}
                    </h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skills && getSkillNames(project.skills).slice(0, 3).map((skillName, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                        >
                          {skillName}
                        </span>
                      ))}
                      {project.skills && project.skills.length > 3 && (
                        <span className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                          +{project.skills.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {project.urls?.website && (
                        <a
                          href={project.urls.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors"
                        >
                          <FaGlobe className="text-white" />
                          Live Demo
                        </a>
                      )}
                      {project.urls?.repository && (
                        <a
                          href={project.urls.repository}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors"
                        >
                          <FaGithub className="text-white" />
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Empty state */}
        {relatedData.projects.length === 0 && relatedData.roles.length === 0 && (
          <motion.div
            className="text-center py-10 text-gray-500 dark:text-gray-400"
            variants={itemVariants}
          >
            <p>No related projects or roles found for this skill.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 