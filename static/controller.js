const socket = io();

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
