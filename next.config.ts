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

module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // 클라이언트는 /api/notice/1 로 요청
        destination: "http://localhost:8080/api/:path*", // 실제 백엔드로 연결
      },
    ];
  },
};

export default nextConfig;
