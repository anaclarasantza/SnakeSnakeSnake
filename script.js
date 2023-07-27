// Definição do canvas e contexto
const canvas = document.querySelector('canvas');
canvas.width = 608;
canvas.height = 608;
const c = canvas.getContext('2d');

// Variáveis do jogo
let score = 0,
    snake,
    food,
    food2,
    highScore = 0,
    game;
const box = 32;

// Carregamento das imagens
let alfabetoImg = new Image();
let alfabetoImg1 = new Image();
let ground = new Image();

// Array de consoantes e vogais
const consoantes = [
  "alfabeto/B.png", "alfabeto/C.png", "alfabeto/D.png", "alfabeto/F.png", "alfabeto/G.png",
  "alfabeto/H.png", "alfabeto/J.png", "alfabeto/K.png", "alfabeto/L.png", "alfabeto/M.png", "alfabeto/N.png",
  "alfabeto/P.png", "alfabeto/Q.png", "alfabeto/R.png", "alfabeto/S.png", "alfabeto/T.png", "alfabeto/V.png", "alfabeto/W.png",
  "alfabeto/X.png", "alfabeto/Y.png", "alfabeto/Z.png"
];

const vogais = [
  "alfabeto/A.png", "alfabeto/E.png", "alfabeto/I.png", "alfabeto/O.png", "alfabeto/U.png"
];

// Definição dos sons
let up = new Audio();
let down = new Audio();
let left = new Audio();
let right = new Audio();
let eat = new Audio();
let dead = new Audio();

up.src = 'audio/up.mp3';
down.src = 'audio/down.mp3';
left.src = 'audio/left.mp3';
right.src = 'audio/right.mp3';
eat.src = 'audio/eat.mp3';
dead.src = 'audio/dead.mp3';

// Posições da consoante e vogal
let consoantePosition = { x: 0, y: 0 };
let vogalPosition = { x: 0, y: 0 };

// Carregamento da imagem de fundo
ground.src = 'img/ground.png';

// Função para gerar uma posição aleatória para a consoante
function frutaAleatoria() {
  consoantePosition = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
  };

  let randomNumber = Math.floor(Math.random() * consoantes.length);
  alfabetoImg.src = consoantes[randomNumber];
}

// Função para gerar uma posição aleatória para a vogal
function frutaAleatoria1() {
  vogalPosition = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
  };

  let randomNumber1 = Math.floor(Math.random() * vogais.length);
  alfabetoImg1.src = vogais[randomNumber1];
}

// Carregamento do fundo e exibição das instruções ao finalizar o carregamento
ground.onload = function() {
  c.drawImage(ground, 0, 0);

  c.fillStyle = 'white';
  c.font = '40px Calibri';

  c.font = '30px Calibri';
  if (score < 50) {
    c.fillText("PEGUE APENAS AS VOGAIS ", 5 * box, 1.4 * box);
  } else {
    c.fillText("AGORA PEGUE APENAS AS CONSOANTES: ", 2 * box, 1.4 * box);
  }
}

// Evento de tecla pressionada
document.addEventListener('keydown', direction);

let dir;

// Exibição das instruções e início do jogo ao clicar no canvas
// showInstructions();
function startGame() {
  clearInterval(game);

  score = 0;

  snake = [];
  snake[0] = {
    x: 9 * box,
    y: 10 * box
  };

  dir = '';

  game = setInterval(draw, 150);
  frutaAleatoria();
  frutaAleatoria1();
}

// Função para desenhar o jogo
function draw() {
  c.drawImage(ground, 0, 0);

  for (let i = 0; i < snake.length; i++) {
    c.fillStyle = (i == 0) ? 'green' : 'white';
    c.fillRect(snake[i].x, snake[i].y, box, box);
    c.strokeStyle = 'red';
    c.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  c.drawImage(alfabetoImg, consoantePosition.x, consoantePosition.y, box, box);
  c.drawImage(alfabetoImg1, vogalPosition.x, vogalPosition.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (dir === 'LEFT') snakeX -= box;
  if (dir === 'UP') snakeY -= box;
  if (dir === 'RIGHT') snakeX += box;
  if (dir === 'DOWN') snakeY += box;

  if (snakeX === consoantePosition.x && snakeY === consoantePosition.y) {
    eat.play();
    frutaAleatoria();
    frutaAleatoria1();
    if (score >= 50) {
      score += 10;
    } else {
      alert("Apenas vogais");
    }
  } else if (snakeX === vogalPosition.x && snakeY === vogalPosition.y) {
    eat.play();

    frutaAleatoria();
    frutaAleatoria1();
    if (score < 50) {
      score += 10;
    } else {
      alert("Apenas consoantes");
    }
  } else {
    snake.pop();
  }

  let newHead = {
    x: snakeX,
    y: snakeY
  };

  if (snakeX < box || snakeX > 17 * box || snakeY < 3 * box || snakeY > 17 * box || collision(newHead, snake)) {
    clearInterval(game);
    dead.play();
    setTimeout(() => {
      c.clearRect(0, 0, canvas.width, canvas.height);
      ground.onload();
      showInstructions();
    }, 1000);
    return;
  }

  snake.unshift(newHead);

  c.fillStyle = 'white';
  c.font = '40px Calibri';

  c.font = '27px Calibri';
  if (score < 50) {
    c.fillText(" Apenas vogais: " + score, 12 * box, 1.4 * box);
  } else {
    c.fillText(" Apenas consoantes: " + score, 10 * box, 1.4 * box);
  }
}

// Função para verificar colisão
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
}
  return false;
}

// Função para capturar a direção do teclado
function direction(event) {
  if (event.keyCode === 37 && dir !== 'RIGHT') {
    left.play();
    dir = 'LEFT';
  } else if (event.keyCode === 38 && dir !== 'DOWN') {
    up.play();
    dir = 'UP';
  } else if (event.keyCode === 39 && dir !== 'LEFT') {
    right.play();
    dir = 'RIGHT';
  } else if (event.keyCode === 40 && dir !== 'UP') {
    down.play();
    dir = 'DOWN';
  }
}

// Evento de clique no canvas para iniciar o jogo
canvas.addEventListener('click', () => {
  startGame();
});
