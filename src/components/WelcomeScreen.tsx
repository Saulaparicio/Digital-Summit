import React, { useState, useMemo } from 'react';
import {
  Sparkles, UserCheck, Search, Check, ShieldCheck,
  Camera, ArrowRight, X, Calendar, MapPin, Users, HelpCircle
} from 'lucide-react';
import { Delegate } from '../types/agenda';
import { soundEngine } from '../utils/audio';
import { triggerSummitConfetti } from '../utils/confetti';
import { BadgePhotoBooth } from './BadgePhotoBooth';
import { BorderBeam } from './magicui/BorderBeam';

interface WelcomeScreenProps {
  isOpen: boolean;
  onClose: () => void;
  delegates: Delegate[];
  checkedInIds: Set<string>;
  myDelegateId: string | null;
  onConfirmCheckIn: (delegateId: string, timestamp?: string) => void;
  onUpdateDelegatePhoto?: (delegateId: string, photoUrl: string) => void;
  onOpenOnboarding: () => void;
  onOpenFullCheckInModal: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  isOpen,
  onClose,
  delegates,
  checkedInIds,
  myDelegateId,
  onConfirmCheckIn,
  onUpdateDelegatePhoto,
  onOpenOnboarding,
  onOpenFullCheckInModal
}) => {
  const [search, setSearch] = useState('');
  const [selectedDelegate, setSelectedDelegate] = useState<Delegate | null>(() => {
    if (myDelegateId) {
      return delegates.find(d => d.id === myDelegateId) || null;
    }
    return null;
  });
  const [isPhotoBoothOpen, setIsPhotoBoothOpen] = useState(false);
  const [justConfirmed, setJustConfirmed] = useState(false);

  // Filter delegates based on search query
  const searchResults = useMemo(() => {
    if (!search.trim()) return delegates.slice(0, 6);
    const q = search.toLowerCase().trim();
    return delegates.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.association.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [search, delegates]);

  if (!isOpen) return null;

  const myDelegate = selectedDelegate || (myDelegateId ? delegates.find(d => d.id === myDelegateId) : null);
  const isConfirmed = myDelegate ? checkedInIds.has(myDelegate.id) : false;

  const handleQuickConfirm = (del: Delegate) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    onConfirmCheckIn(del.id, timeStr);
    setSelectedDelegate(del);
    soundEngine.playStartedAlert();
    triggerSummitConfetti();
    setJustConfirmed(true);

    setTimeout(() => {
      setJustConfirmed(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#140124]/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">

      {/* Welcome Modal Container with Border Beam */}
      <div className="relative max-w-xl w-full mx-auto my-auto rounded-3xl overflow-hidden border-2 border-purple-200/90 bg-white text-slate-900 shadow-2xl flex flex-col max-h-[94vh]">
        <BorderBeam
          size={280}
          duration={6}
          colorFrom="#E01E7E"
          colorTo="#00D5D8"
          borderWidth={2}
        />

        {/* Top Decorative Summit Banner */}
        <div className="relative p-6 sm:p-7 bg-gradient-to-br from-[#1C0235] via-[#2A054E] to-[#E01E7E] text-white overflow-hidden shrink-0">

          {/* Subtle star elements */}
          <div className="absolute top-3 right-12 text-[#00D5D8] text-2xl font-black opacity-30 select-none">
            ★
          </div>
          <div className="absolute bottom-2 right-4 text-white text-xl font-black opacity-20 select-none">
            ✦
          </div>

          <div className="flex items-center justify-between">
            {/* Logo capsule with Border Beam */}
            <div className="relative overflow-hidden rounded-2xl p-1.5 px-3 bg-[#1C0235]/80 backdrop-blur-md border border-[#E01E7E]/50 shadow-md flex items-center justify-center">
              <BorderBeam
                size={120}
                duration={4}
                colorFrom="#E01E7E"
                colorTo="#00D5D8"
                borderWidth={2}
              />
              <img
                src="/summit-logo.png"
                alt="Digital Creator Summit"
                className="h-7 sm:h-8 w-auto object-contain drop-shadow-md shrink-0"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-black uppercase text-[#00D5D8] border border-white/20">
                PNM26
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Cerrar pantalla de bienvenida"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              ¡Bienvenido(a), Creador Digital!
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 font-medium max-w-md">
              “En Cristo, todas las cosas son nuevas.” Confirma tu asistencia para habilitar tu acreditación y gafete oficial.
            </p>
          </div>

        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">

          {/* CELEBRATION ALERT WHEN JUST CONFIRMED */}
          {justConfirmed && (
            <div className="p-3.5 rounded-2xl bg-teal-50 border-2 border-[#00B4B7] text-[#007D80] animate-in zoom-in-95 duration-200 text-center space-y-0.5 shadow-md">
              <div className="text-sm font-black flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#007D80]" />
                <span>¡Asistencia Confirmada! ¡Bienvenido al Summit!</span>
              </div>
              <p className="text-xs font-semibold text-purple-900">
                Tu acreditación está validada y lista para entrega en la recepción de la UAP.
              </p>
            </div>
          )}

          {/* ACTIVE / MY DELEGATE BADGE VIEW (IF SELECTED) */}
          {myDelegate ? (
            <div className="p-4 sm:p-5 rounded-2xl border-2 border-purple-200/90 bg-gradient-to-b from-purple-50/50 to-white shadow-md space-y-4">

              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#007D80] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#007D80]" />
                  <span>Tu Acreditación Oficial</span>
                </span>

                <button
                  onClick={() => setSelectedDelegate(null)}
                  className="text-xs text-purple-700 hover:text-[#1C0235] font-bold underline"
                >
                  Cambiar participante
                </button>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Photo or initial */}
                  <div
                    onClick={() => setIsPhotoBoothOpen(true)}
                    className="relative cursor-pointer group shrink-0"
                    title="Tomar o cambiar foto con marco oficial"
                  >
                    {myDelegate.photoUrl ? (
                      <img
                        src={myDelegate.photoUrl}
                        alt={myDelegate.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-[#E01E7E] shadow-md group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ring-2 ring-[#E01E7E] bg-gradient-to-tr from-[#E01E7E] to-[#1C0235] text-white flex items-center justify-center text-xl sm:text-2xl font-black shadow-md group-hover:scale-105 transition-transform">
                        {myDelegate.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#E01E7E] text-white border border-white shadow">
                      <Camera className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-base sm:text-lg font-black text-[#1C0235] truncate">
                      {myDelegate.name}
                    </h4>
                    <p className="text-xs font-bold text-[#007D80] truncate">
                      {myDelegate.association}
                    </p>
                    <span className="text-[10px] text-purple-600 block">
                      Delegado Oficial UAP
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {isConfirmed ? (
                    <span className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#007D80] text-xs font-black inline-flex items-center gap-1 shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Confirmado</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleQuickConfirm(myDelegate)}
                      className="min-h-[42px] px-3.5 py-1.5 rounded-xl bg-[#E01E7E] hover:bg-[#C21268] active:scale-95 text-white text-xs font-black shadow-md shadow-[#E01E7E]/30 transition-all flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Confirmar Llegada</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Action row on badge */}
              <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setIsPhotoBoothOpen(true)}
                  className="min-h-[40px] flex-1 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#1C0235] text-xs font-black border border-purple-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5 text-[#E01E7E]" />
                  <span>{myDelegate.photoUrl ? 'Cambiar Foto con Marco' : 'Tomar Foto con Marco Oficial'}</span>
                </button>
              </div>

            </div>

          ) : (

            /* SEARCH & SELECT PARTICIPANT */
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-[#1C0235] flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#E01E7E]" />
                  <span>Realiza tu Check-in en 1 Clic</span>
                </span>
                <p className="text-xs text-purple-900/80 font-medium">
                  Busca tu nombre en la lista de los 94 delegados para confirmar tu asistencia:
                </p>
              </div>

              {/* Search box */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Escribe tu nombre o asociación (ej. Gabriel, Natalia, Central)..."
                  className="w-full min-h-[44px] bg-white border-2 border-purple-200 rounded-2xl pl-10 pr-3 py-2 text-xs text-[#1C0235] placeholder-purple-400 focus:outline-none focus:border-[#E01E7E] shadow-sm transition-colors"
                />
              </div>

              {/* Delegate Suggestion List */}
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {searchResults.map(del => {
                  const confirmed = checkedInIds.has(del.id);
                  return (
                    <div
                      key={del.id}
                      className="p-2.5 rounded-xl border border-purple-200/90 bg-white hover:border-[#E01E7E] transition-all flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-black text-[#1C0235] block truncate">
                          {del.name}
                        </span>
                        <span className="text-[11px] text-purple-700 block truncate font-medium">
                          {del.association}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {confirmed ? (
                          <span className="px-2 py-0.5 rounded-lg bg-teal-50 text-[#007D80] border border-teal-200 text-[10px] font-black">
                            ✓ Confirmado
                          </span>
                        ) : (
                          <button
                            onClick={() => handleQuickConfirm(del)}
                            className="px-3 py-1 rounded-lg bg-[#E01E7E] text-white text-xs font-bold shadow-sm shadow-[#E01E7E]/30 hover:bg-[#C21268] active:scale-95 transition-all"
                          >
                            Confirmar
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedDelegate(del)}
                          className="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-semibold border border-purple-200"
                          title="Ver credencial"
                        >
                          Ver
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center pt-1">
                <button
                  onClick={onOpenFullCheckInModal}
                  className="text-xs text-[#E01E7E] hover:underline font-bold"
                >
                  ¿No estás en la lista? Regístrate aquí
                </button>
              </div>

            </div>
          )}

          {/* PRIMARY ENTER APP BUTTON & SECONDARY GUIDE BUTTON */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 min-h-[48px] px-5 py-2.5 rounded-2xl bg-[#E01E7E] hover:bg-[#C21268] active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#E01E7E]/30 transition-all cursor-pointer"
            >
              <span>Siguiente · Entrar al Evento</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenOnboarding}
              className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-[#007D80]" />
              <span>Ver Guía del Evento</span>
            </button>
          </div>

        </div>

        {/* Photo Booth Modal if opened from Welcome Screen */}
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

    </div>
  );
};
