"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const REALTIME_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  "http://localhost:3002";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (socketRef.current) {
      return;
    }

    console.log(
      "Conectando ao Nexora Realtime:",
      REALTIME_URL,
    );

    const socket = io(REALTIME_URL, {
      // Começa pelo polling, que já funcionou no Nexora.
      // Depois o Socket.IO pode fazer upgrade para WebSocket.
      transports: ["polling", "websocket"],

      autoConnect: true,

      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,

      // Evita tentar WebSocket antes da conexão inicial
      upgrade: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(
        "Nexora Realtime conectado:",
        socket.id,
        "transporte:",
        socket.io.engine.transport.name,
      );
    });

    socket.on("connect_error", (error) => {
      console.error(
        "Erro ao conectar ao Nexora Realtime:",
        error.message,
      );
    });

    socket.on("upgrade", (transport) => {
      console.log(
        "Nexora Realtime upgrade para:",
        transport.name,
      );
    });

    socket.on("connected", (data) => {
      console.log(
        "Nexora Realtime:",
        data,
      );
    });

    socket.on("disconnect", (reason) => {
      console.log(
        "Nexora Realtime desconectado:",
        reason,
      );
    });

    return () => {
      console.log(
        "Desconectando Nexora Realtime...",
      );

      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return socketRef;
}

