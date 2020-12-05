const {ball_radius, ball_velocity_x, ball_velocity_y, ball_speed, paddleTopStart, playerTwoX, playerOneX, paddleHeight, paddleWidth, tableYCenter, tableXCenter, tableHeight, tableWidth} = require('./constants')
const resetPositions = (ball, p1, p2) => {
    // Reset ball position
    ball.x = tableXCenter - ball_radius
    ball.y = tableYCenter - ball_radius
    ball.vx = -ball.vx
    ball.vy = ball_velocity_y
    ball.speed = ball_speed
    // Reset players position
    p1.y = paddleTopStart
    p2.y = paddleTopStart
}
const movePaddle = (player, direction) => {
    if (direction === 'up')
        if (player.y - 10 > 0)
            player.y -= 10
        else player.y = 0
    else {
        if (player.y + paddleHeight + 10 < tableHeight)
            player.y += 10
        else player.y = tableHeight - paddleHeight
    }
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
    setInterval(() => {
        ball.x += ball.vx
        ball.y += ball.vy
        let player = (ball.x < tableXCenter) ? p2 : p1
        checkForCollision(player, ball, io, room)
        if (ball.x < 0) {
            // Player 1 scored
            p1.score += 1
            io.to(room).emit("scored", {s1: p1.score, s2: p2.score})
            resetPositions(ball, p1, p2)
        } else if ((ball.x + 2 * ball_radius) > tableWidth) {
            // Player 2 scored
            p2.score += 1
            io.to(room).emit("scored", {s1: p1.score, s2: p2.score})
            resetPositions(ball, p1, p2)
        }
        if (p1.score === 5)
            io.to(room).emit("winner", {player: 'p1'})
        else if (p2.score === 5)
            io.to(room).emit("winner", {player: 'p2'})

        io.to(room).emit("ballMoved", {bx: ball.x, by: ball.y})
    }, 30)
}

module.exports = {resetPositions, movePaddle, startGame}