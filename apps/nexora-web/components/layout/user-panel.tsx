"use client";

import { LogOut, Settings } from "lucide-react";

export function UserPanel() {
  return (
    <div className="flex h-[72px] items-center justify-between bg-[#17191c] px-3">
      <div className="flex min-w-0 items-center gap-2">
        <div className="relative">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
            D
          </div>

          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#17191c] bg-green-500" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            Draks123
          </p>

          <p className="text-xs text-zinc-500">
            Online
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <button
          type="button"
          className="rounded-md p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          <Settings size={17} />
        </button>

        <button
          type="button"
          className="rounded-md p-2 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={17} />
        </button>
      </div>
    </div>
  );
}