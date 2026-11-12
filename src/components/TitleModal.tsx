/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Neo-Brutalist Light-Theme Title Modal
 */

import React, { useEffect } from 'react';
import { Shield, Play, BookOpen } from 'lucide-react';
import { soundEngine } from '../game/audio';

interface TitleModalProps {
  onStart: () => void;
  onOpenGuide: () => void;
}

export const TitleModal: React.FC<TitleModalProps> = ({
  onStart,
  onOpenGuide,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#fef9ef] border-4 border-black shadow-[8px_8px_0px_#000] p-6 sm:p-8 text-center relative overflow-hidden text-black">
        {/* Emblem */}
        <div className="mx-auto w-16 h-16 bg-yellow-300 border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center text-black mb-4">
          <Shield className="w-9 h-9 stroke-[2.5]" />
        </div>

        {/* Title Lockup in Albanian */}
        <h1 className="text-2xl sm:text-3xl font-['Archivo_Black'] text-black tracking-wide uppercase mb-2">
          MBROJTJA IMUNITARE
        </h1>
        <p className="text-xs sm:text-sm font-['Archivo_Black'] uppercase text-emerald-700 mb-4 bg-emerald-100 border-2 border-black inline-block px-3 py-1 shadow-[2px_2px_0px_#000]">
          SIMULIM EDUKATIV 2D I MBROJTJES SË LINDUR
        </p>

        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed max-w-md mx-auto mb-5 font-semibold">
          Zbuloni mekanizmat e lindur mbrojtës të trupit: barrierat fizike, reflekset mekanike (qerpikët, teshtima, kolli), përmbytjen e acidit të stomakut, ethet dhe fagocitozën.
        </p>

        {/* Quick Highlights */}
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto mb-6 text-left">
          <div className="bg-white border-2 border-black p-2 shadow-[2px_2px_0px_#000]">
            <div className="text-[11px] font-['Archivo_Black'] text-black uppercase">
              4 Mjedise
            </div>
            <div className="text-[10px] text-slate-700 font-bold">
              Fytyra, Trakea, Ezofagu, Gjaku
            </div>
          </div>
          <div className="bg-white border-2 border-black p-2 shadow-[2px_2px_0px_#000]">
            <div className="text-[11px] font-['Archivo_Black'] text-black uppercase">
              4 Patogjenë
            </div>
            <div className="text-[10px] text-slate-700 font-bold">
              Virus, Bakter, Kërpudhë, Parazit
            </div>
          </div>
          <div className="bg-white border-2 border-black p-2 shadow-[2px_2px_0px_#000]">
            <div className="text-[11px] font-['Archivo_Black'] text-black uppercase">
              7 Mbrojtje
            </div>
            <div className="text-[10px] text-slate-700 font-bold">
              Mukus, Cili, Lukth, Fagocitozë...
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            data-start="true"
            onClick={() => {
              soundEngine.playClick();
              onStart();
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-['Archivo_Black'] uppercase text-sm border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-black stroke-black" />
            Fillo Simulimin
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onOpenGuide();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-yellow-300 hover:bg-yellow-200 text-black font-['Archivo_Black'] uppercase text-sm border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-black" />
            Teoria e Imunitetit
          </button>
        </div>

        <div className="mt-4 text-[11px] font-bold text-slate-600 uppercase">
          Shtypni [Hapësirë] ose [Enter] për të filluar
        </div>
      </div>
    </div>
  );
};
