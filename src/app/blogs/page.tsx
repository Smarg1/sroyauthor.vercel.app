import type { Metadata } from 'next';
import CardView from '@/components/Pages/CardView';
import type { Blog } from '@/lib/types/app.types';
import { getBlogs } from '@/utils/fetchData';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: 'Blogs',
  description:
    "Discover the enchanting world of Sangita Roy's blogs, blending nature and imagination through captivating fiction and stories.",
  alternates: { canonical: 'https://sroyauthor.vercel.app/blogs' },
  openGraph: {
    type: 'website',
    url: 'https://sroyauthor.vercel.app/blogs',
    title: 'Sangita Roy | Blogs',
    description:
      "Discover the enchanting world of Sangita Roy's blogs, blending nature and imagination through captivating fiction and stories.",
    siteName: 'Sangita Roy | Author',
    images: [
      {
        url: 'https://sroyauthor.vercel.app/sp.png',
        width: 1200,
        height: 630,
        alt: 'Sangita Roy | Blogs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sangita Roy | Blogs',
    description:
      "Discover the enchanting world of Sangita Roy's blogs, blending nature and imagination through captivating fiction and stories.",
    images: ['https://sroyauthor.vercel.app/sp.png'],
    creator: '@sangitaroy',
    site: '@sangitaroy',
  },
};

export default async function BlogsPage() {
  const blogs: Blog[] = await getBlogs();

  return <CardView content={blogs} />;
}
