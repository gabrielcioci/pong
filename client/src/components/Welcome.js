import React, {useEffect, useState} from 'react';

const Welcome = (props) => {
    const [username, setUsername] = useState('')
    const [rooms, setRooms] = useState()
    const [room, setRoom] = useState('')
    const {socket} = props

    const handleCreateRoom = () => {
        if (username.length && room.length) {
            socket.emit('createRoom', {username, room}, (error) => {
                if (error) {
                    alert(error);
                }
            })
            props.history.push(`/rooms?room=${room}&username=${username}`)
        }
    }
    const handleJoinRoom = (room) => {
        if (username.length) {
            socket.emit('join', {username, room}, (error) => {
                if (error) {
                    alert(error);
                }
            })
            props.history.push(`/rooms?room=${room}&username=${username}`)
        } else alert('Username is required.')

    }
    useEffect(() => {
        socket.on('availableRooms', ({gameRooms}) => {
            setRooms(gameRooms)
        })
        return () => {
            socket.off('availableRooms')
        }
    }, [])

    return (
        <div className="welcome-screen">
            <h1>Pong</h1>
            <div className="rooms">
                <h2>Username</h2>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                       placeholder="Your Name"
                       name="username"/>
                <h2>Available rooms</h2>
                {rooms && rooms.map((room) => (
                    <div key={room.name} className="room">
                        <h4>{room.name}</h4>
                        <div className="players">{room.players.length}/2</div>
                        <div className="btn btn-turquoise"
                             onClick={(e) => handleJoinRoom(room.name)}>Join
                        </div>
                    </div>
                ))}
            </div>
            <div className="create">
                <h2>Create room</h2>
                <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room Name"
                       name="room"/>
                <div onClick={(e) => handleCreateRoom(username, room)}
                     className="btn">Create
                </div>
            </div>
        </div>
    )
}
export default Welcome