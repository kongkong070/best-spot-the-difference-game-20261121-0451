// render.js — everything drawn on the canvas: the HUD with timer,
// score and remaining counter, the two picture panels with their
// markers, and the start / level-done / game-over screens.

import { SCENES, PANEL_W, PANEL_H } from './scenes.js';
import { currentScene, remaining } from './state.js';
import { rr, circle } from './art.js';

export const VIEW_W = 1280;
export const VIEW_H = 720;
export const PANEL = { leftX: 40, rightX: 680, y: 92, w: PANEL_W, h: PANEL_H };

// Buttons the input module hit-tests, per screen.
export function buttonsFor(game) {
  if (game.screen === 'start') {
    return [{ id: 'start', x: 540, y: 500, w: 200, h: 56, label: 'START' }];
  }
  if (game.screen === 'playing') {
    return [
      { id: 'hint', x: 972, y: 556, w: 150, h: 44, label: `HINT (H) · ${game.hintsLeft}` },
      { id: 'restart', x: 1134, y: 556, w: 106, h: 44, label: 'RESTART' },
    ];
  }
  if (game.screen === 'levelDone') {
    return [{ id: 'next', x: 540, y: 470, w: 200, h: 56, label: 'NEXT LEVEL >' }];
  }
  if (game.screen === 'gameOver') {
    return [{ id: 'retry', x: 540, y: 470, w: 200, h: 56, label: 'TRY AGAIN' }];
  }
  if (game.screen === 'allDone') {
    return [{ id: 'again', x: 540, y: 500, w: 200, h: 56, label: 'PLAY AGAIN' }];
  }
  return [];
}

export function drawGame(ctx, game, now) {
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = '#14101f';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  if (game.screen === 'start') {
    drawStart(ctx, game);
  } else {
    drawHud(ctx, game, now);
    drawPanels(ctx, game, now);
    drawBottomBar(ctx, game);
    if (game.screen === 'levelDone') drawLevelDone(ctx, game);
    if (game.screen === 'gameOver') drawGameOver(ctx, game);
    if (game.screen === 'allDone') drawAllDone(ctx, game);
  }
}

function drawHud(ctx, game, now) {
  const scene = currentScene(game);
  ctx.fillStyle = '#1e1830';
  ctx.fillRect(0, 0, VIEW_W, 60);
  ctx.fillStyle = '#f5ead0';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('Lantern Lane', 24, 40);
  ctx.font = '15px Georgia, serif';
  ctx.fillStyle = '#c9b8e8';
  ctx.fillText(`Level ${game.levelIndex + 1}/3 · ${scene.name}`, 24, 56);
  // remaining counter — big and central
  const left = remaining(game);
  ctx.textAlign = 'center';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillStyle = left === 0 ? '#7be495' : '#ffd76a';
  ctx.fillText(`Differences left: ${left}`, 640, 38);
  // timer
  const secs = Math.max(0, Math.ceil(game.timeLeft));
  const mm = Math.floor(secs / 60);
  const ss = String(secs % 60).padStart(2, '0');
  const urgent = game.timeLeft <= 30 && game.screen === 'playing';
  ctx.font = 'bold 26px monospace';
  ctx.fillStyle = urgent && Math.floor(now / 400) % 2 === 0 ? '#ff6b5e' : '#f5ead0';
  ctx.textAlign = 'right';
  ctx.fillText(`Time ${mm}:${ss}`, 1010, 38);
  // score
  ctx.fillStyle = '#f5ead0';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillText(`Score ${game.score}`, 1256, 38);
  ctx.textAlign = 'left';
}

function drawPanels(ctx, game, now) {
  const scene = currentScene(game);
  const allIds = new Set(scene.diffs.map((d) => d.id));
  drawPanel(ctx, game, scene, PANEL.leftX, new Set(), 'LEFT', now);
  drawPanel(ctx, game, scene, PANEL.rightX, allIds, 'RIGHT', now);
}

