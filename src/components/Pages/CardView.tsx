'use client';

import { CheckIcon } from '@heroicons/react/24/outline';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Heading from '@/components/Heading';
import type { ObjectTypeEnum, ObjectView, PaginationResult } from '@/lib/types/app.types';
import Card from '../Card';
import { FadeIn } from '../Misc/FadeIn';

interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface CardViewProps {
  content?: ObjectView[];
  title?: null | string;
  pagination?: PaginationMeta | null;
  onLoadMore?: (nextPage: number) => Promise<PaginationResult<ObjectView> | undefined>;
}

const EMPTY_CONTENT: ObjectView[] = [];

const TYPE_PATH: Record<ObjectTypeEnum, string> = {
  book: 'books',
  blog: 'blogs',
  contribution: 'contributions',
};

function getHeading(title?: null | string, fallbackType?: ObjectTypeEnum): string {
  const raw = title?.trim() || fallbackType || 'Content';

  if (raw.length === 0) {
    return 'Content';
  }

  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

const CardItem = memo(function CardItem({ item }: { item: ObjectView }) {
  const href = `/${TYPE_PATH[item.type]}/${item.slug}`;
  const imageSrc = item.image?.trim() || '/not-found.svg';
  const isbn = item.type === 'book' && item.isbn?.trim() ? item.isbn.trim() : undefined;

  return (
    <Card
      href={href}
      imageSrc={imageSrc}
      imageAlt={item.title}
      date={item.date ?? ''}
      title={item.title}
      description={item.description ?? ''}
      {...(isbn ? { isbn } : {})}
    />
  );
});

const MAX_ITEMS = 200;
const ROOT_MARGIN = '400px';

function SkeletonCard({ compact = false }: { compact?: boolean }) {
  return (
    <article
      className={
        compact
          ? 'h-72 w-64 shrink-0 rounded-3xl bg-primary/40 p-4'
          : 'h-87.5 w-55 shrink-0 rounded-3xl bg-primary/40 p-4'
      }
    >
      <div className="h-40 w-full rounded-lg bg-surface/30 animate-pulse" />
      <div className="mt-4 h-4 w-3/4 rounded bg-surface/30 animate-pulse" />
      <div className="mt-2 h-3 w-1/2 rounded bg-surface/20 animate-pulse" />
      <div className="mt-4 h-3 w-full rounded bg-surface/10" />
    </article>
  );
}

export default function CardView({
  content = EMPTY_CONTENT,
  title,
  pagination = null,
  onLoadMore,
}: CardViewProps) {
  const heading = useMemo(() => getHeading(title, content[0]?.type), [title, content]);

  const isInfinite = pagination !== null;

  const [items, setItems] = useState<ObjectView[]>(content ?? []);
  const [page, setPage] = useState<number>(pagination?.page ?? 1);
  const [hasNext, setHasNext] = useState<boolean>(pagination?.hasNext ?? false);
  const [loading, setLoading] = useState<boolean>(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // sync when parent updates props
  useEffect(() => {
    setItems(content ?? []);
  }, [content]);

  useEffect(() => {
    setPage(pagination?.page ?? 1);
    setHasNext(pagination?.hasNext ?? false);
  }, [pagination]);

  const loadMore = useCallback(
    async (nextPage: number) => {
      if (!isInfinite) {
        return;
      }

      if (!hasNext) {
        return;
      }

      if (loading) {
        return;
      }

      if (!onLoadMore) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const json = (await onLoadMore(nextPage)) as PaginationResult<ObjectView> | undefined;

        if (json && Array.isArray(json.rows)) {
          setItems((prev) => {
            const merged = [...prev, ...(json.rows ?? [])];
            if (merged.length > MAX_ITEMS) {
              return merged.slice(merged.length - MAX_ITEMS);
            }
            return merged;
          });

          setPage(json.page);
          setHasNext(json.hasNext);
        }
      } finally {
        setLoading(false);
      }
    },
    [hasNext, isInfinite, loading, onLoadMore],
  );

  useEffect(() => {
    if (!isInfinite) {
      return;
    }

    const node = sentinelRef.current;
    if (!node) {
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && hasNext && !loading && typeof onLoadMore === 'function') {
            void loadMore(page + 1);
          }
        }
      },
      { rootMargin: ROOT_MARGIN },
    );

    obs.observe(node);

    return () => {
      obs.disconnect();
    };
  }, [loadMore, onLoadMore, hasNext, isInfinite, loading, page]);

  const cards = useMemo(
    () => items.map((item) => <CardItem key={item.slug} item={item} />),
    [items],
  );

  const isEmpty = items.length === 0;
  const showLoading = loading;
  const showNoMore = !hasNext ? !loading : false;

  return (
    <section className="content-visibility-auto contain-intrinsic-size-[1px_1200px]">
      <FadeIn>
        <Heading text={`${heading}s`} />
      </FadeIn>

      {isEmpty ? (
        <p className="text-center font-sans">You are all caught up!</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center-safe justify-center gap-6">{cards}</div>

          {isInfinite ? <div ref={sentinelRef} /> : null}

          <div className="mt-6 text-center">
            {showLoading ? (
              <div className="mt-6 flex items-center justify-center gap-6">
                <SkeletonCard compact />
                <SkeletonCard compact />
                <SkeletonCard compact />
              </div>
            ) : null}

            {showNoMore ? (
              <div className="mt-8 flex items-center justify-center gap-3 opacity-80">
                <CheckIcon className="h-6 w-6 text-on-surface/70" aria-hidden="true" />
              </div>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}
