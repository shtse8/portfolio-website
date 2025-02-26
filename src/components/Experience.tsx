"use client";

import { useState } from 'react';
import { FaBriefcase, FaCalendarAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

type ExperienceItem = {
  id: string;
  company: string;
  position: string;
  period: string;
  location: string;
  details: string[];
  technologies: string[];
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
      position: 'Founder & CTO',
      period: '2014 — 2019',
      location: 'Hong Kong',
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
      ]
    },
    {
      id: 'nakuz',
      company: 'Nakuz Limited',
      position: 'Founder & Lead Developer',
      period: '2006 — Present',
      location: 'Hong Kong',
      technologies: ['PHP', 'PostgreSQL', 'Redis', 'SEO', 'React', 'Next.js', 'Responsive Design', 'REST APIs', 'Semantic HTML'],
      details: [
        'Transformed Sky-C Forum (Hong Kong\'s largest gaming community since 2001) into Nakuz with PHP and Discuz!, growing users by 50% through scalable backend design.',
        'Engineered REST APIs with PostgreSQL and Redis, integrating semantic HTML and SEO for top search engine rankings, improving response times by 40%.',
        'Pioneered IP exchange and gaming media platforms, collaborating with publishers to deliver robust content systems.',
        'Designed and developed professional corporate website and business solutions for Nakuz using React and Next.js.',
        'Implemented responsive design and SEO best practices to improve visibility and organic traffic.',
        'Created a publisher-focused article sharing platform with enhanced social integration, including Facebook and mobile optimized versions.'
      ]
    },
    {
      id: 'minimax',
      company: 'MiniMax Technology',
      position: 'Lead Developer',
      period: '2012 — 2014',
      location: 'Hong Kong',
      technologies: ['PHP', 'JavaScript', 'MySQL', 'Ubuntu', 'Game Distribution', 'Payment Integration', 'Physical Game Cards'],
      details: [
        'Led development at MiniMax Technology, a gaming platform company in Hong Kong focusing on game operations and agency distribution.',
        'Built the Funimax platform with pure PHP and JavaScript, developing a custom template system for rapid game website deployment.',
        'Created a platform that simultaneously operated 30+ games at its peak with robust payment and member management systems.',
        'Implemented physical game card system with secure validation and redemption for the Hong Kong market.',
        'Designed and developed agency and distribution systems to manage inventory and optimize operations.',
        'Deployed solutions on Ubuntu servers with MySQL databases for high reliability and performance.',
        'Oversaw game operations, distribution, and agency relationships across the region.'
      ]
    }
  ];

  return (
    <section id="experience" className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Professional Experience</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-3xl mx-auto mb-16">
          Over 20 years of experience building innovative solutions and managing teams. Full stack expertise across multiple industries with strong leadership and marketing skills.
        </p>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative border-l-2 border-blue-500 pl-8 ml-4">
            {experiences.map((exp, index) => (
              <div 
                key={exp.id} 
                className={`mb-12 relative ${
                  index === experiences.length - 1 ? '' : ''
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute -left-12 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaBriefcase className="text-white text-xs" />
                </div>
                
                {/* Experience card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                  {/* Card header */}
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => toggleExpand(exp.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{exp.position}</h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{exp.company}</p>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                          <FaCalendarAlt className="mr-2" />
                          <span>{exp.period}</span>
                          <span className="mx-2">•</span>
                          <span>{exp.location}</span>
                        </div>
                      </div>
                      <button 
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        aria-label={expandedId === exp.id ? "Collapse details" : "Expand details"}
                      >
                        {expandedId === exp.id ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.slice(0, expandedId === exp.id ? exp.technologies.length : 3).map((tech, idx) => (
                        <span 
                          key={idx}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {expandedId !== exp.id && exp.technologies.length > 3 && (
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-xs">
                          +{exp.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Expandable content */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedId === exp.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">Key Achievements:</h4>
                        <ul className="space-y-3">
                          {exp.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-blue-600 mr-2 mt-1">•</span>
                              <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 