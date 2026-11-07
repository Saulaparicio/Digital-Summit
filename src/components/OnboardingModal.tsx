import React, { useState } from 'react';
import { 
  Sparkles, Calendar, Clock, Bell, UserCheck, 
  Camera, MapPin, ChevronRight, ChevronLeft, Check, Shirt, ShieldCheck 
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

interface OnboardingStep {
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  highlights: string[];
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps: OnboardingStep[] = [
    {
      badge: '01 · BIENVENIDA Y LEMA',
      badgeColor: 'bg-pink-100 text-[#E01E7E] border-pink-200',
      title: 'Digital Creator Summit 26',
      subtitle: '“En Cristo, todas las cosas son nuevas” · UnaVoz27',
      icon: (
        <div className="w-24 h-16 flex items-center justify-center shrink-0">
          <img 
            src="/summit-logo.png" 
            alt="Digital Creator Summit" 
            className="w-full h-auto max-h-14 object-contain drop-shadow-md" 
          />
        </div>
      ),
      content: (
        <p className="text-xs sm:text-sm text-purple-900/90 leading-relaxed font-medium">
          La Unión Adventista Panameña reúne a los misioneros digitales de todo el país para conectar, compartir esperanza e inspirar a través de medios, video y creatividad.
        </p>
      ),
      highlights: [
        'Lugar: Sede de la UAP, Edif. 0844, Balboa, Ancón',
        'Horario: Sábado 7 de Noviembre · Desde las 7:45 AM hasta las 6:00 PM',
        'Vestimenta: Casual / semiformal. Recibirás tu suéter oficial en color crema'
      ]
    },
    {
      badge: '02 · TIEMPO REAL & AVISOS',
      badgeColor: 'bg-teal-100 text-[#007D80] border-teal-200',
      title: 'Gestor de Agenda y Cronograma Vivo',
      subtitle: 'Alertas automáticas en el centro de tu pantalla con sonido',
      icon: (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#007D80] to-[#00D5D8] text-[#1C0235] flex items-center justify-center shadow-lg shadow-[#007D80]/30">
          <Clock className="w-9 h-9 stroke-[2.5]" />
        </div>
      ),
      content: (
        <p className="text-xs sm:text-sm text-purple-900/90 leading-relaxed font-medium">
          El gestor calcula automáticamente el tiempo que resta para la próxima actividad y te avisa mediante una notificación central con fondo difuminado y campanada.
        </p>
      ),
      highlights: [
        'Alertas a 5 min, 2 min y al momento exacto de inicio',
        'Cronómetro de escenario para ponentes y moderadores',
        'Barra de progreso circular que mide el avance del evento'
      ]
    },
    {
      badge: '03 · ACREDITACIÓN & GAFETE',
      badgeColor: 'bg-purple-100 text-[#1C0235] border-purple-200',
      title: 'Confirma tu Asistencia & Foto Oficial',
      subtitle: '94 delegados de las 6 asociaciones y misiones de Panamá',
      icon: (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1C0235] to-[#E01E7E] text-white flex items-center justify-center shadow-lg shadow-[#1C0235]/30">
          <Camera className="w-9 h-9" />
        </div>
      ),
      content: (
        <p className="text-xs sm:text-sm text-purple-900/90 leading-relaxed font-medium">
          Busca tu nombre en la lista de participantes para validar tu llegada con efecto confetti, y tómate tu foto oficial con el marco conmemorativo del evento.
        </p>
      ),
      highlights: [
        'Gafete digital con código de acceso y datos oficiales',
        'Estudio de foto con marco en colores neón, cian y magenta',
        'Gráfico interactivo de quórum y porcentaje de confirmación'
      ]
    },
    {
      badge: '04 · CONFERENCIAS & HUB',
      badgeColor: 'bg-pink-100 text-[#C21268] border-pink-200',
      title: 'Invitados Especiales & Recursos',
      subtitle: 'Aprende y conéctate con líderes de la comunicación',
      icon: (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#E01E7E] to-[#00D5D8] text-white flex items-center justify-center shadow-lg shadow-[#E01E7E]/30">
          <Sparkles className="w-9 h-9" />
        </div>
      ),
      content: (
        <p className="text-xs sm:text-sm text-purple-900/90 leading-relaxed font-medium">
          Conferencias magistrales con el Dr. Abel Márquez (DIA), Michelle Rivera, Pr. José De Gracia y talleres prácticos de contenido digital.
        </p>
      ),
      highlights: [
        'Hub de contenidos y fotos: abre.ai/creatorsummit26',
        'Transmisión en vivo por las redes de HopeMedia Panamá',
        'Desafíos grupales y microcápsulas de aprendizaje'
      ]
    }
  ];

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#140124]/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      
      {/* Onboarding Dialog Card */}
      <div className="relative max-w-lg w-full mx-auto my-auto rounded-3xl overflow-hidden border-2 border-purple-200/90 bg-white text-slate-900 shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] sm:text-xs font-black px-3 py-1 rounded-full border ${step.badgeColor} uppercase tracking-wider`}>
              {step.badge}
            </span>
          </div>

          <button
            onClick={onSkip}
            className="text-xs font-bold text-purple-700 hover:text-[#1C0235] px-2.5 py-1 rounded-lg hover:bg-purple-100 transition-colors"
          >
            Saltar Guía
          </button>
        </div>

        {/* Step Body */}
        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto">
          
          {/* Icon & Title Row */}
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              {step.icon}
            </div>

            <div className="space-y-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-black text-[#1C0235] tracking-tight leading-tight">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#E01E7E]">
                {step.subtitle}
              </p>
            </div>
          </div>

          {/* Description */}
          {step.content}

          {/* Bullet Highlights in Pill Cards */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-900 block">
              Puntos Clave:
            </span>
            <div className="space-y-1.5">
              {step.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-purple-50/80 border border-purple-200 text-xs font-medium text-purple-950">
                  <Check className="w-4 h-4 text-[#007D80] shrink-0 mt-0.5 stroke-[3]" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Navigation Row */}
        <div className="p-4 sm:p-5 border-t border-purple-100 bg-purple-50/50 flex items-center justify-between gap-3">
          
          {/* Step Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep 
                    ? 'w-6 bg-[#E01E7E]' 
                    : 'w-2 bg-purple-300 hover:bg-purple-400'
                }`}
                aria-label={`Ir al paso ${idx + 1}`}
              />
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="min-h-[42px] px-3.5 py-2 rounded-xl bg-white border border-purple-200 hover:bg-purple-100 text-[#1C0235] text-xs font-bold flex items-center gap-1 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#E01E7E] hover:bg-[#C21268] active:scale-95 text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg shadow-[#E01E7E]/30 transition-all"
            >
              <span>{isLast ? 'Continuar a Bienvenida' : 'Siguiente'}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
