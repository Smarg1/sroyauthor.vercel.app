import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import styles from '@/styles/blogs.module.css';
import type { Blog } from '@/utils/fetchData';
import { getSlug, getBlogs } from '@/utils/fetchData';
import { slugify } from '@/utils/Slugify';

export const revalidate = 600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog: Blog | null = await getSlug<Blog>(slug, 'blogs');

  if (!blog) {
    return {
      title: 'Blog Not Found | Sangita Roy',
      description: 'This blog does not exist.',
    };
  }

  const shortDescription = blog.description
    ? blog.description.split('\n').slice(0, 3).join(' ').slice(0, 160)
    : 'Read this insightful blog by Sangita Roy.';

  const blogSlug = slugify(blog.name);

  return {
    title: `${blog.name} | Sangita Roy Blogs`,
    description: shortDescription,
    alternates: {
      canonical: `https://sroyauthor.vercel.app/blogs/${blogSlug}`,
    },
    openGraph: {
      type: 'article',
      url: `https://sroyauthor.vercel.app/blogs/${blogSlug}`,
      title: `${blog.name} | Sangita Roy Blogs`,
      description: shortDescription,
      siteName: 'Sangita Roy | Author',
      images: blog.image
        ? Array.isArray(blog.image)
          ? blog.image.map((img) => ({ url: img, width: 1200, height: 630 }))
          : [{ url: blog.image, width: 1200, height: 630 }]
        : [{ url: 'https://sroyauthor.vercel.app/sp.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${blog.name} | Sangita Roy Blogs`,
      description: shortDescription,
      images: blog.image
        ? Array.isArray(blog.image)
          ? blog.image
          : [blog.image]
        : ['https://sroyauthor.vercel.app/sp.png'],
      creator: '@sangitaroy',
      site: '@sangitaroy',
    },
  };
}

export async function generateStaticParams() {
  const blogs: Blog[] = await getBlogs();
  return blogs.map((blog) => ({
    slug: slugify(blog.name),
  }));
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const blog: Blog | null = await getSlug<Blog>(slug, 'blogs');

  if (!blog) return notFound();

  const images: string[] = Array.isArray(blog.image)
    ? blog.image
    : blog.image
      ? [blog.image]
      : [];

  return (
    <div className={styles.bcontainer}>
      <h1 className={styles.bhead}>{blog.name}</h1>
      <p className={styles.bp}>{blog.description}</p>

      {images.length > 0 && (
        <div className={styles.blogImages}>
          {images.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={`${blog.name}-${i}`}
              className={styles.img}
              width={400}
              height={600}
              crossOrigin="anonymous"
              priority
            />
          ))}
        </div>
      )}
    </div>
  );
}
