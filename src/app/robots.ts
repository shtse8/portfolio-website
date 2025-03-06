import { MetadataRoute } from 'next';
import { PERSONAL_INFO } from '@/data/personal';

export const dynamic = "force-static";

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