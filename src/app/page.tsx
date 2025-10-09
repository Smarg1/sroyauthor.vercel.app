"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/index.module.css";
import Button from "@/components/Button/Button";
import Heading from "@/components/Heading/Heading";
import { bioG, pfpG } from "@/utils/fetch";

export default function HomePage() {
  const [bio, setBio] = useState<string|null>("");
  const [pfp, setPfp] = useState<string|null>("");

  useEffect(() => {
    async function fetchData() {
      const bioData = await bioG();
      const pfpData = await pfpG();
      setBio(bioData);
      setPfp(pfpData);
    }
    fetchData();
  }, []);

  return (
    <>
      <header className={styles.headerWrapper}>
        <h1>Where Fiction and the Soul of Nature Converge</h1>
        <p>Exploring the intricate bond between humanity and the earth’s secrets.</p>
        <Button
          label="Read More"
          href="/blogs"
          internal={true}
        />
      </header>
      <main>
        <section id="about">
          <Heading text="About" />
          <div className={styles.aboutWrapper}>
            <Image
              src={pfp || "/not-found.png"}
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
