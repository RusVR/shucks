const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let users = {}; // socket.id -> username

io.on("connection", (socket) => {
    console.log("user connected:", socket.id);

    socket.on("set-username", (username) => {
        users[socket.id] = username;
        io.emit("update-user-list", users);
    });

    socket.on("chat message", (data) => {
        io.emit("chat message", { ...data, from: socket.id });
    });

    // WebRTC signaling
    socket.on("call-user", (data) => {
        io.to(data.to).emit("incoming-call", { from: socket.id, username: data.username });
    });

    socket.on("accept-call", (data) => {
        io.to(data.to).emit("call-accepted", { from: socket.id });
    });

    socket.on("webrtc-offer", (data) => {
        io.to(data.to).emit("webrtc-offer", { from: socket.id, sdp: data.sdp });
    });

    socket.on("webrtc-answer", (data) => {
        io.to(data.to).emit("webrtc-answer", { from: socket.id, sdp: data.sdp });
    });

    socket.on("webrtc-ice-candidate", (data) => {
        io.to(data.to).emit("webrtc-ice-candidate", { from: socket.id, candidate: data.candidate });
    });

    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("update-user-list", users);
        console.log("user disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Shucks running on port ${PORT}`));