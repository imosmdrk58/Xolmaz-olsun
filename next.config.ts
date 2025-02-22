import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cmdxd98sb0x3yprd.mangadex.network',
      },
      {
        protocol: 'https',
        hostname: 'uploads.mangadex.org',
      },
      {
        protocol: 'https',
        hostname: 'api.mangadex.org',
      },
      {
        protocol: 'https',
        hostname: 'og.mangadex.org',
      },
      {
        protocol: 'https',
        hostname: 'mangadex.org',
      },
    ],
  },
};

export default nextConfig;
