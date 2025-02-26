"use client";

import { useState } from 'react';
import { FaCalendarAlt, FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaLink } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

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
  relatedProjects?: string[]; // 相關項目的ID
};

export default function Experience() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  const experiences: ExperienceItem[] = [
    {
      id: 'cubeage',
      company: 'Cubeage Limited',
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
      company: 'Nakuz Limited',
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
      company: 'MiniMax Technology',
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
            {experiences.map((exp) => (
              <div 
                key={exp.id} 
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1 duration-300"
              >
                <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-500">
                  {/* Company Logo */}
                  <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-full bg-white dark:bg-gray-700 p-1 shadow-lg">
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
                      <p className="text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
                        <FaMapMarkerAlt className="mr-1" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                    <button 
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={() => toggleExpand(exp.id)}
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
                            {exp.relatedProjects.map(projectId => (
                              <Link 
                                key={projectId}
                                href={`#projects`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  // 滾動到項目部分
                                  const projectSection = document.getElementById('projects');
                                  projectSection?.scrollIntoView({ behavior: 'smooth' });
                                  
                                  // 可以在這裡添加邏輯來過濾項目或高亮特定項目
                                  // 例如，可以添加一個全局狀態來跟踪選定的公司，然後在項目部分使用它來過濾項目
                                  
                                  // 通知用戶如何查看相關項目
                                  alert(`請在項目部分查看 ${projectId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} 項目`);
                                }}
                                className="flex items-center bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                              >
                                <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                                {projectId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* View details/collapse button */}
                  <button
                    onClick={() => toggleExpand(exp.id)}
                    className="w-full mt-4 text-center text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline focus:outline-none"
                  >
                    {expandedId === exp.id ? 'Show Less' : 'View Achievements'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 