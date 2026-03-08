import { compileMDX } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import Link from 'next/link';

import Heading from '@/components/Heading';
import { FadeIn } from '@/components/Misc/FadeIn';
import ScrollWrapper from '@/components/Scroller';
import { getBooks, getContributions, getMetadataValue } from '@/utils/fetchData';

export const revalidate = 3600;

export default async function HomePage() {
  const [books, contributions, bio, pfp] = await Promise.all([
    getBooks(),
    getContributions(),
    getMetadataValue('bio'),
    getMetadataValue('author_img'),
  ]);

  const mdxData =
    bio !== null
      ? await compileMDX({
          source: bio,
          options: { parseFrontmatter: true },
          components: { Heading, Link },
        })
      : null;

  const works = [...books, ...contributions];

  const authorImg = pfp ?? '/not-found.svg';

  return (
    <>
      <header className="bg-primary text-on-primary flex flex-col gap-4 p-7 text-left outline outline-black max-md:p-5 max-md:text-center">
        <FadeIn>
          <h1 className="animate-fade-up max-w-13/20 font-serif text-5xl leading-tight tracking-wide max-md:mx-auto max-md:max-w-full lg:text-6xl 2xl:max-w-1/2 2xl:text-8xl">
            Where Fiction and the Soul of Nature Converge
          </h1>
        </FadeIn>

        <FadeIn delay={100}>
          <p className="max-w-13/20 font-serif text-xl italic max-md:mx-auto max-md:max-w-full 2xl:max-w-1/2 2xl:text-2xl">
            Exploring the intricate bond between humanity and the earth’s secrets.
          </p>
        </FadeIn>

        <FadeIn delay={200}>
          <Link
            href="/blogs"
            prefetch
            className="button-secondary w-fit max-md:mx-auto 2xl:px-5 2xl:py-2 2xl:text-2xl"
          >
            Explore
          </Link>
        </FadeIn>
      </header>

      <main>
        <FadeIn delay={300}>
          <section id="works" className="flex w-full flex-col items-center p-6">
            <ScrollWrapper works={works} />
          </section>
        </FadeIn>

        <section id="about" className="p-6">
          <FadeIn>
            <Heading text="About" />
          </FadeIn>

          <div className="mx-auto flex w-1/4 max-w-sm flex-col items-center gap-6 text-justify max-md:w-4/5">
            <FadeIn>
              <Image
                src={authorImg}
                alt="Author Picture"
                width={439}
                height={598}
                priority
                className="outlined h-auto w-full max-w-xs rounded-lg object-cover transition-transform duration-300 hover:scale-105 max-md:hover:scale-100"
              />
            </FadeIn>

            <FadeIn>
              <div className="text-on-primary-container font-sans leading-relaxed tracking-wide">
                {mdxData !== null ? mdxData.content : <p>No bio available.</p>}
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
    </>
  );
}
