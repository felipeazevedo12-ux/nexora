import { createServer } from "http";
import { Server } from "socket.io";

import { ChatGateway } from "./gateway/chat.gateway";

const httpServer = createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
    });

    res.end(
      JSON.stringify({
        name: "Nexora Realtime",
        status: "online",
        service: "socket.io",
      }),
    );

    return;
  }

  res.writeHead(404, {
    "Content-Type": "application/json; charset=utf-8",
  });

  res.end(
    JSON.stringify({
      error: "Not Found",
    }),
  );
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const chatGateway = new ChatGateway(io);

io.on("connection", (socket) => {
  chatGateway.handleConnection(socket);
});

const PORT = Number(process.env.PORT) || 3002;

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log("Nexora Realtime");
  console.log(`Socket.IO listening on port ${PORT}`);
});