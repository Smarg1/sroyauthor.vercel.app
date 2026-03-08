import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import type { Book } from '@/lib/types/app.types';

import ContentView from '@/components/Pages/Content';
import { getBookBySlug, getBooks } from '@/utils/fetchData';

export const revalidate = 1800;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const book: Book | null = await getBookBySlug(slug);

  if (!book) {
    return {
      title: 'Book Not Found | S.Roy',
      description: 'This book does not exist.',
    };
  }

  const shortDescription = book.description ?? 'Explore this creative book by S.Roy.';

  const url = `https://sroyauthor.vercel.app/books/${book.slug}`;
  const imageUrl =
    book.image !== '' ? book.image : 'https://sroyauthor.vercel.app/sp.png';
  return {
    title: `${book.title} | S.Roy Books`,
    description: shortDescription,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: `${book.title} | S.Roy Books`,
      description: shortDescription,
      siteName: 'S.Roy | Author',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${book.title} | S.Roy Books`,
      description: shortDescription,
      images: [imageUrl],
      creator: '@sangitaroy',
      site: '@sangitaroy',
    },
  };
}

export async function generateStaticParams() {
  const books: Book[] = await getBooks();

  return books.map((book) => ({
    slug: book.slug,
  }));
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const book: Book | null = await getBookBySlug(slug);

  if (!book) return notFound();

  return <ContentView content={book} />;
}
