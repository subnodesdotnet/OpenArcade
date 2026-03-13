// openPong — black paddles on white background, Space to start, CPU/2P toggle
// Exposes window.openPong.init({ canvas, menuEl }) -> { destroy() }

(function () {
function create(tag, cls, id, text) {
const el = document.createElement(tag);
if (cls) el.className = cls;
if (id) el.id = id;
if (text) el.textContent = text;
return el;
}

function init({ canvas }) {
const ctx = canvas.getContext('2d');

// UI
const title = create('h1', 'title', null, 'openpong');
const hud = create('div', 'hud');
const p1El = create('span', 'score', 'p1score');
const divider = create('span', 'divider', null, ':');
const p2El = create('span', 'score', 'p2score');
hud.append(p1El, divider, p2El);

const controls = create('div', 'controls');
const modeBtn = create('button', 'btn', 'modeBtn');
modeBtn.textContent = 'Mode: CPU';
modeBtn.setAttribute('aria-pressed', 'true');
controls.appendChild(modeBtn);

const hint = create('div', 'hint', 'hint');
hint.textContent = 'Start: Space • P1 W/S • P2 ArrowUp/Down (2P)';

const overlay = create('div', 'overlay', 'overlay');
overlay.textContent = 'Press Space to start';

document.body.append(title, hud, controls, hint, overlay);

// State
let width = 0, height = 0, dpr = Math.max(1, window.devicePixelRatio || 1);
const state = {
  mode: 'cpu',
  waiting: true,
  p1: { x: 0, y: 0, w: 0, h: 0, speed: 0 },
  p2: { x: 0, y: 0, w: 0, h: 0, speed: 0 },
  ball: { x: 0, y: 0, r: 0, vx: 0, vy: 0, speed: 0, active: false },
  next: { dirRight: 1, angle: 0 },
  scores: { p1: 0, p2: 0 },
  ai: { speedFactor: 0.92, jitter: 0 }
};
const keys = Object.create(null);

function clamp(v, min, max) { return v < min ? min : (v > max ? max : v); }

function layout() {
  dpr = Math.max(1, window.devicePixelRatio || 1);
  width  = Math.floor(window.innerWidth  * dpr);
  height = Math.floor(window.innerHeight * dpr);
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';

  // Paddles
  const padW = Math.max(10 * dpr, Math.round(width * 0.012));
  const padH = Math.max(70 * dpr, Math.round(height * 0.22));
  const padMargin = Math.round(width * 0.03);
  const padSpeed = Math.max(6 * dpr, Math.round(height * 0.015));
  state.p1.w = state.p2.w = padW;
  state.p1.h = state.p2.h = padH;
  state.p1.speed = state.p2.speed = padSpeed;
  state.p1.x = padMargin;
  state.p2.x = width - padMargin - padW;

  if (state.p1.y === 0 && state.p2.y === 0) {
    state.p1.y = (height - padH) / 2;
    state.p2.y = (height - padH) / 2;
  } else {
    state.p1.y = clamp(state.p1.y, 0, height - padH);
    state.p2.y = clamp(state.p2.y, 0, height - padH);
  }

  // Ball
  state.ball.r = Math.max(6 * dpr, Math.round(Math.min(width, height) * 0.012));
  prepareServe();
}

function drawBackground() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  // mid line
  ctx.save();
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = Math.max(2 * dpr, 2);
  ctx.setLineDash([12 * dpr, 12 * dpr]);
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();
  ctx.restore();
}
function drawPaddles() {
  ctx.fillStyle = '#000';
  ctx.fillRect(state.p1.x, state.p1.y, state.p1.w, state.p1.h);
  ctx.fillRect(state.p2.x, state.p2.y, state.p2.w, state.p2.h);
}
function drawBall() {
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(state.ball.x, state.ball.y, state.ball.r, 0, Math.PI * 2);
  ctx.fill();
}

function prepareServe() {
  const dirRight = Math.random() < 0.5 ? -1 : 1;
  const maxAngle = 0.5;
  const angle = (Math.random() * 2 - 1) * maxAngle;
  const base = Math.max(5 * dpr, Math.round(Math.min(width, height) * 0.012)) + 6 * dpr;
  state.ball.speed = base;
  state.ball.x = width / 2;
  state.ball.y = height / 2;
  state.next.dirRight = dirRight;
  state.next.angle = angle;
  state.ball.active = false;
  state.ball.vx = 0; state.ball.vy = 0;
  state.waiting = true;
  overlay.classList.remove('hidden');
}
function startServe() {
  state.ball.vx = Math.cos(state.next.angle) * state.ball.speed * state.next.dirRight;
  state.ball.vy = Math.sin(state.next.angle) * state.ball.speed;
  state.ball.active = true;
  state.waiting = false;
  overlay.classList.add('hidden');
}

function updateAI() {
  const speed = state.p2.speed * state.ai.speedFactor;
  let targetY;
  if (!state.ball.active) {
    targetY = (height - state.p2.h) / 2;
  } else if (state.ball.vx > 0) {
    state.ai.jitter += (Math.random() - 0.5) * 0.4;
    state.ai.jitter = clamp(state.ai.jitter, -6 * dpr, 6 * dpr);
    targetY = state.ball.y - state.p2.h / 2 + state.ai.jitter;
  } else {
    targetY = (height - state.p2.h) / 2;
  }
  const dy = targetY - state.p2.y;
  if (Math.abs(dy) > speed) state.p2.y += Math.sign(dy) * speed;
  else state.p2.y = targetY;
  state.p2.y = clamp(state.p2.y, 0, height - state.p2.h);
}

function update() {
  // Inputs
  if (keys['KeyW']) state.p1.y -= state.p1.speed;
  if (keys['KeyS']) state.p1.y += state.p1.speed;
  if (state.mode === '2p') {
    if (keys['ArrowUp']) state.p2.y -= state.p2.speed;
    if (keys['ArrowDown']) state.p2.y += state.p2.speed;
  } else {
    updateAI();
  }
  state.p1.y = clamp(state.p1.y, 0, height - state.p1.h);
  state.p2.y = clamp(state.p2.y, 0, height - state.p2.h);

  // Ball
  if (state.ball.active) {
    state.ball.x += state.ball.vx;
    state.ball.y += state.ball.vy;

    if (state.ball.y - state.ball.r <= 0 && state.ball.vy < 0) {
      state.ball.y = state.ball.r; state.ball.vy *= -1;
    } else if (state.ball.y + state.ball.r >= height && state.ball.vy > 0) {
      state.ball.y = height - state.ball.r; state.ball.vy *= -1;
    }

    // Left paddle
    if (state.ball.vx < 0 &&
        state.ball.x - state.ball.r <= state.p1.x + state.p1.w &&
        state.ball.y + state.ball.r >= state.p1.y &&
        state.ball.y - state.ball.r <= state.p1.y + state.p1.h) {
      const rel = (state.ball.y - (state.p1.y + state.p1.h / 2)) / (state.p1.h / 2);
      const maxBounce = Math.PI / 3;
      const bounce = Math.max(-1, Math.min(1, rel)) * maxBounce;
      const speedUp = Math.min(1.12, 1.03 + Math.abs(rel) * 0.05);
      state.ball.speed *= speedUp;
      state.ball.vx = Math.cos(bounce) * state.ball.speed;
      state.ball.vy = Math.sin(bounce) * state.ball.speed;
      state.ball.x = state.p1.x + state.p1.w + state.ball.r + 1;
    }

    // Right paddle
    if (state.ball.vx > 0 &&
        state.ball.x + state.ball.r >= state.p2.x &&
        state.ball.y + state.ball.r >= state.p2.y &&
        state.ball.y - state.ball.r <= state.p2.y + state.p2.h) {
      const rel = (state.ball.y - (state.p2.y + state.p2.h / 2)) / (state.p2.h / 2);
      const maxBounce = Math.PI / 3;
      const bounce = Math.max(-1, Math.min(1, rel)) * maxBounce;
      const speedUp = Math.min(1.12, 1.03 + Math.abs(rel) * 0.05);
      state.ball.speed *= speedUp;
      state.ball.vx = -Math.cos(bounce) * state.ball.speed;
      state.ball.vy = Math.sin(bounce) * state.ball.speed;
      state.ball.x = state.p2.x - state.ball.r - 1;
    }

    // Scores
    if (state.ball.x + state.ball.r < 0) {
      state.scores.p2++; p2El.textContent = state.scores.p2; prepareServe();
    } else if (state.ball.x - state.ball.r > width) {
      state.scores.p1++; p1El.textContent = state.scores.p1; prepareServe();
    }
  }
}

function render() {
  drawBackground();
  drawPaddles();
  drawBall();
}

let raf = 0;
function loop() {
  update();
  render();
  raf = requestAnimationFrame(loop);
}

// Event listeners
const onKeyDown = (e) => {
  const code = e.code;
  if (code === 'Space') {
    e.preventDefault();
    if (state.waiting) startServe();
    return;
  }
  if (code === 'KeyW' || code === 'KeyS' || code === 'ArrowUp' || code === 'ArrowDown') {
    if ((code === 'ArrowUp' || code === 'ArrowDown') && state.mode !== '2p') return;
    e.preventDefault();
    keys[code] = true;
  }
};
const onKeyUp = (e) => { keys[e.code] = false; };
const onResize = () => layout();
const onModeClick = () => {
  state.mode = state.mode === 'cpu' ? '2p' : 'cpu';
  modeBtn.textContent = state.mode === 'cpu' ? 'Mode: CPU' : 'Mode: 2 Players';
  modeBtn.setAttribute('aria-pressed', state.mode === 'cpu' ? 'true' : 'false');
  hint.textContent = state.mode === 'cpu'
    ? 'Start: Space • P1 W/S • P2 CPU'
    : 'Start: Space • P1 W/S • P2 ArrowUp/Down';
};

window.addEventListener('keydown', onKeyDown, { passive: false });
window.addEventListener('keyup', onKeyUp);
window.addEventListener('resize', onResize);
modeBtn.addEventListener('click', onModeClick);

// Init
const api = {
  destroy() {
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('resize', onResize);
    modeBtn.removeEventListener('click', onModeClick);
    [title, hud, controls, hint, overlay].forEach(n => n.remove());
    // clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
};
// Reset scores UI
p1El.textContent = '0';
p2El.textContent = '0';
layout();
loop();

return api;
}

window.openPong = { init };
})();