"use client";

import React from "react";

export default function LoginPage() {
  const handleOAuthLogin = (provider: "google" | "kakao" | "naver") => {
    const searchParams = new URLSearchParams(window.location.search);
    const rawRedirectUri = searchParams.get("redirectUri");

    // redirectUri가 있으면 사용, 없으면 현재 경로
    let redirectUri = rawRedirectUri
      ? decodeURIComponent(rawRedirectUri)
      : window.location.pathname;

    // ❗ 무한루프 방지: /login이면 "/"로 대체
    if (redirectUri.startsWith("/login")) {
      redirectUri = "/";
    }

    // ✅ 쿠키 저장
    document.cookie = `redirect_uri=${encodeURIComponent(redirectUri)}; path=/; max-age=300`;

    // ✅ 백엔드로 인증 시작 요청
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/set-redirect?redirect_uri=${encodeURIComponent(redirectUri)}&provider=${provider}`;
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-md text-center">
      <h1 className="text-2xl font-bold mb-6">소셜 계정으로 로그인</h1>

      <div className="space-y-4">
        <button
          onClick={() => handleOAuthLogin("naver")}
          className="w-full py-2 rounded bg-green-500 text-black font-semibold hover:bg-green-600"
        >
          네이버 로그인
        </button>

        <button
          onClick={() => handleOAuthLogin("kakao")}
          className="w-full py-2 rounded bg-yellow-300 text-black font-semibold hover:bg-yellow-400"
        >
          카카오 로그인
        </button>

        <button
          onClick={() => handleOAuthLogin("google")}
          className="w-full py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
        >
          구글 로그인
        </button>
      </div>
    </div>
  );
}
