import { Role, Experience, Period, Metric } from './types';
import { ORGANIZATIONS } from './organizations';

/**
 * Roles - richer alternative to EXPERIENCES
 * Supports multiple roles per organization with proper relationships
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
      'Technical architecture and development',
      'Open source project creation and maintenance',
      'Product strategy and roadmap',
      'Developer experience optimization'
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
      'Technical strategy and architecture',
      'Enterprise AI solution development',
      'ML/NLP/Computer Vision implementation',
      'Client technical consulting'
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
      'Technical leadership and architecture',
      'Game development across multiple frameworks',
      'Backend infrastructure development',
      'Monetization strategy implementation',
      'Multi-region team management'
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
      'Technical development leadership',
      'Social game platform development',
      'Multi-region operations management',
      'Payment and analytics system implementation',
      'Scalable infrastructure development'
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
      'Full-stack platform development',
      'Infrastructure optimization',
      'Community features development',
      'SEO and content strategy',
      'Game publisher partnerships'
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
] as const;

// ========================================
// Helper Functions
// ========================================

/**
 * Get role by ID
 */
export function getRole(id: string): Role | undefined {
  return ROLES.find(r => r.id === id);
}

/**
 * Get all roles for an organization
 */
export function getRolesByOrganization(organizationId: string): Role[] {
  return ROLES.filter(r => r.organizationId === organizationId);
}

/**
 * Get current (ongoing) roles
 */
export function getCurrentRoles(): Role[] {
  return ROLES.filter(r => !r.period.end);
}

/**
 * Get all technologies used across roles
 */
export function getRoleTechnologies(roleId: string): string[] {
  const role = getRole(roleId);
  return role?.skills || [];
}

/**
 * Calculate total years of experience from roles
 */
export function calculateTotalExperience(): number {
  const sortedRoles = [...ROLES].sort((a, b) =>
    new Date(a.period.start).getTime() - new Date(b.period.start).getTime()
  );

  if (sortedRoles.length === 0) return 0;

  const earliestStart = new Date(sortedRoles[0].period.start);
  const now = new Date();

  return Math.floor((now.getTime() - earliestStart.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

// ========================================
// Backward Compatibility
// ========================================

/**
 * Format Period to legacy string format
 */
function formatPeriodLegacy(period: Period): string {
  const startYear = period.start.substring(0, 4);
  if (!period.end) {
    return `${startYear} - Present`;
  }
  const endYear = period.end.substring(0, 4);
  return startYear === endYear ? startYear : `${startYear} - ${endYear}`;
}

/**
 * Convert Role to legacy Experience format
 */
function roleToExperience(role: Role): Experience {
  const org = ORGANIZATIONS[role.organizationId];

  return {
    id: role.id.split('-')[0], // Use org ID for legacy compatibility
    title: role.title,
    company: role.organizationId,
    period: role.period,
    location: role.location || org?.location || '',
    description: role.description,
    logo: role.logo || org?.logo || '',
    skills: role.skills || [],
    liveUrl: role.liveUrl || org?.website,
    details: role.responsibilities,
    projects: role.projectIds,
    keyAchievements: role.keyAchievements,
    metrics: role.metrics,
    impactStatements: role.metrics.map(m => ({
      value: typeof m.value === 'number' ? m.value.toLocaleString() : m.value,
      label: m.unit || m.type
    }))
  };
}

/**
 * @deprecated Use ROLES instead
 * Legacy EXPERIENCES export from ROLES for backward compatibility
 */
export const EXPERIENCES_FROM_ROLES: Experience[] = ROLES.map(roleToExperience);
