"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";

type AuthProviderProps = {
  children: ReactNode;
};

const publicRoutes = [
  "/login",
  "/register",
];

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const initialized = useAuthStore((state) => state.initialized);
  const loadUser = useAuthStore((state) => state.loadUser);

  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!initialized) {
      loadUser();
    }
  }, [initialized, loadUser]);

  useEffect(() => {
    if (!initialized || loading) {
      return;
    }

    if (!user && !isPublicRoute) {
      router.replace("/login");
      return;
    }

    if (user && isPublicRoute) {
      router.replace("/servers");
    }
  }, [
    user,
    loading,
    initialized,
    isPublicRoute,
    pathname,
    router,
  ]);

  if (!initialized || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07070a] text-white">
        <div className="flex flex-col items-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 text-2xl font-black shadow-2xl shadow-violet-950/40">
            N
          </div>

          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />
            Carregando Nexora...
          </div>
        </div>
      </main>
    );
  }

  if (!user && !isPublicRoute) {
    return null;
  }

  if (user && isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}