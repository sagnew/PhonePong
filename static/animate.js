const BALL_SPEED = 3;

const canvas = document.getElementById('screen');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');
const socket = io();

class Element {

  constructor(x, y, width, height, vx, vy) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.vx = vx || 0;
    this.vy = vy || 0;

    elements.push(this);
  }

  draw() {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    for (let i=0; i < elements.length; i++) {
      let el = elements[i];
      if (elements[i] == this) {
        continue;
      }

      // bounce on horizontal collision
      if ((this.top() < el.bottom() && this.bottom() > el.top()) &&
          (this.right() < el.left() && this.right() + this.vx >= el.left() ||
           this.left() > el.right() && this.left() + this.vx <= el.right())) {
        this.vx = -this.vx;
        break;
      }

      // bounce on vertical collision
      if ((this.left() < el.right() && this.right() > el.left()) &&
          (this.bottom() < el.top() && this.bottom() + this.vy >= el.top() ||
           this.top() > el.bottom() && this.top() + this.vy <= el.bottom())) {
        this.vy = -this.vy;
        break;
      }
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  left() {
    return this.x;
  }

  right() {
    return this.x + this.width;
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y + this.height;
  }

}

let elements = [];

// instantiate moving game elements
let paddle1 = new Element(5, canvas.height/2, 20, 200);
let paddle2 = new Element(canvas.width - 55, canvas.height/2, 20, 200);
let ball = new Element(canvas.width/2, canvas.height/2, 30, 30, -1 * BALL_SPEED, 0.6 * BALL_SPEED);

// create top and bottom walls
let topWall = new Element( 0, 0, canvas.width, 1);
let bottomWall = new Element(0, canvas.height - 1, canvas.width, 1);

// game loop
let gameLoop = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < elements.length; i++) {
    elements[i].move();
    elements[i].draw();
  }

  // game rules
  if (ball.right() > canvas.width) {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
  } else if (ball.left() < 0) {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
  }

  window.requestAnimationFrame(gameLoop);
};

socket.on('input', (input) => {
  let paddle = {};
  console.log(input);
  if (input.player === 1) {
    paddle = paddle1;
  } else if (input.player === 2) {
    paddle = paddle2;
  }

  if (input.button === '2') {
    if (paddle.top() - 50 > 0) {
      paddle.y -= 50;
    }
  } else if (input.button === '8') {
    if (paddle.bottom() + 50 < canvas.height) {
      paddle.y += 50;
    }
  }

});

window.requestAnimationFrame(gameLoop);
