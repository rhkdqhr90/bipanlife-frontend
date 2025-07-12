// src/stores/userStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserInfo {
  nickname: string;
  profileImage?: string;
}

interface UserStore {
  userInfo: UserInfo | null;
  setUser: (info: UserInfo) => void;
  logout: () => void;
}

// src/stores/userStore.ts
export const useUserStore = create<UserStore>()(
  persist(
    set => ({
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
