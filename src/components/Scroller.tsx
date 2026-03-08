'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import type { ObjectView } from '@/lib/types/app.types';

interface ScrollWrapperProps {
  works: ObjectView[];
}

export default function ScrollWrapper({ works }: ScrollWrapperProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;

    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) return;

    const scrollLeft = el.scrollLeft;

    const currentIndex = children.findIndex(
      (child) => child.offsetLeft >= scrollLeft - 1 && child.offsetLeft <= scrollLeft + 1,
    );

    const baseIndex = currentIndex === -1 ? 0 : currentIndex;

    const nextIndex = Math.max(0, Math.min(children.length - 1, baseIndex + dir));

    const target = children[nextIndex];
    if (!target) return;

    el.scrollTo({
      left: target.offsetLeft,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative flex min-h-100 w-full items-center justify-center px-4">
      {/* Left Arrow */}
      {works.length > 0 ? (
        <button
          onClick={() => {
            scroll(-1);
          }}
          className="outlined absolute -left-3 z-20 hidden size-11 items-center justify-center rounded-full bg-white p-3 text-black transition-transform duration-300 hover:scale-110 md:flex"
        >
          <ArrowLeftIcon className="h-full w-full" />
        </button>
      ) : null}

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth py-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] max-sm:gap-3"
      >
        {works.map((work, index) => {
          const imageSrc = (work.image ?? '/not-found.svg').trimEnd();

          return (
            <div
              key={work.slug}
              className="group h-87.5 w-55 shrink-0 snap-start perspective-distant"
            >
              <div className="relative h-full w-full transition-transform duration-500 transform-3d group-hover:rotate-y-180 motion-reduce:transition-none">
                {/* Front */}
                <div className="outlined absolute inset-0 overflow-hidden rounded-xl">
                  <Image
                    src={imageSrc}
                    alt={work.title}
                    width={220}
                    height={350}
                    sizes="(max-width: 768px) 60vw, 220px"
                    className="h-full w-full rounded-xl object-cover"
                    priority={index <= 5}
                    loading={index <= 5 ? 'eager' : 'lazy'}
                  />
                </div>

                {/* Back */}
                <div className="bg-surface-container text-on-surface outlined absolute inset-0 flex rotate-y-180 flex-col justify-between overflow-hidden rounded-xl p-4 backface-hidden">
                  <Link
                    href={`/${work.type}/${work.slug}`}
                    className="flex h-full flex-col no-underline"
                  >
                    <h3 className="mb-2 text-center text-lg font-semibold">
                      {work.title}
                    </h3>

                    <p className="line-clamp-10 text-justify text-sm leading-relaxed opacity-80">
                      {work.description}
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Arrow */}
      {works.length > 0 ? (
        <button
          onClick={() => {
            scroll(1);
          }}
          className="outlined absolute -right-3 z-20 hidden size-11 items-center justify-center rounded-full bg-white p-3 text-black transition-transform duration-300 hover:scale-110 md:flex"
        >
          <ArrowRightIcon className="h-full w-full" />
        </button>
      ) : null}
    </div>
  );
}
