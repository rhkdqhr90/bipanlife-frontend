// src/stores/userStore.ts
import { create } from "zustand";

interface UserInfo {
  nickname: string;
  profileImage?: string;
}

interface UserStore {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>(set => ({
  userInfo: null,
  setUserInfo: info => set({ userInfo: info }),
  logout: () => set({ userInfo: null }),
}));
