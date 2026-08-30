import { create } from "zustand";
import { apiFetch } from "@/lib/api";

export type User = {
  id: string;
  username: string;
  email: string;
  nickname: string | null;
  bio: string | null;
  avatar: string | null;
  banner: string | null;
  created_at: string;
  updated_at: string;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  initialized: boolean;

  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,

  loadUser: async () => {
    set({ loading: true });

    try {
      const user = await apiFetch<User>("/users/me");

      set({
        user,
        loading: false,
        initialized: true,
      });
    } catch {
      set({
        user: null,
        loading: false,
        initialized: true,
      });
    }
  },

  logout: async () => {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
      });
    } finally {
      set({
        user: null,
      });
    }
  },

  setUser: (user) => {
    set({ user });
  },
}));