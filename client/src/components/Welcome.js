import React, {useEffect, useState} from 'react';

const Welcome = (props) => {
    const [username, setUsername] = useState('')
    const [rooms, setRooms] = useState()
    const [showRooms, setShowRooms] = useState(true)
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
        } else alert('Username and room name is required for creating a new room.')
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
        socket.emit('getRooms')
        socket.on('availableRooms', ({gameRooms}) => {
            setRooms(gameRooms)
        })
        return () => {
            socket.off('availableRooms')
        }
    }, [])

    return (
        <div className="welcome-screen">
            <div className="title">
                <div className="jumping-ball"/>
                <h1>Pong</h1>
            </div>
            <div className="welcome-content">
                <h2>Username</h2>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                       placeholder="Your Name"
                       name="username"/>
                {showRooms ? <div className="rooms-available">
                        <h2>Available rooms
                            <div className="btn btn-turquoise btn-small" onClick={(e) => setShowRooms(false)}>New room</div>
                        </h2>
                        {rooms && rooms.length ? rooms.map((room) => (
                                <div key={room.name} className="room">
                                    <h4>{room.name}</h4>
                                    <div className="players">{room.players.length}/2</div>
                                    <div className="btn btn-green"
                                         onClick={(e) => handleJoinRoom(room.name)}>Join
                                    </div>
                                </div>
                            )) :
                            <p>No rooms available at this moment.<br/>Create one!</p>
                        }
                    </div> :
                    <div className="create">
                        <h2>Create your room <div className="btn btn-turquoise btn-small"
                                                  onClick={(e) => setShowRooms(true)}>Rooms</div></h2>
                        <input type="text" value={room} onChange={(e) => setRoom(e.target.value)}
                               placeholder="Room Name"
                               name="room"/>
                        <div onClick={(e) => handleCreateRoom(username, room)}
                             className="btn btn-full">Create
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
export default Welcome