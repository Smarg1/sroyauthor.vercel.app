import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://sroyauthor.vercel.app/sitemap.xml',
    host: process.env['VERCEL_PROJECT_PRODUCTION_URL'],
  };
}
