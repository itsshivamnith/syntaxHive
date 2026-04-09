import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import dbConnection from "./connection.js";
import userRoute from "./routes/user.js";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { Server } from "socket.io";
import roomRoute from "./routes/room.js";
import aiRoute from "./routes/ai.js";
import executeRouter from "./routes/execute.js";

import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const server = createServer(app);
const mongoUrl = process.env.DATABASE_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const latestCode: Record<string, string> = {};
const roomParticipants: Record<string, { id: string; name: string }[]> = {};

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomId, userName) => {
    socket.join(roomId);

    if (!roomParticipants[roomId]) {
      roomParticipants[roomId] = [];
    }

    roomParticipants[roomId].push({ id: socket.id, name: userName });

    socket.to(roomId).emit("userJoined", `${userName} joined the code room`);

    if (latestCode[roomId]) {
      socket.emit("updateCode", latestCode[roomId]);
    }

    io.to(roomId).emit("participantsUpdate", roomParticipants[roomId]);
  });

  socket.on("codeSync", (roomId, code) => {
    latestCode[roomId] = code;
    socket.to(roomId).emit("updateCode", code);
  });

  socket.on("inputSync", (roomId, input) => {
    socket.to(roomId).emit("updateInput", input);
  });

  socket.on("outputSync", (roomId, output) => {
    socket.to(roomId).emit("updateOutput", output);
  });

  socket.on("errorSync", (roomId, error) => {
    socket.to(roomId).emit("updateError", error);
  });
  socket.on("isPendingSync", (roomId, pending) => {
    socket.to(roomId).emit("updateIsPending", pending);
  });

  socket.on("leaveRoom", (roomId, userName) => {
    socket.leave(roomId);

    if (roomParticipants[roomId]) {
      roomParticipants[roomId] = roomParticipants[roomId].filter(
        (u) => u.id !== socket.id
      );

      socket.to(roomId).emit("userLeave", `${userName} leave the code room`);
      io.to(roomId).emit("participantsUpdate", roomParticipants[roomId]);
    }
  });

  socket.on("disconnect", () => {
    for (const roomId in roomParticipants) {
      const before = roomParticipants[roomId].length;

      roomParticipants[roomId] = roomParticipants[roomId].filter(
        (u) => u.id !== socket.id
      );

      const after = roomParticipants[roomId].length;

      if (before !== after) {
        io.to(roomId).emit("participantsUpdate", roomParticipants[roomId]);
      }
    }
  });
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", userRoute);
app.use("/api/room", roomRoute);
app.use("/api/ai", aiRoute);
app.use("/api", executeRouter);

if (!mongoUrl) {
  throw new Error("DATABASE_URL is not defined in .env");
}

dbConnection(mongoUrl)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("API Running");
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
