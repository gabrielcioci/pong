import React, {useEffect, useRef, useState} from 'react';
import ready from '../assets/sounds/ready.mp3'
import v1 from '../assets/sounds/v1.mp3'
import v2 from '../assets/sounds/v2.mp3'
import v3 from '../assets/sounds/v3.mp3'
import v4 from '../assets/sounds/v4.mp3'
import v6 from '../assets/sounds/v6.mp3'
import v7 from '../assets/sounds/v7.mp3'
import v8 from '../assets/sounds/v8.mp3'

const readySound = new Audio(ready)
const hit = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
const v1S = new Audio(v1)
const v2S = new Audio(v2)
const v3S = new Audio(v3)
const v4S = new Audio(v4)
const v6S = new Audio(v6)
const v7S = new Audio(v7)
const v8S = new Audio(v8)

const PongRoom = (props) => {
    const {socket} = props
    const [players, setPlayers] = useState()
    const [p1Top, setP1Top] = useState(0)
    const [p2Top, setP2Top] = useState(0)
    const [ballX, setBallX] = useState(0)
    const [ballY, setBallY] = useState(0)
    const [p1Score, setP1Score] = useState(0)
    const [p2Score, setP2Score] = useState(0)
    const currentPlayer = useRef('')
    const roomRef = useRef()
    const funSounds = [v1S, v2S, v3S, v4S, v6S, v7S, v8S]

    const movePaddle = ({keyCode}) => {
        switch (keyCode) {
            case 38:
                socket.emit("movePaddle", {direction: 'up', player: currentPlayer.current, room: roomRef.current})
                break;
            case 40:
                socket.emit("movePaddle", {direction: 'down', player: currentPlayer.current, room: roomRef.current})
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        // Get Room Data
        socket.on("roomData", ({room, players, ball, p1, p2}) => {
            setPlayers(players)
            roomRef.current = room
            setBallX(ball.x)
            setBallY(ball.y)
            setP1Top(p1.y)
            setP2Top(p2.y)
            if (players.length) {
                if (players[0].id === socket.id)
                    currentPlayer.current = 'p1'
                else currentPlayer.current = 'p2'
            }
        })


        // Player Ready
        socket.on("gameStarted", () => {
            readySound.play()
            document.addEventListener('keyup', movePaddle)
        })

        // Winner
        socket.on("winner", ({player}) => {
            if (player === currentPlayer.current)
                alert("You won! Redirecting to lobby.")
            else alert("You lost! Redirecting to lobby.")
            socket.emit('redirected', ({room: roomRef.current}))
            props.history.push("/")
        })

        // Move paddles
        socket.on("p1Moved", ({y}) => {
            setP1Top(y)
        })
        socket.on("p2Moved", ({y}) => {
            setP2Top(y)
        })

        // Move ball
        socket.on("ballMoved", ({bx, by}) => {
            setBallX(bx)
            setBallY(by)
        })

        // Ball collisions
        socket.on("collision", () => {
            hit.play()
        })

        // Update Score & reset game
        socket.on("scored", ({s1, s2}) => {
            setP1Score(s1)
            setP2Score(s2)
            funSounds[Math.floor(Math.random() * funSounds.length)].play()
        })

        // Other player disconnected
        socket.on("otherPlayerDisconnect", () => {
            setTimeout(() => {
                document.removeEventListener('keydown', movePaddle)
                alert("Other player disconnected. Redirecting to lobby.")
                props.history.push(`/`)
            }, 1000)
        })

        // On disconnect turn socket off
        return () => {
            socket.off()
        }
    }, [])

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
                    <span>{roomRef.current}</span>
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