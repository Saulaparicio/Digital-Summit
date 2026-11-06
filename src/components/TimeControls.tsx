import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock, Zap, Bell, CheckCircle2 } from 'lucide-react';
import { formatTo12Hour, minutesToTimeString } from '../utils/timeUtils';

interface TimeControlsProps {
  isSimulated: boolean;
  setIsSimulated: (val: boolean) => void;
  simulatedMinutes: number;
  setSimulatedMinutes: (mins: number) => void;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  currentDisplayTime: string;
  onTriggerTestAlert: () => void;
}

const PRESET_MOMENTS = [
  { label: '07:45 Registro', time: '07:45', desc: 'Llegada y bienvenida' },
  { label: '08:45 Pre-Devocional', time: '08:45', desc: '5 min antes de Abel Márquez' },
  { label: '09:35 Pre-Keynote Miqueas', time: '09:35', desc: '5 min antes de Miqueas Fortunato' },
  { label: '10:30 Casos de Estudio', time: '10:30', desc: '5 min antes de taller grupal' },
  { label: '13:05 Pre-Almuerzo', time: '13:05', desc: '5 min antes del almuerzo general' },
  { label: '15:10 Pre-IA y Contenido', time: '15:10', desc: '5 min antes de IA con Darwin & Tomás' },
  { label: '16:05 Pre-UnaVoz27', time: '16:05', desc: '5 min antes de redes y All Things New' },
  { label: '17:15 Desafío en Vivo', time: '17:15', desc: 'Desafío OneVoice27' }
];

