const joinUserToRoom = ({id, username, room}, gameRooms) => {
    const existingRoom = gameRooms.find((r) => r.name === room)
    if (existingRoom && existingRoom.players.length === 1) {
        if (existingRoom.players[0].username === username)
            return {error: 'Username is taken.'}
        existingRoom.players.push({id, username})
    } else return {error: 'Room is full.'}
    return {existingRoom}
}

const removeUserFromRoom = ({id, room}, gameRooms) => {
    const userRoom = gameRooms.find((r) => r.name === room)
    const index = userRoom.players.findIndex((player) => player.id === id);
    if (index !== -1) {
        return userRoom.players.splice(index, 1);
    }
}

const createRoom = ({id, username, room}, gameRooms) => {
    const existingRoom = gameRooms.find((r) => r.name === room)
    if (!existingRoom) {
        gameRooms.push({name: room, players: [{id, username}]})
    } else return {error: 'Room already exists'}
    let currentRoom = gameRooms.find((r) => r.name === room)
    return {currentRoom}
}

const deleteRoom = ({gameRooms, room}) => {
    const index = gameRooms.findIndex((r) => r.name === room);
    if (index !== -1) {
        return gameRooms.splice(index, 1);
    }
}

const getRoomByUserID = (id, gameRooms) => gameRooms.find((room) => room.players.find((player) => player.id === id))

module.exports = {joinUserToRoom, createRoom, removeUserFromRoom, deleteRoom, getRoomByUserID}