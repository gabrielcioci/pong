const {ball_radius, ball_velocity_y, ball_speed, paddleTopStart, paddleHeight, paddleWidth, tableYCenter, tableXCenter, tableHeight, tableWidth} = require('./constants')
const resetPositions = (ball, p1, p2, io, room) => {
    // Reset ball position
    ball.x = tableXCenter - ball_radius
    ball.y = tableYCenter - ball_radius
    ball.vx = -ball.vx
    ball.vy = ball_velocity_y
    ball.speed = ball_speed
    // Reset players position
    p1.y = paddleTopStart
    p2.y = paddleTopStart

    // Emit players new positions
    io.to(room).emit("p1Moved", {y: p1.y})
    io.to(room).emit("p2Moved", {y: p2.y})
}
const movePaddle = (player, direction, io, room) => {
    if (direction === 'up')
        if (player.y - 15 > 0)
            player.y -= 15
        else player.y = 0
    else {
        if (player.y + paddleHeight + 15 < tableHeight)
            player.y += 15
        else player.y = tableHeight - paddleHeight
    }
    io.to(room).emit(`${player.name}Moved`, {y: player.y})
}
const checkForCollision = (player, ball, io, room) => {

    // Player bounds
    player.top = player.y
    player.bottom = player.y + paddleHeight
    player.left = player.x
    player.right = player.x + paddleWidth

    // Ball bounds
    ball.top = ball.y
    ball.bottom = ball.y + 2 * ball_radius
    ball.left = ball.x
    ball.right = ball.x + 2 * ball_radius
    ball.center = ball.y + ball_radius

    if (ball.right > player.left && ball.bottom > player.top && ball.left < player.right && ball.top < player.bottom) {
        let collidePoint = ball.center - (player.top + paddleHeight / 2);
        collidePoint = collidePoint / (paddleHeight / 2)
        let angle = collidePoint * Math.PI / 4;
        let direction = (ball.x < tableXCenter) ? 1 : -1;
        ball.vx = direction * ball.speed * Math.cos(angle)
        ball.vy = ball.speed * Math.sin(angle)
        ball.speed += 1
        io.to(room).emit("collision")
    } else if (ball.top < 0 || ball.bottom > tableHeight) {
        ball.vy = -ball.vy
        io.to(room).emit("collision")
    }

}

const startGame = (room, p1, p2, ball, io) => {
    let playing = true
    setInterval(() => {
        if (playing) {
            ball.x += ball.vx
            ball.y += ball.vy
            let player = (ball.x < tableXCenter) ? p2 : p1
            console.log(player)
            checkForCollision(player, ball, io, room)
            if (ball.x < 0) {
                // Player 1 scored
                p1.score += 1
                io.to(room).emit("scored", {s1: p1.score, s2: p2.score})
                resetPositions(ball, p1, p2, io, room)
                playing = false
                setTimeout(() => {
                    playing = true
                }, 1500)
            } else if ((ball.x + 2 * ball_radius) > tableWidth) {
                // Player 2 scored
                p2.score += 1
                io.to(room).emit("scored", {s1: p1.score, s2: p2.score})
                resetPositions(ball, p1, p2, io, room)
                playing = false
                setTimeout(() => {
                    playing = true
                }, 1500)
            }
            if (p1.score === 5) {
                io.to(room).emit("winner", {player: 'p1'})
                playing = false
            } else if (p2.score === 5) {
                io.to(room).emit("winner", {player: 'p2'})
                playing = false
            }
            io.to(room).emit("ballMoved", {bx: ball.x, by: ball.y})
        }
    }, 15)
}

module.exports = {resetPositions, movePaddle, startGame}