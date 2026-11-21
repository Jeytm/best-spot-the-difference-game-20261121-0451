// main.js — boots "Find the Difference": wires the canvases, buttons and keys,
// starts the first scene, and exposes the live game for play-testing.

import { SpotGame } from './game.js';
import { PANEL_W, PANEL_H } from './scenes.js';

const left = document.getElementById('panel-left');
const right = document.getElementById('panel-right');
left.width = PANEL_W;
left.height = PANEL_H;
right.width = PANEL_W;
right.height = PANEL_H;

const game = new SpotGame(left, right);
game.start();

// Clicks on either panel count: a difference can be tapped in picture A or B.
left.addEventListener('click', (event) => game.handleClick(left, event));
right.addEventListener('click', (event) => game.handleClick(right, event));

document.getElementById('hint-btn').addEventListener('click', () => game.useHint());
document.getElementById('restart-btn').addEventListener('click', () => game.restart());

document.addEventListener('keydown', (event) => {
  if (event.key === 'h' || event.key === 'H') game.useHint();
  if (event.key === 'r' || event.key === 'R') game.restart();
});

// Exposed so a play-test can read the live state (scene, found set, difference
// positions) and click through a real game without touching the code.
window.__game = game;
