import { create } from "zustand";

type TokenStore = {
  token: string;
  setToken: (token: string) => void;
};

const tokenStore = create<TokenStore>((set) => ({
  token: localStorage.getItem("token") || "",
  setToken: (token: string) => {
    set({ token });
    localStorage.setItem("token", token);
  },
}));

export const useTokenStore = tokenStore;
