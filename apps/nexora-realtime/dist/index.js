"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const httpServer = (0, http_1.createServer)();
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
    },
});
io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);
    socket.emit('connected', {
        message: 'Conectado ao Nexora Realtime',
    });
    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});
const PORT = 3002;
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log('Nexora Realtime');
    console.log(`Socket.IO: http://localhost:${PORT}`);
});
