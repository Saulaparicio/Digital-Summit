import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, Search, CheckCircle2, UserCheck, QrCode, Sparkles, 
  MapPin, UserPlus, ArrowLeft, Download, Check, ShieldCheck, Share2, Camera, Image as ImageIcon
} from 'lucide-react';
import { Delegate } from '../types/agenda';
import { soundEngine } from '../utils/audio';
import { triggerSummitConfetti } from '../utils/confetti';
import { BadgePhotoBooth } from './BadgePhotoBooth';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  delegates: Delegate[];
  checkedInIds: Set<string>;
  onConfirmCheckIn: (delegateId: string, timestamp?: string) => void;
  onRemoveCheckIn: (delegateId: string) => void;
  onAddNewDelegate: (delegate: Delegate) => void;
  onUpdateDelegatePhoto?: (delegateId: string, photoUrl: string) => void;
  initialSelectedDelegateId?: string | null;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
  delegates,
  checkedInIds,
  onConfirmCheckIn,
  onRemoveCheckIn,
  onAddNewDelegate,
  onUpdateDelegatePhoto,
  initialSelectedDelegateId
}) => {
  const [search, setSearch] = useState('');
  const [selectedDelegate, setSelectedDelegate] = useState<Delegate | null>(null);
  const [isRegisteringNew, setIsRegisteringNew] = useState(false);
  const [isPhotoBoothOpen, setIsPhotoBoothOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAssoc, setNewAssoc] = useState('Asociación Central');
  const [showCelebration, setShowCelebration] = useState(false);

  // Sync initial selection if provided
  useEffect(() => {
    if (initialSelectedDelegateId) {
      const found = delegates.find(d => d.id === initialSelectedDelegateId);
      if (found) setSelectedDelegate(found);
    }
  }, [initialSelectedDelegateId, delegates, isOpen]);

  // Reset modal state on open
  useEffect(() => {
    if (isOpen && !initialSelectedDelegateId) {
      // If user had a previously saved "my delegate id", pre-select it
      try {
        const savedMyId = localStorage.getItem('summit_my_delegate_id');
        if (savedMyId) {
          const found = delegates.find(d => d.id === savedMyId);
          if (found) setSelectedDelegate(found);
        }
      } catch {}
    }
    if (!isOpen) {
      setShowCelebration(false);
      setIsRegisteringNew(false);
    }
  }, [isOpen, initialSelectedDelegateId, delegates]);

  const searchResults = useMemo(() => {
    if (!search.trim()) {
      return delegates.slice(0, 8); // default suggestions
    }
    const q = search.toLowerCase().trim();
    return delegates.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.association.toLowerCase().includes(q)
    );
  }, [search, delegates]);

  if (!isOpen) return null;

  const isSelectedConfirmed = selectedDelegate ? checkedInIds.has(selectedDelegate.id) : false;

  const handleConfirm = (del: Delegate) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    onConfirmCheckIn(del.id, timeStr);
    try {
      localStorage.setItem('summit_my_delegate_id', del.id);
    } catch {}

    soundEngine.playStartedAlert();
    triggerSummitConfetti();
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
    }, 4000);
  };

  const handleRegisterNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newDelegate: Delegate = {
      id: `del-custom-${Date.now()}`,
      name: newName.trim(),
      association: newAssoc,
      isCustom: true
    };

    onAddNewDelegate(newDelegate);
    setSelectedDelegate(newDelegate);
    handleConfirm(newDelegate);
    setIsRegisteringNew(false);
    setNewName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#140124]/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white border-2 border-purple-200/90 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl space-y-4 my-auto max-h-[92vh] flex flex-col text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-100 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <img 
              src="/summit-logo.png" 
              alt="Digital Creator Summit" 
              className="h-9 w-auto object-contain drop-shadow-sm shrink-0"
            />
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#1C0235] tracking-tight uppercase">
                Acreditación & Confirmación de Asistencia
              </h3>
              <p className="text-[11px] text-purple-900/80 font-medium">
                Digital Creator Summit 26 · UnaVoz27
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-w-[36px] min-h-[36px] flex items-center justify-center p-1.5 rounded-xl text-purple-600 hover:text-[#1C0235] hover:bg-purple-100 active:scale-95 transition-all"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto space-y-4 pr-1">

          {/* VIEW 1: REGISTRATION FORM FOR NEW ATTENDEE */}
          {isRegisteringNew ? (
            <div className="space-y-4 p-4 rounded-2xl bg-purple-50/60 border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#E01E7E]" />
                  <h4 className="text-xs font-black text-[#1C0235] uppercase">
                    Registrar Asistente / Invitado
                  </h4>
                </div>
                <button
                  onClick={() => setIsRegisteringNew(false)}
                  className="text-xs text-purple-700 hover:text-[#1C0235] font-bold flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver a la búsqueda</span>
                </button>
              </div>

              <form onSubmit={handleRegisterNew} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#1C0235]">Nombre y Apellido Completo *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ej: David Morales"
                    className="w-full min-h-[42px] bg-white border border-purple-200 rounded-xl px-3 py-2 text-[#1C0235] placeholder-purple-400 focus:outline-none focus:border-[#E01E7E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1C0235]">Asociación, Misión o Rol *</label>
                  <select
                    value={newAssoc}
                    onChange={(e) => setNewAssoc(e.target.value)}
                    className="w-full min-h-[42px] bg-white border border-purple-200 rounded-xl px-3 py-2 text-[#1C0235] focus:outline-none focus:border-[#E01E7E]"
                  >
                    <option value="Asociación Occidental">Asociación Occidental</option>
                    <option value="Asociación Central">Asociación Central</option>
                    <option value="Asociación Metropolitana">Asociación Metropolitana</option>
                    <option value="Asociación Atlántica">Asociación Atlántica</option>
                    <option value="Misión Sureste">Misión Sureste</option>
                    <option value="Bocas Mission">Bocas Mission</option>
                    <option value="Invitado Especial / Producción">Invitado Especial / Producción</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-[#E01E7E] hover:bg-[#C21268] active:scale-95 text-white font-black flex items-center justify-center gap-2 shadow-md shadow-[#E01E7E]/30 transition-all text-xs"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Registrarme y Confirmar Asistencia</span>
                </button>
              </form>
            </div>
          ) : selectedDelegate ? (
            
            /* VIEW 2: SELECTED DELEGATE DIGITAL BADGE (GAFETE DIGITAL) */
            <div className="space-y-4">
              
              {/* Back to search button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedDelegate(null)}
                  className="text-xs text-purple-700 hover:text-[#1C0235] font-bold flex items-center gap-1.5 min-h-[36px]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Buscar otro participante</span>
                </button>

                {isSelectedConfirmed && (
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-teal-50 text-[#007D80] border border-teal-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#007D80]" />
                    <span>Acreditado Oficial</span>
                  </span>
                )}
              </div>

              {/* Celebration Banner */}
              {showCelebration && (
                <div className="p-3.5 rounded-2xl bg-teal-50 border-2 border-[#00B4B7] text-[#007D80] animate-in zoom-in-95 duration-200 text-center space-y-1 shadow-md">
                  <div className="text-base font-black flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#007D80]" />
                    <span>¡Asistencia Confirmada con Éxito!</span>
                  </div>
                  <p className="text-xs font-semibold text-purple-900">
                    Bienvenido(a) al Digital Creator Summit 26. Tu acreditación está activa.
                  </p>
                </div>
              )}

              {/* Digital Badge (Gafete) Card */}
              <div className="relative rounded-3xl border-2 border-purple-200/90 bg-gradient-to-b from-white via-purple-50/30 to-purple-50/70 p-5 sm:p-6 shadow-xl overflow-hidden space-y-4">
                
                {/* Badge Top Header */}
                <div className="flex items-center justify-between border-b border-purple-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <img 
                      src="/summit-logo.png" 
                      alt="Digital Creator Summit" 
                      className="h-7 w-auto object-contain drop-shadow-sm shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#1C0235] block leading-none">
                        DIGITAL CREATOR SUMMIT 26
                      </span>
                      <span className="text-[9px] text-[#E01E7E] font-bold font-script text-xs">
                        UnaVoz27 · Panamá
                      </span>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200 font-bold">
                    ID: {selectedDelegate.id.toUpperCase()}
                  </span>
                </div>

                {/* Attendee Info & Photo Display */}
                <div className="flex items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div 
                      onClick={() => setIsPhotoBoothOpen(true)}
                      title="Haz clic para tomar o cambiar foto con marco oficial"
                      className="relative group cursor-pointer shrink-0"
                    >
                      {selectedDelegate.photoUrl ? (
                        <img
                          src={selectedDelegate.photoUrl}
                          alt={selectedDelegate.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#E01E7E] shadow-xl transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ring-2 ring-[#E01E7E] bg-gradient-to-tr from-[#E01E7E] via-[#2A054E] to-[#1C0235] flex items-center justify-center font-black text-white text-2xl sm:text-3xl shadow-lg transition-transform group-hover:scale-105">
                          {selectedDelegate.name.charAt(0)}
                        </div>
                      )}
                      
                      {/* Camera Badge Icon overlay */}
                      <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#E01E7E] text-white shadow-md border-2 border-white group-hover:bg-[#C21268] transition-colors">
                        <Camera className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <h2 className="text-lg sm:text-xl font-black text-[#1C0235] tracking-tight leading-snug truncate">
                        {selectedDelegate.name}
                      </h2>
                      
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-[#007D80] border border-teal-200 text-xs font-bold truncate">
                          {selectedDelegate.association}
                        </span>
                        <span className="text-[10px] text-purple-700 font-medium">
                          Delegado Oficial
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Photo Booth Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setIsPhotoBoothOpen(true)}
                    className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 border border-purple-200 text-[#1C0235] text-xs font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
                    title="Tomar foto con el marco oficial del Summit"
                  >
                    <Camera className="w-4 h-4 text-[#E01E7E]" />
                    <span className="hidden sm:inline">
                      {selectedDelegate.photoUrl ? 'Cambiar Foto con Marco' : 'Tomar Foto con Marco Oficial'}
                    </span>
                    <span className="sm:hidden">
                      {selectedDelegate.photoUrl ? 'Foto' : 'Tomar Foto'}
                    </span>
                  </button>
                </div>

                {/* Simulated QR Code & Barcode Area */}
                <div className="p-3 bg-white rounded-2xl border border-purple-200 flex items-center justify-between gap-3 shadow-inner">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-50 text-[#1C0235] border border-purple-200">
                      <QrCode className="w-8 h-8 text-[#1C0235]" />
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-700 block uppercase font-bold tracking-wider">
                        Acreditación de Acceso
                      </span>
                      <span className="font-mono text-xs font-black text-[#1C0235]">
                        {isSelectedConfirmed ? '✓ REGISTRO VALIDADO' : 'PENDIENTE DE LLEGADA'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-purple-600 block">Lema oficial:</span>
                    <span className="text-[10px] font-bold text-[#E01E7E] italic block">
                      "Todas las cosas son nuevas"
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {!isSelectedConfirmed ? (
                    <button
                      onClick={() => handleConfirm(selectedDelegate)}
                      className="min-h-[46px] flex-1 px-4 py-2.5 rounded-xl bg-[#E01E7E] hover:bg-[#C21268] active:scale-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#E01E7E]/30 transition-all"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Confirmar mi Asistencia y Llegada</span>
                    </button>
                  ) : (
                    <>
                      <div className="min-h-[44px] flex-1 px-3 py-2 rounded-xl bg-teal-50 border border-teal-200 text-[#007D80] text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#007D80]" />
                        <span>¡Asistencia Confirmada!</span>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm('¿Deseas desmarcar la asistencia de este participante?')) {
                            onRemoveCheckIn(selectedDelegate.id);
                          }
                        }}
                        className="min-h-[44px] px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold border border-purple-200 transition-colors"
                      >
                        Deshacer
                      </button>
                    </>
                  )}
                </div>

              </div>

              {/* Photo Booth Modal for Selected Delegate */}
              {selectedDelegate && (
                <BadgePhotoBooth
                  isOpen={isPhotoBoothOpen}
                  onClose={() => setIsPhotoBoothOpen(false)}
                  delegate={selectedDelegate}
                  onSavePhoto={(photoDataUrl) => {
                    setSelectedDelegate(prev => prev ? { ...prev, photoUrl: photoDataUrl } : null);
                    if (onUpdateDelegatePhoto) {
                      onUpdateDelegatePhoto(selectedDelegate.id, photoDataUrl);
                    }
                  }}
                />
              )}
            </div>

          ) : (

            /* VIEW 3: SEARCH FOR DELEGATE */
            <div className="space-y-4">
              
              {/* Instructions banner */}
              <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-[#E01E7E] shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-[#1C0235]">
                    Ingresa tu nombre o apellido para confirmar tu asistencia:
                  </p>
                  <p className="text-purple-900/80">
                    Al confirmar, recibirás tu acreditación oficial y quedarás registrado en la lista de asistencia del evento.
                  </p>
                </div>
              </div>

              {/* Search input with autofocus */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Escribe tu nombre o asociación (ej. Natalia, Gabriel, Occidental)..."
                  className="w-full min-h-[46px] bg-white border-2 border-purple-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#1C0235] placeholder-purple-400 focus:outline-none focus:border-[#E01E7E] transition-colors shadow-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-700 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Results list */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-purple-800 font-bold px-1">
                  <span>{search ? `Resultados encontrados (${searchResults.length})` : 'Participantes sugeridos:'}</span>
                  <span>Total: {delegates.length} delegados</span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                  {searchResults.length === 0 ? (
                    <div className="p-6 text-center space-y-2 rounded-2xl bg-purple-50/40 border border-purple-200">
                      <p className="text-xs text-purple-900 font-bold">
                        No se encontró ningún delegado con "{search}".
                      </p>
                      <button
                        onClick={() => {
                          setNewName(search);
                          setIsRegisteringNew(true);
                        }}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#E01E7E] text-white text-xs font-bold shadow-md shadow-[#E01E7E]/30 inline-flex items-center gap-1.5 active:scale-95 transition-all"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Registrarme con este nombre</span>
                      </button>
                    </div>
                  ) : (
                    searchResults.map(del => {
                      const isConfirmed = checkedInIds.has(del.id);
                      return (
                        <div
                          key={del.id}
                          onClick={() => setSelectedDelegate(del)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm active:scale-[0.99] ${
                            isConfirmed
                              ? 'bg-teal-50/50 border-[#00B4B7] hover:border-[#008285]'
                              : 'bg-white border-purple-200/90 hover:border-[#E01E7E] hover:bg-pink-50/20'
                          }`}
                        >
                          <div className="min-w-0 space-y-0.5">
                            <span className="text-xs font-black text-[#1C0235] block truncate">
                              {del.name}
                            </span>
                            <span className="text-[11px] text-purple-700 block truncate font-medium">
                              {del.association}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isConfirmed ? (
                              <span className="px-2 py-1 rounded-xl bg-teal-50 text-[#007D80] border border-teal-200 text-[10px] font-black flex items-center gap-1">
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>Confirmado</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                className="px-3 py-1.5 rounded-xl bg-[#E01E7E] text-white text-xs font-bold shadow-sm shadow-[#E01E7E]/30"
                              >
                                Seleccionar
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Not on the list option */}
              <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-xs">
                <span className="text-purple-800 font-medium">¿No estás en la lista de delegados?</span>
                <button
                  onClick={() => setIsRegisteringNew(true)}
                  className="font-bold text-[#E01E7E] hover:underline flex items-center gap-1 min-h-[36px]"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Regístrate aquí</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
