"use client";

import {
FormEvent,
useEffect,
useRef,
useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import {
ArrowLeft,
Hash,
Send,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/use-auth-store";
import { useSocket } from "@/hooks/use-socket";

import ServerSidebar from "@/components/layout/ServerSidebar";
import ChannelSidebar from "@/components/layout/ChannelSidebar";
import UserPanel from "@/components/layout/UserPanel";

import "@/components/layout/nexora-layout.css";

type Server = {
id: string;
name: string;
};

type Channel = {
id: string;
server_id: string;
name: string;
type: string;
created_at: string;
};

type Message = {
id: string;
channel_id: string;
author_id: string;
content: string;
created_at: string;
users: {
id: string;
username: string;
avatar: string | null;
};
};

export default function ChannelPage() {
const router = useRouter();
const params = useParams();

const serverId = String(params.serverId);
const channelId = String(params.channelId);

const socketRef = useSocket();

const user = useAuthStore((state) => state.user);
const initialized = useAuthStore(
(state) => state.initialized,
);
const loading = useAuthStore(
(state) => state.loading,
);

const [servers, setServers] = useState<Server[]>([]);
const [channels, setChannels] = useState<Channel[]>([]);
const [channel, setChannel] = useState<Channel | null>(null);
const [messages, setMessages] = useState<Message[]>([]);
const [content, setContent] = useState("");
const [loadingChannel, setLoadingChannel] = useState(true);
const [sending, setSending] = useState(false);
const [error, setError] = useState("");

const messagesEndRef = useRef<HTMLDivElement | null>(null);

/*

* AUTENTICAÇÃO
  */
  useEffect(() => {
  if (!initialized || loading) {
  return;
  }


if (!user) {



  router.replace("/login");
}


}, [
initialized,
loading,
user,
router,
]);

/*

* CARREGAR DADOS
  */
  useEffect(() => {
  if (
  !initialized ||
  loading ||
  !user ||
  !serverId ||
  !channelId
  ) {
  return;
  }


let cancelled = false;



async function loadChannel() {
  try {
    setLoadingChannel(true);
    setError("");

    const [
      serversData,
      channelsData,
      channelData,
      messagesData,
    ] = await Promise.all([
      apiFetch<Server[]>("/servers"),

      apiFetch<Channel[]>(
        `/channels/server/${serverId}`,
      ),

      apiFetch<Channel>(
        `/channels/${channelId}`,
      ),

      apiFetch<Message[]>(
        `/messages/channel/${channelId}`,
      ),
    ]);

    if (cancelled) {
      return;
    }

    setServers(serversData);
    setChannels(channelsData);
    setChannel(channelData);
    setMessages(messagesData);
  } catch (err) {
    if (cancelled) {
      return;
    }

    console.error(
      "Erro ao carregar canal:",
      err,
    );

    setError(
      err instanceof Error
        ? err.message
        : "Não foi possível carregar o canal.",
    );
  } finally {
    if (!cancelled) {
      setLoadingChannel(false);
    }
  }
}

loadChannel();

return () => {
  cancelled = true;
};


}, [
serverId,
channelId,
initialized,
loading,
user,
]);

/*

* REALTIME
*
* Entra na room do canal quando o Socket.IO
* estiver conectado.
  */
  useEffect(() => {
  const socket = socketRef.current;


if (!socket || !channelId || !user) {



  return;
}

const joinChannel = () => {
  console.log(
    "[NEXORA REALTIME] Entrando no canal:",
    channelId,
  );

  socket.emit(
    "channel:join",
    channelId,
  );
};

const leaveChannel = () => {
  console.log(
    "[NEXORA REALTIME] Saindo do canal:",
    channelId,
  );

  socket.emit(
    "channel:leave",
    channelId,
  );
};

const handleMessage = (
  incomingMessage: Message,
) => {
  if (!incomingMessage) {
    return;
  }

  if (
    incomingMessage.channel_id !==
    channelId
  ) {
    return;
  }

  console.log(
    "[NEXORA REALTIME] Mensagem recebida:",
    incomingMessage,
  );

  setMessages((current) => {
    const exists = current.some(
      (item) =>
        item.id ===
        incomingMessage.id,
    );

    if (exists) {
      return current;
    }

    return [
      ...current,
      incomingMessage,
    ];
  });
};

/*
 * Entrar quando conectar.
 */
socket.on(
  "connect",
  joinChannel,
);

/*
 * Receber mensagens.
 */
socket.on(
  "message:new",
  handleMessage,
);

/*
 * Se já estiver conectado, entra imediatamente.
 */
if (socket.connected) {
  joinChannel();
}

return () => {
  leaveChannel();

  socket.off(
    "connect",
    joinChannel,
  );

  socket.off(
    "message:new",
    handleMessage,
  );
};


}, [
channelId,
user,
socketRef,
]);

/*

* SCROLL AUTOMÁTICO
  */
  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
  behavior: "smooth",
  });
  }, [messages]);

