"use client"

import Link from "next/link";
import styles from "@/styles/norm.module.css";
import Heading from "@/components/Heading/Heading";
import { Get, slugify, Author } from "@/utils/fetch";
import { useState, useEffect } from "react";

export default function WorksPage() {
  const [works, setWorks] = useState<Author[]>([]);

  useEffect(() => {
    const fetchWorks = async () => {
      const data = await Get<Author>("works");
      setWorks(data);
    };
    fetchWorks();
  }, []);

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
