import { Role } from './types';

/**
 * All Roles
 */
export const ROLES: Role[] = [
  {
    id: 'sylphx-founder',
    organizationId: 'sylphx',
    title: 'Founder',
    type: 'founder',
    period: { start: '2025-01' },
    location: 'United Kingdom',
    isRemote: true,
    description: 'Founded Sylphx to democratize AI through elegant, high-performance open source tools and frameworks',
    responsibilities: [
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
    metrics: [
      { type: 'stars', value: 348, context: 'total' },
      { type: 'projects', value: 27, context: 'total' },
      { type: 'downloads', value: 8000, unit: 'NPM', context: 'total' }
    ],
    skills: ['typescript', 'mcp', 'ai-integration', 'nodejs', 'bun', 'performance-testing', 'open-source'],
    logo: '/companys/sylphx.png',
    liveUrl: 'https://sylphx.com'
  },
  {
    id: 'epiow-cto',
    organizationId: 'epiow',
    title: 'Co-Founder & CTO',
    type: 'cofounder',
    period: { start: '2025-01' },
    location: 'United Kingdom',
    isRemote: true,
    description: 'Building enterprise AI solutions including ML, NLP, and Computer Vision applications for global clients',
    responsibilities: [
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
    metrics: [
      { type: 'custom', value: 'UK', unit: 'Headquarters' },
      { type: 'custom', value: 'AI', unit: 'Focus Area' },
      { type: 'custom', value: 'Global', unit: 'Client Base' }
    ],
    skills: ['artificial-intelligence', 'machine-learning', 'nlp', 'computer-vision', 'python', 'typescript', 'enterprise'],
    logo: '/companys/epiow.png',
    liveUrl: 'https://epiow.com'
  },
  {
    id: 'cubeage-founder',
    organizationId: 'cubeage',
    title: 'Founder & CEO',
    type: 'founder',
    period: { start: '2014-01' },
    location: 'Hong Kong / China',
    description: 'Founded and led all technical development for mobile gaming company achieving 10M+ global downloads',
    responsibilities: [
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
    metrics: [
      { type: 'downloads', value: 10000000, context: 'total' },
      { type: 'projects', value: 4, unit: 'Game Frameworks' },
      { type: 'custom', value: 2, unit: 'Regional Offices' }
    ],
    skills: ['unity3d', 'cocos2d', 'flutter', 'corona-sdk', 'gamedev', 'databases', 'ios', 'android'],
    logo: '/companys/cubeage.jpeg',
    liveUrl: 'https://cubeage.com'
  },
  {
    id: 'minimax-ceo',
    organizationId: 'minimax',
    title: 'Co-Founder & CEO',
    type: 'cofounder',
    period: { start: '2010-01', end: '2016-12' },
    location: 'Hong Kong / Taiwan / China',
    description: 'Co-founded and led technical development for Hong Kong\'s top social gaming company with 10M+ monthly active users',
    responsibilities: [
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
    metrics: [
      { type: 'users', value: 10000000, context: 'monthly' },
      { type: 'projects', value: 30, unit: 'Active Games' },
      { type: 'custom', value: 3, unit: 'Regional Offices' }
    ],
    skills: ['databases', 'php', 'nodejs', 'payment-integration', 'social-gaming', 'game-operations', 'facebook-platform'],
    logo: '/companys/minimax.jpeg'
  },
  {
    id: 'nakuz-cto',
    organizationId: 'nakuz',
    title: 'Co-Founder & CTO',
    type: 'cofounder',
    period: { start: '2006-01' },
    location: 'Hong Kong',
    description: 'Co-founded and built Hong Kong\'s #1 gaming media platform with 500K+ registered users',
    responsibilities: [
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
    metrics: [
      { type: 'users', value: 500000, context: 'total' },
      { type: 'users', value: 3000, context: 'concurrent' },
      { type: 'partners', value: 100, unit: 'Game Partners' }
    ],
    skills: ['php', 'mysql', 'ubuntu', 'discuz', 'seo', 'community-management', 'digital-media', 'content-strategy'],
    logo: '/companys/nakuz.jpeg',
    liveUrl: 'https://nakuz.com'
  }
];

// ========================================
// Helper Functions
// ========================================

export function getRole(id: string): Role | undefined {
  return ROLES.find(r => r.id === id);
}

export function getRolesByOrganization(organizationId: string): Role[] {
  return ROLES.filter(r => r.organizationId === organizationId);
}

export function getCurrentRoles(): Role[] {
  return ROLES.filter(r => !r.period.end);
}

export function getRolesSortedByDate(): Role[] {
  return [...ROLES].sort((a, b) => {
    const aStart = new Date(a.period.start).getTime();
    const bStart = new Date(b.period.start).getTime();
    return bStart - aStart; // Newest first
  });
}

export function calculateTotalExperience(): number {
  const sortedRoles = [...ROLES].sort((a, b) =>
    new Date(a.period.start).getTime() - new Date(b.period.start).getTime()
  );

  if (sortedRoles.length === 0) return 0;

  const earliestStart = new Date(sortedRoles[0].period.start);
  const now = new Date();

  return Math.floor((now.getTime() - earliestStart.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}
