"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/stores/userStore";

const OAuth2SuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUserStore();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken || !refreshToken) {
      alert("토큰이 전달되지 않았습니다.");
      router.replace("/");
      return;
    }

    // ✅ 1. 토큰 저장
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // ✅ 2. 사용자 정보 조회
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("유저 조회 실패");
        return res.json();
      })
      .then(data => {
        setUser(data); // zustand 저장
        router.replace("/");
      })
      .catch(() => {
        alert("사용자 정보 조회 실패");
        router.replace("/");
      });
  }, [searchParams, router, setUser]);

  return <p className="text-center mt-20 text-gray-600">로그인 처리 중...</p>;
};

export default OAuth2SuccessPage;
