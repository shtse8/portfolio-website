import { Experience } from './types';

export const EXPERIENCES: Experience[] = [
  {
    id: 'cubeage',
    title: 'Full Stack Developer',
    company: 'cubeage', 
    period: '2014 - 2024',
    location: 'Hong Kong / China',
    description: 'Developed mobile games for a company with over 10M total installs globally',
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
    title: 'Full Stack Developer',
    company: 'minimax',
    period: '2010 - 2016',
    location: 'Hong Kong / Taiwan / China',
    description: 'Developed for one of Hong Kong\'s top social gaming companies with over 10M monthly active users across multiple platforms',
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
    title: 'Full Stack Developer',
    company: 'nakuz',
    period: '2006 - 2024',
    location: 'Hong Kong',
    description: 'Hong Kong\'s #1 gaming media and community platform with over 500,000 registered users',
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