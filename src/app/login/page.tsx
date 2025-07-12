// /app/login/page.tsx
"use client";

import React from "react";

const LoginPage = () => {
  const OAUTH_URL = {
    google: `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/google`,
    kakao: `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/kakao`,
    naver: `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/naver`,
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6">로그인</h1>
      <div className="space-y-4">
        <a
          href={OAUTH_URL.naver}
          className="w-full block bg-green-500 text-white text-center py-2 rounded hover:bg-green-600"
        >
          네이버로 로그인
        </a>
        <a
          href={OAUTH_URL.google}
          className="w-full block bg-red-500 text-white text-center py-2 rounded hover:bg-red-600"
        >
          Google로 로그인
        </a>
        <a
          href={OAUTH_URL.kakao}
          className="w-full block bg-yellow-400 text-black text-center py-2 rounded hover:bg-yellow-500"
        >
          카카오로 로그인
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
