// @ts-nocheck
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restartButton');

const gridSize = 20;
const tileSize = canvas.width / gridSize;
let snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
let food = {x: 15, y: 10};
let direction = 'right';
let score = 0;
let gameLoopInterval;

function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
}

const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');

function generateFood() {
    food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
    };
    // Prevent food from spawning on the snake
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });
}

function moveSnake() {
    const head = {x: snake[0].x + (direction === 'right' ? 1 : direction === 'left' ? -1 : 0),
                  y: snake[0].y + (direction === 'down' ? 1 : direction === 'up' ? -1 : 0)};

    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || checkCollision(head)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScoreDisplay();
        generateFood();
        eatSound.play(); // Play eat sound
    } else {
        snake.pop();
    }
}

function checkCollision(head) {
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

function gameOver() {
    clearInterval(gameLoopInterval);
    gameOverSound.play(); // Play game over sound
    alert(`Game Over! Your score: ${score}`);
    restartButton.style.display = 'block'; // Show restart button
}

function gameLoop() {
    moveSnake();
    draw();
}

function startGame() {
    snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
    direction = 'right';
    score = 0;
    updateScoreDisplay();
    generateFood();
    restartButton.style.display = 'none'; // Hide restart button
    if (gameLoopInterval) {
        clearInterval(gameLoopInterval); // Clear previous interval if any
    }
    gameLoopInterval = setInterval(gameLoop, 200);
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

restartButton.addEventListener('click', startGame);

// Start game when script loads
startGame();
