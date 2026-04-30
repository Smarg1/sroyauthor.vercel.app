import type { Metadata } from 'next';
import ClientInfinite from '@/components/Pages/ClientInfinite';
import type { Book, ObjectView, PaginationResult } from '@/lib/types/app.types';
import { getBooks } from '@/utils/fetchData';

export const revalidate = 21600;

export const metadata: Metadata = {
  title: 'Books',
  description:
    'Explore the creative works of Sangita Roy, an author blending imagination and nature in her stories. Browse through her collection of captivating works.',
  alternates: { canonical: 'https://sroyauthor.vercel.app/books' },
  openGraph: {
    type: 'website',
    url: 'https://sroyauthor.vercel.app/books',
    title: 'Sangita Roy | Books',
    description:
      'Explore the creative works of Sangita Roy, an author blending imagination and nature in her stories. Browse through her collection of captivating works.',
    siteName: 'Sangita Roy | Author',
    images: [
      {
        url: 'https://sroyauthor.vercel.app/sp.png',
        width: 1200,
        height: 630,
        alt: 'Sangita Roy | Books',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sangita Roy | Books',
    description:
      'Explore the creative works of Sangita Roy, an author blending imagination and nature in her stories. Browse through her collection of captivating works.',
    images: ['https://sroyauthor.vercel.app/sp.png'],
    creator: '@sangitaroy',
    site: '@sangitaroy',
  },
};

export default async function BooksPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params?.page ?? '1') || 1;

  const booksPage: PaginationResult<Book> = await getBooks(page);

  const content: ObjectView[] = booksPage.rows.map((b) => ({
    slug: b.slug,
    title: b.title,
    description: b.description,
    image: b.coverUrl ?? '/not-found.svg',
    date: b.createdAt,
    type: 'book' as const,
    isbn: b.isbn ?? undefined,
  }));

  const pagination = {
    rows: content,
    page: booksPage.page,
    pageSize: booksPage.pageSize,
    total: booksPage.total,
    totalPages: booksPage.totalPages,
    hasNext: booksPage.hasNext,
    hasPrev: booksPage.hasPrev,
  };

  return (
    <ClientInfinite initialContent={content} initialPagination={pagination} endpoint="/api/books" />
  );
}
