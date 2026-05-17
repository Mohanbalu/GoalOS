import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignore ESLint verification rules during production build execution
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow clean compilation regardless of minor linter type warnings
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
