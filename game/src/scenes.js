// scenes.js — the three original scenes of "Lantern Lane".
// Every scene is drawn with canvas paths (see art.js). A scene's draw()
// takes a Set of difference ids: the left panel is drawn with an empty
// set, the right panel with every id, so each difference changes exactly
// one small thing. Each difference also carries its click target.

import { rr, circle, ellipse, star, skyGradient, sparkle, lantern, cat, gull, flower, firefly } from './art.js';

export const PANEL_W = 560;
export const PANEL_H = 430;

// ---------------------------------------------------------------- scene 1
function drawLanternLane(ctx, ox, oy, mods) {
  const X = (x) => ox + x;
  const Y = (y) => oy + y;
  // night sky
  skyGradient(ctx, ox, oy, PANEL_W, 260, '#141d3d', '#4a2d5e');
  // stars
  const stars = [[40, 40], [110, 24], [180, 52], [250, 30], [330, 44], [380, 22], [505, 30], [60, 110], [150, 96], [540, 90], [470, 130], [210, 130]];
  for (const [sx, sy] of stars) sparkle(ctx, X(sx), Y(sy), 3, '#fff6c9');
  if (mods.has('star')) sparkle(ctx, X(420), Y(44), 5, '#fff6c9');
  // moon: full in the left picture, a crescent in the right one
  ctx.fillStyle = '#ffeeb0';
  circle(ctx, X(470), Y(62), 26);
  ctx.fill();
  ctx.fillStyle = '#e8d28a';
  circle(ctx, X(462), Y(56), 5);
  ctx.fill();
  circle(ctx, X(478), Y(70), 3.5);
  ctx.fill();
  if (mods.has('moon')) {
    ctx.fillStyle = '#28305a';
    circle(ctx, X(484), Y(54), 23);
    ctx.fill();
  }
  // soft clouds
  ctx.fillStyle = 'rgba(190,170,220,0.35)';
  ellipse(ctx, X(120), Y(70), 46, 12);
  ctx.fill();
  ellipse(ctx, X(150), Y(76), 34, 10);
  ctx.fill();
  ellipse(ctx, X(360), Y(150), 52, 12);
  ctx.fill();
  // distant rooftops
  ctx.fillStyle = '#241a38';
  ctx.beginPath();
  ctx.moveTo(X(0), Y(260));
  ctx.lineTo(X(0), Y(228));
  ctx.lineTo(X(70), Y(228));
  ctx.lineTo(X(110), Y(206));
  ctx.lineTo(X(150), Y(228));
  ctx.lineTo(X(250), Y(228));
  ctx.lineTo(X(250), Y(260));
  ctx.closePath();
  ctx.fill();
  // lantern string across the lane
  ctx.strokeStyle = '#1c1426';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(X(0), Y(96));
  ctx.quadraticCurveTo(X(280), Y(118), X(560), Y(96));
  ctx.stroke();
  const lanternYs = [101, 106, 108, 106, 101];
  const lanternXs = [70, 170, 280, 390, 500];
  lanternXs.forEach((lx, i) => {
    const ly = lanternYs[i];
    const body = i === 2 && mods.has('lantern') ? '#3fae7a' : '#e05244';
    lantern(ctx, X(lx), Y(ly + 16), 15, body, true);
  });
  // house A (left)
  ctx.fillStyle = '#7a5a3c';
  ctx.fillRect(X(24), Y(196), 146, 124);
  ctx.fillStyle = '#5d3a2e';
  ctx.beginPath();
  ctx.moveTo(X(14), Y(198));
  ctx.lineTo(X(97), Y(158));
  ctx.lineTo(X(180), Y(198));
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd76a';
  ctx.fillRect(X(52), Y(224), 26, 30);
  ctx.fillRect(X(116), Y(224), 26, 30);
  ctx.fillStyle = '#4a2c1c';
  ctx.fillRect(X(84), Y(268), 26, 52);
  // house B (middle) with chimney
  ctx.fillStyle = '#8a6a4a';
  ctx.fillRect(X(190), Y(176), 160, 144);
  ctx.fillStyle = '#4a2c2c';
  ctx.beginPath();
  ctx.moveTo(X(182), Y(178));
  ctx.lineTo(X(270), Y(140));
  ctx.lineTo(X(358), Y(178));
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6e4a3a';
  ctx.fillRect(X(316), Y(118), 22, 46);
  if (!mods.has('smoke')) {
    ctx.fillStyle = 'rgba(220,215,230,0.55)';
    circle(ctx, X(330), Y(104), 8);
    ctx.fill();
    circle(ctx, X(338), Y(88), 11);
    ctx.fill();
    circle(ctx, X(330), Y(70), 13);
    ctx.fill();
  }
  ctx.fillStyle = '#ffd76a';
  ctx.fillRect(X(216), Y(206), 26, 30);
  ctx.fillRect(X(290), Y(206), 26, 30);
  // shop (right) with striped awning and a lit window
  ctx.fillStyle = '#5a4a6e';
  ctx.fillRect(X(368), Y(208), 168, 112);
  ctx.fillStyle = '#3c2c4a';
  ctx.beginPath();
  ctx.moveTo(X(360), Y(210));
  ctx.lineTo(X(452), Y(172));
  ctx.lineTo(X(544), Y(210));
  ctx.closePath();
  ctx.fill();
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#e05244' : '#f5ead0';
    ctx.fillRect(X(372 + i * 28), Y(236), 28, 16);
  }
  ctx.fillStyle = mods.has('window') ? '#2c2438' : '#ffd76a';
  ctx.fillRect(X(396), Y(258), 52, 44);
  ctx.fillStyle = mods.has('window') ? '#3a3048' : '#c9a13a';
  ctx.fillRect(X(466), Y(258), 44, 44);
  ctx.fillStyle = '#f5ead0';
  rr(ctx, X(416), Y(214), 72, 20, 4);
  ctx.fill();
  ctx.fillStyle = '#3c2c4a';
  ctx.font = 'bold 13px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(mods.has('sign') ? 'CAKE' : 'T E A', X(452), Y(229));
  // low wall with the cat
  ctx.fillStyle = '#6e5a44';
  ctx.fillRect(X(0), Y(318), PANEL_W, 16);
  ctx.fillStyle = '#8a7558';
  ctx.fillRect(X(0), Y(318), PANEL_W, 5);
  if (!mods.has('cat')) cat(ctx, X(140), Y(306), 1, '#d98a4a');
  // cobbled street
  ctx.fillStyle = '#5d4c3e';
  ctx.fillRect(X(0), Y(334), PANEL_W, 96);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 9; col++) {
      ellipse(ctx, X(34 + col * 62 + (row % 2) * 30), Y(352 + row * 26), 22, 7);
      ctx.fill();
    }
  }
  // puddle reflecting the moon
  ctx.fillStyle = 'rgba(150,180,230,0.5)';
  ellipse(ctx, X(90), Y(398), 52, 12);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,238,176,0.6)';
  ellipse(ctx, X(90), Y(398), 26, 5);
  ctx.fill();
  // bicycle with a basket
  drawBicycle(ctx, X(430), Y(372), mods.has('basket'));
}

