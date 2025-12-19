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

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Environment configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = NODE_ENV === 'production'
  ? [
      'https://task-manager-ablespace.vercel.app',
      'https://task-manager-ablespace-ogxb7gk93-vishnus-projects-3ac220e9.vercel.app'
    ]
  : 'http://localhost:3000';

// Socket.IO configuration
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// CORS configuration
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Cookie settings middleware
app.use((req, res, next) => {
  const isProduction = NODE_ENV === 'production';
  res.cookie('test', 'test', {
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    httpOnly: true,
    domain: isProduction ? '.onrender.com' : undefined
  });
  next();
});
app.use(express.json());
app.use(cookieParser());
app.set("io", io);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

initSocketHandlers(io);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io ready for connections`);
});

export { io };
