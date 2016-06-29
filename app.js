"use strict";
const express = require('express');
const twilio = require('twilio');
const bodyParser = require('body-parser');

const playerOne = '';
const playerTwo = '';

const app = express();

// Run server to listen on port 3000.
const server = app.listen(3000, () => {
  console.log('listening on *:3000');
});

const io = require('socket.io')(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/handle-input', (req, res) => {
  const digitPressed = req.body.Digits;
  const player = req.body.From === PLAYER_ONE ? 1
               : req.body.From === PLAYER_TWO ? 2
               : null;

  let twiml = new twilio.TwimlResponse();

  if (digitPressed) {
    io.emit('input', { 'player': player, 'button': digitPressed });
  }

  twiml.gather({
    numDigits: '1',
    action: '/handle-key',
    method: 'POST',
    timeout: '1000'
  });

  res.send(twiml.toString());
});
