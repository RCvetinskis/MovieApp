import { Iuser } from "@/types";
import { create } from "zustand";
import Cookies from "js-cookie";
import { useEffect } from "react";

interface UserStore {
  user: Iuser | null;
  setUser: (userData: Iuser) => void;
  setAuthCookies: (token: string, expiresAt: string, userId: string) => void;
  clearUser: () => void;
  rehydrateUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  setUser: (userData) => {
    set({ user: userData });
    Cookies.set("user", JSON.stringify(userData));
  },

  setAuthCookies: (token, expiresAt, userId) => {
    Cookies.set("auth_token", token);
    Cookies.set("expires_at", expiresAt);
    Cookies.set("userId", userId);
  },

  clearUser: () => {
    set({ user: null });
    // Remove auth cookies
    Cookies.remove("auth_token");
    Cookies.remove("expires_at");
    Cookies.remove("user");
    Cookies.remove("userId");
  },

  rehydrateUser: () => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      set({ user: JSON.parse(storedUser) });
    }
  },
}));

export const useRehydrateUser = () => {
  const rehydrateUser = useUserStore((state) => state.rehydrateUser);

  useEffect(() => {
    rehydrateUser();
  }, [rehydrateUser]);
};
