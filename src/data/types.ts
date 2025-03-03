export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  gallery?: string[];
  skills: string[];
  skillTags?: string[];
  github?: string;
  liveUrl?: string;
  androidUrl?: string;
  iosUrl?: string;
  category: string;
  company: string | null;
  details: string[] | string;
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
  skills: string[];
  liveUrl?: string;
  details: string[];
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