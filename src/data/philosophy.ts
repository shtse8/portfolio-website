import { PhilosophyPrinciple } from './types';

/**
 * Philosophy principles data
 * 
 * Core principles — kept brief and honest
 */
export const PHILOSOPHY_PRINCIPLES: PhilosophyPrinciple[] = [
  {
    id: 'minimal',
    title: 'purposeful minimalism',
    shortDescription: 'reduce, not restrict',
    fullDescription: 'Every element should serve a purpose. If it doesn\'t contribute to functionality or understanding, it doesn\'t belong — in interfaces or code.',
    icon: 'FaRegSquare',
    visualElement: 'geometry',
    category: 'core',
    keyPoints: [
      'Eliminate the unnecessary',
      'Maximize meaning, minimize noise',
      'Focus on functionality first',
      'Find beauty in simplicity'
    ],
    colorScheme: {
      bg: 'neutral-800',
      text: 'neutral-100'
    }
  },
  {
    id: 'clarity',
    title: 'clarity',
    shortDescription: 'eliminate confusion',
    fullDescription: 'Write code and design interfaces that express their purpose without ambiguity. Comments explain why, not what.',
    icon: 'FaGlasses',
    visualElement: 'transparency', 
    category: 'core',
    keyPoints: [
      'Straightforward communication',
      'Self-explanatory interfaces',
      'Intentional organization',
      'Legible at every level'
    ],
    colorScheme: {
      bg: 'emerald-500',
      text: 'emerald-50'
    }
  },
  {
    id: 'open',
    title: 'openness',
    shortDescription: 'share what you build',
    fullDescription: 'Write clean, documented code that others can understand and contribute to. Open source by default where possible.',
    icon: 'FaCode',
    visualElement: 'transparency',
    category: 'code',
    keyPoints: [
      'Clear documentation',
      'Explainable solutions',
      'Knowledge sharing',
      'Community contribution'
    ],
    colorScheme: {
      bg: 'teal-500',
      text: 'teal-50'
    }
  },
  {
    id: 'efficiency',
    title: 'efficiency',
    shortDescription: 'respect resources',
    fullDescription: 'Write performant code that respects both machine and human resources. Use automation and tooling to move faster without cutting corners.',
    icon: 'FaBolt',
    visualElement: 'automation',
    category: 'code',
    keyPoints: [
      'Performance optimization',
      'Resource conservation',
      'Strategic automation',
      'Sustainable patterns'
    ],
    colorScheme: {
      bg: 'amber-400',
      text: 'amber-50'
    }
  },
  {
    id: 'systematic',
    title: 'systematic thinking',
    shortDescription: 'patterns over instances',
    fullDescription: 'Look for underlying patterns and build scalable solutions rather than one-off fixes. Good systems evolve with the product.',
    icon: 'FaLayerGroup',
    visualElement: 'modules',
    category: 'code',
    keyPoints: [
      'Pattern recognition',
      'Scalable architecture',
      'Consistent methodologies',
      'Evolving standards'
    ],
    colorScheme: {
      bg: 'cyan-600',
      text: 'cyan-50'
    }
  }
] as const;
