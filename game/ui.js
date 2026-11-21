// ui.js — the HUD, toasts and overlays. One job: show the game state on the page.

const $ = (id) => document.getElementById(id);

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

export function updateHud(game) {
  const scene = game.scene;
  $('level-name').textContent = scene.name;
  $('level-sub').textContent = scene.subtitle;
  $('found-count').textContent = String(game.found.size);
  $('total-count').textContent = String(scene.differences.length);
  const timerEl = $('timer');
  timerEl.textContent = formatTime(game.timeLeft);
  timerEl.classList.toggle('low', game.timeLeft <= 30);
  $('hints-left').textContent = String(game.hints);
  $('score').textContent = String(game.score);
  $('hint-btn').disabled = game.hints <= 0 || game.status !== 'playing';
  const remaining = scene.differences.length - game.found.size;
  $('remain-note').textContent =
    remaining === 0
      ? 'All found — well done!'
      : `${remaining} difference${remaining === 1 ? '' : 's'} still hiding`;
}

let toastTimer = null;

export function showToast(text, kind) {
  const el = $('toast');
  el.textContent = text;
  el.className = `toast show ${kind || ''}`;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.className = 'toast';
  }, 1800);
}

export function showOverlay(html) {
  const overlay = $('overlay');
  overlay.innerHTML = html;
  overlay.classList.add('show');
}

export function hideOverlay() {
  const overlay = $('overlay');
  overlay.classList.remove('show');
  overlay.innerHTML = '';
}

export function showLevelComplete(game, timeBonus) {
  const scene = game.scene;
  const isLast = game.sceneIndex === game.sceneCount - 1;
  showOverlay(`
    <div class="card">
      <h2>${isLast ? 'You found them all!' : 'Scene complete!'}</h2>
      <p>${scene.name} — ${scene.differences.length} / ${scene.differences.length} differences found.</p>
      <p class="big">Time bonus +${timeBonus} &nbsp;·&nbsp; Score ${game.score}</p>
      <p class="muted">${isLast ? 'That was the last scene. Take a bow, detective.' : 'The next scene is trickier — fewer seconds, smaller differences.'}</p>
      <button id="overlay-next" class="btn primary">${isLast ? 'Play again' : 'Next scene →'}</button>
    </div>`);
  $('overlay-next').addEventListener('click', () => {
    hideOverlay();
    if (isLast) game.restart();
    else game.nextScene();
  });
}

export function showTimeUp(game) {
  showOverlay(`
    <div class="card">
      <h2>Time's up!</h2>
      <p>You found ${game.found.size} of ${game.scene.differences.length} differences in ${game.scene.name}.</p>
      <p class="muted">The ones still hiding are circled in the right panel for a moment — study them, then try again.</p>
      <button id="overlay-retry" class="btn primary">Try this scene again</button>
      <button id="overlay-restart" class="btn">Restart from scene 1</button>
    </div>`);
  $('overlay-retry').addEventListener('click', () => {
    hideOverlay();
    game.reloadScene();
  });
  $('overlay-restart').addEventListener('click', () => {
    hideOverlay();
    game.restart();
  });
}

export function showVictory(game) {
  showOverlay(`
    <div class="card">
      <h2>Case closed, detective!</h2>
      <p>You spotted all ${game.totalDifferences} differences across ${game.sceneCount} scenes.</p>
      <p class="big">Final score ${game.score}</p>
      <button id="overlay-again" class="btn primary">Play again</button>
    </div>`);
  $('overlay-again').addEventListener('click', () => {
    hideOverlay();
    game.restart();
  });
}
