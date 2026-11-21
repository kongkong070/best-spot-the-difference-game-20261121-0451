// input.js — mouse and keyboard play. A click first hits a button,
// then a picture panel; a click on a difference marks it in both
// panels, a click elsewhere is a miss.

import { PANEL, buttonsFor } from './render.js';
import { clickAt, markWrong, useHint, startLevel, startGame } from './state.js';
import { ensureAudio, playFound, playWrong, playHint, playWin } from './audio.js';

function panelLocal(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * canvas.width;
  const y = ((clientY - rect.top) / rect.height) * canvas.height;
  if (y < PANEL.y || y > PANEL.y + PANEL.h) return null;
  const localY = y - PANEL.y;
  if (x >= PANEL.leftX && x <= PANEL.leftX + PANEL.w) return { x: x - PANEL.leftX, y: localY, panel: 'left' };
  if (x >= PANEL.rightX && x <= PANEL.rightX + PANEL.w) return { x: x - PANEL.rightX, y: localY, panel: 'right' };
  return null;
}

function hitButton(game, x, y) {
  for (const b of buttonsFor(game)) {
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b.id;
  }
  return null;
}

function doButton(game, id) {
  ensureAudio();
  if (id === 'start' || id === 'again') startGame(game);
  else if (id === 'next') startLevel(game, game.levelIndex + 1);
  else if (id === 'retry') startLevel(game, game.levelIndex);
  else if (id === 'restart') startLevel(game, game.levelIndex);
  else if (id === 'hint' && useHint(game)) playHint();
}

export function attachInput(canvas, game) {
  canvas.addEventListener('pointerdown', (event) => {
    ensureAudio();
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    const button = hitButton(game, x, y);
    if (button) {
      doButton(game, button);
      return;
    }
    if (game.screen !== 'playing') return;
    const hit = panelLocal(canvas, event.clientX, event.clientY);
    if (!hit) return;
    const result = clickAt(game, hit.x, hit.y);
    if (result === 'found') {
      playFound();
      if (game.screen === 'levelDone' || game.screen === 'allDone') playWin();
    } else if (result === 'wrong') {
      markWrong(game, hit.x, hit.y, hit.panel);
      playWrong();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'h' && game.screen === 'playing') {
      ensureAudio();
      if (useHint(game)) playHint();
    } else if (key === 'r' && (game.screen === 'playing' || game.screen === 'gameOver')) {
      ensureAudio();
      startLevel(game, game.levelIndex);
    } else if (key === 'enter' || key === ' ') {
      ensureAudio();
      if (game.screen === 'start' || game.screen === 'allDone') startGame(game);
      else if (game.screen === 'levelDone') startLevel(game, game.levelIndex + 1);
      else if (game.screen === 'gameOver') startLevel(game, game.levelIndex);
    }
  });
}
