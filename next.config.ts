import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ❌ experimental.css.transformer 는 제거해야 함
  experimental: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.bipanlife.com", // ← 예: S3 CloudFront 도메인
      },
    ],
  },
};

export default nextConfig;
