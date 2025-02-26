"use client";

import { useState } from 'react';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  liveUrl?: string;
  details: string[];
};

export default function FeaturedProjects() {
  const [activeProject, setActiveProject] = useState(0);
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});
  
  const projects: Project[] = [
    {
      id: 'cubeage',
      title: 'Cubeage Limited',
      description: 'Mobile gaming company specializing in card and casino games with millions of downloads',
      image: '/projects/cubeage.jpg',
      tags: ['Mobile Games', 'iOS', 'Android', 'Unity', 'C#'],
      liveUrl: 'https://cubeage.com',
      details: [
        'Founded and led Cubeage Limited, developing popular card and casino games',
        'Published 10+ games on Google Play and App Store with 100K+ installations',
        'Created Hong Kong Mahjong Tycoon, Fun Texas Holdem, and other popular titles',
        'Implemented innovative game mechanics resulting in 4.2+ average ratings',
        'Built and managed cross-functional teams for game development and operations'
      ]
    },
    {
      id: 'nakuz',
      title: 'Nakuz Website',
      description: 'Professional corporate website for business solutions',
      image: '/projects/nakuz.jpg',
      tags: ['React', 'Next.js', 'Responsive Design', 'SEO'],
      liveUrl: 'https://nakuz.com',
      details: [
        'Designed and developed the corporate website for Nakuz',
        'Built with modern technologies including React and Next.js',
        'Implemented responsive design for optimal viewing on all devices',
        'Integrated SEO best practices to improve visibility and organic traffic',
        'Created an intuitive user interface with streamlined navigation'
      ]
    },
    {
      id: 'mahjong',
      title: 'Hong Kong Mahjong Tycoon',
      description: '3D Mahjong game with multiple game modes and engaging gameplay',
      image: '/projects/hkmj.jpeg',
      tags: ['Unity', 'C#', 'Mobile Game', '3D Graphics', 'Multiplayer'],
      liveUrl: 'https://play.google.com/store/apps/dev?id=6521627455133408719',
      details: [
        'Developed a popular 3D Mahjong game with over 100K downloads',
        'Created authentic Hong Kong Mahjong gameplay with multiple game modes',
        'Implemented real-time multiplayer functionality with low latency',
        'Designed engaging UI/UX to maximize player retention',
        'Achieved 4.2-star rating with 3,280+ reviews on Google Play'
      ]
    },
    {
      id: 'fmj',
      title: 'Crazy Mahjong 16 Tiles',
      description: 'Popular Taiwanese Mahjong game with custom rules and exciting gameplay',
      image: '/projects/fmj.jpeg',
      tags: ['Unity', 'C#', 'Mobile Game', 'Multiplayer', 'Taiwanese Mahjong'],
      liveUrl: 'https://play.google.com/store/apps/dev?id=6521627455133408719',
      details: [
        'Developed a popular Taiwanese Mahjong game focusing on the unique 16-tile variant',
        'Implemented authentic Taiwanese Mahjong rules with customizable gameplay options',
        'Created engaging visuals and sound effects for an immersive gaming experience',
        'Built a robust multiplayer system supporting thousands of concurrent players',
        'Achieved high user retention through regular content updates and events'
      ]
    },
    {
      id: 'anymud',
      title: 'Anymud',
      description: 'A modern Medium-like platform with advanced editor capabilities',
      image: 'https://placehold.co/800x450/4A90E2/FFFFFF?text=Anymud+Platform',
      tags: ['TypeScript', 'Vue.js', 'Nest.js', 'GCP', 'Docker'],
      github: 'https://github.com/shtse8/anymud',
      liveUrl: 'https://anymud.com',
      details: [
        'Built a Medium-like platform with TypeScript, Vue.js, and Nest.js',
        'Developed an advanced HTML editable element editor with copy/paste images and smart backspace behavior',
        'Reduced content creation time by 50% through intuitive UX design',
        'Deployed on GCP with Docker for scalability',
        'Implemented SEO optimization with structured data, driving 60% organic traffic growth'
      ]
    },
    {
      id: 'dex',
      title: 'Decentralized Exchange',
      description: 'A hybrid DEX with cross-chain trading capabilities',
      image: 'https://placehold.co/800x450/50E3C2/FFFFFF?text=DEX+Platform',
      tags: ['TypeScript', 'Blockchain', 'Kubernetes', 'Microservices'],
      details: [
        'Designed a hybrid Bancor-Orderbook model for cross-chain asset trading',
        'Built with TypeScript microservices orchestrated with Kubernetes',
        'Implemented atomic swaps and cross-chain liquidity pools',
        'Created automated market making algorithms for optimal pricing',
        'Developed a responsive trading interface with real-time updates'
      ]
    },
    {
      id: 'ai-trading',
      title: 'AI Trading Platform',
      description: 'Reinforcement learning-powered stock trading system',
      image: 'https://placehold.co/800x450/F5A623/FFFFFF?text=AI+Trading',
      tags: ['Go', 'Python', 'TradingView', 'Reinforcement Learning'],
      github: 'https://github.com/shtse8/trading-ai',
      details: [
        'Developed a Go-based stock trading tool with TradingView integration',
        'Implemented reinforcement learning models to optimize trading strategies',
        'Achieved 30% higher returns in simulated environments',
        'Built a real-time dashboard for monitoring performance metrics',
        'Created backtesting tools for strategy validation'
      ]
    },
    {
      id: 'media-organizer',
      title: 'SotiMediaOrganizer',
      description: 'Advanced media deduplication and organization tool',
      image: '/projects/SotiMediaOrganizer.jpg',
      tags: ['TypeScript', 'Python', 'Bun', 'FFmpeg', 'Simhash'],
      github: 'https://github.com/shtse8/SotiMediaOrganizer',
      details: [
        'Created a media deduplication tool with TypeScript, Python, and Bun',
        'Leveraged Simhash, VP Tree, and FFmpeg for efficient processing',
        'Improved audio/video processing speed by 60%',
        'Implemented perceptual hashing for similar image detection',
        'Built a user-friendly interface for managing large media collections'
      ]
    }
  ];
  
  const nextProject = () => {
    setActiveProject((prev) => (prev + 1) % projects.length);
  };
  
  const prevProject = () => {
    setActiveProject((prev) => (prev - 1 + projects.length) % projects.length);
  };
  
  const currentProject = projects[activeProject];

  const handleImageError = (projectId: string) => {
    setImageError(prev => ({ ...prev, [projectId]: true }));
  };

  const getProjectColor = (index: number) => {
    const colors = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B'];
    return colors[index % colors.length];
  };
  
  return (
    <section id="projects" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Featured Projects</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-3xl mx-auto mb-16">
          Showcasing some of my most innovative work across different domains and technologies.
        </p>
        
        <div className="relative">
          <button 
            onClick={prevProject}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Previous project"
          >
            <FaChevronLeft />
          </button>
          
          <button 
            onClick={nextProject}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Next project"
          >
            <FaChevronRight />
          </button>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-2xl font-bold mb-4">{currentProject.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{currentProject.description}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Key Features:</h4>
                  <ul className="space-y-2">
                    {currentProject.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentProject.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  {currentProject.github && (
                    <Link 
                      href={currentProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <FaGithub /> View Code
                    </Link>
                  )}
                  
                  {currentProject.liveUrl && (
                    <Link 
                      href={currentProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <FaExternalLinkAlt /> Live Demo
                    </Link>
                  )}
                </div>
              </div>
              
              <div className="order-1 md:order-2 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  {imageError[currentProject.id] ? (
                    // 美觀的備用方案 - 帶有項目首字母和技術標籤的彩色背景
                    <div 
                      className="absolute inset-0 flex flex-col items-center justify-center" 
                      style={{ backgroundColor: getProjectColor(activeProject) }}
                    >
                      <div className="text-white text-6xl font-bold mb-4">
                        {currentProject.title.charAt(0)}
                      </div>
                      <div className="text-white text-xl font-medium">
                        {currentProject.title}
                      </div>
                      <div className="flex flex-wrap justify-center mt-4 gap-2 max-w-xs">
                        {currentProject.tags.slice(0, 3).map((tag, idx) => (
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
                        src={currentProject.image}
                        alt={currentProject.title}
                        fill
                        className="object-cover relative z-10"
                        onError={() => handleImageError(currentProject.id)}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              {projects.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveProject(idx)}
                  className={`w-3 h-3 mx-1 rounded-full transition-colors ${
                    idx === activeProject 
                      ? 'bg-blue-600' 
                      : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                  }`}
                  aria-label={`Go to project ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 