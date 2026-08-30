"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
Hash,
LogOut,
Plus,
Settings,
User,
Users,
Volume2,
X,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/use-auth-store";

type Server = {
id: string;
name: string;
icon?: string | null;
owner_id?: string;
created_at?: string;
};

type Channel = {
id: string;
server_id: string;
name: string;
type: string;
created_at: string;
};

export default function ServersPage() {
const router = useRouter();

const user = useAuthStore((state) => state.user);
const authLoading = useAuthStore((state) => state.loading);
const initialized = useAuthStore((state) => state.initialized);
const logout = useAuthStore((state) => state.logout);

const [servers, setServers] = useState<Server[]>([]);
const [channels, setChannels] = useState<Channel[]>([]);
const [selectedServer, setSelectedServer] =
useState<Server | null>(null);

const [loadingServers, setLoadingServers] = useState(true);
const [loadingChannels, setLoadingChannels] = useState(false);
const [loggingOut, setLoggingOut] = useState(false);
const [error, setError] = useState("");

const [createServerOpen, setCreateServerOpen] =
useState(false);
const [serverName, setServerName] = useState("");
const [creatingServer, setCreatingServer] =
useState(false);
const [createServerError, setCreateServerError] =
useState("");

/*

* Proteção da página.
*
* O AuthProvider já chama loadUser().
* Aqui esperamos a sessão ser inicializada antes
* de decidir se o usuário pode permanecer na página.
  */
  useEffect(() => {
  if (!initialized || authLoading) {
  return;
  }


if (!user) {



  router.replace("/login");
}


}, [initialized, authLoading, user, router]);

/*

* Carrega os servidores somente depois que
* sabemos que o usuário está autenticado.
  */
  useEffect(() => {
  if (!initialized || authLoading || !user) {
  return;
  }


async function loadServers() {



  try {
    setLoadingServers(true);
    setError("");

    const data = await apiFetch<Server[]>("/servers");

    const serverList = data ?? [];

    setServers(serverList);

    if (serverList.length > 0) {
      setSelectedServer(serverList[0]);
    }
  } catch (err) {
    console.error(
      "Erro ao carregar servidores:",
      err,
    );

    setError(
      err instanceof Error
        ? err.message
        : "Não foi possível carregar seus servidores.",
    );
  } finally {
    setLoadingServers(false);
  }
}

loadServers();


}, [initialized, authLoading, user]);

/*

* Carrega os canais do servidor selecionado.
  */
  useEffect(() => {
  if (!selectedServer) {
  setChannels([]);
  return;
  }


async function loadChannels() {



  try {
    setLoadingChannels(true);

    const data = await apiFetch<Channel[]>(
      `/channels/server/${selectedServer.id}`,
    );

    setChannels(data ?? []);
  } catch (err) {
    console.error(
      "Erro ao carregar canais:",
      err,
    );

    setChannels([]);
  } finally {
    setLoadingChannels(false);
  }
}

loadChannels();


}, [selectedServer]);

/*

* Cria um novo servidor.
  */
  async function handleCreateServer() {
  const name = serverName.trim();


if (!name) {



  setCreateServerError(
    "Digite um nome para o servidor.",
  );
  return;
}

if (name.length < 2) {
  setCreateServerError(
    "O nome do servidor precisa ter pelo menos 2 caracteres.",
  );
  return;
}

if (name.length > 100) {
  setCreateServerError(
    "O nome do servidor pode ter no máximo 100 caracteres.",
  );
  return;
}

if (creatingServer) {
  return;
}

try {
  setCreatingServer(true);
  setCreateServerError("");

  const newServer = await apiFetch<Server>(
    "/servers",
    {
      method: "POST",
      body: JSON.stringify({
        name,
      }),
    },
  );

  setServers((currentServers) => [
    ...currentServers,
    newServer,
  ]);

  setSelectedServer(newServer);

  setServerName("");
  setCreateServerOpen(false);
} catch (err) {
  console.error(
    "Erro ao criar servidor:",
    err,
  );

  setCreateServerError(
    err instanceof Error
      ? err.message
      : "Não foi possível criar o servidor.",
  );
} finally {
  setCreatingServer(false);
}


}

function openCreateServerModal() {
setServerName("");
setCreateServerError("");
setCreateServerOpen(true);
}

function closeCreateServerModal() {
if (creatingServer) {
return;
}


setCreateServerOpen(false);
setServerName("");
setCreateServerError("");


}

async function handleLogout() {
if (loggingOut) {
return;
}


try {
  setLoggingOut(true);

  await logout();

  router.replace("/login");
} catch (err) {
  console.error("Erro ao sair:", err);
  setLoggingOut(false);
}


}

function openChannel(channel: Channel) {
if (!selectedServer) {
return;
}


router.push(
  `/servers/${selectedServer.id}/${channel.id}`,
);


}

/*

* Enquanto a sessão ainda está sendo verificada,
* não mostramos conteúdo protegido.
  */
  if (!initialized || authLoading) {
  return (

   <main className="flex min-h-screen items-center justify-center bg-[#07070a] text-white">
     <div className="flex flex-col items-center">
       <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 text-2xl font-black shadow-2xl shadow-violet-950/40">
         N
       </div>

  
   <div className="flex items-center gap-3 text-sm text-zinc-400">
     <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />
     Verificando sessão...
   </div>
  

     </div>
   </main>


);


}

/*

* Enquanto o router redireciona para login,
* evitamos renderizar a área privada.
  */
  if (!user) {
  return null;
  }

if (loadingServers) {
return ( <main className="flex min-h-screen items-center justify-center bg-[#07070a] text-white"> <div className="flex flex-col items-center"> <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 text-2xl font-black shadow-2xl shadow-violet-950/40">
N </div>


      <div className="flex items-center gap-3 text-sm text-zinc-400">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />
        Carregando Nexora...
      </div>
    </div>
  </main>
);


}

if (error) {
return ( <main className="flex min-h-screen items-center justify-center bg-[#07070a] px-6 text-center text-white"> <div> <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-2xl">
! </div>


      <h1 className="text-xl font-bold">
        Não foi possível carregar o Nexora
      </h1>

      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
        {error}
      </p>

      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-6 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-violet-500"
      >
        Tentar novamente
      </button>
    </div>
  </main>
);


}

const initial =
user.username?.charAt(0).toUpperCase() ?? "U";

return (
<> <main className="flex min-h-screen overflow-hidden bg-[#0b0d10] text-white">


    {/* SERVER SIDEBAR */}
    <aside className="flex w-[76px] shrink-0 flex-col items-center border-r border-white/[0.06] bg-[#090a0c] py-4">

      {/* Nexora */}
      <button
        type="button"
        onClick={() => router.push("/servers")}
        title="Nexora"
        className="group relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 text-lg font-black shadow-lg shadow-violet-950/30 transition-all duration-200 hover:scale-105 hover:rounded-xl"
      >
        N

        <span className="absolute left-[-5px] h-7 w-1 rounded-r-full bg-white opacity-0 transition-opacity group-hover:opacity-100" />
      </button>

      <div className="my-4 h-px w-8 bg-white/[0.08]" />

      {/* Servers */}
      <div className="flex w-full flex-1 flex-col items-center gap-3 overflow-y-auto px-2">

        {servers.map((server) => {
          const active =
            selectedServer?.id === server.id;

          const serverInitial =
            server.name.charAt(0).toUpperCase();

          return (
            <button
              key={server.id}
              type="button"
              onClick={() =>
                setSelectedServer(server)
              }
              title={server.name}
              className={`group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold transition-all duration-200 ${
                active
                  ? "rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-950/30"
                  : "bg-[#18191c] text-zinc-400 hover:rounded-xl hover:bg-violet-600 hover:text-white"
              }`}
            >
              {server.icon ? (
                <img
                  src={server.icon}
                  alt={server.name}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                serverInitial
              )}

              {active && (
                <span className="absolute left-[-6px] h-8 w-1 rounded-r-full bg-white" />
              )}

              {!active && (
                <span className="absolute left-[-6px] h-2 w-1 rounded-r-full bg-white opacity-0 transition-all group-hover:h-6 group-hover:opacity-100" />
              )}
            </button>
          );
        })}

        {/* Add server */}
        <button
          type="button"
          onClick={openCreateServerModal}
          title="Criar servidor"
          className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#18191c] text-emerald-400 transition-all hover:rounded-xl hover:bg-emerald-500 hover:text-white"
        >
          <Plus size={21} />
        </button>

      </div>

      {/* Account */}
      <div className="mt-3 flex flex-col items-center gap-3">

        <button
          type="button"
          onClick={() => router.push("/me")}
          title="Minha conta"
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#18191c] text-zinc-400 transition-all hover:rounded-xl hover:bg-violet-600 hover:text-white"
        >
          <User size={20} />
        </button>

      </div>
    </aside>

    {/* CHANNEL SIDEBAR */}
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-white/[0.06] bg-[#111214]">

      {/* Server header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] px-4">

        <div className="min-w-0">
          <p className="truncate text-sm font-bold">
            {selectedServer?.name ?? "Nexora"}
          </p>

          <p className="mt-0.5 text-xs text-zinc-500">
            {servers.length}{" "}
            {servers.length === 1
              ? "servidor"
              : "servidores"}
          </p>
        </div>

        <button
          type="button"
          title="Configurações do servidor"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/[0.06] hover:text-white"
        >
          <Settings size={17} />
        </button>

      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto px-3 py-5">

        <div className="mb-2 flex items-center justify-between px-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Canais de texto
          </p>

          <button
            type="button"
            title="Criar canal"
            className="text-zinc-500 transition hover:text-white"
          >
            <Plus size={16} />
          </button>
        </div>

        {loadingChannels ? (
          <div className="px-2 py-4 text-xs text-zinc-600">
            Carregando canais...
          </div>
        ) : channels.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/[0.07] px-3 py-5 text-center">
            <p className="text-xs text-zinc-600">
              Nenhum canal disponível.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {channels.map((channel) => (
              <button
                key={channel.id}
                type="button"
                onClick={() =>
                  openChannel(channel)
                }
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-zinc-100"
              >
                {channel.type === "VOICE" ? (
                  <Volume2 size={18} />
                ) : (
                  <Hash size={18} />
                )}

                <span className="truncate">
                  {channel.name}
                </span>
              </button>
            ))}
          </div>
        )}

      </div>

      {/* User panel */}
      <div className="border-t border-white/[0.06] bg-[#0d0e10] p-3">

        <div className="flex items-center gap-3">

          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                initial
              )}
            </div>

            <span className="absolute bottom-[-1px] right-[-1px] h-3 w-3 rounded-full border-2 border-[#0d0e10] bg-emerald-500" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {user.username}
            </p>

            <p className="truncate text-xs text-zinc-600">
              Online
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            title="Sair"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
          >
            <LogOut size={17} />
          </button>

        </div>

      </div>
    </aside>

    {/* MAIN */}
    <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#111214]">

      {/* Header */}
      <header className="flex h-16 shrink-0 items-center border-b border-white/[0.06] px-6">

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
            <Users size={18} />
          </div>

          <div>
            <h1 className="text-sm font-semibold">
              {selectedServer?.name ?? "Nexora"}
            </h1>

            <p className="text-xs text-zinc-600">
              Workspace
            </p>
          </div>
        </div>

      </header>

      {/* Welcome */}
      <div className="flex flex-1 items-center justify-center px-6">

        <div className="max-w-xl text-center">

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 text-3xl font-black shadow-2xl shadow-violet-950/30">
            {selectedServer?.icon ? (
              <img
                src={selectedServer.icon}
                alt={selectedServer.name}
                className="h-full w-full object-cover"
              />
            ) : (
              "N"
            )}
          </div>

          <h2 className="text-3xl font-bold tracking-tight">
            Bem-vindo ao Nexora
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
            Selecione um canal na lateral para começar a
            conversar. Seus servidores e canais aparecerão
            aqui conforme você navegar pelo workspace.
          </p>

          {selectedServer &&
            channels.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  openChannel(channels[0])
                }
                className="mt-7 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 hover:shadow-violet-950/50"
              >
                Abrir #{channels[0].name}
              </button>
            )}

        </div>

      </div>

    </section>

  </main>

  {/* CREATE SERVER MODAL */}
  {createServerOpen && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeCreateServerModal();
        }
      }}
    >
      <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#111214] p-7 shadow-2xl shadow-black/60">

        {/* Modal header */}
        <div className="mb-6 flex items-start justify-between">

          <div>
            <h2 className="text-xl font-bold">
              Criar um servidor
            </h2>

            <p className="mt-1 text-sm leading-5 text-zinc-500">
              Crie um espaço para conversar com seus amigos.
            </p>
          </div>

          <button
            type="button"
            onClick={closeCreateServerModal}
            disabled={creatingServer}
            title="Fechar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
          >
            <X size={18} />
          </button>

        </div>

        {/* Server icon preview */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 text-3xl font-black shadow-xl shadow-violet-950/30">
            {serverName.trim()
              ? serverName
                  .trim()
                  .charAt(0)
                  .toUpperCase()
              : "N"}
          </div>
        </div>

        {/* Server name */}
        <div>
          <label
            htmlFor="server-name"
            className="mb-2 block text-sm font-medium text-zinc-200"
          >
            Nome do servidor
          </label>

          <input
            id="server-name"
            type="text"
            value={serverName}
            onChange={(event) => {
              setServerName(event.target.value);
              setCreateServerError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleCreateServer();
              }

              if (event.key === "Escape") {
                closeCreateServerModal();
              }
            }}
            placeholder="Meu servidor"
            maxLength={100}
            autoFocus
            disabled={creatingServer}
            className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500/70 focus:bg-black/40 focus:ring-4 focus:ring-violet-500/10 disabled:opacity-50"
          />

          <div className="mt-2 flex justify-between">
            <p className="text-xs text-zinc-600">
              Você poderá personalizar o servidor depois.
            </p>

            <span className="text-xs text-zinc-600">
              {serverName.length}/100
            </span>
          </div>
        </div>

        {/* Error */}
        {createServerError && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3">
            <p className="text-sm leading-5 text-red-400">
              {createServerError}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-7 flex gap-3">

          <button
            type="button"
            onClick={closeCreateServerModal}
            disabled={creatingServer}
            className="h-11 flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleCreateServer}
            disabled={
              creatingServer ||
              !serverName.trim()
            }
            className="h-11 flex-1 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creatingServer
              ? "Criando..."
              : "Criar servidor"}
          </button>

        </div>

      </div>
    </div>
  )}
</>


);
}
