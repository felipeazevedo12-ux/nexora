"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/use-auth-store";

type LoginResponse = {
user: {
id: string;
username: string;
email: string;
nickname: string | null;
bio: string | null;
avatar: string | null;
banner: string | null;
created_at: string;
updated_at: string;
};
};

export default function LoginPage() {
const router = useRouter();
const setUser = useAuthStore((state) => state.setUser);

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

async function handleSubmit(
event: FormEvent<HTMLFormElement>,
) {
event.preventDefault();


setError("");

if (!email.trim() || !password) {
  setError("Preencha seu e-mail e sua senha.");
  return;
}

try {
  setLoading(true);

  const data = await apiFetch<LoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    },
  );

  setUser(data.user);

  router.replace("/servers");
} catch (err) {
  console.error("Erro no login:", err);

  setError(
    err instanceof Error
      ? err.message
      : "Não foi possível entrar na sua conta.",
  );
} finally {
  setLoading(false);
}


}

return ( <main className="relative flex min-h-screen overflow-hidden bg-[#07070a] text-white">
{/* Background */} <div className="pointer-events-none absolute inset-0"> <div className="absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[140px]" />


    <div className="absolute bottom-[-200px] left-[-100px] h-[450px] w-[450px] rounded-full bg-indigo-600/10 blur-[130px]" />

    <div className="absolute right-[-150px] top-1/3 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[130px]" />
  </div>

  {/* Grid */}
  <div
    className="pointer-events-none absolute inset-0 opacity-[0.035]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
      backgroundSize: "48px 48px",
    }}
  />

  {/* Content */}
  <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-5 py-10">
    <div className="w-full max-w-[430px]">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center">
        <Link
          href="/login"
          className="group mb-5 flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 text-xl font-black shadow-xl shadow-violet-950/40 transition duration-300 group-hover:scale-105">
            N
          </div>

          <span className="text-2xl font-bold tracking-tight">
            Nexora
          </span>
        </Link>

        <h1 className="text-center text-3xl font-bold tracking-tight">
          Bem-vindo de volta
        </h1>

        <p className="mt-2 text-center text-sm text-zinc-400">
          Entre na sua conta para continuar.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-7 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-zinc-200"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="voce@exemplo.com"
              autoComplete="email"
              required
              className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500/70 focus:bg-black/40 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-200"
              >
                Senha
              </label>

              <button
                type="button"
                className="text-xs font-medium text-violet-400 transition hover:text-violet-300"
              >
                Esqueceu a senha?
              </button>
            </div>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
              className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500/70 focus:bg-black/40 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3">
              <p className="text-sm leading-5 text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition duration-200 hover:scale-[1.01] hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            <span className="relative z-10">
              {loading ? "Entrando..." : "Entrar"}
            </span>

            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>
        </form>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/[0.08]" />

          <span className="text-xs text-zinc-600">
            ou
          </span>

          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>

        {/* Register */}
        <div className="text-center">
          <p className="text-sm text-zinc-400">
            Ainda não possui uma conta?
          </p>

          <Link
            href="/register"
            className="mt-2 inline-block text-sm font-semibold text-violet-400 transition hover:text-violet-300"
          >
            Criar uma conta
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-7 text-center text-xs text-zinc-600">
        © 2026 Nexora. Todos os direitos reservados.
      </p>
    </div>
  </div>
</main>


);
}
