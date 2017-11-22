
const Canvas = require('term-canvas');
const Player = require('player');
const keypress = require('keypress');

const size = process.stdout.getWindowSize();

keypress(process.stdin);

process.on('SIGINT', function(){
  ctx.reset();
  process.nextTick(function(){
    process.exit();
  });
  console.log('GAME OVER\nSCORE:', score);
});

process.on('SIGWINCH', function(){
  size = process.stdout.getWindowSize();
  canvas.width = size[0];
  canvas.height = size[1];
});

const canvas = new Canvas(size[0], size[1])
const ctx = canvas.getContext('2d')
const box = {
  x: 1,
  y: 2,
  velX: 2,
  velY: 2,
  height: canvas.height / 5,
  width: canvas.width / 5,
}

const player = {
  x: canvas.width / 70,
  y: canvas.height - canvas.height / 50,
  velX: 4,
  velY: 0,
  height: canvas.height / 50,
  width: canvas.width / 70,
}

let score = 1;


// create player instance
const mp3 = new Player('./sandstorm.mp3');

ctx.hideCursor();

const gameLoop = () => setInterval(function(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'blue';
  ctx.strokeRect(1, 1, canvas.width - 1, canvas.height - 1);
  ctx.strokeStyle = score > 16 ? 'red' : 'yellow';
  ctx.strokeRect(box.x += box.velX, box.y += box.velY, box.width, box.height);
  ctx.fillStyle = 'green';
  ctx.fillRect(player.x += player.velX, player.y += player.velY, player.width, player.height);
  ctx.moveTo(0, score);
  if (box.x + box.width >= canvas.width || box.x <= 1) box.velX = -box.velX;
  if (player.x + player.width >= canvas.width || player.x <= 1) player.velX = -player.velX;
  if (box.y <= 1) {
    box.velY = -box.velY;
    box.velY *= 1.05;
    box.velX *= 1.05;
  }
  if (box.y + box.height >= canvas.height) {
    score++;
    box.velY = -box.velY;
    if (player.x <= (box.x + box.width) && box.x <= (player.x + player.width)) {
      process.kill(process.pid, 'SIGINT');
    }
  }
}, 2000 / 20);


const start = () => {
  console.log('starting! press c to quit.');
  // play now and callback when playend
  mp3.play();
  mp3.on('playing', gameLoop);
}

process.stdin.on('keypress', function(ch, key){
  switch (key.name) {
    case 'left':
      player.velX = -4;
      break;
    case 'right':
      player.velX = 4;
      break;
    case 'c':
      process.kill(process.pid, 'SIGINT');
      break;
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();
start();
