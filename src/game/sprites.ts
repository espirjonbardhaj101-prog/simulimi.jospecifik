/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Neo-Brutalist 2D Illustrated Biological Sprites & Light-Theme Renderers
 */

import { PathogenType } from './rules';

/**
 * 1. PATHOGEN SPRITES (High Contrast & Neo-Brutalist Linework)
 */

// Draw Virus: Capsid with glycoprotein spikes and RNA core
export function drawVirusSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  status: 'normal' | 'trapped' | 'damaged' | 'expelled' = 'normal'
) {
  ctx.save();
  ctx.translate(x, y);

  const pulse = Math.sin(time * 5) * 0.08;
  const scale = (status === 'damaged' ? 0.65 : 1) + pulse;
  ctx.scale(scale, scale);

  // Spikes
  const numSpikes = 12;
  for (let i = 0; i < numSpikes; i++) {
    const angle = (i * Math.PI * 2) / numSpikes + time * 0.6;
    const spikeLen = radius * 0.45;
    const sx = Math.cos(angle) * radius;
    const sy = Math.sin(angle) * radius;
    const ex = Math.cos(angle) * (radius + spikeLen);
    const ey = Math.sin(angle) * (radius + spikeLen);

    // Stem
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    // Knob
    ctx.fillStyle = status === 'damaged' ? '#94a3b8' : '#ef4444';
    ctx.beginPath();
    ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Capsid Body
  ctx.fillStyle = status === 'damaged' ? '#cbd5e1' : status === 'trapped' ? '#fde047' : '#f87171';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;

  ctx.beginPath();
  const facets = 8;
  for (let i = 0; i < facets; i++) {
    const a = (i * Math.PI * 2) / facets;
    const fx = Math.cos(a) * radius;
    const fy = Math.sin(a) * radius;
    if (i === 0) ctx.moveTo(fx, fy);
    else ctx.lineTo(fx, fy);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Genetic Core
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  const coilR = radius * 0.45;
  for (let t = 0; t < Math.PI * 3; t += 0.3) {
    const cx = Math.cos(t + time * 3) * (t / 8) * coilR;
    const cy = Math.sin(t + time * 3) * (t / 8) * coilR;
    if (t === 0) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  }
  ctx.stroke();

  ctx.restore();
}

// Draw Bacterium: Bacillus rod with cell wall, flagella, pili, and nucleoid
export function drawBacteriumSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  time: number,
  rotation: number = 0,
  status: 'normal' | 'trapped' | 'damaged' | 'expelled' = 'normal'
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  const w = length;
  const h = length * 0.45;

  // Waving flagella
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  const startX = -w * 0.48;
  ctx.moveTo(startX, 0);
  for (let fx = 0; fx < 36; fx += 6) {
    const wave = Math.sin(time * 12 + fx * 0.3) * 6;
    ctx.lineTo(startX - fx, wave);
  }
  ctx.stroke();

  // Capsule & Cell Wall
  ctx.fillStyle = status === 'damaged' ? '#e2e8f0' : status === 'trapped' ? '#fde047' : '#34d399';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.beginPath();
  const r = h * 0.5;
  ctx.roundRect(-w * 0.5, -h * 0.5, w, h, r);
  ctx.fill();
  ctx.stroke();

  // Internal Nucleoid Loop
  ctx.strokeStyle = '#065f46';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 2; a += 0.4) {
    const nx = Math.cos(a) * (w * 0.25) + Math.sin(a * 4 + time * 3) * 2;
    const ny = Math.sin(a) * (h * 0.2) + Math.cos(a * 3) * 2;
    if (a === 0) ctx.moveTo(nx, ny);
    else ctx.lineTo(nx, ny);
  }
  ctx.closePath();
  ctx.stroke();

  ctx.restore();
}

