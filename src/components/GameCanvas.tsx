/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GameCanvas Component: 2D Canvas viewport + EducationalPanel
 */

import React, { useEffect, useRef } from 'react';
import { GameState, ImmuneResponseId } from '../game/rules';
import { Simulation } from '../game/simulation';
import { EducationalPanel } from './EducationalPanel';
import { Pause, Play } from 'lucide-react';
import { soundEngine } from '../game/audio';

interface GameCanvasProps {
  state: GameState;
  simulation: Simulation;
  onResume: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  state,
  simulation,
  onResume,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
      simulation.setSize(w, h);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const loop = (currentTime: number) => {
      const rawDt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      const dt = Math.min(rawDt, 0.05);

      const currentState = stateRef.current;
      if (currentState.phase === 'playing') {
        simulation.update(dt, currentState);
      }

      simulation.render(ctx, currentState);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [simulation]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    simulation.handlePointerMove(e.clientX, e.clientY, rect);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture unavailable
    }
    const rect = canvas.getBoundingClientRect();
    simulation.handlePointerDown(e.clientX, e.clientY, rect, stateRef.current);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      if (canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
    const rect = canvas.getBoundingClientRect();
    simulation.handlePointerUp(e.clientX, e.clientY, rect, stateRef.current);
  };

  const handlePointerCancel = () => {
    simulation.handlePointerCancel();
  };

  // Drag-and-drop support from LeftPanel
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pathogenType = e.dataTransfer.getData('text/plain') as any;
    if (pathogenType && ['virus', 'bacterium', 'fungus', 'parasite'].includes(pathogenType)) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const dropX = e.clientX - rect.left;
        const dropY = e.clientY - rect.top;
        simulation.spawnPathogenAt(pathogenType, dropX, dropY);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="relative flex-1 w-full h-full overflow-hidden bg-[#fef9ef] flex items-center justify-center select-none"
    >
      {/* Educational Information Panel positioned at the top-left of the game environment */}
      <EducationalPanel
        environment={state.environment}
        messageSq={state.educationalMessageSq}
        initialTimer={state.initialDefenseTimer}
        bloodstreamTimer={state.bloodstreamTimer}
        feverActive={state.feverActive}
        temperature={state.temperatureCelsius}
        smartboardMode={state.smartboardMode}
      />

      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="w-full h-full block cursor-crosshair touch-none select-none"
      />

      {/* Pause Overlay - Neo-Brutalist Light Theme */}
      {state.phase === 'paused' && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-30 p-4">
          <div className="bg-[#fef9ef] border-3 border-black p-6 text-center shadow-[6px_6px_0px_#000] max-w-sm w-full">
            <div className="w-14 h-14 bg-amber-300 border-2 border-black flex items-center justify-center mx-auto mb-3 shadow-[3px_3px_0px_#000]">
              <Pause className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-xl font-['Archivo_Black'] text-black mb-1 uppercase">
              Simulimi në Pauzë
            </h3>
            <p className="text-xs font-semibold text-slate-700 mb-5">
              Shtypni butonin më poshtë ose tastin [P] për të vazhduar.
            </p>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onResume();
              }}
              className="w-full py-3.5 px-4 bg-emerald-400 hover:bg-emerald-300 border-2 border-black shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-black font-['Archivo_Black'] text-sm uppercase flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Play className="w-5 h-5 fill-black text-black" />
              Vazhdo Simulimin
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
