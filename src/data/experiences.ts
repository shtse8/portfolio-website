import { Experience } from './types';

export const EXPERIENCES: Experience[] = [
  {
    id: 'sylphx',
    title: 'Founder',
    company: 'sylphx',
    period: '2025 - Present',
    location: 'United Kingdom',
    description: 'Founded Sylphx to democratize AI through elegant, high-performance open source tools and frameworks',
    logo: '/companys/sylphx.png',
    skills: ['typescript', 'mcp', 'ai-integration', 'nodejs', 'bun', 'performance-testing', 'open-source'],
    liveUrl: 'https://sylphx.com',
    details: [
      'Founded UK-based open source AI tools company focused on developer experience',
      'Created pdf-reader-mcp achieving 348+ GitHub stars with 5-10x faster PDF processing',
      'Built CodeRAG semantic code search engine with sub-50ms latency across 15+ languages',
      'Developed Rapid state management library 1.7-45x faster than competitors',
      'Created comprehensive MCP ecosystem tools for AI agent development',
      'Published multiple packages on NPM with 8,000+ combined downloads'
    ],
    keyAchievements: [
      '348+ GitHub stars on flagship project',
      '27+ open source repositories',
      '8K+ NPM downloads'
    ],
    impactStatements: [
      { value: '348+', label: 'GitHub Stars' },
      { value: '27+', label: 'Repositories' },
      { value: '8K+', label: 'NPM Downloads' }
    ]
  },
  {
    id: 'epiow',
    title: 'Co-Founder & CTO',
    company: 'epiow',
    period: '2025 - Present',
    location: 'United Kingdom',
    description: 'Building enterprise AI solutions including ML, NLP, and Computer Vision applications for global clients',
    logo: '/companys/epiow.png',
    skills: ['artificial-intelligence', 'machine-learning', 'nlp', 'computer-vision', 'python', 'typescript', 'enterprise'],
    liveUrl: 'https://epiow.com',
    details: [
      'Co-founded UK-based AI consulting and development company',
      'Leading technical strategy and architecture for enterprise AI solutions',
      'Developing custom ML/NLP/Computer Vision applications for global clients',
      'Building autonomous intelligent systems for business process automation',
      'Providing AI integration consulting and implementation services'
    ],
    keyAchievements: [
      'Enterprise AI consulting',
      'Custom ML/NLP solutions',
      'Global client base'
    ],
    impactStatements: [
      { value: 'UK', label: 'Headquarters' },
      { value: 'AI', label: 'Focus Area' },
      { value: 'Global', label: 'Client Base' }
    ]
  },
  {
    id: 'cubeage',
    title: 'Founder & CEO',
    company: 'cubeage',
    period: '2014 - 2024',
    location: 'Hong Kong / China',
    description: 'Founded and led all technical development for mobile gaming company achieving 10M+ global downloads',
    logo: '/companys/cubeage.jpeg',
    skills: ['unity3d', 'cocos2d', 'flutter', 'corona-sdk', 'gamedev', 'databases', 'ios', 'android'],
    liveUrl: 'https://cubeage.com',
    details: [
      'Developed and operated mobile games across multiple genres at Cubeage Limited',
      'Achieved over 10 million total installs across global markets including China, Hong Kong, Taiwan and Southeast Asia',
      'Built games using various frameworks including Unity3D, Cocos2d, Corona SDK and Flutter to optimize for different platforms and requirements',
      'Implemented comprehensive backend infrastructure to support large-scale multiplayer games',
      'Worked with development teams across Hong Kong and China offices',
      'Created successful monetization strategies through IAP, ads and subscription models',
      'Managed full game lifecycle from concept to live operations and updates'
    ],
    keyAchievements: [
      'Reached 10M+ global downloads',
      'Successfully launched in multiple markets',
      'Built scalable multi-region infrastructure'
    ],
    impactStatements: [
      { value: '10M+', label: 'Global Downloads' },
      { value: '4', label: 'Game Frameworks' },
      { value: '2', label: 'Regional Offices' }
    ]
  },
  {
    id: 'minimax',
    title: 'Co-Founder & CEO',
    company: 'minimax',
    period: '2010 - 2016',
    location: 'Hong Kong / Taiwan / China',
    description: 'Co-founded and led technical development for Hong Kong\'s top social gaming company with 10M+ monthly active users',
    logo: '/companys/minimax.jpeg',
    skills: ['databases', 'php', 'nodejs', 'payment-integration', 'social-gaming', 'game-operations', 'facebook-platform'],
    details: [
      'Developed at MiniMax Game Entertainment Limited, a leading social gaming company with offices in Hong Kong, Taiwan and China',
      'Built and operated over 30 concurrent social games and apps on Facebook platform',
      'Achieved over 10 million monthly active users (MAU) across portfolio of social games',
      'Established as one of the top Facebook game developers in Hong Kong and Taiwan markets',
      'Worked on Funimax platform, a major game distribution service with extensive retail network',
      'Participated in multi-region game operations, distribution partnerships and agency relationships',
      'Implemented comprehensive payment and analytics systems across physical and digital channels',
      'Built scalable infrastructure to support millions of daily active users'
    ],
    keyAchievements: [
      'Reached 10M+ monthly active users',
      'Operated 30+ concurrent games',
      'Top Facebook game developer in HK'
    ],
    impactStatements: [
      { value: '10M+', label: 'Monthly Active Users' },
      { value: '30+', label: 'Active Games' },
      { value: '3', label: 'Regional Offices' }
    ]
  },
  {
    id: 'nakuz',
    title: 'Co-Founder & CTO',
    company: 'nakuz',
    period: '2006 - 2024',
    location: 'Hong Kong',
    description: 'Co-founded and built Hong Kong\'s #1 gaming media platform with 500K+ registered users',
    logo: '/companys/nakuz.jpeg',
    skills: ['php', 'mysql', 'ubuntu', 'discuz', 'seo', 'community-management', 'digital-media', 'content-strategy'],
    liveUrl: 'https://nakuz.com',
    details: [
      'Built and maintained Hong Kong\'s leading gaming information platform powered by Discuz!, PHP, MySQL and Ubuntu',
      'Grew to over 500,000 registered users and 3,000+ concurrent online users',
      'Established as the official discussion platform for 100+ game publishers and developers',
      'Achieved top rankings in Hong Kong gaming media with significant industry influence',
      'Created comprehensive game guides, news coverage and community features',
      'Optimized infrastructure and performance for high-traffic loads',
      'Built strong partnerships with major gaming companies across Asia'
    ],
    keyAchievements: [
      '#1 Gaming Platform in Hong Kong',
      '100+ Official Game Partnerships',
      'Industry-Leading Community'
    ],
    impactStatements: [
      { value: '500K+', label: 'Registered Users' },
      { value: '3000+', label: 'Concurrent Users' },
      { value: '100+', label: 'Game Partners' }
    ]
  }
] as const; 