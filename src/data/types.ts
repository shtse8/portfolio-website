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
  unit?: string;
  context?: 'monthly' | 'total' | 'peak' | 'daily' | 'concurrent';
  verified?: boolean;
  source?: string;
};

// ========================================
// Entity Types
// ========================================

export type Project = {
  id: string;
  title: string;
  description: string;
  images: string[] | null;
  skills: string[];
  category: string;
  related_experience_id: string | null;
  details: string[] | string;
  teamSize?: string;
  duration?: string;
  role?: string;
  start_date?: string;
  end_date?: string;
  challenges?: {
    title: string;
    description: string;
  }[];
  urls?: {
    // Specific known platforms
    wikipedia?: string;
    appStore?: string;  // Replacing ios
    googlePlay?: string;  // Replacing android
    website?: string;  // Replacing web
    repository?: string;  // Replacing github
    documentation?: string;
    demo?: string;
    timemachine?: string;  // For Internet Archive links
    
    // For everything else
    other?: Array<{
      name: string;
      url: string;
      description?: string;
      type?: 'review' | 'article' | 'video' | 'social' | 'award' | 'resource' | 'tool' | 'misc';
    }>;
  };
  // Legacy fields that will be deprecated once migration is complete
  github?: string;
  liveUrl?: string;
  androidUrl?: string;
  iosUrl?: string;
};

/**
 * @deprecated Use Organization instead
 */
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

/**
 * Unified Organization entity - replaces Company
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

export type Experience = {
  id: string;
  title: string;
  company: string | null;
  period: Period;  // Structured period with start/end
  location: string;
  description: string;
  logo: string;
  skills: string[];
  liveUrl?: string;
  details: string[];
  projects?: string[];
  keyAchievements?: string[];
  metrics?: Metric[];  // Structured metrics

  // @deprecated Use metrics instead
  impactStatements?: Array<{ value: string; label: string }>;
};

/**
 * Role entity - richer alternative to Experience
 * Supports multiple roles per organization with proper relationships
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

  // Auto-derived from projects
  skills?: string[];
  projectIds?: string[];

  // Display
  logo?: string;
  liveUrl?: string;
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
  icon: string; // Icon name from react-icons/fa
  visualElement?: string; // Key name for visual element component
  category: 'core' | 'design' | 'code' | 'approach'; // Indicates primary domain
  keyPoints?: string[]; // Key aspects of the principle
  colorScheme: {
    bg: string; // Background color class name
    text: string; // Text color class name
  };
}; 