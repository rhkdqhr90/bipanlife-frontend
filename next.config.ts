import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  experimental: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.bipanlife.com",
      },
    ],
  },
  // async rewrites() {
  //   return [
  //     // 방법 1: 개별 경로 지정 (권장)
  //     {
  //       source: "/api/:path*",
  //       destination: "http://backend:8080/api/:path*",
  //     },
  //     {
  //       source: "/auth/:path*",
  //       destination: "http://backend:8080/auth/:path*",
  //     },
  //     {
  //       source: "/oauth2/:path*",
  //       destination: "http://backend:8080/oauth2/:path*",
  //     },

  //   //  방법 2: 모든 백엔드 API 경로를 한번에 (선택사항)
  //     {
  //       source: "/(api|auth|oauth2)/:path*",
  //       destination: "http://backend:8080/$1/:path*",
  //     },
  //   ];
  // },

  async rewrites() {
    return [
      { source: "/api/:path*", destination: "http://backend:8080/api/:path*" },
      { source: "/auth/:path*", destination: "http://backend:8080/auth/:path*" },
      { source: "/oauth2/:path*", destination: "http://backend:8080/oauth2/:path*" },
    ];
  },
};

export default nextConfig;
