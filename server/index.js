import express from 'express';
import dotenv from 'dotenv';
import connectDB from "./db/db.js";
import userRouter from "./routes/user.routes.js";
import courseRouter from "./routes/course.routes.js";
import aiRoutes from "./routes/aiRoutes.routes.js";
import mediaroute from "./routes/media.routes.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app); // HTTP server created
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// Store `io` globally so controllers can access
app.set("io", io);

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// WebSocket events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Database connection
connectDB();

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/media", mediaroute);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/course", courseRouter);

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
