/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Note: async redirects() are not supported with static export.
  // The /featured-projects page is already removed from navigation,
  // so this redirect is intentionally omitted.
};

module.exports = nextConfig;
