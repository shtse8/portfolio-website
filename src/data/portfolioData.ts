export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  gallery?: string[];
  tags: string[];
  github?: string;
  liveUrl?: string;
  androidUrl?: string;
  iosUrl?: string;
  category: string;
  company: string | null;
  relatedSkills?: string[];
  details: string[] | string;
  technologies?: string[];
  year?: string;
  teamSize?: string;
  duration?: string;
  role?: string;
  challenges?: {
    title: string;
    description: string;
  }[];
};

export type Company = {
  id: string;
  name: string;
  description: string;
  logo: string;
  website?: string;
  location?: string;
  industry?: string;
  size?: string;
};

export type Experience = {
  id: string;
  title: string;
  company: string | null;
  period: string;
  location: string;
  description: string;
  image: string;
  logo: string;
  tags: string[];
  liveUrl?: string;
  details: string[];
  relatedSkills?: string[];
  projects?: string[];
};

export type TechSkill = {
  id: string;
  name: string;
  description: string;
  yearsOfExperience: number;
  color: string;
  bgColor: string;
  category: string;
  keywords: string[];
};

export const PROJECTS: Project[] = [
  {
    id: 'cubeage',
    title: 'Cubeage Limited',
    description: 'Mobile gaming company specializing in card and casino games with millions of downloads',
    image: '/projects/cubeage.jpg',
    images: [
      '/projects/cubeage.jpg',
    ],
    tags: ['Mobile Games', 'iOS', 'Android', 'Unity', 'C#', 'MySQL', 'Percona'],
    liveUrl: 'https://cubeage.com',
    category: "Mobile Games",
    company: "cubeage",
    relatedSkills: ['unity3d', 'gamedev', 'databases'],
    technologies: ['Unity3D', 'C#', 'iOS SDK', 'Android SDK', 'MySQL', 'Percona', 'Git', 'Jenkins'],
    details: [
      'Founded and led Cubeage Limited, developing popular card and casino games',
      'Published 10+ games on Google Play and App Store with 100K+ installations',
      'Developed flagship titles including Hong Kong Mahjong Tycoon (4.2★, 3,280+ reviews), Fun Mahjong 16 Tiles (1M+ downloads), Fun Showhand, and Big2 Tycoon',
      'Implemented innovative game mechanics and monetization strategies resulting in 4.2+ average ratings',
      'Built and managed cross-functional teams for game development and operations',
      'Utilized MySQL and Percona for high-performance game data storage and analytics'
    ]
  },
  {
    id: 'big2-tycoon',
    title: 'Big2 Tycoon',
    description: 'Multiplayer competitive card game with character progression and arena tournaments',
    image: '/projects/big2_tycoon.jpg',
    images: [
      '/projects/big2_tycoon.jpg',
    ],
    tags: ['Unity3D', 'TypeScript', 'Socket.IO', 'Protobuf', 'Multiplayer', 'ELO Rating', 'Cubeage'],
    androidUrl: 'https://play.google.com/store/apps/details?id=com.gameflask.btthk',
    iosUrl: 'https://apps.apple.com/us/app/%E9%8B%A4%E5%A4%A7d%E5%A4%A7%E4%BA%A8-%E6%9C%80%E5%88%BA%E6%BF%80%E7%9A%84%E7%AD%96%E7%95%A5%E6%A3%8B%E7%89%8C%E9%81%8A%E6%88%B2/id1295634408',
    category: "Mobile Games",
    company: "cubeage",
    relatedSkills: ['unity3d', 'typescript', 'gamedev', 'databases', 'java'],
    technologies: ['Unity3D', 'TypeScript', 'Node.js', 'Socket.IO', 'Protocol Buffers', 'MySQL', 'Ubuntu', 'Redis'],
    details: [
      'Led development at Cubeage for this real-time multiplayer card game with Unity3D featuring unique characters and treasure systems',
      'Implemented a sophisticated ELO rating system for fair matchmaking, ensuring players find opponents of similar skill levels',
      'Built a distributed backend architecture using TypeScript, Socket.IO, and Protobuf on Ubuntu servers',
      'Created a PubSub system for efficient real-time communication and game state synchronization',
      'Designed engaging progression systems including character upgrades, treasure collection, and monthly arena tournaments'
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
    tags: ['React', 'Next.js', 'Responsive Design', 'SEO', 'Nakuz'],
    liveUrl: 'https://nakuz.com',
    category: "Web Apps",
    company: "nakuz",
    relatedSkills: ['react', 'typescript'],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel', 'Git'],
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
    tags: ['Unity', 'C#', 'Mobile Game', '3D Graphics', 'Multiplayer', 'Cubeage'],
    androidUrl: 'https://play.google.com/store/apps/details?id=com.crazycube.hkmahjongtycoon.app',
    iosUrl: 'https://apps.apple.com/us/app/%E9%A6%99%E6%B8%AF%E9%BA%BB%E5%B0%87%E5%A4%A7%E4%BA%A8-%E9%BA%BB%E9%9B%80%E4%BF%BE%E4%BD%A0%E7%8E%A9/id1478835027',
    category: "Mobile Games",
    company: "cubeage",
    relatedSkills: ['unity3d', 'gamedev', 'team-leadership'],
    technologies: ['Unity3D', 'C#', '3D Modeling', 'iOS SDK', 'Android SDK', 'Firebase', 'PlayFab', 'Git'],
    details: [
      'Led development at Cubeage for this popular 3D Mahjong game with over 100K downloads',
      'Created authentic Hong Kong Mahjong gameplay with multiple game modes including blood flow mode, classic four-player mode, and two-player mode',
      'Implemented real-time multiplayer functionality with low latency and leaderboard system',
      'Designed engaging UI/UX with unique 3D Mahjong world, pet system, and character customization',
      'Achieved 4.2-star rating with 3,280+ reviews on Google Play and strong user retention'
    ]
  },
  {
    id: 'fun-showhand',
    title: 'Fun Showhand: Stud Poker',
    description: 'Engaging poker game with multiple game modes and social features',
    image: '/projects/fsh/1.jpg',
    images: [
      '/projects/fsh/1.jpg',
      '/projects/fsh/2.jpg',
    ],
    tags: ['Unity', 'C#', 'Mobile Game', 'IAP', 'Ad Mediation', 'Cubeage'],
    androidUrl: 'https://play.google.com/store/apps/details?id=com.cubeage.showhand.app',
    iosUrl: 'https://apps.apple.com/us/app/fun-showhand-stud-poker/id1238318956',
    category: "Mobile Games",
    company: "cubeage",
    relatedSkills: ['unity3d', 'gamedev', 'java'],
    technologies: ['Unity3D', 'C#', 'Appodeal', 'AdMob', 'Facebook Ads', 'IAP', 'Monte Carlo Simulation', 'Git'],
    details: [
      'Led development at Cubeage for this popular poker game available on both Android and iOS platforms',
      'Implemented in-app purchases and ad mediation with Appodeal, AdMob, and Facebook Ads',
      'Created highly realistic AI opponents using Monte Carlo simulation for authentic gameplay',
      'Designed offline gameplay with online social features including friend system and cloud save',
      'Featured in [Appszoom review videos](https://www.youtube.com/watch?v=Hl-YcZ9Hh8U) with positive feedback'
    ]
  },
  {
    id: 'fmj',
    title: 'Fun Mahjong 16 Tiles',
    description: 'Popular Taiwanese Mahjong game with over 1 million downloads featuring offline gameplay with online features',
    image: '/projects/fmj.jpeg',
    images: [
      '/projects/fmj.jpeg',
    ],
    tags: ['Unity', 'C#', 'Mobile Game', 'Corona SDK', 'Taiwanese Mahjong', 'AI', 'Cubeage'],
    androidUrl: 'https://play.google.com/store/apps/details?id=com.cubeage.fmj16.app',
    iosUrl: 'https://apps.apple.com/us/app/%E7%98%8B%E9%BA%BB%E5%B0%8716%E5%BC%B5-%E6%89%8B%E6%A9%9F%E5%8F%B0%E5%BC%8F%E9%BA%BB%E5%B0%87%E6%A8%82%E5%9C%92/id1252568150',
    category: "Mobile Games",
    company: "cubeage",
    relatedSkills: ['unity3d', 'gamedev', 'java', 'databases'],
    technologies: ['Unity3D', 'C#', 'Corona SDK', 'Appodeal', 'Monte Carlo AI', 'Cloud Save', 'Git', 'Lua'],
    details: [
      'Led development at Cubeage for this popular Taiwanese Mahjong game with over 1 million downloads, featured on [Wikipedia](https://zh.wikipedia.org/wiki/%E7%98%8B%E9%BA%BB%E5%B0%8716%E5%BC%B5)',
      'Created a unique offline gameplay experience with online social features including friend system and cloud save functionality',
      'Implemented highly realistic AI opponents using Monte Carlo simulation, providing an authentic gameplay experience',
      'Designed a simple, intuitive interface focused on gameplay rather than excessive visual effects',
      'Integrated Appodeal for monetization while maintaining a non-intrusive gaming experience'
    ]
  },
  {
    id: 'anymud',
    title: 'Anymud',
    description: 'Modern Medium-like publishing platform with advanced editor capabilities',
    image: '/projects/anymud.jpeg',
    images: [
      '/projects/anymud.jpeg',
    ],
    tags: ['TypeScript', 'Vue.js', 'Nest.js', 'GCP', 'Docker', 'SEO'],
    github: 'https://github.com/shtse8/anymud',
    liveUrl: 'https://anymud.com',
    category: "Web Apps",
    company: null,
    relatedSkills: ['typescript', 'nodejs', 'docker', 'gcp'],
    technologies: ['TypeScript', 'Vue.js', 'Nest.js', 'Google Cloud Platform', 'Docker', 'PostgreSQL', 'Redis', 'Nginx'],
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
    tags: ['PHP', 'MySQL', 'Percona', 'Facebook Integration', 'Responsive Design', 'SEO'],
    category: "Web Apps",
    company: null,
    relatedSkills: ['databases'],
    technologies: ['PHP', 'MySQL', 'Percona', 'Facebook API', 'HTML5', 'CSS3', 'jQuery', 'Apache'],
    details: [
      'Developed a publisher-focused article sharing platform with PHP and MySQL/Percona',
      'Created Facebook and mobile optimized versions to maximize user reach',
      'Increased publisher engagement by 45% through intuitive content management tools',
      'Optimized web application with semantic HTML, structured data, and SEO best practices',
      'Achieved top search engine rankings for publisher content through technical optimization'
    ]
  },
  {
    id: 'funimax',
    title: 'Funimax Gaming Platform',
    description: 'Popular gaming platform with physical game cards and digital distribution in Hong Kong',
    image: '/projects/funimax.jpg',
    images: [
      '/projects/funimax.jpg',
    ],
    tags: ['PHP', 'JavaScript', 'MySQL', 'Ubuntu', 'Game Distribution', 'Payment Integration'],
    category: "Web Apps",
    company: "minimax",
    relatedSkills: ['databases'],
    technologies: ['PHP', 'JavaScript', 'MySQL', 'Ubuntu', 'Apache', 'Payment Gateway APIs', 'Custom Template System', 'Redis'],
    details: [
      'Led development of Funimax, a well-known gaming platform with significant presence in Hong Kong',
      'Built with pure PHP and JavaScript, developing a custom template system for rapid game website deployment',
      'Created a platform that simultaneously operated 30+ games at its peak',
      'Implemented physical game card system with secure validation and redemption',
      'Designed and developed the platform\'s agency and distribution system',
      'Built robust payment and member management systems',
      'Deployed on Ubuntu servers with MySQL databases for high reliability and performance'
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
    company: null,
    relatedSkills: ['typescript', 'kubernetes', 'blockchain', 'nodejs', 'docker'],
    technologies: ['TypeScript', 'Node.js', 'Kubernetes', 'Docker', 'Ethereum', 'EOS', 'WebSockets', 'Redis', 'PostgreSQL'],
    details: [
      'Designed and developed a hybrid Bancor-Orderbook model for cross-chain asset trading',
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
    company: null,
    relatedSkills: ['blockchain', 'nodejs', 'typescript'],
    technologies: ['TypeScript', 'Node.js', 'Ethereum', 'EOS', 'Bitcoin', 'Smart Contracts', 'WebSockets', 'Redis', 'MongoDB'],
    details: [
      'Built a platform enabling streamlined deployment of applications across multiple blockchains',
      'Pioneered real-time profit-sharing system for developers through smart contract automation',
      'Eliminated the typical one-week delay in earnings distribution through automated processes',
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
    company: null,
    relatedSkills: ['typescript', 'blockchain', 'kubernetes', 'nodejs', 'docker'],
    technologies: ['TypeScript', 'Vue.js', 'Node.js', 'Kubernetes', 'Docker', 'Ethereum', 'EOS', 'Bitcoin', 'WebSockets', 'Redis', 'PostgreSQL'],
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
      '/projects/quant_trading_ror.jpg',
    ],
    tags: ['Go', 'Python', 'TradingView', 'TigerTrade', 'Firebase', 'PyTorch', 'Telegram'],
    github: 'https://github.com/shtse8/TradingBot',
    category: "AI & ML",
    company: null,
    relatedSkills: ['python', 'ai-ml', 'firebase', 'gcp', 'typescript'],
    technologies: ['Go', 'Python', 'Firebase', 'Google Cloud Run', 'PyTorch', 'pandas', 'TradingView API', 'TigerTrade API', 'Telegram API', 'Docker'],
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
    company: null,
    relatedSkills: ['typescript', 'python', 'nodejs'],
    technologies: ['TypeScript', 'Python', 'Bun', 'FFmpeg', 'Simhash', 'VP Tree', 'Perceptual Hashing', 'Node.js'],
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
    company: null,
    relatedSkills: ['nodejs'],
    technologies: ['JavaScript', 'Chrome Extensions API', 'HTML', 'CSS', 'Google Photos API', 'DOM Manipulation', 'Asynchronous Programming'],
    details: [
      'Developed a Chrome extension with 2,000+ users to efficiently manage and clean up Google Photos libraries',
      'Implemented intelligent batch processing with custom selectors for automated photo deletion',
      'Created smart scrolling logic to handle large photo libraries with 10,000+ images',
      'Built in robust error handling and progress tracking for operation reliability',
      'Earned 4.7/5 star rating on Chrome Web Store and 73+ stars on GitHub'
    ]
  }
];

export const COMPANIES: Record<string, Company> = {
  "cubeage": {
    id: "cubeage",
    name: "Cubeage Limited",
    description: "Mobile gaming company specializing in card and casino games with millions of downloads",
    logo: "/companys/cubeage.jpeg",
    website: "https://cubeage.com",
    location: "Hong Kong",
    industry: "Game Development",
    size: "10-50 employees"
  },
  "nakuz": {
    id: "nakuz",
    name: "Nakuz.com Limited",
    description: "Web development and gaming media company",
    logo: "/companys/nakuz.jpeg",
    website: "https://nakuz.com",
    location: "Hong Kong",
    industry: "Digital Media",
    size: "10-50 employees"
  },
  "minimax": {
    id: "minimax",
    name: "MiniMax Game Entertainment Limited",
    description: "Gaming platform and distribution company",
    logo: "/companys/minimax.jpeg",
    website: "https://funimax.com",
    location: "Hong Kong",
    industry: "Game Distribution",
    size: "10-50 employees"
  }
};

export const EXPERIENCES: Experience[] = [
  {
    id: 'cubeage',
    title: 'Founder and Lead Developer',
    company: 'cubeage',
    period: '2014 - Present',
    location: 'Hong Kong',
    description: 'Founded and led a mobile gaming company specializing in card and casino games with millions of downloads',
    image: '/projects/cubeage.jpg',
    logo: '/companys/cubeage.jpeg',
    tags: ['Mobile Games', 'iOS', 'Android', 'Unity', 'C#', 'MySQL', 'Percona'],
    liveUrl: 'https://cubeage.com',
    details: [
      'Founded and led Cubeage Limited, developing popular card and casino games',
      'Published 10+ games on Google Play and App Store with 100K+ installations',
      'Developed flagship titles including Hong Kong Mahjong Tycoon (4.2★, 3,280+ reviews), Fun Mahjong 16 Tiles (1M+ downloads), Fun Showhand, and Big2 Tycoon',
      'Implemented innovative game mechanics and monetization strategies resulting in 4.2+ average ratings',
      'Built and managed cross-functional teams for game development and operations',
      'Utilized MySQL and Percona for high-performance game data storage and analytics',
      'Related Projects: See [Hong Kong Mahjong Tycoon](#mahjong), [Fun Mahjong 16 Tiles](#fmj), [Fun Showhand](#fun-showhand), and [Big2 Tycoon](#big2-tycoon) in this portfolio'
    ],
    relatedSkills: ['unity3d', 'gamedev', 'databases', 'team-leadership', 'business-growth']
  },
  {
    id: 'minimax',
    title: 'Founder and Lead Developer',
    company: 'minimax',
    period: '2010 - 2014',
    location: 'Hong Kong',
    description: 'Led development at a gaming platform company focusing on game operations and agency distribution in Hong Kong',
    image: '/companys/minimax.jpeg',
    logo: '/companys/minimax.jpeg',
    tags: ['Gaming Platform', 'Game Distribution', 'Physical Game Cards', 'Game Operations'],
    details: [
      'Led development at MiniMax Game Entertainment Limited, a gaming platform company in Hong Kong',
      'Managed Funimax platform, a well-known game distribution service with physical game cards',
      'Oversaw game operations, distribution, and agency relationships',
      'Implemented payment systems integration for physical and digital purchases',
      'Designed systems to manage game inventory, distribution, and analytics',
      'Built user management and loyalty systems to improve customer retention'
    ],
    relatedSkills: ['databases', 'team-leadership', 'business-growth']
  },
  {
    id: 'nakuz',
    title: 'Founder and Lead Developer',
    company: 'nakuz',
    period: '2006 - Present',
    location: 'Hong Kong',
    description: 'Designed and developed professional corporate website and business solutions',
    image: '/companys/nakuz.jpeg',
    logo: '/companys/nakuz.jpeg',
    tags: ['React', 'Next.js', 'Responsive Design', 'SEO'],
    liveUrl: 'https://nakuz.com',
    details: [
      'Designed and developed the corporate website for Nakuz.com Limited',
      'Built with modern technologies including React and Next.js',
      'Implemented responsive design for optimal viewing on all devices',
      'Integrated SEO best practices to improve visibility and organic traffic',
      'Created an intuitive user interface with streamlined navigation'
    ],
    relatedSkills: ['react', 'typescript', 'team-leadership']
  }
];

export const SKILLS: TechSkill[] = [
  {
    id: 'react',
    name: 'React',
    description: 'Building interactive UIs with React and Next.js',
    yearsOfExperience: 6,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/90 dark:bg-blue-500/80',
    category: 'frontend',
    keywords: ['React', 'Next.js', 'JSX']
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    description: 'Type-safe development with advanced patterns',
    yearsOfExperience: 5,
    color: 'text-blue-700',
    bgColor: 'bg-blue-700/90 dark:bg-blue-700/80',
    category: 'frontend',
    keywords: ['TypeScript', 'TS']
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'Scalable backend services with Express and Nest.js',
    yearsOfExperience: 7,
    color: 'text-green-600',
    bgColor: 'bg-green-600/90 dark:bg-green-600/80',
    category: 'backend',
    keywords: ['Node.js', 'Express', 'Nest.js']
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Data processing, ML, and automation',
    yearsOfExperience: 5,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-600/90 dark:bg-yellow-500/80',
    category: 'backend',
    keywords: ['Python', 'PyTorch']
  },
  {
    id: 'java',
    name: 'Java',
    description: 'Enterprise applications and Android development',
    yearsOfExperience: 8,
    color: 'text-red-600',
    bgColor: 'bg-red-600/90 dark:bg-red-600/80',
    category: 'backend',
    keywords: ['Java', 'Android']
  },
  {
    id: 'docker',
    name: 'Docker',
    description: 'Containerization for consistent deployments',
    yearsOfExperience: 5,
    color: 'text-blue-800',
    bgColor: 'bg-blue-800/90 dark:bg-blue-800/80',
    category: 'devops',
    keywords: ['Docker', 'Container']
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    description: 'Orchestration for microservices architecture',
    yearsOfExperience: 4,
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/90 dark:bg-blue-600/80',
    category: 'devops',
    keywords: ['Kubernetes', 'K8s', 'Microservices']
  },
  {
    id: 'gcp',
    name: 'GCP',
    description: 'Cloud infrastructure and serverless solutions',
    yearsOfExperience: 4,
    color: 'text-red-500',
    bgColor: 'bg-red-500/90 dark:bg-red-500/80',
    category: 'devops',
    keywords: ['GCP', 'Google Cloud', 'Cloud Run']
  },
  {
    id: 'firebase',
    name: 'Firebase',
    description: 'Real-time databases and authentication',
    yearsOfExperience: 5,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/90 dark:bg-yellow-500/80',
    category: 'backend',
    keywords: ['Firebase']
  },
  {
    id: 'databases',
    name: 'Databases',
    description: 'PostgreSQL, MySQL, Redis, and NoSQL solutions',
    yearsOfExperience: 10,
    color: 'text-gray-700',
    bgColor: 'bg-gray-700/90 dark:bg-gray-700/80',
    category: 'backend',
    keywords: ['MySQL', 'PostgreSQL', 'Redis', 'NoSQL', 'Database', 'Percona']
  },
  {
    id: 'unity3d',
    name: 'Unity3D',
    description: '3D game development and simulations',
    yearsOfExperience: 9,
    color: 'text-gray-800',
    bgColor: 'bg-gray-800/90 dark:bg-gray-800/80',
    category: 'game',
    keywords: ['Unity', 'Unity3D']
  },
  {
    id: 'gamedev',
    name: 'Game Dev',
    description: 'Multiplayer systems and game mechanics',
    yearsOfExperience: 10,
    color: 'text-purple-600',
    bgColor: 'bg-purple-600/90 dark:bg-purple-600/80',
    category: 'game',
    keywords: ['Game', 'Mobile Game', 'Multiplayer']
  },
  {
    id: 'ai-ml',
    name: 'AI & ML',
    description: 'Reinforcement learning and LLM integration',
    yearsOfExperience: 3,
    color: 'text-green-700',
    bgColor: 'bg-green-700/90 dark:bg-green-700/80',
    category: 'ai',
    keywords: ['AI', 'ML', 'Machine Learning', 'PyTorch']
  },
  {
    id: 'blockchain',
    name: 'Blockchain',
    description: 'Smart contracts and decentralized applications',
    yearsOfExperience: 5,
    color: 'text-purple-800',
    bgColor: 'bg-purple-800/90 dark:bg-purple-800/80',
    category: 'blockchain',
    keywords: ['Blockchain', 'Smart Contracts', 'EOS', 'Ethereum', 'Bitcoin']
  },
  {
    id: 'team-leadership',
    name: 'Team Leadership',
    description: 'Building and managing high-performing development teams',
    yearsOfExperience: 10,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-600/90 dark:bg-indigo-600/80',
    category: 'management',
    keywords: []
  },
  {
    id: 'business-growth',
    name: 'Business Growth',
    description: 'Marketing, product strategy, and business development',
    yearsOfExperience: 8,
    color: 'text-teal-600',
    bgColor: 'bg-teal-600/90 dark:bg-teal-600/80',
    category: 'management',
    keywords: []
  }
];

export const CATEGORIES = [
  "All",
  "Mobile Games",
  "Web Apps",
  "Blockchain",
  "Tools & Utilities",
  "AI & ML",
  "Professional Experience"
];

export type PersonalInfo = {
  firstName: string;
  lastName: string;
  title: string;
  shortBio: string;
  email: string;
  location: {
    base: string;
    remote: string;
  };
  social: {
    github: string;
    linkedin: string;
    stackoverflow: string;
  };
  contactFormSubjects: string[];
  portfolioUrl: string;
  company: string;
};

export const PERSONAL_INFO: PersonalInfo = {
  firstName: "Kyle",
  lastName: "Tse",
  title: "Backend Engineer & Game Developer",
  shortBio: "Backend Engineer & Game Developer with 20+ years of experience in distributed systems, blockchain solutions, and AI-driven automation.",
  email: "hi@kylet.se",
  location: {
    base: "Hong Kong & UK",
    remote: "Available for remote work worldwide"
  },
  social: {
    github: "https://github.com/shtse8",
    linkedin: "https://linkedin.com/in/shtse8",
    stackoverflow: "https://stackoverflow.com/users/4380384/shtse8"
  },
  contactFormSubjects: [
    "Project Inquiry",
    "Job Opportunity",
    "Consultation Request",
    "Speaking Engagement",
    "Other"
  ],
  portfolioUrl: "https://kylet.se",
  company: "Soti Labs"
}; 