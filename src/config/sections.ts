/**
 * Centralized section configuration used across navigation components.
 * Keep in sync with VALID_SECTIONS in src/lib/constants.ts
 */

export type SectionId = 'hero' | 'tech-stack' | 'philosophy' | 'projects' | 'experience' | 'contact';

export interface SectionConfig {
  id: SectionId;
  label: string;
  path: string;
}

export const SECTIONS: SectionConfig[] = [
  { id: 'hero', label: 'Home', path: '/' },
  { id: 'tech-stack', label: 'Skills', path: '/tech-stack' },
  { id: 'philosophy', label: 'Philosophy', path: '/philosophy' },
  { id: 'projects', label: 'Projects', path: '/projects' },
  { id: 'experience', label: 'Experience', path: '/experience' },
  { id: 'contact', label: 'Contact', path: '/contact' },
];

export const SECTION_IDS: SectionId[] = SECTIONS.map(s => s.id);
export const URL_SECTION_IDS: SectionId[] = SECTIONS.filter(s => s.id !== 'hero').map(s => s.id);