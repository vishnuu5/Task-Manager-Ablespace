import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import notificationRoutes from "./routes/notification.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middleware/error.middleware";
import { initSocketHandlers } from "./socket/socket.handlers";
import { connectDB } from "./utils/db";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize database connection
connectDB().catch(console.error);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
].filter(Boolean) as string[];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
  allowUpgrades: true,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: {
    name: "io",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  }
});

// Log socket connections
io.on("connection", (socket) => {
  console.log(`🔌 New socket connection: ${socket.id}`);
  
  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.set("io", io);
app.set("trust proxy", 1);


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

initSocketHandlers(io);

const PORT = Number(process.env.PORT);

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server is running`);
});


export { io };
