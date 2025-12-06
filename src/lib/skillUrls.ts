/**
 * Mapping of skill IDs to their official documentation/website URLs
 */
export const SKILL_URLS: Record<string, string> = {
  // Frontend
  'react': 'https://react.dev',
  'typescript': 'https://www.typescriptlang.org',
  'javascript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  'nextjs': 'https://nextjs.org',
  'vuejs': 'https://vuejs.org',
  'svelte': 'https://svelte.dev',
  'tailwindcss': 'https://tailwindcss.com',
  'html': 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  'css': 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  'framer-motion': 'https://www.framer.com/motion',
  'sass': 'https://sass-lang.com',
  'styled-components': 'https://styled-components.com',

  // Backend
  'nodejs': 'https://nodejs.org',
  'python': 'https://www.python.org',
  'java': 'https://www.java.com',
  'go': 'https://go.dev',
  'php': 'https://www.php.net',
  'csharp': 'https://docs.microsoft.com/en-us/dotnet/csharp',
  'nestjs': 'https://nestjs.com',
  'bun': 'https://bun.sh',
  'redis': 'https://redis.io',
  'firebase': 'https://firebase.google.com',
  'firestore': 'https://firebase.google.com/docs/firestore',

  // Databases
  'mysql': 'https://www.mysql.com',
  'sqlite': 'https://www.sqlite.org',
  'sql': 'https://www.w3schools.com/sql',

  // DevOps
  'docker': 'https://www.docker.com',
  'kubernetes': 'https://kubernetes.io',
  'gcp': 'https://cloud.google.com',
  'github-actions': 'https://docs.github.com/en/actions',

  // AI/ML
  'pytorch': 'https://pytorch.org',
  'tensorflow': 'https://www.tensorflow.org',
  'openai': 'https://openai.com',

  // Game Dev
  'unity3d': 'https://unity.com',
  'cocos2d': 'https://www.cocos.com',
  'lua': 'https://www.lua.org',

  // Mobile
  'flutter': 'https://flutter.dev',
  'dart': 'https://dart.dev',

  // Blockchain
  'solidity': 'https://soliditylang.org',

  // Tools
  'ffmpeg': 'https://ffmpeg.org',

  // Protocols
  'protobuf': 'https://protobuf.dev',
  'socket-io': 'https://socket.io',
};

/**
 * Get the URL for a skill, returns undefined if not found
 */
export function getSkillUrl(skillId: string): string | undefined {
  return SKILL_URLS[skillId];
}
