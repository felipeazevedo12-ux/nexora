"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Invite = {
  id: string;
  code: string;
  created_at: string;
  expires_at: string | null;
  servers: {
    id: string;
    name: string;
    icon: string | null;
    owner_id: string;
  };
};

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();

  const code = String(params.code);

  const [invite, setInvite] = useState<Invite | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInvite() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch<Invite>(
          `/servers/invites/${code}`,
        );

        setInvite(data);
      } catch (err) {
        console.error(
          "Erro ao carregar convite:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Convite inválido ou expirado.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (code) {
      loadInvite();
    }
  }, [code]);

  async function handleJoin() {
    if (joining) {
      return;
    }

    try {
      setJoining(true);
      setError("");

      const data = await apiFetch<{
        message: string;
        server: {
          id: string;
          name: string;
          icon: string | null;
          owner_id: string;
        };
      }>(`/servers/invites/${code}/join`, {
        method: "POST",
      });

      console.log("Servidor:", data.server);
      console.log("Mensagem:", data.message);

      /*
       * Voltamos para a página principal.
       *
       * A página /servers executará novamente:
       *
       * GET /servers
       *
       * e o servidor recém-adicionado aparecerá
       * automaticamente na barra lateral.
       */
      router.replace("/servers");
    } catch (err) {
      console.error(
        "Erro ao entrar no servidor:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível entrar no servidor.",
      );

      setJoining(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0d10] text-white">
        <div className="flex flex-col items-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 text-2xl font-black shadow-2xl shadow-violet-950/40">
            N
          </div>

          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />
            Carregando convite...
          </div>
        </div>
      </main>
    );
  }

  if (!invite) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0d10] px-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#18191c] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-2xl">
            !
          </div>

          <h1 className="text-xl font-bold text-white">
            Convite inválido
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {error ||
              "Este convite não existe ou não está mais disponível."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/servers")}
            className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Voltar para o Nexora
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0d10] px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#18191c] p-8 shadow-2xl">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-indigo-600 text-2xl font-black text-white">
            {invite.servers.icon ? (
              <img
                src={invite.servers.icon}
                alt={invite.servers.name}
                className="h-full w-full object-cover"
              />
            ) : (
              invite.servers.name
                .charAt(0)
                .toUpperCase()
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Convite para entrar em
          </p>

          <h1 className="mt-2 text-2xl font-bold text-white">
            {invite.servers.name}
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Você foi convidado para participar
            deste servidor no Nexora.
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleJoin}
          disabled={joining}
          className="mt-7 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {joining
            ? "Entrando..."
            : "Entrar no servidor"}
        </button>

        <p className="mt-4 text-center text-xs text-zinc-600">
          Convite: {invite.code}
        </p>
      </div>
    </main>
  );
}