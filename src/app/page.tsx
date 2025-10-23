import Image from "next/image";
import Heading from "@/components/Heading/Heading";
import Button from "@/components/Button/Button";
import ScrollWrapper from "@/components/Scroller/Scroller";
import { getWorks, getAuthor } from "@/utils/fetchData";
import styles from "@/styles/index.module.css";

export const revalidate = 3600;

export default async function HomePage() {
  const [works, author] = await Promise.all([getWorks(), getAuthor()]);

  const bio = author?.description || "Bio not found.";
  const pfp = author?.pfp || "/not-found.svg";

  return (
    <>
      <header className={`${styles.headerWrapper} ${styles.fadeInSection}`}>
        <h1 className={styles.fadeItem}>Where Fiction and the Soul of Nature Converge</h1>
        <p className={styles.fadeItem}>
          Exploring the intricate bond between humanity and the earth’s secrets.
        </p>
        <div className={styles.fadeItem}>
          <Button label="Read More" href="/blogs" ariaLabel="Read More" />
        </div>
      </header>

      <main>
        <section className={styles.works} id="works">
          <Heading text="Works" />
          {works && works.length > 0 ? (
            <ScrollWrapper works={works} />
          ) : (
            <p className={styles.caught_up}>No works found yet!</p>
          )}
        </section>

        <section id="about">
          <Heading text="About" />
          <div className={styles.aboutWrapper}>
            <Image
              src={pfp}
              alt="Author Picture"
              width={439}
              height={598}
              className={styles.pic}
              crossOrigin="anonymous"
              priority
            />
            <p className={styles.aboutText}>{bio}</p>
          </div>
        </section>
      </main>
    </>
  );
}
