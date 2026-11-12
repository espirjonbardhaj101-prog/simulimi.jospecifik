/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Neo-Brutalist Light-Theme Game HUD
 */

import React from 'react';
import { EnvironmentId, GameState } from '../game/rules';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Pause,
  Play,
  BookOpen,
} from 'lucide-react';
import { soundEngine } from '../game/audio';

interface GameHUDProps {
  state: GameState;
  isMuted: boolean;
  onToggleMute: () => void;
  onTogglePause: () => void;
  onRestart: () => void;
  onOpenGuide: () => void;
}

const ENV_TITLES_SQ: Record<EnvironmentId, string> = {
  face: '1. LËKURA E FYTYRËS',
  trachea: '2. TRAKEA DHE RRUGËT E FRYMËMARRJES',
  digestive: '3. EZOFAGU DHE SISTEMI TRETËS',
  bloodstream: '4. QARKULLIMI I GJAKUT NË INDE',
};

export const GameHUD: React.FC<GameHUDProps> = ({
  state,
  isMuted,
  onToggleMute,
  onTogglePause,
  onRestart,
  onOpenGuide,
}) => {
  return (
    <header className="h-14 bg-white border-b-3 border-black px-4 flex items-center justify-between z-20 shrink-0 select-none shadow-[0px_3px_0px_#000]">
      {/* Current Environment Badge */}
      <div className="flex items-center gap-2">
        <span className="w-3.5 h-3.5 bg-yellow-400 border-2 border-black shadow-[1px_1px_0px_#000]" />
        <span className="text-xs sm:text-sm font-['Archivo_Black'] text-black tracking-wide uppercase">
          {ENV_TITLES_SQ[state.environment]}
        </span>
      </div>

      {/* Center Status Indicators */}
      <div className="flex items-center gap-3">
        {/* Pathogen Count */}
        <div className="flex items-center gap-1.5 bg-red-100 border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000]">
          <span className="text-[11px] font-['Archivo_Black'] text-black uppercase">PATOGJENË:</span>
          <span className="text-sm font-['Archivo_Black'] text-red-600">
            {state.pathogenCount}
          </span>
        </div>

        {/* Dynamic Timer */}
        {state.environment !== 'face' && (
          <div className="hidden sm:flex items-center gap-1.5 bg-amber-100 border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000]">
            <span className="text-[11px] font-['Archivo_Black'] text-black uppercase">
              {state.environment === 'bloodstream'
                ? 'MBIJETESA:'
                : 'DEPËRTIMI:'}
            </span>
            <span className="text-sm font-['Archivo_Black'] text-black">
              {Math.ceil(
                state.environment === 'bloodstream'
                  ? state.bloodstreamTimer
                  : state.initialDefenseTimer
              )}
              s
            </span>
          </div>
        )}

        {/* Score */}
        <div className="hidden md:flex items-center gap-1.5 bg-emerald-100 border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000]">
          <span className="text-[11px] font-['Archivo_Black'] text-black uppercase">PIKË:</span>
          <span className="text-sm font-['Archivo_Black'] text-emerald-700">
            {state.score}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        {/* Biology Encyclopedia Guide */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onOpenGuide();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-yellow-300 hover:bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-black text-xs font-['Archivo_Black'] uppercase transition-all cursor-pointer"
          title="Udhëzuesi Edukativ i Imunitetit të Lindur"
        >
          <BookOpen className="w-4 h-4 text-black" />
          <span className="hidden lg:inline">Teoria</span>
        </button>

        {/* Sound Toggle */}
        <button
          type="button"
          onClick={() => {
            onToggleMute();
            soundEngine.playClick();
          }}
          className="p-1.5 bg-white hover:bg-slate-100 border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-black transition-all cursor-pointer"
          aria-label={isMuted ? 'Aktivizo zërin' : 'Çaktivizo zërin'}
          title={isMuted ? 'Aktivizo zërin' : 'Çaktivizo zërin'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-red-600" />
          ) : (
            <Volume2 className="w-4 h-4 text-black" />
          )}
        </button>

        {/* Pause Toggle */}
        {state.phase !== 'title' && state.phase !== 'gameover' && (
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onTogglePause();
            }}
            className="p-1.5 bg-white hover:bg-slate-100 border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-black transition-all cursor-pointer"
            aria-label={state.phase === 'paused' ? 'Vazhdo lojën' : 'Pusho lojën'}
            title={state.phase === 'paused' ? 'Vazhdo lojën' : 'Pusho lojën'}
          >
            {state.phase === 'paused' ? (
              <Play className="w-4 h-4 text-emerald-600" />
            ) : (
              <Pause className="w-4 h-4 text-amber-600" />
            )}
          </button>
        )}

        {/* Restart Button */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onRestart();
          }}
          className="p-1.5 bg-white hover:bg-slate-100 border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-black transition-all cursor-pointer"
          aria-label="Rinis simulimin"
          title="Rinis simulimin"
        >
          <RotateCcw className="w-4 h-4 text-black" />
        </button>
      </div>
    </header>
  );
};
