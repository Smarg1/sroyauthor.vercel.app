import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';

import Footer from '@/components/Footer/Footer';
import Navbar from '@/components/Navbar/Navbar';

export const metadata: Metadata = {
  title: 'Sangita Roy | Author',
  description:
    'Discover the enchanting world of Sangita Roy, a nature-fiction author blending nature and imagination through fiction.',
  authors: [{ name: 'Sangita Roy', url: 'https://github.com/smarg1' }],
  robots: 'index, follow',
  generator: 'Smarg1 (Firefly), Next.js',
  openGraph: {
    type: 'website',
    locale: 'en_US',
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
      'en-US': 'https://sroyauthor.vercel.app/',
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  themeColor: '#67523d',
};

const quicksand = localFont({
  src: [
    { path: '../fonts/Quicksand-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/Quicksand-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-quicksand',
  display: 'swap',
});

const radley = localFont({
  src: [
    { path: '../fonts/Radley-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Radley-Italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-radley',
  display: 'swap',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html
      lang="en"
      className={`${quicksand.variable} ${radley.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="S.Roy" />
        <Script
          id="structured-data-person"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Sangita Roy',
              url: 'https://sroyauthor.vercel.app',
              image: 'https://sroyauthor.vercel.app/sp.png',
              jobTitle: 'Author',
              worksFor: { '@type': 'Person', name: 'S.Roy Author' },
              description:
                'Nature-fiction author blending nature and imagination through fiction.',
              sameAs: [
                'https://github.com/smarg1',
                'https://www.linkedin.com/in/sangita-roy',
                'https://x.com/sangitaroy',
              ],
              publisher: {
                '@type': 'Person',
                name: 'S.Roy Author',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://sroyauthor.vercel.app/sp.png',
                },
              },
            }),
          }}
        />
      </head>
      <body>
        <Navbar/>
        {children}
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
