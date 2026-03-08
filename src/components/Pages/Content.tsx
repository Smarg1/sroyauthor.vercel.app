import Image from 'next/image';

import type { ObjectView } from '@/lib/types/app.types';

import Heading from '@/components/Heading';

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

  const hasISBN =
    isBook && typeof content.isbn === 'string' && content.isbn.trim() !== '';

  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-12">
      <header className="mb-10">
        <Heading text={content.title} />
      </header>

      <section className="flex flex-col gap-12 lg:flex-row lg:items-start">
        <figure className="flex w-full justify-center lg:w-1/2 lg:justify-start">
          <div className="w-full max-w-xs transition-transform duration-300 hover:scale-105 sm:max-w-sm lg:max-w-md">
            <Image
              src={imageSrc}
              alt={content.title}
              width={800}
              height={1200}
              sizes="(max-width:1024px) 100vw, 40vw"
              className="h-auto w-full rounded-4xl object-contain shadow-lg"
              priority
            />
          </div>
        </figure>

        <div className="text-on-surface w-full space-y-6 text-base leading-loose sm:text-lg lg:w-1/2">
          <div className="prose sm:prose-lg text-on-surface max-w-none text-justify wrap-break-word max-sm:leading-relaxed">
            {content.description}
          </div>

          {hasISBN || publishedDate !== null ? (
            <dl className="space-y-1 text-sm opacity-80">
              {hasISBN ? (
                <div>
                  <dt className="inline font-semibold">ISBN: </dt>
                  <dd className="inline break-all">{content.isbn}</dd>
                </div>
              ) : null}
              {publishedDate !== null ? (
                <div>
                  <dt className="inline font-semibold">Published: </dt>
                  <dd className="inline">{publishedDate}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </div>
      </section>
    </article>
  );
}
