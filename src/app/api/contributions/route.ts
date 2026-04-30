import { NextResponse } from 'next/server';
import type { ObjectView } from '@/lib/types/app.types';
import { getContributions } from '@/utils/fetchData';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') ?? '1') || 1;

  const contributionsPage = await getContributions(page);

  const rows: ObjectView[] = contributionsPage.rows.map((c) => ({
    slug: c.slug,
    title: c.title,
    description: c.description,
    image: c.coverUrl ?? '/not-found.svg',
    date: c.createdAt,
    type: 'contribution',
  }));

  return NextResponse.json({
    rows,
    page: contributionsPage.page,
    pageSize: contributionsPage.pageSize,
    total: contributionsPage.total,
    totalPages: contributionsPage.totalPages,
    hasNext: contributionsPage.hasNext,
    hasPrev: contributionsPage.hasPrev,
  });
}
