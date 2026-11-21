// state.js — the game's state: screens, levels, timer, score, hints.
// One level is one scene; finishing all three scenes wins the game.

import { SCENES } from './scenes.js';

export function createGame() {
  return {
    screen: 'start', // start | playing | levelDone | gameOver | allDone
    levelIndex: 0,
    found: new Set(), // difference ids found in the current level
    wrongMarks: [], // {x, y, panel, at} red X flashes for wrong clicks
    score: 0,
    streak: 0,
    bestStreak: 0,
    timeLeft: SCENES[0].timeLimit,
    hintsLeft: 3,
    hint: null, // {id, until} the difference a hint is pointing at
    message: '',
    messageAt: 0,
    levelScore: 0,
    totalFound: 0,
    startedAt: 0,
  };
}

export function currentScene(game) {
  return SCENES[game.levelIndex];
}

export function remaining(game) {
  return currentScene(game).diffs.length - game.found.size;
}

export function startLevel(game, index) {
  game.levelIndex = index;
  game.found = new Set();
  game.wrongMarks = [];
  game.timeLeft = currentScene(game).timeLimit;
  game.hintsLeft = 3;
  game.hint = null;
  game.streak = 0;
  game.levelScore = 0;
  game.screen = 'playing';
  game.startedAt = performance.now();
  setMessage(game, `Level ${index + 1}: ${currentScene(game).name} — find ${currentScene(game).diffs.length} differences!`);
}

export function startGame(game) {
  game.score = 0;
  game.totalFound = 0;
  game.bestStreak = 0;
  startLevel(game, 0);
}

export function setMessage(game, text) {
  game.message = text;
  game.messageAt = performance.now();
}

// A click at panel-local (x, y) on either panel. Returns 'found' | 'wrong' | 'none'.
export function clickAt(game, x, y) {
  if (game.screen !== 'playing') return 'none';
  const scene = currentScene(game);
  for (const diff of scene.diffs) {
    if (game.found.has(diff.id)) continue;
    const dx = x - diff.x;
    const dy = y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) {
      game.found.add(diff.id);
      game.totalFound++;
      game.streak++;
      game.bestStreak = Math.max(game.bestStreak, game.streak);
      const gained = 100 + Math.min(game.streak - 1, 5) * 10;
      game.score += gained;
      game.levelScore += gained;
      setMessage(game, `Found ${diff.label}! +${gained}`);
      if (game.found.size === scene.diffs.length) {
        const bonus = Math.round(game.timeLeft) * 5;
        game.score += bonus;
        game.levelScore += bonus;
        game.screen = game.levelIndex + 1 >= SCENES.length ? 'allDone' : 'levelDone';
        setMessage(game, `All differences found! Time bonus +${bonus}`);
      }
      return 'found';
    }
  }
  return 'wrong';
}

export function markWrong(game, x, y, panel) {
  game.wrongMarks.push({ x, y, panel, at: performance.now() });
  game.streak = 0;
  game.score = Math.max(0, game.score - 5);
  game.timeLeft = Math.max(0, game.timeLeft - 2);
  setMessage(game, 'Not a difference — −5 points, −2s');
}

export function useHint(game) {
  if (game.screen !== 'playing') return false;
  if (game.hintsLeft <= 0) {
    setMessage(game, 'No hints left!');
    return false;
  }
  const scene = currentScene(game);
  const unfound = scene.diffs.filter((d) => !game.found.has(d.id));
  if (unfound.length === 0) return false;
  const pick = unfound[Math.floor(Math.random() * unfound.length)];
  game.hintsLeft--;
  game.score = Math.max(0, game.score - 25);
  game.hint = { id: pick.id, until: performance.now() + 2500 };
  setMessage(game, `Hint: look near ${pick.label} (−25 points)`);
  return true;
}

export function tick(game, dtSeconds) {
  if (game.screen !== 'playing') return;
  game.timeLeft -= dtSeconds;
  if (game.hint && performance.now() > game.hint.until) game.hint = null;
  game.wrongMarks = game.wrongMarks.filter((m) => performance.now() - m.at < 900);
  if (game.timeLeft <= 0) {
    game.timeLeft = 0;
    game.screen = 'gameOver';
    setMessage(game, 'Time’s up!');
  }
}
