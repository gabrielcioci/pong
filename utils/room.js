const {startGame, movePaddle, resetPositions} = require("./game");
const {ball_velocity_x, ball_radius, ball_speed, ball_velocity_y, paddleTopStart, playerTwoX, playerOneX, tableYCenter, tableXCenter} = require('./constants')
const {joinUserToRoom, removeUserFromRoom, createRoom, deleteRoom, getRoomByUserID} = require('./users')

const handleRoom = (client, io, gameRooms) => {
    let ball = {
        x: tableXCenter - ball_radius,
        y: tableYCenter - ball_radius,
        vx: ball_velocity_x,
        vy: ball_velocity_y,
        speed: ball_speed,
    }
    let p1 = {
        x: playerOneX,
        y: paddleTopStart,
        score: 0,
    }
    let p2 = {
        x: playerTwoX,
        y: paddleTopStart,
        score: 0,
    }

    // Join Room socket
    client.on("join", ({username, room}, callback) => {
        const {error, existingRoom} = joinUserToRoom({id: client.id, username, room}, gameRooms)
        if (error) return callback(error)
        client.join(room)
        io.to(room).emit("roomData", {
            room: existingRoom.name,
            players: existingRoom.players,
            ball, p1, p2
        })
        io.to(room).emit("gameStarted", {})
        setTimeout(() => {
            startGame(room, p1, p2, ball, io)
        }, 3000)
        callback();
    })
    // Create Room socket
    client.on("createRoom", ({username, room}, callback) => {
        const {error, currentRoom} = createRoom({id: client.id, username, room}, gameRooms)
        if (error) return callback(error)
        client.join(room)
        io.to(room).emit("roomData", {
            room: currentRoom.name,
            players: currentRoom.players,
            ball, p1, p2
        })
        callback();
    })
    // Move paddle with keys
    client.on("movePaddle", ({direction, player, room}) => {
        if (player === 'p1') {
            movePaddle(p1, direction)
            io.to(room).emit("player1Moved", {y: p1.y})
        } else if (player === 'p2') {
            movePaddle(p2, direction)
            io.to(room).emit("player2Moved", {y: p2.y})
        }
    })
    // Rooms list
    client.on("getRooms", () => {
        client.emit("availableRooms", ({gameRooms}))
    })
    // Player disconnect
    client.on('disconnect', ({room}) => {
        console.log(room)
        //client.emit("otherPlayerDisconnect", ({gameRooms}))
    })
}

module.exports = {handleRoom}