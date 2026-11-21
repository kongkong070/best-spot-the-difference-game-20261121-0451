// art.js — small canvas drawing helpers shared by every scene.
// All artwork in this game is drawn here and in scenes.js with plain
// canvas paths: no image files, no borrowed art.

export function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

export function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}

export function star(ctx, x, y, r, points = 5) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (i * Math.PI) / points - Math.PI / 2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

export function skyGradient(ctx, x, y, w, h, top, bottom) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

export function sparkle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  star(ctx, x, y, r, 4);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  circle(ctx, x, y, r * 0.25);
  ctx.fill();
}

// A paper lantern hanging from a string: body, ribs, tassel.
export function lantern(ctx, x, y, r, body, glow) {
  ctx.strokeStyle = 'rgba(40,20,10,0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - r - 14);
  ctx.lineTo(x, y - r);
  ctx.stroke();
  if (glow) {
    const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 2.1);
    g.addColorStop(0, 'rgba(255,190,90,0.55)');
    g.addColorStop(1, 'rgba(255,190,90,0)');
    ctx.fillStyle = g;
    circle(ctx, x, y, r * 2.1);
    ctx.fill();
  }
  ctx.fillStyle = body;
  ellipse(ctx, x, y, r, r * 0.82);
  ctx.fill();
  ctx.strokeStyle = 'rgba(120,30,20,0.55)';
  ctx.lineWidth = 1.5;
  for (const dy of [-r * 0.45, 0, r * 0.45]) {
    ctx.beginPath();
    ctx.ellipse(x, y + dy, r * 0.92, r * 0.16, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#c98a2e';
  ctx.fillRect(x - 5, y - r * 0.82 - 4, 10, 5);
  ctx.fillRect(x - 5, y + r * 0.82 - 1, 10, 5);
  ctx.strokeStyle = '#c98a2e';
  ctx.beginPath();
  ctx.moveTo(x, y + r * 0.82 + 4);
  ctx.lineTo(x, y + r + 12);
  ctx.stroke();
}

// A small sitting cat, drawn facing left.
export function cat(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  // body
  ellipse(ctx, x, y, 13 * s, 16 * s);
  ctx.fill();
  // head
  circle(ctx, x - 6 * s, y - 18 * s, 9 * s);
  ctx.fill();
  // ears
  ctx.beginPath();
  ctx.moveTo(x - 13 * s, y - 24 * s);
  ctx.lineTo(x - 11 * s, y - 32 * s);
  ctx.lineTo(x - 6 * s, y - 25 * s);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 3 * s, y - 25 * s);
  ctx.lineTo(x - 1 * s, y - 33 * s);
  ctx.lineTo(x + 3 * s, y - 24 * s);
  ctx.closePath();
  ctx.fill();
  // tail curled around the base
  ctx.lineWidth = 4 * s;
  ctx.beginPath();
  ctx.arc(x + 8 * s, y + 8 * s, 10 * s, -0.4, 1.9);
  ctx.stroke();
  // eyes
  ctx.fillStyle = '#ffd76a';
  circle(ctx, x - 9 * s, y - 19 * s, 1.8 * s);
  ctx.fill();
  circle(ctx, x - 3 * s, y - 19 * s, 1.8 * s);
  ctx.fill();
}

// A simple gull: two curved wings.
export function gull(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 10 * s, y);
  ctx.quadraticCurveTo(x - 5 * s, y - 6 * s, x, y);
  ctx.quadraticCurveTo(x + 5 * s, y - 6 * s, x + 10 * s, y);
  ctx.stroke();
}

// A five-petal flower on a stem.
export function flower(ctx, x, y, s, petal, center) {
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(x, y + 4 * s);
  ctx.lineTo(x, y + 16 * s);
  ctx.stroke();
  ctx.fillStyle = petal;
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 5 * s, y + Math.sin(a) * 5 * s, 4.5 * s);
    ctx.fill();
  }
  ctx.fillStyle = center;
  circle(ctx, x, y, 3.5 * s);
  ctx.fill();
}

// A firefly: glowing dot with a soft halo.
export function firefly(ctx, x, y, r) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.4);
  g.addColorStop(0, 'rgba(220,255,120,0.9)');
  g.addColorStop(1, 'rgba(220,255,120,0)');
  ctx.fillStyle = g;
  circle(ctx, x, y, r * 3.4);
  ctx.fill();
  ctx.fillStyle = '#e8ff9a';
  circle(ctx, x, y, r);
  ctx.fill();
}
