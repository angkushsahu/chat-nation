// on server errors
process.on("uncaughtException", (error) => console.log("uncaughtException: ", error));
process.on("unhandledRejection", (error) => console.log("unhandledRejection: ", error));

import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import app from "./app";

import { Server, Socket } from "socket.io";
const io = new Server(app, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket: Socket) => {
    socket.on("setup-room", (userData) => {
        socket.join(userData._id);
    });
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
    });
    socket.on("leave-room", (roomId) => {
        socket.leave(roomId);
    });
    socket.on("new-message", (newMessage) => {
        const { chatId, message } = newMessage;
        socket.in(chatId).emit("message-received", message);
    });
    socket.on("typing", ({ chatId, userName }) => {
        socket.in(chatId).emit("user-is-typing", userName);
    });
    socket.on("stop-typing", ({ chatId, userName }) => {
        socket.in(chatId).emit("user-stopped-typing", userName);
    });
});
