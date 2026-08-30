"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { apiFetch } from "@/lib/api";

type InviteDialogProps = {
  serverId: string;
  serverName: string;
  onClose: () => void;
};

type InviteResponse = {
  id: string;
  code: string;
  server_id: string;
  created_at: string;
  expires_at: string | null;
  server: {
    id: string;
    name: string;
  };
};

export default function InviteDialog({
  serverId,
  serverName,
  onClose,
}: InviteDialogProps) {
  const [invite, setInvite] =
    useState<InviteResponse | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [error, setError] =
    useState("");

  async function generateInvite() {
    try {
      setLoading(true);
      setError("");

      const data =
        await apiFetch<InviteResponse>(
          `/servers/${serverId}/invites`,
          {
            method: "POST",
          },
        );

      setInvite(data);
    } catch (err) {
      console.error(
        "Erro ao gerar convite:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível gerar o convite.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyInvite() {
    if (!invite) {
      return;
    }

    const inviteUrl =
      `${window.location.origin}/invite/${invite.code}`;

    try {
      await navigator.clipboard.writeText(
        inviteUrl,
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(
        "Erro ao copiar convite:",
        err,
      );

      setError(
        "Não foi possível copiar o convite.",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#18191c] p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              Convidar pessoas
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              Compartilhe um convite para entrar em{" "}
              <span className="font-semibold text-zinc-200">
                {serverName}
              </span>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!invite ? (
          <div>
            <div className="mb-5 rounded-xl border border-white/10 bg-[#111214] p-4">
              <p className="text-sm leading-6 text-zinc-400">
                Gere um link exclusivo para que
                outras pessoas possam entrar
                diretamente neste servidor.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={generateInvite}
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Gerando convite..."
                : "Gerar convite"}
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 rounded-xl border border-white/10 bg-[#111214] p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Link do convite
              </p>

              <div className="break-all text-sm text-zinc-300">
                {window.location.origin}/invite/
                {invite.code}
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={copyInvite}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Convite copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar convite
                </>
              )}
            </button>

            <button
              type="button"
              onClick={generateInvite}
              disabled={loading}
              className="mt-2 w-full rounded-xl px-4 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              {loading
                ? "Gerando..."
                : "Gerar outro convite"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}