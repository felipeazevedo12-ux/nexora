"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Channel = {
  id: string;
  server_id: string;
  name: string;
  type: string;
  created_at: string;
};

export default function ServerPage() {
  const params = useParams();
  const router = useRouter();

  const serverId = params.serverId as string;

  useEffect(() => {
    if (!serverId) {
      return;
    }

    async function openFirstChannel() {
      try {
        const channels = await apiFetch<Channel[]>(
          `/channels/server/${serverId}`,
        );

        if (channels && channels.length > 0) {
          router.replace(
            `/servers/${serverId}/${channels[0].id}`,
          );
        }
      } catch (error) {
        console.error(
          "[NEXORA] Erro ao carregar canais:",
          error,
        );
      }
    }

    openFirstChannel();
  }, [serverId, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0d10] text-white">
      <div className="flex flex-col items-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 text-2xl font-black shadow-2xl shadow-violet-950/40">
          N
        </div>

        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />
          Abrindo servidor...
        </div>
      </div>
    </main>
  );
}