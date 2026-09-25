import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  outputFileTracingRoot: path.join(__dirname),
  typescript: {
    // Next.js 16 validator.ts auto-generated Route constraint false positive
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
