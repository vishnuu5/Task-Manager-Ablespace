/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:5000',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'task-manager-ablespace-baackend.onrender.com',
      'localhost',
    ],
    unoptimized: true,
  },
  async rewrites() {
    const isProduction = process.env.NODE_ENV === 'production';
    const apiUrl = isProduction 
      ? 'https://task-manager-ablespace-baackend.onrender.com'
      : 'http://localhost:5000';

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: '/socket.io/:path*',
        destination: `${apiUrl}/socket.io/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
