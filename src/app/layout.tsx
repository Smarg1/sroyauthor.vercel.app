import './globals.css';

import type { Metadata, Viewport } from 'next';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Quicksand, Radley } from 'next/font/google';

import Footer from '@/components/Footer';
import JsonLD from '@/components/Misc/jsonld';
import WarningXSS from '@/components/Misc/xssProtection';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/hooks/CustomCursor';
import Pagetransition from '@/hooks/pageTransition';

export const metadata: Metadata = {
  title: {
    default: 'Sangita Roy | Author',
    template: '%s | Sangita Roy',
  },
  description:
    'Discover the enchanting world of Sangita Roy, a nature-fiction author blending nature and imagination through fiction.',
  authors: [{ name: 'Sangita Roy', url: 'https://github.com/smarg1' }],
  robots: 'index, follow',
  generator: 'Smarg1 (Firefly), Next.js',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://sroyauthor.vercel.app',
    siteName: 'S.Roy Author',
    title: 'Sangita Roy',
    description:
      'Discover the enchanting world of Sangita Roy, a nature-fiction author blending nature and imagination through fiction.',
    images: [
      {
        url: 'https://sroyauthor.vercel.app/sp.png',
        width: 1200,
        height: 630,
        alt: 'Sangita Roy',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sangita Roy | Author',
    description:
      'Discover the enchanting world of Sangita Roy, a nature-fiction author blending nature and imagination through fiction.',
    images: ['https://sroyauthor.vercel.app/sp.png'],
    creator: '@sangitaroy',
    site: '@sangitaroy',
  },
  manifest: '/manifest.webmanifest',
  keywords: [
    'Sangita Roy',
    'nature fiction author',
    'environmental stories',
    'imaginative writing',
    'Indian author',
  ],
  icons: {
    icon: [
      {
        url: '/images/favicon/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      { url: '/images/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/images/favicon/favicon.ico' },
    ],
    apple: '/images/favicon/apple-touch-icon.png',
  },
  alternates: {
    canonical: 'https://sroyauthor.vercel.app/',
    languages: {
      'en-GB': 'https://sroyauthor.vercel.app/',
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'S.Roy Author',
    startupImage: '/sp.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  themeColor: '#67523d',
  colorScheme: 'only light',
};

const quicksand = Quicksand({
  weight: ['500', '700'],
  style: ['normal'],
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
});

const radley = Radley({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-radley',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${quicksand.variable} ${radley.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <Navbar />
        <Pagetransition>
          <div className="mt-(--nav-height) flex-1 max-md:mt-(--mobile-nav-height)">
            {children}
          </div>
          <Footer />
        </Pagetransition>
        <SpeedInsights />
        <WarningXSS />
        <Analytics />
        <JsonLD />
        <CustomCursor />
      </body>
    </html>
  );
}
