import { MetadataRoute } from 'next';
import { PERSONAL_INFO } from '@/data/personal';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: `${PERSONAL_INFO.portfolioUrl}/sitemap.xml`,
  };
} 