/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Neo-Brutalist Light-Theme Educational Guide Modal
 */

import React from 'react';
import {
  BookOpen,
  X,
  Shield,
  Droplets,
  Flame,
  Wind,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { soundEngine } from '../game/audio';

interface EducationalGuideModalProps {
  onClose: () => void;
}

export const EducationalGuideModal: React.FC<EducationalGuideModalProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[90vh] bg-[#fef9ef] border-4 border-black shadow-[8px_8px_0px_#000] flex flex-col overflow-hidden text-black">
        {/* Modal Header */}
        <div className="p-4 border-b-3 border-black bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-yellow-300 border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-['Archivo_Black'] text-black uppercase">
                SISTEMI IMUNITAR I LINDUR (JO-SPECIFIK)
              </h2>
              <p className="text-xs font-bold text-slate-700 uppercase">
                Udhëzues Mësimor Biologjik me 7 Mbrojtje
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-1.5 bg-red-400 hover:bg-red-500 border-2 border-black shadow-[2px_2px_0px_#000] text-black active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            aria-label="Mbyll udhëzuesin"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-900 text-xs sm:text-sm leading-relaxed">
          {/* Section 1 */}
          <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0px_#000]">
            <h3 className="text-sm sm:text-base font-['Archivo_Black'] text-black mb-2 flex items-center gap-2 uppercase">
              <Shield className="w-5 h-5 text-black" />
              1. ÇFARË ËSHTË IMUNITETI I LINDUR?
            </h3>
            <p className="font-medium text-slate-800">
              Imuniteti i lindur është linja e parë dhe e menjëhershme mbrojtëse e organizmit të njeriut. Quhet <strong>"jo-specifik"</strong> sepse reagon njësoj dhe menjëherë ndaj çdo mikrobi të huaj (viruse, baktere, kërpudha, parazitë).
            </p>
          </div>

          {/* Section 2: 7 Mbrojtjet */}
          <div>
            <h3 className="text-sm sm:text-base font-['Archivo_Black'] text-black mb-3 uppercase">
              2. SHTATË (7) MBROJTJET IMUNITARE TË LINDURA
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* 1. Mukusi */}
              <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
                <div className="flex items-center gap-2 text-teal-800 font-['Archivo_Black'] text-xs mb-1 uppercase">
                  <Droplets className="w-4 h-4 text-black" />
                  1. Mukusi (Trake)
                </div>
                <p className="text-xs text-slate-800 font-medium">
                  Shtresë e trashë viskoze e prodhuar nga qelizat kupë që kap dhe ngujon mikroorganizmat.
                </p>
              </div>

              {/* 2. Qerpikët */}
              <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
                <div className="flex items-center gap-2 text-emerald-800 font-['Archivo_Black'] text-xs mb-1 uppercase">
                  <Activity className="w-4 h-4 text-black" />
                  2. Qerpikët Lëvizës (Trake)
                </div>
                <p className="text-xs text-slate-800 font-medium">
                  Qime mikroskopike që rrihen në mënyrë të sinkronizuar për të shtyrë mukusin me mikrobe lart drejt fytit.
                </p>
              </div>

              {/* 3. Teshtima */}
              <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
                <div className="flex items-center gap-2 text-cyan-800 font-['Archivo_Black'] text-xs mb-1 uppercase">
                  <Wind className="w-4 h-4 text-black" />
                  3. Teshtima (Trake & Hundë)
                </div>
                <p className="text-xs text-slate-800 font-medium">
                  Refleks shpërthyes i ajrit që dëbon me shpejtësi të madhe grimcat dhe patogjenët jashtë rrugëve të frymëmarrjes.
                </p>
              </div>

              {/* 4. Kollitja */}
              <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
                <div className="flex items-center gap-2 text-orange-800 font-['Archivo_Black'] text-xs mb-1 uppercase">
                  <Wind className="w-4 h-4 text-black" />
                  4. Kollitja (Fyt & Ezofag)
                </div>
                <p className="text-xs text-slate-800 font-medium">
                  Refleks i fuqishëm ajror i grykës që nxjerr trupat e huaj para se të kalojnë thellë në sistemin tretës.
                </p>
              </div>

              {/* 5. Acidi i Stomakut */}
              <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
                <div className="flex items-center gap-2 text-lime-800 font-['Archivo_Black'] text-xs mb-1 uppercase">
                  <Flame className="w-4 h-4 text-black" />
                  5. Acidi i Stomakut (Lukth)
                </div>
                <p className="text-xs text-slate-800 font-medium">
                  Përmbytje e acidit klorhidrik (pH 1.5-2) që shpërbën mikrobet. Duhen 3 sulme të stomakut për të shkatërruar bakterin.
                </p>
              </div>

              {/* 6. Ethet */}
              <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
                <div className="flex items-center gap-2 text-red-800 font-['Archivo_Black'] text-xs mb-1 uppercase">
                  <Flame className="w-4 h-4 text-black" />
                  6. Ethet (Qarkullimi i Gjakut)
                </div>
                <p className="text-xs text-slate-800 font-medium">
                  Rritja e temperaturës mbi 37°C ngadalëson shumëzimin e mikrobeve dhe rrit gatishmërinë e rruazave të bardha.
                </p>
              </div>

              {/* 7. Fagocitoza */}
              <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000] md:col-span-2">
                <div className="flex items-center gap-2 text-purple-800 font-['Archivo_Black'] text-xs mb-1 uppercase">
                  <Activity className="w-4 h-4 text-black" />
                  7. Fagocitoza (Qelizat e Bardha)
                </div>
                <p className="text-xs text-slate-800 font-medium">
                  Makrofagët patrullojnë indet dhe qarkullimin e gjakut, gëlltisin trupat e huaj dhe i tresin brenda fagosomit me enzima lizosomale.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-3 border-black bg-white flex justify-end">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-yellow-300 hover:bg-yellow-400 text-black font-['Archivo_Black'] uppercase text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
          >
            Kuptova, Kthehu në Lojë
          </button>
        </div>
      </div>
    </div>
  );
};
