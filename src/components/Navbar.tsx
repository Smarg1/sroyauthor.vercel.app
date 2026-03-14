'use client';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/#about', label: 'About' },
  { href: '/books', label: 'Books' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/contributions', label: 'Contributions' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="bg-secondary/90 fixed top-0 right-0 left-0 z-50 outline backdrop-blur">
        <div className="mx-auto flex h-(--mobile-nav-height) max-w-7xl items-center justify-between px-6 md:h-(--nav-height) md:px-12 lg:justify-center-safe">
          <Link
            href="/#"
            className="flex items-center"
            onClick={() => setMenuOpen(false)}
          >
            <Image
              src="/images/favicon/logo.svg"
              alt="Logo"
              width={150}
              height={80}
              className="animate-pop-in h-12 w-auto transition-all hover:scale-120 lg:mr-6 lg:h-14"
              priority
            />
          </Link>

          <div className="hidden items-center gap-10 lg:flex">
            {navItems.map(({ href, label }, i) => (
              <Link
                key={label}
                href={href}
                className={`animation-delay-${String(
                  i * 150,
                )} animate-bounce-in text-on-secondary hover:text-on-secondary-container hover:bg-secondary-container rounded-full px-4 py-2 text-2xl font-medium transition-colors duration-300`}
              >
                {label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-panel"
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((p) => !p)}
            className="flex h-10 w-10 items-center justify-center lg:hidden"
          >
            <span
              className={`transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                menuOpen ? 'rotate-180' : 'rotate-0'
              }`}
            >
              {menuOpen ? (
                <XMarkIcon className="text-on-secondary h-7 w-7 stroke-2" />
              ) : (
                <Bars3Icon className="text-on-secondary h-7 w-7 stroke-2" />
              )}
            </span>
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <button
        type="button"
        aria-label="Close menu"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-700 lg:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile menu */}
      <div
        id="mobile-panel"
        className={`bg-secondary text-on-secondary fixed top-16 right-0 left-0 z-50 origin-top transform transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          menuOpen
            ? 'scale-y-100 opacity-100'
            : 'pointer-events-none scale-y-95 opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-8 px-8 py-10 text-2xl">
          {navItems.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="transition-transform duration-700 hover:translate-x-2"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
