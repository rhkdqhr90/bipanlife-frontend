// app/auth/result/page.tsx
"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AuthResultPage() {
  const sp = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const ok = sp.get("ok");
    const error = sp.get("error"); // withdrawn | banned | no_account | ...
    const redirectUri = sp.get("redirectUri") || "/";

    if (ok === "1") {
      // 로그인 성공
      router.replace(redirectUri);
      return;
    }

    // 실패/차단 케이스
    const msg =
      error === "withdrawn"
        ? "탈퇴한 계정입니다."
        : error === "banned"
          ? "정지된 계정입니다."
          : error === "no_account"
            ? "존재하지 않는 계정입니다. 회원가입이 필요해요."
            : "로그인에 실패했습니다.";

    alert(msg);
    router.replace("/"); // 홈으로
  }, [sp, router]);

  return null; // 화면 출력 필요 없음 (즉시 리다이렉트)
}
