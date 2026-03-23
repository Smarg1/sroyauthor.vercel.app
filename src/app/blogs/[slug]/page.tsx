import type { Metadata } from 'next';

import { MDXRemote } from 'next-mdx-remote/rsc';
import { ArticleJsonLd } from 'next-seo';
import { notFound } from 'next/navigation';
import remarkGfm from 'remark-gfm';

import type { Blog } from '@/lib/types/app.types';

import MDXImage from '@/components/Blog/MDXImage';
import MDXTable from '@/components/Blog/MDXTable';
import YouTube from '@/components/Blog/Youtube';
import { getBlogBySlug, getBlogs } from '@/utils/fetchData';

export const revalidate = 1800;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const blogs: Blog[] = await getBlogs();

  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Blog Not Found | Sangita Roy',
      description: 'This blog does not exist.',
    };
  }

  const description = blog.description ?? 'Read this captivating blog by Sangita Roy.';

  const url = `https://sroyauthor.vercel.app/blogs/${blog.slug}`;
  const image = blog.image ?? 'https://sroyauthor.vercel.app/sp.png';

  return {
    title: blog.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: `${blog.title} | Sangita Roy Blogs`,
      description,
      siteName: 'Sangita Roy | Author',
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${blog.title} | Sangita Roy Blogs`,
      description,
      images: [{ url: image, width: 1200, height: 630 }],
      creator: '@sangitaroy',
      site: '@sangitaroy',
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) return notFound();

  const { date, title } = blog;
  const tags = blog.tags ?? [];

  return (
    <>
      <ArticleJsonLd
        type="Blog"
        headline={title}
        author={['S. Roy']}
        dateModified={date}
        datePublished={date}
        description={blog.description ?? 'Read this captivating blog by Sangita Roy.'}
        image={[blog.image ?? 'https://sroyauthor.vercel.app/sp.png']}
        publisher="S. Roy"
        url={`https://sroyauthor.vercel.app/blogs/${blog.slug}`}
      />

      <article className="bg-background text-on-background">
        <section className="mx-auto max-w-3xl px-6 py-16">
          <header className="mb-12 text-center">
            <h1 className="text-on-surface font-serif text-5xl font-bold tracking-tight text-balance sm:text-6xl">
              {title}
            </h1>
            <p className="text-on-surface-variant mt-3 text-sm">
              By <span className="font-medium">S. Roy</span>
            </p>
            <time dateTime={date} className="text-on-surface-variant block text-sm">
              {new Date(date).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {tags.length > 0 ? (
              <ul className="mt-4 flex flex-wrap justify-center gap-2">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="border-outline bg-secondary text-on-secondary rounded-md border px-3 py-1 text-xs"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </header>
          <div className="blog">
            <MDXRemote
              source={blog.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
              components={{
                YouTube,
                img: MDXImage,
                table: MDXTable,
              }}
            />
          </div>

          {/* Article Footer */}
          <footer className="border-outline text-on-surface-variant mt-16 border-t pt-6 text-center text-sm">
            Written by <span className="font-medium">S. Roy</span>
          </footer>
        </section>
      </article>
    </>
  );
}
