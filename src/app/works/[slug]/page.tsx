import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import styles from '@/styles/works.module.css';
import type { Work } from '@/utils/fetchData';
import { getSlug, getWorks } from '@/utils/fetchData';
import { slugify } from '@/utils/Slugify';


export const revalidate = 600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const work: Work | null = await getSlug<Work>(slug, 'works');

  if (!work) {
    return {
      title: 'Work Not Found | S.Roy',
      description: 'This work does not exist.',
    };
  }

  const shortDescription = work.description
    ? work.description.split('\n').slice(0, 3).join(' ').slice(0, 160)
    : 'Explore this creative work by S.Roy.';

  const workSlug = slugify(work.name);

  return {
    title: `${work.name} | S.Roy Works`,
    description: shortDescription,
    alternates: {
      canonical: `https://sroyauthor.vercel.app/works/${workSlug}`,
    },
    openGraph: {
      type: 'article',
      url: `https://sroyauthor.vercel.app/works/${workSlug}`,
      title: `${work.name} | S.Roy Works`,
      description: shortDescription,
      siteName: 'S.Roy | Author',
      images: work.image
        ? Array.isArray(work.image)
          ? work.image.map((img) => ({ url: img, width: 1200, height: 630 }))
          : [{ url: work.image, width: 1200, height: 630 }]
        : [{ url: 'https://sroyauthor.vercel.app/sp.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${work.name} | S.Roy Works`,
      description: shortDescription,
      images: work.image
        ? Array.isArray(work.image)
          ? work.image
          : [work.image]
        : ['https://sroyauthor.vercel.app/sp.png'],
      creator: '@sangitaroy',
      site: '@sangitaroy',
    },
  };
}

export async function generateStaticParams() {
  const works: Work[] = await getWorks();
  return works.map((work) => ({
    slug: slugify(work.name),
  }));
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;

  const work: Work | null = await getSlug<Work>(slug, 'works');

  if (!work) return notFound();

  const images: string[] = Array.isArray(work.image)
    ? work.image
    : work.image
      ? [work.image]
      : [];

  return (
    <div className={styles.works_container}>
      <h1 className={styles.works_title}>{work.name}</h1>

      <div className={styles.works_content}>
        <p className={styles.works_description}>{work.description}</p>

        {images.length > 0 && (
          <div className={styles.works_images}>
            {images.map((src, i) => (
              <div key={i} className={styles.works_imageWrapper}>
                <Image
                  src={src || '/not-found.svg'}
                  alt={`${work.name} - ${i + 1}`}
                  width={400}
                  height={600}
                  className={styles.works_images}
                  crossOrigin="anonymous"
                  priority
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
