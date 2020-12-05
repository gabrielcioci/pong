const ball_radius = 15;
const ball_speed = 5;
const ball_velocity_x = 5;
const ball_velocity_y = 5;
const paddleHeight = 150;
const paddleWidth = 25;
const tableHeight = 600;
const tableWidth = 1100;

const tableYCenter = tableHeight / 2;
const tableXCenter = tableWidth / 2;

const paddleTopStart = (tableHeight - paddleHeight) / 2;
const playerOneX = tableWidth - 15 - paddleWidth;
const playerTwoX = 15;

module.exports = {
    ball_velocity_x,
    ball_velocity_y,
    ball_radius,
    ball_speed,
    tableHeight,
    tableYCenter,
    tableXCenter,
    tableWidth,
    playerTwoX,
    playerOneX,
    paddleTopStart,
    paddleWidth,
    paddleHeight
}

