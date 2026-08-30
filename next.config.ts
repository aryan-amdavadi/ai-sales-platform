import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ensure server external packages for prisma if needed
  serverExternalPackages: ['@prisma/client', 'prisma'],
};

export default nextConfig;
