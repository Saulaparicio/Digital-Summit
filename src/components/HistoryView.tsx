import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, Clock, User, MapPin, ArrowRight, FileText, 
  Copy, Check, Share2, Sparkles, Filter, Search, RotateCcw,
  BookOpen, ChevronRight, PenLine
} from 'lucide-react';
import { AgendaItem, ActivityCategory } from '../types/agenda';
import { timeStringToMinutes, formatTo12Hour } from '../utils/timeUtils';

interface HistoryViewProps {
  items: AgendaItem[];
  currentSecondsOfDay: number;
  onViewInAgenda: (id: string) => void;
  onJumpToSimulatedTime?: (timeStr: string) => void;
}

const CATEGORY_TAGS: Record<ActivityCategory, { label: string; dot: string; badge: string }> = {
  ceremony: { label: 'Ceremonia', dot: 'bg-[#E01E7E]', badge: 'bg-purple-50 text-[#3A076C] border border-purple-200' },
  devotional: { label: 'Devocional', dot: 'bg-[#E01E7E]', badge: 'bg-pink-50 text-[#C21268] border border-pink-200' },
  keynote: { label: 'Conferencia', dot: 'bg-[#009AA6]', badge: 'bg-cyan-50 text-[#006E72] border border-cyan-200' },
  capsule: { label: 'Microcápsula', dot: 'bg-[#E01E7E]', badge: 'bg-pink-50 text-[#C21268] border border-pink-200' },
  workshop: { label: 'Taller / Desafío', dot: 'bg-[#009AA6]', badge: 'bg-purple-50 text-[#5B108E] border border-purple-200' },
  panel: { label: 'Conversatorio', dot: 'bg-[#009AA6]', badge: 'bg-cyan-50 text-[#006E72] border border-cyan-200' },
  break: { label: 'Almuerzo', dot: 'bg-[#E01E7E]', badge: 'bg-[#E01E7E] text-white border border-pink-400' }
};

