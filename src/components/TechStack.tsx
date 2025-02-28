"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaReact, FaNodeJs, FaPython, FaJava, FaDocker, FaDatabase, FaGamepad, FaRobot, FaUsers, FaChartLine, FaProjectDiagram, FaTimes, FaGithub, FaExternalLinkAlt, FaBriefcase, FaChevronRight } from 'react-icons/fa';
import { SiTypescript, SiKubernetes, SiGooglecloud, SiFirebase, SiUnity, SiEthereum } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILLS, PROJECTS, Project, EXPERIENCES, Experience } from '@/data/portfolioData';

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      duration: 0.5,
      ease: "easeOut"
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
      stiffness: 50,
      damping: 15,
      mass: 1.2,
      duration: 0.7
    }
  }
};

// SkillCard component for individual skill display
interface SkillCardProps {
  skill: typeof SKILLS[0];
  onClick: (skillId: string) => void;
  getSkillIcon: (skillId: string) => React.ReactNode;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onClick, getSkillIcon }) => {
  const relatedProjects = getRelatedProjects(skill.id);
  const relatedExperiences = getRelatedExperiences(skill.id);
  const relationshipCount = relatedProjects.length + relatedExperiences.length;
  
  return (
    <motion.div 
      variants={itemVariants}
      className={`group relative bg-gray-50 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl overflow-hidden 
                transition-all duration-300 ${relationshipCount > 0 ? 'cursor-pointer' : ''}`}
      whileHover={relationshipCount > 0 ? { 
        y: -3,
        backgroundColor: relationshipCount > 0 ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.8)"
      } : {}}
      onClick={() => relationshipCount > 0 && onClick(skill.id)}
    >
      {/* Colored accent in a minimal way */}
      <div className={`h-0.5 w-full ${skill.bgColor}`}></div>
      
      <div className="p-8">
        {/* Icon and title with more spacing and flatter design */}
        <div className="flex items-center mb-6">
          <div className={`${skill.color} p-3 rounded-lg mr-5`}>
            {getSkillIcon(skill.id)}
          </div>
          <h3 className="text-xl font-light tracking-wide">{skill.name}</h3>
        </div>
        
        {/* Description with better spacing */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">{skill.description}</p>
        
        {/* Expertise level with simplified flat design */}
        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-500 dark:text-gray-400 font-light">Expertise</span>
            <span className="text-gray-500 dark:text-gray-400 font-light">Expert</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${skill.bgColor}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${80 + Math.random() * 20}%` }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            />
          </div>
        </div>
        
        {/* Simplified related items info */}
        {relationshipCount > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-light">
                {relationshipCount} related {relationshipCount === 1 ? 'item' : 'items'}
              </span>
              {relationshipCount > 0 && (
                <div className="text-blue-500 dark:text-blue-400">
                  <FaChevronRight size={12} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function TechStack() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  // Get the icon component for a skill
  const getSkillIcon = (skillId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'react': <FaReact className="text-4xl" />,
      'typescript': <SiTypescript className="text-4xl" />,
      'nodejs': <FaNodeJs className="text-4xl" />,
      'python': <FaPython className="text-4xl" />,
      'java': <FaJava className="text-4xl" />,
      'docker': <FaDocker className="text-4xl" />,
      'kubernetes': <SiKubernetes className="text-4xl" />,
      'gcp': <SiGooglecloud className="text-4xl" />,
      'firebase': <SiFirebase className="text-4xl" />,
      'databases': <FaDatabase className="text-4xl" />,
      'unity3d': <SiUnity className="text-4xl" />,
      'gamedev': <FaGamepad className="text-4xl" />,
      'ai-ml': <FaRobot className="text-4xl" />,
      'blockchain': <SiEthereum className="text-4xl" />,
      'team-leadership': <FaUsers className="text-4xl" />,
      'business-growth': <FaChartLine className="text-4xl" />
    };
    return iconMap[skillId] || <FaReact className="text-4xl" />;
  };
  
  const filteredSkills = activeFilter 
    ? SKILLS.filter(skill => skill.category === activeFilter)
    : SKILLS;
    
  const categories = [
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'devops', name: 'DevOps' },
    { id: 'ai', name: 'AI & ML' },
    { id: 'game', name: 'Game Dev' },
    { id: 'blockchain', name: 'Blockchain' },
    { id: 'management', name: 'Management' }
  ];

  // Animation variants
  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.15
      }
    }
  };

  const handleShowProjects = (skillId: string) => {
    setSelectedSkill(skillId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSkill(null);
  };

  if (!mounted) return null;
  
  return (
    <section id="tech-stack" className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 -z-10"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 -z-10">
        <div className="absolute h-full w-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={headingVariants}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="gradient-text">Technical</span> Expertise
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Full-stack developer with extensive experience across multiple domains and technologies
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button 
            onClick={() => setActiveFilter(null)} 
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
              activeFilter === null 
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-500/20' 
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Technologies
          </motion.button>
          
          {categories.map(category => (
            <motion.button 
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                activeFilter === category.id 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-500/20' 
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {filteredSkills.map((skill) => (
            <SkillCard 
              key={skill.id}
              skill={skill}
              onClick={handleShowProjects}
              getSkillIcon={getSkillIcon}
            />
          ))}
        </motion.div>
      </div>

      {/* Projects and Experiences Modal */}
      <AnimatePresence>
        {showModal && selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              ref={modalRef}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedSkill && (
                <div>
                  {/* Header with gradient background */}
                  <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 p-8 rounded-t-2xl">
                    <button
                      onClick={closeModal}
                      aria-label="Close modal"
                      className="absolute right-6 top-6 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 p-2 rounded-full transition-colors"
                    >
                      <FaTimes className="text-gray-600 dark:text-gray-400" />
                    </button>
                    
                    <div className="flex items-center">
                      <div className={`${SKILLS.find(s => s.id === selectedSkill)?.bgColor} text-white p-4 rounded-xl mr-5`}>
                        {getSkillIcon(selectedSkill)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-light tracking-wide text-gray-900 dark:text-white">
                          {SKILLS.find(s => s.id === selectedSkill)?.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 font-light">
                          {SKILLS.find(s => s.id === selectedSkill)?.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    {/* Related Experiences Section (shown for management skills) */}
                    {getRelatedExperiences(selectedSkill).length > 0 && (
                      <div className="mb-10">
                        <h4 className="text-xl font-light tracking-wide mb-6 flex items-center text-gray-900 dark:text-white">
                          <FaBriefcase className="mr-3 text-indigo-500 dark:text-indigo-400" />
                          Related Experiences
                        </h4>
                        
                        <div className="grid grid-cols-1 gap-5">
                          {getRelatedExperiences(selectedSkill).map((experience) => (
                            <div
                              key={experience.id}
                              className="bg-gray-50 dark:bg-gray-800/20 rounded-xl overflow-hidden p-6 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800/30 cursor-pointer"
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
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Related Projects Section */}
                    {getRelatedProjects(selectedSkill).length > 0 && (
                      <div>
                        <h4 className="text-xl font-light tracking-wide mb-6 flex items-center text-gray-900 dark:text-white">
                          <FaProjectDiagram className="mr-3 text-blue-500 dark:text-blue-400" />
                          Related Projects
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {getRelatedProjects(selectedSkill).map((project) => (
                            <div
                              key={project.id}
                              className="bg-gray-50 dark:bg-gray-800/20 rounded-xl overflow-hidden transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800/30 cursor-pointer"
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
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {getRelatedProjects(selectedSkill).length === 0 && getRelatedExperiences(selectedSkill).length === 0 && (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400 font-light">
                        No related items found for this skill.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
} 