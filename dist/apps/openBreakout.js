// openBreakout — fullscreen Breakout with 10 levels
// Exposes window.openBreakout.init({ canvas, menuEl }) -> { destroy() }

(function () {
function create(tag, cls, id, text) {
const el = document.createElement(tag);
if (cls) el.className = cls;
if (id) el.id = id;
if (text) el.textContent = text;
return el;
}

function init({ canvas, menuEl }) {
const ctx = canvas.getContext('2d');

// UI
const title = create('h1', 'title', null, 'openBreakout');
const hud = create('div', 'hud', 'hudEl');
const scoreBox = create('div', 'item', 'scoreBox', 'Score: 0');
const livesBox = create('div', 'item', 'livesBox', 'Lives: 3');
const levelBox = create('div', 'item', 'levelBox', 'Level: 1 / 10');
hud.append(scoreBox, livesBox, levelBox);

const controls = create('div', 'controls');
const pauseBtn = create('button', 'btn', 'pauseBtn', 'Pause');
controls.appendChild(pauseBtn);

const hint = create('div', 'hint', null, 'Move: Left/Right or A/D or Mouse • Start: Space • Pause: P');
const overlay = create('div', 'overlay', 'overlay', 'Press Space to start');

document.body.append(title, hud, controls, hint, overlay);

// State
let width = 0, height = 0, dpr = Math.max(1, window.devicePixelRatio || 1);
const state = {
  running: false,
  paused: false,
  awaitingServe: true,
  levelIndex: 0,
  lives: 3,
  score: 0,
  paddle: { x: 0, y: 0, w: 0, h: 0, speed: 0 },
  ball: { x: 0, y: 0, r: 0, speed: 0, vx: 0, vy: 0, stuck: true },
  bricks: [],
  keys: Object.create(null),
  mouseX: null,
  uiTopMarginCanvas: 0
};

function clamp(v, min, max) { return v < min ? min : (v > max ? max : v); }

function updateHUD() {
  scoreBox.textContent = 'Score: ' + state.score;
  livesBox.textContent = 'Lives: ' + state.lives;
  levelBox.textContent = 'Level: ' + (state.levelIndex + 1) + ' / 10';
}

// Measure bottom edge of menu, title and HUD (CSS px) and convert to canvas px
function measureUiSafeTop() {
  const menuBottom = menuEl ? menuEl.getBoundingClientRect().bottom : 0;
  const titleBottom = title.getBoundingClientRect().bottom;
  const hudBottom = hud.getBoundingClientRect().bottom;
  const bottomCSS = Math.max(menuBottom, titleBottom, hudBottom);
  const paddingCSS = 24;
  state.uiTopMarginCanvas = Math.round((bottomCSS + paddingCSS) * dpr);
}

function layout() {
  dpr = Math.max(1, window.devicePixelRatio || 1);
  width  = Math.floor(window.innerWidth  * dpr);
  height = Math.floor(window.innerHeight * dpr);
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';

  measureUiSafeTop();

  // Paddle
  state.paddle.w = Math.max(80 * dpr, Math.round(width * 0.12));
  state.paddle.h = Math.max(14 * dpr, Math.round(height * 0.02));
  state.paddle.speed = Math.max(6 * dpr, Math.round(width * 0.012));
  state.paddle.x = (width - state.paddle.w) / 2;
  state.paddle.y = height - Math.max(60 * dpr, Math.round(height * 0.08));

  // Ball
  state.ball.r = Math.max(6 * dpr, Math.round(Math.min(width, height) * 0.012));
  resetBallToPaddle();

  buildLevel(state.levelIndex);
  updateHUD();
}

function resetBallToPaddle() {
  state.ball.speed = Math.max(6 * dpr, Math.round(Math.min(width, height) * 0.015)) + state.levelIndex * (1.2 * dpr);
  state.ball.x = state.paddle.x + state.paddle.w / 2;
  state.ball.y = state.paddle.y - state.ball.r - 2 * dpr;
  state.ball.vx = 0; state.ball.vy = 0;
  state.ball.stuck = true;
  state.awaitingServe = true;
  state.running = false;
  overlay.classList.remove('hidden');
  overlay.textContent = 'Press Space to start';
}

function startServe() {
  if (!state.awaitingServe || state.paused) return;
  const angles = [ -Math.PI * 0.30, -Math.PI * 0.40, -Math.PI * 0.50, -Math.PI * 0.60, -Math.PI * 0.70 ];
  const angle = angles[Math.floor(Math.random() * angles.length)];
  const dir = Math.random() < 0.5 ? -1 : 1;
  const a = -Math.PI / 2 + (angle + Math.PI / 2) * dir;
  state.ball.vx = Math.cos(a) * state.ball.speed;
  state.ball.vy = Math.sin(a) * state.ball.speed;
  state.ball.stuck = false;
  state.awaitingServe = false;
  state.running = true;
  overlay.classList.add('hidden');
}

function setPaused(p) {
  state.paused = !!p;
  if (state.paused) {
    overlay.textContent = 'Paused — Press P to resume';
    overlay.classList.remove('hidden');
    pauseBtn.textContent = 'Resume';
  } else {
    if (!state.awaitingServe) overlay.classList.add('hidden');
    pauseBtn.textContent = 'Pause';
  }
}

function showLevelOverlay() {
  overlay.textContent = 'Level ' + (state.levelIndex + 1) + ' — Press Space';
  overlay.classList.remove('hidden');
}

function levelDefinition(i) {
  const full = () => (r,c,rows,cols) => true;
  const checker = () => (r,c) => ((r + c) % 2 === 0);
  const pyramid = () => (r,c,rows,cols) => {
    const mid = Math.floor(cols / 2);
    const width = cols - r * 2;
    return c >= mid - Math.floor(width/2) && c < mid + Math.ceil(width/2);
  };
  const frame = () => (r,c,rows,cols) => (r === 0 || r === rows - 1 || c === 0 || c === cols - 1);
  const diag = () => (r,c,rows,cols) => (r === c || r + c === cols - 1);
  const band3 = () => (r,c,rows) => (r === 1 || r === Math.floor(rows/2) || r === rows - 2);
  const steps = () => (r,c,rows) => (c <= r + 1);
  const innerHole = () => (r,c,rows,cols) => !(r > 1 && r < rows - 2 && c > 1 && c < cols - 2);
  const sparseRandom = (density=0.7) => (r,c) => Math.random() < density;

  const hp1 = (r,c,b) => 1;
  const hpRow = (r,c,b) => Math.max(1, b + Math.floor(r/2));
  const hpBand = (r,c,b) => (r % 3 === 1 ? b + 1 : b);

  const defs = [
    { rows: 5, cols: 10, pattern: full(),            hp: hp1,                    hpBase: 1 },
    { rows: 6, cols: 11, pattern: checker(),         hp: hp1,                    hpBase: 1 },
    { rows: 7, cols: 12, pattern: innerHole(),       hp: hp1,                    hpBase: 1 },
    { rows: 7, cols: 11, pattern: pyramid(),         hp: (r,c,b)=>b+(r>3?1:0),   hpBase: 1 },
    { rows: 6, cols: 12, pattern: frame(),           hp: (r,c,b)=>b+1,           hpBase: 1 },
    { rows: 8, cols: 12, pattern: diag(),            hp: hpRow,                  hpBase: 1 },
    { rows: 7, cols: 10, pattern: steps(),           hp: hpBand,                 hpBase: 1 },
    { rows: 8, cols: 12, pattern: band3(),           hp: (r,c,b)=>b+1,           hpBase: 1 },
    { rows: 6, cols: 12, pattern: sparseRandom(0.7), hp: hp1,                    hpBase: 2 },
    { rows: 9, cols: 13, pattern: full(),            hp: (r,c,b)=>b+(r%3===0?1:0), hpBase: 2 },
  ];
  const d = defs[i % defs.length];
  return d;
}

function buildLevel(i) {
  const def = levelDefinition(i);
  const rows = def.rows, cols = def.cols, hpBase = def.hpBase;

  const topMargin = state.uiTopMarginCanvas;
  const sideMargin = Math.round(width * 0.06);
  const areaW = width - sideMargin * 2;
  const gapX = Math.max(6 * dpr, Math.round(width * 0.004));
  const gapY = Math.max(6 * dpr, Math.round(height * 0.008));
  const brickW = Math.floor((areaW - (cols - 1) * gapX) / cols);
  const brickH = Math.max(16 * dpr, Math.round(Math.min(height, width) * 0.03));

  const bricks = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!def.pattern(r, c, rows, cols)) continue;
      const x = sideMargin + c * (brickW + gapX);
      const y = topMargin + r * (brickH + gapY);
      const hp = typeof def.hp === 'function' ? def.hp(r, c, hpBase) : hpBase;
      bricks.push({ x, y, w: brickW, h: brickH, hp, alive: true });
    }
  }
  state.bricks = bricks;
}

