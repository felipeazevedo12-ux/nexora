"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores/use-auth-store";

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return <>{children}</>;
}