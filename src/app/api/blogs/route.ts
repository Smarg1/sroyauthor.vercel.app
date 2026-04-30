import { NextResponse } from 'next/server';
import type { ObjectView } from '@/lib/types/app.types';
import { getBlogs } from '@/utils/fetchData';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') ?? '1') || 1;

  const blogsPage = await getBlogs(page);

  const rows: ObjectView[] = blogsPage.rows.map((b) => ({
    slug: b.slug,
    title: b.title,
    description: b.description,
    image: b.coverUrl ?? '/not-found.svg',
    date: b.createdAt,
    type: 'blog',
  }));

  return NextResponse.json({
    rows,
    page: blogsPage.page,
    pageSize: blogsPage.pageSize,
    total: blogsPage.total,
    totalPages: blogsPage.totalPages,
    hasNext: blogsPage.hasNext,
    hasPrev: blogsPage.hasPrev,
  });
}