function drawBackground() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
}
function drawPaddle() {
  ctx.fillStyle = '#000';
  ctx.fillRect(state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h);
}
function drawBall() {
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(state.ball.x, state.ball.y, state.ball.r, 0, Math.PI * 2);
  ctx.fill();
}
function drawBricks() {
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = Math.max(2 * dpr, 2);
  for (const b of state.bricks) {
    if (!b.alive) continue;
    if (b.hp <= 1) ctx.fillRect(b.x, b.y, b.w, b.h);
    else {
      ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
      const pad = Math.max(3 * dpr, Math.round(b.h * 0.18));
      const y1 = b.y + pad;
      const y2 = b.y + b.h - pad;
      ctx.beginPath();
      ctx.moveTo(b.x + pad, y1);
      ctx.lineTo(b.x + b.w - pad, y1);
      if (b.hp >= 3) {
        ctx.moveTo(b.x + pad, y2);
        ctx.lineTo(b.x + b.w - pad, y2);
      }
      ctx.stroke();
    }
  }
  ctx.restore();
}

function circleIntersectsRect(cx, cy, cr, rx, ry, rw, rh) {
  const nearestX = Math.max(rx, Math.min(cx, rx + rw));
  const nearestY = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - nearestX;
  const dy = cy - nearestY;
  return (dx * dx + dy * dy) <= cr * cr;
}

