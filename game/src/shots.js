// shots.js — deterministic states for screenshots, driven by the
// page's query string (the same pattern the kit's starter uses):
//   ?shot=start            title screen over a preview of scene 1
//   ?shot=play&scene=0     scene 1 in play with some differences found
//   ?shot=play&scene=1     scene 2 in play with some differences found
//   ?shot=done&scene=0     the level-complete screen for scene 1
// The screenshots are real renders of the game's own code: this only
// puts the game into a state a player could reach by playing.

import { startLevel, startGame } from './state.js';
import { currentScene } from './state.js';

export function applyShot(game) {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (!shot) return false;
  const sceneIndex = Math.min(Math.max(Number(params.get('scene') ?? 0) || 0, 0), 2);
  if (shot === 'start') {
    game.screen = 'start';
  } else if (shot === 'play') {
    startGame(game);
    if (sceneIndex > 0) startLevel(game, sceneIndex);
    const foundCount = Math.min(Number(params.get('found') ?? 3) || 0, currentScene(game).diffs.length - 1);
    const scene = currentScene(game);
    for (let i = 0; i < foundCount; i++) game.found.add(scene.diffs[i].id);
    game.score = game.found.size * 100;
    game.levelScore = game.score;
    game.timeLeft = 142;
    game.message = '';
  } else if (shot === 'done') {
    startGame(game);
    if (sceneIndex > 0) startLevel(game, sceneIndex);
    const scene = currentScene(game);
    for (const diff of scene.diffs) game.found.add(diff.id);
    game.score = scene.diffs.length * 100 + 500;
    game.levelScore = game.score;
    game.streak = scene.diffs.length;
    game.bestStreak = scene.diffs.length;
    game.timeLeft = 100;
    game.message = '';
    game.screen = sceneIndex + 1 >= 3 ? 'allDone' : 'levelDone';
  }
  return true;
}
