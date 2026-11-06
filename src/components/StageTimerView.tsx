import React, { useState, useEffect } from 'react';
import { 
  Clock, Play, Pause, Maximize, Minimize, AlertTriangle, 
  ChevronRight, ArrowRight, User, MapPin, Volume2, Plus, RotateCcw
} from 'lucide-react';
import { AgendaItem } from '../types/agenda';
import { 
  formatSecondsToDigital, 
  formatTo12Hour, 
  getActivityMetrics 
} from '../utils/timeUtils';
import { BorderBeam } from './magicui/BorderBeam';

interface StageTimerViewProps {
  currentActivity: AgendaItem | null;
  nextActivity: AgendaItem | null;
  currentSecondsOfDay: number;
  onShiftSchedule: (deltaMinutes: number, fromId?: string) => void;
  onPlayChime?: () => void;
}

export const StageTimerView: React.FC<StageTimerViewProps> = ({
  currentActivity,
  nextActivity,
  currentSecondsOfDay,
  onShiftSchedule,
  onPlayChime
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const currentMetrics = currentActivity 
    ? getActivityMetrics(currentActivity, currentSecondsOfDay, false)
    : null;

  const nextMetrics = nextActivity
    ? getActivityMetrics(nextActivity, currentSecondsOfDay, true)
    : null;

  // Overtime calculation
  const isOvertime = currentMetrics ? currentMetrics.secondsRemaining <= 0 && currentMetrics.status === 'completed' : false;
  const secondsLeft = currentMetrics ? currentMetrics.secondsRemaining : 0;
  
  // Color classification for stage
  let timerColorClass = 'text-[#007D80]';
  let timerCardBorder = 'border-purple-200/90';
  let timerCardBg = 'bg-white';
  let warningMessage = 'EN TIEMPO';
  let badgeColor = 'bg-teal-50 text-[#007D80] border-teal-200';

  if (!currentActivity) {
    timerColorClass = 'text-purple-400';
    warningMessage = 'SIN ACTIVIDAD EN CURSO';
    badgeColor = 'bg-purple-50 text-purple-700 border-purple-200';
  } else if (secondsLeft <= 0) {
    timerColorClass = 'text-rose-600 animate-pulse';
    timerCardBorder = 'border-rose-300 ring-4 ring-rose-500/10';
    timerCardBg = 'bg-rose-50/40';
    warningMessage = '⚠️ TIEMPO CUMPLIDO / SOBRETIEMPO';
    badgeColor = 'bg-rose-100 text-rose-700 border-rose-300';
  } else if (secondsLeft <= 60) {
    timerColorClass = 'text-[#E01E7E] animate-pulse';
    timerCardBorder = 'border-[#E01E7E] ring-4 ring-[#E01E7E]/10';
    timerCardBg = 'bg-pink-50/30';
    warningMessage = '¡ÚLTIMO MINUTO!';
    badgeColor = 'bg-pink-100 text-[#C21268] border-pink-300';
  } else if (secondsLeft <= 300) {
    timerColorClass = 'text-amber-600';
    timerCardBorder = 'border-amber-300';
    timerCardBg = 'bg-amber-50/30';
    warningMessage = 'AVISO: MENOS DE 5 MINUTOS';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
  }

  return (
    <div className={`space-y-6 ${isFullscreen ? 'p-8 bg-[#17022C] min-h-screen' : ''}`}>
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border-2 border-purple-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xl gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-pink-50 text-[#C21268] border border-pink-200 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-[#1C0235] tracking-tight">
              Cronómetro de Escenario / Monitor de Confianza
            </h2>
            <p className="text-xs text-purple-900/80 font-medium">
              Pantalla para oradores y directores de escenario en alta legibilidad.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {onPlayChime && (
            <button
              onClick={onPlayChime}
              className="min-h-[40px] px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-100 hover:bg-purple-200 active:scale-95 text-[#1C0235] border border-purple-200 transition-colors flex items-center gap-1.5"
              title="Hacer sonar campana de aviso"
            >
              <Volume2 className="w-4 h-4 text-[#C21268]" />
              <span>Campana</span>
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="min-h-[40px] px-3.5 py-1.5 text-xs font-black rounded-xl bg-[#E01E7E] hover:bg-[#C21268] active:scale-95 text-white transition-all flex items-center gap-1.5 shadow-md shadow-[#E01E7E]/30"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            <span>{isFullscreen ? 'Salir' : 'Pantalla Completa'}</span>
          </button>
        </div>
      </div>

      {/* Main Big Stage Monitor Card (White card) */}
      <div className={`relative rounded-3xl border-2 ${timerCardBorder} ${timerCardBg} p-4 sm:p-10 text-center space-y-5 sm:space-y-6 shadow-2xl overflow-hidden transition-colors`}>
        {/* Border Beam animated effect for stage card */}
        {currentActivity && (
          <BorderBeam
            size={280}
            duration={6}
            colorFrom={secondsLeft <= 60 ? '#E01E7E' : '#00D5D8'}
            colorTo={secondsLeft <= 60 ? '#FF2E93' : '#E01E7E'}
            borderWidth={3}
          />
        )}
        
        {/* Stage Status Flag */}
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-sm ${badgeColor}`}>
          <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${secondsLeft <= 60 ? 'bg-[#E01E7E] animate-ping' : 'bg-[#007D80]'}`}></span>
          <span>{warningMessage}</span>
        </div>

        {/* Current Activity Title & Speaker in Massive Contrast */}
        <div className="space-y-1.5 max-w-4xl mx-auto px-2">
          <h1 className="text-xl sm:text-4xl md:text-5xl font-black text-[#1C0235] tracking-tight leading-tight">
            {currentActivity ? currentActivity.title : 'No hay actividad en curso en este momento'}
          </h1>
          {currentActivity?.speaker && (
            <p className="text-base sm:text-2xl text-[#C21268] font-black flex items-center justify-center gap-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#C21268]" />
              <span>{currentActivity.speaker}</span>
            </p>
          )}
        </div>

        {/* Giant Digital Countdown Readout */}
        <div className="py-2 sm:py-8">
          <div className={`font-mono text-5xl xs:text-6xl sm:text-8xl md:text-9xl font-black tracking-normal tabular-nums ${timerColorClass} drop-shadow-sm select-none`}>
            {currentActivity 
              ? formatSecondsToDigital(secondsLeft)
              : '--:--'}
          </div>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-purple-900/80 block mt-2">
            {currentActivity ? 'Tiempo Restante de la Sesión' : 'En Espera del Siguiente Bloque'}
          </span>
        </div>

        {/* Progress bar */}
        {currentMetrics && (
          <div className="max-w-2xl mx-auto space-y-2 px-2">
            <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden border border-purple-200 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-[#E01E7E] via-[#00B4B7] to-[#007D80] rounded-full transition-all duration-1000 ease-linear shadow-sm"
                style={{ width: `${currentMetrics.progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] sm:text-xs text-purple-900 font-mono font-bold">
              <span>Inicio: {formatTo12Hour(currentActivity?.startTime || '')}</span>
              <span className="text-[#007D80] font-black">{Math.round(currentMetrics.progressPercent)}% transcurrido</span>
              <span>Fin: {formatTo12Hour(currentActivity?.endTime || '')}</span>
            </div>
          </div>
        )}

        {/* Quick Stage Adjustment Buttons */}
        {currentActivity && (
          <div className="pt-2 flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-2 max-w-sm mx-auto">
            <button
              onClick={() => onShiftSchedule(2, currentActivity.id)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 active:scale-95 text-[#1C0235] border border-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors flex-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#007D80]" />
              <span>+2 Min al Orador</span>
            </button>
            <button
              onClick={() => onShiftSchedule(5, currentActivity.id)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#E01E7E] hover:bg-[#C21268] active:scale-95 text-white border border-pink-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#E01E7E]/30 flex-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+5 Min al Orador</span>
            </button>
          </div>
        )}

      </div>

      {/* Next Up Activity Preview Card */}
      {nextActivity && nextMetrics && (
        <div className="bg-white border-2 border-purple-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-xl bg-teal-50 text-[#007D80] border border-teal-200 shrink-0 mt-0.5 shadow-sm">
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-[#007D80] uppercase tracking-wider">
                  Siguiente en Escenario
                </span>
                <span className="text-purple-300">·</span>
                <span className="text-xs text-purple-900 font-mono font-bold">
                  A las {formatTo12Hour(nextActivity.startTime)}
                </span>
              </div>
              <h3 className="text-sm sm:text-lg font-black text-[#1C0235] leading-snug">
                {nextActivity.title}
              </h3>
              {nextActivity.speaker && (
                <p className="text-xs text-[#C21268] font-bold">
                  {nextActivity.speaker}
                </p>
              )}
            </div>
          </div>

          <div className="bg-purple-50 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl border border-purple-200 text-center sm:text-right shrink-0 shadow-inner">
            <span className="text-[10px] sm:text-[11px] text-purple-800 uppercase font-bold block tracking-wider">
              Comienza en
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-[#007D80] tabular-nums">
              {formatSecondsToDigital(nextMetrics.secondsUntilStart)}
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
