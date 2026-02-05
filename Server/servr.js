import express from "express";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
  },
});

app.use(bodyParser.json());

server.listen(8000, () => {
  console.log("App is listening on Port 8000");
});

const emailToSocketMapping = new Map();
const socketIdToEmailMapping = new Map();

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // ---------------- JOIN ROOM ----------------
  socket.on("join-room", ({ roomId, emailId }) => {
    console.log(`👤 ${emailId} joined room ${roomId}`);

    emailToSocketMapping.set(emailId, socket.id);
    socketIdToEmailMapping.set(socket.id, emailId);

    socket.join(roomId);

    socket.emit("joined-room", { roomId });

    // notify ONLY existing users
    socket.broadcast.to(roomId).emit("user-joined", { emailId });
  });

  // ---------------- SEND OFFER ----------------
  socket.on("call-user", ({ emailId, offer }) => {
    console.log("📞 call-user");

    const fromEmail = socketIdToEmailMapping.get(socket.id);
    const targetSocketId = emailToSocketMapping.get(emailId);

    if (!targetSocketId) {
      console.log("❌ Target socket not found:", emailId);
      return;
    }

    socket.to(targetSocketId).emit("incoming-call", {
      from: fromEmail,
      offer,
    });
  });

  // ---------------- SEND ANSWER ----------------
  socket.on("call-accepted", ({ emailId, ans }) => {
    console.log("✅ call-accepted");

    const targetSocketId = emailToSocketMapping.get(emailId);
    if (!targetSocketId) return;

    socket.to(targetSocketId).emit("call-accepted", { ans });
  });

  // ---------------- ICE CANDIDATES ----------------
  socket.on("ice-candidate", ({ emailId, candidate }) => {
    const targetSocketId = emailToSocketMapping.get(emailId);
    if (!targetSocketId) return;

    socket.to(targetSocketId).emit("ice-candidate", { candidate });
  });

  // ---------------- DISCONNECT CLEANUP ----------------
  socket.on("disconnect", () => {
    const email = socketIdToEmailMapping.get(socket.id);

    if (email) {
      emailToSocketMapping.delete(email);
      socketIdToEmailMapping.delete(socket.id);
      console.log("❌ Socket disconnected:", email);
    }
  });
});
