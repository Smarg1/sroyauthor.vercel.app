import Image from "next/image";
import styles from "@/styles/index.module.css";
import Button from "@/components/Button/Button";
import Heading from "@/components/Heading/Heading";
import config from "@/config/app.config";

export default async function HomePage() {
  const bio = await fetch(`${process.env.BASE_URL}/api/bio`)
    .then((res) => res.text())
    .then((text) => text.replace(/^"|"$/g, ""));

  const pfp = await fetch(`${process.env.BASE_URL}/api/pfp`)
    .then((res) => res.text())
    .then((text) => text.replace(/^"|"$/g, ""));

  return (
    <>
      <header className={styles.headerWrapper}>
        <h1>{config.header.title}</h1>
        <p>{config.header.subtitle}</p>
        <Button
          label={config.header.btntext}
          href={config.header.btnlink}
          internal={true}
        />
      </header>
      <main>
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
            />
            <p className={styles.aboutText}>{bio}</p>
          </div>
        </section>
      </main>
    </>
  );
}
