"use client";

import React from "react";

export const OAuth2LoginButtons = () => {
  const handleOAuthLogin = (provider: "google" | "kakao" | "naver") => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="space-y-2 mt-6">
      <button
        onClick={() => handleOAuthLogin("naver")}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        네이버로 로그인
      </button>
      <button
        onClick={() => handleOAuthLogin("google")}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        구글로 로그인
      </button>
      <button
        onClick={() => handleOAuthLogin("kakao")}
        className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500"
      >
        카카오로 로그인
      </button>
    </div>
  );
};
