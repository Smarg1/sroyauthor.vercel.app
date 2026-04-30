import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import ContentView from '@/components/Pages/Content';
import type { Contribution, ObjectView } from '@/lib/types/app.types';
import { getContributionBySlug, getContributions } from '@/utils/fetchData';

export const revalidate = 21600;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  const contrib = await getContributionBySlug(slug);

  if (!contrib) {
    return {
      title: 'Contribution Not Found | S.Roy',
      description: 'This contribution does not exist.',
    };
  }

  const shortDescription = contrib.description ?? 'Explore this creative contribution by S.Roy.';

  const url = `https://sroyauthor.vercel.app/contributions/${contrib.slug}`;
  const imageUrl =
    (contrib.coverUrl ?? '') !== ''
      ? (contrib.coverUrl ?? '')
      : 'https://sroyauthor.vercel.app/sp.png';

  return {
    title: `${contrib.title} | S.Roy Contributions`,
    description: shortDescription,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: `${contrib.title} | S.Roy Contributions`,
      description: shortDescription,
      siteName: 'S.Roy | Author',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${contrib.title} | S.Roy Contributions`,
      description: shortDescription,
      images: [imageUrl],
      creator: '@sangitaroy',
      site: '@sangitaroy',
    },
  };
}

export async function generateStaticParams() {
  const contributionsPage = await getContributions(1);
  const contributions: Contribution[] = contributionsPage.rows;

  return contributions.map((contrib) => ({
    slug: contrib.slug,
  }));
}

export default async function Page({ params }: Props) {
  const { slug } = params;

  const contrib: Contribution | null = await getContributionBySlug(slug);

  if (!contrib) {
    return notFound();
  }

  const view: ObjectView = {
    slug: contrib.slug,
    title: contrib.title,
    description: contrib.description,
    image: contrib.coverUrl ?? '/not-found.svg',
    date: contrib.createdAt,
    type: 'contribution',
  };

  return <ContentView content={view} />;
}
