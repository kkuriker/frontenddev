const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const jumpSound = document.getElementById('jump-sound');
const gameOverSound = document.getElementById('game-over-sound');

let score = 0;
let level = 1;
let isJumping = false;
let obstacleInterval;
let obstacleSpeed = 3000;

// Saltul personajului
function jump() {
  if (isJumping) return;
  isJumping = true;
  jumpSound.play();
  player.style.animation = 'jump 0.5s linear';
  player.addEventListener('animationend', () => {
    player.style.animation = '';
    isJumping = false;
  });
}

// Crearea obstacolelor
function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  obstacle.style.animation = `move ${obstacleSpeed / 1000}s linear forwards`;
  document.querySelector('.game-container').appendChild(obstacle);

  obstacle.addEventListener('animationend', () => obstacle.remove());

  // Verifică dacă jucătorul a trecut obstacolul
  const checkPassInterval = setInterval(() => {
    const obstacleRect = obstacle.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (obstacleRect.right < playerRect.left) {
      score++;
      scoreDisplay.textContent = score;
      clearInterval(checkPassInterval);
    }
  }, 50);

  // Detectează coliziunea
  const collisionInterval = setInterval(() => {
    if (isColliding(player, obstacle)) {
      gameOverSound.play();
      clearInterval(obstacleInterval);
      clearInterval(collisionInterval);
      alert(`Game Over! Final Score: ${score}`);
      resetGame();
    }
  }, 50);
}

// Detectarea coliziunilor
function isColliding(player, obstacle) {
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  return !(
    playerRect.top > obstacleRect.bottom ||
    playerRect.bottom < obstacleRect.top ||
    playerRect.right < obstacleRect.left ||
    playerRect.left > obstacleRect.right
  );
}

// Start joc
function startGame() {
  obstacleInterval = setInterval(() => {
    createObstacle();

    // Crește nivelul și viteza după fiecare 5 obstacole trecute
    if (score > 0 && score % 5 === 0) {
      level++;
      levelDisplay.textContent = level;
      obstacleSpeed = Math.max(1000, obstacleSpeed - 200); // Obstacole mai rapide
    }
  }, obstacleSpeed);
}

// Reset joc
function resetGame() {
  score = 0;
  level = 1;
  obstacleSpeed = 3000;
  scoreDisplay.textContent = score;
  levelDisplay.textContent = level;
  startGame();
}

// Eveniment pentru salt
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') jump();
});

// Pornește jocul
startGame();