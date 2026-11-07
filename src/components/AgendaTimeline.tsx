import React, { useState, useMemo } from 'react';
import { 
  Clock, User, MapPin, CheckCircle2, AlertCircle, Sparkles, Plus, 
  RotateCcw, FastForward, Edit3, ArrowRight, Filter, ChevronDown, Check,
  Play, Utensils
} from 'lucide-react';
import { AgendaItem, ActivityCategory } from '../types/agenda';
import { 
  timeStringToMinutes, 
  formatTo12Hour, 
  getActivityMetrics, 
  formatSecondsToDigital 
} from '../utils/timeUtils';
import { BorderBeam } from './magicui/BorderBeam';

interface AgendaTimelineProps {
  items: AgendaItem[];
  currentSecondsOfDay: number;
  onEditActivity: (item: AgendaItem) => void;
  onAddNewActivity: () => void;
  onShiftSchedule: (deltaMinutes: number, fromId?: string) => void;
  onResetSchedule: () => void;
  targetHighlightId: string | null;
}

const CATEGORY_STYLES: Record<ActivityCategory, { label: string; dotColor: string; badgeClass: string }> = {
  ceremony: { 
    label: 'Ceremonia / Registro', 
    dotColor: 'bg-[#E01E7E]', 
    badgeClass: 'bg-purple-50 text-[#3A076C] border border-purple-200' 
  },
  devotional: { 
    label: 'Devocional', 
    dotColor: 'bg-[#E01E7E]', 
    badgeClass: 'bg-pink-50 text-[#C21268] border border-pink-200' 
  },
  keynote: { 
    label: 'Conferencia', 
    dotColor: 'bg-[#009AA6]', 
    badgeClass: 'bg-cyan-50 text-[#006E72] border border-cyan-200' 
  },
  capsule: { 
    label: 'Microcápsula', 
    dotColor: 'bg-[#E01E7E]', 
    badgeClass: 'bg-pink-50 text-[#C21268] border border-pink-200' 
  },
  workshop: { 
    label: 'Taller / Desafío', 
    dotColor: 'bg-[#009AA6]', 
    badgeClass: 'bg-purple-50 text-[#5B108E] border border-purple-200' 
  },
  panel: { 
    label: 'Conversatorio', 
    dotColor: 'bg-[#009AA6]', 
    badgeClass: 'bg-cyan-50 text-[#006E72] border border-cyan-200' 
  },
  break: { 
    label: 'Almuerzo', 
    dotColor: 'bg-[#E01E7E]', 
    badgeClass: 'bg-[#E01E7E] text-white border border-pink-400' 
  }
};

