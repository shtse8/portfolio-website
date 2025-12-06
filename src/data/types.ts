// ========================================
// Core Types
// ========================================

/**
 * Represents a time period with structured start/end dates
 */
export type Period = {
  start: string;  // ISO date "YYYY-MM-DD" or "YYYY-MM" or "YYYY"
  end?: string;   // undefined = present/ongoing
};

/**
 * Metric for quantifiable achievements
 */
export type Metric = {
  type: 'users' | 'downloads' | 'stars' | 'revenue' | 'engagement' | 'projects' | 'partners' | 'custom';
  value: number | string;
  label?: string;  // Display label (defaults to type if not specified)
  unit?: string;
  context?: 'monthly' | 'total' | 'peak' | 'daily' | 'concurrent';
  verified?: boolean;
  source?: string;
};

// ========================================
// Entity Types
// ========================================

/**
 * Unified Organization entity
 * Supports companies, GitHub orgs, communities
 */
export type Organization = {
  id: string;
  name: string;
  legalName?: string;      // "Sylphx Limited"
  tradingName?: string;    // "Sylphx"
  type: 'company' | 'github_org' | 'community' | 'personal';
  status: 'active' | 'acquired' | 'closed' | 'dormant';

  description: string;
  logo: string;

  // Links
  website?: string;
  github?: string;         // GitHub org username

  // Meta
  location?: string;
  industry?: string;
  size?: string;
  founded?: string;        // ISO date

  // Relationships
  parentId?: string;       // For subsidiaries
};

/**
 * Role entity - represents a position held at an organization
 */
export type Role = {
  id: string;
  organizationId: string;

  title: string;
  type: 'founder' | 'cofounder' | 'cto' | 'ceo' | 'employee' | 'contractor' | 'advisor' | 'freelance';

  period: Period;
  location?: string;
  isRemote?: boolean;

  description: string;
  responsibilities: string[];
  keyAchievements?: string[];
  metrics: Metric[];

  // Skills and projects
  skills?: string[];
  projectIds?: string[];

  // Display
  logo?: string;
  liveUrl?: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  images: string[] | null;
  skills: string[];
  category: string;
  organizationId?: string;  // Which org owns this
  roleId?: string;          // Which role created this
  details: string[] | string;
  teamSize?: string;
  duration?: string;
  role?: string;
  period?: Period;
  challenges?: {
    title: string;
    description: string;
  }[];
  urls?: {
    wikipedia?: string;
    appStore?: string;
    googlePlay?: string;
    website?: string;
    repository?: string;
    documentation?: string;
    demo?: string;
    timemachine?: string;
    other?: Array<{
      name: string;
      url: string;
      description?: string;
      type?: 'review' | 'article' | 'video' | 'social' | 'award' | 'resource' | 'tool' | 'misc';
    }>;
  };

  // Convenience aliases (computed from urls)
  liveUrl?: string;  // alias for urls.website
  github?: string;   // alias for urls.repository
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
  icon: string;
  url?: string;             // Official website/docs

  // Hierarchy
  parentId?: string;        // e.g., TypeScript → JavaScript
  relatedIds?: string[];    // Similar purpose techs
};

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
  specialties?: string[];
  tagline?: string;
  roles?: string[];
};

export type PhilosophyPrinciple = {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  visualElement?: string;
  category: 'core' | 'design' | 'code' | 'approach';
  keyPoints?: string[];
  colorScheme: {
    bg: string;
    text: string;
  };
};
