import { PROJECTS } from '../data/projects';

/**
 * Calculates the total years of experience for a skill based on project history
 * - Considers all projects where the skill was used
 * - Accounts for gaps between projects
 * - Uses current date for ongoing projects (those with undefined end date)
 *
 * @param skillId - The ID of the skill to calculate experience for
 * @returns The number of years of experience (rounded to nearest half year)
 */
export function calculateSkillExperience(skillId: string): number {
  // Get all projects where this skill was used
  const relevantProjects = PROJECTS.filter(project =>
    project.skills.includes(skillId) && project.period?.start
  );

  if (relevantProjects.length === 0) {
    return 0;
  }

  // Sort projects by start date
  const sortedProjects = [...relevantProjects].sort((a, b) => {
    if (!a.period?.start) return 1;
    if (!b.period?.start) return -1;
    return new Date(a.period.start).getTime() - new Date(b.period.start).getTime();
  });

  // Create time periods where skill was used
  const periods: Array<{ start: Date, end: Date }> = [];

  for (const project of sortedProjects) {
    if (!project.period?.start) continue;

    const projectStart = new Date(project.period.start);
    const projectEnd = project.period.end
      ? new Date(project.period.end)
      : new Date(); // Use current date for ongoing projects

    // Check if this period overlaps with any existing periods
    let overlapped = false;

    for (let i = 0; i < periods.length; i++) {
      const period = periods[i];

      // Check for overlap
      if (projectStart <= period.end && projectEnd >= period.start) {
        // Merge the periods
        period.start = new Date(Math.min(period.start.getTime(), projectStart.getTime()));
        period.end = new Date(Math.max(period.end.getTime(), projectEnd.getTime()));
        overlapped = true;
        break;
      }
    }

    // If no overlap, add as new period
    if (!overlapped) {
      periods.push({
        start: projectStart,
        end: projectEnd
      });
    }
  }

  // Calculate total time across all periods (in years)
  let totalExperienceMs = 0;

  for (const period of periods) {
    totalExperienceMs += period.end.getTime() - period.start.getTime();
  }

  // Convert milliseconds to years, rounded to nearest half year
  const msInYear = 1000 * 60 * 60 * 24 * 365.25;
  const rawYears = totalExperienceMs / msInYear;

  // Round to nearest half year for more natural display
  return Math.round(rawYears * 2) / 2;
}

/**
 * Gets the first project date when a skill was used
 *
 * @param skillId - The ID of the skill to check
 * @returns ISO date string of first usage or null if not found
 */
export function getFirstSkillUsage(skillId: string): string | null {
  const relevantProjects = PROJECTS.filter(project =>
    project.skills.includes(skillId) && project.period?.start
  );

  if (relevantProjects.length === 0) {
    return null;
  }

  // Find earliest start date
  let earliestDate: Date | null = null;

  for (const project of relevantProjects) {
    if (!project.period?.start) continue;

    const projectStart = new Date(project.period.start);

    if (!earliestDate || projectStart < earliestDate) {
      earliestDate = projectStart;
    }
  }

  return earliestDate ? earliestDate.toISOString().split('T')[0] : null;
}

/**
 * Gets the most recent project where a skill was used
 *
 * @param skillId - The ID of the skill to check
 * @returns The project ID of most recent usage or null if not found
 */
export function getMostRecentSkillProject(skillId: string): string | null {
  const relevantProjects = PROJECTS.filter(project =>
    project.skills.includes(skillId)
  );

  if (relevantProjects.length === 0) {
    return null;
  }

  // Sort by end date, putting undefined (ongoing) at the top
  const sortedProjects = [...relevantProjects].sort((a, b) => {
    if (!a.period?.end) return -1;
    if (!b.period?.end) return 1;
    return new Date(b.period.end).getTime() - new Date(a.period.end).getTime();
  });

  return sortedProjects[0].id;
}
