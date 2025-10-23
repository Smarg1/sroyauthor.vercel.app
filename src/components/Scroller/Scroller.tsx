"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/utils/Slugify";
import styles from "./Scroller.module.css";
import type { Work } from "@/utils/fetchData";

interface Props {
  works: Work[];
}

export default function ScrollWrapper({ works }: Props) {
  const worksRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 800);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollLeft = () => worksRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => worksRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div className={styles.worksWrapper}>
      <button className={`${styles.scrollBtn} ${styles.left}`} onClick={scrollLeft}>
        <Image src="/images/icons/left.svg" alt="Left Scroll" width={24} height={24} />
      </button>

      <div className={styles.workItems} ref={worksRef}>
        {works.map((work) => {
          const slug = slugify(work.name);
          const imageSrc = work.image ?? "/not-found.svg";

          return (
            <div key={work.id} className={styles.flipContainer}>
              <div className={styles.flipper}>
                {isMobile ? (
                  <Link href={`/works/${slug}`} className={styles.mobileFront} prefetch>
                    <Image src={imageSrc} alt={work.name} width={220} height={350} priority />
                  </Link>
                ) : (
                  <>
                    <div className={styles.front}>
                      <Image src={imageSrc} alt={work.name} width={220} height={350} priority />
                    </div>
                    <div className={styles.back}>
                      <Link href={`/works/${slug}`} className={styles.workLink} prefetch>
                        <h3 className={styles.workTitle}>{work.name}</h3>
                        <p className={styles.workDesc}>{work.description}</p>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button className={`${styles.scrollBtn} ${styles.right}`} onClick={scrollRight}>
        <Image src="/images/icons/right.svg" alt="Right Scroll" width={24} height={24} />
      </button>
    </div>
  );
}
