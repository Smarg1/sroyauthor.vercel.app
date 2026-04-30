import type { Metadata } from 'next';
import ClientInfinite from '@/components/Pages/ClientInfinite';
import type { Contribution, ObjectView, PaginationResult } from '@/lib/types/app.types';
import { getContributions } from '@/utils/fetchData';

export const revalidate = 21600;

export const metadata: Metadata = {
  title: 'Contributions',
  description:
    'Explore the creative works of Sangita Roy, an author blending imagination and nature in her stories. Browse through her collection of captivating works.',
  alternates: { canonical: 'https://sroyauthor.vercel.app/contributions' },
  openGraph: {
    type: 'website',
    url: 'https://sroyauthor.vercel.app/contributions',
    title: 'Sangita Roy | Contributions',
    description:
      'Explore the creative works of Sangita Roy, an author blending imagination and nature in her stories. Browse through her collection of captivating works.',
    siteName: 'Sangita Roy | Author',
    images: [
      {
        url: 'https://sroyauthor.vercel.app/sp.png',
        width: 1200,
        height: 630,
        alt: 'Sangita Roy | Contributions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sangita Roy | Contributions',
    description:
      'Explore the creative works of Sangita Roy, an author blending imagination and nature in her stories. Browse through her collection of captivating works.',
    images: ['https://sroyauthor.vercel.app/sp.png'],
    creator: '@sangitaroy',
    site: '@sangitaroy',
  },
};

export default async function ContributionsPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const page = Number(searchParams?.page ?? '1') || 1;

  const contributionsPage: PaginationResult<Contribution> = await getContributions(page);

  const content: ObjectView[] = contributionsPage.rows.map((c) => ({
    slug: c.slug,
    title: c.title,
    description: c.description,
    image: c.coverUrl ?? '/not-found.svg',
    date: c.createdAt,
    type: 'contribution' as const,
  }));

  const pagination = {
    rows: content,
    page: contributionsPage.page,
    pageSize: contributionsPage.pageSize,
    total: contributionsPage.total,
    totalPages: contributionsPage.totalPages,
    hasNext: contributionsPage.hasNext,
    hasPrev: contributionsPage.hasPrev,
  };

  return <ClientInfinite initialContent={content} initialPagination={pagination} endpoint="/api/contributions" />;
}
