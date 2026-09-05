// ========================================
// Core Types
// ========================================

/**
 * Represents a time period with structured start/end dates
 */
export type Period = {
  start: string; // ISO date "YYYY-MM-DD" or "YYYY-MM" or "YYYY"
  end?: string; // undefined = present/ongoing
};

/**
 * Metric for quantifiable achievements
 */
export type MetricHonesty = "live-measured" | "self-attested";

export type Metric = {
  type:
    | "users"
    | "downloads"
    | "stars"
    | "revenue"
    | "engagement"
    | "projects"
    | "partners"
    | "custom";
  value: number | string;
  label?: string; // Display label (defaults to type if not specified)
  unit?: string;
  context?: "monthly" | "total" | "peak" | "daily" | "concurrent";
  verified?: boolean;
  source?: string;
  /** Career-scale metrics are self-attested historical pedigree. */
  honesty?: MetricHonesty;
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
  legalName?: string; // "Sylphx Limited"
  tradingName?: string; // "Sylphx"
  type: "company" | "github_org" | "community" | "personal";
  status: "active" | "acquired" | "closed" | "dormant";

  description: string;
  logo: string;

  // Links
  website?: string;
  github?: string; // GitHub org username

  // Meta
  location?: string;
  industry?: string;
  size?: string;
  founded?: string; // ISO date

  // Relationships
  parentId?: string; // For subsidiaries
};

/**
 * Role entity - represents a position held at an organization
 */
export type Role = {
  id: string;
  organizationId: string;

  title: string;
  type:
    | "founder"
    | "cofounder"
    | "cto"
    | "ceo"
    | "employee"
    | "contractor"
    | "advisor"
    | "freelance";

  period: Period;
  location?: string;
  isRemote?: boolean;

  description: string;
  responsibilities: string[];
  keyAchievements?: string[];
  metrics: Metric[];

  // Skills
  skills?: string[];

  // Display
  logo?: string;
  liveUrl?: string;
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
  category: "core" | "design" | "code" | "approach";
  keyPoints?: string[];
  colorScheme: {
    bg: string;
    text: string;
  };
};
