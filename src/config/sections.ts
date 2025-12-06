/**
 * Centralized section configuration used across navigation components.
 * Keep in sync with VALID_SECTIONS in src/lib/constants.ts
 */

export type SectionId = 'hero' | 'tech-stack' | 'open-source' | 'philosophy' | 'projects' | 'experience' | 'credentials' | 'contact';

export interface SectionConfig {
  id: SectionId;
  label: string;
  path: string;
}

export const SECTIONS: SectionConfig[] = [
  { id: 'hero', label: 'Home', path: '/' },
  { id: 'tech-stack', label: 'Skills', path: '/tech-stack' },
  { id: 'open-source', label: 'Open Source', path: '/open-source' },
  { id: 'philosophy', label: 'Philosophy', path: '/philosophy' },
  { id: 'projects', label: 'Projects', path: '/projects' },
  { id: 'experience', label: 'Experience', path: '/experience' },
  { id: 'credentials', label: 'Background', path: '/credentials' },
  { id: 'contact', label: 'Contact', path: '/contact' },
];

export const SECTION_IDS: SectionId[] = SECTIONS.map(s => s.id);
export const URL_SECTION_IDS: SectionId[] = SECTIONS.filter(s => s.id !== 'hero').map(s => s.id);