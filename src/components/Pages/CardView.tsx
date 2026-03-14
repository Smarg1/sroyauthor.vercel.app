import type { ObjectView } from '@/lib/types/app.types';

import Heading from '@/components/Heading';

import Card from '../Card';
import { FadeIn } from '../Misc/FadeIn';

interface CardViewProps {
  content?: ObjectView[];
  title?: null | string;
}

const EMPTY_CONTENT: ObjectView[] = [];

export default function CardView({ content = EMPTY_CONTENT, title }: CardViewProps) {
  const isEmpty = content.length === 0;

  const raw: string = title?.trim() ?? content[0]?.type.trim() ?? 'Content';

  const headingText =
    raw.length > 0 ? raw.charAt(0).toUpperCase() + raw.slice(1) : 'Content';

  return (
    <section>
      <FadeIn>
        <Heading text={headingText} />
      </FadeIn>

      {isEmpty ? (
        <p className="text-center font-sans">You are all caught up!</p>
      ) : (
        <div className="flex flex-wrap items-center-safe justify-center gap-6">
          {content.map((item) => {
            const imageSrc = (item.image ?? '/not-found.svg').trim();

            return (
              <Card
                key={item.slug}
                href={`/${item.type}/${item.slug}`}
                imageSrc={imageSrc}
                imageAlt={item.title}
                date={item.date}
                title={item.title}
                description={item.description ?? ''}
                {...(item.type === 'books' && item.isbn.trim() !== ''
                  ? { isbn: item.isbn }
                  : {})}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
