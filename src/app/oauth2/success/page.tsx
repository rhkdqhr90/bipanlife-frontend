"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/stores/userStore";

const OAuth2SuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUserStore();

  useEffect(() => {
    const rawRedirectUri = searchParams.get("redirectUri") || "/";
    const decodedRedirect = decodeURIComponent(rawRedirectUri);

    // ❗ redirectUri가 또다시 /login이면 무한 루프 발생
    const finalRedirect = decodedRedirect.startsWith("/login") ? "/" : decodedRedirect;

    // 사용자 정보 조회
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
      method: "GET",
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("유저 조회 실패");
        return res.json();
      })
      .then(data => {
        console.log("🎯 유저 정보:", data);
        setUser(data); // zustand 저장
        router.replace(finalRedirect);
      })
      .catch(() => {
        alert("사용자 정보 조회 실패");
        router.replace("/");
      });
  }, [searchParams, router, setUser]);

  return <p className="text-center mt-20 text-gray-600">로그인 처리 중...</p>;
};

export default OAuth2SuccessPage;
