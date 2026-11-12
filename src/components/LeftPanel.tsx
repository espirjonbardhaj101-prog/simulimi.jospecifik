/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Neo-Brutalist Light-Theme Left Panel
 * 1. Immune responses at the TOP with compact direct buttons
 * 2. Pathogens at the BOTTOM with small buttons that spawn on click
 * 3. Paraziti name support
 * 4. Archivo Black & Neo-Brutalist styling (thick black borders & hard drop shadows)
 */

import React from 'react';
import {
  GameState,
  ImmuneResponseId,
  IMMUNE_RESPONSES,
  PathogenType,
  PATHOGEN_CATALOG,
} from '../game/rules';
import {
  Wind,
  Droplets,
  Flame,
  Zap,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { soundEngine } from '../game/audio';

interface LeftPanelProps {
  state: GameState;
  onSelectAndSpawnPathogen: (type: PathogenType) => void;
  onTriggerResponse: (responseId: ImmuneResponseId) => void;
  onSelectRoute: (route: 'nose' | 'mouth') => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  state,
  onSelectAndSpawnPathogen,
  onTriggerResponse,
  onSelectRoute,
}) => {
  // Mini pathogen visual badge with Neo-Brutalist black borders
  const renderPathogenBadge = (type: PathogenType) => {
    switch (type) {
      case 'virus':
        return (
          <div className="w-5 h-5 rounded-full bg-red-400 border-2 border-black flex items-center justify-center shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
          </div>
        );
      case 'bacterium':
        return (
          <div className="w-5 h-5 rounded-md bg-emerald-400 border-2 border-black flex items-center justify-center shrink-0">
            <span className="w-2.5 h-1 rounded-sm bg-black" />
          </div>
        );
      case 'fungus':
        return (
          <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-black flex items-center justify-center shrink-0">
            <span className="w-2 h-2 rounded-full bg-amber-100 border border-black" />
          </div>
        );
      case 'parasite':
        return (
          <div className="w-5 h-5 rounded-md bg-purple-400 rotate-12 border-2 border-black flex items-center justify-center shrink-0">
            <span className="w-1.5 h-1.5 rounded-sm bg-black" />
          </div>
        );
    }
  };

  // Response icon
  const getResponseIcon = (id: ImmuneResponseId) => {
    switch (id) {
      case 'mucus':
        return <Droplets className="w-4 h-4 text-teal-800" />;
      case 'cilia':
        return <Activity className="w-4 h-4 text-emerald-800" />;
      case 'sneeze':
        return <Wind className="w-4 h-4 text-cyan-800" />;
      case 'cough':
        return <Wind className="w-4 h-4 text-orange-800" />;
      case 'stomach_acid':
        return <Flame className="w-4 h-4 text-lime-800" />;
      case 'fever':
        return <Flame className="w-4 h-4 text-red-800" />;
      case 'phagocytosis':
        return <Zap className="w-4 h-4 text-purple-800" />;
    }
  };

  // Filter immune responses strictly available in current environment (total 7 across environments)
  const availableResponses = (
    Object.keys(IMMUNE_RESPONSES) as ImmuneResponseId[]
  ).filter((key) => IMMUNE_RESPONSES[key].environment === state.environment);

  return (
    <aside className="w-full lg:w-[26%] xl:w-[22%] h-full bg-[#fef9ef] border-r-3 border-black flex flex-col overflow-y-auto shrink-0 select-none shadow-[4px_0px_0px_#000] z-30 p-3 space-y-4 text-black">
      {/* SECTION 1: MBROJTJA IMUNITARE (AT TOP!) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-emerald-400 border border-black" />
            <h2 className="text-xs uppercase font-['Archivo_Black'] tracking-wide text-black">
              MBROJTJA IMUNITARE
            </h2>
          </div>
          {state.consecutiveAttacks > 0 && (
            <span className="text-[10px] font-['Archivo_Black'] px-1.5 py-0.5 bg-yellow-300 border-2 border-black shadow-[1px_1px_0px_#000]">
              SULME: {state.consecutiveAttacks}/3
            </span>
          )}
        </div>

        {/* In Face environment: direct route entry buttons */}
        {state.environment === 'face' && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onSelectRoute('nose');
              }}
              className="w-full flex items-center justify-between p-2.5 bg-sky-200 hover:bg-sky-300 border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-xs font-['Archivo_Black'] uppercase transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-sky-500 border border-black" />
                <span>Hyrja nga Hunda</span>
              </div>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onSelectRoute('mouth');
              }}
              className="w-full flex items-center justify-between p-2.5 bg-amber-200 hover:bg-amber-300 border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-xs font-['Archivo_Black'] uppercase transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-amber-500 border border-black" />
                <span>Hyrja nga Goja</span>
              </div>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        )}

        {/* Dynamic environment responses: compact Neo-Brutalist buttons */}
        {state.environment !== 'face' && (
          <div className="space-y-2">
            {availableResponses.map((resId) => {
              const config = IMMUNE_RESPONSES[resId];
              const cd = state.cooldowns[resId] || 0;
              const isReady = cd <= 0;

              return (
                <button
                  key={resId}
                  type="button"
                  disabled={!isReady}
                  onClick={() => onTriggerResponse(resId)}
                  className={`w-full flex items-center justify-between p-2.5 border-2 border-black text-xs font-['Archivo_Black'] uppercase transition-all cursor-pointer ${
                    isReady
                      ? 'bg-white hover:bg-emerald-200 text-black shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
                      : 'bg-slate-200 text-slate-500 border-dashed border-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {getResponseIcon(resId)}
                    <span className="truncate">{config.nameSq}</span>
                  </div>

                  <span className="text-[10px] font-['Archivo_Black'] shrink-0 ml-1">
                    {isReady ? (
                      <span className="px-1.5 py-0.5 bg-emerald-400 border border-black text-black">
                        AKTIVIZO
                      </span>
                    ) : (
                      <span className="text-slate-600 font-mono font-bold">
                        {cd.toFixed(1)}s
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: PATOGJENËT (BELOW MBROJTJA IMUNITARE) */}
      <div className="border-t-2 border-black pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-red-400 border border-black" />
            <h2 className="text-xs uppercase font-['Archivo_Black'] tracking-wide text-black">
              PATOGJENËT
            </h2>
          </div>
          <span className="text-[10px] font-['Archivo_Black'] px-1.5 py-0.5 bg-red-200 border border-black">
            AKTIVË: {state.pathogenCount}
          </span>
        </div>

        {/* Compact Grid: Clicking adds that pathogen directly into the environment */}
        <div className="grid grid-cols-2 gap-2">
          {(['virus', 'bacterium', 'fungus', 'parasite'] as PathogenType[]).map(
            (pType) => {
              const info = PATHOGEN_CATALOG[pType];
              const isSelected = state.selectedPathogenType === pType;
              return (
                <button
                  key={pType}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    onSelectAndSpawnPathogen(pType);
                  }}
                  className={`flex items-center gap-1.5 p-2 border-2 border-black text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-yellow-200 shadow-[3px_3px_0px_#000]'
                      : 'bg-white hover:bg-slate-100 shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
                  }`}
                  title={`Kliko për të shtuar ${info.nameSq} në mjedis`}
                >
                  {renderPathogenBadge(pType)}
                  <span className="text-xs font-['Archivo_Black'] text-black truncate uppercase">
                    {info.nameSq}
                  </span>
                </button>
              );
            }
          )}
        </div>

        <div className="mt-2 text-[10px] font-bold text-slate-600 text-center uppercase tracking-tight">
          + Kliko patogjenin për ta shtuar
        </div>
      </div>
    </aside>
  );
};
