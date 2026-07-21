import { Server } from "socket.io";
let io: Server;

export const initSocket = (server: any) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("🟢 Dashboard connected:", socket.id);
        socket.on("disconnect", () => {
            console.log("🔴 Dashboard disconnected:", socket.id);
        });
    });
    return io;
};


export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};