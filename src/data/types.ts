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
  logo: string;
  skills: string[];
  liveUrl?: string;
  details: string[];
  projects?: string[];
  keyAchievements?: string[];
  impactStatements?: Array<{ value: string; label: string }>;
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