import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Wallet, 
  Building2, 
  Percent, 
  ArrowRight, 
  Sparkles, 
  Database, 
  CheckCircle, 
  AlertTriangle,
  RotateCw,
  Info
} from 'lucide-react';
import { SPE, Obra, AIAgent } from '../types';

interface ExecutiveOverviewProps {
  spes: SPE[];
  obras: Obra[];
  agents: AIAgent[];
  onNavigateToView: (view: 'overview' | 'buildiq' | 'financeflow' | 'reconciliation') => void;
  onSelectSPE: (speId: string) => void;
}

export default function ExecutiveOverview({ 
  spes, 
  obras, 
  agents, 
  onNavigateToView,
  onSelectSPE 
}: ExecutiveOverviewProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'wholly-owned' | 'joint-venture'>('all');

  // Math metrics
  const totalCaixa = spes.reduce((acc, s) => acc + s.caixaAtual, 0);
  const totalReceitaProjetada = spes.reduce((acc, s) => acc + s.receitaProjetada, 0);
  const totalReceitaRecebida = spes.reduce((acc, s) => acc + s.receitaRecebida, 0);
  
  // Weighted averages
  const avgProgressoFisico = Math.round(obras.reduce((acc, o) => acc + o.progressoFisico, 0) / obras.length);
  const avgProgressoFinanceiro = Math.round(obras.reduce((acc, o) => acc + o.progressoFinanceiro, 0) / obras.length);
  const avgVendas = Math.round(obras.reduce((acc, o) => acc + o.vendasProgresso, 0) / obras.length);

  // Filter SPEs
  const filteredSPEs = spes.filter(spe => {
    if (activeTab === 'wholly-owned') return spe.participacaoJust === 100;
    if (activeTab === 'joint-venture') return spe.participacaoJust < 100;
    return true;
  });

  const formatReais = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div id="executive-overview" className="space-y-8">
      {/* Prime Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 bg-slate-900 text-slate-100 p-8 rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative">
        <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -z-1" />
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 text-xs px-3 py-1 rounded-full font-medium border border-orange-500/20">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Consolidado Estratégico do Grupo
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
            Plataforma de Inteligência Just
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Integrando o desempenho operacional de obras (<span className="text-slate-200">BuildIQ</span>), liquidez contábil e estruturação de SPEs (<span className="text-slate-200">FinanceFlow</span>) em uma esteira inteligente e reconciliada.
          </p>
        </div>

        {/* Real-time Data pipeline indicator */}
        <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-slate-750 flex items-center gap-4 min-w-[280px]">
          <div className="relative">
            <span className="absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75 animate-ping top-0.5 right-0.5" />
            <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-orange-400 border border-slate-600">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-mono">ESTEIRA DE INTELIGÊNCIA</div>
            <div className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
              <span>Dado Integrado</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[10px] text-emerald-400">4 de 4 agentes de IA ativos</div>
          </div>
        </div>
      </div>

      {/* Main KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 - Caixa Global Consolidado */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-orange-500/30 transition-all duration-200 cursor-pointer"
          onClick={() => onNavigateToView('financeflow')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono font-medium tracking-wide">CAIXA CONSOLIDADO SPEs</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center border border-orange-100">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-950 font-sans tracking-tight">
              {formatReais(totalCaixa)}
            </h3>
            <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs mês anterior</span>
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 hover:text-orange-600 font-medium">
            <span>Ver liquidez de SPEs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* KPI 2 - VGV Projetado do Grupo */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-orange-500/30 transition-all duration-200 cursor-pointer"
          onClick={() => onNavigateToView('buildiq')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono font-medium tracking-wide">VGV TOTAL PROJETADO</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-950 font-sans tracking-tight">
              {formatReais(totalReceitaProjetada)}
            </h3>
            <p className="text-xs text-slate-500">
              Faturamento potencial assinado
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 hover:text-orange-600 font-medium">
            <span>Ver desempenho de vendas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* KPI 3 - Avanço Físico PoC (Média) */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-orange-500/30 transition-all duration-200 cursor-pointer"
          onClick={() => onNavigateToView('buildiq')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono font-medium tracking-wide">AVANÇO OPERACIONAL (PoC)</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-950 font-sans tracking-tight">
              {avgProgressoFisico}%
            </h3>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-teal-600 h-full rounded-full" style={{ width: `${avgProgressoFisico}%` }} />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 hover:text-orange-600 font-medium">
            <span>Média ponderada física de obras</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* KPI 4 - Ticket das Unidades Vendidas */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-orange-500/30 transition-all duration-200 cursor-pointer"
          onClick={() => onNavigateToView('buildiq')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono font-medium tracking-wide">VENDAS EM CARTEIRA</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-950 font-sans tracking-tight">
              {avgVendas}%
            </h3>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${avgVendas}%` }} />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 hover:text-orange-600 font-medium">
            <span>Ver comercializadora</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>
      </div>

      {/* Main Core View Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - SPEs List Status (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 font-sans">
                Status Estratégico das Entidades (SPEs)
              </h2>
              <p className="text-xs text-slate-500">
                Acompanhamento individualizado de liquidez e execução de ativos
              </p>
            </div>
            
            <div className="flex bg-slate-150 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs self-start">
              <button 
                className={`px-3 py-1.5 rounded-md font-medium transition ${activeTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-955'}`}
                onClick={() => setActiveTab('all')}
              >
                Todas
              </button>
              <button 
                className={`px-3 py-1.5 rounded-md font-medium transition ${activeTab === 'wholly-owned' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-955'}`}
                onClick={() => setActiveTab('wholly-owned')}
              >
                100% Just
              </button>
              <button 
                className={`px-3 py-1.5 rounded-md font-medium transition ${activeTab === 'joint-venture' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-955'}`}
                onClick={() => setActiveTab('joint-venture')}
              >
                Sociedades / SPEs
              </button>
            </div>
          </div>

          {/* Grid of custom SPE cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSPEs.map((spe) => (
              <div 
                key={spe.id}
                className="bg-slate-50 border border-slate-200 p-5 rounded-xl hover:bg-white hover:border-orange-400 hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm tracking-tight">{spe.nome}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">CNPJ: {spe.cnpj}</p>
                    </div>
                    <span className="bg-slate-205 bg-slate-200/65 text-slate-650 font-mono text-[10px] px-2.5 py-1 rounded font-medium">
                      {spe.participacaoJust}% Just
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-150 text-xs">
                    <div>
                      <div className="text-slate-400 text-[10.5px]">Caixa Disponível</div>
                      <div className="font-bold text-slate-850 font-sans">{formatReais(spe.caixaAtual)}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10.5px]">VGV Projetado</div>
                      <div className="font-bold text-slate-850 font-sans">{formatReais(spe.receitaProjetada)}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="text-slate-505">Avanço Físico Geral (PoC)</span>
                      <span className="font-semibold text-emerald-600">{spe.statusFisicoGeral}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${spe.statusFisicoGeral}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1.5">
                    <span className="text-[10px] text-red-650 bg-orange-500/5 border border-orange-500/10 px-2 py-0.5 rounded text-orange-600 flex items-center gap-1">
                      Financiado: {formatReais(spe.alavancagemBancaria)}
                    </span>
                    <button 
                      onClick={() => onSelectSPE(spe.id)}
                      className="text-orange-700 hover:text-orange-850 font-semibold flex items-center gap-1 cursor-pointer transition"
                    >
                      DRE / Detalhes →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick interactive Visual Chart (Custom SVG representing consolidated physical progression vs cost POC) */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-900">Curvas PoC do Grupo: Avanço Físico vs Execução Financeira</h3>
                <p className="text-xs text-stone-400">Status acumulado de faturamento e custos reportados da carteira</p>
              </div>
              <div className="flex gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-teal-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  Progresso Físico ({avgProgressoFisico}%)
                </span>
                <span className="flex items-center gap-1.5 text-indigo-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  Progresso Financeiro ({avgProgressoFinanceiro}%)
                </span>
              </div>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="h-44 w-full bg-stone-50 rounded-xl relative p-4 flex flex-col justify-between border border-stone-150">
              <div className="absolute left-10 right-4 top-4 hover:opacity-100 transition bottom-12 border-b border-l border-stone-200 flex flex-col justify-between">
                {/* Horizontal reference lines */}
                <div className="w-full border-t border-dashed border-stone-200 cursor-help" title="75%"></div>
                <div className="w-full border-t border-dashed border-stone-200 cursor-help" title="50%"></div>
                <div className="w-full border-t border-dashed border-stone-200 cursor-help" title="25%"></div>
              </div>

              {/* Chart curves using SVG */}
              <svg className="absolute inset-0 px-10 pb-12 pt-4 w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
                {/* Physical Progress Path (Teal) */}
                <path 
                  d="M 0 95 C 100 85, 200 65, 300 45 S 400 25, 500 15" 
                  fill="none" 
                  stroke="#0d9488" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />
                
                {/* Financial Progress Path (Indigo) */}
                <path 
                  d="M 0 95 C 100 90, 200 75, 300 55 S 400 30, 500 20" 
                  fill="none" 
                  stroke="#4f46e5" 
                  strokeWidth="3.5" 
                  strokeDasharray="4"
                  strokeLinecap="round"
                />
                
                {/* Interactive Points representing Obras */}
                <circle cx="60" cy="85" r="4.5" fill="#0d9488" />
                <circle cx="210" cy="58" r="4.5" fill="#4f46e5" />
                <circle cx="340" cy="38" r="4.5" fill="#0d9488" />
                <circle cx="470" cy="18" r="4.5" fill="#4f46e5" />
              </svg>

              {/* X and Y labels */}
              <div className="flex justify-between pl-10 pr-4 text-[9.5px] font-mono text-stone-400 mt-auto pt-2">
                <span>Início (2024)</span>
                <span>Fração 1 (2025)</span>
                <span>Atuais (Hoje)</span>
                <span>Projetado (2027)</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-[11px] text-stone-500 bg-stone-50 p-3 rounded-lg border border-stone-250">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                As curvas refletem um desvio saudável (Físico {avgProgressoFisico}% vs Financeiro {avgProgressoFinanceiro}%). Significa que as obras estão evoluindo acima do desembolso financeiro associado, gerando eficácia em estocagem e contratos de empreiteiros.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - AI Data Pipeline "Esteira de Dados" (1/3 width) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-stone-900 font-sans flex items-center gap-2">
                  <Database className="w-4.5 h-4.5 text-stone-850" />
                  Esteira de Dados
                </h3>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-mono font-medium animate-pulse">
                  AUTO-SYNC
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Agentes IA capturando dados contínuos sem chat ("Integre dados, não chats")
              </p>
            </div>

            {/* AI Agents List */}
            <div className="space-y-4">
              {agents.map((agent) => (
                <div 
                  key={agent.id}
                  className="bg-stone-50 border border-stone-150 p-4 rounded-xl space-y-3 hover:border-amber-400/50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${agent.status === 'Processando' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                      <h4 className="text-xs font-bold text-stone-850 font-sans">{agent.nome}</h4>
                    </div>
                    <span className="bg-stone-200 text-stone-600 font-mono text-[9px] px-1.5 py-0.5 rounded">
                      {agent.tipoFonte}
                    </span>
                  </div>
                  
                  <p className="text-[11px] text-stone-500 leading-normal font-sans">
                    {agent.funcao}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1.5 border-t border-stone-150">
                    <span>Processou hoje: <strong className="text-stone-700 font-mono">{agent.itensProcessadosHoje} itens</strong></span>
                    <span>Mod: {agent.ultimaExtracao}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-stone-900 text-stone-200 p-4 rounded-xl space-y-2 border border-stone-850">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-sans">
                <Sparkles className="w-3.5 h-3.5" />
                Destaque de Reconciliação
              </div>
              <p className="text-[10.5px] leading-relaxed text-stone-300">
                O agente <strong className="text-white">Fidu-Reconciler</strong> identificou divergência PoC na SPE Alvorada e sugeriu reajuste patrimonial automático de <span className="text-emerald-400 font-medium font-mono">R$ 450.000</span> corrigindo o balancete acumulado sem intervenção de e-mails.
              </p>
              <button 
                onClick={() => onNavigateToView('reconciliation')}
                className="w-full text-center text-[11px] font-semibold text-white bg-stone-800 hover:bg-stone-750 py-2 rounded-lg mt-1 border border-stone-700 transition"
              >
                Auditar com o Patrimônio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
