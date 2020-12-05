import React, {useEffect, useState} from 'react';

const PongRoom = (props) => {
    const {socket} = props
    const [players, setPlayers] = useState()
    const [currentPlayer, setCurrentPlayer] = useState('')
    const [room, setRoom] = useState('')
    const [playing, setPlaying] = useState(false)
    const [p1Top, setP1Top] = useState(0)
    const [p2Top, setP2Top] = useState(0)
    const [ballX, setBallX] = useState(0)
    const [ballY, setBallY] = useState(0)
    const [p1Score, setP1Score] = useState(0)
    const [p2Score, setP2Score] = useState(0)

    const startGame = () => {

        // Bind paddle to UP/DOWN arrows
        const movePaddle = ({keyCode}) => {
            switch (keyCode) {
                case 38:
                    socket.emit("movePaddle", {direction: 'up', player: currentPlayer, room})
                    break;
                case 40:
                    socket.emit("movePaddle", {direction: 'down', player: currentPlayer, room})
                    break;
                default:
                    break;
            }
            document.removeEventListener('keydown', movePaddle)
        }
        document.addEventListener('keydown', movePaddle)
    }


    useEffect(() => {

        // Get Room Data
        socket.on("roomData", ({room, players, ball, p1, p2}) => {
            setPlayers(players)
            setRoom(room)
            setBallX(ball.x)
            setBallY(ball.y)
            setP1Top(p1.y)
            setP2Top(p2.y)
            if (players.length) {
                if (players[0].id === socket.id)
                    setCurrentPlayer('p1')
                else setCurrentPlayer('p2')
            }
        })

        // Player Ready
        socket.on("gameStarted", () => {
            setPlaying(true)
        })

        socket.on("winner", ({player}) => {
            setPlaying(false)
            if (player === 'p1')
                alert(players[0].username + " wins!")
            else alert(players[1].username + " wins!")
        })

        // Move paddles
        socket.on("player1Moved", ({y}) => {
            setP1Top(y)
        })
        socket.on("player2Moved", ({y}) => {
            setP2Top(y)
        })

        // Move ball
        socket.on("ballMoved", ({bx, by}) => {
            setBallX(bx)
            setBallY(by)
        })

        // Ball collisions
        socket.on("collision", () => {
            // hitSound.play()
        })

        // Update Score & reset game
        socket.on("scored", ({s1, s2}) => {
            setP1Score(s1)
            setP2Score(s2)
        })

        socket.on("otherPlayerDisconnect", () => {
            alert("Other player disconnected. Redirecting to lobby.")
            props.history.push(`/`)
        })
        return () => {
            socket.emit('disconnect', {room})
            socket.off()
        }
    }, [])

    useEffect(() => {
        if (playing)
            startGame()
    }, [playing, p1Top, p2Top, ballX, ballY, p1Score, p2Score])

    const tableStyle = {
        width: 1100,
        height: 600
    }
    const p1PaddleStyle = {
        width: 25,
        height: 150,
        left: 1060,
        top: p1Top,
    }
    const p2PaddleStyle = {
        width: 25,
        height: 150,
        left: 15,
        top: p2Top,
    }
    const ballStyle = {
        width: 30,
        height: 30,
        top: ballY,
        left: ballX,
    }

    return (
        <div className="pong-room">
            <div className="game-info">
                <h2 className="player-two">
                    {players && players.length > 1 && players[1].username}
                </h2>
                <div className="room-name">
                    {players && players.length > 1 ?
                        <h1>{p2Score} - {p1Score}</h1>
                        :
                        <h2>Waiting for opponent...</h2>}
                    <span>{room}</span>
                </div>
                <h2 className="player-one">
                    {players && players[0].username}</h2>
            </div>
            <div className="table" style={tableStyle}>
                <div className="p2-paddle" style={p2PaddleStyle}/>
                <div className="ball" style={ballStyle}/>
                <div className="divider"/>
                <div className="p1-paddle" style={p1PaddleStyle}/>
            </div>
        </div>
    )
}

export default PongRoom