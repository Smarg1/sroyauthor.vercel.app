import type { Metadata } from 'next';
import CardView from '@/components/Pages/CardView';
import type { Book } from '@/lib/types/app.types';
import { getBooks } from '@/utils/fetchData';

export const revalidate = 1800;

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

export default async function BooksPage() {
  const books: Book[] = await getBooks();

  return <CardView content={books} />;
}
