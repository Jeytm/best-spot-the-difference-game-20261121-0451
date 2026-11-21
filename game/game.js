// game.js — the game itself: state, input, timer, scoring and level flow.
// Draws both panels every frame from scenes.js, then the found markers,
// the hint pulse and any wrong-tap ripple on top.

import { SCENES, PANEL_W, PANEL_H } from './scenes.js';
import { playFind, playMiss, playHint, playWin, playTick } from './audio.js';
import { updateHud, showToast, showLevelComplete, showTimeUp, showVictory } from './ui.js';

const WRONG_COST = 5; // seconds lost on a wrong tap
const HINTS_PER_SCENE = 3;
const FIND_POINTS = 100;

export class SpotGame {
  constructor(leftCanvas, rightCanvas) {
    this.left = leftCanvas;
    this.right = rightCanvas;
    this.lctx = leftCanvas.getContext('2d');
    this.rctx = rightCanvas.getContext('2d');
    this.sceneCount = SCENES.length;
    this.totalDifferences = SCENES.reduce((n, s) => n + s.differences.length, 0);
    this.sceneIndex = 0;
    this.found = new Set();
    this.hints = HINTS_PER_SCENE;
    this.score = 0;
    this.timeLeft = 0;
    this.status = 'idle'; // idle | playing | done
    this.hintPulse = null; // {x, y, until}
    this.ripple = null; // {x, y, panel, until}
    this.lastTickSecond = -1;
    this._lastFrame = 0;
    this._boundLoop = (t) => this._loop(t);
  }

  get scene() {
    return SCENES[this.sceneIndex];
  }

  start() {
    this.sceneIndex = 0;
    this.score = 0;
    this._loadScene();
    this.status = 'playing';
    requestAnimationFrame(this._boundLoop);
  }

  restart() {
    this.start();
  }

  _loadScene() {
    this.found = new Set();
    this.hints = HINTS_PER_SCENE;
    this.timeLeft = this.scene.timeLimit;
    this.hintPulse = null;
    this.ripple = null;
    this.lastTickSecond = -1;
    updateHud(this);
  }

  reloadScene() {
    this._loadScene();
    this.status = 'playing';
  }

  nextScene() {
    this.sceneIndex += 1;
    this._loadScene();
    this.status = 'playing';
  }

  // Convert a click on a panel canvas into panel coordinates (600 x 420 space).
  _panelPoint(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * PANEL_W,
      y: ((event.clientY - rect.top) / rect.height) * PANEL_H,
    };
  }

  handleClick(canvas, event) {
    if (this.status !== 'playing') return;
    const point = this._panelPoint(canvas, event);
    const panel = canvas === this.left ? 'left' : 'right';
    const hit = this.scene.differences.find(
      (d) => !this.found.has(d.id) && Math.hypot(point.x - d.x, point.y - d.y) <= d.r + 8,
    );
    if (hit) {
      this.found.add(hit.id);
      this.score += FIND_POINTS;
      playFind();
      showToast(`Found: ${hit.label}! +${FIND_POINTS}`, 'good');
      if (this.found.size === this.scene.differences.length) {
        this._clearScene();
      }
      updateHud(this);
      return;
    }
    // Wrong tap: lose a few seconds and show where the tap landed.
    this.timeLeft = Math.max(0, this.timeLeft - WRONG_COST);
    this.ripple = { x: point.x, y: point.y, panel, until: performance.now() + 500 };
    playMiss();
    showToast(`Not there — ${WRONG_COST}s lost`, 'bad');
    updateHud(this);
  }

  _clearScene() {
    this.status = 'done';
    const timeBonus = Math.round(this.timeLeft) * 5;
    this.score += timeBonus;
    playWin();
    updateHud(this);
    const isLast = this.sceneIndex === this.sceneCount - 1;
    setTimeout(() => {
      if (isLast) showVictory(this);
      else showLevelComplete(this, timeBonus);
    }, 450);
  }

  useHint() {
    if (this.status !== 'playing' || this.hints <= 0) return;
    const remaining = this.scene.differences.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hints -= 1;
    this.hintPulse = { x: pick.x, y: pick.y, until: performance.now() + 2200 };
    playHint();
    showToast('Hint: look inside the pulsing ring', 'hint');
    updateHud(this);
  }

  _loop(now) {
    const dt = this._lastFrame ? (now - this._lastFrame) / 1000 : 0;
    this._lastFrame = now;
    if (this.status === 'playing') {
      this.timeLeft -= dt;
      const whole = Math.ceil(this.timeLeft);
      if (whole !== this.lastTickSecond) {
        this.lastTickSecond = whole;
        if (whole <= 10 && whole > 0) playTick();
        updateHud(this);
      }
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.status = 'done';
        updateHud(this);
        showTimeUp(this);
      }
    }
    this._draw();
    requestAnimationFrame(this._boundLoop);
  }

  _draw() {
    const mods = new Set(this.scene.differences.map((d) => d.id));
    this.scene.draw(this.lctx, new Set());
    this.scene.draw(this.rctx, mods);
    // Found markers: a ring on both panels at each found difference.
    const pulse = 1 + 0.08 * Math.sin(performance.now() / 180);
    this.found.forEach((id) => {
      const d = this.scene.differences.find((x) => x.id === id);
      if (!d) return;
      [this.lctx, this.rctx].forEach((ctx) => {
        ctx.save();
        ctx.strokeStyle = '#e8452c';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * pulse + 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
    });
    // Hint pulse: a soft amber ring that fades in and out.
    if (this.hintPulse && performance.now() < this.hintPulse.until) {
      const left = this.hintPulse.until - performance.now();
      const alpha = Math.min(1, left / 600) * (0.55 + 0.45 * Math.sin(performance.now() / 120));
      [this.lctx, this.rctx].forEach((ctx) => {
        ctx.save();
        ctx.strokeStyle = `rgba(242, 177, 52, ${alpha.toFixed(2)})`;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(this.hintPulse.x, this.hintPulse.y, 26 + 6 * Math.sin(performance.now() / 150), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
    } else {
      this.hintPulse = null;
    }
    // Wrong-tap ripple on the panel that was clicked.
    if (this.ripple && performance.now() < this.ripple.until) {
      const ctx = this.ripple.panel === 'left' ? this.lctx : this.rctx;
      const age = 1 - (this.ripple.until - performance.now()) / 500;
      ctx.save();
      ctx.strokeStyle = `rgba(200, 60, 40, ${(1 - age).toFixed(2)})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.ripple.x, this.ripple.y, 8 + age * 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else {
      this.ripple = null;
    }
  }
}
