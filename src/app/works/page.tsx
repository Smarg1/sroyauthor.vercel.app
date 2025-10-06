"use client";

import { useState, useEffect } from "react";
import Heading from "@/components/Heading/Heading";
import Card from "@/components/Card/Card";
import { Get, slugify, value } from "@/utils/fetch";
import styles from "@/styles/norm.module.css";

export default function WorksPage() {
  const [works, setWorks] = useState<value[]>([]);

  useEffect(() => {
    const fetchWorks = async () => {
      const data = await Get<value>("works");
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
            const imageSrc = Array.isArray(work.image)
              ? work.image[0] ?? "/not-found.png"
              : work.image ?? "/not-found.png";
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
          })
        )}
      </div>
    </>
  );
}
