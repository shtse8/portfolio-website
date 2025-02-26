"use client";

import { useState, useRef } from 'react';
import { FaCalendarAlt, FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaLink, FaBuilding, FaExternalLinkAlt, FaChevronRight, FaTimes, FaChevronLeft } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS, COMPANIES, Project } from '@/data/portfolioData';

// Define ExperienceItem type
type ExperienceItem = {
  id: string;
  company: string;
  position: string;
  period: string;
  location: string;
  logo: string;
  details: string[];
  technologies: string[];
  website?: string;
  relatedProjects?: string[]; // Related project IDs
};

export default function Experience() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<number>(0);
  const [modalType, setModalType] = useState<'experience' | 'company'>('experience');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  
  // Touch swipe handling
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const modalContentRef = useRef<HTMLDivElement>(null);
  
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  const experiences: ExperienceItem[] = [
    {
      id: 'cubeage',
      company: 'cubeage',
      position: 'Founder and Lead Developer',
      period: '2014 — 2019',
      location: 'Hong Kong',
      logo: '/companys/cubeage.jpeg',
      website: 'https://cubeage.com',
      technologies: ['Unity3D', 'Python', 'Java', 'Node.js', 'GCP', 'Docker', 'Kubernetes', 'MySQL', 'Percona', 'Redis', 'TypeScript'],
      details: [
        'Architected distributed multiplayer game backends with Unity3D, Python, Java, and Node.js, deployed on GCP with Docker and Kubernetes, achieving 99.99% uptime for millions of players.',
        'Implemented advanced neural network AI for card games using reinforcement and supervised learning, creating ELO-based matchmaking with adaptive AI opponents.',
        'Innovated a hybrid AI training pipeline combining supervised learning from player data with reinforcement learning techniques inspired by AlphaGo Zero, enabling AI to surpass human player skill levels.',
        'Developed real-time 3D games with advanced character customization, optimizing sync with TypeScript, Redis, and REST APIs, cutting latency by 50%.',
        'Created Corona Mahjong 16 Tiles (2014) using Corona SDK and built Cube Quest: 2248 Saga & Blackjack Showdown (2022) with Cocos2d, integrating ad mediation for 25% revenue growth.',
        'Integrated AdMob, Facebook, Unity Ads, and Appodeal mediation, boosting ad revenue by 35% across IAA/IAP titles.',
        'Founded and led Cubeage Limited, developing popular card and casino games with millions of downloads across multiple platforms.',
        'Published 10+ games on Google Play and App Store with 100K+ installations and 4.2+ average ratings.',
        'Developed flagship titles including Hong Kong Mahjong Tycoon (4.2★, 3,280+ reviews), Fun Mahjong 16 Tiles (1M+ downloads), Fun Showhand, and Big2 Tycoon.'
      ],
      relatedProjects: ['mahjong', 'fmj', 'fun-showhand', 'big2-tycoon']
    },
    {
      id: 'nakuz',
      company: 'nakuz',
      position: 'Founder and Lead Developer',
      period: '2006 — Present',
      location: 'Hong Kong',
      logo: '/companys/nakuz.jpeg',
      website: 'https://nakuz.com',
      technologies: ['PHP', 'PostgreSQL', 'Redis', 'SEO', 'React', 'Next.js', 'Responsive Design', 'REST APIs', 'Semantic HTML'],
      details: [
        'Transformed Sky-C Forum (Hong Kong\'s largest gaming community since 2001) into Nakuz with PHP and Discuz!, growing users by 50% through scalable backend design.',
        'Engineered REST APIs with PostgreSQL and Redis, integrating semantic HTML and SEO for top search engine rankings, improving response times by 40%.',
        'Pioneered IP exchange and gaming media platforms, collaborating with publishers to deliver robust content systems.',
        'Designed and developed professional corporate website and business solutions for Nakuz using React and Next.js.',
        'Implemented responsive design and SEO best practices to improve visibility and organic traffic.',
        'Created a publisher-focused article sharing platform with enhanced social integration, including Facebook and mobile optimized versions.'
      ],
      relatedProjects: ['nakuz']
    },
    {
      id: 'minimax',
      company: 'minimax',
      position: 'Founder and Lead Developer',
      period: '2010 — 2014',
      location: 'Hong Kong',
      logo: '/companys/minimax.jpeg',
      technologies: ['PHP', 'JavaScript', 'MySQL', 'Ubuntu', 'Game Distribution', 'Payment Integration', 'Physical Game Cards'],
      details: [
        'Led development at MiniMax Technology, a gaming platform company in Hong Kong focusing on game operations and agency distribution.',
        'Built the Funimax platform with pure PHP and JavaScript, developing a custom template system for rapid game website deployment.',
        'Created a platform that simultaneously operated 30+ games at its peak with robust payment and member management systems.',
        'Implemented physical game card system with secure validation and redemption for the Hong Kong market.',
        'Designed and developed agency and distribution systems to manage inventory and optimize operations.',
        'Deployed solutions on Ubuntu servers with MySQL databases for high reliability and performance.',
        'Oversaw game operations, distribution, and agency relationships across the region.'
      ],
      relatedProjects: ['funimax']
    }
  ];
  
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
    return PROJECTS.filter(project => project.company === companyId);
  };
  
  // Get experiences by company
  const getExperiencesByCompany = (companyId: string): ExperienceItem[] => {
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
  
  // Function to parse markdown-style links in text
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

  return (
    <section id="experience" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
            <span className="relative z-10">Professional Experience</span>
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Over 20 years of experience building innovative solutions and managing teams. Full stack expertise across multiple industries with strong leadership and marketing skills.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {experiences.map((exp, idx) => (
              <div 
                key={exp.id} 
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1 duration-300 cursor-pointer"
                onClick={() => openExperienceModal(idx)}
              >
                <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-500">
                  {/* Company Logo */}
                  <div 
                    className="absolute -bottom-10 left-6 w-20 h-20 rounded-full bg-white dark:bg-gray-700 p-1 shadow-lg cursor-pointer z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      openCompanyModal(exp.company);
                    }}
                    title={`View ${exp.company} details`}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={exp.logo}
                        alt={exp.company}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                      </pattern>
                      <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                  </div>
                  
                  {/* Period badge */}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-md">
                    <FaCalendarAlt className="mr-2 text-blue-500" />
                    {exp.period}
                  </div>
                </div>
                
                <div className="pt-12 px-6 pb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">{exp.position}</h3>
                      <button 
                        className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCompanyModal(exp.company);
                        }}
                      >
                        {exp.company}
                      </button>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
                        <FaMapMarkerAlt className="mr-1" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                    <button 
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(exp.id);
                      }}
                      aria-label={expandedId === exp.id ? "Collapse details" : "Expand details"}
                    >
                      {expandedId === exp.id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {exp.technologies.slice(0, expandedId === exp.id ? exp.technologies.length : 5).map((tech, idx) => (
                      <span 
                        key={idx}
                        className="bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {expandedId !== exp.id && exp.technologies.length > 5 && (
                      <span className="text-gray-500 dark:text-gray-400 text-xs font-medium px-2.5 py-0.5">
                        +{exp.technologies.length - 5} more
                      </span>
                    )}
                  </div>
                  
                  {/* Quick preview of achievements */}
                  {expandedId !== exp.id && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                      {exp.details[0]}
                    </p>
                  )}
                  
                  {/* Website link if available */}
                  {exp.website && (
                    <Link 
                      href={exp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline mb-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaLink className="mr-1 text-xs" /> {exp.website.replace(/(^\w+:|^)\/\//, '')}
                    </Link>
                  )}
                  
                  {/* Expandable content */}
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      expandedId === exp.id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                      <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">Key Achievements:</h4>
                      <ul className="space-y-3">
                        {exp.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-600 mr-2 mt-1 flex-shrink-0">•</span>
                            <span className="text-gray-700 dark:text-gray-300">{parseMarkdownLinks(detail)}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {/* Related Projects Section */}
                      {exp.relatedProjects && exp.relatedProjects.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                          <h4 className="font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                            <FaLink className="mr-2 text-blue-600" /> Related Projects
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.relatedProjects.map(projectId => {
                              const project = PROJECTS.find((p: Project) => p.id === projectId);
                              if (!project) return null;
                              return (
                                <button 
                                  key={projectId}
                                  className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Navigate to projects section
                                    const projectsSection = document.getElementById('projects');
                                    if (projectsSection) {
                                      projectsSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                  }}
                                >
                                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                  {project.title}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* View details button */}
                  <div className="flex justify-end mt-4">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                      View Details <FaChevronRight className="ml-1 text-xs" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Experience details modal */}
        {isModalOpen && modalType === 'experience' && experiences[selectedExperienceIndex] && (
          <div 
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" 
            onClick={closeModal}
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
                onClick={closeModal}
                className="absolute right-4 top-4 z-20 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-full p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-md"
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
              
              {experiences.length > 1 && (
                <>
                  <button 
                    onClick={() => setSelectedExperienceIndex((prev) => (prev - 1 + experiences.length) % experiences.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors animate-pulseLight"
                    aria-label="Previous experience"
                  >
                    <FaChevronLeft />
                  </button>
                  
                  <button 
                    onClick={() => setSelectedExperienceIndex((prev) => (prev + 1) % experiences.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors animate-pulseLight"
                    aria-label="Next experience"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
              
              <div className="p-6 md:p-8">
                <div className="flex items-center mb-8">
                  <div 
                    className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-700 cursor-pointer"
                    onClick={() => openCompanyModal(experiences[selectedExperienceIndex].company)}
                    title={`View company details`}
                  >
                    <Image 
                      src={experiences[selectedExperienceIndex].logo}
                      alt={experiences[selectedExperienceIndex].company}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-xs font-medium rounded-full">
                        Professional Experience
                      </span>
                      
                      {/* Link to related company */}
                      <button 
                        type="button"
                        className="flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-xs font-medium rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/70 transition-colors"
                        onClick={() => openCompanyModal(experiences[selectedExperienceIndex].company)}
                        title={`View company details`}
                      >
                        <FaBuilding className="text-xs mr-1" /> 
                        {COMPANIES[experiences[selectedExperienceIndex].company]?.name || experiences[selectedExperienceIndex].company}
                      </button>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-1 text-gray-900 dark:text-white">{experiences[selectedExperienceIndex].position}</h3>
                    <div className="flex items-center">
                      <button 
                        className="text-gray-600 dark:text-gray-400 text-lg hover:underline"
                        onClick={() => openCompanyModal(experiences[selectedExperienceIndex].company)}
                      >
                        {experiences[selectedExperienceIndex].company}
                      </button>
                      <span className="mx-2 text-gray-400">•</span>
                      <p className="text-gray-500 dark:text-gray-500">{experiences[selectedExperienceIndex].period}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="order-2 md:order-1 animate-slideInRight">
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{experiences[selectedExperienceIndex].location}</span>
                    </div>
                    
                    <div className="mb-8 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-100 dark:border-gray-700">
                      <h4 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                        <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        Key Achievements
                      </h4>
                      <ul className="space-y-3">
                        {experiences[selectedExperienceIndex].details.map((detail, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</span>
                            <span className="text-gray-700 dark:text-gray-300">{parseMarkdownLinks(detail)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {experiences[selectedExperienceIndex].technologies.map((tech, idx) => (
                        <span 
                          key={idx}
                          className="bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    {experiences[selectedExperienceIndex].website && (
                      <div className="flex gap-4">
                        <Link 
                          href={experiences[selectedExperienceIndex].website!}
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
                    {/* Related Projects */}
                    {experiences[selectedExperienceIndex].relatedProjects && experiences[selectedExperienceIndex].relatedProjects.length > 0 && (
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl shadow-lg">
                        <h4 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                          <FaLink className="mr-2 text-blue-600 dark:text-blue-400" />
                          Related Projects
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                          {experiences[selectedExperienceIndex].relatedProjects.map(projectId => {
                            const project = PROJECTS.find((p: Project) => p.id === projectId);
                            if (!project) return null;
                            return (
                              <div 
                                key={projectId}
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
        {isModalOpen && modalType === 'company' && selectedCompanyId && COMPANIES[selectedCompanyId] && (
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
                                      <h5 className="font-medium text-gray-900 dark:text-white">{exp.position}</h5>
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