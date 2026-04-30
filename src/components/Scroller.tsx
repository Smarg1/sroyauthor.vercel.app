'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useMemo, useRef } from 'react';

import type { ContentItem, ObjectType } from '@/lib/types/app.types';

interface ScrollWrapperProps {
  works: readonly ContentItem[];
}

const TYPE_PATH = {
  book: 'books',
  blog: 'blogs',
  contribution: 'contributions',
} as const satisfies Record<ObjectType, string>;

const EMPTY_WORKS: readonly ContentItem[] = [];

function getHref(type: ObjectType, slug: string): string {
  return `/${TYPE_PATH[type]}/${slug}`;
}

const WorkCard = memo(function WorkCard({
  work,
  priority,
}: {
  work: ContentItem;
  priority: boolean;
}) {
  const imageSrc = work.coverUrl?.trim() || '/not-found.svg';
  const href = getHref(work.type, work.slug);

  return (
    <article className="group h-87.5 w-55 shrink-0 snap-start perspective-distant">
      <div className="relative h-full w-full transform-3d transition-transform duration-500 motion-reduce:transition-none md:group-hover:rotate-y-180">
        <div className="outlined absolute inset-0 overflow-hidden rounded-xl">
          <Image
            src={imageSrc}
            alt={work.title}
            width={220}
            height={350}
            sizes="(max-width:768px) 60vw, 220px"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            className="h-full w-full rounded-xl object-cover"
          />

          <Link
            href={href}
            prefetch
            aria-label={`View ${work.title}`}
            className="absolute inset-0 md:hidden"
          />
        </div>

        <div className="bg-surface-container text-on-surface outlined absolute inset-0 flex rotate-y-180 flex-col justify-between overflow-hidden rounded-xl p-4 backface-hidden">
          <Link href={href} prefetch className="flex h-full flex-col no-underline">
            <h3 className="mb-2 text-center text-lg font-semibold">{work.title}</h3>

            <p className="line-clamp-10 text-justify text-sm leading-relaxed opacity-80">
              {work.description}
            </p>
          </Link>
        </div>
      </div>
    </article>
  );
});

function ScrollWrapper({ works = EMPTY_WORKS }: ScrollWrapperProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasWorks = works.length > 0;

  const scroll = useCallback((direction: -1 | 1) => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const children = container.children;

    if (children.length === 0) {
      return;
    }

    const center = container.scrollLeft + container.clientWidth / 2;

    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (let index = 0; index < children.length; index += 1) {
      const child = children.item(index);

      if (!(child instanceof HTMLElement)) {
        continue;
      }

      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(childCenter - center);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    }

    const targetIndex = Math.max(0, Math.min(children.length - 1, nearestIndex + direction));

    const target = children.item(targetIndex);

    if (!(target instanceof HTMLElement)) {
      return;
    }

    container.scrollTo({
      left: target.offsetLeft,
      behavior: 'smooth',
    });
  }, []);

  const cards = useMemo(() => {
    return works.map((work, index) => (
      <WorkCard key={work.slug} work={work} priority={index < 6} />
    ));
  }, [works]);

  return (
    <section className="relative flex min-h-100 w-full items-center justify-center px-4 content-visibility-auto contain-intrinsic-size-[1px_480px]">
      {hasWorks ? (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => {
            scroll(-1);
          }}
          className="outlined absolute -left-3 z-20 hidden size-11 items-center justify-center rounded-full bg-white p-3 text-black transition-transform duration-300 hover:scale-110 hover:cursor-pointer active:scale-95 md:flex"
        >
          <ArrowLeftIcon className="size-full" />
        </button>
      ) : null}

      <div
        ref={scrollRef}
        className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden max-sm:gap-3"
      >
        {cards}
      </div>

      {hasWorks ? (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => {
            scroll(1);
          }}
          className="outlined absolute -right-3 z-20 hidden size-11 items-center justify-center rounded-full bg-white p-3 text-black transition-transform duration-300 hover:scale-110 hover:cursor-pointer active:scale-95 md:flex"
        >
          <ArrowRightIcon className="size-full" />
        </button>
      ) : null}
    </section>
  );
}

export default memo(ScrollWrapper);