function drawBicycle(ctx, x, y, withFlowers) {
  ctx.strokeStyle = '#22222e';
  ctx.lineWidth = 3;
  circle(ctx, x, y, 16);
  ctx.stroke();
  circle(ctx, x + 52, y, 16);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 20, y - 22);
  ctx.lineTo(x + 40, y - 22);
  ctx.lineTo(x + 52, y);
  ctx.moveTo(x + 20, y - 22);
  ctx.lineTo(x + 12, y);
  ctx.moveTo(x + 40, y - 22);
  ctx.lineTo(x + 48, y);
  ctx.moveTo(x + 40, y - 22);
  ctx.lineTo(x + 44, y - 34);
  ctx.moveTo(x + 20, y - 22);
  ctx.lineTo(x + 10, y - 30);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 4, y - 30);
  ctx.lineTo(x + 16, y - 30);
  ctx.stroke();
  // basket on the front
  ctx.strokeStyle = '#8a6a3a';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 48, y - 34, 18, 13);
  if (withFlowers) {
    flower(ctx, x + 54, y - 38, 0.8, '#ff7fa5', '#ffd76a');
    flower(ctx, x + 62, y - 40, 0.7, '#b48cff', '#ffd76a');
  }
}

// ---------------------------------------------------------------- scene 2
function drawHarborDawn(ctx, ox, oy, mods) {
  const X = (x) => ox + x;
  const Y = (y) => oy + y;
  skyGradient(ctx, ox, oy, PANEL_W, 250, '#ffd9a0', '#8fb8d8');
  // sun
  ctx.fillStyle = '#ffdf6b';
  circle(ctx, X(95), Y(74), 30);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,223,107,0.8)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(X(95 + Math.cos(a) * 38), Y(74 + Math.sin(a) * 38));
    ctx.lineTo(X(95 + Math.cos(a) * 48), Y(74 + Math.sin(a) * 48));
    ctx.stroke();
  }
  if (mods.has('cloudsun')) {
    ctx.fillStyle = 'rgba(255,244,220,0.95)';
    ellipse(ctx, X(105), Y(66), 42, 14);
    ctx.fill();
    ellipse(ctx, X(88), Y(72), 30, 11);
    ctx.fill();
  }
  // clouds
  ctx.fillStyle = 'rgba(255,250,240,0.85)';
  ellipse(ctx, X(280), Y(60), 52, 13);
  ctx.fill();
  ellipse(ctx, X(310), Y(68), 36, 10);
  ctx.fill();
  ellipse(ctx, X(440), Y(120), 44, 11);
  ctx.fill();
  // gulls
  gull(ctx, X(210), Y(56), 1, '#33414f');
  gull(ctx, X(260), Y(92), 0.85, '#33414f');
  if (!mods.has('gull')) gull(ctx, X(330), Y(70), 1, '#33414f');
  // sea
  skyGradient(ctx, ox, oy + 250, PANEL_W, 180, '#2e6f8e', '#1d4a63');
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  for (const [wx, wy, wl] of [[60, 280, 70], [200, 310, 90], [340, 290, 70], [90, 360, 80], [260, 380, 90], [420, 350, 70], [180, 410, 80], [380, 410, 80]]) {
    ctx.beginPath();
    ctx.moveTo(X(wx), Y(wy));
    ctx.quadraticCurveTo(X(wx + wl / 2), Y(wy - 6), X(wx + wl), Y(wy));
    ctx.stroke();
  }
  // lighthouse
  ctx.fillStyle = '#f5ead0';
  ctx.beginPath();
  ctx.moveTo(X(458), Y(250));
  ctx.lineTo(X(466), Y(128));
  ctx.lineTo(X(504), Y(128));
  ctx.lineTo(X(512), Y(250));
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#d94f3d';
  ctx.fillRect(X(462), Y(168), 46, 20);
  ctx.fillRect(X(459), Y(214), 52, 18);
  ctx.fillStyle = '#33414f';
  ctx.fillRect(X(460), Y(104), 50, 24);
  ctx.fillStyle = '#ffe9a0';
  ctx.fillRect(X(468), Y(110), 34, 12);
  ctx.fillStyle = '#33414f';
  ctx.beginPath();
  ctx.moveTo(X(458), Y(104));
  ctx.lineTo(X(485), Y(84));
  ctx.lineTo(X(512), Y(104));
  ctx.closePath();
  ctx.fill();
  // flag on the lighthouse: points left or right
  ctx.strokeStyle = '#33414f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(X(485), Y(84));
  ctx.lineTo(X(485), Y(60));
  ctx.stroke();
  ctx.fillStyle = '#e05244';
  ctx.beginPath();
  if (mods.has('flag')) {
    ctx.moveTo(X(485), Y(60));
    ctx.lineTo(X(463), Y(66));
    ctx.lineTo(X(485), Y(73));
  } else {
    ctx.moveTo(X(485), Y(60));
    ctx.lineTo(X(507), Y(66));
    ctx.lineTo(X(485), Y(73));
  }
  ctx.closePath();
  ctx.fill();
  // beam of light when it is on
  if (!mods.has('beam')) {
    const g = ctx.createLinearGradient(X(466), Y(116), X(300), Y(150));
    g.addColorStop(0, 'rgba(255,233,160,0.55)');
    g.addColorStop(1, 'rgba(255,233,160,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(X(466), Y(108));
    ctx.lineTo(X(300), Y(92));
    ctx.lineTo(X(300), Y(168));
    ctx.lineTo(X(466), Y(124));
    ctx.closePath();
    ctx.fill();
  }
  // sailboat 1: red sail, or blue in the right picture
  drawSailboat(ctx, X(120), Y(238), 1, mods.has('sail') ? '#3f6fd9' : '#d94f3d');
  // sailboat 2
  drawSailboat(ctx, X(300), Y(268), 0.8, '#3fae7a');
  // buoy
  if (!mods.has('buoy')) {
    ctx.fillStyle = '#d94f3d';
    circle(ctx, X(392), Y(322), 11);
    ctx.fill();
    ctx.fillStyle = '#f5ead0';
    ctx.fillRect(X(382), Y(318), 20, 7);
    ctx.fillStyle = '#33414f';
    ctx.fillRect(X(390), Y(306), 4, 8);
  }
  // jumping fish
  if (!mods.has('fish')) {
    ctx.fillStyle = '#9fc6d8';
    ctx.beginPath();
    ctx.ellipse(X(212), Y(232), 14, 6, -0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(X(222), Y(226));
    ctx.lineTo(X(232), Y(220));
    ctx.lineTo(X(230), Y(232));
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    circle(ctx, X(206), Y(248), 3);
    ctx.fill();
    circle(ctx, X(216), Y(254), 2);
    ctx.fill();
  }
  // wooden dock with crates
  ctx.fillStyle = '#7a5a3c';
  ctx.fillRect(X(0), Y(344), 210, 86);
  ctx.fillStyle = '#8a6a4a';
  for (let i = 0; i < 5; i++) ctx.fillRect(X(0), Y(348 + i * 16), 210, 4);
  ctx.fillStyle = '#5d4030';
  ctx.fillRect(X(16), Y(344), 10, 86);
  ctx.fillRect(X(96), Y(344), 10, 86);
  ctx.fillRect(X(180), Y(344), 10, 86);
  drawCrate(ctx, X(52), Y(312), 30);
  drawCrate(ctx, X(88), Y(312), 30);
  drawCrate(ctx, X(70), Y(282), 30);
  if (mods.has('crate')) drawCrate(ctx, X(128), Y(312), 30);
  // rope coil on the dock
  ctx.strokeStyle = '#c9b183';
  ctx.lineWidth = 3;
  circle(ctx, X(168), Y(396), 14);
  ctx.stroke();
  circle(ctx, X(168), Y(396), 8);
  ctx.stroke();
}

function drawSailboat(ctx, x, y, s, sailColor) {
  ctx.fillStyle = '#6e4a2f';
  ctx.beginPath();
  ctx.moveTo(x - 34 * s, y);
  ctx.lineTo(x + 34 * s, y);
  ctx.lineTo(x + 24 * s, y + 14 * s);
  ctx.lineTo(x - 24 * s, y + 14 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#4a3220';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 52 * s);
  ctx.stroke();
  ctx.fillStyle = sailColor;
  ctx.beginPath();
  ctx.moveTo(x, y - 50 * s);
  ctx.lineTo(x, y - 6 * s);
  ctx.lineTo(x + 26 * s, y - 6 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f5ead0';
  ctx.beginPath();
  ctx.moveTo(x - 2 * s, y - 48 * s);
  ctx.lineTo(x - 2 * s, y - 6 * s);
  ctx.lineTo(x - 20 * s, y - 6 * s);
  ctx.closePath();
  ctx.fill();
}

function drawCrate(ctx, x, y, s) {
  ctx.fillStyle = '#a67c4a';
  ctx.fillRect(x, y, s, s);
  ctx.strokeStyle = '#6e4f2a';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, s, s);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + s, y + s);
  ctx.moveTo(x + s, y);
  ctx.lineTo(x, y + s);
  ctx.stroke();
}

// ---------------------------------------------------------------- scene 3
function drawMushroomHollow(ctx, ox, oy, mods) {
  const X = (x) => ox + x;
  const Y = (y) => oy + y;
  skyGradient(ctx, ox, oy, PANEL_W, 430, '#2c4a2e', '#7fae62');
  // canopy light
  ctx.fillStyle = 'rgba(255,240,180,0.14)';
  ellipse(ctx, X(280), Y(90), 220, 60);
  ctx.fill();
  // big tree on the left
  ctx.fillStyle = '#5d4030';
  ctx.beginPath();
  ctx.moveTo(X(28), Y(330));
  ctx.quadraticCurveTo(X(38), Y(180), X(52), Y(110));
  ctx.lineTo(X(78), Y(110));
  ctx.quadraticCurveTo(X(88), Y(200), X(96), Y(330));
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3c6e35';
  circle(ctx, X(60), Y(96), 62);
  ctx.fill();
  circle(ctx, X(10), Y(120), 44);
  ctx.fill();
  circle(ctx, X(112), Y(118), 46);
  ctx.fill();
  ctx.fillStyle = '#4a8a40';
  circle(ctx, X(48), Y(80), 30);
  ctx.fill();
  // owl on a branch, eyes open or closed
  ctx.strokeStyle = '#5d4030';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(X(420), Y(150));
  ctx.lineTo(X(520), Y(138));
  ctx.stroke();
  ctx.fillStyle = '#8a6a4a';
  ellipse(ctx, X(468), Y(122), 20, 26);
  ctx.fill();
  ctx.fillStyle = '#a67c4a';
  circle(ctx, X(462), Y(96), 11);
  ctx.fill();
  circle(ctx, X(476), Y(96), 11);
  ctx.fill();
  if (mods.has('owl-eyes')) {
    ctx.strokeStyle = '#3a2c1c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(X(462), Y(98), 6, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(X(476), Y(98), 6, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#ffe9a0';
    circle(ctx, X(462), Y(98), 5.5);
    ctx.fill();
    circle(ctx, X(476), Y(98), 5.5);
    ctx.fill();
    ctx.fillStyle = '#2e2a33';
    circle(ctx, X(462), Y(98), 2.5);
    ctx.fill();
    circle(ctx, X(476), Y(98), 2.5);
    ctx.fill();
  }
  ctx.fillStyle = '#e8a13a';
  ctx.beginPath();
  ctx.moveTo(X(464), Y(106));
  ctx.lineTo(X(474), Y(106));
  ctx.lineTo(X(469), Y(112));
  ctx.closePath();
  ctx.fill();
  // butterfly
  if (!mods.has('butterfly')) {
    ctx.fillStyle = '#b48cff';
    ellipse(ctx, X(212), Y(142), 12, 8);
    ctx.fill();
    ellipse(ctx, X(234), Y(142), 12, 8);
    ctx.fill();
    ctx.fillStyle = '#8a5fd9';
    ellipse(ctx, X(216), Y(154), 8, 6);
    ctx.fill();
    ellipse(ctx, X(230), Y(154), 8, 6);
    ctx.fill();
    ctx.fillStyle = '#2e2a33';
    ctx.fillRect(X(221), Y(138), 3, 18);
  }
  // fireflies
  firefly(ctx, X(150), Y(210), 3);
  firefly(ctx, X(340), Y(180), 3);
  firefly(ctx, X(420), Y(240), 2.5);
  firefly(ctx, X(90), Y(260), 2.5);
  if (mods.has('firefly')) firefly(ctx, X(196), Y(176), 3.5);
  // grassy ground
  ctx.fillStyle = '#4a7d3a';
  ctx.fillRect(X(0), Y(300), PANEL_W, 130);
  ctx.fillStyle = '#5d9a46';
  for (let i = 0; i < 40; i++) {
    const gx = (i * 53) % 540 + 10;
    const gy = 312 + ((i * 37) % 104);
    ctx.beginPath();
    ctx.moveTo(X(gx), Y(gy));
    ctx.lineTo(X(gx + 3), Y(gy - 8));
    ctx.lineTo(X(gx + 6), Y(gy));
    ctx.closePath();
    ctx.fill();
  }
  // stream across the bottom
  ctx.fillStyle = '#5fb3d9';
  ctx.beginPath();
  ctx.moveTo(X(0), Y(386));
  ctx.quadraticCurveTo(X(180), Y(372), X(330), Y(390));
  ctx.quadraticCurveTo(X(460), Y(404), X(560), Y(388));
  ctx.lineTo(X(560), Y(430));
  ctx.lineTo(X(0), Y(430));
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(X(40), Y(404));
  ctx.quadraticCurveTo(X(140), Y(396), X(240), Y(406));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(X(320), Y(412));
  ctx.quadraticCurveTo(X(420), Y(404), X(520), Y(412));
  ctx.stroke();
  // stones in the stream
  ctx.fillStyle = '#8a8f96';
  ellipse(ctx, X(140), Y(408), 16, 9);
  ctx.fill();
  ellipse(ctx, X(300), Y(414), 18, 10);
  ctx.fill();
  if (mods.has('stone')) {
    ellipse(ctx, X(452), Y(410), 15, 9);
    ctx.fill();
  }
  // big mushroom: five spots, or three in the right picture
  drawMushroom(ctx, X(280), Y(268), 1, mods.has('spots') ? 3 : 5);
  drawMushroom(ctx, X(180), Y(306), 0.55, 3);
  drawMushroom(ctx, X(360), Y(312), 0.5, 2);
  drawMushroom(ctx, X(500), Y(330), 0.42, 2);
  // berry bush
  ctx.fillStyle = '#2e5d2a';
  circle(ctx, X(492), Y(286), 34);
  ctx.fill();
  circle(ctx, X(520), Y(300), 26);
  ctx.fill();
  if (!mods.has('berries')) {
    ctx.fillStyle = '#d94f3d';
    for (const [bx, by] of [[478, 276], [496, 292], [512, 274], [524, 292], [500, 306]]) {
      circle(ctx, X(bx), Y(by), 5);
      ctx.fill();
    }
  }
  // snail
  if (!mods.has('snail')) {
    ctx.fillStyle = '#c98a5a';
    circle(ctx, X(120), Y(360), 12);
    ctx.fill();
    ctx.strokeStyle = '#8a5a30';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(X(120), Y(360), 7, 0, Math.PI * 1.5);
    ctx.stroke();
    ctx.fillStyle = '#e8c9a0';
    ellipse(ctx, X(132), Y(368), 10, 5);
    ctx.fill();
    ctx.strokeStyle = '#2e2a33';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(X(138), Y(364));
    ctx.lineTo(X(140), Y(356));
    ctx.moveTo(X(134), Y(364));
    ctx.lineTo(X(134), Y(356));
    ctx.stroke();
  }
  // flowers: one pink, or yellow in the right picture
  flower(ctx, X(90), Y(330), 1, '#ff7fa5', '#ffd76a');
  flower(ctx, X(220), Y(336), 1, '#ffffff', '#ffd76a');
  flower(ctx, X(400), Y(340), 1, mods.has('flower') ? '#ffd76a' : '#ff7fa5', '#7a4a2e');
  flower(ctx, X(450), Y(352), 0.9, '#b48cff', '#ffd76a');
  // acorn at the foot of the tree
  if (!mods.has('acorn')) {
    ctx.fillStyle = '#8a5a30';
    ctx.beginPath();
    ctx.moveTo(X(66), Y(392));
    ctx.lineTo(X(82), Y(392));
    ctx.lineTo(X(74), Y(380));
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#a67c4a';
    circle(ctx, X(74), Y(396), 7);
    ctx.fill();
    ctx.fillStyle = '#6e4a2a';
    ctx.beginPath();
    ctx.arc(X(74), Y(390), 7, Math.PI, 0);
    ctx.fill();
  }
}

function drawMushroom(ctx, x, y, s, spots) {
  ctx.fillStyle = '#f5ead0';
  ctx.beginPath();
  ctx.moveTo(x - 10 * s, y);
  ctx.quadraticCurveTo(x - 12 * s, y - 34 * s, x, y - 36 * s);
  ctx.quadraticCurveTo(x + 12 * s, y - 34 * s, x + 10 * s, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#d94f3d';
  ctx.beginPath();
  ctx.moveTo(x - 34 * s, y - 26 * s);
  ctx.quadraticCurveTo(x, y - 72 * s, x + 34 * s, y - 26 * s);
  ctx.quadraticCurveTo(x, y - 14 * s, x - 34 * s, y - 26 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  const spotPos = [[-16, -46], [0, -56], [16, -44], [-8, -34], [10, -32]];
  for (let i = 0; i < spots; i++) {
    const [sx, sy] = spotPos[i];
    circle(ctx, x + sx * s, y + sy * s, 5 * s);
    ctx.fill();
  }
}

// ---------------------------------------------------------------- catalogue
export const SCENES = [
  {
    id: 'lantern-lane',
    name: 'Lantern Lane',
    subtitle: 'A quiet night street, lit by paper lanterns.',
    timeLimit: 180,
    draw: drawLanternLane,
    diffs: [
      { id: 'moon', label: 'the moon', x: 470, y: 62, r: 30 },
      { id: 'cat', label: 'the cat on the wall', x: 140, y: 300, r: 30 },
      { id: 'lantern', label: 'a lantern’s colour', x: 280, y: 124, r: 26 },
      { id: 'window', label: 'the shop window', x: 422, y: 280, r: 30 },
      { id: 'basket', label: 'flowers in the basket', x: 486, y: 336, r: 26 },
      { id: 'star', label: 'a star by the moon', x: 420, y: 44, r: 24 },
      { id: 'smoke', label: 'chimney smoke', x: 332, y: 88, r: 26 },
      { id: 'sign', label: 'the shop sign', x: 452, y: 221, r: 26 },
    ],
  },
  {
    id: 'harbor-dawn',
    name: 'Harbor Dawn',
    subtitle: 'Fishing boats under a lighthouse at first light.',
    timeLimit: 180,
    draw: drawHarborDawn,
    diffs: [
      { id: 'beam', label: 'the lighthouse beam', x: 400, y: 130, r: 30 },
      { id: 'sail', label: 'the big sail’s colour', x: 132, y: 212, r: 28 },
      { id: 'gull', label: 'a gull in the sky', x: 330, y: 70, r: 24 },
      { id: 'crate', label: 'a crate on the dock', x: 143, y: 327, r: 26 },
      { id: 'flag', label: 'the lighthouse flag', x: 485, y: 66, r: 22 },
      { id: 'buoy', label: 'the red buoy', x: 392, y: 322, r: 26 },
      { id: 'fish', label: 'the jumping fish', x: 214, y: 232, r: 26 },
      { id: 'cloudsun', label: 'a cloud over the sun', x: 100, y: 70, r: 30 },
    ],
  },
  {
    id: 'mushroom-hollow',
    name: 'Mushroom Hollow',
    subtitle: 'Fireflies and toadstools deep in the old woods.',
    timeLimit: 210,
    draw: drawMushroomHollow,
    diffs: [
      { id: 'owl-eyes', label: 'the owl’s eyes', x: 469, y: 98, r: 24 },
      { id: 'spots', label: 'spots on the big mushroom', x: 280, y: 232, r: 28 },
      { id: 'firefly', label: 'a firefly', x: 196, y: 176, r: 22 },
      { id: 'snail', label: 'the snail', x: 126, y: 362, r: 26 },
      { id: 'flower', label: 'a flower’s colour', x: 400, y: 340, r: 24 },
      { id: 'butterfly', label: 'the butterfly', x: 223, y: 148, r: 26 },
      { id: 'stone', label: 'a stone in the stream', x: 452, y: 410, r: 24 },
      { id: 'berries', label: 'berries on the bush', x: 500, y: 288, r: 28 },
      { id: 'acorn', label: 'the acorn', x: 74, y: 390, r: 22 },
    ],
  },
];
