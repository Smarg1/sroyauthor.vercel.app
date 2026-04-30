import type { MetadataRoute } from 'next';

export default async function robots(): Promise<MetadataRoute.Robots> {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://sroyauthor.vercel.app/sitemap.xml',
    host: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  };
}
