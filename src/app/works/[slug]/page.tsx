import styles from "@/styles/norm.module.css";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getSlug, value } from "@/utils/fetch";

interface Props {
  params: { slug: string };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;

  const work: value | null = await getSlug(slug, "works");

  if (!work) return notFound();

  const images = Array.isArray(work.image)
    ? work.image
    : work.image
    ? [work.image]
    : [];

  return (
    <div className={styles.works_container}>
      <h1 className={styles.works_title}>{work.name}</h1>
      <div className={styles.works_content}>
        <p className={styles.works_description}>{work.description}</p>

        {images.length > 0 && (
          <div className={styles.works_images}>
            {images.map((src: string, i: number) => (
              <div key={i} className={styles.works_imageWrapper}>
                <Image
                  src={src}
                  alt={`${work.name}-${i}`}
                  className={styles.works_images}
                  width={400}
                  height={600}
                  crossOrigin="anonymous"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
