// scenes.js — the three original scenes of "Find the Difference".
// Every scene is drawn twice from the same code: the left panel plain,
// the right panel with a set of deliberate differences applied (mods).
// All art is drawn with Canvas 2D primitives by this file alone.
// Canvas space for every scene is 600 x 420.

export const PANEL_W = 600;
export const PANEL_H = 420;

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}

function star(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function bookRow(ctx, x, y, colors, missing) {
  let bx = x;
  colors.forEach((c, i) => {
    if (i === missing) {
      bx += 14;
      return;
    }
    ctx.fillStyle = c;
    ctx.fillRect(bx, y - 34 - (i % 2) * 4, 12, 34 + (i % 2) * 4);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(bx + 2, y - 30 - (i % 2) * 4, 8, 3);
    bx += 14;
  });
}

// ---------------------------------------------------------------------------
// Scene 1 — "Cosy Corner": a quiet reading room at dusk.
// ---------------------------------------------------------------------------
function drawRoom(ctx, mods) {
  // Wall and floor.
  const wall = ctx.createLinearGradient(0, 0, 0, 300);
  wall.addColorStop(0, '#f3e2c7');
  wall.addColorStop(1, '#e8cfa5');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, 600, 300);
  ctx.fillStyle = '#b98a5a';
  ctx.fillRect(0, 300, 600, 120);
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  for (let i = 0; i < 6; i++) ctx.fillRect(0, 312 + i * 20, 600, 2);

  // Window with night sky, moon and stars.
  ctx.fillStyle = '#5b4a68';
  ctx.fillRect(36, 36, 158, 154);
  ctx.fillStyle = '#1d2b4d';
  ctx.fillRect(44, 44, 142, 138);
  ctx.fillStyle = '#f4e9c8';
  circle(ctx, 160, 72, 16);
  ctx.fill();
  ctx.fillStyle = '#ffe9a8';
  star(ctx, 70, 66, 6);
  ctx.fill();
  if (!mods.has('window-star')) {
    star(ctx, 108, 96, 5);
    ctx.fill();
  }
  star(ctx, 142, 132, 5);
  ctx.fill();
  ctx.strokeStyle = '#5b4a68';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(115, 44);
  ctx.lineTo(115, 182);
  ctx.moveTo(44, 113);
  ctx.lineTo(186, 113);
  ctx.stroke();
  // Curtains.
  ctx.fillStyle = '#c65b4e';
  ctx.beginPath();
  ctx.moveTo(30, 30);
  ctx.lineTo(58, 30);
  ctx.lineTo(52, 196);
  ctx.lineTo(30, 196);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(200, 30);
  ctx.lineTo(172, 30);
  ctx.lineTo(178, 196);
  ctx.lineTo(200, 196);
  ctx.closePath();
  ctx.fill();

  // Framed picture: a sun, or a moon when the difference applies.
  ctx.fillStyle = '#7a5a3a';
  ctx.fillRect(238, 42, 116, 80);
  ctx.fillStyle = '#fdf6e3';
  ctx.fillRect(246, 50, 100, 64);
  if (mods.has('picture')) {
    ctx.fillStyle = '#e8c86a';
    circle(ctx, 296, 82, 14);
    ctx.fill();
    ctx.fillStyle = '#d8b45a';
    circle(ctx, 290, 78, 4);
    ctx.fill();
  } else {
    ctx.fillStyle = '#f2b134';
    circle(ctx, 296, 82, 16);
    ctx.fill();
    ctx.strokeStyle = '#f2b134';
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(296 + Math.cos(a) * 22, 82 + Math.sin(a) * 22);
      ctx.lineTo(296 + Math.cos(a) * 28, 82 + Math.sin(a) * 28);
      ctx.stroke();
    }
  }

  // Wall clock.
  ctx.fillStyle = '#3f3a35';
  circle(ctx, 478, 82, 34);
  ctx.fill();
  ctx.fillStyle = '#fff8e7';
  circle(ctx, 478, 82, 28);
  ctx.fill();
  ctx.fillStyle = '#3f3a35';
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    circle(ctx, 478 + Math.cos(a) * 23, 82 + Math.sin(a) * 23, 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#3f3a35';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(478, 82);
  if (mods.has('clock-hands')) {
    ctx.lineTo(462, 82);
  } else {
    ctx.lineTo(478, 64);
  }
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(478, 82);
  ctx.lineTo(492, 90);
  ctx.stroke();

  // Hanging lamp with a warm glow (glow off when the difference applies).
  ctx.strokeStyle = '#6b4f2a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 0);
  ctx.lineTo(300, 44);
  ctx.stroke();
  if (!mods.has('lamp-glow')) {
    const glow = ctx.createRadialGradient(300, 84, 4, 300, 84, 66);
    glow.addColorStop(0, 'rgba(255, 214, 120, 0.55)');
    glow.addColorStop(1, 'rgba(255, 214, 120, 0)');
    ctx.fillStyle = glow;
    circle(ctx, 300, 84, 66);
    ctx.fill();
  }
  ctx.fillStyle = mods.has('lamp-glow') ? '#8a7a5a' : '#e07840';
  ctx.beginPath();
  ctx.moveTo(276, 78);
  ctx.lineTo(324, 78);
  ctx.lineTo(312, 48);
  ctx.lineTo(288, 48);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = mods.has('lamp-glow') ? '#c9b98a' : '#ffe9a8';
  circle(ctx, 300, 82, 8);
  ctx.fill();

  // Bookshelf with three shelves of books.
  ctx.fillStyle = '#7a4a2b';
  ctx.fillRect(28, 212, 176, 150);
  ctx.fillStyle = '#e8d5b0';
  ctx.fillRect(36, 220, 160, 44);
  ctx.fillRect(36, 272, 160, 44);
  ctx.fillRect(36, 324, 160, 30);
  bookRow(ctx, 42, 262, ['#c65b4e', '#4e7a5a', '#4a6a9e', '#d8a03c', '#8a5a9e'], mods.has('book-missing') ? 2 : -1);
  bookRow(ctx, 42, 314, ['#4a6a9e', '#c65b4e', '#d8a03c', '#4e7a5a', '#8a5a9e'], -1);
  ctx.fillStyle = '#4a6a9e';
  ctx.fillRect(60, 330, 26, 22);
  ctx.fillStyle = '#c65b4e';
  ctx.fillRect(92, 330, 26, 22);

  // Rug.
  ctx.fillStyle = '#a34a44';
  ellipse(ctx, 300, 356, 150, 30);
  ctx.fill();
  ctx.fillStyle = '#c97a6a';
  ellipse(ctx, 300, 356, 118, 21);
  ctx.fill();

  // Sleeping cat on the rug (tail curled, or missing when the difference applies).
  ctx.fillStyle = '#e8a34a';
  ellipse(ctx, 292, 340, 42, 16);
  ctx.fill();
  circle(ctx, 330, 330, 15);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(320, 318);
  ctx.lineTo(316, 304);
  ctx.lineTo(328, 314);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(336, 316);
  ctx.lineTo(342, 303);
  ctx.lineTo(344, 317);
  ctx.closePath();
  ctx.fill();
  if (!mods.has('cat-tail')) {
    ctx.strokeStyle = '#e8a34a';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(252, 336, 14, Math.PI * 0.6, Math.PI * 1.7);
    ctx.stroke();
  }
  ctx.fillStyle = '#3f3a35';
  circle(ctx, 335, 328, 2);
  ctx.fill();
  circle(ctx, 325, 328, 2);
  ctx.fill();

  // Cushion on the floor (striped, or plain when the difference applies).
  ctx.fillStyle = '#4e7a8a';
  rr(ctx, 150, 330, 52, 30, 8);
  ctx.fill();
  if (!mods.has('cushion-stripes')) {
    ctx.fillStyle = '#f2e3c8';
    ctx.fillRect(162, 330, 6, 30);
    ctx.fillRect(180, 330, 6, 30);
  }

  // Table with a teapot and a mug.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(356, 268, 208, 12);
  ctx.fillRect(372, 280, 12, 74);
  ctx.fillRect(536, 280, 12, 74);
  ctx.fillStyle = mods.has('teapot-color') ? '#d86a2a' : '#3f7a6a';
  ctx.beginPath();
  ctx.moveTo(398, 268);
  ctx.quadraticCurveTo(388, 238, 408, 232);
  ctx.lineTo(436, 232);
  ctx.quadraticCurveTo(456, 238, 446, 268);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2f2a26';
  circle(ctx, 422, 228, 5);
  ctx.fill();
  ctx.strokeStyle = mods.has('teapot-color') ? '#d86a2a' : '#3f7a6a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(398, 244);
  ctx.quadraticCurveTo(382, 240, 386, 254);
  ctx.stroke();
  ctx.fillStyle = mods.has('mug-color') ? '#c65b4e' : '#4a6a9e';
  rr(ctx, 486, 238, 34, 30, 4);
  ctx.fill();
  ctx.strokeStyle = mods.has('mug-color') ? '#c65b4e' : '#4a6a9e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(524, 252, 8, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();

  // Potted plant on the floor (five leaves, or four when the difference applies).
  ctx.fillStyle = '#b65b3a';
  ctx.beginPath();
  ctx.moveTo(556, 330);
  ctx.lineTo(588, 330);
  ctx.lineTo(582, 360);
  ctx.lineTo(562, 360);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#4e8a4a';
  const leaves = mods.has('plant-leaf') ? 4 : 5;
  for (let i = 0; i < leaves; i++) {
    const a = -Math.PI / 2 + (i - (leaves - 1) / 2) * 0.5;
    ctx.beginPath();
    ctx.ellipse(572 + Math.cos(a) * 16, 312 + Math.sin(a) * 16, 7, 18, a, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---------------------------------------------------------------------------
// Scene 2 — "Night Market": lanterns, stalls and a sleepy vendor.
// ---------------------------------------------------------------------------
function drawMarket(ctx, mods) {
  // Night sky, moon and stars.
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#241a3d');
  sky.addColorStop(1, '#4a2a5a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 260);
  ctx.fillStyle = '#f4e9c8';
  circle(ctx, 520, 58, 26);
  ctx.fill();
  if (!mods.has('moon-crater')) {
    ctx.fillStyle = '#d8c89a';
    circle(ctx, 512, 52, 5);
    ctx.fill();
    circle(ctx, 528, 66, 4);
    ctx.fill();
  }
  ctx.fillStyle = '#ffe9a8';
  const skyStars = [
    [70, 40],
    [150, 70],
    [250, 36],
    [340, 60],
    [430, 34],
    [90, 110],
    [300, 100],
  ];
  skyStars.forEach(([x, y], i) => {
    if (mods.has('sky-star') && i === 3) return;
    star(ctx, x, y, 5);
    ctx.fill();
  });

  // String of paper lanterns.
  ctx.strokeStyle = '#1a1226';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 96);
  ctx.quadraticCurveTo(300, 132, 600, 96);
  ctx.stroke();
  const lanternXs = [70, 170, 270, 370, 470, 550];
  const lanternColors = ['#e85a4a', '#f2b134', '#e85a4a', '#4e9e6a', '#f2b134', '#e85a4a'];
  lanternXs.forEach((x, i) => {
    if (mods.has('lantern-missing') && i === 2) return;
    const y = 96 + Math.sin((x / 600) * Math.PI) * 14 + 16;
    ctx.fillStyle = lanternColors[i];
    ellipse(ctx, x, y, 16, 20);
    ctx.fill();
    ctx.fillStyle = '#f2d06a';
    ctx.fillRect(x - 16, y - 3, 32, 4);
  });

  // Bunting flags.
  ctx.strokeStyle = '#1a1226';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 150);
  ctx.quadraticCurveTo(300, 176, 600, 150);
  ctx.stroke();
  const flagColors = ['#e85a4a', '#f2b134', '#4e9e6a', '#4a8ac9', '#e85a4a', '#f2b134', '#4e9e6a', '#4a8ac9'];
  flagColors.forEach((c, i) => {
    if (mods.has('flag-missing') && i === 4) return;
    const x = 40 + i * 68;
    const y = 150 + Math.sin((x / 600) * Math.PI) * 10;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(x - 12, y);
    ctx.lineTo(x + 12, y);
    ctx.lineTo(x, y + 22);
    ctx.closePath();
    ctx.fill();
  });

  // Balloons.
  const balloons = [
    [330, 108, '#e85a4a'],
    [356, 96, '#f2b134'],
    [306, 96, '#4a8ac9'],
  ];
  balloons.forEach(([x, y, c], i) => {
    if (mods.has('balloon-missing') && i === 1) return;
    ctx.strokeStyle = '#d8c8b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y + 18);
    ctx.quadraticCurveTo(x + 6, y + 46, x - 2, y + 62);
    ctx.stroke();
    ctx.fillStyle = c;
    ellipse(ctx, x, y, 14, 18);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ellipse(ctx, x - 5, y - 6, 4, 6);
    ctx.fill();
  });

  // Ground.
  ctx.fillStyle = '#3a2a3a';
  ctx.fillRect(0, 260, 600, 160);
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  for (let i = 0; i < 8; i++) ctx.fillRect(0, 276 + i * 18, 600, 2);

  // Left stall: striped awning, fruit crates, vendor behind it.
  ctx.fillStyle = '#e85a4a';
  ctx.fillRect(28, 216, 190, 22);
  ctx.fillStyle = '#f4e9c8';
  for (let i = 0; i < 5; i++) ctx.fillRect(28 + i * 38, 216, 19, 22);
  ctx.fillStyle = '#7a4a2b';
  ctx.fillRect(34, 238, 178, 8);
  ctx.fillRect(40, 246, 10, 108);
  ctx.fillRect(196, 246, 10, 108);
  // Vendor: head, hat, shoulders.
  ctx.fillStyle = '#f2c89a';
  circle(ctx, 122, 196, 17);
  ctx.fill();
  ctx.fillStyle = mods.has('hat-color') ? '#c65b4e' : '#d8b45a';
  ctx.beginPath();
  ctx.arc(122, 190, 22, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(96, 188, 52, 5);
  ctx.fillStyle = '#4a6a9e';
  ctx.beginPath();
  ctx.moveTo(96, 214);
  ctx.quadraticCurveTo(122, 200, 148, 214);
  ctx.lineTo(148, 246);
  ctx.lineTo(96, 246);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3f3a35';
  circle(ctx, 116, 194, 2);
  ctx.fill();
  circle(ctx, 128, 194, 2);
  ctx.fill();
  // Fruit crates.
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(48, 300, 70, 34);
  ctx.fillRect(128, 300, 70, 34);
  ctx.fillStyle = '#e85a4a';
  circle(ctx, 62, 296, 8);
  ctx.fill();
  circle(ctx, 82, 292, 8);
  ctx.fill();
  circle(ctx, 102, 296, 8);
  ctx.fill();
  ctx.fillStyle = mods.has('fruit-color') ? '#4e9e6a' : '#f28a2a';
  circle(ctx, 142, 296, 8);
  ctx.fill();
  circle(ctx, 162, 292, 8);
  ctx.fill();
  circle(ctx, 182, 296, 8);
  ctx.fill();

  // Cart with a wheel in the middle (light rim so it reads on the dark ground).
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(238, 300, 124, 40);
  ctx.fillRect(238, 288, 124, 12);
  ctx.strokeStyle = '#d8c8a0';
  ctx.lineWidth = 4;
  circle(ctx, 300, 352, 20);
  ctx.stroke();
  ctx.fillStyle = '#8a6a42';
  circle(ctx, 300, 352, 16);
  ctx.fill();
  ctx.strokeStyle = '#d8c8a0';
  ctx.lineWidth = 2;
  const spokes = mods.has('wheel-spokes') ? 4 : 6;
  for (let i = 0; i < spokes; i++) {
    const a = (i * Math.PI) / (spokes / 2);
    ctx.beginPath();
    ctx.moveTo(300, 352);
    ctx.lineTo(300 + Math.cos(a) * 18, 352 + Math.sin(a) * 18);
    ctx.stroke();
  }
  ctx.fillStyle = '#e8d5b0';
  circle(ctx, 258, 284, 7);
  ctx.fill();
  circle(ctx, 280, 280, 7);
  ctx.fill();
  circle(ctx, 322, 282, 7);
  ctx.fill();
  circle(ctx, 342, 286, 7);
  ctx.fill();

  // Right stall: awning, sign, and a cat on a crate.
  ctx.fillStyle = '#4a8ac9';
  ctx.fillRect(392, 216, 180, 22);
  ctx.fillStyle = '#f4e9c8';
  for (let i = 0; i < 5; i++) ctx.fillRect(392 + i * 36, 216, 18, 22);
  ctx.fillStyle = '#7a4a2b';
  ctx.fillRect(398, 238, 168, 8);
  ctx.fillRect(404, 246, 10, 108);
  ctx.fillRect(556, 246, 10, 108);
  // Sign board.
  ctx.fillStyle = '#2f2a26';
  rr(ctx, 428, 168, 104, 38, 6);
  ctx.fill();
  ctx.fillStyle = '#ffe9a8';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TEA', 480, 188);
  if (!mods.has('sign-star')) {
    ctx.fillStyle = '#f2b134';
    star(ctx, 516, 178, 6);
    ctx.fill();
  }
  // Tea cups on the counter.
  ctx.fillStyle = '#f4e9c8';
  rr(ctx, 420, 224, 22, 14, 3);
  ctx.fill();
  rr(ctx, 452, 224, 22, 14, 3);
  ctx.fill();
  rr(ctx, 516, 224, 22, 14, 3);
  ctx.fill();
  // Cat sitting on a crate, tail curled (light fur so it reads on the dark crate).
  ctx.fillStyle = '#5a5a5a';
  ctx.fillRect(486, 306, 56, 48);
  ctx.fillStyle = '#c8c8c8';
  ellipse(ctx, 514, 300, 18, 12);
  ctx.fill();
  circle(ctx, 526, 286, 10);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(520, 278);
  ctx.lineTo(517, 268);
  ctx.lineTo(526, 276);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3f3a35';
  circle(ctx, 529, 284, 1.5);
  ctx.fill();
  if (!mods.has('cat-tail')) {
    ctx.strokeStyle = '#c8c8c8';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(496, 302, 10, Math.PI * 0.5, Math.PI * 1.6);
    ctx.stroke();
  }
}

// ---------------------------------------------------------------------------
// Scene 3 — "Mountain Lake": peaks, pines, a boat and a little cabin.
// ---------------------------------------------------------------------------
function drawLake(ctx, mods) {
  // Sky, sun and clouds.
  const sky = ctx.createLinearGradient(0, 0, 0, 280);
  sky.addColorStop(0, '#8ec8e8');
  sky.addColorStop(1, '#d8ecf4');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 280);
  ctx.fillStyle = '#f2b134';
  circle(ctx, 92, 62, 28);
  ctx.fill();
  if (!mods.has('sun-rays')) {
    ctx.strokeStyle = '#f2b134';
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(92 + Math.cos(a) * 34, 62 + Math.sin(a) * 34);
      ctx.lineTo(92 + Math.cos(a) * 44, 62 + Math.sin(a) * 44);
      ctx.stroke();
    }
  }
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ellipse(ctx, 210, 66, 42, 16);
  ctx.fill();
  ellipse(ctx, 238, 58, 30, 14);
  ctx.fill();
  if (!mods.has('cloud-missing')) {
    ellipse(ctx, 430, 48, 38, 14);
    ctx.fill();
    ellipse(ctx, 456, 40, 26, 12);
    ctx.fill();
  }
  // Birds.
  ctx.strokeStyle = '#3a3a3a';
  ctx.lineWidth = 2.5;
  const birds = [
    [180, 120],
    [220, 104],
    [300, 130],
  ];
  birds.forEach(([x, y], i) => {
    if (mods.has('bird-missing') && i === 2) return;
    ctx.beginPath();
    ctx.moveTo(x - 9, y);
    ctx.quadraticCurveTo(x - 3, y - 7, x, y);
    ctx.quadraticCurveTo(x + 3, y - 7, x + 9, y);
    ctx.stroke();
  });

  // Mountains with snow caps.
  ctx.fillStyle = '#5a6a8a';
  ctx.beginPath();
  ctx.moveTo(0, 280);
  ctx.lineTo(150, 90);
  ctx.lineTo(300, 280);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#4a5a7a';
  ctx.beginPath();
  ctx.moveTo(220, 280);
  ctx.lineTo(400, 130);
  ctx.lineTo(560, 280);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(132, 112);
  ctx.lineTo(150, 90);
  ctx.lineTo(168, 112);
  ctx.lineTo(156, 120);
  ctx.lineTo(148, 110);
  ctx.lineTo(140, 120);
  ctx.closePath();
  ctx.fill();
  if (!mods.has('snow-cap')) {
    ctx.beginPath();
    ctx.moveTo(386, 148);
    ctx.lineTo(400, 130);
    ctx.lineTo(414, 148);
    ctx.lineTo(406, 154);
    ctx.lineTo(399, 146);
    ctx.lineTo(392, 154);
    ctx.closePath();
    ctx.fill();
  }

  // Far shore with pine trees.
  ctx.fillStyle = '#3f6a3a';
  ctx.fillRect(0, 262, 600, 20);
  const pines = [
    [80, 252],
    [500, 246],
    [560, 256],
  ];
  pines.forEach(([x, y], i) => {
    if (mods.has('pine-missing') && i === 1) return;
    ctx.fillStyle = '#2f5a2f';
    ctx.beginPath();
    ctx.moveTo(x, y - 46);
    ctx.lineTo(x - 16, y - 10);
    ctx.lineTo(x + 16, y - 10);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y - 58);
    ctx.lineTo(x - 12, y - 30);
    ctx.lineTo(x + 12, y - 30);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#6b4a2f';
    ctx.fillRect(x - 3, y - 10, 6, 12);
  });

  // Cabin on the right shore.
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(452, 210, 88, 52);
  ctx.fillStyle = '#a34a44';
  ctx.beginPath();
  ctx.moveTo(444, 212);
  ctx.lineTo(496, 182);
  ctx.lineTo(548, 212);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(520, 186, 12, 26);
  ctx.fillStyle = 'rgba(200,200,200,0.8)';
  ellipse(ctx, 528, 178, 8, 5);
  ctx.fill();
  ellipse(ctx, 532, 168, 6, 4);
  ctx.fill();
  ctx.fillStyle = mods.has('cabin-window') ? '#4a4a4a' : '#ffe9a8';
  ctx.fillRect(466, 226, 18, 18);
  ctx.fillStyle = '#3f2a1a';
  ctx.fillRect(506, 226, 18, 36);
  // Path of stones from the cabin to the lake.
  ctx.fillStyle = '#c8b8a0';
  const stones = [
    [470, 272],
    [452, 286],
    [432, 300],
    [414, 314],
  ];
  stones.forEach(([x, y], i) => {
    if (mods.has('path-stone') && i === 2) return;
    ellipse(ctx, x, y, 12, 6);
    ctx.fill();
  });

  // Lake.
  const lake = ctx.createLinearGradient(0, 280, 0, 420);
  lake.addColorStop(0, '#4a9ec9');
  lake.addColorStop(1, '#2a6a9e');
  ctx.fillStyle = lake;
  ctx.fillRect(0, 280, 600, 140);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  [300, 330, 360, 392].forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(120, y);
    ctx.moveTo(420, y + 6);
    ctx.lineTo(560, y + 6);
    ctx.stroke();
  });

  // Rowboat with a flag and a seat plank, so it reads as a boat, not a box.
  ctx.fillStyle = '#a86a3a';
  ctx.beginPath();
  ctx.moveTo(272, 318);
  ctx.lineTo(348, 318);
  ctx.lineTo(332, 336);
  ctx.lineTo(288, 336);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#7a4a22';
  ctx.fillRect(292, 322, 36, 5);
  ctx.strokeStyle = '#6b4a2f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(310, 318);
  ctx.lineTo(310, 286);
  ctx.stroke();
  ctx.fillStyle = mods.has('boat-flag') ? '#4a8ac9' : '#e85a4a';
  ctx.beginPath();
  ctx.moveTo(310, 286);
  ctx.lineTo(330, 292);
  ctx.lineTo(310, 298);
  ctx.closePath();
  ctx.fill();

  // A fish jumping out of the lake.
  if (!mods.has('fish-missing')) {
    ctx.fillStyle = '#e8e8e8';
    ctx.beginPath();
    ctx.ellipse(200, 330, 14, 6, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(210, 324);
    ctx.lineTo(220, 320);
    ctx.lineTo(216, 330);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(200, 344, 12, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  }

  // Flowers along the near shore.
  const flowers = [
    [60, 392, '#e85a8a'],
    [120, 398, '#f2b134'],
    [520, 396, '#e85a8a'],
    [560, 388, '#8a5ac9'],
  ];
  flowers.forEach(([x, y, c], i) => {
    ctx.fillStyle = i === 1 && mods.has('flower-color') ? '#e85a8a' : c;
    for (let p = 0; p < 5; p++) {
      const a = (p * 2 * Math.PI) / 5;
      circle(ctx, x + Math.cos(a) * 5, y + Math.sin(a) * 5, 3);
      ctx.fill();
    }
    ctx.fillStyle = '#ffe9a8';
    circle(ctx, x, y, 3);
    ctx.fill();
  });
}

// ---------------------------------------------------------------------------
// Scene table: name, subtitle, time limit, draw function, difference spots.
// Each difference lists the panel coordinates (600 x 420 space) to tap.
// ---------------------------------------------------------------------------
export const SCENES = [
  {
    id: 'room',
    name: 'Scene 1 · Cosy Corner',
    subtitle: 'A quiet reading room at dusk',
    timeLimit: 240,
    draw: drawRoom,
    differences: [
      { id: 'clock-hands', x: 478, y: 82, r: 30, label: 'Clock hands' },
      { id: 'cat-tail', x: 250, y: 336, r: 22, label: "Cat's tail" },
      { id: 'book-missing', x: 84, y: 244, r: 22, label: 'Missing book' },
      { id: 'teapot-color', x: 422, y: 250, r: 26, label: 'Teapot colour' },
      { id: 'plant-leaf', x: 572, y: 310, r: 24, label: 'Plant leaf' },
      { id: 'picture', x: 296, y: 82, r: 30, label: 'Picture in the frame' },
      { id: 'mug-color', x: 503, y: 253, r: 22, label: 'Mug colour' },
      { id: 'window-star', x: 108, y: 96, r: 16, label: 'Star in the window' },
      { id: 'cushion-stripes', x: 176, y: 345, r: 24, label: 'Cushion stripes' },
      { id: 'lamp-glow', x: 300, y: 70, r: 30, label: 'Lamp glow' },
    ],
  },
  {
    id: 'market',
    name: 'Scene 2 · Night Market',
    subtitle: 'Lanterns, tea and a sleepy vendor',
    timeLimit: 210,
    draw: drawMarket,
    differences: [
      { id: 'lantern-missing', x: 270, y: 128, r: 22, label: 'Missing lantern' },
      { id: 'moon-crater', x: 520, y: 58, r: 26, label: 'Craters on the moon' },
      { id: 'sign-star', x: 516, y: 178, r: 14, label: 'Star on the tea sign' },
      { id: 'balloon-missing', x: 356, y: 96, r: 20, label: 'Missing balloon' },
      { id: 'fruit-color', x: 142, y: 296, r: 14, label: 'Fruit colour' },
      { id: 'hat-color', x: 122, y: 186, r: 24, label: "Vendor's hat" },
      { id: 'flag-missing', x: 312, y: 162, r: 16, label: 'Missing bunting flag' },
      { id: 'wheel-spokes', x: 300, y: 352, r: 20, label: 'Cart wheel spokes' },
      { id: 'sky-star', x: 340, y: 60, r: 14, label: 'Star in the sky' },
      { id: 'cat-tail', x: 496, y: 302, r: 18, label: "Cat's tail" },
    ],
  },
  {
    id: 'lake',
    name: 'Scene 3 · Mountain Lake',
    subtitle: 'Peaks, pines and a little cabin',
    timeLimit: 180,
    draw: drawLake,
    differences: [
      { id: 'bird-missing', x: 300, y: 130, r: 16, label: 'Missing bird' },
      { id: 'sun-rays', x: 92, y: 62, r: 34, label: "Sun's rays" },
      { id: 'cloud-missing', x: 440, y: 46, r: 30, label: 'Missing cloud' },
      { id: 'pine-missing', x: 500, y: 226, r: 26, label: 'Missing pine' },
      { id: 'boat-flag', x: 320, y: 292, r: 18, label: 'Boat flag colour' },
      { id: 'fish-missing', x: 200, y: 330, r: 20, label: 'Jumping fish' },
      { id: 'flower-color', x: 120, y: 398, r: 14, label: 'Flower colour' },
      { id: 'cabin-window', x: 475, y: 235, r: 16, label: 'Cabin window light' },
      { id: 'snow-cap', x: 400, y: 142, r: 22, label: 'Snow on the peak' },
      { id: 'path-stone', x: 432, y: 300, r: 16, label: 'Missing stepping stone' },
    ],
  },
];
