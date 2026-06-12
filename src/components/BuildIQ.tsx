import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Coins, 
  MapPin, 
  Percent, 
  Layers, 
  Calendar,
  Grid,
  TrendingDown,
  TrendingUp,
  Sliders,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { Obra } from '../types';

interface BuildIQProps {
  obras: Obra[];
  onBackToOverview: () => void;
}

export default function BuildIQ({ obras, onBackToOverview }: BuildIQProps) {
  const [selectedObraId, setSelectedObraId] = useState<string>(obras[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Em Construção' | 'Planejamento'>('Todos');

  const selectedObra = obras.find(o => o.id === selectedObraId) || obras[0];

  const filteredObras = obras.filter(o => {
    if (statusFilter === 'Todos') return true;
    return o.status === statusFilter;
  });

  const formatReais = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Compute unit matrix for selected construction site
  const generateUnitMatrix = (count: number, sold: number) => {
    const units = [];
    for (let i = 1; i <= count; i++) {
      // Deterministic classification based on inventory
      const status = i <= sold ? 'sold' : (i % 7 === 0 ? 'reserved' : 'available');
      units.push({
        id: `U-${100 + i}`,
        andar: Math.ceil(i / 8),
        numero: 100 + i,
        status: status
      });
    }
    return units.reverse(); // high floor first
  };

  const unitMatrix = selectedObra ? generateUnitMatrix(selectedObra.unidadesTotais, selectedObra.unidadesVendidas) : [];

  return (
    <div id="buildiq-module" className="space-y-8">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-orange-655 text-orange-600 tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            MÓDULO BUILD IQ
          </div>
          <h1 className="text-2xl font-bold font-sans text-slate-900">
            Acompanhamento Econômico-Operacional
          </h1>
          <p className="text-xs text-slate-500">
            Gestão física de obras, custos por metro quadrado e estoques de unidades incorporadas em tempo real.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button 
            className={`px-3 py-1.5 rounded-lg transition font-medium ${statusFilter === 'Todos' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-850'}`}
            onClick={() => setStatusFilter('Todos')}
          >
            Todos
          </button>
          <button 
            className={`px-3 py-1.5 rounded-lg transition font-medium ${statusFilter === 'Em Construção' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-850'}`}
            onClick={() => setStatusFilter('Em Construção')}
          >
            Em Construção
          </button>
          <button 
            className={`px-3 py-1.5 rounded-lg transition font-medium ${statusFilter === 'Planejamento' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-850'}`}
            onClick={() => setStatusFilter('Planejamento')}
          >
            Planejamento
          </button>
        </div>
      </div>

      {/* Main Grid: Sites list on left, detailed preview on the right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active constructions list (1/3 cols) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 font-mono tracking-wide uppercase">Canteiros de Obra Ativos</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredObras.map((obra) => {
              const isActive = obra.id === selectedObraId;
              const unitProgress = Math.round((obra.unidadesVendidas / obra.unidadesTotais) * 100);
              
              return (
                <div 
                  key={obra.id}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition ${isActive ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300'}`}
                  onClick={() => setSelectedObraId(obra.id)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase ${isActive ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-slate-100 text-slate-600'}`}>
                          {obra.status}
                        </span>
                        <h4 className="font-bold text-sm tracking-tight leading-snug">{obra.nome}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{obra.localizacao}</span>
                    </div>

                    {/* Progress indicators */}
                    <div className="space-y-2 pt-2 border-t border-slate-100/10">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Avanço Físico (PoC)</span>
                          <span className={`font-mono font-bold ${isActive ? 'text-orange-400' : 'text-slate-850'}`}>{obra.progressoFisico}%</span>
                        </div>
                        <div className="w-full bg-slate-200/20 h-1 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${isActive ? 'bg-orange-500' : 'bg-slate-705'}`} style={{ width: `${obra.progressoFisico}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Comercialização</span>
                          <span className={`font-mono font-bold ${isActive ? 'text-orange-400' : 'text-slate-850'}`}>{unitProgress}% das unidades</span>
                        </div>
                        <div className="w-full bg-slate-200/20 h-1 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${isActive ? 'bg-emerald-400' : 'bg-emerald-500'}`} style={{ width: `${unitProgress}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Selected Obra Detailed Dashboard (2/3 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedObra.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6"
            >
              {/* Detailed Title Section */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-slate-200">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-250 px-2.5 py-0.5 rounded font-mono font-bold">
                      {selectedObra.speNome}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-sans">{selectedObra.nome}</h2>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {selectedObra.localizacao}
                  </p>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 inline-flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 font-mono">VALOR TOTAL ORÇADO</span>
                  <span className="text-base font-bold text-slate-900">{formatReais(selectedObra.orcamentoTotal)}</span>
                </div>
              </div>

              {/* Economic KPI sub-grid (PoC, Costs Deviation, etc.) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Cost deviation card */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>CUSTO / m² REALIZADO</span>
                    <Coins className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-slate-900">
                      R$ {selectedObra.custoRealMetroQuadrado.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-500">/ m²</span>
                    </div>
                    {selectedObra.custoRealMetroQuadrado <= selectedObra.custoOrcadoMetroQuadrado ? (
                      <span className="text-[10.5px] text-emerald-600 flex items-center gap-1 font-medium">
                        <TrendingDown className="w-3 h-3" />
                        Abaixo do orçado (R$ {selectedObra.custoOrcadoMetroQuadrado.toLocaleString('pt-BR')})
                      </span>
                    ) : (
                      <span className="text-[10.5px] text-orange-600 flex items-center gap-1 font-medium text-orange-750">
                        <TrendingUp className="w-3 h-3" />
                        Desvio identificado (Orçado: R$ {selectedObra.custoOrcadoMetroQuadrado.toLocaleString('pt-BR')})
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress differences PoC */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>PROJEÇÃO DE MARGEM</span>
                    <Sliders className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-slate-900">
                      R$ {(selectedObra.orcamentoTotal * 0.38).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    </div>
                    <span className="text-[10.5px] text-slate-500 flex items-center gap-1">
                      Projetado ~38% de margem operacional
                    </span>
                  </div>
                </div>

                {/* Units sold summary */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>VGV COMERCIALIZADO</span>
                    <DollarSign className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-slate-900">
                      {formatReais(selectedObra.unidadesVendidas * selectedObra.ticketMedio)}
                    </div>
                    <span className="text-[10.5px] text-slate-500">
                      Ticket médio: {formatReais(selectedObra.ticketMedio)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Physical Gantt milestone tracker */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-150 space-y-3">
                <h4 className="text-xs font-bold text-slate-550 font-mono uppercase">Cronograma Operacional & Prazos</h4>
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>Início: <strong>{selectedObra.dataInicio}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>Previsão Entrega: <strong>{selectedObra.dataEntrega}</strong></span>
                  </div>
                </div>

                {/* Pseudo Milestones */}
                <div className="relative pt-4">
                  <div className="absolute left-1 right-1 top-6.5 h-1 bg-slate-200" />
                  <div className="grid grid-cols-4 relative z-1 gap-2">
                    <div className="text-center">
                      <div className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold mx-auto mb-1">✓</div>
                      <span className="text-[10px] text-slate-800 font-semibold block">Infraestrutura</span>
                      <span className="text-[9px] text-slate-450 block font-mono">100% concluída</span>
                    </div>
                    <div className="text-center">
                      <div className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold mx-auto mb-1">✓</div>
                      <span className="text-[10px] text-slate-800 font-semibold block">Superestrutura</span>
                      <span className="text-[9px] text-slate-450 block font-mono">100% concluída</span>
                    </div>
                    <div className="text-center">
                      <div className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold mx-auto mb-1 ${selectedObra.progressoFisico >= 60 ? 'bg-slate-900 text-white' : 'bg-orange-100 text-orange-700 border border-orange-300'}`}>3</div>
                      <span className="text-[10px] text-slate-800 font-semibold block">Alvenaria/Lajes</span>
                      <span className="text-[9px] text-slate-400 block font-mono">{selectedObra.progressoFisico >= 68 ? '100% concluído' : 'Em andamento'}</span>
                    </div>
                    <div className="text-center font-sans">
                      <div className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold mx-auto mb-1 ${selectedObra.progressoFisico === 100 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>4</div>
                      <span className="text-[10px] text-slate-400 block">Acabamentos</span>
                      <span className="text-[9px] text-slate-400 block font-mono">Previsto</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Units sold grid blueprint layout */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-500 font-mono tracking-wide uppercase flex items-center gap-1.5">
                    <Grid className="w-4 h-4 text-slate-500" />
                    ESTADO DO ESTOQUE (LAYOUT DOS APARTAMENTOS)
                  </h3>
                  
                  {/* Legend */}
                  <div className="flex gap-4 text-[10px] font-medium font-sans">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-orange-500 shadow-sm border border-orange-600/10" />
                      Vendido ({selectedObra.unidadesVendidas})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-white border border-slate-300" />
                      Disponível ({selectedObra.unidadesTotais - selectedObra.unidadesVendidas - Math.round(selectedObra.unidadesTotais * 0.05)})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-slate-300" />
                      Reservas ({Math.round(selectedObra.unidadesTotais * 0.05)})
                    </span>
                  </div>
                </div>

                {/* Grid view */}
                <div className="bg-slate-900 border border-slate-950 p-6 rounded-2xl">
                  {/* Building Layout Wrapper */}
                  <div className="max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-8 md:grid-cols-12 gap-1.5">
                      {unitMatrix.map((unit) => {
                        let bgClass = 'bg-white border-slate-300 text-slate-800';
                        if (unit.status === 'sold') bgClass = 'bg-orange-500 border-orange-600/10 text-slate-950 font-bold';
                        if (unit.status === 'reserved') bgClass = 'bg-slate-600 text-slate-200 border-slate-650';

                        return (
                          <div 
                            key={unit.id}
                            title={`Apartamento ${unit.numero} - status: ${unit.status}`}
                            className={`h-7 rounded text-[8.5px] flex items-center justify-center font-mono cursor-default border transition duration-150 ${bgClass}`}
                          >
                            {unit.numero}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="text-center pt-3 text-[10px] text-slate-400 font-mono">
                    ▲ Vista vertical estrutural por andares (Fração superior de pavimentos)
                  </div>
                </div>
              </div>

              {/* BuildIQ AI Agent Logging details */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-850">Avanço Físico Auditado Eletronicamente</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    O agente de IA <strong className="text-slate-750">Sensus-Logistics</strong> audita o progresso com base em medições semanais do engenheiro residente e lançamentos de medições de empreiteiros.
                  </p>
                </div>
                <button 
                  onClick={onBackToOverview} 
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition shrink-0 cursor-pointer"
                >
                  Voltar à Visão Consolidada
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
