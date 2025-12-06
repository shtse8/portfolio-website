// Export all types
export * from './types';

// Export all data
export { PROJECTS, PROJECT_CATEGORIES } from './projects';
export * from './companies';
export * from './organizations';
export * from './experiences';
export * from './roles';
export { getSkills, SKILLS_BASE, clearSkillsCache } from './skills';
export { PERSONAL_INFO, GITHUB_STATS } from './personal';
export * from './philosophy';

// Helper functions
import { Project, Period, Metric } from './types';

/**
 * Format a Period object to a human-readable string
 * @example { start: '2025-01' } => "2025 - Present"
 * @example { start: '2010-01', end: '2016-12' } => "2010 - 2016"
 */
export function formatPeriod(period: Period): string {
  const startYear = period.start.substring(0, 4);
  if (!period.end) {
    return `${startYear} - Present`;
  }
  const endYear = period.end.substring(0, 4);
  if (startYear === endYear) {
    return startYear;
  }
  return `${startYear} - ${endYear}`;
}

/**
 * Format a Metric to a human-readable string
 * @example { type: 'users', value: 10000000, context: 'monthly' } => "10,000,000"
 */
export function formatMetric(metric: Metric): string {
  const value = typeof metric.value === 'number'
    ? metric.value.toLocaleString()
    : metric.value;
  return `${value}${metric.unit ? ` ${metric.unit}` : ''}`;
}

/**
 * Format a large number with suffix (K, M, B)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

/**
 * Aggregate metrics by type
 */
export function aggregateMetrics(metrics: Metric[], type: Metric['type']): number {
  return metrics
    .filter(m => m.type === type)
    .reduce((sum, m) => sum + (typeof m.value === 'number' ? m.value : 0), 0);
}

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