import { MetadataRoute } from 'next';
import { PERSONAL_INFO } from '@/data/personal';

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName} Portfolio`,
    short_name: `${PERSONAL_INFO.firstName} ${PERSONAL_INFO.lastName}`,
    description: 'Professional portfolio showcasing full-stack development expertise and projects',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/og-icon-temp.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      }
    ],
  };
} 