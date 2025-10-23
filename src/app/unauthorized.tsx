import Link from "next/link";
import styles from "@/styles/error.module.css";

export default function Unauthorized() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title404}>401</h1>
      <p className={styles.message}>
        Unauthorized – Who are you, and how did you get here?
      </p>
      <Link href="/" className={styles.homeLink}>
        Back to Home
      </Link>
    </div>
  );
}
