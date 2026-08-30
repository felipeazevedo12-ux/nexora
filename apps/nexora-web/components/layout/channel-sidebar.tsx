"use client";

import { Hash, Plus, Settings } from "lucide-react";

export function ChannelSidebar() {
  return (
    <aside className="flex h-full w-60 flex-col bg-[#1b1d21] text-zinc-300">
      <header className="flex h-14 items-center justify-between border-b border-black/20 px-4 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Nexora Oficial
          </h2>

          <p className="text-xs text-zinc-500">
            1 servidor
          </p>
        </div>

        <button
          type="button"
          className="rounded-md p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          <Settings size={17} />
        </button>
      </header>

      <div className="flex-1 px-2 py-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-[11px] font-bold tracking-wide text-zinc-500">
            CANAIS DE TEXTO
          </span>

          <button
            type="button"
            className="text-zinc-500 transition hover:text-white"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          type="button"
          className="mt-2 flex w-full items-center gap-2 rounded-md bg-white/10 px-2 py-2 text-sm font-medium text-white"
        >
          <Hash size={19} className="text-zinc-400" />
          geral
        </button>
      </div>
    </aside>
  );
}