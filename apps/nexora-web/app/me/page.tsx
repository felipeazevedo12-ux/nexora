"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Image,
  Save,
  User,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/use-auth-store";

export default function MePage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const initialized = useAuthStore(
    (state) => state.initialized,
  );
  const setUser = useAuthStore((state) => state.setUser);

  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [banner, setBanner] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialized || loading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    setNickname(user.nickname ?? "");
    setBio(user.bio ?? "");
    setAvatar(user.avatar ?? "");
    setBanner(user.banner ?? "");
  }, [initialized, loading, user, router]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!user || saving) {
      return;
    }

    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const updatedUser = await apiFetch<
        typeof user
      >("/users/me", {
        method: "PATCH",
        body: JSON.stringify({
          nickname:
            nickname.trim() || null,
          bio:
            bio.trim() || null,
          avatar:
            avatar.trim() || null,
          banner:
            banner.trim() || null,
        }),
      });

      setUser(updatedUser);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.error(
        "Erro ao atualizar perfil:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível atualizar seu perfil.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (!initialized || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07070a] text-white">
        <div className="flex flex-col items-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 text-2xl font-black shadow-2xl shadow-violet-950/40">
            N
          </div>

          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />
            Carregando perfil...
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const initial =
    user.username.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-[#0b0d10] text-white">
      {/* HEADER */}
      <header className="border-b border-white/[0.06] bg-[#090a0c]">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-6">
          <button
            type="button"
            onClick={() => router.push("/servers")}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <div className="ml-5 h-5 w-px bg-white/[0.08]" />

          <div className="ml-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
              <User size={18} />
            </div>

            <div>
              <h1 className="text-sm font-semibold">
                Meu perfil
              </h1>

              <p className="text-xs text-zinc-600">
                Personalize sua identidade no Nexora
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* PROFILE CARD */}
        <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111214] shadow-2xl shadow-black/20">
          {/* BANNER */}
          <div
            className="relative h-48 overflow-hidden bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800"
            style={
              banner
                ? {
                    backgroundImage: `url(${banner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute bottom-4 left-6">
              <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#111214] bg-gradient-to-br from-violet-500 to-indigo-600 text-3xl font-bold shadow-xl">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>
            </div>
          </div>

          {/* PROFILE INFO */}
          <div className="px-6 pb-7 pt-5">
            <div className="ml-28">
              <h2 className="text-xl font-bold">
                {user.nickname ||
                  user.username}
              </h2>

              <p className="text-sm text-zinc-500">
                @{user.username}
              </p>
            </div>
          </div>
        </section>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]"
        >
          <section className="rounded-2xl border border-white/[0.07] bg-[#111214] p-6">
            <div className="mb-6">
              <h2 className="text-base font-semibold">
                Informações do perfil
              </h2>

              <p className="mt-1 text-sm text-zinc-600">
                Essas informações serão exibidas para
                outras pessoas no Nexora.
              </p>
            </div>

            <div className="space-y-5">
              {/* USERNAME */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Username
                </label>

                <input
                  value={user.username}
                  disabled
                  className="h-11 w-full rounded-xl border border-white/[0.06] bg-[#0d0e10] px-4 text-sm text-zinc-600 outline-none"
                />

                <p className="mt-1.5 text-xs text-zinc-700">
                  O username não pode ser alterado
                  por esta página.
                </p>
              </div>

              {/* NICKNAME */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Nickname
                </label>

                <input
                  value={nickname}
                  onChange={(event) =>
                    setNickname(event.target.value)
                  }
                  maxLength={32}
                  placeholder={user.username}
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0d0e10] px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
                />

                <div className="mt-1 flex justify-end text-xs text-zinc-700">
                  {nickname.length}/32
                </div>
              </div>

              {/* BIO */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Biografia
                </label>

                <textarea
                  value={bio}
                  onChange={(event) =>
                    setBio(event.target.value)
                  }
                  maxLength={500}
                  rows={5}
                  placeholder="Conte um pouco sobre você..."
                  className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#0d0e10] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
                />

                <div className="mt-1 flex justify-end text-xs text-zinc-700">
                  {bio.length}/500
                </div>
              </div>

              {/* AVATAR */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                  <User size={14} />
                  Avatar
                </label>

                <input
                  value={avatar}
                  onChange={(event) =>
                    setAvatar(event.target.value)
                  }
                  placeholder="https://..."
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0d0e10] px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
                />

                <p className="mt-1.5 text-xs text-zinc-700">
                  Cole a URL de uma imagem.
                </p>
              </div>

              {/* BANNER */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                  <Image size={14} />
                  Banner
                </label>

                <input
                  value={banner}
                  onChange={(event) =>
                    setBanner(event.target.value)
                  }
                  placeholder="https://..."
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0d0e10] px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
                />

                <p className="mt-1.5 text-xs text-zinc-700">
                  Cole a URL de uma imagem para o banner.
                </p>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-5 rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* SAVE */}
            <div className="mt-7 flex items-center justify-end gap-3 border-t border-white/[0.06] pt-5">
              {saved && (
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <Check size={16} />
                  Alterações salvas
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Salvar alterações
                  </>
                )}
              </button>
            </div>
          </section>

          {/* PREVIEW */}
          <aside className="h-fit rounded-2xl border border-white/[0.07] bg-[#111214] p-5">
            <div className="mb-5">
              <h2 className="text-sm font-semibold">
                Pré-visualização
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Veja como seu perfil aparecerá.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#0d0e10]">
              <div
                className="h-20 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800"
                style={
                  banner
                    ? {
                        backgroundImage: `url(${banner})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              />

              <div className="relative px-4 pb-4">
                <div className="-mt-7 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-4 border-[#0d0e10] bg-gradient-to-br from-violet-500 to-indigo-600 text-lg font-bold">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initial
                  )}
                </div>

                <h3 className="mt-3 text-sm font-bold">
                  {nickname ||
                    user.username}
                </h3>

                <p className="text-xs text-zinc-600">
                  @{user.username}
                </p>

                {bio && (
                  <p className="mt-3 text-xs leading-5 text-zinc-500">
                    {bio}
                  </p>
                )}
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}