import { create } from "zustand";

type UserIdStore = {
  userId: string;
  setUserId: (userId: string) => void;
};

const userIdStore = create<UserIdStore>((set) => ({
  userId: localStorage.getItem("userId") || "",
  setUserId: (userId: string) => {
    set({ userId });
    localStorage.setItem("userId", userId);
  },
}));

export const useUserIdStore = userIdStore;
