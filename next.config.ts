import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  productionBrowserSourceMaps: false,
  transpilePackages: ['next-mdx-remote'],

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
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['info'] } : false,
  },

  headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },

          // Keep COOP (safe)
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },

          // REMOVE COEP (breaks YouTube)
          // { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },

          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",

              // Scripts
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://www.youtube.com https://www.youtube-nocookie.com https://va.vercel-scripts.com",

              // Styles
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",

              // Images
              "img-src 'self' data: https://vjxqncgvtyizwouycayb.supabase.co https://i.ytimg.com",

              // Fonts
              "font-src 'self'",

              // XHR / fetch
              "connect-src 'self' https://va.vercel-scripts.com https://www.youtube.com https://www.youtube-nocookie.com",

              // Iframes
              'frame-src https://www.youtube.com https://www.youtube-nocookie.com',

              // Lockdown
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              'upgrade-insecure-requests',
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
