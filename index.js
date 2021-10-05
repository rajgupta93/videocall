const http = require("http");
const express = require("express");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 5000;

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", socket.id);
    })
  });

  socket.on("callingUser", ({ to, from, signal }) => {
    socket.to(to).emit("callingUser", { from, signal });
  });

  socket.on("answerCall", ({ signal, to }) => {
    socket.to(to).emit("answerCall", signal);
  });
});

server.listen(port, () => console.log(`Server started at port ${port}`));
