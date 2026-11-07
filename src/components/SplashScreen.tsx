import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Radio } from 'lucide-react';
import { BorderBeam } from './magicui/BorderBeam';

interface SplashScreenProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, onSkip }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 2400; // 2.4 seconds smooth brand intro

    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#120120] text-white flex flex-col items-center justify-between p-6 overflow-hidden select-none animate-in fade-in duration-300">
      
      {/* Background glowing ambient orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#E01E7E]/25 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#00D5D8]/20 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2B054E]/40 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header bar with Skip button */}
      <div className="w-full max-w-md flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[11px] font-bold text-purple-200">
          <span className="w-2 h-2 rounded-full bg-[#00D5D8] animate-ping" />
          <span>Iniciando Summit 2026</span>
        </div>

        <button
          onClick={onSkip || onComplete}
          className="text-xs font-bold text-purple-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-1"
        >
          <span>Saltar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Brand Identity Section: Official Summit Logo */}
      <div className="flex flex-col items-center justify-center text-center max-w-sm sm:max-w-md w-full space-y-5 z-10 my-auto">
        
        {/* Official Summit Logo with Animated Border Beam */}
        <div className="relative group w-full max-w-xs sm:max-w-sm rounded-3xl p-6 sm:p-7 bg-[#1D0336]/60 backdrop-blur-md border border-[#470B7E]/80 shadow-2xl overflow-hidden flex items-center justify-center">
          <BorderBeam
            size={240}
            duration={5}
            colorFrom="#E01E7E"
            colorTo="#00D5D8"
            borderWidth={2.5}
          />
          <img 
            src="/summit-logo.png" 
            alt="Digital Creator Summit" 
            className="w-full h-auto max-h-24 sm:max-h-32 object-contain drop-shadow-[0_12px_24px_rgba(224,30,126,0.4)] animate-in zoom-in-95 duration-500"
          />
        </div>

        {/* Brand Details */}
        <div className="space-y-2">
          <div className="inline-block px-3.5 py-1 rounded-full bg-gradient-to-r from-[#E01E7E]/30 to-[#00D5D8]/30 border border-[#00D5D8]/40 backdrop-blur-md">
            <span className="text-[11px] font-black tracking-widest text-[#00D5D8] uppercase">
              DIGITAL CREATOR SUMMIT · 26
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
            Unión Adventista Panameña
          </h2>

          {/* Official Motto */}
          <p className="text-xs sm:text-sm text-purple-200/90 italic font-medium pt-1 max-w-xs mx-auto leading-relaxed">
            “En Cristo, todas las cosas son nuevas.”
          </p>
          <span className="text-[10px] text-purple-400 font-semibold block">
            2 Corintios 5:17 · 7 de Noviembre de 2026
          </span>
        </div>

      </div>

      {/* Bottom Loading Progress & Details */}
      <div className="w-full max-w-xs space-y-3 z-10 pb-4 text-center">
        
        {/* Progress Bar */}
        <div className="w-full bg-purple-950/80 h-2 rounded-full overflow-hidden border border-purple-800/60 p-0.5 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-[#E01E7E] via-[#FF2E93] to-[#00D5D8] rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-purple-300 font-mono font-bold px-1">
          <span>{progress >= 100 ? '¡Listo para comenzar!' : 'Cargando Agenda y Acreditación'}</span>
          <span>{progress}%</span>
        </div>

        {progress >= 100 ? (
          <button
            onClick={onComplete}
            className="w-full min-h-[46px] px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#E01E7E] to-[#FF2E93] hover:from-[#C21268] hover:to-[#E01E7E] active:scale-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#E01E7E]/40 transition-all animate-in zoom-in-95 cursor-pointer"
          >
            <span>Siguiente</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="text-xs text-purple-300 hover:text-white underline font-semibold transition-opacity"
          >
            Saltar carga
          </button>
        )}
      </div>

    </div>
  );
};