function update(dt) {
  if (state.paused) return;

  // Keyboard move
  let move = 0;
  if (state.keys['ArrowLeft'] || state.keys['KeyA']) move -= 1;
  if (state.keys['ArrowRight'] || state.keys['KeyD']) move += 1;

  // Mouse (CSS -> canvas via dpr)
  if (state.mouseX !== null) {
    const target = state.mouseX * dpr - state.paddle.w / 2;
    const dx = target - state.paddle.x;
    const maxStep = state.paddle.speed * (dt * 60);
    if (Math.abs(dx) > maxStep) state.paddle.x += Math.sign(dx) * maxStep;
    else state.paddle.x = target;
  } else {
    state.paddle.x += move * state.paddle.speed * (dt * 60);
  }
  state.paddle.x = clamp(state.paddle.x, 0, width - state.paddle.w);

  // Stick to paddle before serve
  if (state.ball.stuck) {
    state.ball.x = state.paddle.x + state.paddle.w / 2;
    state.ball.y = state.paddle.y - state.ball.r - 2 * dpr;
    return;
  }
  if (!state.running) return;

  // Ball motion
  state.ball.x += state.ball.vx * (dt * 60);
  state.ball.y += state.ball.vy * (dt * 60);
  const r = state.ball.r;

  // Walls
  if (state.ball.x - r <= 0 && state.ball.vx < 0) { state.ball.x = r; state.ball.vx *= -1; }
  else if (state.ball.x + r >= width && state.ball.vx > 0) { state.ball.x = width - r; state.ball.vx *= -1; }
  if (state.ball.y - r <= 0 && state.ball.vy < 0) { state.ball.y = r; state.ball.vy *= -1; }

  // Bottom = life lost
  if (state.ball.y - r > height) { loseLife(); return; }

  // Paddle collision
  if (circleIntersectsRect(state.ball.x, state.ball.y, r, state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h)
      && state.ball.vy > 0) {
    const hit = (state.ball.x - (state.paddle.x + state.paddle.w / 2)) / (state.paddle.w / 2);
    const maxBounce = Math.PI / 3;
    const angle = -Math.PI / 2 + hit * maxBounce;
    const speed = Math.hypot(state.ball.vx, state.ball.vy) * 1.01;
    state.ball.vx = Math.cos(angle) * speed;
    state.ball.vy = Math.sin(angle) * speed;
    state.ball.y = state.paddle.y - r - 1;
  }

  // Brick collision (handle first)
  for (const b of state.bricks) {
    if (!b.alive) continue;
    if (!circleIntersectsRect(state.ball.x, state.ball.y, r, b.x, b.y, b.w, b.h)) continue;

    const prevX = state.ball.x - state.ball.vx * (dt * 60);
    const prevY = state.ball.y - state.ball.vy * (dt * 60);
    const fromLeft   = prevX <= b.x && state.ball.vx > 0;
    const fromRight  = prevX >= b.x + b.w && state.ball.vx < 0;
    const fromTop    = prevY <= b.y && state.ball.vy > 0;
    const fromBottom = prevY >= b.y + b.h && state.ball.vy < 0;

    const overlapLeft   = (state.ball.x + r) - b.x;
    const overlapRight  = (b.x + b.w) - (state.ball.x - r);
    const overlapTop    = (state.ball.y + r) - b.y;
    const overlapBottom = (b.y + b.h) - (state.ball.y - r);

    const minHoriz = Math.min(overlapLeft, overlapRight);
    const minVert  = Math.min(overlapTop, overlapBottom);

    if ((minHoriz < minVert && (fromLeft || fromRight)) || (!fromTop && !fromBottom && minHoriz < minVert)) {
      state.ball.vx *= -1;
      if (fromLeft)  state.ball.x = b.x - r - 1;
      if (fromRight) state.ball.x = b.x + b.w + r + 1;
    } else {
      state.ball.vy *= -1;
      if (fromTop)    state.ball.y = b.y - r - 1;
      if (fromBottom) state.ball.y = b.y + b.h + r + 1;
    }

    b.hp -= 1;
    state.score += (b.hp <= 0) ? 100 : 50;
    if (b.hp <= 0) b.alive = false;
    updateHUD();

    if (state.bricks.every(br => !br.alive)) nextLevel();
    break;
  }
}

