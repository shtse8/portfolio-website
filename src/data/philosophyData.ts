/**
 * Types for Philosophy principles data
 */
export type PhilosophyPrinciple = {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string; // Icon name from react-icons/fa
  visualElement?: string; // Key name for visual element component
  category: 'core' | 'design' | 'code' | 'approach'; // Indicates primary domain
  keyPoints?: string[]; // Key aspects of the principle
  colorScheme: {
    bg: string; // Background color class name
    text: string; // Text color class name
  };
};

/**
 * Philosophy principles data
 * 
 * Core principles that apply universally across UI/UX, coding, and all aspects of technology
 */
export const PHILOSOPHY_PRINCIPLES: PhilosophyPrinciple[] = [
  {
    id: 'minimal',
    title: 'purposeful minimalism',
    shortDescription: 'reduce, not restrict',
    fullDescription: 'I believe in purposeful minimalism, not sterile simplicity. This means creating clean layouts with low visual noise, where content breathes through generous whitespace. My approach eliminates unnecessary decorative elements while maintaining visual interest through thoughtful use of color, subtle hierarchies, and meaningful interactions. Every element serves a purpose – if it doesn\'t contribute to functionality or user understanding, it doesn\'t belong. This philosophy applies equally to interfaces and code: both should contain only what\'s necessary, but everything necessary.',
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
    id: 'aesthetics',
    title: 'purposeful aesthetics',
    shortDescription: 'beauty with intention',
    fullDescription: 'Design aesthetics should serve function, not compete with it. I employ a limited color palette with soft backgrounds and strategic accent colors to create focus. Rather than relying on hard borders or heavy shadows, I use subtle layering, gentle shadows, and rounded corners to create a more approachable, human experience. Animation is used purposefully – micro-interactions provide feedback, smooth transitions maintain context, and subtle motion brings interfaces to life without distraction. This approach creates experiences that feel considered and refined rather than decorated.',
    icon: 'FaPalette',
    visualElement: 'geometry',
    category: 'design',
    keyPoints: [
      'Form follows function',
      'Refined details enhance usability',
      'Cohesive visual language',
      'Strategic use of motion'
    ],
    colorScheme: {
      bg: 'indigo-400',
      text: 'indigo-50'
    }
  },
  {
    id: 'clarity',
    title: 'clarity',
    shortDescription: 'eliminate confusion',
    fullDescription: 'Clear communication is the foundation of good technology. In interfaces, I prioritize legibility, straightforward language, and intuitive visual hierarchies. In code, I write with clear intent, using meaningful names and thoughtful organization. Documentation is embedded in the code itself through descriptive variables, well-named functions, and strategic comments that explain why rather than what. Whether it\'s a UI component or a function, it should express its purpose without ambiguity.',
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
    id: 'content',
    title: 'content-first',
    shortDescription: 'substance over style',
    fullDescription: 'Content is the heart of every experience. I design interfaces that showcase content rather than competing with it – where typography, space, and visual hierarchy work together to elevate the substance rather than the container. Navigation and UI controls are supportive elements that should feel almost invisible when not needed. This principle extends to code structure as well, where the core business logic and data models take precedence over implementation details or framework-specific patterns. The goal is to create experiences where users engage with content directly, not the interface.',
    icon: 'FaAlignLeft',
    visualElement: 'content',
    category: 'design',
    keyPoints: [
      'Let content breathe',
      'Hierarchies that highlight meaning',
      'Invisible infrastructure',
      'Messaging with purpose'
    ],
    colorScheme: {
      bg: 'rose-500',
      text: 'rose-50'
    }
  },
  {
    id: 'open',
    title: 'openness',
    shortDescription: 'transparency builds trust',
    fullDescription: 'Open and transparent approaches build trust and foster collaboration. I write clean, well-documented code that others can easily understand and contribute to. This philosophy extends to embracing open-source technologies and giving back to the developer community. By sharing knowledge and solutions, we collectively elevate quality and create more robust, innovative products. This openness applies equally to design decisions, architectural choices, and implementation details.',
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
    shortDescription: 'optimize resources',
    fullDescription: 'Efficiency means respecting both machine and human resources. I focus on writing performant, optimized solutions that execute quickly and consume minimal system resources. At the same time, development velocity is a competitive advantage in today\'s fast-paced landscape. I embrace AI-assisted development, automation, and streamlined workflows to deliver high-quality results quickly. This approach allows for rapid prototyping and responsive adaptation to changing requirements.',
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
    id: 'intuitive',
    title: 'intuitiveness',
    shortDescription: 'zero learning curve',
    fullDescription: 'The best technology requires no instruction manual. I design systems that users can understand and use immediately, without training or documentation. This approach focuses on leveraging existing mental models, using clear affordances, and providing subtle guidance through the interface itself. Similarly, code should be structured in predictable ways that follow established patterns, making it easier for other developers to understand and contribute without extensive onboarding.',
    icon: 'FaLightbulb',
    visualElement: 'people',
    category: 'core',
    keyPoints: [
      'Align with mental models',
      'Predictable patterns',
      'Progressive disclosure',
      'Contextual guidance'
    ],
    colorScheme: {
      bg: 'yellow-500',
      text: 'yellow-50'
    }
  },
  {
    id: 'reuse',
    title: 'reusability',
    shortDescription: 'write once, use everywhere',
    fullDescription: 'I design with reusability as a core principle, creating components and functions that can be repurposed across multiple contexts. This approach not only saves development time but ensures consistency throughout the application. Reusable code and design elements are modular, well-encapsulated, and follow the single responsibility principle. By thinking about generalization from the start, I create flexible building blocks that can evolve with the application while maintaining backward compatibility.',
    icon: 'FaRecycle',
    visualElement: 'modules',
    category: 'code',
    keyPoints: [
      'Modular architecture',
      'Consistent patterns',
      'Composable components',
      'Encapsulated logic'
    ],
    colorScheme: {
      bg: 'green-600',
      text: 'green-50'
    }
  },
  {
    id: 'users',
    title: 'user-centricity',
    shortDescription: 'people first, technology second',
    fullDescription: 'Technology should enhance human experiences, not complicate them. I approach every project with a deep focus on user needs, preferences, and pain points. This user-centric philosophy informs decisions about features, interfaces, and interactions. By prioritizing accessibility, usability, and meaningful functionality, I create solutions that genuinely improve lives and deliver value. Ultimately, even the most advanced technology is only successful if it serves people effectively.',
    icon: 'FaUsers',
    visualElement: 'people',
    category: 'core',
    keyPoints: [
      'Human-centered design',
      'Solve real problems',
      'Accessible to all',
      'Meaningful value'
    ],
    colorScheme: {
      bg: 'blue-500',
      text: 'blue-50'
    }
  },
  {
    id: 'adaptable',
    title: 'adaptability',
    shortDescription: 'flexible to individual needs',
    fullDescription: 'Each user brings unique preferences, needs, and contexts to their interactions with technology. I believe in designing systems that adapt to individual differences rather than forcing uniformity. This means implementing customization options, responsive designs, and intelligent defaults that respect diverse use cases. By acknowledging and accommodating human variety, we create more inclusive, satisfying, and effective digital experiences that resonate on a personal level.',
    icon: 'FaFingerprint',
    visualElement: 'people',
    category: 'approach',
    keyPoints: [
      'Personalization options',
      'Responsive to context',
      'Inclusive design',
      'Resilient systems'
    ],
    colorScheme: {
      bg: 'violet-500',
      text: 'violet-50'
    }
  },
  {
    id: 'space',
    title: 'breathing room',
    shortDescription: 'space creates clarity',
    fullDescription: 'Generous spacing is essential for creating calm, focused experiences. I use negative space deliberately to separate content, establish hierarchy, and give elements room to breathe. This approach improves readability and comprehension in interfaces and creates a sense of tranquility. In code, this means proper formatting, logical separation of concerns, and appropriate abstraction levels. By resisting the temptation to overcomplicate, I create solutions that feel expansive rather than cramped, reducing cognitive load.',
    icon: 'FaRegSquare',
    visualElement: 'space',
    category: 'design',
    keyPoints: [
      'Strategic white space',
      'Reduced cognitive load',
      'Readable structures',
      'Balanced composition'
    ],
    colorScheme: {
      bg: 'blue-400',
      text: 'blue-50'
    }
  },
  {
    id: 'systematic',
    title: 'systematic thinking',
    shortDescription: 'patterns over instances',
    fullDescription: 'I approach both design and development with systematic thinking, looking for underlying patterns and creating scalable solutions rather than one-off fixes. By establishing clear systems—whether design systems for interfaces or architectural patterns for code—I create foundations that enable consistent, maintainable, and extensible results. These systems aren\'t rigid frameworks but adaptable guidelines that evolve with the product while preserving coherence across the experience.',
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
]; 