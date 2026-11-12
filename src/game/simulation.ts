/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 2D Simulation Engine & Entity Manager
 */

import {
  EnvironmentId,
  GameState,
  ImmuneResponseId,
  PathogenType,
  PATHOGEN_CATALOG,
} from './rules';
import {
  drawBacteriumSprite,
  drawFungusSprite,
  drawParasiteSprite,
  drawRedBloodCell,
  drawVirusSprite,
  drawWhiteBloodCell,
  renderBloodstreamEnvironment,
  renderDigestiveEnvironment,
  renderFaceEnvironment,
  renderTracheaEnvironment,
} from './sprites';
import { soundEngine } from './audio';

export interface PathogenEntity {
  id: string;
  type: PathogenType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  rotationSpeed: number;
  status: 'normal' | 'trapped' | 'damaged' | 'expelled';
  opacity: number;
  swimTimer: number;
}

export interface RedCellEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  rotSpeed: number;
}

export interface WhiteCellEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetId: string | null;
  engulfTimer: number;
}

export interface ParticleEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export class Simulation {
  public width: number = 800;
  public height: number = 600;
  public time: number = 0;
  public pathogens: PathogenEntity[] = [];
  public redBloodCells: RedCellEntity[] = [];
  public whiteBloodCells: WhiteCellEntity[] = [];
  public particles: ParticleEntity[] = [];
  public hoverNose: boolean = false;
  public hoverMouth: boolean = false;
  public transitionAlpha: number = 0; // 0 = fully visible, 1 = black fade
  public isTransitioning: boolean = false;

  // Touchscreen & Smartboard Drag-and-Drop state
  public draggedPathogenId: string | null = null;
  public dragStartX: number = 0;
  public dragStartY: number = 0;
  public dragCurrentX: number = 0;
  public dragCurrentY: number = 0;
  public isDragging: boolean = false;

  private onRouteSelected?: (route: 'nose' | 'mouth') => void;
  private onPathogenCountChanged?: (count: number) => void;

  constructor(
    callbacks?: {
      onRouteSelected?: (route: 'nose' | 'mouth') => void;
      onPathogenCountChanged?: (count: number) => void;
    }
  ) {
    this.onRouteSelected = callbacks?.onRouteSelected;
    this.onPathogenCountChanged = callbacks?.onPathogenCountChanged;
    this.initBloodCells();
  }

  public setSize(w: number, h: number) {
    this.width = Math.max(300, w);
    this.height = Math.max(300, h);
    if (this.redBloodCells.length === 0) {
      this.initBloodCells();
    }
  }

  public resetForEnvironment(env: EnvironmentId, initialType: PathogenType = 'bacterium') {
    this.pathogens = [];
    this.particles = [];
    this.transitionAlpha = 0;
    this.isTransitioning = false;

    if (env === 'face') {
      // Spawn 1 or 2 drifting pathogens outside the face
      this.spawnPathogen(initialType, this.width * 0.75, this.height * 0.45);
    } else if (env === 'trachea') {
      // Pathogens entering through airway
      this.spawnPathogen(initialType, this.width * 0.7, this.height * 0.5);
    } else if (env === 'digestive') {
      // Pathogen in esophagus
      this.spawnPathogen(initialType, this.width * 0.2, this.height * 0.5);
    } else if (env === 'bloodstream') {
      // Pathogens in bloodstream
      this.spawnPathogen(initialType, this.width * 0.3, this.height * 0.4);
      this.spawnPathogen(initialType, this.width * 0.5, this.height * 0.6);
    }
    this.notifyPathogenCount();
  }

  public spawnPathogen(
    type: PathogenType,
    customX?: number,
    customY?: number
  ): PathogenEntity {
    const info = PATHOGEN_CATALOG[type];
    const x = customX ?? (this.width * 0.4 + Math.random() * this.width * 0.4);
    const y = customY ?? (this.height * 0.3 + Math.random() * this.height * 0.4);

    let radius = 18;
    if (type === 'virus') radius = 14;
    if (type === 'bacterium') radius = 30; // length
    if (type === 'fungus') radius = 20;
    if (type === 'parasite') radius = 24;

    const angle = Math.random() * Math.PI * 2;
    const speed = info.baseSpeed * (0.8 + Math.random() * 0.4);

    const p: PathogenEntity = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius,
      rotation: angle,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      status: 'normal',
      opacity: 1,
      swimTimer: Math.random() * 2,
    };

