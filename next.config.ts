import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Optimize bundle size
    optimizePackageImports: ["@tanstack/react-query"]
  }
};

export default nextConfig;
