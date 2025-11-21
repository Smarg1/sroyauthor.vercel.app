import type { Metadata } from 'next';

import Card from '@/components/Card/Card';
import Heading from '@/components/Heading/Heading';
import styles from '@/styles/norm.module.css';
import { getBlogs } from '@/utils/fetchData';
import type { Blog } from '@/utils/fetchData';
import { slugify } from '@/utils/Slugify';


export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Sangita Roy | Blogs',
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
      { url: 'https://sroyauthor.vercel.app/sp.png', width: 1200, height: 630, alt: 'Sangita Roy | Blogs' },
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

  if (!blogs || blogs.length === 0) {
    return (
      <div className={styles.heading}>
        <Heading text="Blogs" />
        <p className={styles.caught_up}>You are all caught up!</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.heading}>
        <Heading text="Blogs" />
      </div>
      <div className={styles.container}>
        {blogs.map((blog) => {
          const slug = slugify(blog.name);

          const imageSrc = Array.isArray(blog.image) ? blog.image[0] ?? '/not-found.svg' : blog.image ?? '/not-found.svg';

          return (
            <Card
              key={blog.id}
              href={`/blogs/${slug}`}
              imageSrc={imageSrc}
              imageAlt={blog.name}
              title={blog.name}
              description={blog.description}
            />
          );
        })}
      </div>
    </>
  );
}
