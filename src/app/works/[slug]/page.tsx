import styles from "@/styles/norm.module.css";
import { slugify } from "@/hooks/slugify";
import { notFound } from "next/navigation";
import Image from "next/image";

type work = {
  id: number;
  name: string;
  description: string;
  image: string[] | string; 
};

interface Props {
  params: Promise<{ slug: string }>;
}

async function getworkBySlug(slug: string): Promise<work | null> {
  const res = await fetch(`${process.env.BASE_URL}/api/work`);
  const works: work[] = await res.json();
  works.forEach(work => {
    if (typeof work.image === "string") {
      try {
        work.image = JSON.parse(work.image);
      } catch {
        work.image = [];
      }
    }
  });
  return works.find(work => slugify(work.name) === slug) || null;
}

export default async function workPage({ params }: Props) {
  const { slug } = await params; 

  const work = await getworkBySlug(slug);

  if (!work) return notFound();

  return (
    <div className={styles.bcontainer}>
      <h1 className={styles.bhead}>{work.name}</h1>
      <p className={styles.bp}>{work.description}</p>
      <div className={styles.BlogImages}>
        {Array.isArray(work.image) && work.image.length > 0 ? (
          work.image.map((src, i) => (
            <Image key={i} src={src} alt={`${work.name}-${i}`} className={styles.img} crossOrigin="anonymous" fill={true}/>
          ))
        ) : (null)}
      </div>
    </div>
  );
}