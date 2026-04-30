import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import ContentView from '@/components/Pages/Content';
import type { Book, ObjectView } from '@/lib/types/app.types';
import { getBookBySlug, getBooks } from '@/utils/fetchData';

export const revalidate = 21600;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  const book = await getBookBySlug(slug);

  if (!book) {
    return {
      title: 'Book Not Found | S.Roy',
      description: 'This book does not exist.',
    };
  }

  const shortDescription = book.description ?? 'Explore this creative book by S.Roy.';

  const url = `https://sroyauthor.vercel.app/books/${book.slug}`;
  const imageUrl =
    (book.coverUrl ?? '') !== '' ? (book.coverUrl ?? '') : 'https://sroyauthor.vercel.app/sp.png';
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
  const booksPage = await getBooks(1);
  const books: Book[] = booksPage.rows;

  return books.map((book) => ({
    slug: book.slug,
  }));
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const book = await getBookBySlug(slug);

  if (!book) {
    return notFound();
  }

  const view: ObjectView = {
    slug: book.slug,
    title: book.title,
    description: book.description,
    image: book.coverUrl ?? '/not-found.svg',
    date: book.createdAt,
    type: 'book',
    isbn: book.isbn ?? undefined,
  };

  return <ContentView content={view} />;
}
