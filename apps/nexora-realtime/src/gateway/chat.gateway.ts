import { Server, Socket } from "socket.io";

export type RealtimeMessage = {
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

type PresenceStatus = "online" | "offline";

export class ChatGateway {
  private readonly onlineUsers =
    new Map<string, Set<string>>();

  constructor(
    private readonly io: Server,
  ) {}

  handleConnection(socket: Socket) {
    console.log(
      `Cliente conectado: ${socket.id}`,
    );

    socket.emit("connected", {
      message: "Conectado ao Nexora Realtime",
    });

    /*
     * PRESENÇA
     *
     * O frontend envia o userId através
     * do handshake da conexão.
     */
    const userId =
      typeof socket.handshake.auth?.userId ===
      "string"
        ? socket.handshake.auth.userId
        : null;

    if (userId) {
      this.registerPresence(
        userId,
        socket,
      );
    } else {
      console.log(
        `Socket ${socket.id} conectado sem userId`,
      );
    }

    /*
     * ENTRAR NO CANAL
     */
    socket.on(
      "channel:join",
      (channelId: string) => {
        if (!channelId) {
          return;
        }

        const room =
          this.getRoomName(channelId);

        socket.join(room);

        console.log(
          `Socket ${socket.id} entrou no canal ${channelId}`,
        );
      },
    );

    /*
     * SAIR DO CANAL
     */
    socket.on(
      "channel:leave",
      (channelId: string) => {
        if (!channelId) {
          return;
        }

        const room =
          this.getRoomName(channelId);

        socket.leave(room);

        console.log(
          `Socket ${socket.id} saiu do canal ${channelId}`,
        );
      },
    );

    /*
     * NOVA MENSAGEM
     *
     * O servidor transmite para TODOS
     * os clientes dentro da room,
     * incluindo quem enviou.
     */
    socket.on(
      "message:send",
      (message: RealtimeMessage) => {
        if (
          !message ||
          !message.id ||
          !message.channel_id ||
          !message.content
        ) {
          return;
        }

        const room =
          this.getRoomName(
            message.channel_id,
          );

        console.log(
          `Mensagem ${message.id} enviada no canal ${message.channel_id}`,
        );

        this.io
          .to(room)
          .emit(
            "message:new",
            message,
          );
      },
    );

    /*
     * DESCONECTAR
     */
    socket.on("disconnect", () => {
      console.log(
        `Cliente desconectado: ${socket.id}`,
      );

      if (userId) {
        this.unregisterPresence(
          userId,
          socket,
        );
      }
    });
  }

  /*
   * REGISTRA UM SOCKET PARA O USUÁRIO.
   *
   * Um usuário pode possuir mais de uma conexão:
   * - duas abas
   * - computador + celular
   * - etc.
   */
  private registerPresence(
    userId: string,
    socket: Socket,
  ) {
    let sockets =
      this.onlineUsers.get(userId);

    const wasOffline =
      !sockets ||
      sockets.size === 0;

    if (!sockets) {
      sockets = new Set<string>();
      this.onlineUsers.set(
        userId,
        sockets,
      );
    }

    sockets.add(socket.id);

    console.log(
      `Usuário ${userId} ficou online`,
    );

    /*
     * Só dispara "online" quando o primeiro
     * socket do usuário conecta.
     */
    if (wasOffline) {
      this.io.emit("presence:update", {
        userId,
        status:
          "online" as PresenceStatus,
      });
    }

    /*
     * Informa ao próprio cliente quem está
     * atualmente online.
     */
    socket.emit(
      "presence:online",
      this.getOnlineUserIds(),
    );
  }

  /*
   * REMOVE UM SOCKET DO USUÁRIO.
   *
   * O usuário só fica offline quando
   * TODAS as conexões dele forem encerradas.
   */
  private unregisterPresence(
    userId: string,
    socket: Socket,
  ) {
    const sockets =
      this.onlineUsers.get(userId);

    if (!sockets) {
      return;
    }

    sockets.delete(socket.id);

    if (sockets.size > 0) {
      return;
    }

    this.onlineUsers.delete(userId);

    console.log(
      `Usuário ${userId} ficou offline`,
    );

    this.io.emit("presence:update", {
      userId,
      status:
        "offline" as PresenceStatus,
    });
  }

  /*
   * Retorna todos os usuários atualmente online.
   */
  private getOnlineUserIds() {
    return Array.from(
      this.onlineUsers.keys(),
    );
  }

  private getRoomName(
    channelId: string,
  ) {
    return `channel:${channelId}`;
  }
}