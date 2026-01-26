import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Permite build mesmo com erros de TypeScript
    ignoreBuildErrors: true,
  },
  eslint: {
    // Permite build mesmo com erros de ESLint
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.builder.io',
      },
    ],
  },
};

export default nextConfig;
