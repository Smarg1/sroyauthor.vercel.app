import { NextResponse } from 'next/server';
import type { ObjectView } from '@/lib/types/app.types';
import { getBooks } from '@/utils/fetchData';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') ?? '1') || 1;

  const booksPage = await getBooks(page);

  const rows: ObjectView[] = booksPage.rows.map((b) => ({
    slug: b.slug,
    title: b.title,
    description: b.description,
    image: b.coverUrl ?? '/not-found.svg',
    date: b.createdAt,
    type: 'book',
    isbn: b.isbn ?? undefined,
  }));

  return NextResponse.json({
    rows,
    page: booksPage.page,
    pageSize: booksPage.pageSize,
    total: booksPage.total,
    totalPages: booksPage.totalPages,
    hasNext: booksPage.hasNext,
    hasPrev: booksPage.hasPrev,
  });
}