export const TimeControls: React.FC<TimeControlsProps> = ({
  isSimulated,
  setIsSimulated,
  simulatedMinutes,
  setSimulatedMinutes,
  isPlaying,
  setIsPlaying,
  simulationSpeed,
  setSimulationSpeed,
  currentDisplayTime,
  onTriggerTestAlert
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSimulatedMinutes(val);
    if (!isSimulated) setIsSimulated(true);
  };

  const handleStep = (deltaMinutes: number) => {
    setSimulatedMinutes(Math.max(7 * 60, Math.min(19 * 60, simulatedMinutes + deltaMinutes)));
    if (!isSimulated) setIsSimulated(true);
  };

  const handlePresetClick = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    setSimulatedMinutes(h * 60 + m);
    if (!isSimulated) setIsSimulated(true);
  };

  return (
    <div className="bg-white border-2 border-purple-200/90 rounded-3xl p-4 sm:p-5 shadow-2xl text-slate-900 space-y-4">
      {/* Top row: Mode selector and main digital readout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${
            isSimulated ? 'bg-amber-500/10 text-amber-700 border border-amber-500/30' : 'bg-cyan-50 text-[#007D80] border border-cyan-200'
          }`}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-[#1C0235] tracking-tight">
                {isSimulated ? 'Modo Simulación & Pruebas en Vivo' : 'Tiempo Real (Reloj del Sistema)'}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isSimulated ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-cyan-50 text-[#006E72] border border-cyan-200'
              }`}>
                {isSimulated ? 'Simulado' : 'En Directo'}
              </span>
            </div>
            <p className="text-xs text-purple-900/75 mt-0.5">
              {isSimulated 
                ? 'Controla la hora del evento para probar alertas, resaltar actividades y ensayar el cronograma.'
                : 'Sincronizado con la hora de tu dispositivo. Cambia a simulación para ensayar el evento.'}
            </p>
          </div>
        </div>

        {/* Big Time Readout & Mode Switch */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto pt-1 sm:pt-0">
          <div className="bg-purple-50/90 px-3.5 py-1.5 rounded-xl border border-purple-200 text-center shadow-inner flex-1 sm:flex-none">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-purple-700 block tracking-wider">
              Hora de Agenda
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-[#007D80] tabular-nums">
              {currentDisplayTime}
            </span>
          </div>

          <button
            onClick={() => setIsSimulated(!isSimulated)}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center justify-center shrink-0 ${
              isSimulated
                ? 'bg-purple-50 text-[#1C0235] border-purple-300 hover:bg-purple-100'
                : 'bg-gradient-to-r from-[#E01E7E] to-[#BD1567] text-white border-[#E01E7E]/50 hover:brightness-110 shadow-md shadow-[#E01E7E]/30'
            }`}
          >
            {isSimulated ? 'Volver a Hora Real' : 'Activar Simulación'}
          </button>
        </div>
      </div>

      {/* Simulation Controls Strip (Optimized for Mobile on White) */}
      {isSimulated && (
        <div className="space-y-3.5 bg-purple-50/70 p-3 sm:p-4 rounded-2xl border border-purple-200 animate-in fade-in duration-200">
          
          {/* Row 1: Playback buttons, Speeds, and Test Alert */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
                  isPlaying
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-[#E01E7E] hover:bg-[#C21268] text-white shadow-md shadow-[#E01E7E]/30'
                }`}
                title={isPlaying ? "Pausar avance de tiempo" : "Iniciar avance continuo de tiempo"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pausar' : 'Avanzar'}</span>
              </button>

              <div className="flex items-center bg-white border border-purple-200 rounded-xl p-0.5 shadow-sm">
                {[1, 5, 15, 60].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSimulationSpeed(speed)}
                    className={`min-h-[34px] px-2 sm:px-2.5 py-1 text-[11px] font-mono rounded-lg font-bold transition-colors ${
                      simulationSpeed === speed
                        ? 'bg-[#E01E7E] text-white shadow-sm'
                        : 'text-purple-800 hover:text-[#1C0235]'
                    }`}
                    title={`Velocidad ${speed}x (${speed === 60 ? '1 seg = 1 minuto' : `${speed}x tiempo real`})`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Instant popup alert trigger */}
            <button
              onClick={onTriggerTestAlert}
              className="min-h-[38px] px-3 py-1.5 bg-pink-50 hover:bg-pink-100 border border-pink-300 rounded-xl text-xs font-bold text-[#C21268] flex items-center gap-1.5 shrink-0 transition-colors shadow-sm ml-auto sm:ml-0"
              title="Disparar un popup de prueba con la siguiente actividad ahora mismo"
            >
              <Bell className="w-3.5 h-3.5 text-[#E01E7E]" />
              <span>Probar Alerta</span>
            </button>
          </div>

          {/* Row 2: Step Buttons (-5m, -1m, +1m, +5m) */}
          <div className="flex items-center justify-between gap-1.5 bg-white p-1.5 rounded-xl border border-purple-200 shadow-sm">
            <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider px-1 hidden xs:inline">
              Paso:
            </span>
            <div className="grid grid-cols-4 gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => handleStep(-5)}
                className="min-h-[36px] px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 active:scale-95 border border-purple-200 rounded-lg text-xs text-[#1C0235] font-mono font-bold text-center"
                title="Retroceder 5 minutos"
              >
                -5m
              </button>
              <button
                onClick={() => handleStep(-1)}
                className="min-h-[36px] px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 active:scale-95 border border-purple-200 rounded-lg text-xs text-[#1C0235] font-mono font-bold text-center"
                title="Retroceder 1 minuto"
              >
                -1m
              </button>
              <button
                onClick={() => handleStep(1)}
                className="min-h-[36px] px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 active:scale-95 border border-purple-200 rounded-lg text-xs text-[#1C0235] font-mono font-bold text-center"
                title="Adelantar 1 minuto"
              >
                +1m
              </button>
              <button
                onClick={() => handleStep(5)}
                className="min-h-[36px] px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 active:scale-95 border border-purple-200 rounded-lg text-xs text-[#1C0235] font-mono font-bold text-center"
                title="Adelantar 5 minutos"
              >
                +5m
              </button>
            </div>
          </div>

          {/* Row 3: Full-width Time Slider */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-purple-800">
              <span className="font-semibold">07:30</span>
              <span className="font-black text-[#007D80]">{currentDisplayTime}</span>
              <span className="font-semibold">18:30</span>
            </div>
            <input
              type="range"
              min={7 * 60 + 30}
              max={18 * 60 + 30}
              step={1}
              value={simulatedMinutes}
              onChange={handleSliderChange}
              className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-[#E01E7E]"
            />
          </div>

          {/* Row 4: Quick Jump Buttons to Summit Milestones */}
          <div className="pt-2 border-t border-purple-200">
            <span className="text-[11px] text-[#1C0235] font-bold block mb-1.5">
              Saltos Rápidos para Ensayar Momentos Clave:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_MOMENTS.map((preset) => (
                <button
                  key={preset.time}
                  onClick={() => handlePresetClick(preset.time)}
                  className="min-h-[34px] px-2.5 py-1 rounded-xl bg-white hover:bg-[#E01E7E] hover:text-white active:scale-95 text-[#1C0235] border border-purple-200 text-[11px] font-semibold transition-all shadow-sm"
                  title={preset.desc}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Helpful banner if in real time */}
      {!isSimulated && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-purple-50/80 p-3 rounded-2xl border border-purple-200 text-xs text-purple-950 gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#007D80] shrink-0" />
            <span>
              Consejo de ensayo: Si estás probando la app antes del día del evento, haz clic en <strong className="text-[#1C0235]">"Activar Simulación"</strong> para ver los popups y avisos en vivo.
            </span>
          </div>
          <button
            onClick={onTriggerTestAlert}
            className="text-[#E01E7E] hover:text-[#C21268] font-black underline text-xs whitespace-nowrap self-end sm:self-center"
          >
            Ver Popup de Demostración
          </button>
        </div>
      )}
    </div>
  );
};
