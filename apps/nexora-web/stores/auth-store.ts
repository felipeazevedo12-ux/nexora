import { create } from "zustand";

export type User = {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
  created_at?: string;
  updated_at?: string;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) =>
    set({
      user,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  clearUser: () =>
    set({
      user: null,
    }),
}));