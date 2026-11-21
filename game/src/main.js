// main.js — bootstrap for Lantern Lane. Creates the game, wires input,
// runs the animation loop, and keeps the screen-reader status line in
// step with what the player can see.

import { createGame, tick, remaining } from './state.js';
import { drawGame, VIEW_W, VIEW_H } from './render.js';
import { attachInput } from './input.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
const statusEl = document.getElementById('status');
canvas.width = VIEW_W;
canvas.height = VIEW_H;

const game = createGame();
attachInput(canvas, game);
const isShot = applyShot(game);

// Exposed for playtesting and screenshots: window.__game lets a
// headless browser drive the game and read its state.
window.__game = game;

let last = performance.now();
let lastStatus = '';

function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  tick(game, dt);
  const ctx = canvas.getContext('2d');
  drawGame(ctx, game, now);
  const status =
    game.screen === 'playing'
      ? `${remaining(game)} differences left. Score ${game.score}. ${Math.ceil(game.timeLeft)} seconds left.`
      : game.screen === 'start'
        ? 'Lantern Lane. Press Enter or click Start to play.'
        : game.screen === 'levelDone'
          ? 'Level complete.'
          : game.screen === 'allDone'
            ? `You found them all! Final score ${game.score}.`
            : 'Time is up.';
  if (status !== lastStatus) {
    statusEl.textContent = status;
    lastStatus = status;
  }
  requestAnimationFrame(frame);
}

if (!isShot) requestAnimationFrame(frame);
else {
  // A screenshot state is static: draw one frame so the picture is
  // complete before the capture, then keep the loop running so the
  // timer and hint pulse still animate.
  requestAnimationFrame(frame);
}
