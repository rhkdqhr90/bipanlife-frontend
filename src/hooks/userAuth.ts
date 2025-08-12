// src/hooks/useAuth.ts
import { apiFetch } from "@/lib/apis/apiFetch";
import { useUserStore } from "@/stores/userStore";

export const useAuth = () => {
  const logoutState = useUserStore(state => state.logout);

  const logout = async () => {
    try {
      await apiFetch(`/auth/logout`, {
        method: "POST",
        credentials: "include", // 쿠키 포함
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.warn("서버 로그아웃 실패 (무시 가능):", e);
    } finally {
      logoutState(); // 토큰 삭제 + 상태 초기화
    }
  };

  return { logout };
};
