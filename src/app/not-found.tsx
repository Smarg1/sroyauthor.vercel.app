import Link from 'next/link';

import styles from '@/styles/error.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title404}>404</h1>
      <p className={styles.message}>
        Hmmm… we couldn’t find the page you’re looking for.
      </p>
      <Link href="/" className={styles.homeLink}>
        Back to Home
      </Link>
    </div>
  );
}
