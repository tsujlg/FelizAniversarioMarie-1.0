// Declaração e interação da página
const quoteDiv = document.querySelector('.funny-quote');
const surpriseBtn = document.querySelector('.surprise-btn');
const surpriseMessage = document.getElementById('surpriseMessage');

quoteDiv.addEventListener('click', () => {
  alert('Feliz aniversário! Que seu dia seja tão especial e incrível quanto você é para mim. :)');
});

surpriseBtn.addEventListener('click', () => {
  surpriseMessage.style.display = 'block';
  surpriseBtn.style.display = 'none';
});

// Mini game Flappy Bird simples
(() => {
  const canvas = document.getElementById('flappyCanvas');
  const ctx = canvas.getContext('2d');

  const bird = {
    x: 60,
    y: 150,
    width: 34,
    height: 24,
    gravity: 0.6,
    lift: -10,
    velocity: 0,
    draw() {
      ctx.fillStyle = '#6b4f9a';
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      // olho
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(this.x + 8, this.y - 5, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(this.x + 9, this.y - 5, 2.5, 0, Math.PI * 2);
      ctx.fill();
    },
    update() {
      this.velocity += this.gravity;
      this.velocity *= 0.9; // arrasto
      this.y += this.velocity;

      if (this.y + this.height / 2 > canvas.height) {
        this.y = canvas.height - this.height / 2;
        this.velocity = 0;
      }
      if (this.y - this.height / 2 < 0) {
        this.y = this.height / 2;
        this.velocity = 0;
      }
    },
    up() {
      this.velocity += this.lift;
    }
  };

  class Pipe {
    constructor() {
      this.top = Math.random() * (canvas.height / 2);
      this.bottom = canvas.height - (this.top + 120);
      this.x = canvas.width;
      this.width = 40;
      this.speed = 2;
    }
    draw() {
      ctx.fillStyle = '#d94f4f';
      // tubo de cima
      ctx.fillRect(this.x, 0, this.width, this.top);
      // tubo de baixo
      ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
    }
    update() {
      this.x -= this.speed;
    }
    offscreen() {
      return this.x + this.width < 0;
    }
  }

  let pipes = [];
  let frameCount = 0;
  let score = 0;
  let gameOver = false;

  function drawScore() {
    ctx.fillStyle = '#6b4f9a';
    ctx.font = '20px Indie Flower, cursive';
    ctx.fillText('Pontuação: ' + score, 10, 30);
  }

  function resetGame() {
    pipes = [];
    frameCount = 0;
    score = 0;
    gameOver = false;
    bird.y = 150;
    bird.velocity = 0;
  }

  function checkCollision(pipe) {
    if (
      bird.x + bird.width / 2 > pipe.x &&
      bird.x - bird.width / 2 < pipe.x + pipe.width &&
      (bird.y - bird.height / 2 < pipe.top ||
        bird.y + bird.height / 2 > canvas.height - pipe.bottom)
    ) {
      return true;
    }
    return false;
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.update();
    bird.draw();

    if (frameCount % 90 === 0) {
      pipes.push(new Pipe());
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      pipes[i].draw();

      if (checkCollision(pipes[i])) {
        gameOver = true;
      }

      if (!gameOver && pipes[i].x + pipes[i].width < bird.x && !pipes[i].scored) {
        score++;
        pipes[i].scored = true;
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    drawScore();

    if (!gameOver) {
      frameCount++;
      requestAnimationFrame(gameLoop);
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.font = '30px Indie Flower, cursive';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
      ctx.font = '20px Indie Flower, cursive';
      ctx.fillText('Clique para jogar de novo', canvas.width / 2, canvas.height / 2 + 20);
    }
  }

  canvas.addEventListener('click', () => {
    if (gameOver) {
      resetGame();
      gameLoop();
    } else {
      bird.up();
    }
  });

  // inicia o jogo
  gameLoop();
})();
