import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true, // 必須為靜態導出設置此選項
  },
};

export default nextConfig;