// Draw Fungus: Budding yeast cell with thick wall and vacuole
export function drawFungusSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  status: 'normal' | 'trapped' | 'damaged' | 'expelled' = 'normal'
) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = status === 'damaged' ? '#cbd5e1' : status === 'trapped' ? '#fef08a' : '#fbbf24';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;

  // Mother cell
  ctx.beginPath();
  ctx.ellipse(0, 0, radius, radius * 0.8, Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Budding daughter cell
  const budR = radius * 0.48;
  const budX = radius * 0.85;
  const budY = -radius * 0.55;
  ctx.beginPath();
  ctx.arc(budX, budY, budR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Large Vacuole
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-radius * 0.2, radius * 0.1, radius * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// Draw Parasite (Paraziti - former Protozoan): Amoeboid parasite with pseudopods
export function drawParasiteSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  status: 'normal' | 'trapped' | 'damaged' | 'expelled' = 'normal'
) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = status === 'damaged' ? '#e2e8f0' : status === 'trapped' ? '#fde047' : '#c084fc';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;

  // Shifting pseudopodia outline
  ctx.beginPath();
  const points = 16;
  for (let i = 0; i <= points; i++) {
    const a = (i * Math.PI * 2) / points;
    const wave =
      Math.sin(a * 4 + time * 3) * (radius * 0.2) +
      Math.cos(a * 2 - time * 2) * (radius * 0.15);
    const r = radius + wave;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Nucleus
  ctx.fillStyle = '#581c87';
  ctx.beginPath();
  ctx.arc(radius * 0.1, -radius * 0.1, radius * 0.32, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(radius * 0.1, -radius * 0.1, radius * 0.12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 2. CELLULAR SPRITES (Light Theme / Neo-Brutalist)
 */

// Draw Red Blood Cell (Eritrocit)
export function drawRedBloodCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  rotation: number = 0
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.fillStyle = '#f87171';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.ellipse(0, 0, radius, radius * 0.85, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Indentation
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.45, radius * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// Draw White Blood Cell / Macrophage (Leukocit / Makrofag)
export function drawWhiteBloodCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  targetX?: number,
  targetY?: number
) {
  ctx.save();
  ctx.translate(x, y);

  let aimAngle = 0;
  if (targetX !== undefined && targetY !== undefined) {
    aimAngle = Math.atan2(targetY - y, targetX - x);
  }

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;

  ctx.beginPath();
  const pts = 14;
  for (let i = 0; i <= pts; i++) {
    const a = (i * Math.PI * 2) / pts;
    let reach = Math.sin(a * 3 + time * 4) * (radius * 0.15);
    const angleDiff = Math.cos(a - aimAngle);
    if (angleDiff > 0.5) {
      reach += angleDiff * radius * 0.35;
    }
    const r = radius + reach;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Multi-lobed nucleus
  ctx.fillStyle = '#7c3aed';
  [-radius * 0.2, radius * 0.15].forEach((lx, idx) => {
    ctx.beginPath();
    ctx.ellipse(lx, (idx === 0 ? -1 : 1) * radius * 0.15, radius * 0.22, radius * 0.15, idx * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  ctx.restore();
}

/**
 * 3. ANATOMICAL ENVIRONMENT RENDERERS (LIGHT THEME & NEO-BRUTALIST)
 */

// Environment 1: Face Profile
export function renderFaceEnvironment(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  hoverNose: boolean,
  hoverMouth: boolean
) {
  // Light Neo-Brutalist architectural grid background
  ctx.fillStyle = '#fef9ef';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  for (let gx = 0; gx < w; gx += 40) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, h);
    ctx.stroke();
  }
  for (let gy = 0; gy < h; gy += 40) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(w, gy);
    ctx.stroke();
  }

  const cx = w * 0.45;
  const cy = h * 0.5;

  ctx.save();
  // Cutaway face silhouette
  ctx.fillStyle = '#fecdd3';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3.5;

  const facePath = new Path2D();
  facePath.moveTo(cx - 140, cy - 220);
  facePath.quadraticCurveTo(cx - 30, cy - 160, cx - 10, cy - 80);
  facePath.lineTo(cx + 40, cy - 20);
  facePath.quadraticCurveTo(cx + 90, cy + 20, cx + 80, cy + 40);
  facePath.lineTo(cx + 35, cy + 50);
  facePath.quadraticCurveTo(cx + 45, cy + 70, cx + 55, cy + 85);
  facePath.lineTo(cx + 25, cy + 95);
  facePath.lineTo(cx + 50, cy + 105);
  facePath.quadraticCurveTo(cx + 60, cy + 150, cx + 45, cy + 180);
  facePath.quadraticCurveTo(cx - 20, cy + 220, cx - 60, cy + 260);
  facePath.lineTo(cx - 240, cy + 260);
  facePath.lineTo(cx - 240, cy - 220);
  facePath.closePath();

  ctx.fill(facePath);
  ctx.stroke(facePath);

  // Nasal cavity
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx + 35, cy + 50);
  ctx.quadraticCurveTo(cx - 40, cy + 20, cx - 80, cy + 40);
  ctx.quadraticCurveTo(cx - 100, cy + 100, cx - 100, cy + 260);
  ctx.lineTo(cx - 130, cy + 260);
  ctx.quadraticCurveTo(cx - 130, cy + 90, cx - 100, cy + 20);
  ctx.quadraticCurveTo(cx - 40, cy - 10, cx + 25, cy + 45);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Oral cavity
  ctx.beginPath();
  ctx.moveTo(cx + 25, cy + 95);
  ctx.quadraticCurveTo(cx - 30, cy + 95, cx - 70, cy + 120);
  ctx.quadraticCurveTo(cx - 80, cy + 170, cx - 75, cy + 260);
  ctx.lineTo(cx - 95, cy + 260);
  ctx.quadraticCurveTo(cx - 105, cy + 160, cx - 90, cy + 115);
  ctx.quadraticCurveTo(cx - 40, cy + 85, cx + 25, cy + 90);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Hotspot 1: NOSE (HUNDA)
  const noseX = cx + 55;
  const noseY = cy + 45;
  ctx.fillStyle = hoverNose ? '#38bdf8' : '#7dd3fc';
  ctx.beginPath();
  ctx.arc(noseX, noseY, hoverNose ? 26 : 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Hotspot 2: MOUTH (GOJA)
  const mouthX = cx + 45;
  const mouthY = cy + 95;
  ctx.fillStyle = hoverMouth ? '#fb923c' : '#fdba74';
  ctx.beginPath();
  ctx.arc(mouthX, mouthY, hoverMouth ? 26 : 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Neo-Brutalist route callouts
  ctx.font = "900 13px 'Archivo Black', sans-serif";
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.fillText('1. HYRJA NGA HUNDA ➔ Trakea', noseX + 38, noseY + 5);
  ctx.fillText('2. HYRJA NGA GOJA ➔ Ezofagu', mouthX + 38, mouthY + 5);

  ctx.restore();
}

// Environment 2: Bloodstream
export function renderBloodstreamEnvironment(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  feverActive: boolean,
  temperature: number
) {
  // Vibrant light theme blood background
  ctx.fillStyle = feverActive ? '#fee2e2' : '#fff1f2';
  ctx.fillRect(0, 0, w, h);

  const wallH = 45;
  const drawEndothelium = (top: boolean) => {
    const yBase = top ? 0 : h - wallH;
    ctx.fillStyle = '#fda4af';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    ctx.fillRect(0, yBase, w, wallH);
    ctx.strokeRect(-2, yBase, w + 4, wallH);

    const cellW = 80;
    for (let x = 0; x < w; x += cellW) {
      ctx.strokeRect(x, yBase, cellW, wallH);
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.ellipse(x + cellW * 0.5, yBase + wallH * 0.5, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  };
  drawEndothelium(true);
  drawEndothelium(false);

  // Plasma flow streamers
  ctx.strokeStyle = feverActive ? '#fca5a5' : '#fed7aa';
  ctx.lineWidth = 3;
  for (let l = 0; l < 6; l++) {
    const y = wallH + 30 + l * ((h - wallH * 2 - 60) / 5);
    const offset = (time * 100 + l * 50) % w;
    ctx.beginPath();
    ctx.moveTo(offset, y);
    ctx.lineTo((offset + 120) % w, y);
    ctx.stroke();
  }

  // Neo-Brutalist Thermometer if fever active
  if (feverActive) {
    const tx = w - 90;
    const ty = wallH + 15;
    const th = 110;
    const tw = 22;

    ctx.save();
    // Shadow
    ctx.fillStyle = '#000000';
    ctx.fillRect(tx + 4, ty + 4, tw, th);
    // Body
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    ctx.fillRect(tx, ty, tw, th);
    ctx.strokeRect(tx, ty, tw, th);

    // Bulb
    ctx.beginPath();
    ctx.arc(tx + tw * 0.5, ty + th + 6, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.stroke();

    // Mercury
    const fillH = Math.min(th - 10, (th - 10) * ((temperature - 36) / 4.5));
    ctx.fillRect(tx + 4, ty + th - fillH, tw - 8, fillH);

    ctx.font = "900 13px 'Archivo Black', sans-serif";
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'right';
    ctx.fillText(`${temperature.toFixed(1)}°C`, tx - 8, ty + 24);
    ctx.fillText('ETHE', tx - 8, ty + 42);
    ctx.restore();
  }
}

// Environment 3: Trachea & Airway
export function renderTracheaEnvironment(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  mucusActive: boolean,
  ciliaActive: boolean
) {
  // Light mint lumen
  ctx.fillStyle = '#f0fdf4';
  ctx.fillRect(0, 0, w, h);

  const wallH = 65;
  const drawEpithelium = (top: boolean) => {
    const yBase = top ? 0 : h - wallH;
    const cellW = 36;

    for (let x = 0; x < w; x += cellW) {
      const isGoblet = (x / cellW) % 4 === 1;
      ctx.fillStyle = isGoblet ? '#99f6e4' : '#a7f3d0';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.fillRect(x, yBase, cellW, wallH);
      ctx.strokeRect(x, yBase, cellW, wallH);

      // Nucleus
      ctx.fillStyle = '#0f766e';
      ctx.beginPath();
      const nY = top ? yBase + 20 : yBase + wallH - 20;
      ctx.ellipse(x + cellW * 0.5, nY, 6, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Cilia
    const ciliaY = top ? wallH : h - wallH;
    const ciliaLength = 16;
    const ciliaStep = 8;
    const ciliaCount = Math.floor(w / ciliaStep);
    ctx.strokeStyle = '#0f766e';
    ctx.lineWidth = 2;

    const beatSpeed = ciliaActive ? 16 : 6;
    const beatDirection = -1;

    for (let i = 0; i < ciliaCount; i++) {
      const cx = i * ciliaStep;
      const wavePhase = i * 0.4 + time * beatSpeed;
      const tipOffset = Math.sin(wavePhase) * 8 * beatDirection;

      ctx.beginPath();
      ctx.moveTo(cx, ciliaY);
      const tipY = top ? ciliaY + ciliaLength : ciliaY - ciliaLength;
      ctx.quadraticCurveTo(cx + tipOffset * 0.5, (ciliaY + tipY) * 0.5, cx + tipOffset, tipY);
      ctx.stroke();
    }

    // Sticky Mucus Layer
    if (mucusActive) {
      ctx.save();
      const mucusH = 16;
      const my = top ? ciliaY + ciliaLength - 4 : ciliaY - ciliaLength - mucusH + 4;
      ctx.fillStyle = '#fde047';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.fillRect(0, my, w, mucusH);
      ctx.strokeRect(0, my, w, mucusH);
      ctx.restore();
    }
  };

  drawEpithelium(true);
  drawEpithelium(false);
}

// Environment 4: Esophagus & Digestive Tract
// REQUIREMENT 2: DO NOT show the stomach until the stomach acid defense button is clicked!
// When clicked, display gastric acid as a surge/flood ("përmbytje acidi") that recedes after 3-6s.
export function renderDigestiveEnvironment(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  stomachAcidActive: boolean,
  stomachAcidTimer: number
) {
  // Light pinkish/cream esophagus background
  ctx.fillStyle = '#fff5f5';
  ctx.fillRect(0, 0, w, h);

  // If stomach acid is NOT active: Show full length of Esophagus
  // If stomach acid IS active: Right portion is flooded by surging stomach acid!
  const esophW = stomachAcidActive ? w * 0.45 : w;

  // Esophageal muscular tube
  ctx.fillStyle = '#fbcfe8';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;

  const lumenH = h * 0.48;
  const lumenY = (h - lumenH) * 0.5;

  // Upper and lower muscular walls
  ctx.fillRect(0, 0, esophW, lumenY);
  ctx.strokeRect(-2, -2, esophW + 4, lumenY + 2);

  ctx.fillRect(0, lumenY + lumenH, esophW, h - (lumenY + lumenH));
  ctx.strokeRect(-2, lumenY + lumenH, esophW + 4, h - (lumenY + lumenH) + 4);

  // Esophageal lumen lining folds
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 2;
  for (let f = 0; f < 5; f++) {
    const fy = lumenY + 20 + f * ((lumenH - 40) / 4);
    ctx.beginPath();
    ctx.moveTo(0, fy);
    for (let fx = 0; fx < esophW; fx += 30) {
      ctx.lineTo(fx, fy + Math.sin(fx * 0.1 + time * 3) * 4);
    }
    ctx.stroke();
  }

  // Label for Esophagus
  ctx.font = "900 13px 'Archivo Black', sans-serif";
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.fillText('EZOFAGU (GYP MUSKULOR)', 25, lumenY - 15);

  // REQUIREMENT 2: STOMACH ACID FLOOD ("PËRMBYTJE ACIDI")
  if (stomachAcidActive) {
    const stomW = w - esophW;
    const stomX = esophW;

    // Surging acid flood height based on timer (enters, peaks, then drains)
    const floodProgress = Math.sin(Math.min(1, stomachAcidTimer / 4.5) * Math.PI);
    const floodY = h - h * 0.85 * Math.max(0.2, floodProgress);

    // Stomach Cavity chamber (Right side)
    ctx.save();
    ctx.fillStyle = '#fef08a';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3.5;
    ctx.fillRect(stomX, 0, stomW, h);
    ctx.strokeRect(stomX, 0, stomW, h);

    // Acid Flood Pool ("Përmbytje Acidi")
    const acidGrad = ctx.createLinearGradient(stomX, floodY, stomX, h);
    acidGrad.addColorStop(0, '#bef264');
    acidGrad.addColorStop(0.5, '#a3e635');
    acidGrad.addColorStop(1, '#65a30d');

    ctx.fillStyle = acidGrad;
    ctx.beginPath();
    ctx.moveTo(stomX, h);
    ctx.lineTo(stomX, floodY);
    for (let ax = stomX; ax <= w; ax += 15) {
      const wave = Math.sin(ax * 0.08 + time * 8) * 8;
      ctx.lineTo(ax, floodY + wave);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Effervescent rising corrosive bubbles
    for (let b = 0; b < 16; b++) {
      const bx = stomX + 25 + ((b * 47) % (stomW - 50));
      const by = h - 30 - ((time * 80 + b * 40) % (h - floodY));
      const bSize = 4 + (b % 4) * 3;
      ctx.fillStyle = '#fef9c3';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(bx + Math.sin(by * 0.06) * 4, by, bSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Neo-brutalist badge for acid flood
    ctx.fillStyle = '#000000';
    ctx.fillRect(stomX + 16, 20, 240, 32);
    ctx.fillStyle = '#bef264';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    ctx.fillRect(stomX + 14, 18, 240, 32);
    ctx.strokeRect(stomX + 14, 18, 240, 32);

    ctx.font = "900 12px 'Archivo Black', sans-serif";
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText('PËRMBYTJE E ACIDIT TË STOMAKUT!', stomX + 134, 38);
    ctx.restore();
  }
}
