import React, { useState } from 'react';
import { X, Trash2, Save, Clock, User, MapPin } from 'lucide-react';
import { AgendaItem, ActivityCategory } from '../types/agenda';

interface EditActivityModalProps {
  activity: AgendaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: AgendaItem) => void;
  onDelete?: (id: string) => void;
}

const CATEGORIES: { value: ActivityCategory; label: string }[] = [
  { value: 'ceremony', label: 'Ceremonia / Registro' },
  { value: 'devotional', label: 'Devocional' },
  { value: 'keynote', label: 'Conferencia Magistral' },
  { value: 'capsule', label: 'Microcápsula' },
  { value: 'workshop', label: 'Taller / Desafío Grupal' },
  { value: 'panel', label: 'Panel / Conversatorio' },
  { value: 'break', label: 'Almuerzo / Receso' }
];

export const EditActivityModal: React.FC<EditActivityModalProps> = ({
  activity,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(activity?.title || '');
  const [speaker, setSpeaker] = useState(activity?.speaker || '');
  const [startTime, setStartTime] = useState(activity?.startTime || '09:00');
  const [endTime, setEndTime] = useState(activity?.endTime || '09:30');
  const [category, setCategory] = useState<ActivityCategory>(activity?.category || 'keynote');
  const [location, setLocation] = useState(activity?.location || 'Auditorio Central');
  const [description, setDescription] = useState(activity?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updatedItem: AgendaItem = {
      id: activity?.id || `act-${Date.now()}`,
      order: activity?.order || 99,
      title: title.trim(),
      speaker: speaker.trim() || undefined,
      startTime,
      endTime,
      category,
      location: location.trim() || undefined,
      description: description.trim() || undefined
    };

    onSave(updatedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#140124]/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white border-2 border-purple-200/90 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-100 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[#E01E7E] text-sm font-black">★</span>
            <h3 className="text-sm sm:text-base font-black text-[#1C0235]">
              {activity ? 'Editar Actividad del Programa' : 'Agregar Nueva Actividad'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-w-[36px] min-h-[36px] flex items-center justify-center p-1.5 rounded-xl text-purple-600 hover:text-[#1C0235] hover:bg-purple-100 active:scale-95 transition-all"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs overflow-y-auto pr-1">
          {/* Title */}
          <div className="space-y-1">
            <label className="font-bold text-[#1C0235]">Título de la actividad *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Formatos cortos que funcionan"
              className="w-full min-h-[42px] bg-purple-50/50 border border-purple-200 rounded-xl px-3 py-2 text-[#1C0235] placeholder-purple-400 focus:outline-none focus:bg-white focus:border-[#E01E7E] transition-colors"
            />
          </div>

          {/* Speaker */}
          <div className="space-y-1">
            <label className="font-bold text-[#1C0235]">Ponente / Responsable</label>
            <input
              type="text"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              placeholder="Ej: Abel Márquez"
              className="w-full min-h-[42px] bg-purple-50/50 border border-purple-200 rounded-xl px-3 py-2 text-[#1C0235] placeholder-purple-400 focus:outline-none focus:bg-white focus:border-[#E01E7E] transition-colors"
            />
          </div>

          {/* Time range */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#1C0235] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#007D80]" />
                <span>Inicio (24h)</span>
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full min-h-[42px] bg-purple-50/50 border border-purple-200 rounded-xl px-3 py-2 text-[#1C0235] focus:outline-none focus:bg-white focus:border-[#E01E7E] font-mono text-center sm:text-left transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#1C0235] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#007D80]" />
                <span>Fin (24h)</span>
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full min-h-[42px] bg-purple-50/50 border border-purple-200 rounded-xl px-3 py-2 text-[#1C0235] focus:outline-none focus:bg-white focus:border-[#E01E7E] font-mono text-center sm:text-left transition-colors"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="font-bold text-[#1C0235]">Tipo de Actividad</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ActivityCategory)}
              className="w-full min-h-[42px] bg-purple-50/50 border border-purple-200 rounded-xl px-3 py-2 text-[#1C0235] focus:outline-none focus:bg-white focus:border-[#E01E7E] transition-colors"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="font-bold text-[#1C0235]">Ubicación / Sala</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Auditorio Central"
              className="w-full min-h-[42px] bg-purple-50/50 border border-purple-200 rounded-xl px-3 py-2 text-[#1C0235] placeholder-purple-400 focus:outline-none focus:bg-white focus:border-[#E01E7E] transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-[#1C0235]">Descripción o notas adicionales</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles sobre el enfoque, material o dinámica..."
              className="w-full bg-purple-50/50 border border-purple-200 rounded-xl px-3 py-2 text-[#1C0235] placeholder-purple-400 focus:outline-none focus:bg-white focus:border-[#E01E7E] transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-purple-100 shrink-0 gap-2">
            {activity && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Eliminar esta actividad del programa?')) {
                    onDelete(activity.id);
                    onClose();
                  }
                }}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 border border-rose-200 flex items-center gap-1.5 font-bold transition-all text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Eliminar</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 active:scale-95 text-[#1C0235] transition-all font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#E01E7E] hover:bg-[#C21268] active:scale-95 text-white font-black flex items-center gap-1.5 shadow-md shadow-[#E01E7E]/30 transition-all text-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
