/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Neo-Brutalist Light-Theme Victory / Defeat Modal
 */

import React, { useEffect } from 'react';
import { GameState } from '../game/rules';
import { Trophy, AlertTriangle, RotateCcw, BookOpen, CheckCircle } from 'lucide-react';
import { soundEngine } from '../game/audio';

interface GameOverModalProps {
  state: GameState;
  onRestart: () => void;
  onOpenGuide: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  state,
  onRestart,
  onOpenGuide,
}) => {
  const isVictory = state.outcome === 'victory';

  useEffect(() => {
    if (isVictory) {
      soundEngine.playVictory();
    } else {
      soundEngine.playDefeat();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVictory, onRestart]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#fef9ef] border-4 border-black shadow-[8px_8px_0px_#000] p-6 sm:p-8 text-center relative overflow-hidden text-black">
        {/* Emblem */}
        <div
          className={`mx-auto w-16 h-16 border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mb-4 ${
            isVictory ? 'bg-emerald-300 text-black' : 'bg-red-400 text-black'
          }`}
        >
          {isVictory ? (
            <Trophy className="w-9 h-9 stroke-[2.5]" />
          ) : (
            <AlertTriangle className="w-9 h-9 stroke-[2.5]" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-['Archivo_Black'] text-black tracking-wide uppercase mb-1">
          {isVictory ? 'FITORE MBROJTËSE!' : 'INFEKSIONI U PËRHAP!'}
        </h2>

        <p className="text-xs sm:text-sm font-['Archivo_Black'] uppercase text-slate-700 mb-4">
          {isVictory
            ? 'Mekanizmat e lindur mbrojtës parandaluan infektimin me sukses.'
            : 'Patogjenët depërtuan barrierat dhe u shumëzuan në organizëm.'}
        </p>

        {/* Biological Explanation Box */}
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_#000] p-3.5 text-left mb-5">
          <div className="text-xs font-['Archivo_Black'] text-black uppercase mb-1 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Përmbledhje Biologjike:
          </div>
          <p className="text-xs font-medium text-slate-900 leading-relaxed">
            {state.educationalMessageSq}
          </p>
        </div>

        {/* Run Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-white border-2 border-black p-2 shadow-[2px_2px_0px_#000]">
            <div className="text-[10px] text-black uppercase font-['Archivo_Black']">
              Të Eleminuar
            </div>
            <div className="text-xl font-['Archivo_Black'] text-black mt-0.5">
              {state.eliminatedCount}
            </div>
          </div>
          <div className="bg-white border-2 border-black p-2 shadow-[2px_2px_0px_#000]">
            <div className="text-[10px] text-black uppercase font-['Archivo_Black']">
              Pikët
            </div>
            <div className="text-xl font-['Archivo_Black'] text-emerald-600 mt-0.5">
              {state.score}
            </div>
          </div>
          <div className="bg-white border-2 border-black p-2 shadow-[2px_2px_0px_#000]">
            <div className="text-[10px] text-black uppercase font-['Archivo_Black']">
              Mjedisi
            </div>
            <div className="text-xs font-['Archivo_Black'] text-black mt-1 truncate uppercase">
              {state.environment === 'face'
                ? 'Lëkura'
                : state.environment === 'trachea'
                ? 'Trakea'
                : state.environment === 'digestive'
                ? 'Ezofagu'
                : 'Gjaku'}
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            data-start="true"
            onClick={() => {
              soundEngine.playClick();
              onRestart();
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-yellow-300 hover:bg-yellow-400 text-black font-['Archivo_Black'] uppercase text-sm border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            Luaj Përsëri
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onOpenGuide();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-100 text-black font-['Archivo_Black'] uppercase text-sm border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-black" />
            Teoria
          </button>
        </div>
      </div>
    </div>
  );
};
