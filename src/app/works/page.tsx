import Link from "next/link";
import styles from "@/styles/norm.module.css";
import Heading from "@/components/Heading/Heading";
import { slugify } from "@/hooks/slugify";

type work = {
  id: number;
  name: string;
  description: string;
  image: string[];
};

async function getworks(): Promise<work[]> {
  const res = await fetch(`${process.env.BASE_URL}/api/work`);
  return res.json();
}

export default async function worksPage() {
  const works = await getworks();

  return (
    <>
    <div className={styles.heading}><Heading text="Works"/></div>
    <div className={styles.container}>
      {works.map(work => {
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
        })}
      </div>
    </>
  );
}