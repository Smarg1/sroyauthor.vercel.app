const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  devIndicators: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ironhvybzbahndudasce.supabase.co",
        pathname: "/storage/v1/object/public/img-blob/**",
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
          {
            key: "Content-Security-Policy",
            value:[
                  "default-src 'self'",
                  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
                  "style-src 'self' 'unsafe-inline'",
                  "img-src 'self' blob: data: https://ironhvybzbahndudasce.supabase.co",
                  "font-src 'self'",
                  "connect-src 'self' https://va.vercel-scripts.com",
                  "object-src 'none'",
                  "base-uri 'self'",
                  "form-action 'self'",
                  "frame-ancestors 'none'",
                  "upgrade-insecure-requests",
                ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
