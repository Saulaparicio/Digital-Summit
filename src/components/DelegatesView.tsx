import React, { useState, useMemo } from 'react';
import { 
  UserCheck, Search, Check, Filter, Sparkles, UserPlus, 
  ShieldCheck, PieChart as PieChartIcon, TrendingUp, Users, Clock, CheckCircle2 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from 'recharts';
import { DELEGATES_LIST } from '../data/summitData';
import { Delegate } from '../types/agenda';

interface DelegatesViewProps {
  delegates?: Delegate[];
  checkedInIds: Set<string>;
  onToggleCheckIn: (id: string) => void;
  onOpenCheckInModal: (delegateId?: string) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      value: number;
      percent: number;
      color: string;
    };
  }>;
}

const CustomChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-xl shadow-xl border-2 border-purple-200 text-xs space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="font-black text-[#1C0235]">{data.name}</span>
        </div>
        <div className="text-purple-900 font-bold flex items-baseline gap-1.5 pt-0.5">
          <span className="text-base font-black text-[#1C0235]">{data.value}</span>
          <span className="text-purple-600 font-semibold">delegados ({data.percent}%)</span>
        </div>
      </div>
    );
  }
  return null;
};

export const DelegatesView: React.FC<DelegatesViewProps> = ({
  delegates = DELEGATES_LIST,
  checkedInIds,
  onToggleCheckIn,
  onOpenCheckInModal
}) => {
  const [search, setSearch] = useState('');
  const [selectedAssoc, setSelectedAssoc] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending'>('all');

  const associations = useMemo(() => {
    return Array.from(new Set(delegates.map(d => d.association)));
  }, [delegates]);

  const filteredDelegates = useMemo(() => {
    return delegates.filter(d => {
      const matchAssoc = selectedAssoc === 'all' || d.association === selectedAssoc;
      const matchSearch = search === '' || d.name.toLowerCase().includes(search.toLowerCase());
      const isConfirmed = checkedInIds.has(d.id);
      const matchStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'confirmed' ? isConfirmed :
        !isConfirmed;

      return matchAssoc && matchSearch && matchStatus;
    });
  }, [delegates, search, selectedAssoc, statusFilter, checkedInIds]);

  const checkedInCount = useMemo(() => {
    return delegates.filter(d => checkedInIds.has(d.id)).length;
  }, [delegates, checkedInIds]);

  const totalDelegates = delegates.length || 1;
  const pendingCount = Math.max(0, delegates.length - checkedInCount);
  const confirmedPercent = Math.round((checkedInCount / totalDelegates) * 100);
  const pendingPercent = 100 - confirmedPercent;

  // Chart data formatted for Recharts PieChart
  const attendanceChartData = useMemo(() => [
    { 
      name: 'Confirmados', 
      value: checkedInCount, 
      percent: confirmedPercent, 
      color: '#007D80', // Authentic Summit Teal
      sublabel: 'Acreditados y presentes'
    },
    { 
      name: 'Pendientes', 
      value: pendingCount, 
      percent: pendingPercent, 
      color: '#E01E7E', // Authentic Summit Magenta
      sublabel: 'Por registrar en mesa'
    },
  ], [checkedInCount, pendingCount, confirmedPercent, pendingPercent]);

  // Association progress stats
  const associationStats = useMemo(() => {
    return associations.map(assoc => {
      const total = delegates.filter(d => d.association === assoc).length;
      const confirmed = delegates.filter(d => d.association === assoc && checkedInIds.has(d.id)).length;
      const pct = total > 0 ? Math.round((confirmed / total) * 100) : 0;
      return { assoc, total, confirmed, pct };
    });
  }, [associations, delegates, checkedInIds]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Self-Service Check-In CTA */}
      <div className="bg-white border-2 border-purple-200/90 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#E01E7E] text-lg font-black">★</span>
            <h2 className="text-xl font-black text-[#1C0235] tracking-wider uppercase">
              DELEGADOS Y PARTICIPANTES
            </h2>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-teal-50 text-[#007D80] border border-teal-200">
              {delegates.length} registrados
            </span>
          </div>
          <p className="text-xs text-purple-900/80 font-medium max-w-xl">
            Representantes oficiales de las 6 asociaciones y misiones de la Unión Adventista Panameña e invitados del Digital Creator Summit.
          </p>

          {/* Quick Attendance Counter Badge */}
          <div className="inline-flex items-center gap-3 bg-purple-50 px-3.5 py-2 rounded-xl border border-purple-200 shadow-inner">
            <UserCheck className="w-4 h-4 text-[#007D80]" />
            <div className="text-xs">
              <span className="text-purple-800 font-medium">Asistencia confirmada: </span>
              <strong className="text-[#007D80] font-black text-sm">{checkedInCount}</strong>
              <span className="text-purple-700"> / {delegates.length} ({confirmedPercent}%)</span>
            </div>
          </div>
        </div>

        {/* Big Action: Confirm My Attendance */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            onClick={() => onOpenCheckInModal()}
            className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-[#E01E7E] hover:bg-[#C21268] active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E01E7E]/30 transition-all"
          >
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            <span>Confirmar mi Asistencia Aquí</span>
          </button>
        </div>
      </div>

      {/* DATA VISUALIZATION SECTION: RECHARTS PIE CHART FOR ATTENDANCE */}
      <div className="bg-white border-2 border-purple-200/90 rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* Header of Analytics Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-[#E01E7E]" />
              <h3 className="text-base sm:text-lg font-black text-[#1C0235] tracking-tight uppercase">
                Métrica de Asistencia y Quórum
              </h3>
            </div>
            <p className="text-xs text-purple-900/80 font-medium">
              Porcentaje de confirmación en tiempo real para acreditación oficial y entrega de credenciales.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#007D80] text-xs font-black">
              <span className="w-2 h-2 rounded-full bg-[#007D80] animate-pulse" />
              <span>{confirmedPercent}% Quórum Actual</span>
            </span>
          </div>
        </div>

        {/* Chart + Stat Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Recharts PieChart (Left 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-purple-50/50 rounded-2xl p-4 border border-purple-200/70 relative">
            <div className="w-full h-56 sm:h-64 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomChartTooltip />} />
                  <Pie
                    data={attendanceChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={4}
                    dataKey="value"
                    animationDuration={800}
                    stroke="#ffffff"
                    strokeWidth={3}
                  >
                    {attendanceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="text-3xl sm:text-4xl font-black font-mono text-[#1C0235] leading-none">
                  {confirmedPercent}%
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 mt-0.5">
                  Confirmados
                </span>
              </div>
            </div>

            {/* Quick Interactive Legend */}
            <div className="flex items-center justify-center gap-4 pt-1 w-full text-xs">
              <button
                onClick={() => setStatusFilter(statusFilter === 'confirmed' ? 'all' : 'confirmed')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                  statusFilter === 'confirmed' 
                    ? 'bg-teal-100/80 ring-2 ring-[#007D80]' 
                    : 'hover:bg-purple-100/60'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-[#007D80] shrink-0" />
                <span className="font-bold text-[#1C0235]">Confirmados ({confirmedPercent}%)</span>
              </button>

              <button
                onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                  statusFilter === 'pending' 
                    ? 'bg-pink-100/80 ring-2 ring-[#E01E7E]' 
                    : 'hover:bg-purple-100/60'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-[#E01E7E] shrink-0" />
                <span className="font-bold text-[#1C0235]">Pendientes ({pendingPercent}%)</span>
              </button>
            </div>
          </div>

          {/* Stat Cards & Association Breakdown (Right 7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Two Side Stat Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Confirmed Card */}
              <div 
                onClick={() => setStatusFilter('confirmed')}
                className="cursor-pointer p-4 rounded-2xl bg-teal-50/70 border-2 border-teal-200/90 hover:border-[#007D80] transition-all space-y-1.5 shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#007D80] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#007D80]" />
                    <span>CONFIRMADOS</span>
                  </span>
                  <span className="text-xs font-mono font-black px-2 py-0.5 rounded-full bg-[#007D80] text-white">
                    {confirmedPercent}%
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-[#007D80] tabular-nums">
                    {checkedInCount}
                  </span>
                  <span className="text-xs font-bold text-purple-900/80">
                    de {delegates.length} participantes
                  </span>
                </div>
                <p className="text-[11px] text-purple-800 font-medium pt-0.5">
                  Acreditación lista y gafetes preparados para entrega.
                </p>
              </div>

              {/* Pending Card */}
              <div 
                onClick={() => setStatusFilter('pending')}
                className="cursor-pointer p-4 rounded-2xl bg-pink-50/70 border-2 border-pink-200/90 hover:border-[#E01E7E] transition-all space-y-1.5 shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#E01E7E] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#E01E7E]" />
                    <span>PENDIENTES</span>
                  </span>
                  <span className="text-xs font-mono font-black px-2 py-0.5 rounded-full bg-[#E01E7E] text-white">
                    {pendingPercent}%
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-[#E01E7E] tabular-nums">
                    {pendingCount}
                  </span>
                  <span className="text-xs font-bold text-purple-900/80">
                    por registrarse
                  </span>
                </div>
                <p className="text-[11px] text-purple-800 font-medium pt-0.5">
                  Esperados en la mesa de recepción de la UAP.
                </p>
              </div>

            </div>

            {/* Quick Field: Confirmations per Association */}
            <div className="bg-purple-50/70 rounded-2xl p-4 border border-purple-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1C0235] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#007D80]" />
                  <span>Avance por Campo y Asociación</span>
                </span>
                <span className="text-[10px] text-purple-700 font-bold">
                  Haz clic para filtrar la lista
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {associationStats.map(({ assoc, total, confirmed, pct }) => (
                  <button
                    key={assoc}
                    type="button"
                    onClick={() => setSelectedAssoc(assoc === selectedAssoc ? 'all' : assoc)}
                    className={`text-left p-2 rounded-xl border text-xs transition-all ${
                      selectedAssoc === assoc 
                        ? 'bg-white border-[#E01E7E] shadow-sm ring-1 ring-[#E01E7E]' 
                        : 'bg-white/80 border-purple-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-black text-[#1C0235] text-[11px]">
                      <span className="truncate">{assoc}</span>
                      <span className="text-[#007D80] font-mono">{pct}%</span>
                    </div>
                    <div className="w-full bg-purple-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div 
                        className="h-full bg-gradient-to-r from-[#007D80] to-[#00D5D8] rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-purple-700/80 mt-1 font-medium">
                      <span>{confirmed} de {total}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        
        {/* Status filter tabs: Todos / Confirmados / Pendientes */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-purple-200/90 shadow-sm">
            <button
              onClick={() => setStatusFilter('all')}
              className={`min-h-[36px] px-3.5 py-1 text-xs font-bold rounded-xl transition-all ${
                statusFilter === 'all'
                  ? 'bg-[#1C0235] text-white shadow-sm'
                  : 'text-purple-800 hover:text-[#1C0235]'
              }`}
            >
              Todos ({delegates.length})
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`min-h-[36px] px-3.5 py-1 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                statusFilter === 'confirmed'
                  ? 'bg-[#007D80] text-white shadow-sm'
                  : 'text-purple-800 hover:text-[#007D80]'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Confirmados ({checkedInCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`min-h-[36px] px-3.5 py-1 text-xs font-bold rounded-xl transition-all ${
                statusFilter === 'pending'
                  ? 'bg-[#E01E7E] text-white shadow-sm'
                  : 'text-purple-800 hover:text-[#E01E7E]'
              }`}
            >
              Pendientes ({pendingCount})
            </button>
          </div>

          {/* Search box */}
          <div className="relative min-w-[260px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o asociación..."
              className="w-full min-h-[42px] bg-white border border-purple-200 rounded-xl pl-10 pr-3 py-2 text-xs text-[#1C0235] placeholder-purple-400 focus:outline-none focus:border-[#E01E7E] shadow-sm transition-colors"
            />
          </div>
        </div>

        {/* Association filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedAssoc('all')}
            className={`min-h-[36px] px-3.5 py-1 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 active:scale-95 ${
              selectedAssoc === 'all'
                ? 'bg-[#E01E7E] text-white shadow-md shadow-[#E01E7E]/30'
                : 'bg-white text-purple-900 hover:text-[#1C0235] border border-purple-200 hover:border-purple-300 shadow-sm'
            }`}
          >
            Todas las Asociaciones
          </button>
          {associations.map(assoc => {
            const count = delegates.filter(d => d.association === assoc).length;
            return (
              <button
                key={assoc}
                onClick={() => setSelectedAssoc(assoc)}
                className={`min-h-[36px] px-3.5 py-1 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                  selectedAssoc === assoc
                    ? 'bg-[#E01E7E] text-white shadow-md shadow-[#E01E7E]/30'
                    : 'bg-white text-purple-900 hover:text-[#1C0235] border border-purple-200 hover:border-purple-300 shadow-sm'
                }`}
              >
                {assoc} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Delegates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredDelegates.map(del => {
          const isChecked = checkedInIds.has(del.id);
          return (
            <div
              key={del.id}
              className={`min-h-[64px] p-3.5 rounded-2xl border transition-all select-none flex items-center justify-between gap-3 shadow-sm hover:shadow-md ${
                isChecked
                  ? 'bg-teal-50/50 border-2 border-[#00B4B7] shadow-[#00B4B7]/20'
                  : 'bg-white border border-purple-200/90 hover:border-purple-300'
              }`}
            >
              <div 
                className="space-y-0.5 overflow-hidden flex-1 cursor-pointer flex items-center gap-2.5 min-w-0"
                onClick={() => onOpenCheckInModal(del.id)}
                title="Hacer clic para ver gafete y confirmar asistencia"
              >
                {del.photoUrl ? (
                  <img
                    src={del.photoUrl}
                    alt={del.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-[#E01E7E] shrink-0 shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#1C0235] font-black text-xs flex items-center justify-center shrink-0 border border-purple-200">
                    {del.name.charAt(0)}
                  </div>
                )}
                <div className="overflow-hidden min-w-0 flex-1">
                  <span className="text-xs font-black text-[#1C0235] block truncate hover:text-[#E01E7E] transition-colors">
                    {del.name}
                  </span>
                  <span className={`text-[11px] block truncate font-medium ${
                    isChecked ? 'text-[#007D80] font-semibold' : 'text-purple-700/80'
                  }`}>
                    {del.association}
                  </span>
                </div>
              </div>

              {/* Quick Check-in Toggle Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCheckIn(del.id);
                }}
                title={isChecked ? "Desmarcar asistencia" : "Confirmar asistencia"}
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all active:scale-95 ${
                  isChecked
                    ? 'bg-[#00B4B7] border-[#00B4B7] text-white shadow-sm'
                    : 'bg-purple-50 border-purple-200 text-transparent hover:border-[#E01E7E] hover:text-[#E01E7E]/40'
                }`}
                aria-label={isChecked ? "Asistencia confirmada" : "Confirmar asistencia"}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          );
        })}
      </div>

      {filteredDelegates.length === 0 && (
        <div className="p-8 text-center bg-white rounded-3xl border border-purple-200 space-y-3">
          <p className="text-sm font-bold text-[#1C0235]">
            No se encontraron participantes con los filtros seleccionados.
          </p>
          <button
            onClick={() => onOpenCheckInModal()}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-[#E01E7E] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-[#E01E7E]/30"
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrar nuevo participante</span>
          </button>
        </div>
      )}

    </div>
  );
};

