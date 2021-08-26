const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 600;
canvas.style.border = '1px solid gray';

const ctx = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;

//Setting the block
let blockSize = 20;
let widthInBlocks = width / blockSize;
let heightInBlocks = height / blockSize;

function drawScore() {
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Điểm: ${score}`, blockSize * 1, blockSize * 2);
}

class Block {
    constructor(col, row) {
        this.col = col;
        this.row = row
    }
    drawSquare(color) {
        let x = this.col * blockSize;
        let y = this.row * blockSize;

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(x, y, blockSize, blockSize);
        ctx.fill();
    }

    drawCircle(color) {
        // Tính toán vị trí tâm
        let centerX = this.col * blockSize + blockSize / 2;
        let centerY = this.row * blockSize + blockSize / 2;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, blockSize / 2, 0 , Math.PI * 2, false);
        ctx.fill();
    }
}

// class Food
class Food {
    constructor(color) {
        this.position = new Block(10, 10);
        this.color = color;
    }

    draw() {
        this.position.drawCircle(this.color);
    }
}

// Class Snake
class Snake {
    constructor(color) {
        this.segments = [new Block(7,5), new Block(6,5), new Block(5,5)];
        this.color = color;
        this.direction = "right";
    }

    draw() {
        this.segments.forEach(segment => segment.drawSquare(this.color));
        this.segments[0].drawSquare('green');
    }
}

let score;
let snake;
let food;

//Start Game function
function init() {
    score = 0;

    snake = new Snake('yellow');
    food = new Food('red');

    drawScore();
    snake.draw();
    food.draw();
}

window.onload = init;