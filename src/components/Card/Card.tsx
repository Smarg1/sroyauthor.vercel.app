import Image from 'next/image';
import Link from 'next/link';

import styles from './Card.module.css';

type CardProps = {
  href: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
};

export default async function Card({ href, imageSrc, imageAlt, title, description }: CardProps) {
  return (
    <Link href={href} className={styles.card}>
      <Image
        className={styles.card__image}
        src={imageSrc}
        alt={imageAlt}
        width={800}
        height={600}
        crossOrigin="anonymous"
      />
      <div className={styles.card__body}>
        <h3 className={styles.card__title}>{title}</h3>
        <p className={styles.card__desc}>{description}</p>
      </div>
    </Link>
  );
}
