import type { MetadataRoute } from 'next';

import type { Blog, Book, Contribution } from '@/lib/types/app.types';

import { getBlogs, getBooks, getContributions } from '@/utils/fetchData';

const BASE_URL = `https://${process.env['VERCEL_PROJECT_PRODUCTION_URL'] ?? ''}`;

function calculatePriority(path: string) {
  const depth = path.split('/').filter(Boolean).length;
  const priority = 1 - depth * 0.1;
  return priority < 0.1 ? 0.1 : Number(priority.toFixed(1));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const nowISO = new Date().toISOString();

  const [blogsData, booksData, contributionsData] = await Promise.all([
    getBlogs(),
    getBooks(),
    getContributions(),
  ]);

  const staticPages: MetadataRoute.Sitemap = ['', 'blogs', 'books', 'contributions'].map(
    (page) => ({
      url: `${BASE_URL}/${page}`,
      lastModified: nowISO,
      priority: calculatePriority(`/${page}`),
      changefreq: 'weekly',
    }),
  );

  const blogs: MetadataRoute.Sitemap = blogsData.map((blog: Blog) => ({
    url: `${BASE_URL}/blogs/${blog.slug}`,
    lastModified: nowISO,
    priority: calculatePriority(`/blogs/${blog.slug}`),
    changefreq: 'weekly',
  }));

  const books: MetadataRoute.Sitemap = booksData.map((book: Book) => ({
    url: `${BASE_URL}/books/${book.slug}`,
    lastModified: nowISO,
    priority: calculatePriority(`/books/${book.slug}`),
    changefreq: 'weekly',
  }));

  const contributions: MetadataRoute.Sitemap = contributionsData.map(
    (contribution: Contribution) => ({
      url: `${BASE_URL}/contributions/${contribution.slug}`,
      lastModified: nowISO,
      priority: calculatePriority(`/contributions/${contribution.slug}`),
      changefreq: 'weekly',
    }),
  );

  return [...staticPages, ...blogs, ...books, ...contributions];
}
