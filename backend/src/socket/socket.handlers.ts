import type { Server, Socket } from "socket.io";
import { verifyToken } from "../utils/jwt.util";

export const initSocketHandlers = (io: Server) => {
  io.use((socket: Socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.cookie?.split("token=")[1]?.split(";")[0];

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = verifyToken(token);
      (socket as any).userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).userId;
    console.log(`User ${userId} connected via Socket.io`);
    socket.join(`user:${userId}`);

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  });
};
