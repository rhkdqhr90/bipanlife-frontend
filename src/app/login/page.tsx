"use client";

import { startOAuth } from "@/lib/apis/startOAuth";
import React from "react";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-md text-center">
      <h1 className="text-2xl font-bold mb-6">소셜 계정으로 로그인</h1>

      <div className="space-y-4">
        <button
          onClick={() => startOAuth("naver", "login")}
          className="w-full py-2 rounded bg-green-500 text-black font-semibold hover:bg-green-600"
        >
          네이버 로그인
        </button>

        {/* <button
          onClick={() => handleOAuthLogin("kakao")}
          className="w-full py-2 rounded bg-yellow-300 text-black font-semibold hover:bg-yellow-400"
        >
          카카오 로그인
        </button> */}

        <button
          onClick={() => startOAuth("google", "login")}
          className="w-full py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
        >
          구글 로그인
        </button>
      </div>
    </div>
  );
}
