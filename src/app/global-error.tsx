'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import styles from '@/styles/error.module.css';

interface GlobalErrorProps {
  error: Error & { digest?: string; statusCode?: number };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  themeColor: '#d9c4b0',
};

export default function GlobalError({ error }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const statusCode = error.statusCode ?? 500;

  return (
    <body className={styles.body}>
      <div className={styles.container}>
        <h1 className={styles.status}>{statusCode}</h1>
        <p className={styles.message}>
          {error.message || 'Oops… something went wrong.'}
        </p>
        <Link href="/" className={styles.homeLink}>
          Back to Home
        </Link>
      </div>
    </body>
  );
}
