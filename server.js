const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io')
const app = express();
const server = http.createServer(app);
const io = socketio(server)
const router = require('./routes/api/router')
const {handleRoom} = require('./utils/room')
const port = process.env.PORT || 5000;

const gameRooms = [];

io.on("connection", client => {
    handleRoom(client, io, gameRooms)
})


if (process.env.NODE_ENV === 'production') {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}
app.use(router)
app.get("/", (req, res) => res.send("./client/build/"));

server.listen(port, () => console.log(`Server is running on port ${port}`));