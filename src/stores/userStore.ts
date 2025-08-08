/* eslint-disable @typescript-eslint/no-explicit-any */
// src/stores/userStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserInfo {
  nickname: string;
  profileImage?: string;
  id: number; // ✅ 반드시 존재해야만 저장되도록
}

interface UserStore {
  user: any;
  userInfo: UserInfo | null;
  setUser: (info: UserInfo) => void;
  logout: () => void;
}

// src/stores/userStore.ts
export const useUserStore = create<UserStore>()(
  persist(
    set => ({
      user: null,
      userInfo: null,
      setUser: info => set({ userInfo: info }),
      logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ userInfo: null });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
