import type { Metadata } from 'next';
import CardView from '@/components/Pages/CardView';
import type { Contribution } from '@/lib/types/app.types';
import { getContributions } from '@/utils/fetchData';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: 'Contributions',
  description:
    'Explore the creative works of Sangita Roy, an author blending imagination and nature in her stories. Browse through her collection of captivating works.',
  alternates: { canonical: 'https://sroyauthor.vercel.app/contributions' },
  openGraph: {
    type: 'website',
    url: 'https://sroyauthor.vercel.app/contributions',
    title: 'Sangita Roy | Contributions',
    description:
      'Explore the creative works of Sangita Roy, an author blending imagination and nature in her stories. Browse through her collection of captivating works.',
    siteName: 'Sangita Roy | Author',
    images: [
      {
        url: 'https://sroyauthor.vercel.app/sp.png',
        width: 1200,
        height: 630,
        alt: 'Sangita Roy | Contributions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sangita Roy | Contributions',
    description:
      'Explore the creative works of Sangita Roy, an author blending imagination and nature in her stories. Browse through her collection of captivating works.',
    images: ['https://sroyauthor.vercel.app/sp.png'],
    creator: '@sangitaroy',
    site: '@sangitaroy',
  },
};

export default async function ContributionsPage() {
  const contributions: Contribution[] = await getContributions();

  return <CardView content={contributions} />;
}
