import { SKILLS } from '@/data/portfolioData';

/**
 * Gets the skill name for a given skill ID
 * @param skillId The ID of the skill to look up
 * @returns The name of the skill or the ID if not found
 */
export function getSkillName(skillId: string): string {
  const skill = SKILLS.find(s => s.id === skillId);
  return skill ? skill.name : skillId;
}

/**
 * Gets the full skill object for a given skill ID
 * @param skillId The ID of the skill to look up
 * @returns The skill object or undefined if not found
 */
export function getSkillById(skillId: string) {
  return SKILLS.find(s => s.id === skillId);
}

/**
 * Gets an array of skill names from an array of skill IDs
 * @param skillIds Array of skill IDs to look up
 * @returns Array of corresponding skill names
 */
export function getSkillNames(skillIds: string[]): string[] {
  return skillIds.map(id => getSkillName(id));
} 