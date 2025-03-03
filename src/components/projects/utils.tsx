import type { Project, Experience } from '@/data/types';
import { EXPERIENCES } from '@/data/experiences';
import { ReactNode } from 'react';
import Link from 'next/link';

// Parse markdown links in text
export const parseMarkdownLinks = (text: string): ReactNode => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Add the link component
    parts.push(
      <Link 
        key={match.index} 
        href={match[2]} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {match[1]}
      </Link>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
};

// Get a color based on index
export const getProjectColor = (index: number): string => {
  const colors = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B'];
  return colors[index % colors.length];
};

// Find experience related to a project
export const getExperienceForProject = (project: Project): Experience | null => {
  if (!project.company) return null;
  
  const relatedExperiences = EXPERIENCES.filter(exp => exp.company === project.company);
  return relatedExperiences.length > 0 ? relatedExperiences[0] : null;
}; 