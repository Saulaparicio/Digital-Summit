import React, { useState, useRef, useEffect } from 'react';
import { Clock, Volume2, VolumeX, Bell, BellOff, Sparkles, UserCheck, History, Calendar, CheckCircle2, ChevronDown, X } from 'lucide-react';
import { formatTo12Hour } from '../utils/timeUtils';

interface HeaderProps {
  activeView: 'agenda' | 'stage' | 'history' | 'delegates' | 'info';
  setActiveView: (view: 'agenda' | 'stage' | 'history' | 'delegates' | 'info') => void;
  isSimulated: boolean;
  setIsSimulated: (val: boolean) => void;
  soundMuted: boolean;
  toggleSound: () => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  currentFormattedTime: string;
  completedCount?: number;
  eventProgressPercent?: number;
  eventStartTimeStr?: string;
  eventEndTimeStr?: string;
  totalActivitiesCount?: number;
  onOpenCheckIn?: () => void;
  onOpenOnboarding?: () => void;
  onOpenWelcome?: () => void;
  myDelegateName?: string | null;
  isMyAttendanceConfirmed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  isSimulated,
  setIsSimulated,
  soundMuted,
  toggleSound,
  notificationsEnabled,
  toggleNotifications,
  currentFormattedTime,
  completedCount = 0,
  eventProgressPercent = 0,
  eventStartTimeStr = '07:45',
  eventEndTimeStr = '18:00',
  totalActivitiesCount = 23,
  onOpenCheckIn,
  onOpenOnboarding,
  onOpenWelcome,
  myDelegateName,
  isMyAttendanceConfirmed = false
}) => {
  const [showProgressTooltip, setShowProgressTooltip] = useState(false);
  const progressWidgetRef = useRef<HTMLDivElement>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (progressWidgetRef.current && !progressWidgetRef.current.contains(event.target as Node)) {
        setShowProgressTooltip(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clampedProgress = Math.min(100, Math.max(0, eventProgressPercent));
  const roundedPercent = Math.round(clampedProgress);

  // Gauge calculation (r = 13.5, circumference = 2 * pi * 13.5 ≈ 84.823)
  const radius = 13.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  // Status message based on current progress
  const getProgressStatusText = () => {
    if (clampedProgress <= 0) return 'Por iniciar · Llegada y Registro';
    if (clampedProgress >= 100) return '¡Evento finalizado con éxito!';
    if (clampedProgress < 40) return 'Bloque de la mañana en curso';
    if (clampedProgress < 60) return 'Almuerzo y networking de creadores';
    return 'Bloque de la tarde y talleres';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1D0336]/95 backdrop-blur-md border-b border-[#470B7E]/60 shadow-lg shadow-[#120124]/50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
        
        {/* Zone 1: Authentic Summit Brand Wordmark & Official OneVoice27 Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
          <div className="h-8 sm:h-9 px-2 bg-white rounded-xl shadow-md flex items-center justify-center shrink-0 border border-white/30">
            <img 
              src="/ov27-logo-color-v2.png" 
              alt="OneVoice27 Logo" 
              className="h-5 sm:h-6 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://adventista.es/wp-content/uploads/2026/09/ov27-logo-color-v2.png';
              }}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1 leading-none truncate">
              <span className="text-xs sm:text-base font-black tracking-wider text-white uppercase truncate">
                DIGITAL CREATOR
              </span>
              <span className="font-script text-base sm:text-xl font-bold text-[#E01E7E] drop-shadow-sm shrink-0">
                Summit
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-[#00D5D8] bg-[#00D5D8]/10 border border-[#00D5D8]/30 px-1 rounded shrink-0">
                PNM26
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-purple-300/80 font-medium tracking-tight truncate hidden xs:block">
              UnaVoz27 · Unión Adventista Panameña
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveView('agenda')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeView === 'agenda'
                ? 'bg-[#E01E7E] text-white shadow-md shadow-[#E01E7E]/30'
                : 'text-purple-200 hover:text-white hover:bg-[#340760]'
            }`}
          >
            Cronograma en Vivo
          </button>
          <button
            onClick={() => setActiveView('stage')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeView === 'stage'
                ? 'bg-[#E01E7E] text-white shadow-md shadow-[#E01E7E]/30'
                : 'text-purple-200 hover:text-white hover:bg-[#340760]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#00D5D8]" />
            Cronómetro
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeView === 'history'
                ? 'bg-[#E01E7E] text-white shadow-md shadow-[#E01E7E]/30'
                : 'text-purple-200 hover:text-white hover:bg-[#340760]'
            }`}
          >
            <History className="w-3.5 h-3.5 text-[#00D5D8]" />
            <span>Historial</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeView === 'history' ? 'bg-white/20 text-white' : 'bg-[#17022C] text-[#00D5D8] border border-[#00D5D8]/40'
            }`}>
              {completedCount}
            </span>
          </button>
          <button
            onClick={() => setActiveView('delegates')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeView === 'delegates'
                ? 'bg-[#E01E7E] text-white shadow-md shadow-[#E01E7E]/30'
                : 'text-purple-200 hover:text-white hover:bg-[#340760]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Delegados (94)
          </button>
          <button
            onClick={() => setActiveView('info')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeView === 'info'
                ? 'bg-[#E01E7E] text-white shadow-md shadow-[#E01E7E]/30'
                : 'text-purple-200 hover:text-white hover:bg-[#340760]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00D5D8]" />
            Guía & Redes
          </button>
        </nav>

        {/* Zone 3: Status / Controls & Circular Event Progress */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Circular Event Progress Gauge */}
          <div className="relative" ref={progressWidgetRef}>
            <button
              onClick={() => setShowProgressTooltip(!showProgressTooltip)}
              className="flex items-center gap-1.5 sm:gap-2 px-2 py-1 rounded-xl bg-[#260447] hover:bg-[#32065B] border border-[#480980] hover:border-[#00D5D8]/60 transition-all cursor-pointer select-none shadow-inner active:scale-95"
              aria-label={`Progreso del evento: ${roundedPercent}% transcurrido`}
              title="Ver progreso global del evento hoy"
            >
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 -rotate-90 transform" viewBox="0 0 36 36">
                  {/* Background Track Circle */}
                  <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    className="text-[#3A076C]/60"
                    strokeWidth="3.4"
                    stroke="currentColor"
                    fill="none"
                  />
                  {/* Dynamic Progress Stroke */}
                  <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    stroke="url(#summitHeaderProgressGradient)"
                    strokeWidth="3.4"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="summitHeaderProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00D5D8" />
                      <stop offset="60%" stopColor="#C21268" />
                      <stop offset="100%" stopColor="#E01E7E" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center Percentage Number */}
                <span className="absolute text-[8px] sm:text-[9px] font-black font-mono text-white leading-none">
                  {roundedPercent}%
                </span>
              </div>

              {/* Progress text label on larger screens */}
              <div className="hidden lg:flex flex-col text-left leading-none pr-0.5">
                <span className="text-[8.5px] font-extrabold text-purple-300 uppercase tracking-wider">
                  Progreso
                </span>
                <span className="text-[10px] font-mono font-black text-[#00D5D8] mt-0.5">
                  {roundedPercent}% día
                </span>
              </div>
            </button>

            {/* Interactive Progress Tooltip / Dropdown Card */}
            {showProgressTooltip && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border-2 border-purple-200/90 rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-900 space-y-3">
                <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#E01E7E] font-black text-sm">★</span>
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#1C0235]">
                      PROGRESO DEL EVENTO
                    </h4>
                  </div>
                  <button
                    onClick={() => setShowProgressTooltip(false)}
                    className="p-1 rounded-lg text-purple-600 hover:text-[#1C0235] hover:bg-purple-100"
                    aria-label="Cerrar"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Big Gauge & Status */}
                <div className="flex items-center gap-3.5 pt-1">
                  <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                    <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r={radius}
                        className="text-purple-100"
                        strokeWidth="3.4"
                        stroke="currentColor"
                        fill="none"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r={radius}
                        stroke="url(#tooltipGaugeGradient)"
                        strokeWidth="3.4"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-700 ease-out"
                      />
                      <defs>
                        <linearGradient id="tooltipGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#007D80" />
                          <stop offset="100%" stopColor="#E01E7E" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="absolute text-xs font-black font-mono text-[#1C0235]">
                      {roundedPercent}%
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-xs font-black text-[#1C0235] block leading-snug">
                      {roundedPercent}% del evento transcurrido
                    </span>
                    <span className="text-[11px] text-[#C21268] font-bold block">
                      {getProgressStatusText()}
                    </span>
                  </div>
                </div>

                {/* Breakdown details */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="bg-purple-50/70 p-2 rounded-xl border border-purple-200">
                    <span className="text-purple-700 block text-[10px] font-semibold">Horario oficial</span>
                    <span className="font-mono font-black text-[#1C0235]">
                      {formatTo12Hour(eventStartTimeStr)} - {formatTo12Hour(eventEndTimeStr)}
                    </span>
                  </div>
                  <div className="bg-purple-50/70 p-2 rounded-xl border border-purple-200">
                    <span className="text-purple-700 block text-[10px] font-semibold">Actividades concluidas</span>
                    <span className="font-mono font-black text-[#007D80]">
                      {completedCount} <span className="text-purple-600 font-normal">/ {totalActivitiesCount}</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Self Check-in / Confirmation Button */}
          {onOpenCheckIn && (
            <button
              onClick={onOpenCheckIn}
              className={`min-h-[34px] sm:min-h-[38px] px-2.5 sm:px-3 py-1 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95 whitespace-nowrap ${
                isMyAttendanceConfirmed
                  ? 'bg-teal-50 text-[#007D80] border-2 border-[#00B4B7] hover:bg-teal-100 shadow-teal-500/15'
                  : 'bg-[#E01E7E] hover:bg-[#C21268] text-white shadow-md shadow-[#E01E7E]/30 ring-2 ring-[#E01E7E]/30'
              }`}
              title={isMyAttendanceConfirmed ? "Ver mi credencial y gafete oficial de acreditación" : "Buscarme y confirmar mi asistencia al evento"}
            >
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              <span className="hidden xs:inline">
                {isMyAttendanceConfirmed ? (myDelegateName ? `✓ ${myDelegateName.split(' ')[0]}` : '✓ Acreditado') : 'Confirmar Asistencia'}
              </span>
              <span className="xs:hidden">
                {isMyAttendanceConfirmed ? '✓ Gafete' : 'Check-in'}
              </span>
            </button>
          )}

          {/* Real-time / Simulation toggle */}
          <button
            onClick={() => setIsSimulated(!isSimulated)}
            title={isSimulated ? "Estás en Modo Simulación" : "Estás en Hora Real del dispositivo"}
            className={`px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 whitespace-nowrap ${
              isSimulated
                ? 'bg-amber-950/60 text-amber-300 border-amber-600/50 hover:bg-amber-900/60'
                : 'bg-[#00D5D8]/10 text-[#00D5D8] border-[#00D5D8]/40 hover:bg-[#00D5D8]/20'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isSimulated ? 'bg-amber-400 animate-pulse' : 'bg-[#00D5D8]'}`}></span>
            <span className="font-mono tabular-nums">{currentFormattedTime}</span>
            <span className="hidden sm:inline text-[11px] opacity-80">
              {isSimulated ? 'Simulado' : 'En Vivo'}
            </span>
          </button>

          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            title={soundMuted ? "Activar sonido de alertas" : "Silenciar sonido de alertas"}
            className={`p-1.5 rounded-lg border transition-colors ${
              soundMuted
                ? 'bg-[#29054A] text-purple-400 border-[#470B7E]'
                : 'bg-[#29054A] text-[#E01E7E] border-[#E01E7E]/50 hover:bg-[#3B076C]'
            }`}
            aria-label="Alternar sonido"
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Native notification toggle */}
          <button
            onClick={toggleNotifications}
            title={notificationsEnabled ? "Notificaciones de escritorio activadas" : "Activar notificaciones de escritorio"}
            className={`p-1.5 rounded-lg border transition-colors ${
              notificationsEnabled
                ? 'bg-[#E01E7E] text-white border-[#E01E7E]'
                : 'bg-[#29054A] text-purple-400 border-[#470B7E] hover:text-white'
            }`}
            aria-label="Alternar notificaciones de escritorio"
          >
            {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>

          {/* Onboarding Guide Trigger */}
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="p-1.5 rounded-lg border border-[#470B7E] bg-[#29054A] text-purple-300 hover:text-white hover:border-[#00D5D8]/50 transition-colors"
              title="Ver Guía del Evento y Onboarding"
              aria-label="Ver Guía del Evento"
            >
              <Sparkles className="w-4 h-4 text-[#00D5D8]" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar with finger-friendly touch targets */}
      <div className="flex md:hidden items-center px-3 py-2 border-t border-[#470B7E]/60 bg-[#1D0336] overflow-x-auto gap-1.5 scrollbar-none">
        <button
          onClick={() => setActiveView('agenda')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-xl whitespace-nowrap text-xs font-bold transition-all shrink-0 ${
            activeView === 'agenda' ? 'text-white bg-[#E01E7E] shadow-md shadow-[#E01E7E]/30' : 'text-purple-200 hover:text-white bg-[#260447]'
          }`}
        >
          Cronograma
        </button>
        <button
          onClick={() => setActiveView('stage')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-xl whitespace-nowrap text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeView === 'stage' ? 'text-white bg-[#E01E7E] shadow-md shadow-[#E01E7E]/30' : 'text-purple-200 hover:text-white bg-[#260447]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#00D5D8]" />
          <span>Cronómetro</span>
        </button>
        <button
          onClick={() => setActiveView('history')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-xl whitespace-nowrap text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeView === 'history' ? 'text-white bg-[#E01E7E] shadow-md shadow-[#E01E7E]/30' : 'text-purple-200 hover:text-white bg-[#260447]'
          }`}
        >
          <span>Historial</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${
            activeView === 'history' ? 'bg-white text-[#E01E7E]' : 'bg-[#00D5D8] text-[#1C0235]'
          }`}>
            {completedCount}
          </span>
        </button>
        <button
          onClick={() => setActiveView('delegates')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-xl whitespace-nowrap text-xs font-bold transition-all shrink-0 ${
            activeView === 'delegates' ? 'text-white bg-[#E01E7E] shadow-md shadow-[#E01E7E]/30' : 'text-purple-200 hover:text-white bg-[#260447]'
          }`}
        >
          Delegados
        </button>
        {onOpenCheckIn && (
          <button
            onClick={onOpenCheckIn}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl whitespace-nowrap text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
              isMyAttendanceConfirmed
                ? 'bg-teal-50 text-[#007D80] border border-teal-300'
                : 'bg-gradient-to-r from-[#E01E7E] to-[#C21268] text-white shadow-md shadow-[#E01E7E]/30'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isMyAttendanceConfirmed ? 'Mi Gafete' : 'Check-in'}</span>
          </button>
        )}
        <button
          onClick={() => setActiveView('info')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-xl whitespace-nowrap text-xs font-bold transition-all shrink-0 ${
            activeView === 'info' ? 'text-white bg-[#E01E7E] shadow-md shadow-[#E01E7E]/30' : 'text-purple-200 hover:text-white bg-[#260447]'
          }`}
        >
          Guía & Redes
        </button>
      </div>
    </header>
  );
};
