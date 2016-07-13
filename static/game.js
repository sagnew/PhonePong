const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

let elements = [];

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
    elements.forEach(element => {
      if ((this.top() < element.bottom() && this.bottom() > element.top()) &&
          (this.right() < element.left() && this.right() + this.vx >= element.left() ||
           this.left() > element.right() && this.left() + this.vx <= element.right())) {
        this.vx = -this.vx;
        return;
      }

      if ((this.left() < element.right() && this.right() > element.left()) &&
          (this.bottom() < element.top() && this.bottom() + this.vy >= element.top() ||
           this.top() > element.bottom() && this.top() + this.vy <= element.bottom())) {
        this.vy = -this.vy;
        return;
      }
    });

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

let paddle1 = new Element(5, canvas.height/2, 20, 200);
let paddle2 = new Element(canvas.width - 25, canvas.height/2, 20, 200);
let ball = new Element(canvas.width/2, canvas.height/2, 30, 30, 3, 2);
let topWall = new Element(0, 0, canvas.width, 1);
let bottomWall = new Element(0, canvas.height - 1, canvas.width, 1);

let gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  elements.forEach(element => {
    element.move();
    element.draw();
  });

  if (ball.right() < 0 || ball.left() > canvas.width) {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
  }

  window.requestAnimationFrame(gameLoop);
};

window.requestAnimationFrame(gameLoop);
