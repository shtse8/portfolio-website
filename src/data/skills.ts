import { TechSkill } from './types';
import { calculateSkillExperience } from '../utils/skillExperience';

// Cache for skill experience calculations
let skillsCache: TechSkill[] | null = null;

/**
 * Clears the skills cache to force recalculation
 * This should be called when project data changes
 */
export function clearSkillsCache(): void {
  skillsCache = null;
}

// Create a function that gets the skill data with dynamically calculated experience
export function getSkills(): TechSkill[] {
  // Return cached version if available
  if (skillsCache) {
    return skillsCache;
  }
  
  // Calculate and cache the skills data
  skillsCache = SKILLS_BASE.map(skill => ({
    ...skill,
    yearsOfExperience: calculateSkillExperience(skill.id)
  }));
  
  return skillsCache;
}

// Export the base skills data without experience calculations
export const SKILLS_BASE: Omit<TechSkill, 'yearsOfExperience'>[] = [
  {
    id: 'react',
    name: 'React',
    description: 'Building interactive UIs with React and Next.js',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/90 dark:bg-blue-500/80',
    category: 'frontend',
    keywords: [
      'React',
      'Next.js',
      'JSX'
    ],
    icon: 'FaReact',
    parentId: 'javascript',
    relatedIds: ['vuejs', 'svelte']
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    description: 'Type-safe development with advanced patterns',
    color: 'text-blue-700',
    bgColor: 'bg-blue-700/90 dark:bg-blue-700/80',
    category: 'frontend',
    keywords: [
      'TypeScript',
      'TS'
    ],
    icon: 'SiTypescript',
    parentId: 'javascript',
    relatedIds: ['dart']
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'Scalable backend services with Express and Nest.js',
    color: 'text-green-600',
    bgColor: 'bg-green-600/90 dark:bg-green-600/80',
    category: 'backend',
    keywords: [
      'Node.js',
      'Express',
      'Nest.js'
    ],
    icon: 'FaNodeJs',
    parentId: 'javascript',
    relatedIds: ['bun', 'php']
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Data processing, ML, and automation',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-600/90 dark:bg-yellow-500/80',
    category: 'backend',
    keywords: [
      'Python',
      'PyTorch'
    ],
    icon: 'FaPython'
  },
  {
    id: 'java',
    name: 'Java',
    description: 'Enterprise applications and Android development',
    color: 'text-red-600',
    bgColor: 'bg-red-600/90 dark:bg-red-600/80',
    category: 'backend',
    keywords: [
      'Java',
      'Android'
    ],
    icon: 'FaJava'
  },
  {
    id: 'docker',
    name: 'Docker',
    description: 'Containerization for consistent deployments',
    color: 'text-blue-800',
    bgColor: 'bg-blue-800/90 dark:bg-blue-800/80',
    category: 'devops',
    keywords: [
      'Docker',
      'Container'
    ],
    icon: 'FaDocker'
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    description: 'Orchestration for microservices architecture',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'devops',
    keywords: [
      'Kubernetes',
      'K8s',
      'Microservices'
    ],
    icon: 'SiKubernetes'
  },
  {
    id: 'gcp',
    name: 'GCP',
    description: 'Cloud infrastructure and serverless solutions',
    color: 'text-red-500',
    bgColor: 'bg-red-500/90 dark:bg-red-500/80',
    category: 'devops',
    keywords: [
      'GCP',
      'Google Cloud',
      'Cloud Run'
    ],
    icon: 'SiGooglecloud'
  },
  {
    id: 'firebase',
    name: 'Firebase',
    description: 'Real-time databases and authentication',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/90 dark:bg-yellow-500/80',
    category: 'backend',
    keywords: [
      'Firebase'
    ],
    icon: 'SiFirebase'
  },
  {
    id: 'databases',
    name: 'Databases',
    description: 'PostgreSQL, MySQL, Redis, and NoSQL solutions',
    color: 'text-gray-700',
    bgColor: 'bg-gray-700/90 dark:bg-gray-700/80',
    category: 'backend',
    keywords: [
      'MySQL',
      'PostgreSQL',
      'Redis',
      'NoSQL',
      'Database',
      'Percona'
    ],
    icon: 'FaDatabase'
  },
  {
    id: 'unity3d',
    name: 'Unity3D',
    description: '3D game development and simulations',
    color: 'text-gray-800',
    bgColor: 'bg-gray-800/90 dark:bg-gray-800/80',
    category: 'game',
    keywords: [
      'Unity',
      'Unity3D'
    ],
    icon: 'SiUnity'
  },
  {
    id: 'gamedev',
    name: 'Game Dev',
    description: 'Multiplayer systems and game mechanics',
    color: 'text-purple-600',
    bgColor: 'bg-purple-600/90 dark:bg-purple-600/80',
    category: 'game',
    keywords: [
      'Game',
      'Mobile Game',
      'Multiplayer'
    ],
    icon: 'FaGamepad'
  },
  {
    id: 'ai-ml',
    name: 'AI & ML',
    description: 'Reinforcement learning and LLM integration',
    color: 'text-green-700',
    bgColor: 'bg-green-700/90 dark:bg-green-700/80',
    category: 'ai',
    keywords: [
      'AI',
      'ML',
      'Machine Learning',
      'PyTorch'
    ],
    icon: 'FaRobot'
  },
  {
    id: 'blockchain',
    name: 'Blockchain',
    description: 'Smart contracts and decentralized applications',
    color: 'text-purple-800',
    bgColor: 'bg-purple-800/90 dark:bg-purple-800/80',
    category: 'blockchain',
    keywords: [
      'Blockchain',
      'Smart Contracts',
      'EOS',
      'Ethereum',
      'Bitcoin'
    ],
    icon: 'SiEthereum'
  },
  {
    id: 'team-leadership',
    name: 'Team Leadership',
    description: 'Building and managing high-performing development teams',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-600/90 dark:bg-indigo-600/80',
    category: 'management',
    keywords: [
      'Leadership',
      'Management',
      'Team Building',
      'Agile',
      'Mentoring',
      'Project Management'
    ],
    icon: 'FaUsers'
  },
  {
    id: 'business-growth',
    name: 'Business Growth',
    description: 'Marketing, product strategy, and business development',
    color: 'text-teal-600',
    bgColor: 'bg-teal-600/90 dark:bg-teal-600/80',
    category: 'management',
    keywords: [
      'Marketing',
      'Strategy',
      'Business Development',
      'Product Management',
      'Growth Hacking',
      'Analytics'
    ],
    icon: 'FaChartLine'
  },
  {
    id: 'socket-io',
    name: 'Socket.IO',
    description: 'Real-time bidirectional event-based communication',
    color: 'text-gray-600',
    bgColor: 'bg-gray-600/90 dark:bg-gray-600/80',
    category: 'backend',
    keywords: [
      'Socket.IO',
      'WebSockets',
      'Real-time'
    ],
    icon: 'FaNetworkWired'
  },
  {
    id: 'protobuf',
    name: 'Protocol Buffers',
    description: 'Language-neutral data serialization for APIs',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/90 dark:bg-blue-500/80',
    category: 'backend',
    keywords: [
      'Protobuf',
      'Protocol Buffers',
      'gRPC'
    ],
    icon: 'FaFileCode'
  },
  {
    id: 'elo-rating',
    name: 'ELO Rating',
    description: 'Mathematical rating system for competitive games',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/90 dark:bg-purple-500/80',
    category: 'game',
    keywords: [
      'ELO',
      'Rating System',
      'Matchmaking'
    ],
    icon: 'FaSortAmountUp'
  },
  {
    id: 'csharp',
    name: 'C#',
    description: 'Object-oriented programming with .NET',
    color: 'text-purple-700',
    bgColor: 'bg-purple-700/90 dark:bg-purple-700/80',
    category: 'backend',
    keywords: [
      'C#',
      '.NET',
      'Unity'
    ],
    icon: 'SiCsharp'
  },
  {
    id: 'ios',
    name: 'iOS',
    description: 'Mobile development for Apple devices',
    color: 'text-gray-700',
    bgColor: 'bg-gray-700/90 dark:bg-gray-700/80',
    category: 'mobile',
    keywords: [
      'iOS',
      'Apple',
      'Mobile Development'
    ],
    icon: 'FaApple'
  },
  {
    id: 'android',
    name: 'Android',
    description: 'Mobile development for Android devices',
    color: 'text-green-700',
    bgColor: 'bg-green-700/90 dark:bg-green-700/80',
    category: 'mobile',
    keywords: [
      'Android',
      'Mobile Development'
    ],
    icon: 'FaAndroid'
  },
  {
    id: 'responsive-design',
    name: 'Responsive Design',
    description: 'Creating websites that work on all devices',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'frontend',
    keywords: [
      'Responsive Design',
      'Mobile First',
      'CSS'
    ],
    icon: 'FaMobileAlt'
  },
  {
    id: 'seo',
    name: 'SEO',
    description: 'Search engine optimization for improved visibility',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'marketing',
    keywords: [
      'SEO',
      'Search Engine Optimization',
      'Web Marketing'
    ],
    icon: 'FaSearchDollar'
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    description: 'React framework for production-grade applications',
    color: 'text-black',
    bgColor: 'bg-black/90 dark:bg-gray-800/80',
    category: 'frontend',
    keywords: [
      'Next.js',
      'React',
      'SSR',
      'Static Site Generation'
    ],
    icon: 'SiNextdotjs',
    parentId: 'react'
  },
  {
    id: 'vuejs',
    name: 'Vue.js',
    description: 'Progressive JavaScript framework for UIs',
    color: 'text-green-600',
    bgColor: 'bg-green-600/90 dark:bg-green-600/80',
    category: 'frontend',
    keywords: [
      'Vue.js',
      'JavaScript Framework',
      'Frontend'
    ],
    icon: 'FaVuejs',
    parentId: 'javascript',
    relatedIds: ['react', 'svelte']
  },
  {
    id: 'nestjs',
    name: 'Nest.js',
    description: 'Progressive Node.js framework for building server-side applications',
    color: 'text-red-600',
    bgColor: 'bg-red-600/90 dark:bg-red-600/80',
    category: 'backend',
    keywords: [
      'Nest.js',
      'Node.js',
      'TypeScript',
      'Server-side'
    ],
    icon: 'SiNestjs',
    parentId: 'nodejs'
  },
  {
    id: 'php',
    name: 'PHP',
    description: 'Server-side scripting language for web development',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-600/90 dark:bg-indigo-600/80',
    category: 'backend',
    keywords: [
      'PHP',
      'Backend',
      'Web Development'
    ],
    icon: 'FaPhp'
  },
  {
    id: 'facebook-integration',
    name: 'Facebook Integration',
    description: 'Implementing Facebook APIs and social features',
    color: 'text-blue-700',
    bgColor: 'bg-blue-700/90 dark:bg-blue-700/80',
    category: 'social',
    keywords: [
      'Facebook',
      'Social Media',
      'API Integration',
      'Authentication'
    ],
    icon: 'FaFacebook'
  },
  {
    id: 'payment-integration',
    name: 'Payment Integration',
    description: 'Implementing secure payment processing systems',
    color: 'text-green-800',
    bgColor: 'bg-green-800/90 dark:bg-green-800/80',
    category: 'backend',
    keywords: [
      'Payments',
      'E-commerce',
      'Stripe',
      'PayPal',
      'Payment Processing'
    ],
    icon: 'FaCreditCard'
  },
  {
    id: 'chrome-extension',
    name: 'Chrome Extensions',
    description: 'Building browser extensions for Chrome',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'frontend',
    keywords: [
      'Chrome Extension',
      'Browser Extension',
      'JavaScript',
      'Browser API'
    ],
    icon: 'SiGooglechrome'
  },
  {
    id: 'google-photos-api',
    name: 'Google Photos API',
    description: 'Working with Google Photos API for image management',
    color: 'text-red-500',
    bgColor: 'bg-red-500/90 dark:bg-red-500/80',
    category: 'api',
    keywords: [
      'Google Photos',
      'API',
      'Photo Management',
      'Image Management',
      'Cloud Storage'
    ],
    icon: 'FaImages'
  },
  {
    id: 'ffmpeg',
    name: 'FFmpeg',
    description: 'Audio and video processing toolkit',
    color: 'text-green-700',
    bgColor: 'bg-green-700/90 dark:bg-green-700/80',
    category: 'tools',
    keywords: [
      'FFmpeg',
      'Video Processing',
      'Audio Processing',
      'Media'
    ],
    icon: 'FaVideo'
  },
  {
    id: 'simhash',
    name: 'Simhash',
    description: 'Similarity detection algorithm for near-duplicate detection',
    color: 'text-purple-600',
    bgColor: 'bg-purple-600/90 dark:bg-purple-600/80',
    category: 'algorithms',
    keywords: [
      'Simhash',
      'Duplicate Detection',
      'Algorithms',
      'Near-Duplicate Detection'
    ],
    icon: 'FaFingerprint'
  },
  {
    id: 'bun',
    name: 'Bun',
    description: 'Fast JavaScript runtime and toolkit',
    color: 'text-pink-600',
    bgColor: 'bg-pink-600/90 dark:bg-pink-600/80',
    category: 'tools',
    keywords: [
      'Bun',
      'JavaScript Runtime',
      'Node.js Alternative',
      'Web Development'
    ],
    icon: 'FaBolt'
  },
  {
    id: 'go',
    name: 'Go',
    description: 'High-performance systems programming language',
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/90 dark:bg-teal-500/80',
    category: 'backend',
    keywords: [
      'Go',
      'Golang',
      'Systems Programming',
      'Backend'
    ],
    icon: 'SiGo'
  },
  {
    id: 'tradingview',
    name: 'TradingView',
    description: 'Technical analysis tools and charting library',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'finance',
    keywords: [
      'TradingView',
      'Trading',
      'Financial Analysis',
      'Technical Analysis',
      'Charts'
    ],
    icon: 'FaChartLine'
  },
  {
    id: 'tigertrade',
    name: 'TigerTrade',
    description: 'Global investing platform integration',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/90 dark:bg-orange-500/80',
    category: 'finance',
    keywords: [
      'TigerTrade',
      'Trading API',
      'Brokerage',
      'Investing',
      'Finance'
    ],
    icon: 'FaMoneyBillWave'
  },
  {
    id: 'pytorch',
    name: 'PyTorch',
    description: 'Deep learning framework for AI research and applications',
    color: 'text-red-600',
    bgColor: 'bg-red-600/90 dark:bg-red-600/80',
    category: 'ai',
    keywords: [
      'PyTorch',
      'Deep Learning',
      'ML',
      'AI',
      'Neural Networks'
    ],
    icon: 'SiPytorch',
    parentId: 'python',
    relatedIds: ['tensorflow']
  },
  {
    id: 'telegram',
    name: 'Telegram API',
    description: 'Building bots and integrations for Telegram',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/90 dark:bg-blue-500/80',
    category: 'api',
    keywords: [
      'Telegram',
      'Bot',
      'Messaging API',
      'Messaging'
    ],
    icon: 'FaTelegram'
  },
  {
    id: 'html',
    name: 'HTML',
    description: 'Semantic markup and accessibility best practices',
    color: 'text-orange-600',
    bgColor: 'bg-orange-600/90 dark:bg-orange-600/80',
    category: 'frontend',
    keywords: [
      'HTML',
      'HTML5',
      'Semantic HTML',
      'Markup',
      'Web Development'
    ],
    icon: 'FaHtml5'
  },
  {
    id: 'css',
    name: 'CSS',
    description: 'Responsive layouts and modern styling techniques',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'frontend',
    keywords: [
      'CSS',
      'CSS3',
      'Responsive Design',
      'Styles',
      'Web Design'
    ],
    icon: 'FaCss3Alt'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Core language for dynamic web functionality',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/90 dark:bg-yellow-500/80',
    category: 'frontend',
    keywords: [
      'JavaScript',
      'ES6+',
      'Vanilla JS',
      'Web Development'
    ],
    icon: 'SiJavascript'
  },
  {
    id: 'mysql',
    name: 'MySQL',
    description: 'Relational database design and optimization',
    color: 'text-blue-700',
    bgColor: 'bg-blue-700/90 dark:bg-blue-700/80',
    category: 'database',
    keywords: [
      'MySQL',
      'SQL',
      'Database'
    ],
    icon: 'SiMysql'
  },
  {
    id: 'flash',
    name: 'Flash',
    description: 'Legacy multimedia platform for web applications and games',
    color: 'text-red-600',
    bgColor: 'bg-red-600/90 dark:bg-red-600/80',
    category: 'legacy',
    keywords: [
      'Flash',
      'ActionScript',
      'Animation'
    ],
    icon: 'SiAdobe'
  },
  {
    id: 'ad-mediation',
    name: 'Ad Mediation',
    description: 'Implementing and optimizing mobile ad platforms',
    color: 'text-green-600',
    bgColor: 'bg-green-600/90 dark:bg-green-600/80',
    category: 'mobile',
    keywords: [
      'Ad Mediation',
      'AdMob',
      'Appodeal',
      'Monetization'
    ],
    icon: 'FaMoneyBillWave'
  },
  {
    id: 'ajax',
    name: 'AJAX',
    description: 'Asynchronous JavaScript and XML for interactive web applications',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-600/90 dark:bg-yellow-600/80',
    category: 'frontend',
    keywords: [
      'AJAX',
      'XMLHttpRequest',
      'Fetch API'
    ],
    icon: 'FaExternalLinkAlt'
  },
  {
    id: 'automation',
    name: 'Automation',
    description: 'Creating tools and scripts for process automation',
    color: 'text-purple-600',
    bgColor: 'bg-purple-600/90 dark:bg-purple-600/80',
    category: 'devops',
    keywords: [
      'Automation',
      'Scripting',
      'Workflow',
      'CI/CD'
    ],
    icon: 'FaBolt'
  },
  {
    id: 'corona-sdk',
    name: 'Corona SDK',
    description: 'Cross-platform mobile development framework',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/90 dark:bg-yellow-500/80',
    category: 'mobile',
    keywords: [
      'Corona SDK',
      'Lua',
      'Mobile Development'
    ],
    icon: 'FaMobileAlt'
  },
  {
    id: 'discuz',
    name: 'Discuz!',
    description: 'Open source forum software platform',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-600/90 dark:bg-indigo-600/80',
    category: 'backend',
    keywords: [
      'Discuz!',
      'Forum',
      'CMS',
      'Community'
    ],
    icon: 'FaUsers'
  },
  {
    id: 'game-distribution',
    name: 'Game Distribution',
    description: 'Publishing and distributing games across platforms',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/90 dark:bg-purple-500/80',
    category: 'game',
    keywords: [
      'Game Distribution',
      'Publishing',
      'App Store',
      'Google Play'
    ],
    icon: 'FaGamepad'
  },
  {
    id: 'google-adsense',
    name: 'Google AdSense',
    description: 'Website monetization through targeted advertising',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/90 dark:bg-blue-500/80',
    category: 'monetization',
    keywords: [
      'Google AdSense',
      'Monetization',
      'Advertising'
    ],
    icon: 'FaMoneyBillWave'
  },
  {
    id: 'gpt',
    name: 'GPT',
    description: 'Generative Pre-trained Transformer models for advanced NLP',
    color: 'text-green-600',
    bgColor: 'bg-green-600/90 dark:bg-green-600/80',
    category: 'ai',
    keywords: [
      'GPT-3',
      'GPT',
      'LLM',
      'Natural Language Processing'
    ],
    icon: 'FaRobot'
  },
  {
    id: 'iap',
    name: 'In-App Purchases',
    description: 'Implementing and optimizing mobile monetization',
    color: 'text-green-500',
    bgColor: 'bg-green-500/90 dark:bg-green-500/80',
    category: 'mobile',
    keywords: [
      'IAP',
      'In-App Purchases',
      'Mobile Monetization'
    ],
    icon: 'FaCreditCard'
  },
  {
    id: 'mobile-web',
    name: 'Mobile Web',
    description: 'Optimizing web experiences for mobile devices',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/90 dark:bg-blue-500/80',
    category: 'frontend',
    keywords: [
      'Mobile Web',
      'Responsive',
      'Progressive Web Apps'
    ],
    icon: 'FaMobileAlt'
  },
  {
    id: 'nlp',
    name: 'NLP',
    description: 'Natural Language Processing for text analysis and generation',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'ai',
    keywords: [
      'NLP',
      'Natural Language Processing',
      'Text Analysis'
    ],
    icon: 'FaRobot'
  },
  {
    id: 'redis',
    name: 'Redis',
    description: 'In-memory data structure store for caching and messaging',
    color: 'text-red-700',
    bgColor: 'bg-red-700/90 dark:bg-red-700/80',
    category: 'backend',
    keywords: [
      'Redis',
      'Caching',
      'In-Memory Database'
    ],
    icon: 'FaDatabase'
  },
  {
    id: 'rss',
    name: 'RSS',
    description: 'Web feed technology for content distribution',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/90 dark:bg-orange-500/80',
    category: 'backend',
    keywords: [
      'RSS',
      'Syndication',
      'Content Distribution'
    ],
    icon: 'FaRss'
  },
  {
    id: 'tailwindcss',
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework for rapid UI development',
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/90 dark:bg-teal-500/80',
    category: 'frontend',
    keywords: [
      'Tailwind CSS',
      'CSS Framework',
      'UI Development'
    ],
    icon: 'FaFileCode'
  },
  {
    id: 'ubuntu',
    name: 'Ubuntu',
    description: 'Linux-based operating system for servers and desktops',
    color: 'text-orange-600',
    bgColor: 'bg-orange-600/90 dark:bg-orange-600/80',
    category: 'devops',
    keywords: [
      'Ubuntu',
      'Linux',
      'Server',
      'Operating System'
    ],
    icon: 'FaServer'
  },
  {
    id: 'data-visualization',
    name: 'Data Visualization',
    description: 'Creating visual representations of data and insights',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'frontend',
    keywords: [
      'Data Visualization',
      'Charts',
      'Dashboards',
      'D3.js'
    ],
    icon: 'FaChartLine'
  },
  {
    id: 'cocos2d',
    name: 'Cocos2d',
    description: 'Open-source framework for building 2D games and apps',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/90 dark:bg-blue-500/80',
    category: 'game',
    keywords: [
      'Cocos2d',
      'Game Development',
      'Mobile Games',
      '2D Games'
    ],
    icon: 'FaGamepad'
  },
  {
    id: 'google-admob',
    name: 'Google AdMob',
    description: 'Mobile advertising platform for app monetization',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'monetization',
    keywords: [
      'Google AdMob',
      'Mobile Ads',
      'Monetization',
      'In-App Advertising'
    ],
    icon: 'FaAd'
  },
  {
    id: 'appodeal',
    name: 'Appodeal',
    description: 'Ad mediation platform for mobile app monetization',
    color: 'text-green-500',
    bgColor: 'bg-green-500/90 dark:bg-green-500/80',
    category: 'monetization',
    keywords: [
      'Appodeal',
      'Ad Mediation',
      'Mobile Monetization',
      'Mobile Ads'
    ],
    icon: 'FaMoneyBillWave'
  },
  {
    id: 'lua',
    name: 'Lua',
    description: 'Lightweight scripting language for game development',
    color: 'text-blue-800',
    bgColor: 'bg-blue-800/90 dark:bg-blue-800/80',
    category: 'game',
    keywords: [
      'Lua',
      'Scripting',
      'Game Development',
      'Corona SDK'
    ],
    icon: 'FaCode'
  },
  {
    id: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    description: 'Building intelligent systems that can learn, reason, and make decisions',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'ai',
    keywords: [
      'AI',
      'Artificial Intelligence',
      'ML',
      'Machine Learning'
    ],
    icon: 'FaRobot'
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    description: 'Building models that can learn patterns from data',
    color: 'text-blue-700',
    bgColor: 'bg-blue-700/90 dark:bg-blue-700/80',
    category: 'ai',
    keywords: [
      'ML',
      'Machine Learning',
      'Neural Networks',
      'Deep Learning'
    ],
    icon: 'FaRobot'
  },
  {
    id: 'neural-networks',
    name: 'Neural Networks',
    description: 'Designing and training artificial neural networks for pattern recognition',
    color: 'text-purple-600',
    bgColor: 'bg-purple-600/90 dark:bg-purple-600/80',
    category: 'ai',
    keywords: [
      'Neural Networks',
      'Deep Learning',
      'AI',
      'ML'
    ],
    icon: 'FaRobot'
  },
  {
    id: 'reinforcement-learning',
    name: 'Reinforcement Learning',
    description: 'Training AI agents through rewards and punishments',
    color: 'text-green-600',
    bgColor: 'bg-green-600/90 dark:bg-green-600/80',
    category: 'ai',
    keywords: [
      'RL',
      'Reinforcement Learning',
      'AI',
      'ML',
      'Game AI'
    ],
    icon: 'FaGamepad'
  },
  {
    id: 'monte-carlo-simulation',
    name: 'Monte Carlo Simulation',
    description: 'Statistical technique for modeling complex systems with randomness',
    color: 'text-red-600',
    bgColor: 'bg-red-600/90 dark:bg-red-600/80',
    category: 'ai',
    keywords: [
      'Monte Carlo',
      'Simulation',
      'Statistical Modeling',
      'Game AI'
    ],
    icon: 'FaDice'
  },
  {
    id: 'game-ai',
    name: 'Game AI',
    description: 'Developing intelligent behavior for game characters and opponents',
    color: 'text-purple-700',
    bgColor: 'bg-purple-700/90 dark:bg-purple-700/80',
    category: 'game',
    keywords: [
      'Game AI',
      'NPC',
      'Behavior Trees',
      'Decision Making'
    ],
    icon: 'FaChess'
  },
  {
    id: 'game-analytics',
    name: 'Game Analytics',
    description: 'Data collection and analysis to improve game performance and player engagement',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'game',
    keywords: [
      'Game Analytics',
      'Player Metrics',
      'Engagement',
      'Retention'
    ],
    icon: 'FaChartLine'
  },
  {
    id: 'game-monetization',
    name: 'Game Monetization',
    description: 'Strategies for generating revenue from games while preserving player experience',
    color: 'text-green-700',
    bgColor: 'bg-green-700/90 dark:bg-green-700/80',
    category: 'game',
    keywords: [
      'Game Monetization',
      'IAP',
      'Ads',
      'F2P',
      'Freemium'
    ],
    icon: 'FaMoneyBillWave'
  },
  {
    id: 'game-physics',
    name: 'Game Physics',
    description: 'Implementing realistic physics simulations in game environments',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-600/90 dark:bg-indigo-600/80',
    category: 'game',
    keywords: [
      'Game Physics',
      'Collision Detection',
      'Rigid Body',
      'Particle Systems'
    ],
    icon: 'FaCube'
  },
  {
    id: 'shader-programming',
    name: 'Shader Programming',
    description: 'Creating custom rendering effects with GPU shaders',
    color: 'text-purple-600',
    bgColor: 'bg-purple-600/90 dark:bg-purple-600/80',
    category: 'game',
    keywords: [
      'Shader',
      'GLSL',
      'HLSL',
      'CG',
      'Graphics Programming'
    ],
    icon: 'FaRadiation'
  },
  {
    id: 'game-networking',
    name: 'Game Networking',
    description: 'Implementing multiplayer functionality with efficient network synchronization',
    color: 'text-blue-700',
    bgColor: 'bg-blue-700/90 dark:bg-blue-700/80',
    category: 'game',
    keywords: [
      'Game Networking',
      'Multiplayer',
      'Synchronization',
      'Client-Server'
    ],
    icon: 'FaNetworkWired'
  },
  {
    id: 'responsive-web-design',
    name: 'Responsive Web Design',
    description: 'Creating websites that work seamlessly across all devices and screen sizes',
    color: 'text-teal-600',
    bgColor: 'bg-teal-600/90 dark:bg-teal-600/80',
    category: 'frontend',
    keywords: [
      'Responsive Design',
      'Mobile First',
      'Adaptive',
      'Media Queries'
    ],
    icon: 'FaMobileAlt'
  },
  {
    id: 'mobile-first',
    name: 'Mobile-First Design',
    description: 'Design approach that prioritizes mobile experience before scaling up to larger screens',
    color: 'text-green-600',
    bgColor: 'bg-green-600/90 dark:bg-green-600/80',
    category: 'frontend',
    keywords: [
      'Mobile First',
      'Responsive',
      'Design',
      'UX'
    ],
    icon: 'FaMobile'
  },
  {
    id: 'push-notifications',
    name: 'Push Notifications',
    description: 'Implementing real-time alerts and messages to engage mobile users',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/90 dark:bg-blue-500/80',
    category: 'mobile',
    keywords: [
      'Push Notifications',
      'Mobile',
      'Firebase',
      'OneSignal'
    ],
    icon: 'FaBell'
  },
  {
    id: 'offline-first',
    name: 'Offline-First',
    description: 'Building applications that work without an internet connection',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-600/90 dark:bg-indigo-600/80',
    category: 'mobile',
    keywords: [
      'Offline First',
      'Progressive Web Apps',
      'Service Workers',
      'Caching'
    ],
    icon: 'FaCloudDownloadAlt'
  },
  {
    id: 'database-design',
    name: 'Database Design',
    description: 'Designing efficient and scalable database schemas',
    color: 'text-blue-700',
    bgColor: 'bg-blue-700/90 dark:bg-blue-700/80',
    category: 'backend',
    keywords: [
      'Database Design',
      'Schema',
      'Normalization',
      'ERD'
    ],
    icon: 'FaDatabase'
  },
  {
    id: 'database-optimization',
    name: 'Database Optimization',
    description: 'Tuning queries and indexes for maximum performance',
    color: 'text-green-700',
    bgColor: 'bg-green-700/90 dark:bg-green-700/80',
    category: 'backend',
    keywords: [
      'Database Optimization',
      'Query Tuning',
      'Indexing',
      'Performance'
    ],
    icon: 'FaRocket'
  },
  {
    id: 'api-development',
    name: 'API Development',
    description: 'Designing and building RESTful and GraphQL APIs',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'backend',
    keywords: [
      'API',
      'REST',
      'GraphQL',
      'Endpoints',
      'Web Services'
    ],
    icon: 'FaPlug'
  },
  {
    id: 'api-testing',
    name: 'API Testing',
    description: 'Ensuring API reliability through comprehensive testing',
    color: 'text-purple-600',
    bgColor: 'bg-purple-600/90 dark:bg-purple-600/80',
    category: 'qa',
    keywords: [
      'API Testing',
      'Postman',
      'Insomnia',
      'REST',
      'GraphQL'
    ],
    icon: 'FaVial'
  },
  {
    id: 'performance-testing',
    name: 'Performance Testing',
    description: 'Measuring and optimizing application performance under load',
    color: 'text-red-600',
    bgColor: 'bg-red-600/90 dark:bg-red-600/80',
    category: 'qa',
    keywords: [
      'Performance Testing',
      'Load Testing',
      'Stress Testing',
      'Benchmarking'
    ],
    icon: 'FaTachometerAlt'
  },
  {
    id: 'frontend-development',
    name: 'Frontend Development',
    description: 'Building responsive and interactive user interfaces',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/90 dark:bg-blue-500/80',
    category: 'frontend',
    keywords: [
      'Frontend',
      'UI',
      'UX',
      'JavaScript',
      'React',
      'Vue'
    ],
    icon: 'FaCode'
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    description: 'Strategies for online promotion and customer acquisition',
    color: 'text-green-600',
    bgColor: 'bg-green-600/90 dark:bg-green-600/80',
    category: 'marketing',
    keywords: [
      'Digital Marketing',
      'SEO',
      'SEM',
      'Content Marketing'
    ],
    icon: 'FaBullhorn'
  },
  {
    id: 'styled-components',
    name: 'Styled Components',
    description: 'CSS-in-JS library for component-based styling',
    color: 'text-pink-600',
    bgColor: 'bg-pink-600/90 dark:bg-pink-600/80',
    category: 'frontend',
    keywords: [
      'Styled Components',
      'CSS-in-JS',
      'React',
      'Styling'
    ],
    icon: 'FaPaintBrush'
  },
  {
    id: 'sass',
    name: 'Sass',
    description: 'Professional CSS extension language with advanced features',
    color: 'text-pink-700',
    bgColor: 'bg-pink-700/90 dark:bg-pink-700/80',
    category: 'frontend',
    keywords: [
      'Sass',
      'SCSS',
      'CSS Preprocessor',
      'Styling'
    ],
    icon: 'FaCss3'
  },
  {
    id: 'serverless',
    name: 'Serverless',
    description: 'Building applications without managing server infrastructure',
    color: 'text-orange-600',
    bgColor: 'bg-orange-600/90 dark:bg-orange-600/80',
    category: 'devops',
    keywords: [
      'Serverless',
      'Lambda',
      'Cloud Functions',
      'FaaS'
    ],
    icon: 'FaCloud'
  },
  {
    id: 'web3',
    name: 'Web3',
    description: 'Building decentralized applications on blockchain technology',
    color: 'text-purple-700',
    bgColor: 'bg-purple-700/90 dark:bg-purple-700/80',
    category: 'blockchain',
    keywords: [
      'Web3',
      'dApps',
      'Blockchain',
      'DeFi'
    ],
    icon: 'SiEthereum'
  },
  {
    id: 'defi',
    name: 'DeFi',
    description: 'Decentralized finance applications and protocols',
    color: 'text-green-700',
    bgColor: 'bg-green-700/90 dark:bg-green-700/80',
    category: 'blockchain',
    keywords: [
      'DeFi',
      'Decentralized Finance',
      'Blockchain',
      'Smart Contracts'
    ],
    icon: 'SiEthereum'
  },
  {
    id: 'nft',
    name: 'NFT',
    description: 'Non-fungible token technology and marketplace development',
    color: 'text-pink-600',
    bgColor: 'bg-pink-600/90 dark:bg-pink-600/80',
    category: 'blockchain',
    keywords: [
      'NFT',
      'Non-Fungible Token',
      'Digital Collectibles',
      'Blockchain'
    ],
    icon: 'SiEthereum'
  },
  {
    id: 'dapps',
    name: 'dApps',
    description: 'Decentralized applications running on blockchain networks',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-600/90 dark:bg-indigo-600/80',
    category: 'blockchain',
    keywords: [
      'dApps',
      'Decentralized Applications',
      'Blockchain',
      'Web3'
    ],
    icon: 'SiEthereum'
  },
  {
    id: 'llm',
    name: 'LLM',
    description: 'Large Language Models for natural language processing and generation',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'ai',
    keywords: [
      'LLM',
      'Large Language Models',
      'GPT',
      'AI',
      'NLP'
    ],
    icon: 'FaRobot'
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow',
    description: 'Open-source framework for machine learning and neural networks',
    color: 'text-orange-600',
    bgColor: 'bg-orange-600/90 dark:bg-orange-600/80',
    category: 'ai',
    keywords: [
      'TensorFlow',
      'Machine Learning',
      'Deep Learning',
      'Neural Networks'
    ],
    icon: 'SiTensorflow',
    parentId: 'python',
    relatedIds: ['pytorch']
  },
  {
    id: 'computer-vision',
    name: 'Computer Vision',
    description: 'Teaching computers to interpret and understand visual information',
    color: 'text-purple-600',
    bgColor: 'bg-purple-600/90 dark:bg-purple-600/80',
    category: 'ai',
    keywords: [
      'Computer Vision',
      'Image Processing',
      'Object Detection',
      'CV'
    ],
    icon: 'FaCamera'
  },
  {
    id: 'webassembly',
    name: 'WebAssembly',
    description: 'Binary instruction format for high-performance web applications',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-600/90 dark:bg-indigo-600/80',
    category: 'frontend',
    keywords: [
      'WebAssembly',
      'Wasm',
      'Performance',
      'Web'
    ],
    icon: 'FaCodeBranch'
  },
  {
    id: 'framer-motion',
    name: 'Framer Motion',
    description: 'Production-ready animation library for React applications',
    color: 'text-purple-600',
    bgColor: 'bg-purple-600/90 dark:bg-purple-600/80',
    category: 'frontend',
    keywords: [
      'Framer Motion',
      'Animation',
      'React',
      'UI'
    ],
    icon: 'FaRegSmile'
  },
  {
    id: 'cicd',
    name: 'CI/CD',
    description: 'Continuous integration and deployment automation',
    color: 'text-blue-700',
    bgColor: 'bg-blue-700/90 dark:bg-blue-700/80',
    category: 'devops',
    keywords: [
      'CI/CD',
      'Continuous Integration',
      'Continuous Deployment',
      'Automation'
    ],
    icon: 'FaRocket'
  },
  {
    id: 'cloud-native',
    name: 'Cloud Native',
    description: 'Designing applications specifically for cloud environments',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/90 dark:bg-blue-500/80',
    category: 'devops',
    keywords: [
      'Cloud Native',
      'Microservices',
      'Containers',
      'Kubernetes'
    ],
    icon: 'FaCloud'
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    description: 'Protecting systems, networks, and data from digital attacks',
    color: 'text-red-700',
    bgColor: 'bg-red-700/90 dark:bg-red-700/80',
    category: 'security',
    keywords: [
      'Cybersecurity',
      'Security',
      'InfoSec',
      'Penetration Testing'
    ],
    icon: 'FaShieldAlt'
  },
  {
    id: 'edge-computing',
    name: 'Edge Computing',
    description: 'Processing data near the source to reduce latency',
    color: 'text-green-700',
    bgColor: 'bg-green-700/90 dark:bg-green-700/80',
    category: 'devops',
    keywords: [
      'Edge Computing',
      'IoT',
      'Distributed Computing',
      'Low Latency'
    ],
    icon: 'FaNetworkWired'
  },
  {
    id: 'mobile-games',
    name: 'Mobile Games',
    description: 'Developing engaging games for iOS and Android platforms',
    color: 'text-purple-700',
    bgColor: 'bg-purple-700/90 dark:bg-purple-700/80',
    category: 'game',
    keywords: [
      'Mobile Games',
      'iOS',
      'Android',
      'Game Development'
    ],
    icon: 'FaGamepad'
  },
  {
    id: 'multiplayer',
    name: 'Multiplayer',
    description: 'Real-time multiplayer game systems and network synchronization',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'game',
    keywords: [
      'Multiplayer',
      'Networking',
      'Real-time',
      'Online Gaming'
    ],
    icon: 'FaUsers'
  },
  {
    id: 'cryptocurrency',
    name: 'Cryptocurrency',
    description: 'Digital currency systems and protocols',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-600/90 dark:bg-yellow-600/80',
    category: 'blockchain',
    keywords: [
      'Cryptocurrency',
      'Bitcoin',
      'Ethereum',
      'Blockchain'
    ],
    icon: 'FaBitcoin'
  },
  {
    id: 'solidity',
    name: 'Solidity',
    description: 'Programming language for implementing smart contracts',
    color: 'text-gray-800',
    bgColor: 'bg-gray-800/90 dark:bg-gray-800/80',
    category: 'blockchain',
    keywords: [
      'Solidity',
      'Smart Contracts',
      'Ethereum',
      'Blockchain'
    ],
    icon: 'SiEthereum'
  },
  {
    id: 'smart-contracts',
    name: 'Smart Contracts',
    description: 'Self-executing contracts with the terms written into code',
    color: 'text-purple-700',
    bgColor: 'bg-purple-700/90 dark:bg-purple-700/80',
    category: 'blockchain',
    keywords: [
      'Smart Contracts',
      'Blockchain',
      'DeFi',
      'dApps'
    ],
    icon: 'FaFileContract'
  },
  {
    id: 'financial-analysis',
    name: 'Financial Analysis',
    description: 'Evaluating financial data for trading and investment decision-making',
    color: 'text-green-700',
    bgColor: 'bg-green-700/90 dark:bg-green-700/80',
    category: 'finance',
    keywords: [
      'Financial Analysis',
      'Trading',
      'Investment',
      'Technical Analysis'
    ],
    icon: 'FaChartLine'
  },
  {
    id: 'time-series',
    name: 'Time Series Analysis',
    description: 'Analyzing time-ordered data points for pattern recognition',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'data',
    keywords: [
      'Time Series',
      'Forecasting',
      'Data Analysis',
      'Statistics'
    ],
    icon: 'FaChartLine'
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Extracting insights from structured and unstructured data',
    color: 'text-blue-700',
    bgColor: 'bg-blue-700/90 dark:bg-blue-700/80',
    category: 'data',
    keywords: [
      'Data Analysis',
      'Analytics',
      'Statistics',
      'Visualization'
    ],
    icon: 'FaChartBar'
  },
  {
    id: 'sql',
    name: 'SQL',
    description: 'Structured Query Language for database management',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'database',
    keywords: [
      'SQL',
      'Database',
      'Queries',
      'MySQL',
      'PostgreSQL'
    ],
    icon: 'FaDatabase'
  },
  {
    id: 'mcp',
    name: 'MCP',
    description: 'Model Context Protocol for AI tool integration and extensibility',
    color: 'text-purple-600',
    bgColor: 'bg-purple-600/90 dark:bg-purple-600/80',
    category: 'ai',
    keywords: [
      'MCP',
      'Model Context Protocol',
      'AI Integration',
      'Claude',
      'Tool Integration'
    ],
    icon: 'FaPlug'
  },
  {
    id: 'dart',
    name: 'Dart',
    description: 'Client-optimized language for fast apps on any platform',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/90 dark:bg-blue-500/80',
    category: 'frontend',
    keywords: [
      'Dart',
      'Flutter',
      'Cross-platform',
      'Mobile Development'
    ],
    icon: 'SiDart'
  },
  {
    id: 'flutter',
    name: 'Flutter',
    description: 'UI toolkit for building natively compiled applications',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/90 dark:bg-blue-400/80',
    category: 'mobile',
    keywords: [
      'Flutter',
      'Dart',
      'Cross-platform',
      'Mobile UI'
    ],
    icon: 'SiFlutter',
    parentId: 'dart',
    relatedIds: ['react', 'corona-sdk']
  },
  {
    id: 'virtual-dom',
    name: 'Virtual DOM',
    description: 'Efficient DOM manipulation through virtual representation',
    color: 'text-green-600',
    bgColor: 'bg-green-600/90 dark:bg-green-600/80',
    category: 'frontend',
    keywords: [
      'Virtual DOM',
      'React',
      'Diffing',
      'Rendering'
    ],
    icon: 'FaCode'
  },
  {
    id: 'code-generation',
    name: 'Code Generation',
    description: 'Automated source code generation from schemas and templates',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-600/90 dark:bg-indigo-600/80',
    category: 'tools',
    keywords: [
      'Code Generation',
      'Codegen',
      'Templates',
      'Automation'
    ],
    icon: 'FaCogs'
  },
  {
    id: 'json-schema',
    name: 'JSON Schema',
    description: 'Vocabulary for annotating and validating JSON documents',
    color: 'text-orange-600',
    bgColor: 'bg-orange-600/90 dark:bg-orange-600/80',
    category: 'backend',
    keywords: [
      'JSON Schema',
      'Validation',
      'API',
      'Data Models'
    ],
    icon: 'FaFileCode'
  },
  {
    id: 'openapi',
    name: 'OpenAPI',
    description: 'Standard specification for RESTful APIs',
    color: 'text-green-700',
    bgColor: 'bg-green-700/90 dark:bg-green-700/80',
    category: 'backend',
    keywords: [
      'OpenAPI',
      'Swagger',
      'REST',
      'API Documentation'
    ],
    icon: 'FaFileCode'
  },
  {
    id: 'ast-parsing',
    name: 'AST Parsing',
    description: 'Abstract Syntax Tree analysis for code understanding',
    color: 'text-teal-600',
    bgColor: 'bg-teal-600/90 dark:bg-teal-600/80',
    category: 'tools',
    keywords: [
      'AST',
      'Parsing',
      'Code Analysis',
      'Compilers'
    ],
    icon: 'FaProjectDiagram'
  },
  {
    id: 'semantic-search',
    name: 'Semantic Search',
    description: 'AI-powered search understanding meaning and context',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'ai',
    keywords: [
      'Semantic Search',
      'NLP',
      'Embeddings',
      'Vector Search'
    ],
    icon: 'FaSearch'
  },
  {
    id: 'vector-embeddings',
    name: 'Vector Embeddings',
    description: 'Dense vector representations for semantic similarity',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/90 dark:bg-purple-500/80',
    category: 'ai',
    keywords: [
      'Embeddings',
      'Vectors',
      'Similarity',
      'ML'
    ],
    icon: 'FaVectorSquare'
  },
  {
    id: 'state-management',
    name: 'State Management',
    description: 'Managing application state in frontend frameworks',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/90 dark:bg-indigo-500/80',
    category: 'frontend',
    keywords: [
      'State Management',
      'Redux',
      'Zustand',
      'MobX'
    ],
    icon: 'FaDatabase'
  },
  {
    id: 'immutable-data',
    name: 'Immutable Data',
    description: 'Data structures that cannot be modified after creation',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-600/90 dark:bg-cyan-600/80',
    category: 'frontend',
    keywords: [
      'Immutable',
      'Immer',
      'Functional',
      'State'
    ],
    icon: 'FaLock'
  },
  {
    id: 'json-patch',
    name: 'JSON Patch',
    description: 'Format for describing changes to JSON documents',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-700/90 dark:bg-yellow-700/80',
    category: 'backend',
    keywords: [
      'JSON Patch',
      'RFC 6902',
      'Delta',
      'Updates'
    ],
    icon: 'FaFileCode'
  },
  {
    id: 'tree-shaking',
    name: 'Tree Shaking',
    description: 'Dead code elimination for smaller bundle sizes',
    color: 'text-green-600',
    bgColor: 'bg-green-600/90 dark:bg-green-600/80',
    category: 'devops',
    keywords: [
      'Tree Shaking',
      'Bundling',
      'Optimization',
      'Webpack'
    ],
    icon: 'FaTree'
  },
  {
    id: 'bundling',
    name: 'Bundling',
    description: 'Combining modules into optimized bundles for deployment',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/90 dark:bg-orange-500/80',
    category: 'devops',
    keywords: [
      'Bundling',
      'Webpack',
      'Rollup',
      'Vite'
    ],
    icon: 'FaBoxes'
  },
  {
    id: 'web-framework',
    name: 'Web Framework',
    description: 'Libraries for building web applications efficiently',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'frontend',
    keywords: [
      'Framework',
      'React',
      'Vue',
      'Angular'
    ],
    icon: 'FaGlobe'
  },
  {
    id: 'type-safety',
    name: 'Type Safety',
    description: 'Compile-time type checking for reliable code',
    color: 'text-blue-700',
    bgColor: 'bg-blue-700/90 dark:bg-blue-700/80',
    category: 'frontend',
    keywords: [
      'Type Safety',
      'TypeScript',
      'Static Typing',
      'Type Checking'
    ],
    icon: 'FaShieldAlt'
  },
  {
    id: 'cli',
    name: 'CLI Development',
    description: 'Building command-line interface applications',
    color: 'text-gray-700',
    bgColor: 'bg-gray-700/90 dark:bg-gray-700/80',
    category: 'tools',
    keywords: [
      'CLI',
      'Command Line',
      'Terminal',
      'Shell'
    ],
    icon: 'FaTerminal'
  },
  {
    id: 'ai-integration',
    name: 'AI Integration',
    description: 'Integrating AI services and models into applications',
    color: 'text-purple-600',
    bgColor: 'bg-purple-600/90 dark:bg-purple-600/80',
    category: 'ai',
    keywords: [
      'AI Integration',
      'OpenAI',
      'Claude',
      'LLM'
    ],
    icon: 'FaRobot'
  },
  {
    id: 'developer-tools',
    name: 'Developer Tools',
    description: 'Tools that improve developer productivity and workflow',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-600/90 dark:bg-indigo-600/80',
    category: 'tools',
    keywords: [
      'DevTools',
      'Productivity',
      'Workflow',
      'Automation'
    ],
    icon: 'FaTools'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Integration with OpenAI APIs and models',
    color: 'text-green-600',
    bgColor: 'bg-green-600/90 dark:bg-green-600/80',
    category: 'ai',
    keywords: [
      'OpenAI',
      'GPT',
      'ChatGPT',
      'API'
    ],
    icon: 'FaRobot'
  },
  {
    id: 'web-scraping',
    name: 'Web Scraping',
    description: 'Extracting data from websites programmatically',
    color: 'text-teal-600',
    bgColor: 'bg-teal-600/90 dark:bg-teal-600/80',
    category: 'tools',
    keywords: [
      'Web Scraping',
      'Puppeteer',
      'Playwright',
      'Data Extraction'
    ],
    icon: 'FaSpider'
  },
  {
    id: 'research-automation',
    name: 'Research Automation',
    description: 'Automating research tasks and data gathering',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'ai',
    keywords: [
      'Research',
      'Automation',
      'Data Gathering',
      'Analysis'
    ],
    icon: 'FaSearchPlus'
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    description: 'Lightweight embedded relational database',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/90 dark:bg-blue-500/80',
    category: 'database',
    keywords: [
      'SQLite',
      'Database',
      'Embedded',
      'SQL'
    ],
    icon: 'FaDatabase'
  },
  {
    id: 'pdf-processing',
    name: 'PDF Processing',
    description: 'Parsing and manipulating PDF documents',
    color: 'text-red-600',
    bgColor: 'bg-red-600/90 dark:bg-red-600/80',
    category: 'tools',
    keywords: [
      'PDF',
      'Document Processing',
      'Parsing',
      'Text Extraction'
    ],
    icon: 'FaFilePdf'
  },
  {
    id: 'parallel-processing',
    name: 'Parallel Processing',
    description: 'Concurrent execution for improved performance',
    color: 'text-orange-600',
    bgColor: 'bg-orange-600/90 dark:bg-orange-600/80',
    category: 'backend',
    keywords: [
      'Parallel',
      'Concurrency',
      'Multi-threading',
      'Performance'
    ],
    icon: 'FaLayerGroup'
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    description: 'CI/CD and automation directly in GitHub',
    color: 'text-gray-800',
    bgColor: 'bg-gray-800/90 dark:bg-gray-800/80',
    category: 'devops',
    keywords: [
      'GitHub Actions',
      'CI/CD',
      'Automation',
      'Workflows'
    ],
    icon: 'FaGithub'
  },
  {
    id: 'svelte',
    name: 'Svelte',
    description: 'Compile-time reactive UI framework',
    color: 'text-orange-600',
    bgColor: 'bg-orange-600/90 dark:bg-orange-600/80',
    category: 'frontend',
    keywords: [
      'Svelte',
      'SvelteKit',
      'Reactive',
      'Compile-time'
    ],
    icon: 'SiSvelte',
    parentId: 'javascript',
    relatedIds: ['react', 'vuejs']
  },
  {
    id: 'firestore',
    name: 'Firestore',
    description: 'NoSQL document database from Firebase',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-600/90 dark:bg-yellow-600/80',
    category: 'database',
    keywords: [
      'Firestore',
      'Firebase',
      'NoSQL',
      'Real-time'
    ],
    icon: 'SiFirebase'
  },
  {
    id: 'functional-programming',
    name: 'Functional Programming',
    description: 'Programming paradigm using pure functions and immutability',
    color: 'text-purple-600',
    bgColor: 'bg-purple-600/90 dark:bg-purple-600/80',
    category: 'frontend',
    keywords: [
      'Functional',
      'FP',
      'Pure Functions',
      'Immutability'
    ],
    icon: 'FaCode'
  }
] as const;

export const SKILL_CATEGORIES = [
  'All',
  'Mobile Games',
  'Web Apps',
  'Blockchain',
  'Tools & Utilities',
  'AI & ML',
  'Professional Experience'
] as const;