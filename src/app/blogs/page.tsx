import type { Metadata } from 'next';
import ClientInfinite from '@/components/Pages/ClientInfinite';
import type { Blog, PaginationResult } from '@/lib/types/app.types';
import { getBlogs } from '@/utils/fetchData';

export const revalidate = 21600;

export const metadata: Metadata = {
  title: 'Blogs',
  description:
    "Discover the enchanting world of Sangita Roy's blogs, blending nature and imagination through captivating fiction and stories.",
  alternates: { canonical: 'https://sroyauthor.vercel.app/blogs' },
  openGraph: {
    type: 'website',
    url: 'https://sroyauthor.vercel.app/blogs',
    title: 'Sangita Roy | Blogs',
    description:
      "Discover the enchanting world of Sangita Roy's blogs, blending nature and imagination through captivating fiction and stories.",
    siteName: 'Sangita Roy | Author',
    images: [
      {
        url: 'https://sroyauthor.vercel.app/sp.png',
        width: 1200,
        height: 630,
        alt: 'Sangita Roy | Blogs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sangita Roy | Blogs',
    description:
      "Discover the enchanting world of Sangita Roy's blogs, blending nature and imagination through captivating fiction and stories.",
    images: ['https://sroyauthor.vercel.app/sp.png'],
    creator: '@sangitaroy',
    site: '@sangitaroy',
  },
};

export default async function BlogsPage({ searchParams }: { searchParams?: { page?: string } }) {
  const page = Number(searchParams?.page ?? '1') || 1;

  const blogsPage: PaginationResult<Blog> = await getBlogs(page);

  const content: ObjectView[] = blogsPage.rows.map((b) => ({
    slug: b.slug,
    title: b.title,
    description: b.description,
    image: b.coverUrl ?? '/not-found.svg',
    date: b.createdAt,
    type: 'blog' as const,
  }));

  const pagination = {
    rows: content,
    page: blogsPage.page,
    pageSize: blogsPage.pageSize,
    total: blogsPage.total,
    totalPages: blogsPage.totalPages,
    hasNext: blogsPage.hasNext,
    hasPrev: blogsPage.hasPrev,
  };

  return <ClientInfinite initialContent={content} initialPagination={pagination} endpoint="/api/blogs" />;
}
