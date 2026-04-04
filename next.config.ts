import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },

  async redirects() {
    return [
      // ── Old MkDocs .html URLs → clean Next.js routes (308 = permanent) ──
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/blog/index.html', destination: '/blog', permanent: true },

      // Old blog post HTML files
      { source: '/blog/pour-principles.html', destination: '/blog/pour-principles', permanent: true },

      // Legal pages
      { source: '/legal/license.html', destination: '/legal/license', permanent: true },
      { source: '/legal/disclaimer.html', destination: '/legal/disclaimer', permanent: true },
      // /legal/sources.html was a MkDocs page that no longer exists → redirect to blog
      { source: '/legal/sources.html', destination: '/blog', permanent: true },

      // Strip trailing ?q= search params from old MkDocs search URLs
      { source: '/index.html', destination: '/', permanent: true, has: [{ type: 'query', key: 'q' }] },
      { source: '/legal/disclaimer.html', destination: '/legal/disclaimer', permanent: true, has: [{ type: 'query', key: 'q' }] },
      { source: '/blog/pour-principles.html', destination: '/blog/pour-principles', permanent: true, has: [{ type: 'query', key: 'q' }] },
      { source: '/contact.html', destination: '/contact', permanent: true, has: [{ type: 'query', key: 'q' }] },
    ]
  },
};

export default nextConfig;
