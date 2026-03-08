import type { SimpleIcon } from 'simple-icons';

import { siFacebook, siGmail, siGoodreads, siInstagram, siLinktree } from 'simple-icons';

interface BrandIconProps {
  icon: SimpleIcon;
  label: string;
}

function BrandIcon({ icon, label }: BrandIconProps) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 24 24"
      className="h-5 w-5 transition-opacity duration-200 2xl:h-7 2xl:w-7"
      fill="currentColor"
    >
      <title>{label}</title>
      <path d={icon.path} />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: 'https://www.instagram.com/sroyauthor/',
      label: 'Instagram',
      icon: siInstagram,
    },
    {
      href: 'https://www.facebook.com/sroyauthor',
      label: 'Facebook',
      icon: siFacebook,
    },
    {
      href: 'https://linktr.ee/sroyauthor',
      label: 'Linktree',
      icon: siLinktree,
    },
    {
      href: 'mailto:sroy.hussain@gmail.com',
      label: 'Email',
      icon: siGmail,
    },
    {
      href: 'https://www.goodreads.com/sangitaroy',
      label: 'Goodreads',
      icon: siGoodreads,
    },
  ];

  return (
    <footer
      id="contact"
      className="bg-secondary text-on-secondary p-6 font-serif italic outline outline-black"
    >
      <div className="mx-auto max-w-7xl space-y-3 text-center">
        <p className="text-sm sm:text-base lg:text-lg">
          &copy; {currentYear} Sangita Roy. All rights reserved.
        </p>

        <div className="flex justify-center gap-6 text-lg sm:text-xl lg:text-2xl">
          {socialLinks.map(({ href, label, icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              title={label}
              className="inline-flex items-center opacity-90 transition-opacity hover:opacity-100"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BrandIcon icon={icon} label={label} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