export const HistoryView: React.FC<HistoryViewProps> = ({
  items,
  currentSecondsOfDay,
  onViewInAgenda,
  onJumpToSimulatedTime
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // User notes saved per activity in LocalStorage
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('summit_history_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeNoteEditId, setActiveNoteEditId] = useState<string | null>(null);

  const saveNote = (id: string, text: string) => {
    const updated = { ...notes, [id]: text };
    setNotes(updated);
    try {
      localStorage.setItem('summit_history_notes', JSON.stringify(updated));
    } catch {}
  };

  // Filter completed activities (whose end time <= currentSecondsOfDay)
  const completedActivities = useMemo(() => {
    return items
      .filter((item) => {
        const endSec = timeStringToMinutes(item.endTime) * 60;
        return currentSecondsOfDay >= endSec;
      })
      .sort((a, b) => timeStringToMinutes(b.startTime) - timeStringToMinutes(a.startTime)); // Most recently ended first
  }, [items, currentSecondsOfDay]);

  // Filtered by search and category
  const filteredCompleted = useMemo(() => {
    return completedActivities.filter((item) => {
      const matchCat = selectedCat === 'all' || item.category === selectedCat;
      const matchSearch =
        search === '' ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.speaker && item.speaker.toLowerCase().includes(search.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [completedActivities, selectedCat, search]);

  // Compute total duration of completed sessions
  const totalCompletedMinutes = useMemo(() => {
    return completedActivities.reduce((acc, item) => {
      const duration = timeStringToMinutes(item.endTime) - timeStringToMinutes(item.startTime);
      return acc + Math.max(0, duration);
    }, 0);
  }, [completedActivities]);

  const latestCompleted = completedActivities.length > 0 ? completedActivities[0] : null;

  // Copy single session summary
  const handleCopySession = (item: AgendaItem) => {
    const sessionNote = notes[item.id] ? `\nNotas: ${notes[item.id]}` : '';
    const text = `Digital Creator Summit 26 · Actividad Concluida:\n"${item.title}"\nHorario: ${formatTo12Hour(item.startTime)} - ${formatTo12Hour(item.endTime)}\nResponsable: ${item.speaker || 'General'}\nDetalles: ${item.description || ''}${sessionNote}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Copy full history report
  const handleCopyAllHistory = () => {
    const lines = [
      `=== REPORTE DE HISTORIAL · DIGITAL CREATOR SUMMIT 26 ===`,
      `Actividades concluidas hasta las: ${formatTo12Hour(
        `${Math.floor(currentSecondsOfDay / 3600)}:${Math.floor((currentSecondsOfDay % 3600) / 60)}`
      )}`,
      `Total de sesiones finalizadas: ${completedActivities.length} de ${items.length}`,
      `Minutos acumulados de programa: ${totalCompletedMinutes} min\n`
    ];

    completedActivities
      .slice()
      .reverse()
      .forEach((item, index) => {
        lines.push(`${index + 1}. [${formatTo12Hour(item.startTime)} - ${formatTo12Hour(item.endTime)}] ${item.title}`);
        if (item.speaker) lines.push(`   Ponente: ${item.speaker}`);
        if (notes[item.id]) lines.push(`   Apuntes: ${notes[item.id]}`);
        lines.push('');
      });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Card on White */}
      <div className="relative bg-white border-2 border-purple-200/90 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden text-slate-900">
        
        {/* Subtle decorative stars and dots */}
        <div className="absolute top-4 right-4 text-[#E01E7E] text-2xl font-black select-none opacity-30">
          ★
        </div>
        <div className="absolute bottom-4 right-8 text-[#00D5D8] text-xl font-black select-none opacity-40">
          ✦
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#007D80] text-xl font-black">★</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1C0235] tracking-wider uppercase">
                HISTORIAL DE ACTIVIDADES
              </h2>
            </div>
            {/* The cyan underline bar from Page 5 */}
            <div className="w-20 h-1.5 bg-[#00D5D8] rounded-full mt-1.5"></div>
            
            <p className="text-xs text-purple-900/80 mt-2 font-medium">
              Registro cronológico de las sesiones que ya han concluido hoy en el Digital Creator Summit.
            </p>
          </div>

          {/* Quick Metrics & Full Report Export Button */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs bg-purple-50/90 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border border-purple-200 shadow-inner font-mono">
              <div className="flex items-center gap-1.5 text-[#007D80] font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#007D80] shrink-0" />
                <span>{completedActivities.length} de {items.length} concluidas</span>
              </div>
              <span className="text-purple-300">·</span>
              <span className="text-purple-800 font-semibold">{totalCompletedMinutes} min</span>
            </div>

            {completedActivities.length > 0 && (
              <button
                onClick={handleCopyAllHistory}
                className="min-h-[42px] px-3.5 py-2 text-xs font-black rounded-xl bg-gradient-to-r from-[#E01E7E] to-[#BD1567] hover:brightness-110 active:scale-95 text-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#E01E7E]/30 whitespace-nowrap w-full sm:w-auto"
                title="Copiar reporte de todas las actividades concluidas para relatoría o redes"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? '¡Reporte Copiado!' : 'Copiar Resumen General'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Most Recent Completed Activity Banner */}
        {latestCompleted && (
          <div className="mt-5 py-3 px-4 rounded-2xl bg-purple-50/80 border border-purple-200 shadow-inner flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#007D80] animate-ping"></span>
              <span className="text-purple-800 font-medium">Última sesión finalizada:</span>
              <strong className="text-[#1C0235] font-black">{latestCompleted.title}</strong>
              {latestCompleted.speaker && (
                <span className="text-[#C21268] font-bold hidden md:inline">({latestCompleted.speaker})</span>
              )}
            </div>
            <div className="font-mono text-[#007D80] bg-white px-2.5 py-1 rounded-lg border border-purple-200 self-start sm:self-center font-bold shadow-sm">
              Concluyó a las {formatTo12Hour(latestCompleted.endTime)}
            </div>
          </div>
        )}

      </div>

      {/* Empty State when no activity has finished yet */}
      {completedActivities.length === 0 ? (
        <div className="bg-white border-2 border-purple-200 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl text-slate-900">
          <div className="w-16 h-16 rounded-full bg-cyan-50 text-[#007D80] border border-cyan-200 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-black text-[#1C0235]">
              Aún no ha concluido ninguna actividad programada para hoy
            </h3>
            <p className="text-xs text-purple-900/75 leading-relaxed">
              El programa oficial inicia a las 7:45 AM con la Llegada y Registro. Conforme el reloj avance en tiempo real o en simulación, aquí se registrarán todas las actividades pasadas.
            </p>
          </div>

          {onJumpToSimulatedTime && (
            <div className="pt-2">
              <p className="text-xs text-purple-800 font-bold mb-2">
                ¿Deseas probar esta vista de inmediato con actividades simuladas ya concluidas?
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => onJumpToSimulatedTime('11:30')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#E01E7E] hover:bg-[#C21268] text-white text-xs font-bold transition-all shadow-md shadow-[#E01E7E]/30"
                >
                  Simular hora 11:30 AM (7 concluidas)
                </button>
                <button
                  onClick={() => onJumpToSimulatedTime('14:30')}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#007D80] border border-purple-200 text-xs font-bold transition-all shadow-sm"
                >
                  Simular hora 14:30 PM (Post-Almuerzo)
                </button>
                <button
                  onClick={() => onJumpToSimulatedTime('18:00')}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#1C0235] border border-purple-200 text-xs font-bold transition-all shadow-sm"
                >
                  Simular Cierre 18:00 PM (Evento completo)
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Filter Bar & Search on White */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedCat('all')}
                className={`min-h-[38px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                  selectedCat === 'all'
                    ? 'bg-[#E01E7E] text-white shadow-md shadow-[#E01E7E]/30'
                    : 'bg-white text-purple-900 hover:text-[#1C0235] border border-purple-200 shadow-sm'
                }`}
              >
                Todas las concluidas ({completedActivities.length})
              </button>
              <button
                onClick={() => setSelectedCat('keynote')}
                className={`min-h-[38px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                  selectedCat === 'keynote'
                    ? 'bg-[#E01E7E] text-white shadow-md shadow-[#E01E7E]/30'
                    : 'bg-white text-purple-900 hover:text-[#1C0235] border border-purple-200 shadow-sm'
                }`}
              >
                Conferencias
              </button>
              <button
                onClick={() => setSelectedCat('capsule')}
                className={`min-h-[38px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                  selectedCat === 'capsule'
                    ? 'bg-[#E01E7E] text-white shadow-md shadow-[#E01E7E]/30'
                    : 'bg-white text-purple-900 hover:text-[#1C0235] border border-purple-200 shadow-sm'
                }`}
              >
                Microcápsulas
              </button>
              <button
                onClick={() => setSelectedCat('workshop')}
                className={`min-h-[38px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                  selectedCat === 'workshop'
                    ? 'bg-[#E01E7E] text-white shadow-md shadow-[#E01E7E]/30'
                    : 'bg-white text-purple-900 hover:text-[#1C0235] border border-purple-200 shadow-sm'
                }`}
              >
                Talleres
              </button>
              <button
                onClick={() => setSelectedCat('devotional')}
                className={`min-h-[38px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                  selectedCat === 'devotional'
                    ? 'bg-[#E01E7E] text-white shadow-md shadow-[#E01E7E]/30'
                    : 'bg-white text-purple-900 hover:text-[#1C0235] border border-purple-200 shadow-sm'
                }`}
              >
                Devocionales
              </button>
            </div>

            {/* Search */}
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar en el historial..."
                className="w-full min-h-[40px] bg-white border border-purple-200 rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C0235] placeholder-purple-400 focus:outline-none focus:border-[#E01E7E] shadow-sm transition-colors"
              />
            </div>
          </div>

          {/* List of Completed Activities as White Cards */}
          <div className="space-y-3.5">
            {filteredCompleted.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-3xl border border-purple-200 shadow-sm text-slate-900">
                <p className="text-purple-900 text-xs">No se encontraron sesiones concluidas que coincidan con el filtro.</p>
                <button
                  onClick={() => { setSelectedCat('all'); setSearch(''); }}
                  className="mt-2 text-xs text-[#E01E7E] font-bold hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              filteredCompleted.map((item) => {
                const tagConfig = CATEGORY_TAGS[item.category] || CATEGORY_TAGS.keynote;
                const duration = timeStringToMinutes(item.endTime) - timeStringToMinutes(item.startTime);
                const isEditingThisNote = activeNoteEditId === item.id;
                const currentNote = notes[item.id] || '';

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-purple-200/80 hover:border-purple-300 rounded-2xl p-4 sm:p-5 transition-all shadow-md space-y-3 text-slate-900"
                  >
                    {/* Top Row: Completed status badge, times and actions */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {/* Success Check badge */}
                          <span className="flex items-center gap-1.5 font-bold text-[#007D80] bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full text-[11px]">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Concluida</span>
                          </span>

                          {/* Time badge */}
                          <span className="font-mono font-bold text-[#1C0235] bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                            {formatTo12Hour(item.startTime)} – {formatTo12Hour(item.endTime)}
                          </span>

                          {/* Duration */}
                          <span className="text-purple-700 text-xs font-semibold">
                            {duration} min ejecutados
                          </span>

                          {/* Category Badge */}
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${tagConfig.badge}`}>
                            {tagConfig.label}
                          </span>
                        </div>

                        {/* Title in Deep Summit Purple */}
                        <h3 className="text-base sm:text-lg font-black text-[#1C0235] leading-snug pt-0.5">
                          {item.title}
                        </h3>

                        {/* Speaker in Summit Berry Magenta */}
                        {item.speaker && (
                          <div className="flex items-center gap-1.5 text-xs text-[#C21268] font-bold">
                            <User className="w-3.5 h-3.5 shrink-0 text-[#C21268]" />
                            <span>{item.speaker}</span>
                          </div>
                        )}

                        {/* Description */}
                        {item.description && (
                          <p className="text-xs text-purple-950/75 leading-relaxed pt-0.5 font-normal">
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
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-start pt-1 sm:pt-0">
                        {/* Copy session summary */}
                        <button
                          onClick={() => handleCopySession(item)}
                          className="min-h-[38px] px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-95 text-[#1C0235] border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                          title="Copiar detalles de esta sesión"
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-[#007D80]" /> : <Copy className="w-3.5 h-3.5 text-purple-700" />}
                          <span>{copiedId === item.id ? 'Copiado' : 'Copiar'}</span>
                        </button>

                        {/* View in main agenda */}
                        <button
                          onClick={() => onViewInAgenda(item.id)}
                          className="min-h-[38px] px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-95 text-[#1C0235] border border-purple-200 text-xs font-bold flex items-center gap-1 transition-all shadow-sm"
                          title="Ubicar en el cronograma interactivo general"
                        >
                          <span>Ver en Agenda</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#E01E7E]" />
                        </button>
                      </div>
                    </div>

                    {/* Note / Conclusiones Strip */}
                    <div className="pt-2 border-t border-purple-100 text-xs">
                      {isEditingThisNote ? (
                        <div className="space-y-2 bg-purple-50/80 p-3 rounded-xl border border-purple-200">
                          <label className="font-bold text-[#1C0235] block">
                            Conclusiones o notas clave de esta sesión:
                          </label>
                          <textarea
                            rows={2}
                            defaultValue={currentNote}
                            placeholder="Escribe aprendizajes, acuerdos o citas destacadas del ponente..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                saveNote(item.id, (e.target as HTMLTextAreaElement).value);
                                setActiveNoteEditId(null);
                              }
                            }}
                            id={`note-input-${item.id}`}
                            className="w-full bg-white border border-purple-200 rounded-lg p-2 text-[#1C0235] text-xs focus:outline-none focus:border-[#E01E7E] shadow-sm"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveNoteEditId(null)}
                              className="px-2.5 py-1 text-[11px] text-purple-700 hover:text-[#1C0235]"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.getElementById(`note-input-${item.id}`) as HTMLTextAreaElement;
                                if (input) {
                                  saveNote(item.id, input.value);
                                }
                                setActiveNoteEditId(null);
                              }}
                              className="px-3 py-1 bg-[#E01E7E] hover:bg-[#C21268] text-white text-[11px] font-bold rounded-md"
                            >
                              Guardar Apunte
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3 text-purple-900">
                          {currentNote ? (
                            <div className="flex items-start gap-2 text-[#1C0235] italic bg-purple-50/70 px-3 py-1.5 rounded-lg border border-purple-200 flex-1">
                              <PenLine className="w-3.5 h-3.5 text-[#E01E7E] shrink-0 mt-0.5" />
                              <span className="line-clamp-2 font-medium">“{currentNote}”</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-purple-500">Sin notas registradas aún.</span>
                          )}

                          <button
                            onClick={() => setActiveNoteEditId(item.id)}
                            className="text-[11px] text-[#C21268] hover:underline font-bold flex items-center gap-1 shrink-0 ml-auto"
                          >
                            <PenLine className="w-3 h-3" />
                            <span>{currentNote ? 'Editar Apuntes' : '+ Agregar Apuntes'}</span>
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </>
      )}

    </div>
  );
};
