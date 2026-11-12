/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Neo-Brutalist Light-Theme Educational Information Panel
 * - Archivo Black headings
 * - Exactly 15px font size
 * - Very compact ("goxha e vogël")
 * - Dismissible via an 'X' button
 * - Hard black borders and offset shadow
 */

import React, { useState, useEffect } from 'react';
import { EnvironmentId } from '../game/rules';
import { Activity, X, Info } from 'lucide-react';
import { soundEngine } from '../game/audio';

interface EducationalPanelProps {
  environment: EnvironmentId;
  messageSq: string;
  initialTimer: number;
  bloodstreamTimer: number;
  feverActive: boolean;
  temperature: number;
  smartboardMode?: boolean;
}

const ENV_LABELS_SQ: Record<EnvironmentId, string> = {
  face: 'Lëkura e Fytyrës',
  trachea: 'Trakea & Rrugët e Frymëmarrjes',
  digestive: 'Ezofagu & Lukthi',
  bloodstream: 'Qarkullimi i Gjakut',
};

export const EducationalPanel: React.FC<EducationalPanelProps> = ({
  environment,
  messageSq,
  initialTimer,
  bloodstreamTimer,
  feverActive,
  temperature,
  smartboardMode = false,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setIsDismissed(false);
  }, [messageSq, environment]);

  if (isDismissed) {
    return (
      <div className="absolute top-3 left-3 z-20 pointer-events-auto">
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setIsDismissed(false);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-yellow-300 hover:bg-yellow-400 border-2 border-black shadow-[3px_3px_0px_#000] text-black text-xs font-['Archivo_Black'] uppercase active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          title="Shfaq shpjegimin biologjik"
        >
          <Info className="w-4 h-4 text-black" />
          <span>Info Biologjike</span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-3 left-3 z-20 max-w-xs sm:max-w-sm pointer-events-auto transition-all duration-150">
      <div className="bg-white border-3 border-black shadow-[4px_4px_0px_#000] p-2.5 text-black">
        <div className="flex items-center justify-between gap-1.5 mb-1.5 border-b-2 border-black pb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <Activity className="w-4 h-4 text-black shrink-0" />
            <span className="text-[11px] uppercase font-['Archivo_Black'] text-black truncate">
              {ENV_LABELS_SQ[environment]}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {environment === 'bloodstream' && (
              <span
                className={`text-[10px] px-1.5 py-0.5 border border-black font-['Archivo_Black'] ${
                  feverActive ? 'bg-red-300 text-black' : 'bg-slate-100 text-black'
                }`}
              >
                {temperature.toFixed(1)}°C
              </span>
            )}
            {(environment === 'trachea' || environment === 'digestive') && (
              <span className="text-[10px] px-1.5 py-0.5 border border-black font-['Archivo_Black'] bg-amber-300 text-black">
                {Math.ceil(initialTimer)}s
              </span>
            )}

            {/* X Dismiss button */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setIsDismissed(true);
              }}
              className="p-1 bg-red-400 hover:bg-red-500 border border-black text-black active:scale-95 transition-all cursor-pointer"
              aria-label="Mbyll shpjegimin"
              title="Mbyll shpjegimin"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Font size is strictly 15px as required */}
        <p
          className="text-slate-900 font-semibold leading-snug"
          style={{ fontSize: '15px' }}
        >
          {messageSq}
        </p>
      </div>
    </div>
  );
};
