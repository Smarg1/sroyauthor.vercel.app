import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

const cspHeader = [
  "default-src 'self'",

  `script-src  'unsafe-inline' 'self' ${
    isDev ? "'unsafe-eval'" : ''
  } https://cdn.jsdelivr.net https://va.vercel-scripts.com https://www.youtube-nocookie.com`,

  `style-src 'self' ${isDev ? "'unsafe-inline'" : ''} https://cdn.jsdelivr.net`,

  "img-src 'self' data: blob: https://vjxqncgvtyizwouycayb.supabase.co https://i.ytimg.com",
  "font-src 'self'",
  "connect-src 'self' https://va.vercel-scripts.com https://www.youtube-nocookie.com",
  'frame-src https://www.youtube-nocookie.com',
  "media-src 'self' https://i.ytimg.com",
  "worker-src 'self' blob:",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
]
  .filter(Boolean)
  .join('; ');

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  output: 'standalone',
  productionBrowserSourceMaps: false,
  devIndicators: false,

  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vjxqncgvtyizwouycayb.supabase.co',
        pathname: '/storage/v1/object/public/frontend/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi_webp/**',
      },
    ],
  },
  compiler: {
    removeConsole: !isDev,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },

          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },

          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },

          /*{
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },*/

          { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },

          { key: 'X-DNS-Prefetch-Control', value: 'on' },

          { key: 'X-Frame-Options', value: 'DENY' },

          { key: 'X-XSS-Protection', value: '0' },

          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
        ],
      },
    ];
  },
};

export default nextConfig;

// TODO: strengthen CSP further by using hashes, and by removing 'unsafe-inline' and 'unsafe-eval' in development (if possible).
// TODO: Use COEP without breaking youtube embeds.
