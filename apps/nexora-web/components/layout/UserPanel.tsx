"use client";

import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

type Props = {
  username?: string;
  email?: string;
};

export default function UserPanel({
  username,
  email,
}: Props) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

  const currentUsername =
    user?.username ?? username ?? "Usuário";

  const currentEmail =
    user?.email ?? email ?? "";

  const initial =
    currentUsername.charAt(0).toUpperCase();

  async function handleLogout() {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error(
        "Erro ao fazer logout:",
        error,
      );
    } finally {
      clearUser();
      router.replace("/login");
    }
  }

  function handleSettings() {
    router.push("/me");
  }

  return (
    <div className="user-panel">
      <div className="user-avatar">
        {initial}
      </div>

      <div className="user-info min-w-0">
        <strong className="truncate">
          {currentUsername}
        </strong>

        <span className="truncate">
          {currentEmail || "Online"}
        </span>
      </div>

      <div className="user-actions">
        <button
          type="button"
          onClick={handleSettings}
          title="Minha conta"
          aria-label="Minha conta"
        >
          <Settings size={17} />
        </button>

        <button
          type="button"
          onClick={handleLogout}
          title="Sair da conta"
          aria-label="Sair da conta"
        >
          <LogOut size={17} />
        </button>
      </div>
    </div>
  );
}

