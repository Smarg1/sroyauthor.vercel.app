import Heading from "@/components/Heading/Heading";
import Card from "@/components/Card/Card";
import { slugify } from "@/utils/Slugify";
import { getWorks } from "@/utils/fetchData";
import type { Work } from "@/utils/fetchData";
import styles from "@/styles/norm.module.css";
import { Metadata } from "next";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Sangita Roy | Works",
  description:
    "Explore the creative works of Sangita Roy, an author blending imagination and nature in her stories. Browse through her collection of captivating works.",
  alternates: { canonical: "https://sroyauthor.vercel.app/works" },
  openGraph: {
    type: "website",
    url: "https://sroyauthor.vercel.app/works",
    title: "Sangita Roy | Works",
    description:
      "Explore the creative works of Sangita Roy, an author blending imagination and nature in her stories. Browse through her collection of captivating works.",
    siteName: "Sangita Roy | Author",
    images: [{ url: "https://sroyauthor.vercel.app/sp.png", width: 1200, height: 630, alt: "Sangita Roy | Works" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sangita Roy | Works",
    description:
      "Explore the creative works of Sangita Roy, an author blending imagination and nature in her stories. Browse through her collection of captivating works.",
    images: ["https://sroyauthor.vercel.app/sp.png"],
    creator: "@sangitaroy",
    site: "@sangitaroy",
  },
};

export default async function WorksPage() {
  const works: Work[] = await getWorks();

  if (!works || works.length === 0) {
    return (
      <div className={styles.heading}>
        <Heading text="Works" />
        <p className={styles.caught_up}>You are all caught up!</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.heading}>
        <Heading text="Works" />
      </div>
      <div id="search" className={styles.container}>
        {works.map((work) => {
          const slug = slugify(work.name);
          const imageSrc = work.image ?? "/not-found.svg";

          return (
            <Card
              key={work.id}
              href={`/works/${slug}`}
              imageSrc={imageSrc}
              imageAlt={work.name}
              title={work.name}
              description={work.description}
            />
          );
        })}
      </div>
    </>
  );
}