function loseLife() {
  state.lives -= 1;
  updateHUD();
  if (state.lives <= 0) {
    gameOver();
  } else {
    resetBallToPaddle();
    overlay.textContent = 'Life lost — Press Space';
    overlay.classList.remove('hidden');
  }
}

function nextLevel() {
  state.levelIndex += 1;
  if (state.levelIndex >= 10) {
    overlay.textContent = 'You beat all 10 levels! Final score: ' + state.score + ' — Press Space to play again';
    overlay.classList.remove('hidden');
    state.levelIndex = 0;
    state.lives = 3;
    updateHUD();
  }
  buildLevel(state.levelIndex);
  const minW = Math.max(70 * dpr, Math.round(width * 0.08));
  state.paddle.w = Math.max(minW, Math.round(state.paddle.w * 0.94));
  resetBallToPaddle();
  showLevelOverlay();
}

function gameOver() {
  state.running = false;
  state.awaitingServe = true;
  overlay.textContent = 'Game Over — Score: ' + state.score + ' — Press Space to restart';
  overlay.classList.remove('hidden');
  state.levelIndex = 0;
  state.lives = 3;
  state.score = 0;
  updateHUD();
  buildLevel(state.levelIndex);
  resetBallToPaddle();
}

function render() {
  drawBackground();
  drawBricks();
  drawPaddle();
  drawBall();
}

let lastTime = 0, raf = 0;
function loop(ts) {
  const dt = Math.min(0.05, (ts - lastTime) / 1000) || 0.016;
  lastTime = ts;
  update(dt);
  render();
  raf = requestAnimationFrame(loop);
}

// Events
const onKeyDown = (e) => {
  const code = e.code;
  if (code === 'Space') {
    e.preventDefault();
    if (!state.paused && state.awaitingServe) startServe();
    return;
  }
  if (code === 'KeyP') {
    e.preventDefault();
    setPaused(!state.paused);
    return;
  }
  if (code === 'ArrowLeft' || code === 'ArrowRight' || code === 'KeyA' || code === 'KeyD') {
    e.preventDefault();
    state.keys[code] = true;
  }
};
const onKeyUp = (e) => { state.keys[e.code] = false; };
const onMouseMove = (e) => { state.mouseX = e.clientX; };
const onResize = () => layout();
const onPauseClick = () => setPaused(!state.paused);

window.addEventListener('keydown', onKeyDown, { passive: false });
window.addEventListener('keyup', onKeyUp);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('resize', onResize);
pauseBtn.addEventListener('click', onPauseClick);

// Init
layout();
lastTime = performance.now();
raf = requestAnimationFrame(loop);

const api = {
  destroy() {
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    pauseBtn.removeEventListener('click', onPauseClick);
    [title, hud, controls, hint, overlay].forEach(n => n.remove());
    // clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
};
return api;
}

window.openBreakout = { init };
})();