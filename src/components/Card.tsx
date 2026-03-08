import Image from 'next/image';
import Link from 'next/link';

import { FadeIn } from './Misc/FadeIn';

interface CardProps {
  date: string;
  description: string;
  href: string;
  imageAlt: string;
  imageSrc: string;
  isbn?: string;
  title: string;
}

export default function Card({
  href,
  imageSrc,
  imageAlt,
  title,
  description,
  date,
  isbn,
}: CardProps) {
  return (
    <FadeIn delay={200}>
      <Link
        href={href}
        className="bg-primary outlined flex aspect-3/4 w-88 flex-col overflow-hidden rounded-3xl font-sans transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl max-[375px]:w-66 sm:w-100 md:aspect-square lg:w-125"
      >
        <div className="relative h-58 w-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 90vw, 400px"
            className="bg-surface object-contain transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="text-on-primary line-clamp-2 text-xl font-semibold tracking-tight">
            {title}
          </h3>
          <p className="text-on-primary/65 line-clamp-3 flex-1 text-sm leading-relaxed">
            {description}
          </p>
          <div className="text-muted flex border-t pt-4 text-xs">
            {typeof isbn === 'string' && isbn.length > 0 ? <p>ISBN: {isbn}</p> : null}
            <p className="flex-1 text-right">{date}</p>
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}
