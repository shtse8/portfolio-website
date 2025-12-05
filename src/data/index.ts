// Export all types
export * from './types';

// Export all data
export { PROJECTS, PROJECT_CATEGORIES } from './projects';
export * from './companies';
export * from './experiences';
export { getSkills, SKILLS_BASE, clearSkillsCache } from './skills';
export { PERSONAL_INFO, GITHUB_STATS } from './personal';
export * from './philosophy'; 

// Helper functions
import { Project } from './types';

/**
 * Get the display URL for a project
 * Returns the web URL if available, the time machine URL as a fallback,
 * and finally any other available URL
 */
export function getProjectDisplayUrl(project: Project): string | undefined {
  if (!project.urls) {
    // No URLs available
    return undefined;
  }
  
  const { website, timemachine, repository, googlePlay, appStore } = project.urls;
  
  // Use website URL if available, then timemachine, then other URLs
  return website || timemachine || repository || googlePlay || appStore || undefined;
}

/**
 * Get the TimeMachine URL for a project if available
 */
export function getProjectTimeMachineUrl(project: Project): string | undefined {
  return project.urls?.timemachine;
}

/**
 * Format a project's year or period display
 * @param project The project to format the period for
 * @returns Formatted string like "2001-2005" or "2005-Present"
 */
export function formatProjectPeriod(project: Project): string {
  if (!project.start_date) {
    return ""; // Return empty string if no start date
  }
  
  // Extract years from ISO dates or use the whole string if not in ISO format
  const startYear = project.start_date.substring(0, 4);
  
  if (!project.end_date) {
    return `${startYear}-Present`;
  }
  
  const endYear = project.end_date.substring(0, 4);
  
  // If same year, just return one year
  if (startYear === endYear) {
    return startYear;
  }
  
  return `${startYear}-${endYear}`;
}

/**
 * Get all media links for a project
 */
export function getProjectMediaLinks(project: Project): Array<{name: string, url: string, description?: string}> {
  if (!project.urls?.other) {
    return [];
  }
  
  return project.urls.other.filter(link => link.type === 'video' || link.type === 'social');
} 