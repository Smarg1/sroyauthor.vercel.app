import styles from "@/styles/norm.module.css";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getSlug } from "@/utils/fetch";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function workPage({ params }: Props) {
  const { slug } = await params; 

  const work = await getSlug(slug, "works");

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