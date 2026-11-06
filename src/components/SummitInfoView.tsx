import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, ExternalLink, Sparkles, Shirt, Clock, Instagram, 
  Radio, BookOpen, Quote, Calendar, Timer, CheckCircle2, ChevronRight, AlertCircle 
} from 'lucide-react';
import { VENUE_INFO, SPECIAL_GUESTS } from '../data/summitData';

export const SummitInfoView: React.FC = () => {
  // Official Summit Start Date: November 26, 2026, 07:45 AM (Panama UTC-5)
  const [targetDateStr, setTargetDateStr] = useState<string>('2026-11-26T07:45:00');
  const [now, setNow] = useState<Date>(() => new Date());

  // Dynamic ticking clock (1 second interval)
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute countdown metrics dynamically
  const countdown = useMemo(() => {
    const target = new Date(targetDateStr);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isStarted: true,
        totalHours: 0
      };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      isStarted: false,
      totalHours: Math.floor(totalSeconds / 3600)
    };
  }, [now, targetDateStr]);

  return (
    <div className="space-y-6">

      {/* LARGE 'DAYS UNTIL SUMMIT' COUNTDOWN TIMER CARD */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-white border-2 border-purple-200/90 shadow-2xl space-y-6 overflow-hidden text-slate-900">
        
        {/* Background decorative summit stars */}
        <div className="absolute top-4 right-4 text-[#E01E7E] text-3xl font-black select-none opacity-20">
          ★
        </div>
        <div className="absolute bottom-6 right-8 text-[#007D80] text-2xl font-black select-none opacity-20">
          ✦
        </div>

        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
          <div className="flex items-center gap-2 text-[#E01E7E] text-xs font-black uppercase tracking-wider">
            <Timer className="w-4 h-4 text-[#E01E7E]" />
            <span>CUENTA REGRESIVA OFICIAL · DIGITAL CREATOR SUMMIT PNM26</span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-full bg-teal-50 text-[#007D80] border border-teal-200 text-xs font-black flex items-center gap-1.5 shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-[#007D80]" />
              <span>Jueves, 26 de Noviembre de 2026 · 07:45 AM</span>
            </span>
          </div>
        </div>

        {/* Big Title */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1C0235] tracking-tight leading-tight">
            {countdown.isStarted 
              ? '¡El Digital Creator Summit está en Vivo!' 
              : 'Días Restantes para el Encuentro'}
          </h2>
          <p className="text-xs sm:text-sm text-purple-900/80 font-medium max-w-2xl">
            Tiempo exacto hasta la apertura formal y registro de delegados en la Unión Adventista Panameña (Edif. 0844, Balboa, Ancón).
          </p>
        </div>

        {/* Massive 4-Column Countdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          {/* DÍAS */}
          <div className="bg-purple-50/70 border-2 border-purple-200/90 rounded-2xl p-4 sm:p-6 text-center space-y-1 shadow-md hover:border-[#E01E7E] transition-colors">
            <span className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-black font-mono text-[#E01E7E] block leading-none tabular-nums drop-shadow-sm">
              {countdown.days.toString().padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm font-black text-[#1C0235] uppercase tracking-widest block pt-1">
              DÍAS
            </span>
            <span className="text-[10px] sm:text-[11px] text-purple-700 font-semibold block">
              para la inauguración
            </span>
          </div>

          {/* HORAS */}
          <div className="bg-purple-50/70 border-2 border-purple-200/90 rounded-2xl p-4 sm:p-6 text-center space-y-1 shadow-md hover:border-[#007D80] transition-colors">
            <span className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-black font-mono text-[#007D80] block leading-none tabular-nums drop-shadow-sm">
              {countdown.hours.toString().padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm font-black text-[#1C0235] uppercase tracking-widest block pt-1">
              HORAS
            </span>
            <span className="text-[10px] sm:text-[11px] text-purple-700 font-semibold block">
              reloj continuo
            </span>
          </div>

          {/* MINUTOS */}
          <div className="bg-purple-50/70 border-2 border-purple-200/90 rounded-2xl p-4 sm:p-6 text-center space-y-1 shadow-md hover:border-[#1C0235] transition-colors">
            <span className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-black font-mono text-[#1C0235] block leading-none tabular-nums drop-shadow-sm">
              {countdown.minutes.toString().padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm font-black text-[#1C0235] uppercase tracking-widest block pt-1">
              MINUTOS
            </span>
            <span className="text-[10px] sm:text-[11px] text-purple-700 font-semibold block">
              en tiempo real
            </span>
          </div>

          {/* SEGUNDOS */}
          <div className="bg-purple-50/70 border-2 border-purple-200/90 rounded-2xl p-4 sm:p-6 text-center space-y-1 shadow-md hover:border-[#00B4B7] transition-colors">
            <span className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-black font-mono text-[#00B4B7] block leading-none tabular-nums drop-shadow-sm">
              {countdown.seconds.toString().padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm font-black text-[#1C0235] uppercase tracking-widest block pt-1">
              SEGUNDOS
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#E01E7E] font-bold flex items-center justify-center gap-1.5 pt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#E01E7E] animate-ping" />
              <span>sincronizado</span>
            </span>
          </div>

        </div>

        {/* Status Callout Banner */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#007D80] shrink-0" />
            <p className="text-xs sm:text-sm text-[#1C0235] font-bold">
              {countdown.isStarted
                ? '¡El evento está en marcha! Revisa el cronograma en vivo para las sesiones actuales.'
                : `¡Estamos a ${countdown.days} días del Summit! Los 94 delegados recibirán su acreditación y suéter oficial en la recepción.`}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-800 shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#007D80]" />
            <span>Registro: 7:45 AM · Cierre: 6:00 PM</span>
          </div>
        </div>

      </div>
      
      {/* Hero Motto Card - Clean White Card with Summit Typography & Accents */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-white border-2 border-purple-200/90 shadow-2xl space-y-4 overflow-hidden">
        
        {/* Decorative corner stars */}
        <div className="absolute top-4 right-4 text-[#E01E7E] text-2xl font-black select-none opacity-20">
          ★
        </div>
        <div className="absolute bottom-4 right-8 text-[#007D80] text-xl font-black select-none opacity-20">
          ✦
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
          <div className="flex items-center gap-2 text-[#E01E7E] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#E01E7E]" />
            <span>DIGITAL CREATOR SUMMIT PNM26</span>
          </div>

          <div className="h-8 px-2.5 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-center self-start sm:self-auto shadow-sm">
            <img 
              src="/ov27-logo-color-v2.png" 
              alt="OneVoice27" 
              className="h-5 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://adventista.es/wp-content/uploads/2026/09/ov27-logo-color-v2.png';
              }}
            />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1C0235] tracking-tight leading-tight">
          “En Cristo, todas las cosas son nuevas.”
        </h1>

        <p className="text-sm sm:text-base text-purple-900/90 max-w-3xl leading-relaxed font-medium">
          Hoy nos reunimos como misioneros digitales: personas llamadas a usar cada medio, imagen, video y conversación para acercar a alguien a Jesús. Al unir nuestras voces y talentos, podemos llevar esperanza mucho más lejos.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-black tracking-wider">
          <span className="bg-pink-50 text-[#C21268] px-3.5 py-1 rounded-full border border-pink-200 shadow-sm">CREAR</span>
          <span className="text-purple-300">·</span>
          <span className="bg-teal-50 text-[#007D80] px-3.5 py-1 rounded-full border border-teal-200 shadow-sm">CONECTAR</span>
          <span className="text-purple-300">·</span>
          <span className="bg-purple-50 text-[#1C0235] px-3.5 py-1 rounded-full border border-purple-200 shadow-sm">COMPARTIR ESPERANZA</span>
        </div>
      </div>

      {/* General Event Logistics with authentic Cyan Badges (01, 02, 03) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Venue (01) */}
        <div className="bg-white border-2 border-purple-200/90 rounded-2xl p-5 space-y-3.5 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-[#00D5D8] text-[#1C0235] flex items-center justify-center font-black text-sm shadow-md shadow-[#00D5D8]/20">
                01
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#E01E7E]">LUGAR</span>
            </div>
            <div>
              <h3 className="text-base font-black text-[#1C0235] mt-0.5">{VENUE_INFO.name}</h3>
              <p className="text-xs text-purple-900/80 mt-1 font-medium">{VENUE_INFO.address}</p>
            </div>
          </div>
          <a
            href="https://maps.google.com/?q=Union+Adventista+Panamena+Balboa+Ancon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#007D80] hover:text-[#005E61] hover:underline font-bold pt-2"
          >
            <span>ABRIR MAPA</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Schedule & Registration (02) */}
        <div className="bg-white border-2 border-purple-200/90 rounded-2xl p-5 space-y-3.5 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-[#00D5D8] text-[#1C0235] flex items-center justify-center font-black text-sm shadow-md shadow-[#00D5D8]/20">
                02
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#E01E7E]">LLEGADA Y REGISTRO</span>
            </div>
            <div>
              <h3 className="text-base font-black text-[#1C0235] mt-0.5">Desde las 7:45 AM</h3>
              <p className="text-xs text-purple-900/80 mt-1 font-medium">Te esperamos para registrarte. Cierre: 6:00 PM.</p>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-[11px] text-[#007D80] font-semibold">
            Llega con tiempo y mantente en contacto con tu departamental.
          </div>
        </div>

        {/* Dress code (03) */}
        <div className="bg-white border-2 border-purple-200/90 rounded-2xl p-5 space-y-3.5 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-[#00D5D8] text-[#1C0235] flex items-center justify-center font-black text-sm shadow-md shadow-[#00D5D8]/20">
                03
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#E01E7E]">VESTIMENTA</span>
            </div>
            <div>
              <h3 className="text-base font-black text-[#1C0235] mt-0.5">Casual o semiformal</h3>
              <p className="text-xs text-purple-900/80 mt-1 font-medium">
                Recibirás el suéter oficial del evento en color crema con el lema "Todas las cosas son nuevas".
              </p>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200 text-[11px] text-[#C21268] font-bold">
            Suéter oficial entregado en la entrada
          </div>
        </div>

      </div>

      {/* Special Guest Quotes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[#E01E7E] text-xl font-black">★</span>
          <h2 className="text-lg font-black text-white tracking-wider uppercase">
            INVITADOS ESPECIALES
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SPECIAL_GUESTS.slice(0, 4).map((guest, idx) => (
            <div key={idx} className="bg-white border-2 border-purple-200/90 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full ring-2 ring-[#E01E7E] bg-gradient-to-tr from-[#E01E7E] to-[#1C0235] flex items-center justify-center font-black text-white text-base shadow-md">
                    {guest.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-[#1C0235] flex items-center gap-1.5">
                      <span className="text-[#E01E7E]">•</span>
                      <span>{guest.name}</span>
                    </h4>
                    <p className="text-xs text-[#007D80] font-bold">{guest.role}</p>
                    <p className="text-[11px] text-purple-700/80 font-medium">{guest.organization}</p>
                  </div>
                </div>

                {guest.quote && (
                  <div className="bg-purple-50/70 rounded-2xl p-4 border border-purple-200 text-xs text-purple-900 italic leading-relaxed relative">
                    <Quote className="w-4 h-4 text-[#E01E7E] mb-1 opacity-70" />
                    “{guest.quote}”
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Networks & Content Hub */}
      <div className="bg-white border-2 border-purple-200/90 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#E01E7E] text-lg font-black">★</span>
              <h3 className="text-base font-black text-[#1C0235] uppercase tracking-wider">
                SIGAMOS CONECTADOS
              </h3>
            </div>
            <p className="text-xs text-purple-900/80 mt-0.5 font-medium">
              Seminarios, cápsulas, fotos del evento y transmisiones en vivo.
            </p>
          </div>

          <a
            href={VENUE_INFO.contentHubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#E01E7E] hover:bg-[#C21268] text-white text-xs font-black flex items-center gap-2 self-start sm:self-center shadow-lg shadow-[#E01E7E]/30 transition-all"
          >
            <BookOpen className="w-4 h-4 text-[#00D5D8]" />
            <span>abre.ai/creatorsummit26</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          {VENUE_INFO.socialHandles.map((handle, i) => (
            <a
              key={i}
              href={handle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 hover:border-[#E01E7E] hover:bg-white transition-all group shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-[#C21268] text-xs font-bold mb-1">
                <Instagram className="w-3.5 h-3.5" />
                <span className="truncate">{handle.handle}</span>
              </div>
              <span className="text-[11px] text-purple-800 group-hover:text-[#1C0235] truncate block font-medium">
                {handle.label}
              </span>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
};
