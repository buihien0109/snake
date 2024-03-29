//Setting the canvas
const gameOverEle = document.querySelector(".game-over");
const btnPlayAgain = document.getElementById("btn-play-again");
const scoreEle = document.getElementById("score");

const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 600;
canvas.style.border = "20px solid #ddd";

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

// Class Block
class Block {
  constructor(col, row) {
    this.col = col;
    this.row = row;
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
    ctx.arc(centerX, centerY, blockSize / 2, 0, Math.PI * 2, false);
    ctx.fill();
  }

  equal(otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
  }
}

// Class Food
class Food {
  constructor(color) {
    this.position = new Block(10, 10);
    this.color = color;
  }

  draw() {
    this.position.drawCircle(this.color);
  }

  move() {
    let randomCol = Math.floor(Math.random() * (widthInBlocks - 2) + 1);
    let randomRow = Math.floor(Math.random() * (heightInBlocks - 2) + 1);

    this.position = new Block(randomCol, randomRow);
  }
}

// Class Snake
class Snake {
  constructor(color) {
    this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)];
    this.color = color;
    this.direction = "right";
  }

  draw() {
    this.segments.forEach((segment) => segment.drawSquare(this.color));
    this.segments[0].drawSquare("green");
  }

  move() {
    let head = this.segments[0];
    let newHead;

    if (this.direction == "right") {
      newHead = new Block(head.col + 1, head.row);
    } else if (this.direction == "down") {
      newHead = new Block(head.col, head.row + 1);
    } else if (this.direction == "left") {
      newHead = new Block(head.col - 1, head.row);
    } else if (this.direction == "up") {
      newHead = new Block(head.col, head.row - 1);
    }

    if (this.checkCollision(newHead)) {
      gameOver();
      return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(food.position)) {
      score++;
      food.move();
    } else {
      this.segments.pop();
    }
  }

  setDirection(newDirection) {
    if (
      (this.direction == "up" && newDirection == "down") ||
      (this.direction == "left" && newDirection == "right") ||
      (this.direction == "down" && newDirection == "up") ||
      (this.direction == "right" && newDirection == "left")
    )
      return;

    this.direction = newDirection;
  }

  checkCollision(head) {
    // Kiểm tra va chạm với thành game Board
    let left = head.col < 0;
    let top = head.row < 0;
    let right = head.col > widthInBlocks - 1;
    let bottom = head.row > heightInBlocks - 1;
    let wallCollision = left || top || right || bottom;

    // Kiểm tra va chạm với thân snake
    let selfCollision = false;
    for (let i = 0; i < this.segments.length; i++) {
      if (head.equal(this.segments[i])) {
        selfCollision = true;
      }
    }

    return wallCollision || selfCollision;
  }
}

// Game over => Hiển thị thông tin điểm người chơi
function gameOver() {
  gameOverEle.style.display = "flex";
  scoreEle.innerText = score;
  clearInterval(interval);
}

// Chơi lại game
btnPlayAgain.addEventListener("click", function () {
  window.location.reload();
});

let directions = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
};

document.addEventListener("keydown", function (e) {
  let newDirection = directions[e.keyCode];
  if (newDirection) {
    snake.setDirection(newDirection);
  }
});

let score;
let snake;
let food;
let interval;

//Start Game function
function init() {
  // Khởi tạo điểm
  score = 0;

  // Khởi tạo đối tượng snake + food
  snake = new Snake("yellow");
  food = new Food("red");

  // Tạo game loop
  interval = setInterval(function () {
    ctx.clearRect(0, 0, width, height);
    drawScore();

    snake.draw();
    snake.move();

    food.draw();
  }, 100);
}

window.onload = init;
