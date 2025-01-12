import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'cmdxd98sb0x3yprd.mangadex.network',
      'uploads.mangadex.org',
      'api.mangadex.org', // Add this line
    ],
  },
};

export default nextConfig;