/*

* ENVIAR MENSAGEM
  */
  async function handleSubmit(
  event: FormEvent<HTMLFormElement>,
  ) {
  event.preventDefault();


const trimmedContent =



  content.trim();

if (
  !trimmedContent ||
  sending ||
  !user
) {
  return;
}

try {
  setSending(true);
  setError("");

  /*
   * Salva primeiro no backend.
   */
  const message =
    await apiFetch<Message>(
      `/messages/channel/${channelId}`,
      {
        method: "POST",
        body: JSON.stringify({
          content: trimmedContent,
        }),
      },
    );

  /*
   * O backend devolve a mensagem.
   *
   * Depois enviamos pelo Socket.IO
   * para os outros clientes da room.
   */
  const socket =
    socketRef.current;

  if (socket?.connected) {
    console.log(
      "[NEXORA REALTIME] Enviando mensagem:",
      message.id,
    );

    socket.emit(
      "message:send",
      message,
    );
  } else {
    /*
     * Fallback local caso o realtime
     * esteja temporariamente offline.
     */
    console.warn(
      "[NEXORA REALTIME] Socket offline. Adicionando mensagem localmente.",
    );

    setMessages((current) => {
      const exists = current.some(
        (item) =>
          item.id === message.id,
      );

      if (exists) {
        return current;
      }

      return [
        ...current,
        message,
      ];
    });
  }

  setContent("");
} catch (err) {
  console.error(
    "Erro ao enviar mensagem:",
    err,
  );

  setError(
    err instanceof Error
      ? err.message
      : "Não foi possível enviar a mensagem.",
  );
} finally {
  setSending(false);
}


}

/*

* LOADING
  */
  if (
  !initialized ||
  loading ||
  loadingChannel
  ) {
  return (

   <main className="flex min-h-screen items-center justify-center bg-[#0b0d10] text-white">
     <div className="flex items-center gap-3 text-sm text-zinc-400">
       <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />
       Carregando canal...
     </div>
   </main>


);


}

/*

* NÃO AUTENTICADO
  */
  if (!user) {
  return null;
  }

const currentServer =
servers.find(
(server) =>
server.id === serverId,
);

return ( <main className="flex h-screen w-full overflow-hidden bg-[#111214] text-white"> <ServerSidebar
     servers={servers}
     activeServerId={serverId}
   />


  <div className="flex min-w-0 flex-1">
    <div className="flex w-[240px] shrink-0 flex-col bg-[#18191c]">
      <div className="min-h-0 flex-1 overflow-hidden">
        <ChannelSidebar
          serverId={serverId}
          serverName={
            currentServer?.name ??
            "Servidor"
          }
          channels={channels}
          activeChannelId={channelId}
        />
      </div>

      <div className="shrink-0">
        <UserPanel
          username={user.username}
          email={user.email}
        />
      </div>
    </div>

    <section className="flex min-w-0 flex-1 flex-col bg-[#0b0d10]">
      <header className="flex h-16 shrink-0 items-center border-b border-white/[0.06] bg-[#111214] px-5">
        <button
          type="button"
          onClick={() =>
            router.push(
              `/servers/${serverId}`,
            )
          }
          className="mr-4 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/[0.05] hover:text-white"
          title="Voltar"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="mr-4 h-5 w-px bg-white/[0.08]" />

        <div className="flex items-center gap-2">
          <Hash
            size={20}
            className="text-zinc-500"
          />

          <h1 className="text-sm font-bold">
            {channel?.name ??
              "canal"}
          </h1>
        </div>

        <div className="ml-4 h-5 w-px bg-white/[0.06]" />

        <p className="ml-4 text-xs text-zinc-600">
          Canal de texto
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
          <div className="mx-auto flex max-w-4xl flex-col">
            {messages.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center py-32 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
                  <Hash
                    size={30}
                    className="text-violet-400"
                  />
                </div>

                <h2 className="text-lg font-bold">
                  Bem-vindo ao #
                  {channel?.name}
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                  Este é o começo
                  deste canal.
                  Envie a primeira
                  mensagem e
                  comece a
                  conversa.
                </p>
              </div>
            ) : (
              messages.map(
                (message) => {
                  const isOwn =
                    message.author_id ===
                    user.id;

                  const initial =
                    message.users.username
                      .charAt(0)
                      .toUpperCase();

                  const time =
                    new Date(
                      message.created_at,
                    ).toLocaleTimeString(
                      "pt-BR",
                      {
                        hour: "2-digit",
                        minute:
                          "2-digit",
                      },
                    );

                  return (
                    <div
                      key={
                        message.id
                      }
                      className="group flex gap-3 rounded-lg px-3 py-2 transition hover:bg-white/[0.02]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold">
                        {message
                          .users
                          .avatar ? (
                          <img
                            src={
                              message
                                .users
                                .avatar
                            }
                            alt={
                              message
                                .users
                                .username
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          initial
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span
                            className={`text-sm font-semibold ${
                              isOwn
                                ? "text-violet-400"
                                : "text-white"
                            }`}
                          >
                            {
                              message
                                .users
                                .username
                            }
                          </span>

                          <span className="text-[11px] text-zinc-700">
                            {time}
                          </span>
                        </div>

                        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-300">
                          {
                            message.content
                          }
                        </p>
                      </div>
                    </div>
                  );
                },
              )
            )}

            <div
              ref={
                messagesEndRef
              }
            />
          </div>
        </div>

        {error && (
          <div className="mx-auto w-full max-w-4xl px-5">
            <div className="mb-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          </div>
        )}

        <div className="shrink-0 px-5 pb-5">
          <form
            onSubmit={
              handleSubmit
            }
            className="mx-auto flex max-w-4xl items-end gap-3 rounded-2xl border border-white/[0.07] bg-[#151619] p-2 shadow-xl"
          >
            <textarea
              value={content}
              onChange={(event) =>
                setContent(
                  event.target
                    .value,
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                    "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();

                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder={`Enviar mensagem em #${
                channel?.name ??
                "canal"
              }`}
              maxLength={2000}
              rows={1}
              disabled={sending}
              className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-600 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={
                sending ||
                !content.trim()
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
              title="Enviar mensagem"
            >
              {sending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                <Send size={17} />
              )}
            </button>
          </form>

          <p className="mx-auto mt-2 max-w-4xl px-3 text-[11px] text-zinc-700">
            Enter envia · Shift +
            Enter cria uma nova
            linha
          </p>
        </div>
      </div>
    </section>
  </div>
</main>


);
}