export const AgendaTimeline: React.FC<AgendaTimelineProps> = ({
  items,
  currentSecondsOfDay,
  onEditActivity,
  onAddNewActivity,
  onShiftSchedule,
  onResetSchedule,
  targetHighlightId
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Determine which is next candidate
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime));
  }, [items]);

  const nextCandidateId = useMemo(() => {
    for (const item of sortedItems) {
      const startSec = timeStringToMinutes(item.startTime) * 60;
      if (currentSecondsOfDay < startSec) {
        return item.id;
      }
    }
    return null;
  }, [sortedItems, currentSecondsOfDay]);

  // Filter items
  const filteredItems = useMemo(() => {
    return sortedItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesQuery = 
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.speaker && item.speaker.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [sortedItems, selectedCategory, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    let completed = 0;
    let current = 0;
    let upcoming = 0;

    sortedItems.forEach((item) => {
      const { status } = getActivityMetrics(item, currentSecondsOfDay, item.id === nextCandidateId);
      if (status === 'completed') completed++;
      else if (status === 'current') current++;
      else upcoming++;
    });

    return { completed, current, upcoming, total: sortedItems.length };
  }, [sortedItems, currentSecondsOfDay, nextCandidateId]);

  const scrollToCurrent = () => {
    const el = document.getElementById('current-activity-card') || document.getElementById('next-activity-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Program Card with Authentic Document Visual Motifs - White Card Aesthetic */}
      <div className="relative bg-white border-2 border-purple-200/90 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden text-slate-900">
        
        {/* Document Dot Grid Motif in top right */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-25 select-none pointer-events-none">
          <div className="grid grid-cols-6 gap-1.5">
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#E01E7E]"></span>
            ))}
          </div>
        </div>

        {/* Asterisk decoration from PDF */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[#E01E7E] text-2xl font-black select-none opacity-30">
          ★
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#E01E7E] text-xl font-black">★</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1C0235] tracking-wider uppercase">
                PROGRAMA
              </h2>
            </div>
            {/* The cyan underline bar from Page 5 */}
            <div className="w-20 h-1.5 bg-[#00D5D8] rounded-full mt-1.5"></div>
            
            <p className="text-xs text-purple-900/80 mt-2 font-medium">
              Digital Creator Summit 26 · Unión Adventista Panameña
            </p>
          </div>

          {/* Quick Metrics & Scroll to Live */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs bg-purple-50/90 px-3.5 py-2 rounded-xl border border-purple-200 shadow-inner font-mono">
              <span className="text-[#007D80] font-bold">{stats.completed} concluidas</span>
              <span className="text-purple-300">·</span>
              <span className="text-[#E01E7E] font-bold">{stats.current} en curso</span>
              <span className="text-purple-300">·</span>
              <span className="text-purple-800 font-semibold">{stats.upcoming} pendientes</span>
            </div>

            <button
              onClick={scrollToCurrent}
              className="min-h-[42px] px-3.5 py-2 text-xs font-black rounded-xl bg-gradient-to-r from-[#E01E7E] to-[#BD1567] hover:brightness-110 active:scale-95 text-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#E01E7E]/30 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Ver Actividad en Curso</span>
            </button>
          </div>
        </div>

        {/* Official Summit Schedule Banner: REGISTRO 7:45 AM · CIERRE 6:00 PM */}
        <div className="mt-5 py-2.5 px-4 rounded-full bg-gradient-to-r from-[#1C0235] via-[#2F0558] to-[#1C0235] border border-[#00D5D8]/50 shadow-md flex items-center justify-between text-center">
          <div className="w-full flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-black tracking-wider text-white">
            <span className="text-[#00D5D8]">REGISTRO: 7:45 AM</span>
            <span className="text-[#E01E7E] font-bold">·</span>
            <span className="text-white">CIERRE: 6:00 PM</span>
          </div>
        </div>

        {/* Stage Delay & Reschedule Controls */}
        <div className="mt-4 pt-3.5 border-t border-purple-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-bold text-[#1C0235] flex items-center gap-1 w-full xs:w-auto">
              <FastForward className="w-3.5 h-3.5 text-[#E01E7E]" />
              <span>Ajuste en vivo:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => onShiftSchedule(5)}
                className="min-h-[36px] px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-95 text-[#1C0235] border border-purple-200 transition-colors font-bold"
                title="Añadir 5 minutos a todas las actividades restantes"
              >
                +5 min
              </button>
              <button
                onClick={() => onShiftSchedule(10)}
                className="min-h-[36px] px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-95 text-[#1C0235] border border-purple-200 transition-colors font-bold"
                title="Añadir 10 minutos a todas las actividades restantes"
              >
                +10 min
              </button>
              <button
                onClick={() => onShiftSchedule(-5)}
                className="min-h-[36px] px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-95 text-purple-800 border border-purple-200 transition-colors font-bold"
                title="Restar 5 minutos a todas las actividades restantes"
              >
                -5 min
              </button>
              <button
                onClick={onResetSchedule}
                className="min-h-[36px] px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-95 text-purple-800 border border-purple-200 transition-colors flex items-center gap-1 font-medium"
                title="Restablecer a los horarios originales del PDF"
              >
                <RotateCcw className="w-3 h-3 text-[#E01E7E]" />
                <span>Restablecer</span>
              </button>
            </div>
          </div>

          <button
            onClick={onAddNewActivity}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-[#E01E7E] hover:bg-[#C21268] active:scale-95 text-white transition-colors flex items-center justify-center gap-1.5 font-black shadow-md shadow-[#E01E7E]/30 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Actividad</span>
          </button>
        </div>

      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs with authentic Summit colors on white cards */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`min-h-[38px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 active:scale-95 ${
              selectedCategory === 'all'
                ? 'bg-[#E01E7E] text-white shadow-md shadow-[#E01E7E]/30'
                : 'bg-white text-purple-900 hover:text-[#1C0235] border border-purple-200/80 shadow-sm'
            }`}
          >
            Todas ({items.length})
          </button>
          <button
            onClick={() => setSelectedCategory('keynote')}
            className={`min-h-[38px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 active:scale-95 ${
              selectedCategory === 'keynote'
                ? 'bg-[#E01E7E] text-white shadow-md shadow-[#E01E7E]/30'
                : 'bg-white text-purple-900 hover:text-[#1C0235] border border-purple-200/80 shadow-sm'
            }`}
          >
            Conferencias
          </button>
          <button
            onClick={() => setSelectedCategory('capsule')}
            className={`min-h-[38px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 active:scale-95 ${
              selectedCategory === 'capsule'
                ? 'bg-[#E01E7E] text-white shadow-md shadow-[#E01E7E]/30'
                : 'bg-white text-purple-900 hover:text-[#1C0235] border border-purple-200/80 shadow-sm'
            }`}
          >
            Microcápsulas (8)
          </button>
          <button
            onClick={() => setSelectedCategory('workshop')}
            className={`min-h-[38px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 active:scale-95 ${
              selectedCategory === 'workshop'
                ? 'bg-[#E01E7E] text-white shadow-md shadow-[#E01E7E]/30'
                : 'bg-white text-purple-900 hover:text-[#1C0235] border border-purple-200/80 shadow-sm'
            }`}
          >
            Talleres & Desafíos
          </button>
          <button
            onClick={() => setSelectedCategory('devotional')}
            className={`min-h-[38px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 active:scale-95 ${
              selectedCategory === 'devotional'
                ? 'bg-[#E01E7E] text-white shadow-md shadow-[#E01E7E]/30'
                : 'bg-white text-purple-900 hover:text-[#1C0235] border border-purple-200/80 shadow-sm'
            }`}
          >
            Devocionales
          </button>
        </div>

        {/* Search Input on White */}
        <div className="relative min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, orador o tema..."
            className="w-full min-h-[40px] bg-white border border-purple-200 rounded-xl px-3.5 py-2 text-xs text-[#1C0235] placeholder-purple-400 focus:outline-none focus:border-[#E01E7E] shadow-sm transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-[#1C0235] text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Main Agenda Cards List with Pure White Backgrounds & Summit Colors */}
      <div className="space-y-4 sm:space-y-6 pb-24">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-purple-200 shadow-md">
            <p className="text-purple-900 text-sm">No se encontraron actividades con ese criterio de búsqueda.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-3 text-xs text-[#E01E7E] hover:underline font-bold"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          filteredItems.map((item, index) => {
            const isNextCandidate = item.id === nextCandidateId;
            const metrics = getActivityMetrics(item, currentSecondsOfDay, isNextCandidate);
            const isTargetHighlight = targetHighlightId === item.id;
            const styleConfig = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.keynote;

            // Card states
            const isCurrent = metrics.status === 'current';
            const isNext = metrics.status === 'next';
            const isCompleted = metrics.status === 'completed';

            // Special authentic styling for "Almuerzo" banner like Page 5
            if (item.category === 'break') {
              return (
                <div
                  key={item.id}
                  id={item.id}
                  style={{
                    top: `calc(var(--cards-sticky-top, 5rem) + ${(index % 5) * 8}px)`,
                    zIndex: 10 + index,
                  }}
                  className={`sticky relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all text-center border shadow-xl ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#D91A80] to-[#FF2E93] text-white border-pink-300 shadow-2xl shadow-pink-950/40 ring-4 ring-[#00D5D8]'
                      : 'bg-gradient-to-r from-[#B51065] via-[#D91A80] to-[#B51065] text-white border-pink-300 shadow-lg'
                  }`}
                >
                  {/* Border Beam animated effect when break is active */}
                  {isCurrent && (
                    <BorderBeam
                      size={240}
                      duration={5}
                      colorFrom="#FFFFFF"
                      colorTo="#00D5D8"
                      borderWidth={2.5}
                    />
                  )}
                  <div className="flex items-center justify-between text-xs font-semibold px-2 mb-1">
                    <span className="font-mono text-pink-100 bg-black/25 px-2.5 py-0.5 rounded-full font-bold">
                      {formatTo12Hour(item.startTime)} – {formatTo12Hour(item.endTime)}
                    </span>
                    {isCurrent ? (
                      <span className="bg-white text-[#D91A80] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        ¡Almuerzo en Curso!
                      </span>
                    ) : isNext ? (
                      <span className="bg-[#00D5D8] text-[#1C0235] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Próximo en {formatSecondsToDigital(metrics.secondsUntilStart)}
                      </span>
                    ) : (
                      <span className="text-pink-100 font-bold">65 min</span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white drop-shadow-sm flex items-center justify-center gap-2">
                    <Utensils className="w-5 h-5 text-white" />
                    <span>{item.title}</span>
                  </h3>
                  <p className="text-xs text-pink-100 mt-1 max-w-md mx-auto">
                    {item.description || 'Área Social y Comedor · Espacio de confraternidad y networking'}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                id={item.id}
                style={{
                  top: `calc(var(--cards-sticky-top, 5rem) + ${(index % 5) * 8}px)`,
                  zIndex: 10 + index,
                }}
                className={`sticky group relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-300 border text-slate-900 shadow-xl ${
                  isCurrent
                    ? 'bg-white border-2 border-[#E01E7E] shadow-2xl shadow-[#E01E7E]/25 ring-4 ring-[#E01E7E]/15'
                    : isNext
                      ? 'bg-white border-2 border-[#00B4B7] shadow-xl shadow-[#00D5D8]/20 ring-2 ring-[#00D5D8]/20'
                      : isCompleted
                        ? 'bg-white/95 backdrop-blur-sm border border-purple-100 shadow-md opacity-90 hover:opacity-100'
                        : 'bg-white border border-purple-200/90 hover:border-purple-400 shadow-lg hover:shadow-2xl'
                } ${isTargetHighlight ? 'ring-4 ring-[#00D5D8] ring-offset-2 ring-offset-white' : ''}`}
              >
                {/* Border Beam animated effect when activity is in progress */}
                {isCurrent && (
                  <BorderBeam
                    size={220}
                    duration={5}
                    colorFrom="#E01E7E"
                    colorTo="#00D5D8"
                    borderWidth={2.5}
                  />
                )}
                {/* Status Bar for Current Activity on White Card */}
                {isCurrent && (
                  <div className="mb-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2 text-[#E01E7E]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E01E7E] animate-ping"></span>
                        <span className="tracking-wider uppercase font-black">EN CURSO AHORA</span>
                      </div>
                      <div className="font-mono tabular-nums text-[#007D80] font-black flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#007D80]" />
                        <span>{formatSecondsToDigital(metrics.secondsRemaining)} restantes</span>
                        <span className="text-purple-900/60 font-semibold">({Math.round(metrics.progressPercent)}%)</span>
                      </div>
                    </div>
                    {/* Visual Progress Bar in Summit gradient */}
                    <div className="w-full h-2.5 bg-purple-100 rounded-full overflow-hidden border border-purple-200">
                      <div
                        className="h-full bg-gradient-to-r from-[#E01E7E] via-[#FF2E93] to-[#00D5D8] transition-all duration-1000 ease-linear rounded-full"
                        style={{ width: `${metrics.progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Status Bar for Next Activity on White Card (The Approaching Alert Request!) */}
                {isNext && (
                  <div className="mb-3 flex items-center justify-between text-xs bg-cyan-50 border border-cyan-200/90 px-3.5 py-1.5 rounded-xl">
                    <div className="flex items-center gap-2 text-[#006E72] font-black">
                      <AlertCircle className="w-4 h-4 animate-bounce text-[#008285]" />
                      <span>PRÓXIMA ACTIVIDAD EN EL CRONOGRAMA</span>
                    </div>
                    <div className="font-mono tabular-nums font-black text-[#007D80]">
                      Inicia en {formatSecondsToDigital(metrics.secondsUntilStart)}
                    </div>
                  </div>
                )}

                {/* Card Content Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    
                    {/* Meta tag row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      
                      {/* Document bullet dot */}
                      <span className={`w-2.5 h-2.5 rounded-full ${styleConfig.dotColor} shrink-0 shadow-sm`}></span>

                      {/* Time badge */}
                      <span className="font-mono font-bold text-[#1C0235] bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                        {formatTo12Hour(item.startTime)} – {formatTo12Hour(item.endTime)}
                      </span>

                      {/* Duration */}
                      <span className="text-purple-700 text-xs font-semibold">
                        {metrics.durationMinutes} min
                      </span>

                      {/* Category Badge */}
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${styleConfig.badgeClass}`}>
                        {styleConfig.label}
                      </span>

                      {/* Completed badge */}
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-[11px] text-[#008285] font-bold bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                          <Check className="w-3.5 h-3.5" />
                          <span>Completada</span>
                        </span>
                      )}
                    </div>

                    {/* Title in Deep Summit Purple */}
                    <h3 className={`text-base sm:text-lg font-black leading-snug ${
                      isCurrent ? 'text-[#1C0235]' : isCompleted ? 'text-purple-950/80' : 'text-[#1C0235]'
                    }`}>
                      {item.title}
                    </h3>

                    {/* Speaker in Summit Berry Magenta */}
                    {item.speaker && (
                      <div className="flex items-center gap-1.5 text-xs text-[#C21268] font-bold">
                        <User className="w-3.5 h-3.5 text-[#C21268] shrink-0" />
                        <span>{item.speaker}</span>
                      </div>
                    )}

                    {/* Description in readable plum slate */}
                    {item.description && (
                      <p className="text-xs text-purple-950/75 line-clamp-2 pt-0.5 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    )}

                    {/* Location */}
                    {item.location && (
                      <div className="flex items-center gap-1.5 text-[11px] text-purple-900/70 pt-0.5 font-medium">
                        <MapPin className="w-3 h-3 text-[#E01E7E] shrink-0" />
                        <span>{item.location}</span>
                      </div>
                    )}

                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex items-center sm:flex-col items-end gap-2 shrink-0 self-end sm:self-start pt-1 sm:pt-0">
                    <button
                      onClick={() => onEditActivity(item)}
                      className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-95 text-[#1C0235] hover:text-[#E01E7E] border border-purple-200 transition-all shadow-sm"
                      title="Editar horarios o datos de la actividad"
                      aria-label="Editar actividad"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {isCurrent && (
                      <button
                        onClick={() => onShiftSchedule(5, item.id)}
                        className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#E01E7E] hover:bg-[#C21268] active:scale-95 text-white border border-pink-400 text-xs font-black transition-all whitespace-nowrap shadow-md shadow-[#E01E7E]/30"
                        title="Ampliar esta actividad en +5 minutos y rodar las siguientes"
                      >
                        +5m tiempo
                      </button>
                    )}
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
