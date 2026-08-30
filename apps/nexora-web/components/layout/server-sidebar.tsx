"use client";

import { Plus } from "lucide-react";

export function ServerSidebar() {
  return (
    <aside className="flex h-full w-[72px] flex-col items-center bg-[#111214] py-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-lg font-bold text-white">
        N
      </div>

      <div className="mt-4 h-px w-8 bg-white/10" />

      <button
        type="button"
        className="mt-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1e1f22] text-white transition hover:rounded-xl hover:bg-violet-600"
      >
        N
      </button>

      <button
        type="button"
        className="mt-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1e1f22] text-zinc-400 transition hover:rounded-xl hover:bg-violet-600 hover:text-white"
      >
        <Plus size={22} />
      </button>
    </aside>
  );
}