    this.pathogens.push(p);
    this.notifyPathogenCount();
    return p;
  }

  public spawnPathogenAt(type: PathogenType, targetX: number, targetY: number): PathogenEntity {
    const info = PATHOGEN_CATALOG[type];
    let radius = 18;
    if (type === 'virus') radius = 14;
    if (type === 'bacterium') radius = 30;
    if (type === 'fungus') radius = 20;
    if (type === 'parasite') radius = 24;

    const angle = Math.random() * Math.PI * 2;
    const speed = info.baseSpeed * (0.8 + Math.random() * 0.4);

    const clampedX = Math.max(radius + 15, Math.min(this.width - radius - 15, targetX));
    const clampedY = Math.max(radius + 15, Math.min(this.height - radius - 15, targetY));

    const p: PathogenEntity = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      x: clampedX,
      y: clampedY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius,
      rotation: angle,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      status: 'normal',
      opacity: 1,
      swimTimer: 0,
    };

    this.pathogens.push(p);
    this.notifyPathogenCount();
    soundEngine.playClick();
    return p;
  }

  private initBloodCells() {
    this.redBloodCells = [];
    this.whiteBloodCells = [];

    // Red blood cells
    for (let i = 0; i < 28; i++) {
      this.redBloodCells.push({
        x: Math.random() * this.width,
        y: 60 + Math.random() * (this.height - 120),
        vx: 1.2 + Math.random() * 2.0,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 12 + Math.random() * 4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 1.2,
      });
    }

    // Patrolling Macrophages
    for (let i = 0; i < 2; i++) {
      this.whiteBloodCells.push({
        x: 100 + i * 250,
        y: this.height * 0.5 + (i === 0 ? -60 : 60),
        vx: 0.5,
        vy: 0.2,
        radius: 28,
        targetId: null,
        engulfTimer: 0,
      });
    }
  }

  public handleResponseVisuals(responseId: ImmuneResponseId, state: GameState) {
    if (responseId === 'sneeze') {
      soundEngine.playSneeze();
      // Massive cloud of air/droplet particles rushing leftward
      for (let i = 0; i < 45; i++) {
        this.particles.push({
          x: this.width * 0.8,
          y: this.height * 0.5 + (Math.random() - 0.5) * 160,
          vx: -(12 + Math.random() * 18),
          vy: (Math.random() - 0.5) * 6,
          size: 3 + Math.random() * 4,
          color: '#e0f2fe',
          life: 0.8,
          maxLife: 0.8,
        });
      }
      // Forcefully expel pathogens
      this.pathogens.forEach((p) => {
        p.status = 'expelled';
        p.vx = -(14 + Math.random() * 8);
      });
    } else if (responseId === 'cough') {
      soundEngine.playCough();
      // Burst in throat
      for (let i = 0; i < 35; i++) {
        this.particles.push({
          x: this.width * 0.35,
          y: this.height * 0.5 + (Math.random() - 0.5) * 120,
          vx: -(10 + Math.random() * 15),
          vy: (Math.random() - 0.5) * 5,
          size: 3 + Math.random() * 4,
          color: '#fed7aa',
          life: 0.7,
          maxLife: 0.7,
        });
      }
      this.pathogens.forEach((p) => {
        p.status = 'expelled';
        p.vx = -12;
      });
    } else if (responseId === 'mucus') {
      soundEngine.playMucusStick();
      // Trapping viscous particles
      for (let i = 0; i < 20; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() > 0.5 ? 75 : this.height - 75,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: 5 + Math.random() * 5,
          color: 'rgba(94, 234, 212, 0.8)',
          life: 2.0,
          maxLife: 2.0,
        });
      }
      // Immobilize all current pathogens
      this.pathogens.forEach((p) => {
        p.status = 'trapped';
        p.vx *= 0.15;
        p.vy *= 0.15;
      });
    } else if (responseId === 'cilia') {
      soundEngine.playClick();
      // Wave moving leftward
      this.pathogens.forEach((p) => {
        if (p.status === 'trapped') {
          p.vx = -3.5;
        }
      });
    } else if (responseId === 'stomach_acid') {
      soundEngine.playAcidBubbles();
      // Intense bubbling in stomach
      const esophW = this.width * 0.42;
      for (let i = 0; i < 30; i++) {
        this.particles.push({
          x: esophW + Math.random() * (this.width - esophW),
          y: this.height * 0.6 + Math.random() * (this.height * 0.3),
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(2 + Math.random() * 4),
          size: 4 + Math.random() * 4,
          color: '#fef08a',
          life: 1.2,
          maxLife: 1.2,
        });
      }
    } else if (responseId === 'fever') {
      soundEngine.playFever();
      // Thermal radiation particles
      for (let i = 0; i < 30; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 2,
          vy: -(1 + Math.random() * 2),
          size: 3 + Math.random() * 4,
          color: 'rgba(239, 68, 68, 0.7)',
          life: 1.5,
          maxLife: 1.5,
        });
      }
    } else if (responseId === 'phagocytosis') {
      soundEngine.playPhagocytosis();
      if (this.whiteBloodCells.length > 0 && this.pathogens.length > 0) {
        const wbc = this.whiteBloodCells[0];
        const target = this.pathogens[0];
        wbc.targetId = target.id;
        wbc.engulfTimer = 1.0;
        target.status = 'damaged';
      }
    }
  }

  public update(dt: number, state: GameState) {
    this.time += dt;

    // Handle transition fade
    if (this.isTransitioning) {
      this.transitionAlpha = Math.min(1, this.transitionAlpha + dt * 2.5);
    } else {
      this.transitionAlpha = Math.max(0, this.transitionAlpha - dt * 2.0);
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update Red Blood Cells (flowing plasma)
    this.redBloodCells.forEach((rbc) => {
      rbc.x += rbc.vx;
      rbc.y += rbc.vy;
      rbc.rotation += rbc.rotSpeed * dt;
      if (rbc.x > this.width + 30) {
        rbc.x = -30;
        rbc.y = 60 + Math.random() * (this.height - 120);
      }
    });

    // Update White Blood Cells (Macrophages) ONLY in Bloodstream
    if (state.environment === 'bloodstream') {
      this.whiteBloodCells.forEach((wbc) => {
        // Find nearest pathogen if alive
        let target: PathogenEntity | undefined;
        if (this.pathogens.length > 0) {
          target = this.pathogens[0];
        }

        if (target) {
          const dx = target.x - wbc.x;
          const dy = target.y - wbc.y;
          const dist = Math.hypot(dx, dy);

          if (dist > 5) {
            wbc.vx = (dx / dist) * 1.4;
            wbc.vy = (dy / dist) * 1.4;
          }

          // Close enough for phagocytosis engulfment
          if (dist < target.radius + wbc.radius && target.status !== 'damaged') {
            target.status = 'damaged';
            soundEngine.playPhagocytosis();
            // Engulf burst
            for (let k = 0; k < 12; k++) {
              this.particles.push({
                x: target.x,
                y: target.y,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                size: 2.5,
                color: '#c084fc',
                life: 0.8,
                maxLife: 0.8,
              });
            }
          }
        } else {
          wbc.x += wbc.vx;
          wbc.y += wbc.vy;
          if (wbc.x < 50 || wbc.x > this.width - 50) wbc.vx *= -1;
          if (wbc.y < 80 || wbc.y > this.height - 80) wbc.vy *= -1;
        }
        wbc.x += wbc.vx;
        wbc.y += wbc.vy;
      });
    }

    // Update Pathogens
    for (let i = this.pathogens.length - 1; i >= 0; i--) {
      const p = this.pathogens[i];

      // If being dragged directly by finger / touch on smartboard
      if (this.isDragging && this.draggedPathogenId === p.id) {
        p.vx = (this.dragCurrentX - p.x) * 0.4;
        p.vy = (this.dragCurrentY - p.y) * 0.4;
        p.x = this.dragCurrentX;
        p.y = this.dragCurrentY;
        continue;
      }

      // If damaged or expelled, fade out
      if (p.status === 'damaged') {
        p.opacity -= dt * 1.5;
        p.radius = Math.max(2, p.radius - dt * 10);
        if (p.opacity <= 0) {
          this.pathogens.splice(i, 1);
          this.notifyPathogenCount();
          continue;
        }
      } else if (p.status === 'expelled') {
        p.x += p.vx;
        p.opacity -= dt * 1.2;
        if (p.x < -60 || p.opacity <= 0) {
          this.pathogens.splice(i, 1);
          this.notifyPathogenCount();
          continue;
        }
      } else if (p.status === 'trapped') {
        // Trapped in mucus or clot
        p.x += p.vx * 0.2;
        p.y += p.vy * 0.2;
      } else {
        // Normal movement
        p.swimTimer += dt;
        if (p.type === 'bacterium') {
          // Run and tumble
          if (p.swimTimer > 1.8) {
            p.swimTimer = 0;
            const newAngle = Math.random() * Math.PI * 2;
            const spd = PATHOGEN_CATALOG[p.type].baseSpeed;
            p.vx = Math.cos(newAngle) * spd;
            p.vy = Math.sin(newAngle) * spd;
            p.rotation = newAngle;
          }
        } else if (p.type === 'virus') {
          // Jittery Brownian motion
          p.x += (Math.random() - 0.5) * 1.5;
          p.y += (Math.random() - 0.5) * 1.5;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed * dt;

        // Environment-specific interactions:
        if (state.environment === 'digestive') {
          // Drifting down the esophagus
          p.x += 0.6;
          const esophW = this.width * 0.45;

          // REQUIREMENT 2: ONLY attack pathogen if stomach acid flood is active!
          if (state.stomachAcidActive && p.x > esophW * 0.7) {
            soundEngine.playAcidBubbles();
            // Spawn fizz particles
            for (let f = 0; f < 3; f++) {
              this.particles.push({
                x: p.x + (Math.random() - 0.5) * 10,
                y: p.y + (Math.random() - 0.5) * 10,
                vx: (Math.random() - 0.5) * 2,
                vy: -(1 + Math.random() * 3),
                size: 3.5,
                color: '#bef264',
                life: 0.6,
                maxLife: 0.6,
              });
            }
          }
        } else if (state.environment === 'trachea') {
          // Cilia pushing or mucus trapping
          if (state.mucusActive && (p.y < 95 || p.y > this.height - 95)) {
            p.status = 'trapped';
          }
        }

        // Boundary bounce
        if (p.x < 30) {
          p.x = 30;
          p.vx = Math.abs(p.vx);
        }
        if (p.x > this.width - 30) {
          p.x = this.width - 30;
          p.vx = -Math.abs(p.vx);
        }
        if (p.y < 40) {
          p.y = 40;
          p.vy = Math.abs(p.vy);
        }
        if (p.y > this.height - 40) {
          p.y = this.height - 40;
          p.vy = -Math.abs(p.vy);
        }
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, state: GameState) {
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Environmental Background
    switch (state.environment) {
      case 'face':
        renderFaceEnvironment(
          ctx,
          this.width,
          this.height,
          this.time,
          this.hoverNose,
          this.hoverMouth
        );
        break;

      case 'bloodstream':
        renderBloodstreamEnvironment(
          ctx,
          this.width,
          this.height,
          this.time,
          state.feverActive,
          state.temperatureCelsius
        );
        // Draw Red Blood Cells
        this.redBloodCells.forEach((rbc) => {
          drawRedBloodCell(ctx, rbc.x, rbc.y, rbc.radius, rbc.rotation);
        });

        // Draw White Blood Cells / Macrophages
        this.whiteBloodCells.forEach((wbc) => {
          const target = this.pathogens.find((p) => p.id === wbc.targetId);
          drawWhiteBloodCell(
            ctx,
            wbc.x,
            wbc.y,
            wbc.radius,
            this.time,
            target?.x,
            target?.y
          );
        });
        break;

      case 'trachea':
        renderTracheaEnvironment(
          ctx,
          this.width,
          this.height,
          this.time,
          state.mucusActive,
          state.ciliaActive
        );
        break;

      case 'digestive':
        renderDigestiveEnvironment(
          ctx,
          this.width,
          this.height,
          this.time,
          state.stomachAcidActive,
          state.stomachAcidTimer
        );
        break;
    }

    // 2. Draw Pathogens
    this.pathogens.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.opacity;

      switch (p.type) {
        case 'virus':
          drawVirusSprite(ctx, p.x, p.y, p.radius, this.time, p.status);
          break;
        case 'bacterium':
          drawBacteriumSprite(
            ctx,
            p.x,
            p.y,
            p.radius,
            this.time,
            p.rotation,
            p.status
          );
          break;
        case 'fungus':
          drawFungusSprite(ctx, p.x, p.y, p.radius, this.time, p.status);
          break;
        case 'parasite':
          drawParasiteSprite(ctx, p.x, p.y, p.radius, this.time, p.status);
          break;
      }
      ctx.restore();
    });

    // 3. Draw Dynamic Particles (sneeze/cough bursts, enzyme sparks, acid fizz)
    this.particles.forEach((part) => {
      ctx.save();
      ctx.fillStyle = part.color;
      ctx.globalAlpha = part.life / part.maxLife;
      ctx.beginPath();
      ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 4. Touch & Smartboard Dragging Visual Guides
    if (this.isDragging && this.draggedPathogenId) {
      const dragged = this.pathogens.find((p) => p.id === this.draggedPathogenId);
      if (dragged) {
        ctx.save();
        // Pulsing drag target ring
        const pulse = Math.sin(this.time * 8) * 3;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(dragged.x, dragged.y, dragged.radius + 14 + pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(dragged.x, dragged.y, dragged.radius + 14 + pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Neo-Brutalist badge above finger
        ctx.font = 'bold 11px "Archivo Black", sans-serif';
        const label = 'KONTROLLI ME GISHT';
        const tw = ctx.measureText(label).width;
        ctx.fillStyle = '#fde047';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.fillRect(dragged.x - tw / 2 - 8, dragged.y - dragged.radius - 28, tw + 16, 20);
        ctx.strokeRect(dragged.x - tw / 2 - 8, dragged.y - dragged.radius - 28, tw + 16, 20);
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, dragged.x, dragged.y - dragged.radius - 18);

        // In Face mode: show guide lines to Nose or Mouth
        if (state.environment === 'face') {
          const cx = this.width * 0.45;
          const cy = this.height * 0.5;
          const noseX = cx + 55;
          const noseY = cy + 45;
          const mouthX = cx + 45;
          const mouthY = cy + 95;

          const distNose = Math.hypot(dragged.x - noseX, dragged.y - noseY);
          const distMouth = Math.hypot(dragged.x - mouthX, dragged.y - mouthY);

          // Guide line to nearest entry
          if (distNose < 160) {
            ctx.strokeStyle = distNose < 65 ? '#0284c7' : '#94a3b8';
            ctx.lineWidth = distNose < 65 ? 4 : 2;
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.moveTo(dragged.x, dragged.y);
            ctx.lineTo(noseX, noseY);
            ctx.stroke();
            ctx.setLineDash([]);

            if (distNose < 65) {
              ctx.fillStyle = '#38bdf8';
              ctx.beginPath();
              ctx.arc(noseX, noseY, 32, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
            }
          }

          if (distMouth < 160) {
            ctx.strokeStyle = distMouth < 65 ? '#d97706' : '#94a3b8';
            ctx.lineWidth = distMouth < 65 ? 4 : 2;
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.moveTo(dragged.x, dragged.y);
            ctx.lineTo(mouthX, mouthY);
            ctx.stroke();
            ctx.setLineDash([]);

            if (distMouth < 65) {
              ctx.fillStyle = '#fbbf24';
              ctx.beginPath();
              ctx.arc(mouthX, mouthY, 32, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }
    }

    // 5. Draw Transition Fade Overlay
    if (this.transitionAlpha > 0) {
      ctx.fillStyle = `rgba(15, 23, 42, ${this.transitionAlpha})`;
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  public handlePointerDown(clientX: number, clientY: number, rect: DOMRect, state: GameState) {
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    this.dragCurrentX = x;
    this.dragCurrentY = y;

    // 1. Check if user touched an existing pathogen (generous smartboard hit radius >= 42px)
    let touchedPathogen: PathogenEntity | null = null;
    for (let i = this.pathogens.length - 1; i >= 0; i--) {
      const p = this.pathogens[i];
      const dist = Math.hypot(x - p.x, y - p.y);
      if (dist <= Math.max(42, p.radius + 18)) {
        touchedPathogen = p;
        break;
      }
    }

    if (touchedPathogen) {
      this.isDragging = true;
      this.draggedPathogenId = touchedPathogen.id;
      this.dragStartX = x;
      this.dragStartY = y;
      soundEngine.playClick();
      return;
    }

    // 2. If in Face environment, check direct tap on Nose or Mouth (smartboard hit target radius 50px)
    if (state.environment === 'face') {
      const cx = this.width * 0.45;
      const cy = this.height * 0.5;

      const noseX = cx + 55;
      const noseY = cy + 45;
      const mouthX = cx + 45;
      const mouthY = cy + 95;

      if (Math.hypot(x - noseX, y - noseY) < 50) {
        soundEngine.playClick();
        this.triggerRouteTransition('nose');
      } else if (Math.hypot(x - mouthX, y - mouthY) < 50) {
        soundEngine.playClick();
        this.triggerRouteTransition('mouth');
      }
    }
  }

  public handlePointerMove(clientX: number, clientY: number, rect: DOMRect) {
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    this.dragCurrentX = Math.max(15, Math.min(this.width - 15, x));
    this.dragCurrentY = Math.max(15, Math.min(this.height - 15, y));

    const cx = this.width * 0.45;
    const cy = this.height * 0.5;

    const noseX = cx + 55;
    const noseY = cy + 45;
    const mouthX = cx + 45;
    const mouthY = cy + 95;

    this.hoverNose = Math.hypot(x - noseX, y - noseY) < 45;
    this.hoverMouth = Math.hypot(x - mouthX, y - mouthY) < 45;
  }

  public handlePointerUp(clientX: number, clientY: number, rect: DOMRect, state: GameState) {
    if (this.isDragging && this.draggedPathogenId) {
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (state.environment === 'face') {
        const cx = this.width * 0.45;
        const cy = this.height * 0.5;

        const noseX = cx + 55;
        const noseY = cy + 45;
        const mouthX = cx + 45;
        const mouthY = cy + 95;

        // Smartboard drop zone radius (65px)
        if (Math.hypot(x - noseX, y - noseY) < 65) {
          soundEngine.playClick();
          this.triggerRouteTransition('nose');
        } else if (Math.hypot(x - mouthX, y - mouthY) < 65) {
          soundEngine.playClick();
          this.triggerRouteTransition('mouth');
        }
      }

      this.isDragging = false;
      this.draggedPathogenId = null;
    }
  }

  public handlePointerCancel() {
    this.isDragging = false;
    this.draggedPathogenId = null;
  }

  public triggerRouteTransition(route: 'nose' | 'mouth') {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    soundEngine.playClick();

    // Animate pathogen flying into entry point
    const cx = this.width * 0.45;
    const cy = this.height * 0.5;
    const targetX = route === 'nose' ? cx + 55 : cx + 45;
    const targetY = route === 'nose' ? cy + 45 : cy + 95;

    this.pathogens.forEach((p) => {
      p.vx = (targetX - p.x) * 0.08;
      p.vy = (targetY - p.y) * 0.08;
    });

    setTimeout(() => {
      this.isTransitioning = false;
      this.onRouteSelected?.(route);
    }, 450);
  }

  private notifyPathogenCount() {
    this.onPathogenCountChanged?.(this.pathogens.length);
  }
}
