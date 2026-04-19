/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/featured-projects',
        destination: '/',
        permanent: false,
      },
    ]
  },
};

module.exports = nextConfig;
