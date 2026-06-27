const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const hud = document.getElementById("hud");

const menuScreen = document.getElementById("menuScreen");
const victoryScreen = document.getElementById("victoryScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const scoreText = document.getElementById("scoreText");
const livesText = document.getElementById("livesText");
const levelText = document.getElementById("levelText");
const victoryScore = document.getElementById("victoryScore");

const playButton = document.getElementById("playButton");
const exitButton = document.getElementById("exitButton");
const nextLevelButton = document.getElementById("nextLevelButton");
const menuFromVictoryButton = document.getElementById("menuFromVictoryButton");
const retryButton = document.getElementById("retryButton");
const menuFromGameOverButton = document.getElementById("menuFromGameOverButton");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const PLAYER_RADIUS = 18;
const PEDESTRIAN_RADIUS = 18;
const CAR_WIDTH = 72;
const CAR_HEIGHT = 26;
const BASE_CAR_SPEED = 60;
const BASE_PEDESTRIAN_SPEED = 40;

const ROAD_TOP = HEIGHT * 0.28;
const ROAD_BOTTOM = HEIGHT * 0.72;
const ROAD_HEIGHT = ROAD_BOTTOM - ROAD_TOP;
const SIDEWALK_TOP = ROAD_TOP - 60;
const SIDEWALK_BOTTOM = ROAD_BOTTOM + 60;
const ROAD_SPRITE_Y = SIDEWALK_TOP;
const ROAD_SPRITE_HEIGHT = SIDEWALK_BOTTOM - SIDEWALK_TOP;
const LANE_Y_POSITIONS = [
  ROAD_TOP + ROAD_HEIGHT * 0.125,
  ROAD_TOP + ROAD_HEIGHT * 0.375,
  ROAD_TOP + ROAD_HEIGHT * 0.625,
  ROAD_TOP + ROAD_HEIGHT * 0.875,
];
const LANE_DIRECTIONS = [-1, 1, -1, 1];

let gameState = "menu";
let score = 0;
let lives = 5;
let cars = [];
const roadSprite = new Image();
const grassSprite = new Image();
const carSprite = new Image();
let roadSpriteLoaded = false;
let grassSpriteLoaded = false;
let carSpriteLoaded = false;
roadSprite.src = "Mapa/Calle.svg";
grassSprite.src = "Mapa/Pasto.svg";
carSprite.src = "Mapa/Auto.svg";
roadSprite.onload = () => {
  roadSpriteLoaded = true;
};
grassSprite.onload = () => {
  grassSpriteLoaded = true;
};
carSprite.onload = () => {
  carSpriteLoaded = true;
};
let pedestrians = [];
let totalPedestriansSpawned = 0;
let keys = {};
let trafficCooldown = 0;
let pedestrianCooldown = 0;
let lastFrameTime = 0;
let level = 1;

const player = {
  x: WIDTH / 2,
  y: HEIGHT / 2,
  radius: PLAYER_RADIUS,
  speed: 260,
};

function resetGame(selectedLevel = 1) {
  level = selectedLevel;
  score = 0;
  lives = 5;
  cars = [];
  pedestrians = createPedestrians();
  totalPedestriansSpawned = 3;
  trafficCooldown = 0;
  pedestrianCooldown = 0;
  lastFrameTime = 0;
  player.x = WIDTH / 2;
  player.y = HEIGHT / 2;
  updateHud();
}

function createPedestrians() {
  return Array.from({ length: 3 }, () => createPedestrian());
}

function createPedestrian() {
  const fromTop = Math.random() < 0.5;
  return {
    x: 80 + Math.random() * (WIDTH - 160),
    y: fromTop ? SIDEWALK_TOP : SIDEWALK_BOTTOM,
    radius: PEDESTRIAN_RADIUS,
    direction: fromTop ? 1 : -1,
    status: "crossing",
  };
}

function spawnPedestrian() {
  if (totalPedestriansSpawned >= 80) return;
  pedestrians.push(createPedestrian());
  totalPedestriansSpawned += 1;
}

function getActiveLaneCount() {
  if (level === 1) return 2;
  if (level === 2) return 3;
  return 4;
}

function getLaneDefinitions() {
  const activeCount = getActiveLaneCount();
  return LANE_Y_POSITIONS.map((y, index) => ({
    y,
    direction: LANE_DIRECTIONS[index],
    open: index < activeCount,
  }));
}

function spawnCar() {
  const lanes = getLaneDefinitions().filter(lane => lane.open);
  if (!lanes.length) return;

  const lane = lanes[Math.floor(Math.random() * lanes.length)];
  const x = lane.direction === 1 ? -CAR_WIDTH : WIDTH + CAR_WIDTH;
  const speedBoost = (level - 1) * 25;

  cars.push({
    x,
    y: lane.y,
    width: CAR_WIDTH,
    height: CAR_HEIGHT,
    speed: BASE_CAR_SPEED + speedBoost + Math.random() * 15,
    direction: lane.direction,
    remove: false,
    collided: false,
  });
}

function updateHud() {
  scoreText.textContent = score;
  livesText.textContent = lives;
  levelText.textContent = level;
}

function showScreen(screen) {
  menuScreen.classList.add("hidden");
  hud.classList.add("hidden");
  victoryScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");

  if (screen === "menu") {
    menuScreen.classList.remove("hidden");
  } else if (screen === "playing") {
    hud.classList.remove("hidden");
  } else if (screen === "victory") {
    victoryScreen.classList.remove("hidden");
  } else if (screen === "gameover") {
    gameOverScreen.classList.remove("hidden");
  }
}

function startGame(selectedLevel = 1) {
  resetGame(selectedLevel);
  gameState = "playing";
  showScreen("playing");
  window.requestAnimationFrame(gameLoop);
}

function endGame(victory) {
  gameState = victory ? "victory" : "gameover";
  showScreen(gameState);
  if (victory) {
    victoryScore.textContent = score;
  }
}

function updatePlayer(delta) {
  if (keys.ArrowUp || keys.w) player.y -= player.speed * delta;
  if (keys.ArrowDown || keys.s) player.y += player.speed * delta;
  if (keys.ArrowLeft || keys.a) player.x -= player.speed * delta;
  if (keys.ArrowRight || keys.d) player.x += player.speed * delta;

  player.x = Math.max(player.radius, Math.min(WIDTH - player.radius, player.x));
  player.y = Math.max(player.radius, Math.min(HEIGHT - player.radius, player.y));
}

function updatePedestrians(delta) {
  pedestrians.forEach(ped => {
    if (ped.status !== "crossing") return;

    ped.y += ped.direction * (BASE_PEDESTRIAN_SPEED + level * 10) * delta;

    if (ped.y <= SIDEWALK_TOP) {
      ped.status = "safe";
      ped.remove = true;
    }

    if (ped.y >= SIDEWALK_BOTTOM) {
      ped.status = "safe";
      ped.remove = true;
    }

    const playerDist = Math.hypot(player.x - ped.x, player.y - ped.y);
    if (playerDist <= player.radius + ped.radius) {
      ped.status = "saved";
      ped.remove = true;
      score += 1;
    }
  });

  pedestrians = pedestrians.filter(ped => !ped.remove);
}

function updateCars(delta) {
  cars.forEach(car => {
    car.x += car.direction * car.speed * delta;

    if (car.direction === 1 && car.x - car.width / 2 > WIDTH + 30) {
      car.remove = true;
    }
    if (car.direction === -1 && car.x + car.width / 2 < -30) {
      car.remove = true;
    }

    pedestrians.forEach(ped => {
      if (ped.status !== "crossing") return;
      const dx = Math.abs(car.x - ped.x);
      const dy = Math.abs(car.y - ped.y);
      if (dx < car.width / 2 + ped.radius && dy < car.height / 2 + ped.radius) {
        ped.status = "hit";
        ped.remove = true;
        lives -= 1;
      }
    });

    if (!car.collided) {
      const dx = Math.abs(car.x - player.x);
      const dy = Math.abs(car.y - player.y);
      if (dx < car.width / 2 && dy < car.height / 2 + player.radius) {
        car.collided = true;
        lives -= 1;
      }
    }
  });

  cars = cars.filter(car => !car.remove);
}

function updateTraffic(delta) {
  updatePedestrians(delta);
  updateCars(delta);
}

function drawBackground() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

if (grassSpriteLoaded) {
  ctx.drawImage(grassSprite, 0, 0, WIDTH, SIDEWALK_TOP);
  ctx.drawImage(grassSprite, 0, SIDEWALK_BOTTOM, WIDTH, HEIGHT - SIDEWALK_BOTTOM);
} else {
  ctx.fillStyle = "#3e5a42";
  ctx.fillRect(0, 0, WIDTH, SIDEWALK_TOP);
  ctx.fillRect(0, SIDEWALK_BOTTOM, WIDTH, HEIGHT - SIDEWALK_BOTTOM);
}

  if (roadSpriteLoaded) {
    ctx.drawImage(roadSprite, 0, ROAD_SPRITE_Y, WIDTH, ROAD_SPRITE_HEIGHT);
  } else {
    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(0, ROAD_TOP, WIDTH, ROAD_BOTTOM - ROAD_TOP);
  }

  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 3;
  ctx.setLineDash([28, 18]);
  for (let i = 1; i < 4; i++) {
    const y = ROAD_TOP + ROAD_HEIGHT * (i / 4);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let x = 0; x < WIDTH; x += 90) {
    ctx.fillRect(x + 10, ROAD_TOP + ROAD_HEIGHT * 0.15, 60, 8);
    ctx.fillRect(x + 10, ROAD_TOP + ROAD_HEIGHT * 0.35, 60, 8);
    ctx.fillRect(x + 10, ROAD_TOP + ROAD_HEIGHT * 0.55, 60, 8);
    ctx.fillRect(x + 10, ROAD_TOP + ROAD_HEIGHT * 0.75, 60, 8);
  }

  const lanes = getLaneDefinitions();
  lanes.forEach(lane => {
    if (lane.open) return;

    const barrierWidth = 20;
    const barrierHeight = 16;
    const gap = 8;
    ctx.fillStyle = "#fff";
    ctx.fillRect(gap, lane.y - barrierHeight / 2, barrierWidth, barrierHeight);
    ctx.fillRect(WIDTH - gap - barrierWidth, lane.y - barrierHeight / 2, barrierWidth, barrierHeight);
  });
}

