import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, Clock, MapPin, User, X, ChevronRight, Volume2, 
  Sparkles, Minimize2, Maximize2, Radio, PlayCircle 
} from 'lucide-react';
import { AgendaItem } from '../types/agenda';
import { formatSecondsToDigital, formatTo12Hour } from '../utils/timeUtils';
import { BorderBeam } from './magicui/BorderBeam';

interface LiveAlertPopupProps {
  activity: AgendaItem | null;
  secondsUntilStart: number | null;
  onDismiss: () => void;
  onSnooze: (minutes: number) => void;
  onViewInAgenda: (activityId: string) => void;
  onNavigateToStage?: () => void;
  onPlayChime?: () => void;
}

export const LiveAlertPopup: React.FC<LiveAlertPopupProps> = ({
  activity,
  secondsUntilStart,
  onDismiss,
  onSnooze,
  onViewInAgenda,
  onNavigateToStage,
  onPlayChime
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);

  // Auto-dismiss or auto-minimize countdown when activity has started (secondsUntilStart <= 0)
  // By default, it stays on screen in "En Vivo" state for 20 seconds, then auto-dismisses smoothly unless user chose keepOpen
  const isStartingNow = secondsUntilStart !== null && secondsUntilStart <= 0;
  const isUrgent = secondsUntilStart !== null && secondsUntilStart > 0 && secondsUntilStart <= 120; // 2 minutes or less

  // Auto-dismiss countdown seconds left (20s grace period after 00:00)
  const autoCloseSecondsLeft = isStartingNow && secondsUntilStart !== null 
    ? Math.max(0, 20 + secondsUntilStart) 
    : 20;

  useEffect(() => {
    if (isStartingNow && autoCloseSecondsLeft <= 0 && !keepOpen) {
      onDismiss();
    }
  }, [isStartingNow, autoCloseSecondsLeft, keepOpen, onDismiss]);

  if (!activity || secondsUntilStart === null) return null;

  // Minimized floating pill mode
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-3 sm:bottom-5 sm:right-5 z-50 animate-bounce cursor-pointer">
        <button
          onClick={() => setIsMinimized(false)}
          className={`min-h-[44px] flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-white font-bold text-xs shadow-xl border hover:scale-105 active:scale-95 transition-transform ${
            isStartingNow 
              ? 'bg-gradient-to-r from-[#00D5D8] to-[#007D80] text-[#1C0235] border-[#00D5D8] shadow-[#00D5D8]/40' 
              : 'bg-gradient-to-r from-[#E01E7E] to-[#2E0556] border-[#E01E7E] shadow-[#E01E7E]/40'
          }`}
        >
          {isStartingNow ? (
            <span className="w-2.5 h-2.5 rounded-full bg-[#E01E7E] animate-ping" />
          ) : (
            <Clock className="w-4 h-4 animate-spin text-[#00D5D8]" style={{ animationDuration: '4s' }} />
          )}

          <span className="max-w-[130px] sm:max-w-[180px] truncate font-black">
            {isStartingNow ? `EN VIVO: ${activity.title}` : `Próxima: ${activity.title}`}
          </span>

          <span className={`font-mono px-2 py-0.5 rounded font-black text-[11px] shrink-0 ${
            isStartingNow ? 'bg-[#1C0235] text-[#00D5D8]' : 'bg-[#00D5D8] text-[#1C0235]'
          }`}>
            {isStartingNow 
              ? (secondsUntilStart < 0 ? `+${formatSecondsToDigital(Math.abs(secondsUntilStart))}` : '¡Ahora!') 
              : formatSecondsToDigital(secondsUntilStart)}
          </span>
          <Maximize2 className="w-3.5 h-3.5 opacity-80 shrink-0" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#140124]/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      
      {/* Clickable Backdrop for Dismiss */}
      <div 
        className="fixed inset-0" 
        onClick={onDismiss} 
        aria-hidden="true" 
      />

      {/* Centered Popup Card */}
      <div className={`relative z-10 max-w-lg w-full mx-auto my-auto shadow-2xl rounded-3xl overflow-hidden border-2 bg-white text-slate-900 animate-in zoom-in-95 duration-200 shadow-purple-950/40 ${
        isStartingNow ? 'border-[#00D5D8]' : 'border-[#E01E7E]'
      }`}>
        {/* Animated Border Beam */}
        <BorderBeam
          size={240}
          duration={5}
          colorFrom={isStartingNow ? '#00D5D8' : '#E01E7E'}
          colorTo={isStartingNow ? '#E01E7E' : '#00D5D8'}
          borderWidth={2.5}
        />
        
        {/* Top Banner Accent */}
        <div className={`px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between text-xs sm:text-sm font-black tracking-wider ${
          isStartingNow 
            ? 'bg-gradient-to-r from-[#00D5D8] via-[#009699] to-[#007D80] text-[#1C0235]' 
            : isUrgent 
              ? 'bg-gradient-to-r from-[#E01E7E] via-[#FF2E93] to-[#BD1567] text-white' 
              : 'bg-gradient-to-r from-[#1C0235] via-[#320659] to-[#E01E7E] text-white'
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            {isStartingNow ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E01E7E] animate-ping" />
                <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-[#1C0235]" />
              </div>
            ) : (
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#00D5D8] animate-bounce shrink-0" />
            )}
            <span className="truncate">
              {isStartingNow 
                ? '¡ACTIVIDAD INICIANDO AHORA EN VIVO!' 
                : 'SE APROXIMA LA SIGUIENTE ACTIVIDAD'}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-1">
            {onPlayChime && (
              <button
                onClick={onPlayChime}
                title="Probar sonido de campana"
                className="min-w-[32px] min-h-[32px] flex items-center justify-center p-1.5 hover:bg-black/10 active:bg-black/20 rounded-lg transition-colors"
                aria-label="Probar sonido"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsMinimized(true)}
              title="Minimizar a burbuja flotante"
              className="min-w-[32px] min-h-[32px] flex items-center justify-center p-1.5 hover:bg-black/10 active:bg-black/20 rounded-lg transition-colors"
              aria-label="Minimizar notificación"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDismiss}
              title="Cerrar aviso"
              className="min-w-[32px] min-h-[32px] flex items-center justify-center p-1.5 hover:bg-black/10 active:bg-black/20 rounded-lg transition-colors"
              aria-label="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Body on White */}
        <div className="p-4 sm:p-6 space-y-4">
          
          {/* Countdown & Timing Row */}
          <div className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-colors ${
            isStartingNow 
              ? 'bg-teal-50/90 border-[#00B4B7]' 
              : 'bg-purple-50/90 border-purple-200'
          }`}>
            <div className="space-y-0.5">
              <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider block ${
                isStartingNow ? 'text-[#007D80]' : 'text-purple-700'
              }`}>
                {isStartingNow ? 'Estado actual' : 'Tiempo estimado'}
              </span>

              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className={`text-3xl sm:text-4xl font-black font-mono tabular-nums leading-none ${
                  isStartingNow 
                    ? 'text-[#007D80]' 
                    : isUrgent 
                      ? 'text-[#E01E7E]' 
                      : 'text-[#007D80]'
                }`}>
                  {isStartingNow 
                    ? (secondsUntilStart < 0 ? `+${formatSecondsToDigital(Math.abs(secondsUntilStart))}` : '00:00') 
                    : formatSecondsToDigital(secondsUntilStart)}
                </span>
                
                <span className={`text-xs sm:text-sm font-bold ${
                  isStartingNow ? 'text-[#007D80]' : 'text-purple-800'
                }`}>
                  {isStartingNow 
                    ? (secondsUntilStart < 0 ? 'transcurrido' : '¡Iniciando en vivo!') 
                    : 'restantes'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider block ${
                isStartingNow ? 'text-[#007D80]' : 'text-purple-700'
              }`}>
                Hora programada
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#1C0235] font-mono bg-white px-2.5 py-1 rounded-xl border border-purple-200 shadow-sm inline-block">
                {formatTo12Hour(activity.startTime)}
              </span>
            </div>
          </div>

          {/* Activity Details in Deep Summit Violet */}
          <div className="space-y-1.5">
            <h4 className="text-base sm:text-lg font-black text-[#1C0235] leading-snug">
              {activity.title}
            </h4>

            {activity.speaker && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#C21268] font-bold">
                <User className="w-4 h-4 shrink-0" />
                <span>{activity.speaker}</span>
              </div>
            )}

            {activity.location && (
              <div className="flex items-center gap-2 text-xs text-purple-900/70 font-medium">
                <MapPin className="w-4 h-4 text-[#E01E7E] shrink-0" />
                <span>{activity.location}</span>
              </div>
            )}

            {activity.description && (
              <p className="text-xs text-purple-900/80 pt-1 leading-relaxed border-t border-purple-100">
                {activity.description}
              </p>
            )}
          </div>

          {/* AUTO-DISMISS BANNER WHEN IN LIVE STATE */}
          {isStartingNow && !keepOpen && (
            <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between text-xs text-[#007D80] animate-in fade-in">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#007D80] shrink-0 animate-pulse" />
                <span className="font-medium">
                  {autoCloseSecondsLeft > 0 
                    ? `Cerrando aviso automáticamente en ${autoCloseSecondsLeft}s...` 
                    : 'Cerrando aviso...'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setKeepOpen(true)}
                className="text-[11px] font-black underline text-[#1C0235] hover:text-[#E01E7E]"
              >
                Mantener abierto
              </button>
            </div>
          )}

          {/* Interactive Action Buttons with >= 44px touch targets */}
          <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            
            {/* If starting now, offer direct button to Stage View / Live Timer */}
            {isStartingNow && onNavigateToStage ? (
              <button
                onClick={() => {
                  onNavigateToStage();
                  onDismiss();
                }}
                className="flex-1 min-h-[46px] py-2.5 px-4 text-xs sm:text-sm font-black rounded-xl bg-[#007D80] hover:bg-[#006063] active:scale-95 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#007D80]/30"
              >
                <PlayCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Ir al Escenario en Vivo</span>
              </button>
            ) : null}

            <button
              onClick={() => {
                onViewInAgenda(activity.id);
                onDismiss();
              }}
              className={`min-h-[46px] py-2.5 px-4 text-xs font-black rounded-xl text-white transition-all flex items-center justify-center gap-1.5 shadow-md ${
                isStartingNow && onNavigateToStage
                  ? 'bg-purple-900 hover:bg-purple-950 sm:flex-initial'
                  : 'flex-1 bg-[#E01E7E] hover:bg-[#C21268] shadow-[#E01E7E]/30'
              }`}
            >
              <span>Ver en Cronograma</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {!isStartingNow && (
              <button
                onClick={() => onSnooze(2)}
                className="min-h-[44px] py-2.5 px-4 text-xs font-bold rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-95 text-[#1C0235] border border-purple-200 transition-colors whitespace-nowrap text-center"
                title="Avisar de nuevo en 2 minutos"
              >
                +2 min
              </button>
            )}

            <button
              onClick={onDismiss}
              className="min-h-[44px] py-2.5 px-4 text-xs font-bold rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-95 text-purple-800 border border-purple-200 transition-colors text-center"
            >
              Cerrar
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
