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

export class ChatGateway {
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
    });
  }

  private getRoomName(
    channelId: string,
  ) {
    return `channel:${channelId}`;
  }
}