function drawPlayer() {
  ctx.fillStyle = "#1e5aff";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(player.x - 6, player.y - 4, 4, 0, Math.PI * 2);
  ctx.arc(player.x + 6, player.y - 4, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawPedestrians() {
  pedestrians.forEach(person => {
    ctx.fillStyle = "#f6bc55";
    ctx.beginPath();
    ctx.arc(person.x, person.y, person.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🚶", person.x, person.y + 6);
  });
}

function drawCars() {
  const spriteWidth = CAR_WIDTH;
  const spriteHeight = CAR_HEIGHT;

  cars.forEach(car => {
    if (carSpriteLoaded && carSprite.width > 0 && carSprite.height > 0) {
      ctx.save();
      ctx.translate(car.x, car.y);
      if (car.direction === -1) {
        ctx.scale(-1, 1);
      }
      ctx.drawImage(carSprite, -spriteWidth / 2, -spriteHeight / 2, spriteWidth, spriteHeight);
      ctx.restore();
    } else {
      ctx.fillStyle = "#d32f2f";
      ctx.fillRect(car.x - car.width / 2, car.y - car.height / 2, car.width, car.height);
      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.arc(car.x - car.width * 0.3, car.y + car.height / 2, 6, 0, Math.PI * 2);
      ctx.arc(car.x + car.width * 0.3, car.y + car.height / 2, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function draw() {
  drawBackground();
  drawPedestrians();
  drawPlayer();
  drawCars();
}

function gameLoop(timestamp) {
  if (gameState !== "playing") return;
  const delta = lastFrameTime ? (timestamp - lastFrameTime) / 1000 : 0;
  lastFrameTime = timestamp;

  updatePlayer(delta);
  updateTraffic(delta);

  trafficCooldown -= delta;
  const activeLanes = getActiveLaneCount();
  if (trafficCooldown <= 0 && cars.length < activeLanes) {
    spawnCar();
    trafficCooldown = Math.max(1.5 - level * 0.15, 0.8);
  }

  pedestrianCooldown -= delta;
  if (pedestrianCooldown <= 0 && pedestrians.length < 5 && totalPedestriansSpawned < 80) {
    spawnPedestrian();
    pedestrianCooldown = Math.max(1.2, 2.4 - level * 0.2);
  }

  if (score >= 30) {
    endGame(true);
    return;
  }

  if (totalPedestriansSpawned >= 80 && pedestrians.length === 0 && score < 30) {
    endGame(false);
    return;
  }

  if (lives <= 0) {
    endGame(false);
    return;
  }

  updateHud();
  draw();
  requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

playButton.addEventListener("click", () => startGame(1));
exitButton.addEventListener("click", () => {
  window.close();
  alert("Cierra la pestaña para salir del juego.");
});
nextLevelButton.addEventListener("click", () => startGame(level + 1));
menuFromVictoryButton.addEventListener("click", () => {
  gameState = "menu";
  showScreen("menu");
});
retryButton.addEventListener("click", () => startGame(level));
menuFromGameOverButton.addEventListener("click", () => {
  gameState = "menu";
  showScreen("menu");
});

showScreen("menu");