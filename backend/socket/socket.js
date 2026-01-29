const { Server } = require("socket.io");

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {                 //This runs every time a new user connects ,socket = one client connection
    console.log("User connected:", socket.id);

    // Join room
    socket.on("join-room", ({ interviewId, user }) => {
      socket.join(interviewId);                     // Now this socket belongs to that room.
      console.log(`${user.email} joined room ${interviewId}`);
      socket.to(interviewId).emit("user-joined", user);     //Notify others in the room,everyone except this user
    });

    // Editor changes
    socket.on("editor-change", ({ interviewId, code }) => {
      socket.to(interviewId).emit("editor-update", { code });
    });

    // Typing indicators
    socket.on("typing", ({ interviewId, user }) => {
      socket.to(interviewId).emit("user-typing", user);
    });

    socket.on("stop-typing", ({ interviewId }) => {
      socket.to(interviewId).emit("user-stop-typing");
    });

    // Language change
    socket.on("language-change", ({ interviewId, language }) => {
      socket.to(interviewId).emit("language-change", { language });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = { setupSocket };