function drawPanel(ctx, game, scene, px, mods, label, now) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(px, PANEL.y, PANEL.w, PANEL.h);
  ctx.clip();
  scene.draw(ctx, px, PANEL.y, mods);
  // hint pulse on an unfound difference
  if (game.hint && game.screen === 'playing') {
    const diff = scene.diffs.find((d) => d.id === game.hint.id);
    if (diff) {
      const pulse = 1 + 0.18 * Math.sin(now / 130);
      ctx.strokeStyle = 'rgba(255,215,106,0.95)';
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 6]);
      circle(ctx, px + diff.x, PANEL.y + diff.y, diff.r * pulse);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  // markers on every found difference
  for (const diff of scene.diffs) {
    if (!game.found.has(diff.id)) continue;
    const cx = px + diff.x;
    const cy = PANEL.y + diff.y;
    ctx.strokeStyle = '#37d67a';
    ctx.lineWidth = 5;
    circle(ctx, cx, cy, diff.r * 0.85);
    ctx.stroke();
    ctx.fillStyle = 'rgba(55,214,122,0.25)';
    circle(ctx, cx, cy, diff.r * 0.85);
    ctx.fill();
    ctx.strokeStyle = '#37d67a';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy);
    ctx.lineTo(cx - 3, cy + 9);
    ctx.lineTo(cx + 13, cy - 10);
    ctx.stroke();
  }
  // red X flashes for wrong clicks on this panel
  for (const mark of game.wrongMarks) {
    if (mark.panel !== (px === PANEL.leftX ? 'left' : 'right')) continue;
    const cx = px + mark.x;
    const cy = PANEL.y + mark.y;
    const age = now - mark.at;
    const alpha = Math.max(0, 1 - age / 900);
    ctx.strokeStyle = `rgba(255,80,70,${alpha})`;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy - 12);
    ctx.lineTo(cx + 12, cy + 12);
    ctx.moveTo(cx + 12, cy - 12);
    ctx.lineTo(cx - 12, cy + 12);
    ctx.stroke();
  }
  ctx.restore();
  // frame + label
  ctx.strokeStyle = '#c9b8e8';
  ctx.lineWidth = 3;
  ctx.strokeRect(px, PANEL.y, PANEL.w, PANEL.h);
  ctx.fillStyle = '#f5ead0';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText(label, px + 4, PANEL.y - 8);
}

function drawBottomBar(ctx, game) {
  const scene = currentScene(game);
  ctx.fillStyle = '#1e1830';
  ctx.fillRect(0, 536, VIEW_W, 184);
  // level dots
  SCENES.forEach((s, i) => {
    const cx = 60 + i * 34;
    const cy = 566;
    ctx.fillStyle = i < game.levelIndex ? '#37d67a' : i === game.levelIndex ? '#ffd76a' : '#4a4266';
    circle(ctx, cx, cy, 11);
    ctx.fill();
    ctx.fillStyle = '#14101f';
    ctx.font = 'bold 12px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(i + 1), cx, cy + 4);
  });
  ctx.fillStyle = '#c9b8e8';
  ctx.font = '15px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText(scene.name, 180, 571);
  ctx.fillStyle = '#8a7fb0';
  ctx.font = '13px Georgia, serif';
  ctx.fillText(scene.subtitle, 180, 592);
  // message line
  if (game.message && performance.now() - game.messageAt < 4000) {
    ctx.fillStyle = '#ffd76a';
    ctx.font = 'bold 17px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(game.message, 640, 640);
  }
  ctx.fillStyle = '#8a7fb0';
  ctx.font = '13px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('Click a difference in either picture · H = hint (−25) · R = restart level · wrong click −5, −2s', 24, 690);
  // buttons
  for (const b of buttonsFor(game)) drawButton(ctx, b, b.id === 'hint' && game.hintsLeft === 0);
}

function drawButton(ctx, b, disabled) {
  ctx.fillStyle = disabled ? '#3a3350' : '#e05244';
  rr(ctx, b.x, b.y, b.w, b.h, 10);
  ctx.fill();
  ctx.strokeStyle = '#ffd76a';
  ctx.lineWidth = 2;
  rr(ctx, b.x, b.y, b.w, b.h, 10);
  ctx.stroke();
  ctx.fillStyle = disabled ? '#8a7fb0' : '#fff6e0';
  ctx.font = 'bold 16px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2 + 6);
}

function overlay(ctx) {
  ctx.fillStyle = 'rgba(10,8,20,0.72)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
}

function overlayCard(ctx, y, h) {
  ctx.fillStyle = '#241d3d';
  rr(ctx, 340, y, 600, h, 18);
  ctx.fill();
  ctx.strokeStyle = '#ffd76a';
  ctx.lineWidth = 2;
  rr(ctx, 340, y, 600, h, 18);
  ctx.stroke();
}

