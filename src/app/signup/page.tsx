"use client";

import React from "react";

const OAuth2SignUpPage = () => {
  const oauthLogin = (provider: "google" | "kakao" | "naver") => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-md text-center">
      <h1 className="text-2xl font-bold mb-6">소셜 계정으로 시작하기</h1>

      <div className="space-y-4">
        <button
          onClick={() => oauthLogin("naver")}
          className="w-full py-2 rounded bg-green-500 text-black font-semibold hover:bg-yellow-400"
        >
          네이버로 시작하기
        </button>

        <button
          onClick={() => oauthLogin("kakao")}
          className="w-full py-2 rounded bg-yellow-300 text-black font-semibold hover:bg-yellow-400"
        >
          카카오로 시작하기
        </button>

        <button
          onClick={() => oauthLogin("google")}
          className="w-full py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
        >
          구글로 시작하기
        </button>
      </div>
    </div>
  );
};

export default OAuth2SignUpPage;
