"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from "lucide-react";

export default function RegisterPage() {
const router = useRouter();

const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

async function handleRegister(event: FormEvent<HTMLFormElement>) {
event.preventDefault();


setError("");

if (password !== confirmPassword) {
  setError("As senhas não coincidem.");
  return;
}

if (password.length < 8) {
  setError("A senha precisa ter pelo menos 8 caracteres.");
  return;
}

setLoading(true);

try {
  await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username: username.trim(),
      email: email.trim(),
      password,
    }),
  });

  router.replace("/login");
} catch (err) {
  setError(
    err instanceof Error
      ? err.message
      : "Não foi possível criar a conta.",
  );
} finally {
  setLoading(false);
}


}

const passwordStrength =
password.length === 0
? 0
: password.length < 8
? 1
: password.length < 12
? 2
: 3;

return ( <main className="relative min-h-screen overflow-hidden bg-[#08090c] text-white">
{/* Background */} <div className="pointer-events-none absolute inset-0"> <div className="absolute left-1/2 top-[-20%] h-[600px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[140px]" /> <div className="absolute bottom-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[130px]" /> <div className="absolute right-[-10%] top-[30%] h-[400px] w-[400px] rounded-full bg-fuchsia-600/5 blur-[120px]" /> </div>


  {/* Grid */}
  <div
    className="pointer-events-none absolute inset-0 opacity-[0.025]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
      backgroundSize: "48px 48px",
    }}
  />

  <div className="relative flex min-h-screen items-center justify-center px-5 py-10">
    <div className="w-full max-w-[460px]">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 text-2xl font-black shadow-2xl shadow-violet-900/40 ring-1 ring-white/10">
          N
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Crie sua conta
        </h1>

        <p className="mt-2 text-sm text-zinc-400">
          Entre no Nexora e comece a conversar.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111216]/95 p-7 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8">
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-zinc-200"
            >
              Nome de usuário
            </label>

            <div className="relative">
              <User className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Como você quer ser chamado?"
                autoComplete="username"
                required
                minLength={3}
                maxLength={32}
                className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#08090c] pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-zinc-600 hover:border-white/[0.14] focus:border-violet-500/70 focus:bg-[#0a0b0f] focus:ring-4 focus:ring-violet-500/10"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-zinc-200"
            >
              E-mail
            </label>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="seu@email.com"
                autoComplete="email"
                required
                className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#08090c] pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-zinc-600 hover:border-white/[0.14] focus:border-violet-500/70 focus:bg-[#0a0b0f] focus:ring-4 focus:ring-violet-500/10"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-zinc-200"
            >
              Senha
            </label>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Mínimo de 8 caracteres"
                autoComplete="new-password"
                required
                minLength={8}
                className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#08090c] pl-11 pr-12 text-sm text-white outline-none transition-all placeholder:text-zinc-600 hover:border-white/[0.14] focus:border-violet-500/70 focus:bg-[#0a0b0f] focus:ring-4 focus:ring-violet-500/10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
                aria-label={
                  showPassword
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>

            {/* Password strength */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition ${
                        level <= passwordStrength
                          ? "bg-violet-500"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-1.5 text-[11px] text-zinc-500">
                  {passwordStrength === 1
                    ? "Senha fraca"
                    : passwordStrength === 2
                      ? "Senha razoável"
                      : "Senha forte"}
                </p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-zinc-200"
            >
              Confirmar senha
            </label>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />

              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Digite sua senha novamente"
                autoComplete="new-password"
                required
                minLength={8}
                className={`h-12 w-full rounded-xl border bg-[#08090c] pl-11 pr-12 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:ring-4 ${
                  confirmPassword &&
                  confirmPassword !== password
                    ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/10"
                    : "border-white/[0.08] hover:border-white/[0.14] focus:border-violet-500/70 focus:ring-violet-500/10"
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (value) => !value,
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
                aria-label={
                  showConfirmPassword
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition-all hover:brightness-110 hover:shadow-violet-900/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Criando conta...
              </>
            ) : (
              <>
                Criar conta
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        {/* Login */}
        <div className="mt-7 border-t border-white/[0.06] pt-6">
          <p className="text-center text-sm text-zinc-500">
            Já possui uma conta?{" "}
            <a
              href="/login"
              className="font-semibold text-violet-400 transition hover:text-violet-300"
            >
              Entrar
            </a>
          </p>
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



