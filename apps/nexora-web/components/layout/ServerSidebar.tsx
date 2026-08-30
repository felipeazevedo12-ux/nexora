"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";

import InviteDialog from "@/components/server/InviteDialog";

type Server = {
  id: string;
  name: string;
};

type ServerSidebarProps = {
  servers: Server[];
  activeServerId?: string;
};

export default function ServerSidebar({
  servers,
  activeServerId,
}: ServerSidebarProps) {
  const [inviteServer, setInviteServer] =
    useState<Server | null>(null);

  return (
    <>
      <aside className="flex h-screen w-[72px] shrink-0 flex-col items-center bg-[#0b0d10] py-3">
        {/* Logo Nexora */}
        <Link
          href="/me"
          aria-label="Nexora"
          className="group relative mb-3 flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-black text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:rounded-[14px] hover:shadow-indigo-500/40"
        >
          N

          <span className="pointer-events-none absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-white opacity-0 transition-all duration-200 group-hover:h-5 group-hover:opacity-100" />
        </Link>

        {/* Separador */}
        <div className="mb-3 h-px w-8 bg-white/10" />

        {/* Servidores */}
        <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-2 overflow-y-auto px-2">
          {servers.map((server) => {
            const active =
              server.id === activeServerId;

            return (
              <Link
                key={server.id}
                href={`/servers/${server.id}`}
                title={server.name}
                className="group relative flex w-full justify-center"
              >
                {/* Indicador servidor ativo */}
                <span
                  className={[
                    "absolute left-[-8px] top-1/2 -translate-y-1/2 rounded-r-full bg-white transition-all duration-200",
                    active
                      ? "h-10 w-1"
                      : "h-0 w-1 group-hover:h-5",
                  ].join(" ")}
                />

                <div
                  className={[
                    "relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[18px] text-sm font-bold transition-all duration-200",
                    active
                      ? "rounded-[14px] bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-[#181a1f] text-zinc-400 hover:rounded-[14px] hover:bg-indigo-600 hover:text-white",
                  ].join(" ")}
                >
                  {server.name
                    .charAt(0)
                    .toUpperCase()}

                  {/* Tooltip */}
                  <div className="pointer-events-none absolute left-[58px] z-50 hidden whitespace-nowrap rounded-md bg-[#111214] px-3 py-2 text-xs font-semibold text-white shadow-xl group-hover:block">
                    {server.name}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Adicionar servidor */}
        <button
          type="button"
          title="Convidar pessoas"
          onClick={() => {
            if (!activeServerId) {
              return;
            }

            const server = servers.find(
              (item) =>
                item.id === activeServerId,
            );

            if (!server) {
              return;
            }

            setInviteServer(server);
          }}
          className="group relative mt-3 flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#181a1f] text-emerald-400 transition-all duration-200 hover:rounded-[14px] hover:bg-emerald-500 hover:text-white"
        >
          <Plus
            className="h-6 w-6"
            strokeWidth={2.2}
          />

          <div className="pointer-events-none absolute left-[58px] z-50 hidden whitespace-nowrap rounded-md bg-[#111214] px-3 py-2 text-xs font-semibold text-white shadow-xl group-hover:block">
            Convidar pessoas
          </div>
        </button>
      </aside>

      {/* Modal de convite */}
      {inviteServer && (
        <InviteDialog
          serverId={inviteServer.id}
          serverName={inviteServer.name}
          onClose={() => {
            setInviteServer(null);
          }}
        />
      )}
    </>
  );
}