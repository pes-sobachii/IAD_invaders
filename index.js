const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const endGameScreen = document.querySelector('.gameOver')
const startGameScreen = document.querySelector('.start-game')
const restartButton = document.querySelector('.gameOver button')
const startButton = document.querySelector('.start-game button')
const leftButton = document.querySelector('.left-button')
const upButton = document.querySelector('.up-button')
const rightButton = document.querySelector('.right-button')
const ctrlButtons = document.querySelector('.ctrl-buttons')
const ballRadius = 10;
const paddleHeight = 30;
const paddleWidth = 30;
let paddleX = (canvas.width - paddleWidth) / 2;
let x = paddleX + 15
let y = canvas.height - 30;
let dy = -3.5;
let dyBrick = 1
let dxBrick = 2
let randLaba = 0
const ammunition = ['Untitled-1.png', '4лаба.png', 'лаба7.png', 'лаб5.png']
const photos = ['nata.png', 'katya.png', 'lev.png', 'lilya.png', 'marichka.png', 'milya.png', 'nastia.png', 'sofiya.png', 'sohfia.png', 'vikap.png', 'yaryna.png', 'liulia.png']
let rightPressed = false;
let leftPressed = false;
const brickRowCount = 3;
const brickColumnCount = 4;
const brickWidth = 40;
const brickHeight = 40;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let stopBallRendering = true
let blockButtons = false
let bricks = [];
let isMovingRight = true
let allDestroyed = true
let score = 0
let interval
let lowestRowCleared
let midRowCleared
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);
document.addEventListener("mouseup", mouseUpHandler, false);
document.addEventListener("mousedown", (e) => console.log(e.target), false);
document.addEventListener("mouseup", () => console.log('u'), false);
document.addEventListener("click", onClickHandler);

function mouseDownHandler(e) {
    if (!blockButtons){
        switch (e.target) {
            case leftButton:
                paddleX -= 25;
                break;
            case upButton:
                randLaba = Math.floor(Math.random() * ammunition.length)
                stopBallRendering = false
                blockButtons = true
                break;
            case rightButton:
                paddleX += 25;
                break;
        }
    }
}

function mouseUpHandler(e) {
    switch (e.target) {
        case leftButton:
            leftPressed = false;
            break;
        case rightButton:
            rightPressed = false;
            break;
    }
}

function onClickHandler(e) {
    switch (e.target) {
        case restartButton:
            document.location.reload();
            break;
        case startButton:
            interval = setInterval(draw, 10);
            startGameScreen.style.display = 'none'
    }
}

function keyDownHandler(e) {
    if (!blockButtons){
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = true;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = true;
        } else if (e.key === "Up" || e.key === "ArrowUp") {
            randLaba = Math.floor(Math.random() * ammunition.length)
            stopBallRendering = false
            blockButtons = true
        }
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function drawGameOver() {
    endGameScreen.style.display = 'flex'
    canvas.style.visibility = 'hidden'
    ctrlButtons.style.visibility = 'hidden'
    if (score === 12){
        endGameScreen.style.backgroundColor = 'rgba(1, 155, 24, 0.5)'
        return `
                 <h2>Перемога!</h2>
                 <p>На комісію було відправлено ${score} студентів</p>
                `
    } else {
        endGameScreen.style.backgroundColor = 'rgb(189, 9, 9, 0.5)'
        return `
                 <h2>Поразка(</h2>
                 <p>На комісію було відправлено всього-на-всього ${score} студентів</p>
                 
                `
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Відпралено на комісію: ${score}`, 8, 20);
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (paddleX + 30 > b.x && paddleX < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    x = paddleX + 15
                    y = canvas.height - 30;
                    stopBallRendering = true
                    blockButtons = false
                    b.status = 0;
                    score++;
                }
            }
        }
    }
}
function drawBall() {
    if (!stopBallRendering){
        ctx.beginPath();
        const image = new Image();
        image.src = ammunition[randLaba];
        ctx.drawImage(image, paddleX + 15, y, 30, 40);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
}
function drawPaddle() {
    ctx.beginPath();
    const image = new Image();
    image.src = 'and.jpg';
    ctx.drawImage(image, paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.closePath();
}



function drawBricks() {
    const photoObjects = photos.map( (photo, index) => {
        const image = new Image();
        image.src = photos[index];
        return image
    })
    let photoIndex = 0
    allDestroyed = true
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brickX = ((c * (brickWidth + brickPadding)) + brickOffsetLeft) + dxBrick;
            const brickY = ((r * (brickHeight + brickPadding)) + brickOffsetTop) + dyBrick;
            if (bricks[c][r].status === 1) {
                allDestroyed = false
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.drawImage(photoObjects[photoIndex], brickX, brickY, brickWidth, brickHeight)
                ctx.closePath();
                photoIndex += 1
            } else {
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                photoIndex += 1
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore()
    if (y + dy < ballRadius) {
        stopBallRendering = true
        blockButtons = false
        x = paddleX + 15
        y = canvas.height - 30;
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    y += stopBallRendering || dy;
    dxBrick += isMovingRight ? 1 : -1
    dyBrick += 0.19

    if (bricks[brickColumnCount - 1][brickRowCount - 1].x + 30 >= canvas.width ){
        isMovingRight = false
    } else if (bricks[0][0].x === 0 ){
        isMovingRight = true
    }

    lowestRowCleared = !!(bricks[0][2].status + bricks[1][2].status + bricks[2][2].status + bricks[3][2].status)
    midRowCleared = !!(bricks[0][1].status + bricks[1][1].status + bricks[2][1].status + bricks[3][1].status)

    if ((lowestRowCleared && bricks[brickColumnCount - 1][brickRowCount - 1].y + 80 >= canvas.height) ||
        (midRowCleared && bricks[brickColumnCount - 2][brickRowCount - 2].y + 80 >= canvas.height) ||
        bricks[brickColumnCount - 3][brickRowCount - 3].y + 70 >= canvas.height){
        clearInterval(interval);
        endGameScreen.insertAdjacentHTML('afterbegin', drawGameOver());
    } else if (allDestroyed){
        clearInterval(interval);
        endGameScreen.insertAdjacentHTML('afterbegin', drawGameOver());
    }
}

