const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // serve index.html and files from public folder

io.on("connection", (socket) => {
    console.log("A user connected");

    // When a message comes from a client
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg); // send to everyone
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Shucks is running on port " + PORT);
});