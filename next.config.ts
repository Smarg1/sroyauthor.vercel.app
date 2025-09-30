import { NextConfig } from "next";
import crypto from "crypto";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",

  images: {
    remotePatterns: [
        {
        protocol: "https",
        hostname: "*.vercel-storage.com",
        pathname: "/**",
        },
      ],
    },

    async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Content-Security-Policy",
            value: (() => {
            const nonce = crypto.randomBytes(16).toString("base64");
            return [
              "default-src 'self'",
              `script-src 'self' 'nonce-${nonce}' https://va.vercel-scripts.com`,
              `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`,
              "img-src 'self' blob: data: https:",
              "font-src 'self'",
              "connect-src 'self' [https://va.vercel-scripts.com](https://va.vercel-scripts.com) https://*.supabase.co https://*.supabase.net https://*.vercel-storage.com [https://vercel.app](https://vercel.app)",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; ");
            })(),
          },
        ],
      },
    ];
  },

  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      return [
        {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
