import { useState, FormEvent, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coins, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  History,
  CheckCircle,
  HelpCircle,
  Plus,
  RefreshCw,
  TrendingUp,
  FileCheck2,
  Sliders,
  DollarSign,
  Building2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SPE, TransacaoFinanceira } from '../types';
import { fc2026Data, FCItem, FCEntity } from '../data/fc2026Data';

interface FinanceFlowProps {
  spes: SPE[];
  transacoes: TransacaoFinanceira[];
  onAddTransacao: (tx: Omit<TransacaoFinanceira, 'id'>) => void;
  selectedSpeId: string | null;
  onSelectSPE: (speId: string | null) => void;
}

const MONTHS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

export default function FinanceFlow({ 
  spes, 
  transacoes, 
  onAddTransacao,
  selectedSpeId,
  onSelectSPE
}: FinanceFlowProps) {
  const [activeTab, setActiveTab] = useState<'fc2026' | 'executivo' | 'ledger'>('fc2026');
  
  // FC 2026 specific states
  const [selectedEntityKey, setSelectedEntityKey] = useState<string>('CONSOLIDADO');
  const [viewMode, setViewMode] = useState<'real_orc' | 'only_real' | 'only_orc'>('real_orc');
  const [budgetMultiplier, setBudgetMultiplier] = useState<number>(1.0);

  // Transaction entry form state
  const [desc, setDesc] = useState('');
  const [val, setVal] = useState('');
  const [cat, setCat] = useState<'Aporte' | 'Venda' | 'Fornecedor' | 'Impostos' | 'Folha de Pagto' | 'Financiamento'>('Venda');
  const [targetSpeId, setTargetSpeId] = useState(spes[0]?.id || '');
  const [simulatedAIAgentSync, setSimulatedAIAgentSync] = useState(false);

  const formatReais = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Resolve the active FCEntity data based on user selection
  const activeFCEntity = useMemo<FCEntity>(() => {
    if (selectedEntityKey === 'CONSOLIDADO') {
      return fc2026Data.CD;
    }
    return fc2026Data.SD[selectedEntityKey] || fc2026Data.CD;
  }, [selectedEntityKey]);

  // Adjust calculations dynamically if the user tweaks the multiplier
  const processedItems = useMemo<FCItem[]>(() => {
    return activeFCEntity.items.map(item => {
      if (item.is_saldo || item.is_total) return item;
      
      const multiplier = item.section === 'SAÍDAS' ? budgetMultiplier : 1.0;
      return {
        ...item,
        orc: item.orc.map(v => v * multiplier),
        real: item.real.map((v, i) => i >= fc2026Data.N_REAL ? v : v), // realized doesn't change
        previsto: item.previsto * multiplier,
        sar: item.sar * multiplier
      };
    });
  }, [activeFCEntity, budgetMultiplier]);

  // Calculated aggregates for the metric cards (using the chosen entity)
  const totals = useMemo(() => {
    const entradasItem = processedItems.find(i => i.section === 'ENTRADAS' && i.is_total);
    const saidasItem = processedItems.find(i => i.section === 'SAÍDAS' && i.is_total);

    let totalEntradas = 0;
    let totalSaidas = 0;

    if (entradasItem && saidasItem) {
      // Sum up months 1-12 based on the mode (real for 0-4, orc for 5-11)
      for (let m = 0; m < 12; m++) {
        if (m < fc2026Data.N_REAL) {
          totalEntradas += entradasItem.real[m];
          totalSaidas += saidasItem.real[m];
        } else {
          totalEntradas += entradasItem.orc[m];
          totalSaidas += saidasItem.orc[m];
        }
      }
    } else {
      totalEntradas = activeFCEntity.items
        .filter(i => i.section === 'ENTRADAS' && !i.is_total && !i.is_saldo)
        .reduce((sum, item) => sum + item.realized_tot + item.sar, 0);

      totalSaidas = activeFCEntity.items
        .filter(i => i.section === 'SAÍDAS' && !i.is_total && !i.is_saldo)
        .reduce((sum, item) => sum + item.realized_tot + item.sar, 0);
    }

    const netResultNum = totalEntradas - totalSaidas;
    const finalAccumulated = activeFCEntity.saldo_ini + netResultNum;

    return {
      entradas: totalEntradas,
      saidas: totalSaidas,
      saldoInicial: activeFCEntity.saldo_ini,
      saldoAcumulado: finalAccumulated,
      saltoLiquido: netResultNum
    };
  }, [processedItems, activeFCEntity, budgetMultiplier]);

  // Add a new transaction via AI Sync
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!desc || !val) return;
    
    const speObj = spes.find(s => s.id === targetSpeId);
    if (!speObj) return;

    setSimulatedAIAgentSync(true);

    setTimeout(() => {
      onAddTransacao({
        data: '12/06/2026 (Hoje)',
        descricao: desc,
        categoria: cat,
        valor: cat === 'Fornecedor' || cat === 'Impostos' || cat === 'Folha de Pagto' ? -Math.abs(parseFloat(val)) : Math.abs(parseFloat(val)),
        speId: targetSpeId,
        speNome: speObj.nome,
        status: 'Reconciliado'
      });
      setDesc('');
      setVal('');
      setSimulatedAIAgentSync(false);
    }, 1200);
  };

  // Grouped active items
  const entriesList = processedItems.filter(i => i.section === 'ENTRADAS' && !i.is_total);
  const totalEntriesRow = processedItems.find(i => i.section === 'ENTRADAS' && i.is_total);
  const exitsList = processedItems.filter(i => i.section === 'SAÍDAS' && !i.is_total && !i.is_saldo);
  const totalExitsRow = processedItems.find(i => i.section === 'SAÍDAS' && i.is_total);
  const netDiffRow = processedItems.find(i => i.section === 'SAÍDAS' && i.is_saldo);

  // Hardcoded real-world debt schedules from "EMPRÉSTIMOS" Cost Center for Executive Tab
  const debtSchedules = [
    { banco: "Banco Safra", tipo: "Capital de Giro", valorContratado: 2300000, jurosNominal: "1.45% a.m.", amortizado: 750000, status: "Adimplente" },
    { banco: "Banco Bradesco FGI", tipo: "Alavancagem PoC", valorContratado: 1500000, jurosNominal: "CDI + 4.5% a.a.", amortizado: 620000, status: "Adimplente" },
    { banco: "Sicoob", tipo: "Financiamento Produção", valorContratado: 1800000, jurosNominal: "9.2% a.a.", amortizado: 300000, status: "Adimplente" },
    { banco: "Particular (Sueli)", tipo: "Mútuo de Apoio", valorContratado: 600000, jurosNominal: "1.20% a.m.", amortizado: 180000, status: "Adimplente" }
  ];

  return (
    <div id="financeflow-module" className="space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold text-orange-600 tracking-wider flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5" />
            MÓDULO FINANCE FLOW 2026
          </div>
          <h1 className="text-2xl font-bold font-sans text-slate-900 tracking-tight">
            Fluxo de Caixa Operacional & Planejamento Financeiro
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl">
            Sincronizando o orçamento consolidado (**FC 2026**) da JUST e suas SPEs. Visualize dados fechados (Jan-Abr) combinados a projeções dinâmicas sob cenários reguláveis de inflação e custos físicos.
          </p>
        </div>

        {/* Level Toggles */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs self-start shrink-0">
          <button 
            id="tab-fc2026"
            className={`px-4 py-2 rounded-lg transition font-semibold flex items-center gap-1.5 ${activeTab === 'fc2026' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-850'}`}
            onClick={() => setActiveTab('fc2026')}
          >
            <Calendar className="w-3.5 h-3.5" />
            Planilha de Caixa 2026
          </button>
          <button 
            id="tab-executivo"
            className={`px-4 py-2 rounded-lg transition font-semibold flex items-center gap-1.5 ${activeTab === 'executivo' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-850'}`}
            onClick={() => setActiveTab('executivo')}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            Resumo & Cronogramas
          </button>
          <button 
            id="tab-ledger"
            className={`px-4 py-2 rounded-lg transition font-semibold flex items-center gap-1.5 ${activeTab === 'ledger' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-850'}`}
            onClick={() => setActiveTab('ledger')}
          >
            <History className="w-3.5 h-3.5" />
            Extrado Contábil Geral
          </button>
        </div>
      </div>

      {activeTab === 'fc2026' && (
        <div className="space-y-6">
          {/* Top Controls Bar */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Entity Selector dropdown */}
            <div className="space-y-1 z-10">
              <label className="text-[10px] font-mono text-slate-400 block uppercase tracking-wide">Selecionar Centro de Custo / SPE</label>
              <div className="flex items-center gap-3">
                <select 
                  id="entity-selector"
                  value={selectedEntityKey} 
                  onChange={(e) => setSelectedEntityKey(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-100 rounded-xl font-bold text-sm px-4 py-2.5 outline-none focus:border-orange-500"
                >
                  <option value="CONSOLIDADO">🏢 CONSOLIDADO GRUPO JUST</option>
                  <optgroup label="Centros de Custos Operacionais">
                    <option value="ADM">💼 Administração Central (Overhead)</option>
                    <option value="TRAVÉZA">🏡 Travéza Residence (Inco.)</option>
                    <option value="OBRAS ENTREGUES">🏨 Incorporações Entregues (Garantias)</option>
                    <option value="JUSTCON">🔨 Justcon Engenharia</option>
                    <option value="JUSTFIX">🔧 Justfix Manutenção</option>
                    <option value="OBRAS DE TERCEIROS">🤝 Obras de Terceiros</option>
                    <option value="EMPRÉSTIMOS">🏦 Empréstimos & Consórcios</option>
                  </optgroup>
                  <optgroup label="Sociedades de Propósito Específico (SPEs)">
                    <option value="MATERA">📐 SPE Matera Ltda</option>
                    <option value="CIPRIANO">🏢 SPE Cipriano Ltda</option>
                    <option value="NEO">🏙️ SPE Neo Ltda</option>
                    <option value="BLANK">⬜ SPE Blank Ltda</option>
                  </optgroup>
                </select>
                <span className="text-xs text-orange-400 font-mono bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">
                  Fechado em: 01/06/2026
                </span>
              </div>
            </div>

            {/* View Mode controls */}
            <div className="space-y-1 z-10 shrink-0">
              <label className="text-[10px] font-mono text-slate-400 block uppercase tracking-wide">Modo de Exibição das Colunas</label>
              <div className="grid grid-cols-3 bg-slate-850 p-1 rounded-xl border border-slate-700 text-xs">
                <button 
                  className={`px-3 py-1.5 rounded-lg transition font-medium ${viewMode === 'real_orc' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  onClick={() => setViewMode('real_orc')}
                >
                  Real x Orç
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-lg transition font-medium ${viewMode === 'only_real' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  onClick={() => setViewMode('only_real')}
                >
                  Realizado
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-lg transition font-medium ${viewMode === 'only_orc' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  onClick={() => setViewMode('only_orc')}
                >
                  Orçado
                </button>
              </div>
            </div>

            {/* Budget multiplier settings */}
            <div className="space-y-1.5 z-10 shrink-0 min-w-[200px]">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span className="uppercase">Sensibilidade de Custos</span>
                <span className="text-orange-400 font-bold">{Math.round(budgetMultiplier * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0.80" 
                  max="1.50" 
                  step="0.05"
                  value={budgetMultiplier}
                  onChange={(e) => setBudgetMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 h-1 rounded-lg bg-slate-700 cursor-pointer"
                />
                <button 
                  onClick={() => setBudgetMultiplier(1.0)}
                  className="text-[10px] text-slate-400 hover:text-white font-mono bg-slate-800 px-2 py-1 rounded"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
              <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider block">Saldo Inicial</span>
              <div className="text-lg font-bold font-sans text-slate-900">{formatReais(totals.saldoInicial)}</div>
              <p className="text-[10px] text-slate-450">Disponibilidade no dia 01/Jan</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
              <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider block">Total Entradas</span>
              <div className="text-lg font-bold font-sans text-emerald-600">{formatReais(totals.entradas)}</div>
              <p className="text-[10px] text-slate-450">Faturamento integral estimado</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
              <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider block">Total Saídas</span>
              <div className="text-lg font-bold font-sans text-red-650 text-red-600">-{formatReais(totals.saidas)}</div>
              <p className="text-[10px] text-slate-450">Custos ajustados pela sensibilidade</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
              <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider block">Resultado Líquido</span>
              <div className={`text-lg font-bold font-sans ${totals.saltoLiquido >= 0 ? 'text-teal-600' : 'text-red-600'}`}>
                {totals.saltoLiquido >= 0 ? '+' : ''}{formatReais(totals.saltoLiquido)}
              </div>
              <p className="text-[10px] text-slate-450">Superávit gerado no exercício</p>
            </div>
            <div className="bg-slate-900 p-5 rounded-2xl text-orange-400 border border-slate-800 shadow-md space-y-1.5">
              <span className="text-[10.5px] font-mono text-orange-400/75 uppercase tracking-wider block">Saldo Projetado Dez/2026</span>
              <div className="text-lg font-bold font-sans text-white font-mono">{formatReais(totals.saldoAcumulado)}</div>
              <p className="text-[10px] text-slate-400">Caixa final acumulado</p>
            </div>
          </div>

          {/* SVG Quick Cash Flow Preview Line Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900 font-sans">Evolução Líquida do Caixa 2026: {selectedEntityKey}</h4>
                <p className="text-xs text-slate-450">Volume acumulado mês-a-mês considerando depósitos e amortizações</p>
              </div>
              <div className="flex gap-4 text-[11px] font-medium text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                  Saldo Acumulado
                </span>
                <span className="flex items-center gap-1.5 text-orange-400">
                  <span className="w-2.5 h-0.5 bg-orange-400 border-t-2 border-dashed" />
                  Sensibilizador Ativo ({Math.round(budgetMultiplier*100)}%)
                </span>
              </div>
            </div>

            <div className="h-32 w-full bg-slate-50 rounded-xl relative p-3 border border-slate-150 flex flex-col justify-between">
              {/* Plot absolute numbers on responsive vector line */}
              <svg className="absolute inset-x-8 top-3 bottom-8 w-[calc(100%-4rem)] h-[calc(100%-2.5rem)]" viewBox="0 0 100 35" preserveAspectRatio="none">
                <path 
                  d="M 0 25 L 9.09 21 L 18.18 26 L 27.27 28 L 36.36 25 L 45.45 22 L 54.54 13 L 63.63 17 L 72.72 19 L 81.81 18 L 90.9 22 Q 95.4 28, 100 30" 
                  fill="none" 
                  stroke="#0f172a" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                />
                
                {/* Visual points for the months */}
                <circle cx="0" cy="25" r="1" fill="#f97316" />
                <circle cx="36.36" cy="25" r="1.2" fill="#22c55e" /> {/* actual boundary pointer */}
                <circle cx="100" cy="30" r="1" fill="#ef4444" />
              </svg>

              {/* Month X Labels */}
              <div className="flex justify-between px-6 text-[9.5px] font-mono text-slate-400 mt-auto pt-2 border-t border-slate-150">
                {MONTHS.map((m, idx) => (
                  <span key={m} className={idx < fc2026Data.N_REAL ? "text-slate-850 font-bold" : "text-slate-400"}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN CASH FLOW SPREADSHEET */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-150 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-slate-900 font-sans">Orçamento de Fluxo de Caixa Integrado</h3>
                <p className="text-xs text-slate-400">Valores em Reais (BRL). Colunas de Jan a Abr contêm números reais auditados; Maio a Dez são projeções.</p>
              </div>
              <div className="flex bg-orange-100/50 text-orange-850 text-xs px-3 py-1.5 rounded-lg border border-orange-200 gap-1.5 items-center font-medium">
                <Layers className="w-4 h-4 text-orange-500" />
                <span>Exibindo: <strong>{selectedEntityKey}</strong></span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-500 font-mono text-[10px] border-b border-slate-200 uppercase">
                    <th className="py-3.5 px-4 font-semibold sticky left-0 bg-slate-100 z-10 w-[240px] border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Linha de Resultado / Descritivo</th>
                    {MONTHS.map((m, i) => (
                      <th key={m} className={`py-3.5 px-3 font-semibold text-right ${i < fc2026Data.N_REAL ? 'bg-slate-150/45 text-slate-900 font-extrabold' : 'text-slate-500'}`}>
                        {m}
                        <span className="block text-[8px] font-normal leading-none font-sans mt-0.5 text-slate-450">
                          {i < fc2026Data.N_REAL ? 'REAL' : 'PREV'}
                        </span>
                      </th>
                    ))}
                    <th className="py-3.5 px-4 font-semibold text-right bg-slate-150 text-slate-900">Total Período</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-sans">
                  
                  {/* Saldo Anterior Row */}
                  <tr className="bg-indigo-50/20 text-[11px] font-mono font-medium text-indigo-900">
                    <td className="py-3 px-4 font-semibold sticky left-0 bg-indigo-50/90 z-10 border-r border-slate-200 font-sans shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Saldo Anterior</td>
                    {activeFCEntity.saldo_ant.map((val, idx) => (
                      <td key={idx} className="py-3 px-3 text-right font-semibold">
                        {formatReais(val)}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right font-bold bg-indigo-50/50">--</td>
                  </tr>

                  {/* Section 1: Entradas */}
                  <tr className="bg-slate-100/50 text-[10.5px] font-mono text-slate-500 font-bold uppercase tracking-wide">
                    <td className="py-2.5 px-4 sticky left-0 bg-slate-100/90 z-10 border-r border-slate-200 font-sans shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">▲ ENTRADAS / RECEITAS</td>
                    {Array(13).fill(null).map((_, i) => <td key={i} className="py-2.5 px-3"></td>)}
                  </tr>

                  {entriesList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition text-[11.5px]">
                      <td className="py-2.5 px-4 font-medium text-slate-800 sticky left-0 bg-white z-10 border-r border-slate-150 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">{item.label}</td>
                      {MONTHS.map((m, mIdx) => {
                        const cellVal = mIdx < fc2026Data.N_REAL ? item.real[mIdx] : item.orc[mIdx];
                        return (
                          <td key={mIdx} className={`py-2.5 px-3 text-right font-mono ${mIdx < fc2026Data.N_REAL ? 'text-slate-800 font-medium' : 'text-slate-505 text-slate-500'}`}>
                            {cellVal === 0 ? '-' : formatReais(cellVal)}
                          </td>
                        );
                      })}
                      <td className="py-2.5 px-4 text-right font-bold font-mono text-slate-900 bg-slate-50">
                        {formatReais(item.realized_tot + item.sar)}
                      </td>
                    </tr>
                  ))}

                  {/* Total Entradas row */}
                  {totalEntriesRow && (
                    <tr className="bg-emerald-55/10 font-semibold text-emerald-950 font-mono text-[11.5px]">
                      <td className="py-3 px-4 font-bold sticky left-0 bg-emerald-50/90 z-10 border-r border-slate-200 font-sans shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] text-emerald-900 uppercase">Total das Entradas</td>
                      {MONTHS.map((m, mIdx) => {
                        const cellVal = mIdx < fc2026Data.N_REAL ? totalEntriesRow.real[mIdx] : totalEntriesRow.orc[mIdx];
                        return (
                          <td key={mIdx} className="py-3 px-3 text-right text-emerald-800 font-bold">
                            {formatReais(cellVal)}
                          </td>
                        );
                      })}
                      <td className="py-3 px-4 text-right font-extrabold bg-emerald-100/55 text-emerald-900">
                        {formatReais(totalEntriesRow.realized_tot + totalEntriesRow.sar)}
                      </td>
                    </tr>
                  )}

                  {/* Section 2: Saídas */}
                  <tr className="bg-slate-100/50 text-[10.5px] font-mono text-slate-500 font-bold uppercase tracking-wide">
                    <td className="py-2.5 px-4 sticky left-0 bg-slate-100/90 z-10 border-r border-slate-200 font-sans shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">▼ SAÍDAS / CUSTOS E DESPESAS</td>
                    {Array(13).fill(null).map((_, i) => <td key={i} className="py-2.5 px-3"></td>)}
                  </tr>

                  {exitsList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition text-[11.5px]">
                      <td className="py-2.5 px-4 font-medium text-slate-800 sticky left-0 bg-white z-10 border-r border-slate-150 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">{item.label}</td>
                      {MONTHS.map((m, mIdx) => {
                        const cellVal = mIdx < fc2026Data.N_REAL ? item.real[mIdx] : item.orc[mIdx];
                        return (
                          <td key={mIdx} className={`py-2.5 px-3 text-right font-mono ${mIdx < fc2026Data.N_REAL ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
                            {cellVal === 0 ? '-' : `(${formatReais(cellVal)})`}
                          </td>
                        );
                      })}
                      <td className="py-2.5 px-4 text-right font-bold font-mono text-red-750 bg-slate-50">
                        ({formatReais(item.realized_tot + item.sar)})
                      </td>
                    </tr>
                  ))}

                  {/* Total Saídas row */}
                  {totalExitsRow && (
                    <tr className="bg-rose-55/10 font-semibold text-rose-950 font-mono text-[11.5px]">
                      <td className="py-3 px-4 font-bold sticky left-0 bg-rose-50/90 z-10 border-r border-slate-200 font-sans shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] text-red-900 uppercase">Total das Saídas</td>
                      {MONTHS.map((m, mIdx) => {
                        const cellVal = mIdx < fc2026Data.N_REAL ? totalExitsRow.real[mIdx] : totalExitsRow.orc[mIdx];
                        return (
                          <td key={mIdx} className="py-3 px-3 text-right text-red-800 font-bold">
                            ({formatReais(cellVal)})
                          </td>
                        );
                      })}
                      <td className="py-3 px-4 text-right font-extrabold bg-rose-100/55 text-red-950">
                        ({formatReais(totalExitsRow.realized_tot + totalExitsRow.sar)})
                      </td>
                    </tr>
                  )}

                  {/* Saldo Líquido row */}
                  {netDiffRow && (
                    <tr className="bg-slate-100 font-mono text-[11.5px] border-t-2 border-slate-300">
                      <td className="py-3 px-4 font-extrabold sticky left-0 bg-slate-100/95 z-10 border-r border-slate-200 font-sans shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] uppercase">Result. de Período (Líq.)</td>
                      {MONTHS.map((m, mIdx) => {
                        const cellVal = mIdx < fc2026Data.N_REAL ? netDiffRow.real[mIdx] : netDiffRow.orc[mIdx];
                        const isNeg = cellVal < 0;
                        return (
                          <td key={mIdx} className={`py-3 px-3 text-right font-extrabold ${isNeg ? 'text-red-650 text-red-600' : 'text-emerald-700'}`}>
                            {isNeg ? '' : '+'}{formatReais(cellVal)}
                          </td>
                        );
                      })}
                      <td className="py-3 px-4 text-right font-extrabold bg-slate-250 bg-slate-200 text-slate-900">
                        {netDiffRow.realized_tot + netDiffRow.sar >= 0 ? '+' : ''}{formatReais(netDiffRow.realized_tot + netDiffRow.sar)}
                      </td>
                    </tr>
                  )}

                  {/* Saldo Acumulado row */}
                  <tr className="bg-slate-950 text-slate-100 font-mono text-[11.5px] font-bold">
                    <td className="py-3 px-4 sticky left-0 bg-slate-950 z-10 border-r border-slate-700 font-sans shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)] uppercase">Saldo Acumulado Final</td>
                    {activeFCEntity.saldo_acum.map((val, idx) => (
                      <td key={idx} className={`py-3 px-3 text-right font-bold ${val < 0 ? 'text-orange-400' : 'text-slate-100'}`}>
                        {formatReais(val)}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right font-extrabold bg-slate-900 text-orange-400">
                      {formatReais(activeFCEntity.saldo_acum[11])}
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
            
            <div className="bg-slate-50 p-4 border-t border-slate-150 text-[11px] text-slate-500 flex items-start gap-2 leading-relaxed">
              <HelpCircle className="w-4.5 h-4.5 text-orange-600 shrink-0" />
              <span>
                <strong>Nota Técnica sobre Fechamento:</strong> As tabelas refletem a apuração de fluxo de caixa realizada pelo **Comitê Financeiro Just** em {fc2026Data.meta.fechado_em}. As distorções ou desvios em relación ao previsto original são reajustados semestralmente nos relatórios patrimoniais de reconciliação.
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'executivo' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Executive summary of the 2026 plan (2/3 width) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] bg-slate-100 text-slate-800 font-mono px-2 py-0.5 rounded-md font-bold">ANÁLISE DE PLANEJAMENTO</span>
                <h3 className="text-lg font-bold text-slate-900 font-sans">Destaques Estratégicos & Executivos (DRE 2026)</h3>
                <p className="text-xs text-slate-450">Demonstração condensada e notas explicativas sobre os pilares da operação do grupo Just neste trimestre.</p>
              </div>

              {/* Bento sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-150 space-y-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-105 bg-orange-50 text-orange-700 flex items-center justify-center border border-orange-100">
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">1. Alavancagem PoC & Repasses</h4>
                    <p className="text-[11.5px] leading-relaxed text-slate-500 mt-1">
                      As SPEs Matera e Neo encerraram a contratação do repasse de PJ junto à Caixa Econômica, o que garante a higienização do passivo do terreno e aportes de obra sintonizados com o avanço físico.
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl border border-slate-150 space-y-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
                    <TrendingUp className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">2. Margem de Solvência da Holding</h4>
                    <p className="text-[11.5px] leading-relaxed text-slate-500 mt-1">
                      A administração central dispõe hoje de mais de <strong className="text-indigo-850">R$ 1.1 milhão</strong> em liquidez imediata, suficiente para honrar 6.5 meses de despesa operacional fixa (overhead) sem repasses das SPEs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Surrogate bank details table */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center whitespace-nowrap">
                  <h4 className="text-xs font-bold uppercase font-mono text-slate-500">Cronograma de Contratos de Empréstimos Ativos</h4>
                  <span className="text-[10px] text-slate-400">Total passivo: R$ 6.2M</span>
                </div>
                <div className="overflow-x-auto border border-slate-150 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/70 text-slate-500 font-mono text-[9.5px] border-b border-slate-150 uppercase">
                      <tr>
                        <th className="py-2.5 px-3.5 font-semibold">Credor Institucional</th>
                        <th className="py-2.5 px-3 font-semibold">Modalidade</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Valor Inicial</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Amortizado</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Saldo Devedor</th>
                        <th className="py-2.5 px-3.5 font-semibold text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {debtSchedules.map((schedule, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3.5 font-semibold text-slate-900">{schedule.banco}</td>
                          <td className="py-2.5 px-3 text-slate-500 font-medium">{schedule.tipo}</td>
                          <td className="py-2.5 px-3 text-right font-mono">{formatReais(schedule.valorContratado)}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-emerald-600">-{formatReais(schedule.amortizado)}</td>
                          <td className="py-2.5 px-3 text-right font-bold font-mono text-slate-850">{formatReais(schedule.valorContratado - schedule.amortizado)}</td>
                          <td className="py-2.5 px-3.5 text-center">
                            <span className="bg-emerald-50 text-emerald-700 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">
                              {schedule.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Sidebar quick insights on Surplus payouts (1/3 width) */}
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 font-sans flex items-center gap-2">
                    <Wallet className="w-4.5 h-4.5 text-orange-600" />
                    Excedente Financeiro Recorrente
                  </h3>
                  <p className="text-xs text-slate-450">Dividendos distribuídos à holding controladora</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Margem SPE Matera Ltda:</span>
                    <strong className="text-slate-850 font-mono">+R$ 1.050.000</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Mútuos SPE Cipriano Ltda:</span>
                    <strong className="text-slate-850 font-mono">+R$ 380.000</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Excedente Blank Ltda:</span>
                    <strong className="text-slate-850 font-mono">+R$ 900.000</strong>
                  </div>
                  <div className="border-t border-slate-150 pt-3 flex justify-between items-center font-bold">
                    <span className="text-slate-900">Total Consolidado Pago:</span>
                    <span className="text-indigo-700 font-mono">{formatReais(3950000)}</span>
                  </div>
                </div>

                <p className="text-[10.5px] leading-relaxed text-slate-500 pr-1">
                  As distribuições de lucros ocorrem automaticamente conforme as metas de avanço físico de obra (**PoC**) são certificadas e as parcelas de repasse imobiliário compensadas em carteira.
                </p>
              </div>

              <div className="bg-slate-950 text-white p-6 rounded-2xl relative overflow-hidden space-y-3.5 shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Coins className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold">Otimização Patrimonial Just</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    A ferramenta **Strategic Tracker** detectou que ao manter o fluxo de caixa consolidado centralizado no CC Administração, o grupo reduziu a incidência do imposto s/ Aplicações Financeiras em mais de **42%** no acumulado deste semestre.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('fc2026')}
                  className="w-full text-center text-xs font-semibold text-slate-905 bg-white text-slate-950 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  Ver Planilha Consolidada
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Unified Ledger Log (2/3 width) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Apurador Geral de Movimentações (Canteiros + Bancos)
              </h3>
              <p className="text-xs text-slate-400">
                Todo o fluxo financeiro processado e verificado instantaneamente pelo ecossistema de dados.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-455 font-mono text-[10px] border-b border-slate-150 uppercase">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Data apuração</th>
                    <th className="py-3 px-4 font-semibold">Descrição do Movimento</th>
                    <th className="py-3 px-4 font-semibold">Categoria</th>
                    <th className="py-3 px-4 font-semibold">SPE de Origem</th>
                    <th className="py-3 px-4 font-semibold text-right">Valor Líquido</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {transacoes.map((tx) => {
                    const isExpense = tx.valor < 0;
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-mono text-slate-500">{tx.data}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{tx.descricao}</td>
                        <td className="py-3.5 px-4">
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-[9px] uppercase font-bold font-mono">
                            {tx.categoria}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-655 font-medium">{tx.speNome}</td>
                        <td className={`py-3.5 px-4 text-right font-mono font-bold ${isExpense ? 'text-red-600' : 'text-emerald-700'}`}>
                          {isExpense ? '' : '+'}{formatReais(tx.valor)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 text-[9.5px] font-bold px-2 py-0.5 rounded ${tx.status === 'Reconciliado' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive ERP Form simulating instant ingestion (1/3 width) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-orange-600">
                <RefreshCw className={`w-3.5 h-3.5 ${simulatedAIAgentSync ? 'animate-spin text-orange-500' : ''}`} />
                REGISTRO OPERACIONAL ERP
              </div>
              <h3 className="text-base font-bold text-slate-950 font-sans">Entrada de Diário Manual</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Adicione lançamentos extracontábeis. A esteira processará o balancete de forma automatizada sem emails ou arquivos.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700 block">Sociedade Target (SPE / CC)</label>
                <select 
                  value={targetSpeId} 
                  onChange={(e) => setTargetSpeId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold outline-none focus:border-orange-500 text-slate-800"
                >
                  {spes.map((s) => (
                    <option key={s.id} value={s.id}>{s.nome.split(' Ltda')[0]}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700 block">Histórico do Registro</label>
                <input 
                  type="text" 
                  placeholder="Fornecedor Cimento Holcim NF 220" 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-sans outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-700 block">Classificação</label>
                  <select 
                    value={cat} 
                    onChange={(e) => setCat(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold outline-none focus:border-orange-500 text-slate-800"
                  >
                    <option value="Fornecedor">Fornecedor</option>
                    <option value="Venda">Recebimento VGV</option>
                    <option value="Aporte">Aporte Capital</option>
                    <option value="Impostos">Imposto RET</option>
                  </select>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-700 block">Valor Bruto (R$)</label>
                  <input 
                    type="number" 
                    placeholder="150000" 
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={simulatedAIAgentSync}
                className="w-full bg-slate-900 text-white font-semibold text-xs py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-850 transition cursor-pointer disabled:opacity-50"
              >
                {simulatedAIAgentSync ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                    Ingerindo e auditando no ERP...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-orange-500" />
                    Lançar Transação
                  </>
                )}
              </button>
            </form>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-[10px] text-slate-450 font-mono">
              <span className="font-bold text-slate-600">Esteira Blockchain Audit:</span>
              <p className="mt-1 leading-normal">
                Todas as movimentações inseridas geram relatórios de concilação automatizados no módulo de Reconciliação Patrimonial da plataforma.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
