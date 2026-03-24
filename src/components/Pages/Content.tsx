import Image from 'next/image';
import Heading from '@/components/Heading';
import type { ObjectView } from '@/lib/types/app.types';

import { FadeIn } from '../Misc/FadeIn';

interface Props {
  content: ObjectView;
}

export default function ContentView({ content }: Props) {
  const imageSrc = (content.image ?? '/not-found.svg').trimEnd();
  const isBook = 'isbn' in content;

  const hasDate = content.date !== '';
  const publishedDate = hasDate
    ? new Date(content.date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const hasISBN = isBook && typeof content.isbn === 'string' && content.isbn.trim() !== '';

  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-12">
      <FadeIn>
        <header className="mb-10">
          <Heading text={content.title} />
        </header>
      </FadeIn>

      <section className="flex flex-col items-center justify-center gap-12 lg:flex-row lg:items-center lg:justify-center">
        {/* IMAGE */}
        <FadeIn>
          <div className="items-center hover:scale-105 transition-transform ease-in-out">
            <Image
              src={imageSrc}
              alt={content.title}
              width={1200}
              height={1800}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 420px"
              className="sm:max-w-md object-contain rounded-4xl"
              priority
            />
          </div>
        </FadeIn>
        <FadeIn>
          <div className="flex-1  space-y-6 text-base sm:text-lg leading-loose">
            <div className="prose leading-loose sm:prose-lg max-w-full text-on-surface text-justify wrap-break-word">
              {content.description}
            </div>

            {(hasISBN || publishedDate !== null) && (
              <dl className="space-y-1 text-sm opacity-80">
                {hasISBN && (
                  <div>
                    <dt className="inline font-semibold">ISBN: </dt>
                    <dd className="inline break-all">{content.isbn}</dd>
                  </div>
                )}

                {publishedDate !== null && (
                  <div>
                    <dt className="inline font-semibold">Published: </dt>
                    <dd className="inline">{publishedDate}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </FadeIn>
      </section>
    </article>
  );
}
