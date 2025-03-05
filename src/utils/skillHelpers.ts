import { getSkills } from '@/data/skills';

/**
 * Gets the name of a skill from its ID
 */
export function getSkillName(skillId: string): string {
  const skill = getSkills().find(s => s.id === skillId);
  return skill ? skill.name : skillId;
}

/**
 * Gets skill data by ID
 */
export function getSkillById(skillId: string) {
  const skills = getSkills();
  return skills.find(s => s.id === skillId);
}

/**
 * Gets the names of skills from their IDs
 */
export function getSkillNames(skillIds: string[]): string[] {
  const skills = getSkills();
  return skillIds.map(id => {
    const skill = skills.find(s => s.id === id);
    return skill ? skill.name : id;
  });
} 