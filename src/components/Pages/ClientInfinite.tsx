'use client';

import { useCallback } from 'react';
import type { ObjectView, PaginationResult } from '@/lib/types/app.types';
import CardView from './CardView';

interface Props {
  initialContent: ObjectView[];
  initialPagination: PaginationResult<ObjectView>;
  endpoint: string;
}

export default function ClientInfinite({ initialContent, initialPagination, endpoint }: Props) {
  const onLoadMore = useCallback(
    async (nextPage: number) => {
      const res = await fetch(`${endpoint}?page=${nextPage}`, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('fetch_failed');
      }

      const json = (await res.json()) as PaginationResult<ObjectView>;
      return json;
    },
    [endpoint],
  );

  return (
    <CardView content={initialContent} pagination={initialPagination} onLoadMore={onLoadMore} />
  );
}
