import { Organization } from './types';

/**
 * All Organizations
 */
export const ORGANIZATIONS: Record<string, Organization> = {
  sylphx: {
    id: 'sylphx',
    name: 'Sylphx',
    legalName: 'Sylphx Limited',
    type: 'company',
    status: 'active',
    description: 'Open source AI tools company democratizing AI through elegant, high-performance code',
    logo: '/companys/sylphx.png',
    website: 'https://sylphx.com',
    github: 'SylphxAI',
    location: 'United Kingdom',
    industry: 'AI & Open Source',
    size: '1-10 employees',
    founded: '2025-01'
  },
  epiow: {
    id: 'epiow',
    name: 'Epiow',
    legalName: 'Epiow Limited',
    type: 'company',
    status: 'active',
    description: 'Leading AI application development company specializing in enterprise solutions',
    logo: '/companys/epiow.png',
    website: 'https://epiow.com',
    github: 'EpiowAI',
    location: 'United Kingdom',
    industry: 'Enterprise AI',
    size: '1-10 employees',
    founded: '2025-01'
  },
  cubeage: {
    id: 'cubeage',
    name: 'Cubeage',
    legalName: 'Cubeage Limited',
    type: 'company',
    status: 'active',
    description: 'Mobile gaming company specializing in card and casino games with millions of downloads',
    logo: '/companys/cubeage.jpeg',
    website: 'https://cubeage.com',
    github: 'Cubeage',
    location: 'Hong Kong',
    industry: 'Game Development',
    size: '10-50 employees',
    founded: '2014-01'
  },
  nakuz: {
    id: 'nakuz',
    name: 'Nakuz',
    legalName: 'Nakuz.com Limited',
    type: 'company',
    status: 'active',
    description: 'Hong Kong\'s #1 gaming media platform and community',
    logo: '/companys/nakuz.jpeg',
    website: 'https://nakuz.com',
    location: 'Hong Kong',
    industry: 'Digital Media',
    size: '10-50 employees',
    founded: '2006-01'
  },
  minimax: {
    id: 'minimax',
    name: 'MiniMax',
    legalName: 'MiniMax Game Entertainment Limited',
    tradingName: 'Funimax',
    type: 'company',
    status: 'closed',
    description: 'Hong Kong\'s top social gaming company with 10M+ MAU',
    logo: '/companys/minimax.jpeg',
    website: 'https://funimax.com',
    location: 'Hong Kong',
    industry: 'Game Distribution',
    size: '10-50 employees',
    founded: '2010-01'
  }
};

// ========================================
// Helper Functions
// ========================================

export function getOrganization(id: string): Organization | undefined {
  return ORGANIZATIONS[id];
}

export function getActiveOrganizations(): Organization[] {
  return Object.values(ORGANIZATIONS).filter(org => org.status === 'active');
}

export function getOrganizationsByType(type: Organization['type']): Organization[] {
  return Object.values(ORGANIZATIONS).filter(org => org.type === type);
}