function drawStart(ctx) {
  // a dimmed preview of the first scene behind the title
  const scene = SCENES[0];
  ctx.save();
  ctx.globalAlpha = 0.45;
  scene.draw(ctx, 40, 92, new Set());
  scene.draw(ctx, 680, 92, new Set(scene.diffs.map((d) => d.id)));
  ctx.restore();
  overlay(ctx);
  ctx.fillStyle = '#ffd76a';
  ctx.font = 'bold 64px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Lantern Lane', 640, 150);
  ctx.fillStyle = '#f5ead0';
  ctx.font = '28px Georgia, serif';
  ctx.fillText('A spot-the-difference hunt in three hand-drawn scenes', 640, 196);
  ctx.font = '18px Georgia, serif';
  ctx.fillStyle = '#c9b8e8';
  ctx.fillText('Two pictures sit side by side. They look the same — but they are not.', 640, 250);
  ctx.fillText('Click every difference you can spot, in either picture, before the timer runs out.', 640, 278);
  ctx.fillText('A wrong click costs 5 points and 2 seconds. Hints cost 25 points — use them wisely.', 640, 306);
  ctx.fillStyle = '#f5ead0';
  ctx.font = 'bold 18px Georgia, serif';
  ctx.fillText('1 · Lantern Lane — 8 differences · 3:00', 640, 360);
  ctx.fillText('2 · Harbor Dawn — 8 differences · 3:00', 640, 388);
  ctx.fillText('3 · Mushroom Hollow — 9 differences · 3:30', 640, 416);
  ctx.fillStyle = '#8a7fb0';
  ctx.font = '15px Georgia, serif';
  ctx.fillText('Mouse to click · H for a hint · R to restart · Enter to start', 640, 462);
  for (const b of buttonsFor({ screen: 'start' })) drawButton(ctx, b, false);
}

function drawLevelDone(ctx, game) {
  overlay(ctx);
  overlayCard(ctx, 180, 260);
  const scene = currentScene(game);
  ctx.fillStyle = '#7be495';
  ctx.font = 'bold 38px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Level complete!', 640, 250);
  ctx.fillStyle = '#f5ead0';
  ctx.font = '20px Georgia, serif';
  ctx.fillText(`You found all ${scene.diffs.length} differences in ${scene.name}.`, 640, 296);
  ctx.fillText(`Level score ${game.levelScore} · Total score ${game.score}`, 640, 330);
  ctx.fillText(`Best streak ${game.bestStreak} · Time left ${Math.round(game.timeLeft)}s`, 640, 360);
  ctx.fillStyle = '#c9b8e8';
  ctx.font = '16px Georgia, serif';
  ctx.fillText('The next scene hides its differences a little better…', 640, 398);
  for (const b of buttonsFor(game)) drawButton(ctx, b, false);
}

function drawGameOver(ctx, game) {
  overlay(ctx);
  overlayCard(ctx, 180, 260);
  const scene = currentScene(game);
  ctx.fillStyle = '#ff6b5e';
  ctx.font = 'bold 38px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Time’s up!', 640, 250);
  ctx.fillStyle = '#f5ead0';
  ctx.font = '20px Georgia, serif';
  ctx.fillText(`You found ${game.found.size} of ${scene.diffs.length} differences in ${scene.name}.`, 640, 296);
  ctx.fillText(`Score ${game.score} · Best streak ${game.bestStreak}`, 640, 330);
  ctx.fillStyle = '#c9b8e8';
  ctx.font = '16px Georgia, serif';
  ctx.fillText('Take another look — the differences are still there, waiting.', 640, 398);
  for (const b of buttonsFor(game)) drawButton(ctx, b, false);
}

function drawAllDone(ctx, game) {
  overlay(ctx);
  overlayCard(ctx, 150, 320);
  ctx.fillStyle = '#ffd76a';
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('You found them all!', 640, 220);
  ctx.fillStyle = '#f5ead0';
  ctx.font = '20px Georgia, serif';
  ctx.fillText('Lantern Lane, Harbor Dawn and Mushroom Hollow — every difference found.', 640, 268);
  ctx.fillText(`Final score ${game.score} · ${game.totalFound} differences · Best streak ${game.bestStreak}`, 640, 304);
  ctx.fillStyle = '#c9b8e8';
  ctx.font = '16px Georgia, serif';
  const rank = game.score >= 2800 ? 'Eagle-Eyed Detective' : game.score >= 2400 ? 'Sharp-Eyed Sleuth' : 'Keen Observer';
  ctx.fillText(`Rank: ${rank}`, 640, 344);
  ctx.fillText('Play again to beat your score — the hunt never gets old.', 640, 380);
  for (const b of buttonsFor(game)) drawButton(ctx, b, false);
}
