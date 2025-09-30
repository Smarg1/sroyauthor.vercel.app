"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";
import config from "@/config/app.config";

const navItems = [
  { href: "/#about", label: "About" },
  { href: "/works", label: "Works" },
  { href: "/blogs", label: "Blogs" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  useEffect(() => {
    const handleScroll = () => menuOpen && setMenuOpen(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/" aria-label="Home" title="Home">
          <Image
            src={config.meta.logo}
            alt="sroy logo"
            width={150}
            height={80}
            priority
          />
        </Link>
      </div>

      <button
        aria-label="Toggle Menu"
        title="Toggle Menu"
        className={`${styles.menuToggle} ${menuOpen ? styles.open : ""}`}
        onClick={toggleMenu}
      >
        <Image
          src={menuOpen ? "/images/icons/close.svg" : "/images/icons/bars.svg"}
          alt="Toggle Menu"
          width={24}
          height={24}
        />
      </button>

      <div className={`${styles.menuItems} ${menuOpen ? styles.active : ""}`}>
        {navItems.map(item => (
          <div key={item.label} className={styles.navItem}>
            <Link href={item.href} as={item.href} onClick={() => menuOpen && setMenuOpen(false)}>
              {item.label}
            </Link>
          </div>
        ))}
      </div>
    </nav>
  );
}
