"use client";

import { useState, useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  tags: string[];
  github?: string;
  liveUrl?: string;
  details: string[];
  category: string;
};

// 定義項目類別
const CATEGORIES = [
  "All",
  "Mobile Games",
  "Web Apps",
  "Blockchain",
  "Tools & Utilities",
  "AI & ML"
];

export default function FeaturedProjects() {
  const [activeProject, setActiveProject] = useState(0);
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  
  const projects: Project[] = [
    {
      id: 'cubeage',
      title: 'Cubeage Limited',
      description: 'Mobile gaming company specializing in card and casino games with millions of downloads',
      image: '/projects/cubeage.jpg',
      images: [
        '/projects/cubeage.jpg',
      ],
      tags: ['Mobile Games', 'iOS', 'Android', 'Unity', 'C#'],
      liveUrl: 'https://cubeage.com',
      category: "Mobile Games",
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
      images: [
        '/projects/nakuz.jpg',
      ],
      tags: ['React', 'Next.js', 'Responsive Design', 'SEO'],
      liveUrl: 'https://nakuz.com',
      category: "Web Apps",
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
      images: [
        '/projects/hkmj.jpeg',
      ],
      tags: ['Unity', 'C#', 'Mobile Game', '3D Graphics', 'Multiplayer'],
      liveUrl: 'https://play.google.com/store/apps/dev?id=6521627455133408719',
      category: "Mobile Games",
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
      images: [
        '/projects/fmj.jpeg',
      ],
      tags: ['Unity', 'C#', 'Mobile Game', 'Multiplayer', 'Taiwanese Mahjong'],
      liveUrl: 'https://play.google.com/store/apps/dev?id=6521627455133408719',
      category: "Mobile Games",
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
      description: 'Modern Medium-like publishing platform with advanced editor capabilities',
      image: 'https://placehold.co/800x450/4A90E2/FFFFFF?text=Anymud+Platform',
      images: [
        'https://placehold.co/800x450/4A90E2/FFFFFF?text=Anymud+Platform',
      ],
      tags: ['TypeScript', 'Vue.js', 'Nest.js', 'GCP', 'Docker', 'SEO'],
      github: 'https://github.com/shtse8/anymud',
      liveUrl: 'https://anymud.com',
      category: "Web Apps",
      details: [
        'Built a Medium-like platform with TypeScript, Vue.js, and Nest.js for streamlined content creation',
        'Developed an advanced HTML editable element editor with intuitive copying/pasting of images',
        'Implemented smart backspace behavior and keyboard shortcuts to slash content creation time by 50%',
        'Deployed on GCP with Docker for horizontal scaling and high availability',
        'Optimized SEO with structured data and semantic markup, driving 60% organic traffic growth'
      ]
    },
    {
      id: 'novelfeed',
      title: 'NovelFeed',
      description: 'Publisher-focused article sharing platform with enhanced social integration',
      image: 'https://placehold.co/800x450/D0021B/FFFFFF?text=NovelFeed',
      images: [
        'https://placehold.co/800x450/D0021B/FFFFFF?text=NovelFeed',
      ],
      tags: ['PHP', 'MySQL', 'Facebook Integration', 'Responsive Design', 'SEO'],
      category: "Web Apps",
      details: [
        'Developed a publisher-focused article sharing platform with PHP and MySQL',
        'Created Facebook and mobile optimized versions to maximize user reach',
        'Increased publisher engagement by 45% through intuitive content management tools',
        'Optimized web application with semantic HTML, structured data, and SEO best practices',
        'Achieved top search engine rankings for publisher content through technical optimization'
      ]
    },
    {
      id: 'dex',
      title: 'Decentralized Exchange',
      description: 'A hybrid DEX platform combining Bancor-Orderbook models for cross-chain trading',
      image: 'https://placehold.co/800x450/50E3C2/FFFFFF?text=DEX+Platform',
      images: [
        'https://placehold.co/800x450/50E3C2/FFFFFF?text=DEX+Platform',
      ],
      tags: ['TypeScript', 'Blockchain', 'Kubernetes', 'Microservices', 'EOS', 'Ethereum'],
      category: "Blockchain",
      details: [
        'Designed a hybrid Bancor-Orderbook model for cross-chain asset trading between EOS, ETH, and BTC',
        'Built with TypeScript microservices orchestrated with Kubernetes for high availability',
        'Implemented atomic swaps, cross-chain liquidity pools, and automated market making algorithms',
        'Created smart contracts for transparent profit sharing and automated settlements',
        'Developed a responsive trading interface with real-time order book updates and transaction tracking'
      ]
    },
    {
      id: 'blockchain-app-center',
      title: 'Blockchain App Center',
      description: 'Multi-chain application deployment platform with real-time profit sharing',
      image: 'https://placehold.co/800x450/4A90E2/FFFFFF?text=Blockchain+App+Center',
      images: [
        'https://placehold.co/800x450/4A90E2/FFFFFF?text=Blockchain+App+Center',
      ],
      tags: ['Blockchain', 'Smart Contracts', 'Multi-Chain', 'EOS', 'Ethereum', 'Bitcoin'],
      category: "Blockchain",
      details: [
        'Built a platform enabling streamlined deployment of applications across multiple blockchains',
        'Pioneered the industry\'s first real-time profit-sharing system for developers',
        'Eliminated the typical one-week delay in earnings distribution through smart contract automation',
        'Created a unified interface for managing applications on different blockchain networks',
        'Implemented secure wallet integration and transaction handling across chains'
      ]
    },
    {
      id: 'mining-pool',
      title: 'Multi-Chain Mining Pool Platform',
      description: 'Cross-chain mining pool system supporting EOS, ETH, and BTC with transparent profit sharing',
      image: 'https://placehold.co/800x450/F5A623/FFFFFF?text=Mining+Pool+Platform',
      images: [
        'https://placehold.co/800x450/F5A623/FFFFFF?text=Mining+Pool+Platform',
      ],
      tags: ['TypeScript', 'Vue.js', 'Blockchain', 'Kubernetes', 'Smart Contracts', 'EOS'],
      category: "Blockchain",
      details: [
        'Engineered a cross-chain mining pool system supporting EOS, ETH, and BTC',
        'Developed with TypeScript backend and Vue.js frontend deployed on Kubernetes',
        'Implemented blockchain-specific smart contracts for transparent profit sharing',
        'Created automated payout systems with full transaction verification',
        'Built real-time dashboards for miners to track earnings and performance metrics'
      ]
    },
    {
      id: 'ai-trading',
      title: 'Quantitative Trading System',
      description: 'Advanced algorithmic trading platform leveraging multiple indicators and real-time execution',
      image: '/projects/quant_trading.jpg',
      images: [
        '/projects/quant_trading.jpg',
      ],
      tags: ['Go', 'Python', 'TradingView', 'TigerTrade', 'Firebase', 'PyTorch', 'Telegram'],
      github: 'https://github.com/shtse8/TradingBot',
      category: "AI & ML",
      details: [
        'Developed a serverless quantitative trading system using Golang, Firebase, and Cloud Run',
        'Integrated TradingView for market monitoring and TigerTrade for automated trade execution',
        'Built Python-based backtesting framework with pandas, PyTorch, and backtrader',
        'Implemented machine learning models with PyTorch, AdaBelief optimizer, and Huber Loss function',
        'Created a Telegram bot for real-time trade notifications, signals, and performance reporting'
      ]
    },
    {
      id: 'media-organizer',
      title: 'SotiMediaOrganizer',
      description: 'Advanced media deduplication and organization tool',
      image: '/projects/SotiMediaOrganizer.jpg',
      images: [
        '/projects/SotiMediaOrganizer.jpg',
      ],
      tags: ['TypeScript', 'Python', 'Bun', 'FFmpeg', 'Simhash'],
      github: 'https://github.com/shtse8/SotiMediaOrganizer',
      category: "Tools & Utilities",
      details: [
        'Created a media deduplication tool with TypeScript, Python, and Bun',
        'Leveraged Simhash, VP Tree, and FFmpeg for efficient processing',
        'Improved audio/video processing speed by 60%',
        'Implemented perceptual hashing for similar image detection',
        'Built a user-friendly interface for managing large media collections'
      ]
    },
    {
      id: 'google-photos-delete',
      title: 'Google Photos Delete Tool',
      description: 'Chrome extension for efficient bulk deletion of Google Photos',
      image: '/projects/google_photo_delete_tool.jpg',
      images: [
        '/projects/google_photo_delete_tool.jpg',
      ],
      tags: ['JavaScript', 'Chrome Extension', 'Automation', 'Google Photos API'],
      github: 'https://github.com/shtse8/google-photos-delete-tool',
      liveUrl: 'https://chromewebstore.google.com/detail/google-photos-delete-tool/jiahfbbfpacpolomdjlpdpiljllcdenb',
      category: "Tools & Utilities",
      details: [
        'Developed a Chrome extension with 2,000+ users to efficiently manage and clean up Google Photos libraries',
        'Implemented intelligent batch processing with custom selectors for automated photo deletion',
        'Created smart scrolling logic to handle large photo libraries with 10,000+ images',
        'Built in robust error handling and progress tracking for operation reliability',
        'Earned 4.7/5 star rating on Chrome Web Store and 73+ stars on GitHub'
      ]
    }
  ];
  
  // 篩選項目
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === activeCategory));
    }
    setActiveProject(0);
  }, [activeCategory]);
  
  const nextProject = () => {
    setActiveProject((prev) => (prev + 1) % filteredProjects.length);
  };
  
  const prevProject = () => {
    setActiveProject((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };
  
  const currentProject = filteredProjects[activeProject] || projects[0];

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
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-3xl mx-auto mb-8">
          Showcasing some of my most innovative work across different domains and technologies.
        </p>
        
        {/* 類別篩選器 */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                category === activeCategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* 視圖切換按鈕 */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('carousel')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'carousel'
                  ? 'bg-white dark:bg-gray-800 shadow'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Carousel View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-800 shadow'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Grid View
            </button>
          </div>
        </div>
        
        {viewMode === 'grid' ? (
          // 網格視圖
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-10">
            {filteredProjects.map((project, idx) => (
              <div 
                key={project.id}
                onClick={() => {
                  setActiveProject(idx);
                  setViewMode('carousel');
                }}
                className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  {imageError[project.id] ? (
                    <div 
                      className="absolute inset-0 flex items-center justify-center" 
                      style={{ backgroundColor: getProjectColor(idx) }}
                    >
                      <span className="text-white text-4xl font-bold">{project.title.charAt(0)}</span>
                    </div>
                  ) : (
                    <Image 
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(project.id)}
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 truncate">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <span 
                        key={idx}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-gray-500 dark:text-gray-400 text-xs">+{project.tags.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // 輪播視圖
          <>
            {/* 項目預覽列 - 使用分頁式布局代替橫向滾動 */}
            <div className="mb-12">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 px-2">
                {filteredProjects.slice(0, 16).map((project, idx) => (
                  <div 
                    key={project.id}
                    onClick={() => setActiveProject(idx)}
                    className={`cursor-pointer transition-all duration-200 ${
                      idx === activeProject 
                        ? 'ring-4 ring-blue-500 transform scale-105' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                      {imageError[project.id] ? (
                        <div 
                          className="absolute inset-0 flex items-center justify-center" 
                          style={{ backgroundColor: getProjectColor(idx) }}
                        >
                          <span className="text-white text-xl font-bold">{project.title.charAt(0)}</span>
                        </div>
                      ) : (
                        <Image 
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                          onError={() => handleImageError(project.id)}
                        />
                      )}
                    </div>
                    <div className="mt-2 text-xs font-medium text-center truncate">
                      {project.title}
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredProjects.length > 16 && (
                <div className="text-center mt-4">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Show All Projects
                  </button>
                </div>
              )}
            </div>
          
            <div className="relative">
              {filteredProjects.length > 1 && (
                <>
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
                </>
              )}
              
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
                    
                    {/* 項目多圖片預覽 - 如果有多張圖片則顯示 */}
                    {currentProject.images && currentProject.images.length > 1 && (
                      <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                        {currentProject.images.map((img, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              const updatedProject = {...currentProject, image: img};
                              setFilteredProjects(prevState => {
                                const newState = [...prevState];
                                newState[activeProject] = updatedProject;
                                return newState;
                              });
                            }}
                            className={`cursor-pointer flex-shrink-0 w-16 h-16 rounded-md overflow-hidden ${
                              currentProject.image === img ? 'ring-2 ring-blue-500' : ''
                            }`}
                          >
                            <div className="relative w-full h-full">
                              <Image 
                                src={img}
                                alt={`${currentProject.title} - image ${idx+1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {filteredProjects.length > 1 && (
                  <div className="flex justify-center mt-8">
                    {filteredProjects.map((_, idx) => (
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
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
} 