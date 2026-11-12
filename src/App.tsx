/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Mbrojtja Imunitare - Main Application Component
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  createInitialGameState,
  EnvironmentId,
  GameState,
  ImmuneResponseId,
  PathogenType,
  routeFromFace,
  tickGameState,
  triggerImmuneResponse,
} from './game/rules';
import { Simulation } from './game/simulation';
import { soundEngine } from './game/audio';
import { LeftPanel } from './components/LeftPanel';
import { GameHUD } from './components/GameHUD';
import { GameCanvas } from './components/GameCanvas';
import { TitleModal } from './components/TitleModal';
import { GameOverModal } from './components/GameOverModal';
import { EducationalGuideModal } from './components/EducationalGuideModal';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const state = createInitialGameState();
    // Check ?autostart=1
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        state.phase = 'playing';
      }
    }
    return state;
  });

  const [isMuted, setIsMuted] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Sync dataset.state with document.body
  useEffect(() => {
    document.body.dataset.state = gameState.phase;
  }, [gameState.phase]);

  // Simulation instance created once
  const simulationRef = useRef<Simulation | null>(null);
  if (!simulationRef.current) {
    simulationRef.current = new Simulation({
      onRouteSelected: (route) => {
        handleSelectRoute(route);
      },
      onPathogenCountChanged: (count) => {
        setGameState((prev) => ({
          ...prev,
          pathogenCount: count,
        }));
      },
    });
  }
  const sim = simulationRef.current;

  // Initialize simulation environment
  useEffect(() => {
    sim.resetForEnvironment(gameState.environment, gameState.selectedPathogenType);
  }, []); // Only on mount

  // Main game tick loop (runs at 10 Hz for discrete state updates)
  useEffect(() => {
    if (gameState.phase !== 'playing') return;

    const interval = setInterval(() => {
      setGameState((prev) => {
        const { state: next, spawnNewPathogen, environmentChanged } = tickGameState(
          prev,
          0.1
        );

        // If environment changed (e.g. 20s elapsed -> bloodstream)
        if (environmentChanged) {
          sim.resetForEnvironment(next.environment, next.selectedPathogenType);
        }

        // If new pathogen spawned by multiplication
        if (spawnNewPathogen) {
          sim.spawnPathogen(next.selectedPathogenType);
        }

        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState.phase, sim]);

  // Keyboard shortcut listener (P for Pause, R for Restart, M for Mute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'p' || e.key === 'P') {
        handleTogglePause();
      } else if (e.key === 'r' || e.key === 'R') {
        handleRestart();
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.phase, isMuted]);

  // Handlers
  const handleStart = () => {
    setGameState((prev) => ({
      ...prev,
      phase: 'playing',
    }));
  };

  const handleTogglePause = () => {
    setGameState((prev) => {
      if (prev.phase === 'playing') {
        return { ...prev, phase: 'paused' };
      } else if (prev.phase === 'paused') {
        return { ...prev, phase: 'playing' };
      }
      return prev;
    });
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      return next;
    });
  };

  const handleRestart = () => {
    const fresh = createInitialGameState();
    fresh.phase = 'playing';
    setGameState(fresh);
    sim.resetForEnvironment(fresh.environment, fresh.selectedPathogenType);
  };

  const handleSelectAndSpawnPathogen = (type: PathogenType) => {
    sim.spawnPathogen(type);
    setGameState((prev) => ({
      ...prev,
      selectedPathogenType: type,
      pathogenCount: prev.pathogenCount + 1,
    }));
  };

  const handleSelectRoute = (route: 'nose' | 'mouth') => {
    setGameState((prev) => {
      const next = routeFromFace(prev, route);
      sim.resetForEnvironment(next.environment, next.selectedPathogenType);
      return next;
    });
  };

  const handleTriggerResponse = (responseId: ImmuneResponseId) => {
    setGameState((prev) => {
      const { state: next, success } = triggerImmuneResponse(prev, responseId);
      if (success) {
        sim.handleResponseVisuals(responseId, next);
        // If 3 consecutive attacks won the game, eliminate any remaining visuals in simulation
        if (next.phase === 'gameover' && next.outcome === 'victory') {
          sim.pathogens.forEach((p) => {
            p.status = 'damaged';
          });
        }
      }
      return next;
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Top HUD Bar */}
      <GameHUD
        state={gameState}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onTogglePause={handleTogglePause}
        onRestart={handleRestart}
        onOpenGuide={() => setShowGuide(true)}
      />

      {/* Main Gameplay Layout: Landscape with Left Panel (25%) on the left and Center Environment (75%) */}
      <div className="flex-1 flex flex-col lg:flex-row w-full h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Left Panel: Immune Defenses (Top) & Pathogens (Bottom) */}
        <LeftPanel
          state={gameState}
          onSelectAndSpawnPathogen={handleSelectAndSpawnPathogen}
          onTriggerResponse={handleTriggerResponse}
          onSelectRoute={handleSelectRoute}
        />

        {/* Center / Right Area: 2D Biological Environment Canvas + Educational Panel */}
        <GameCanvas
          state={gameState}
          simulation={sim}
          onResume={handleTogglePause}
        />
      </div>

      {/* Title Screen Modal */}
      {gameState.phase === 'title' && (
        <TitleModal
          onStart={handleStart}
          onOpenGuide={() => setShowGuide(true)}
        />
      )}

      {/* Game Over / Victory Modal */}
      {gameState.phase === 'gameover' && (
        <GameOverModal
          state={gameState}
          onRestart={handleRestart}
          onOpenGuide={() => setShowGuide(true)}
        />
      )}

      {/* Educational Biology Guide Modal */}
      {showGuide && (
        <EducationalGuideModal onClose={() => setShowGuide(false)} />
      )}
    </div>
  );
}
