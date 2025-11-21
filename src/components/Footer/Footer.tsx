import Image from 'next/image';

import styles from './Footer.module.css';


export default async function Footer() {
  const socialLinks = [
    {
      href: 'https://www.instagram.com/sroyauthor/',
      label: 'Instagram',
      title: 'Instagram',
      src: '/images/icons/instagram-brands.svg',
      external: true,
    },
    {
      href: 'https://www.facebook.com/sroyauthor',
      label: 'Facebook',
      title: 'Facebook',
      src: '/images/icons/square-facebook-brands.svg',
      external: true,
    },
    {
      href: 'https://www.linkedin.com/in/sangita-roy-067a88342/',
      label: 'LinkedIn',
      title: 'LinkedIn',
      src: '/images/icons/linkedin-brands.svg',
      external: true,
    },
    {
      href: 'https://linktr.ee/sroyauthor',
      label: 'Linktree',
      title: 'Linktree',
      src: '/images/icons/linktree-logo-icon.svg',
      external: true,
    },
    {
      href: 'mailto:sroy.hussain@gmail.com',
      label: 'Email',
      title: 'Email',
      src: '/images/icons/envelope-solid.svg',
    },
    {
      href: 'https://www.goodreads.com/sangitaroy',
      label: 'Goodreads',
      title: 'Goodreads',
      src: '/images/icons/goodreads-brands-solid.svg',
      external: true,
    },
  ];
  
  return (
    <footer className={styles.footer} id="contact">
      <p>&copy; 2025 Sangita Roy. All rights reserved.</p>

      <div className={styles['social-icons']}>
        {socialLinks.map(({ href, label, title, src, external }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            title={title}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <Image src={src} alt={label} width={18} height={18} />
          </a>
        ))}
      </div>
    </footer>
  );
}
