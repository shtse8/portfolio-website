import { MetadataRoute } from 'next';
import { PERSONAL_INFO } from '@/data/personal';

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = PERSONAL_INFO.portfolioUrl;

  // Define your pages here
  const routes = ['', '/projects', '/resume', '/contact'].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
} 