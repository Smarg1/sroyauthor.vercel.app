'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

import styles from './Navbar.module.css';

const navItems = [
  { href: '/#about', label: 'About' },
  { href: '/works', label: 'Works' },
  { href: '/blogs', label: 'Blogs' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleScroll = () => setMenuOpen(false);
    window.addEventListener('scroll', handleScroll);
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  const handleOverlayClick = () => setMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.logo} ${styles.logoAnimated}`}>
        <Link href="/" aria-label="Home">
          <Image
            src="/images/icons/logo.svg"
            alt="logo"
            width={150}
            height={80}
            priority
          />
        </Link>
      </div>
      <button
        aria-label="Toggle Menu"
        aria-expanded={menuOpen}
        aria-controls="nav-menu"
        className={`${styles.menuToggle} ${menuOpen ? styles.open : ''}`}
        onClick={toggleMenu}
      >
        <Image
          src={menuOpen ? '/images/icons/close.svg' : '/images/icons/bars.svg'}
          alt="Menu toggle"
          width={24}
          height={24}
        />
      </button>
      <div
        id="nav-menu"
        className={`${styles.menuItems} ${menuOpen ? styles.active : ''}`}
      >
        {navItems.map(({ href, label }) => (
          <div key={label} className={styles.navItem}>
            <Link
              href={href}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          </div>
        ))}
      </div>
      <div
        className={`${styles.overlay} ${menuOpen ? styles.show : ''}`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
    </nav>
  );
}
