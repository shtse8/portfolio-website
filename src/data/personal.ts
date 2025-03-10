import { PersonalInfo } from './types';

export const PERSONAL_INFO: PersonalInfo = {
  firstName: "Kyle",
  lastName: "Tse",
  title: "Full Stack Developer",
  shortBio: "Full Stack Developer with extensive experience in web development, mobile game development, blockchain solutions, and AI integration. Skilled in game design, marketing, advertising, and operations with multiple successful apps and platforms reaching millions of downloads.",
  email: "hi@kylet.se",
  location: {
    base: "Hong Kong & UK",
    remote: "Available for remote work worldwide"
  },
  social: {
    github: "https://github.com/shtse8",
    linkedin: "https://linkedin.com/in/shtse8",
    stackoverflow: "https://stackoverflow.com/users/4380384/shtse8"
  },
  contactFormSubjects: [
    "Project Inquiry",
    "Job Opportunity",
    "Consultation Request",
    "Speaking Engagement",
    "Other"
  ],
  portfolioUrl: "https://kylet.se",
  company: "",
  specialties: [
    "Full Stack Development",
    "Mobile Game Development",
    "Blockchain Solutions",
    "AI & Quantitative Trading",
    "System Architecture",
    "Game Design",
    "Digital Marketing",
    "Ad Campaign Management",
    "Social Media Management",
    "Product Operations"
  ],
  tagline: "Building innovative digital experiences across platforms",
  roles: [
    "Full Stack Developer",
    "Game Developer",
    "Blockchain Engineer",
    "System Architect",
    "Game Designer",
    "Digital Marketer",
    "Product Manager"
  ]
} as const; 