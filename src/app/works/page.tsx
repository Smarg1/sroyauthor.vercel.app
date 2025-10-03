import Link from "next/link";
import styles from "@/styles/norm.module.css";
import Heading from "@/components/Heading/Heading";
import { Get, slugify, Author } from "@/utils/fetch";

export default async function worksPage() {
  const works = await Get<Author>("works");

  return (
    <>
      <div className={styles.heading}>
        <Heading text="Works" />
      </div>

      <div className={styles.container}>
        {works.length === 0 ? (
          <p className={styles.bp}>You are all caught up!</p>
        ) : (
          works.map(work => {
            const slug = slugify(work.name);
            return (
              <Link
                key={work.id}
                href={`/works/${slug}`}
                style={{ textDecoration: "none" }}
              >
                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>{work.name}</h2>
                  <p className={styles.cardDesc}>{work.description}</p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}
