import { createServer } from "http";
import { Server } from "socket.io";

import { ChatGateway } from "./gateway/chat.gateway";

const httpServer = createServer();

const io = new Server(httpServer, {
cors: {
origin: "*",
},
});

const chatGateway =
new ChatGateway(io);

io.on("connection", (socket) => {
chatGateway.handleConnection(socket);
});

const PORT = 3002;

httpServer.listen(
PORT,
"0.0.0.0",
() => {
console.log("Nexora Realtime");
console.log(
`Socket.IO: http://localhost:${PORT}`,
);
},
);
