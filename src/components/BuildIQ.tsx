import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Percent, 
  Layers, 
  Calendar,
  Grid,
  TrendingDown,
  TrendingUp,
  Sliders,
  DollarSign,
  FileText,
  BadgeAlert,
  HardHat,
  Users,
  Briefcase,
  HelpCircle,
  Eye,
  ArrowRight,
  Scale,
  AlertCircle,
  Coins,
  ArrowUp,
  ArrowDown,
  Sparkles
} from 'lucide-react';
import { Obra } from '../types';
import { buildiqData, BuildIQSubReport, BuildIQReportColumn, viabilidadeProjetos, ViabilidadeDado } from '../data/buildiqData';

interface BuildIQProps {
  obras: Obra[];
  onBackToOverview: () => void;
}

export default function BuildIQ({ obras, onBackToOverview }: BuildIQProps) {
  // Toggle between matera and blank
  const [activeProjectKey, setActiveProjectKey] = useState<'matera' | 'blank'>('matera');
  
  // Active sub-report key (shows the real-world tables from the separate system)
  const [activeReportKey, setActiveReportKey] = useState<string>('vendas');

  // Toggle between reports cockpit and feasibility analysis
  const [activeTab, setActiveTab] = useState<'reports' | 'feasibility' | 'evm'>('feasibility');

  const formatReais = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatReaisCentavos = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Get active project parameters & KPIs from buildiqData
  const activeProject = useMemo(() => {
    return buildiqData.projects[activeProjectKey];
  }, [activeProjectKey]);

  // Map the chosen project to the global Obra schema to keep alignment
  const alignedObra = useMemo<Obra>(() => {
    const backupObra = obras.find(o => o.speNome.toLowerCase().includes(activeProjectKey)) || obras[0];
    return {
      ...backupObra,
      nome: activeProject.nome,
      orcamentoTotal: activeProjectKey === 'matera' ? 10340000 : 6540000,
      custoRealizado: activeProject.kpis.custoDireto + activeProject.kpis.custoIndireto,
      unidadesTotais: activeProjectKey === 'matera' ? 40 : 36,
      unidadesVendidas: activeProject.kpis.contratos,
      ticketMedio: activeProjectKey === 'matera' ? 772500 : 882000,
      progressoFisico: activeProjectKey === 'matera' ? 78 : 45
    };
  }, [activeProjectKey, activeProject, obras]);

  // Generate building units representation
  const unitMatrix = useMemo(() => {
    const units = [];
    const count = alignedObra.unidadesTotais;
    const sold = alignedObra.unidadesVendidas;
    
    for (let i = 1; i <= count; i++) {
      // Deterministic states
      let status: 'sold' | 'reserved' | 'available' = 'available';
      if (i <= sold) {
        status = 'sold';
      } else if (i % 9 === 0) {
        status = 'reserved';
      }
      
      units.push({
        id: `U-${200 + i}`,
        numero: 200 + i,
        status: status
      });
    }
    return units.reverse(); // high floor first
  }, [alignedObra]);

  // Retrieve current active reports
  const currentReport = useMemo<BuildIQSubReport>(() => {
    return (buildiqData.reports as Record<string, BuildIQSubReport>)[activeReportKey];
  }, [activeReportKey]);

  // Dynamic row values for active project key
  const reportRows = useMemo(() => {
    if (!currentReport) return [];
    return currentReport.rows[activeProjectKey] || [];
  }, [currentReport, activeProjectKey]);

  // Fetch feasibility items
  const activeViabilidade = useMemo<ViabilidadeDado[]>(() => {
    return viabilidadeProjetos[activeProjectKey] || [];
  }, [activeProjectKey]);

  // Compute key feasibility metrics for display cards
  const feasibilitySummary = useMemo(() => {
    const vgvItem = activeViabilidade.find(x => x.item.includes("VGV"));
    const costItem = activeViabilidade.find(x => x.item.includes("CUSTO TOTAL"));
    const netProfitItem = activeViabilidade.find(x => x.item === "RESULTADO LÍQUIDO");
    const marginItem = activeViabilidade.find(x => x.item.includes("RESULTADO LÍQUIDO S/ VGV"));

    return {
      vgv: vgvItem || { ver0: 0, out25: 0, variacao: 0 },
      custo: costItem || { ver0: 0, out25: 0, variacao: 0 },
      lucro: netProfitItem || { ver0: 0, out25: 0, variacao: 0 },
      margem: marginItem || { ver0: 0, out25: 0, variacao: 0 }
    };
  }, [activeViabilidade]);

  const renderEvmPage = () => {
    // Definimos dados do EVM com base no projeto ativo
    const isMatera = activeProjectKey === 'matera';
    const bac = isMatera ? 13558491 : 7749441;
    const ac = isMatera ? 5660853 : 5306344;
    const pocFisico = alignedObra.progressoFisico; // Utiliza o progresso físico real do alinhamento do Sienge (78% ou 45%)
    const pocPlanejado = isMatera ? 70 : 52; // % Programada original no cronograma de linha de base

    const ev = bac * (pocFisico / 100);
    const pv = bac * (pocPlanejado / 100);
    const cv = ev - ac;
    const sv = ev - pv;
    const cpi = ev / ac;
    const spi = ev / pv;
    const eac = bac / cpi;
    const vac = bac - eac;

    // Diagnósticos baseados nas métricas estruturais
    const cpiStatus = cpi >= 1.0 ? 'green' : cpi >= 0.85 ? 'yellow' : 'red';
    const spiStatus = spi >= 1.0 ? 'green' : spi >= 0.85 ? 'yellow' : 'red';

    return (
      <motion.div
        key="evm-section"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        {/* EVM Header info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-150">
            <div className="space-y-1">
              <span className="bg-orange-50 border border-orange-100 text-orange-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md tracking-wider">
                MOTOR PREDITIVO DE ENGENHARIA (ISO 21508)
              </span>
              <h3 className="text-base font-bold text-slate-900 font-sans">Análise do Valor Agregado — Earned Value Management (EVM)</h3>
              <p className="text-xs text-slate-500">
                Padrão internacional PMI/ANSI para controle preditivo de custos totalizadores e aderência cronológica no canteiro.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-150 px-4 py-2.5 rounded-xl text-right shrink-0">
              <span className="text-[10px] font-mono text-slate-400 block">PROJETO OPERACIONAL</span>
              <strong className="text-xs text-slate-850">{activeProject.nome}</strong>
            </div>
          </div>

          {/* EVM KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[9px] font-mono uppercase text-slate-400 block font-semibold">Planned Value (PV) / Valor Planejado</span>
              <div className="text-lg font-bold text-slate-800 font-mono mt-1">{formatReais(pv)}</div>
              <p className="text-[10px] text-slate-450 leading-normal mt-1">Custo acumulado orçado para o cronograma previsto de <strong>{pocPlanejado}%</strong>.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[9px] font-mono uppercase text-slate-400 block font-semibold">Earned Value (EV) / Valor Agregado</span>
              <div className="text-lg font-bold text-orange-600 font-mono mt-1">{formatReais(ev)}</div>
              <p className="text-[10px] text-slate-450 leading-normal mt-1">Valor do trabalho de fato medido e entregue no canteiro de <strong>{pocFisico}%</strong>.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[9px] font-mono uppercase text-slate-400 block font-semibold">Actual Cost (AC) / Custo Real</span>
              <div className="text-lg font-bold text-slate-850 font-mono mt-1">{formatReais(ac)}</div>
              <p className="text-[10px] text-slate-450 leading-normal mt-1">Custos reais faturados e lançados na apropriação gerencial do Sienge.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[9px] font-mono uppercase text-slate-400 block font-semibold">Budget At Completion (BAC)</span>
              <div className="text-lg font-bold text-slate-900 font-mono mt-1">{formatReais(bac)}</div>
              <p className="text-[10px] text-slate-450 leading-normal mt-1">Orçamento inicial contratual total do projeto de engenharia.</p>
            </div>
          </div>
        </div>

        {/* Index of Efficiency Gauges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CPI Performance Gauge */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">CPI (Cost Performance Index)</h4>
                <p className="text-[11px] text-slate-400">Medida de eficiência no uso do dinheiro do canteiro.</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                cpiStatus === 'green' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                cpiStatus === 'yellow' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {cpiStatus === 'green' ? 'EFICIENTE' : cpiStatus === 'yellow' ? 'ALERTA' : 'CRÍTICO'}
              </span>
            </div>

            <div className="text-center py-3">
              <div className={`text-4xl font-extrabold font-mono ${
                cpiStatus === 'green' ? 'text-emerald-600' : cpiStatus === 'yellow' ? 'text-amber-500' : 'text-red-650'
              }`}>
                {cpi.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                {cpi >= 1.0 
                  ? `Para cada R$ 1,00 gasto no canteiro, a JUST agregou R$ ${cpi.toFixed(2)} de valor medido!`
                  : `Para cada R$ 1,00 gasto, a JUST obteve apenas R$ ${cpi.toFixed(2)} de valor em contrapartida física.`
                }
              </p>
            </div>

            {/* Custom line representing gauge */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-450">
                <span>0.5 (Ineficiente)</span>
                <span>1.0 (Meta)</span>
                <span>1.5 (Excepcional)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
                {/* 1.0 target tick */}
                <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-slate-400 z-10" />
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    cpiStatus === 'green' ? 'bg-emerald-500' : cpiStatus === 'yellow' ? 'bg-amber-500' : 'bg-red-500'
                  }`} 
                  style={{ width: `${Math.max(10, Math.min(100, ((cpi - 0.5) / 1.0) * 100))}%` }} 
                />
              </div>
            </div>
            
            <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3">
              <strong className="text-slate-700">Cálculo Fiduciário:</strong> <code>EV / AC</code>. Reflete se o orçamento contratado por m² está se sustentando na realidade atual sem estourar.
            </div>
          </div>

          {/* SPI Performance Gauge */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">SPI (Schedule Performance Index)</h4>
                <p className="text-[11px] text-slate-400">Medida de aderência ao cronograma físico.</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                spiStatus === 'green' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                spiStatus === 'yellow' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {spiStatus === 'green' ? 'NO PRAZO / ADIANTADO' : spiStatus === 'yellow' ? 'ALERTA ATRASO' : 'ATRASO CRÍTICO'}
              </span>
            </div>

            <div className="text-center py-3">
              <div className={`text-4xl font-extrabold font-mono ${
                spiStatus === 'green' ? 'text-emerald-600' : spiStatus === 'yellow' ? 'text-amber-500' : 'text-red-650'
              }`}>
                {spi.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                {spi >= 1.0 
                  ? `A obra está ${((spi - 1.0) * 100).toFixed(0)}% adiantada de prazo frente ao programado.`
                  : `A obra está entregando apenas ${((spi) * 100).toFixed(0)}% do cronograma programado no prumo de tempo.`
                }
              </p>
            </div>

            {/* Custom line representing gauge */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-450">
                <span>0.5 (Atrasado)</span>
                <span>1.0 (Meta)</span>
                <span>1.5 (Adiantado)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
                {/* 1.0 target tick */}
                <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-slate-400 z-10" />
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    spiStatus === 'green' ? 'bg-emerald-500' : spiStatus === 'yellow' ? 'bg-amber-500' : 'bg-red-500'
                  }`} 
                  style={{ width: `${Math.max(10, Math.min(100, ((spi - 0.5) / 1.0) * 100))}%` }} 
                />
              </div>
            </div>
            
            <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3">
              <strong className="text-slate-700">Cálculo Fiduciário:</strong> <code>EV / PV</code>. Reflete a velocidade do avanço material nos andares frente ao cronograma físico orçado.
            </div>
          </div>

          {/* Predictor Dashboard / Forecast */}
          <div className="bg-slate-900 border border-slate-800 text-slate-150 p-6 rounded-2xl shadow-sm space-y-4">
            <div>
              <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1.55">
                <Sparkles className="w-4 h-4 text-orange-400 animate-pulse animate-duration-1000" />
                PROJEÇÃO NO TÉRMINO DA SPE (EAC - ISO 21508)
              </h4>
              <p className="text-[10px] text-slate-400 mt-1">Estimativa matemática de término fiduciário com base no histórico de produtividade.</p>
            </div>

            <div className="divide-y divide-slate-800 text-xs font-mono">
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400">Capex Inicial (BAC):</span>
                <strong>{formatReais(bac)}</strong>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400">Estimativa de Custo (EAC):</span>
                <strong className={`font-bold ${vac < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {formatReais(eac)}
                </strong>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400">Variação Real (VAC):</span>
                <strong className={`font-black ${vac < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {vac === 0 ? "Nenhum" : (vac > 0 ? "Economia: " : "Estouro: ") + formatReais(Math.abs(vac))}
                </strong>
              </div>
            </div>

            <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 text-[10.5px] text-slate-400 font-sans leading-relaxed">
              <strong>Análise Proporcional:</strong> {vac < 0 
                ? `O estouro projetado de ${formatReais(Math.abs(vac))} decorre da perda de eficiência de canteiro. Se as medições do Sienge mantiverem o ritmo de custos de medição atual, o custo final da SPE subirá significativamente.`
                : `A obra mantém-se dentro do limite esperado de custo de canteiro, assegurando o plano de margem líquida reflexa (CPC 18) de nossa viabilidade corporativa.`
              }
            </div>
          </div>

        </div>

        {/* Detailed Variances Matrix */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="space-y-1">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Linha de Base & Prumo de Desvios</h4>
            <p className="text-xs text-slate-450">Tabela de apropriação de desvios lineares fiduciários acumulados no exercício de {buildiqData.activeDate}:</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 font-mono text-[10px] text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Métrica de Variância</th>
                  <th className="py-2.5 px-3 text-right">Valor em Reais (R$)</th>
                  <th className="py-2.5 px-3">Interpretação e Plano de Ação recomendado para a JUST S.A.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-800">Variância de Custo (CV - Cost Variance)</td>
                  <td className={`py-3 px-3 text-right font-mono font-bold ${cv >= 0 ? 'text-emerald-600' : 'text-red-650'}`}>
                    {cv >= 0 ? '+' : ''}{formatReais(cv)}
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px] leading-snug">
                    {cv >= 0 
                      ? 'Nossa obra está gastando MENOS do que o valor do trabalho de fato agregado. Altamente satisfatório.' 
                      : 'Nossa obra está gastando MAIS do que o valor do trabalho físico medido e agregado. Aponta custos intangíveis elevados, atrasos nos canteiros, ou perdas de materiais.'
                    }
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-800">Variância de Prazo (SV - Schedule Variance)</td>
                  <td className={`py-3 px-3 text-right font-mono font-bold ${sv >= 0 ? 'text-emerald-600' : 'text-indigo-650'}`}>
                    {sv >= 0 ? '+' : ''}{formatReais(sv)}
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px] leading-snug">
                    {sv >= 0 
                      ? 'Desempenho físico adiantado frente ao planejamento do cronograma.' 
                      : 'Desempenho físico atrasado frente ao cronograma planejado. Isto prolonga os custos fixos de manutenção de canteiro ("estouro por dilatação de tempo").'
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div id="buildiq-module" className="space-y-8">
      {/* Top Title Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        <div>
          <div className="text-xs font-mono font-bold text-orange-600 tracking-wider flex items-center gap-1.5 animate-pulse">
            <Building2 className="w-3.5 h-3.5" />
            CONTROLE DE ENGENHARIA & ECONOMIA (BUILD IQ)
          </div>
          <h1 className="text-2xl font-bold font-sans text-slate-900 tracking-tight">
            Painel de Desempenho Operacional e Relatórios Integrados
          </h1>
          <p className="text-xs text-slate-500 max-w-4xl">
            Acompanhamento das medições físicas, índices de performance e inteligência de viabilidade da JUST S.A. 
            Esta camada de inteligência é estritamente <strong className="text-slate-800">gerencial (não contábil)</strong>, servindo de governança consultiva para consolidação de desvios e reajustes sem interferir nas conciliações tributárias.
          </p>
        </div>

        {/* Project Selector Toggles */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs self-start shrink-0 select-none">
          <button 
            id="btn-matera"
            className={`px-4 py-2.5 rounded-lg transition font-extrabold flex items-center gap-2 ${activeProjectKey === 'matera' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-850'}`}
            onClick={() => {
              setActiveProjectKey('matera');
            }}
          >
            <Building2 className="w-4 h-4" />
            Residencial Matera
          </button>
          <button 
            id="btn-blank"
            className={`px-4 py-2.5 rounded-lg transition font-extrabold flex items-center gap-2 ${activeProjectKey === 'blank' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-850'}`}
            onClick={() => {
              setActiveProjectKey('blank');
            }}
          >
            <Building2 className="w-4 h-4" />
            Residencial Blank
          </button>
        </div>
      </div>

      {/* Segment Switcher Tabs */}
      <div className="flex border-b border-slate-200 text-xs gap-6 font-sans overflow-x-auto scrollbar-none">
        <button
          id="tab-feasibility"
          className={`py-3.5 font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'feasibility' 
              ? 'border-orange-500 text-slate-950 font-black' 
              : 'border-transparent text-slate-450 hover:text-slate-800'
          }`}
          onClick={() => setActiveTab('feasibility')}
        >
          <Scale className="w-4 h-4 text-orange-500" />
          Estudo de Viabilidade Financeira (Comparação de Versões)
        </button>
        <button
          id="tab-reports"
          className={`py-3.5 font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'reports' 
              ? 'border-orange-500 text-slate-950 font-black' 
              : 'border-transparent text-slate-450 hover:text-slate-800'
          }`}
          onClick={() => setActiveTab('reports')}
        >
          <Grid className="w-4 h-4 text-orange-400" />
          Pastas de Medição Física & Índices (IPP / IPC)
        </button>
        <button
          id="tab-evm"
          className={`py-3.5 font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'evm'
              ? 'border-orange-500 text-slate-950 font-black'
              : 'border-transparent text-slate-450 hover:text-slate-800'
          }`}
          onClick={() => setActiveTab('evm')}
        >
          <Percent className="w-4 h-4 text-orange-500" />
          Análise de Valor Agregado EVM (ISO 21508)
        </button>
      </div>

      {/* CONDITIONAL RENDER AREA */}
      <AnimatePresence mode="wait">
        {activeTab === 'reports' ? (
          <motion.div
            key="reports-section"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* Main Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5 hover:border-orange-500/20 transition">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10.5px] font-mono uppercase tracking-wider">VGV Comercializado</span>
                  <DollarSign className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-xl font-bold font-sans text-slate-950 font-mono">
                  {formatReais(activeProject.kpis.totalVendido)}
                </div>
                <p className="text-[10px] text-slate-450">{activeProject.kpis.contratos} contratos assinados</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5 hover:border-orange-500/20 transition">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10.5px] font-mono uppercase tracking-wider">Ticket / m² Médio</span>
                  <Sliders className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-xl font-bold font-sans text-slate-950 font-mono">
                  {formatReais(activeProject.kpis.valorMetroQuadrado)}
                </div>
                <p className="text-[10px] text-slate-450">Área construída total: {activeProject.kpis.areaTotal}m²</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5 hover:border-orange-500/20 transition">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10.5px] font-mono uppercase tracking-wider">Estoque Disponível</span>
                  <Layers className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-xl font-bold font-sans text-slate-950 font-mono">{formatReais(activeProject.kpis.estoqueValor)}</div>
                <p className="text-[10px] text-slate-450">{activeProject.kpis.unidadesEstoque} unidades remanescentes</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5 hover:border-orange-500/20 transition">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10.5px] font-mono uppercase tracking-wider">Inadimplência de Carteira</span>
                  <BadgeAlert className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-xl font-bold font-sans text-red-650 text-red-650 font-mono">
                  {activeProject.kpis.inadimplencia}%
                </div>
                <p className="text-[10px] text-red-600 font-medium">Contratos sob aviso de mora</p>
              </div>

            </div>

            {/* TWO COLUMNS COCKPIT VIEW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left column: Sub-Report Buttons & Building block layout */}
              <div className="space-y-6">
                
                {/* Sub-report selector box */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Painéis Analíticos ({Object.keys(buildiqData.reports).length})</h3>
                    <p className="text-[10.5px] text-slate-400 leading-snug">Selecione uma pasta para carregar a matriz de dados do banco de engenharia:</p>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    {Object.entries(buildiqData.reports).map(([key, value]) => {
                      const isSelected = activeReportKey === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setActiveReportKey(key)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                            isSelected 
                              ? 'bg-slate-900 text-white border-slate-950 shadow-sm' 
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-150'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <FileText className={`w-4 h-4 ${isSelected ? 'text-orange-400' : 'text-slate-450'}`} />
                            {value.title}
                          </span>
                          <Eye className="w-3.5 h-3.5 opacity-55" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Building block physical design mapping */}
                <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-900 space-y-4">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Grid className="w-4 h-4" />
                      Matriz de Estoque de Pavimentos
                    </h3>
                    <p className="text-[10px] text-slate-400 leading-snug">Distribuição estrutural de apartamentos {activeProject.nome}</p>
                  </div>

                  {/* Blue print layout wrapper */}
                  <div className="max-h-[140px] overflow-y-auto pr-1">
                    <div className="grid grid-cols-5 gap-1.5">
                      {unitMatrix.map((unit) => {
                        let bgClass = 'bg-white border-slate-200 text-slate-800';
                        if (unit.status === 'sold') bgClass = 'bg-orange-500 border-orange-600 text-slate-950 font-bold';
                        if (unit.status === 'reserved') bgClass = 'bg-slate-700 text-slate-200 border-slate-600';

                        return (
                          <div 
                            key={unit.id}
                            className={`h-6 rounded text-[9px] flex items-center justify-center font-mono border ${bgClass}`}
                            title={`Unidade ${unit.numero} (${unit.status})`}
                          >
                            {unit.numero}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Legend indicators */}
                  <div className="flex gap-4 text-[9.5px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-orange-500" />
                      Vendido
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-white" />
                      Disponível
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-slate-700" />
                      Reserva
                    </span>
                  </div>
                </div>

              </div>

              {/* Right column: Dynamic Live analytical report table */}
              <div className="lg:col-span-2 space-y-6">
                
                <AnimatePresence mode="wait">
                  {currentReport ? (
                    <motion.div
                      key={activeReportKey + activeProjectKey}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5"
                    >
                      {/* Active Report Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-150">
                        <div className="space-y-1">
                          <span className="bg-orange-50 text-orange-850 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider border border-orange-100">
                            PASTA OPERACIONAL ATIVA
                          </span>
                          <h3 className="text-base font-bold text-slate-900 font-sans">{currentReport.title}</h3>
                          <p className="text-xs text-slate-450">{currentReport.description}</p>
                        </div>
                        
                        <div className="bg-slate-50 border border-slate-150 px-4 py-2.5 rounded-xl text-right shrink-0">
                          <span className="text-[10px] font-mono text-slate-400 block">PROJETO OPERACIONAL</span>
                          <strong className="text-xs text-slate-850">{activeProject.nome}</strong>
                        </div>
                      </div>

                      {/* Analytical Data Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100/75 text-slate-500 font-mono text-[9.5px] border-b border-slate-200 uppercase">
                            <tr>
                              {currentReport.columns.map((col: BuildIQReportColumn) => (
                                <th key={col.key} className={`py-3 px-3.5 font-bold ${col.align === 'right' ? 'text-right' : ''}`}>
                                  {col.label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-sans">
                            {reportRows.map((row: any, rIdx: number) => (
                              <tr key={rIdx} className="hover:bg-slate-50 transition font-medium">
                                {currentReport.columns.map((col: BuildIQReportColumn) => {
                                  const originalValue = row[col.key];
                                  let formattedValue = originalValue;

                                  if (col.format === 'currency' && typeof originalValue === 'number') {
                                    formattedValue = formatReais(originalValue);
                                  } else if (col.format === 'percent' && typeof originalValue === 'number') {
                                    formattedValue = `${originalValue.toFixed(2)}%`;
                                  } else if (col.format === 'number' && typeof originalValue === 'number') {
                                    formattedValue = originalValue.toLocaleString('pt-BR');
                                  }

                                  return (
                                    <td 
                                      key={col.key} 
                                      className={`py-3.5 px-3.5 text-slate-800 ${col.align === 'right' ? 'text-right' : ''} ${col.key === 'unidade' || col.key === 'etapa' || col.key === 'cargo' ? 'font-bold text-slate-900' : ''}`}
                                    >
                                      {formattedValue}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}

                            {reportRows.length === 0 && (
                              <tr>
                                <td colSpan={currentReport.columns.length} className="text-center py-12 text-slate-400">
                                  Nenhum registro encontrado para esta SPE neste exercício de {buildiqData.activeDate}.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Visual PoC and Costs indicators */}
                      <div className="border-t border-slate-150 pt-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                        
                        {/* PoC Box */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                            <span className="font-semibold text-slate-600 flex items-center gap-1 font-sans">
                              <HardHat className="w-4 h-4 text-orange-500" />
                              Progresso Físico Arbitrado
                            </span>
                            <strong className="text-teal-600 font-bold font-mono">{alignedObra.progressoFisico}% PoC</strong>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-teal-600 h-full rounded-full" style={{ width: `${alignedObra.progressoFisico}%` }} />
                          </div>
                        </div>

                        {/* Commercialisation Box */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                            <span className="font-semibold text-slate-600 flex items-center gap-1 font-sans">
                              <Users className="w-4 h-4 text-orange-500" />
                              Metas de Comercialização
                            </span>
                            <strong className="text-indigo-700 font-bold font-mono">
                              {Math.round((alignedObra.unidadesVendidas / alignedObra.unidadesTotais) * 100)}% Vendido
                            </strong>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full rounded-full animate-pulse" style={{ width: `${(alignedObra.unidadesVendidas / alignedObra.unidadesTotais) * 100}%` }} />
                          </div>
                        </div>

                      </div>

                    </motion.div>
                  ) : (
                    <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                      <p className="text-xs text-slate-450">Selecione uma pasta de relatório no menu lateral de controles.</p>
                    </div>
                  )}
                </AnimatePresence>

                <div className="bg-slate-50 border border-slate-150 p-5 rounded-xl text-xs text-slate-500 space-y-2 leading-relaxed">
                  <h4 className="font-bold text-slate-800">Definições Técnicas de Índices de Engenharia:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong className="text-slate-700">IPC (Índice de Performance de Custo)</strong>: Razão entre o custo orçado cumulativo original e o custo real de faturamento. Coeficientes <span className="text-emerald-700 font-mono">≥ 1.00</span> indicam custo dentro do limite orçado.
                    </li>
                    <li>
                      <strong className="text-slate-700">IPP (Índice de Performance de Prazo)</strong>: Razão entre o progresso medido em campo (%) e o cronograma de progresso previsto (%). Medições <span className="text-emerald-700 font-mono">≥ 1.00</span> atestam aderência ao cronograma de prumo.
                    </li>
                  </ul>
                </div>

              </div>

            </div>
          </motion.div>
        ) : activeTab === 'evm' ? (
          renderEvmPage()
        ) : (
          <motion.div
            key="feasibility-section"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Feasibility Summary Cards comparing V0 vs Act */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">VGV Geral do Projeto</span>
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-450 flex justify-between">
                    <span>Base (v0):</span>
                    <span>{formatReais(feasibilitySummary.vgv.ver0)}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800 flex justify-between items-end">
                    <span>Atual:</span>
                    <span className="text-lg text-slate-950 font-mono">{formatReais(feasibilitySummary.vgv.out25)}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                  <span className="text-slate-450">Variação no VGV:</span>
                  <span className={`font-mono font-bold flex items-center gap-0.5 ${feasibilitySummary.vgv.variacao >= 0 ? "text-emerald-600" : "text-red-650"}`}>
                    {feasibilitySummary.vgv.variacao >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {formatReais(Math.abs(feasibilitySummary.vgv.variacao))}
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Custo Consolidado (Capex)</span>
                  <BadgeAlert className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-450 flex justify-between">
                    <span>Base (v0):</span>
                    <span>{formatReais(feasibilitySummary.custo.ver0)}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800 flex justify-between items-end">
                    <span>Atual:</span>
                    <span className="text-lg text-red-650 font-mono">{formatReais(feasibilitySummary.custo.out25)}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                  <span className="text-slate-450">Estouro Líquido:</span>
                  <span className="font-mono font-bold text-red-600 flex items-center gap-0.5">
                    <ArrowUp className="w-3 h-3" />
                    {formatReais(Math.abs(feasibilitySummary.custo.variacao))}
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Resultado Líquido</span>
                  <Coins className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-450 flex justify-between">
                    <span>Base (v0):</span>
                    <span>{formatReais(feasibilitySummary.lucro.ver0)}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800 flex justify-between items-end">
                    <span>Atual:</span>
                    <span className="text-lg text-orange-650 font-mono">{formatReais(feasibilitySummary.lucro.out25)}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                  <span className="text-slate-450">Encolhimento de Margem:</span>
                  <span className="font-mono font-bold text-red-600 flex items-center gap-0.5">
                    <ArrowDown className="w-3 h-3" />
                    {formatReais(Math.abs(feasibilitySummary.lucro.variacao))}
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Margem Líquida s/ VGV</span>
                  <Percent className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-450 flex justify-between">
                    <span>Base (v0):</span>
                    <span>{(feasibilitySummary.margem.ver0).toFixed(2)}%</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800 flex justify-between items-end">
                    <span>Atual:</span>
                    <span className="text-lg text-slate-900 font-mono">{(feasibilitySummary.margem.out25).toFixed(2)}%</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                  <span className="text-slate-450">Variação Real:</span>
                  <span className="font-mono font-bold text-red-600 flex items-center gap-0.5">
                    <ArrowDown className="w-3 h-3" />
                    {(feasibilitySummary.margem.variacao).toFixed(2)}%
                  </span>
                </div>
              </div>

            </div>

            {/* Main Comparative Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Left Side: Feasibility Comparative Table (2/3 width) */}
              <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-150">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-sans flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-orange-500" />
                      Planilha de Viabilidade Comparativa (Matera Residence By Just)
                    </h3>
                    <p className="text-[11px] text-slate-450">Demonstração integrada de desvios operacionais da Versão Original (v0) contra a Revisão de Outubro/2025.</p>
                  </div>
                  <span className="bg-orange-50 border border-orange-100 text-orange-800 text-[10px] font-mono font-bold px-3 py-1 rounded">
                    MOEDA: REAIS (R$)
                  </span>
                </div>

                {/* Scannable Grid Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100/75 text-slate-600 font-mono text-[9px] border-b border-slate-200 uppercase">
                      <tr>
                        <th className="py-2.5 px-3 font-bold w-1/3">Grupo de Custos e Contas</th>
                        <th className="py-2.5 px-3 font-bold text-right">Preliminar (v0)</th>
                        <th className="py-2.5 px-3 font-bold text-right">Revisão (out-25)</th>
                        <th className="py-2.5 px-3 font-bold text-right">Variação</th>
                        <th className="py-2.5 px-3 font-bold">Observações / Motivos do Desvio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeViabilidade.map((row, index) => {
                        // Check if row is primary category or a computed total
                        const isPrimary = row.isHeader;
                        const isTotalRow = row.isTotal;

                        return (
                          <tr 
                            key={index} 
                            className={`transition hover:bg-slate-50/50 ${
                              isPrimary ? "bg-slate-50/70 font-semibold text-slate-900" : "text-slate-650"
                            } ${isTotalRow ? "bg-slate-100 font-bold border-t-2 border-slate-350 text-slate-950" : ""}`}
                          >
                            <td className={`py-2 px-3 ${row.indent ? "pl-7 text-slate-500 italic" : ""}`}>
                              {row.item}
                            </td>
                            
                            <td className="py-2 px-3 text-right font-mono font-medium">
                              {row.isPercentage ? `${row.ver0.toFixed(2)}%` : formatReaisCentavos(row.ver0)}
                            </td>

                            <td className="py-2 px-3 text-right font-mono font-bold">
                              {row.isPercentage ? `${row.out25.toFixed(2)}%` : formatReaisCentavos(row.out25)}
                            </td>

                            <td className={`py-2 px-3 text-right font-mono font-bold ${
                              row.variacao > 0 
                                ? "text-emerald-600" 
                                : row.variacao < 0 
                                  ? "text-red-650" 
                                  : "text-slate-400"
                            }`}>
                              {row.variacao === 0 ? "—" : (row.variacao > 0 ? "+" : "") + (row.isPercentage ? `${row.variacao.toFixed(2)}%` : formatReaisCentavos(row.variacao))}
                            </td>

                            <td className="py-2 px-3 text-slate-450 text-[10px] font-sans truncate max-w-[200px]" title={row.obs || ""}>
                              {row.obs || "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Side: Board Diagnostic Panel & Alavancagem timelines */}
              <div className="space-y-6">
                
                {/* Board warning file */}
                <div className="bg-red-50 border border-red-200/60 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <h4 className="text-xs font-bold font-sans tracking-wide uppercase">Dossiê de Alavancagem & Juros de Obra</h4>
                  </div>
                  <div className="text-[11px] text-red-700 leading-relaxed font-medium space-y-2">
                    <p>
                      O desvio acumulado de viabilidade de <strong className="font-extrabold text-red-800">{formatReais(feasibilitySummary.custo.variacao)}</strong> possui um gatilho financeiro e imobiliário muito claro.
                    </p>
                    <p>
                      As <strong className="text-red-800">Despesas Financeiras (Captação Banco Bradesco III)</strong> saltaram de <strong className="text-red-800">{formatReais(4764113)}</strong> para <strong className="text-red-800">{formatReais(10314723)}</strong>, gerando um estouro de <strong className="text-red-900 font-extrabold">{formatReais(5550610)}</strong>.
                    </p>
                    <p>
                      <strong>Causa Raiz:</strong> O atraso físico ou operacional de repasse habitacional (retarde na liberação de mutuários) alongou a dívida do projeto, acumulando juros de tabela progressiva mês após mês.
                    </p>
                  </div>
                </div>

                {/* Real-world timeline flow */}
                <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-sm border border-slate-800 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-orange-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <Coins className="w-4 h-4" />
                      Evolução Real de Juros (Bradesco III)
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-snug">Detalhamento dos desembolsos efetivos que pressionaram o fluxo de caixa gerencial:</p>
                  </div>

                  <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 text-[10.5px] font-mono scrollbar-thin">
                    <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Março/2025:</span>
                      <strong className="text-slate-200">R$ 63.752,27</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Abril/2025:</span>
                      <strong className="text-slate-200">R$ 13.973,55</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Maio/2025:</span>
                      <strong className="text-slate-200">R$ 14.838,55</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Junho/2025:</span>
                      <strong className="text-slate-200">R$ 27.424,87</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Julho/2025:</span>
                      <strong className="text-slate-200">R$ 31.745,09</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Agosto/2025:</span>
                      <strong className="text-slate-200">R$ 42.095,30</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Setembro/2025:</span>
                      <strong className="text-slate-200">R$ 48.295,94</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                      <span className="text-orange-300 font-bold">Outubro/2025:</span>
                      <strong className="text-orange-300 font-bold">R$ 65.519,45</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                      <span className="text-slate-350">Novembro/2025:</span>
                      <strong className="text-slate-250">R$ 68.971,20</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800/80 py-1">
                      <span className="text-slate-350">Projeção Média Mensal:</span>
                      <strong className="text-red-400">🚀 R$ 73.000 — R$ 194.000</strong>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-450 italic leading-relaxed pt-2 border-t border-slate-800/80">
                    *Tabela extraída do histórico de Contas Pagas (Apropriação Financeira) vinculadas diretamente à alavancagem de canteiro.
                  </p>
                </div>

                {/* Analytical nature details card */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-xs text-slate-500 leading-relaxed font-sans space-y-2">
                  <h4 className="font-bold text-slate-800">Conformidade e Regras da Camada de Inteligência:</h4>
                  <p>
                    Para manter as SPEs em rígido alinhamento contábil e em auditorias de terceiros, a presente tela processa o <strong className="text-slate-700">desvio gerencial de eficiência econômica de construção</strong>.
                  </p>
                  <p>
                    As alterações registradas no estudo de viabilidade, nos juros de alocação de carteira e nas projeções de comissão imobiliária compõem uma camada analítica isolada que **não altera as demonstrações financeiras oficiais** (Balanço, DRE e Razão fiscal) reguladas externamente.
                  </p>
                </div>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
