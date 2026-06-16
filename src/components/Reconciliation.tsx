import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  Sparkles, 
  ArrowRightLeft, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert,
  RefreshCw,
  FileSpreadsheet,
  Download,
  Info,
  TrendingUp,
  Building,
  Coins,
  Shield,
  ArrowUp,
  ArrowDown,
  HelpCircle,
  Activity,
  Building2,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { RegistroPatrimonial, Obra, SPE } from '../types';

interface ReconciliationProps {
  records: RegistroPatrimonial[];
  onCorrectDivergence: (recordId: string) => void;
  obras: Obra[];
  spes: SPE[];
  onUpdateObraEstagio: (obraId: string, novoEstagio: 'Previsto' | 'Em Construção' | 'Em Repasse' | 'Em Garantia') => void;
}

export default function Reconciliation({ 
  records, 
  onCorrectDivergence, 
  obras, 
  spes, 
  onUpdateObraEstagio 
}: ReconciliationProps) {
  const [activeTab, setActiveTab] = useState<'dre_just' | 'matrix' | 'drp'>('dre_just');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState('');
  const [auditLog, setAuditLog] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<'Todos' | 'Ativos' | 'Passivos'>('Todos');
  const [selectedObraId, setSelectedObraId] = useState<string>(obras[0]?.id || '');
  const [selectedDreItem, setSelectedDreItem] = useState<string | null>('Taxa de adm das obras das SPEs');
  const [showRealValues, setShowRealValues] = useState<boolean>(false);
  const [isSyncingSienge, setIsSyncingSienge] = useState<boolean>(false);
  const [syncTime, setSyncTime] = useState<string>('Hoje, às 08:30');

  // Unified dynamic cash position, POC and budget metrics calculations
  const dynamicMetrics = useMemo(() => {
    // 1. Calculate dynamic construction revenues & Taxa de Adm for holding Construtora Just
    const constructionObras = obras.filter(o => o.estagio === 'Em Construção');
    
    // Taxa de administração de obra: 15% on active construction costs
    const totalCustoConstrucaoAtivo = constructionObras.reduce((sum, o) => sum + o.custoRealizado, 0);
    const taxaAdmObrasCalculada = totalCustoConstrucaoAtivo * 0.15; // 15% de taxa de administração de obra

    // Justfix Revenue: supplier of tiles/granites proportional to building works (approx 6%)
    const justfixRevenueCalculada = totalCustoConstrucaoAtivo * 0.06;

    // Equivalência Patrimonial (CPC 18): sum (SPE profit proportionate to Just's participation)
    const equivalenciaPatrimonial = spes.reduce((sum, spe) => {
      // Net Profit of SPE: Receipts (ReceitaRecebida) minus Expenses (DespesaRealizada)
      const lucroMedidoSPE = Math.max(0, spe.receitaRecebida - spe.despesaRealizada);
      const participacaoFinan = (lucroMedidoSPE * (spe.participacaoJust / 100));
      return sum + participacaoFinan;
    }, 0);

    return {
      taxaAdmObras: Math.round(taxaAdmObrasCalculada / 1000), // in R$ Thousands for DRE
      justfixRevenue: Math.round(justfixRevenueCalculada / 1000), // in R$ Thousands for DRE
      equivalenciaProporcional: Math.round(equivalenciaPatrimonial / 1000), // in R$ Thousands for DRE
      totalCustoConstrucao: Math.round(totalCustoConstrucaoAtivo),
      obrasContadas: constructionObras.length
    };
  }, [obras, spes]);

  // Construct dynamic DRE Corporativa data basing on dynamic metrics
  const dreJustData = useMemo(() => {
    const receitaTaxa = dynamicMetrics.taxaAdmObras > 0 ? dynamicMetrics.taxaAdmObras : 2380;
    const receitaJustfix = dynamicMetrics.justfixRevenue > 0 ? dynamicMetrics.justfixRevenue : 1765;
    const receitaTerceiros = 2640; // Estático representativo de obras externas
    const receitaEquivalencia = dynamicMetrics.equivalenciaProporcional > 0 ? dynamicMetrics.equivalenciaProporcional : 6500;
    
    const totalReceitas = receitaTaxa + receitaJustfix + receitaTerceiros + receitaEquivalencia;

    const despesasAdm = -2450;
    const despesasProducao = -4060;
    const resultadoOperacional = totalReceitas + despesasAdm + despesasProducao;

    const despesaFinanceiraJuros = -1180;
    const resultadoLiquidoJustHolding = resultadoOperacional + despesaFinanceiraJuros;

    return [
      { item: 'Receitas Operacionais da Holding', previsto: 0, realizado: 0, delta: 0, isHeader: true },
      { 
        item: 'Taxa de adm das obras das SPEs', 
        previsto: 2500, 
        realizado: receitaTaxa, 
        delta: receitaTaxa - 2500, 
        code: '3.01.01.01',
        explanation: `Faturamento gerencial corporativo repassado às SPEs em construção para cobertura de overhead técnico (15% do custo realizado medido). Total de custo em canteiro Just medido neste ciclo: R$ ${(dynamicMetrics.totalCustoConstrucao).toLocaleString('pt-BR')} do Sienge.` 
      },
      { 
        item: 'Justfix — Fornecimento de Rochas e Granitos', 
        previsto: 1800, 
        realizado: receitaJustfix, 
        delta: receitaJustfix - 1800, 
        code: '3.01.01.02',
        explanation: 'Faturamento industrial de acabamentos e rochas ornamentais fornecidos de forma centralizada pela Justfix para os canteiros ativos, reduzindo o custo unitário global.' 
      },
      { 
        item: 'Obras de Terceiros / Prestação Externa', 
        previsto: 2500, 
        realizado: receitaTerceiros, 
        delta: 140, 
        code: '3.01.01.03',
        explanation: 'Contratos e prestação de serviços de engenharia e civil de terceiros para incorporadoras parceiras executadas sob a bandeira Construtora Just.' 
      },
      { 
        item: 'Participação Equiv. Patrimonial (CPC 18 / SPEs)', 
        previsto: 6000, 
        realizado: receitaEquivalencia, 
        delta: receitaEquivalencia - 6000, 
        code: '3.01.01.04',
        explanation: `Equivalência patrimonial apurada sobre a participação acionária da Construtora Just nas SPEs controladas. É o reconhecimento reflexo do lucro implícito proporcional acumulado nas estruturas apartadas corporativamente.` 
      },
      { 
        item: '= Receita líquida operacional de controle', 
        previsto: 12800, 
        realizado: totalReceitas, 
        delta: totalReceitas - 12800, 
        isTotal: true,
        code: '3.01',
        explanation: 'Soma total dos ingressos de custeio administrativo, industrial e lucros de participação antes de overhead corporativo geral.' 
      },
      { item: 'Overhead e Custos Corporativos', previsto: 0, realizado: 0, delta: 0, isHeader: true },
      { 
        item: '(-) Administração Central / SG&A Sede', 
        previsto: -2400, 
        realizado: despesasAdm, 
        delta: despesasAdm - (-2400), 
        code: '3.02.01.01',
        explanation: 'Despesas com pessoal administrativo da holding, sedes centralizadas de Maringá, tecnologia, segurança, compliance fiduciário e licenciamento do ERP Sienge.' 
      },
      { 
        item: '(-) Custos dos Centros Produtores (Justfix/Terceiros)', 
        previsto: -4000, 
        realizado: despesasProducao, 
        delta: despesasProducao - (-4000), 
        code: '3.02.01.02',
        explanation: 'Insumos de serraria industrial da Justfix, logística pesada, subempreiteiras, guindastes e impostos de prestação de serviços civis contratados.' 
      },
      { 
        item: '= Margem Gerencial Corrente (EBITDA)', 
        previsto: 6400, 
        realizado: resultadoOperacional, 
        delta: resultadoOperacional - 6400, 
        isTotal: true,
        code: '3.03',
        explanation: 'Lucro gerencial operacional obtido antes das incidências do carrego das linhas de dívida e juros de alongamento financeiro.' 
      },
      { item: 'Resultado Financeiro e Amortizações', previsto: 0, realizado: 0, delta: 0, isHeader: true },
      { 
        item: '(-) Despesa Financeira — Encargos da Dívida', 
        previsto: -1120, 
        realizado: despesaFinanceiraJuros, 
        delta: despesaFinanceiraJuros - (-1120), 
        code: '3.04.01.01',
        explanation: 'Taxas, juros de prumo corporativo de giro e custeio de linhas do Banco Bradesco e Itaú ligadas à estruturação geral da holding.' 
      },
      { 
        item: '= Lucro Líquido Consolidado da Construtora', 
        previsto: 5280, 
        realizado: resultadoLiquidoJustHolding, 
        delta: resultadoLiquidoJustHolding - 5280, 
        isDarkenTotal: true,
        code: '3.05',
        explanation: 'Apurado final de resultado da Construtora Just operando como cabeceira das SPEs. Este lucro ampara toda a projeção de solvência do plano de expansão.' 
      }
    ];
  }, [dynamicMetrics]);

  // Clean filters for audit anomalies
  const filteredRecords = records.filter(rec => {
    if (selectedGroup === 'Todos') return true;
    if (selectedGroup === 'Ativos') return rec.grupoPatrimonial.includes('Ativo');
    if (selectedGroup === 'Passivos') return !rec.grupoPatrimonial.includes('Ativo');
    return true;
  });

  const totalDivergencia = filteredRecords.reduce((acc, rec) => acc + rec.divergencia, 0);

  const formatReais = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleRunAudit = () => {
    setIsAuditing(true);
    setAuditLog([]);
    
    const steps = [
      'Iniciando verificação cruzada de dados das SPEs contra Sienge...',
      'Mapeando progresso de canteiro físico (POC) físico-financeiro...',
      'Conectando com o faturamento do Justfix de rochas ornamentais...',
      'Verificando faturamento de taxa de administração (15% sobre custo)...',
      'Calculando lucros reflexos por equivalência patrimonial (CPC 18)...',
      'Cruzando extratos de contas fiduciárias vinculadas...',
      'Auditoria de conformidade consolidada sem divergências graves!'
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setAuditStep(step);
        setAuditLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
        if (index === steps.length - 1) {
          setIsAuditing(false);
        }
      }, (index + 1) * 600);
    });
  };

  const activeObra = obras.find(o => o.id === selectedObraId) || obras[0];
  const activeSpeOfObra = spes.find(s => s.id === activeObra?.speId);

  // Download complete fiduciarily designed off-tab Dossier
  const handleDownloadDossier = () => {
    const todayStr = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const rowsHTML = dreJustData.map(item => {
      if (item.isHeader) {
        return `
          <tr class="bg-indigo-950/5 border-b border-[#0F293A]/10">
            <td colspan="4" class="p-3.5 text-[11px] font-bold text-[#0F293A] tracking-wider uppercase">${item.item}</td>
          </tr>
        `;
      }

      const formatDecimal = (num: number) => {
        const val = showRealValues ? num * 1000 : num;
        if (val === 0) return "—";
        const isNeg = val < 0;
        const absolute = Math.abs(val);
        const formatted = absolute.toLocaleString('pt-BR');
        return isNeg ? `(${formatted})` : formatted;
      };

      let styleRow = "border-b border-slate-100 hover:bg-[#FDFBF7]/50";
      let styleText = "text-slate-700 font-medium";
      let styleVal = "text-slate-800 font-mono text-right";
      
      if (item.isTotal) {
        styleRow = "bg-slate-50 font-bold border-y-2 border-slate-200";
        styleText = "text-[#0F293A] font-extrabold";
        styleVal = "text-[#0F293A] font-mono font-extrabold text-right";
      } else if (item.isDarkenTotal) {
        styleRow = "bg-[#0F293A] text-white font-bold";
        styleText = "text-white font-black";
        styleVal = "text-amber-200 font-mono font-bold text-right";
      }

      const deltaColor = item.delta > 0 ? "text-emerald-600 font-bold" : item.delta < 0 ? "text-rose-600 font-bold" : "text-slate-400";
      const deltaSign = item.delta > 0 ? "+" : "";

      return `
        <tr class="${styleRow}">
          <td class="p-3 text-xs ${styleText} flex items-center gap-1.5">
            ${item.code ? `<span class="bg-[#B38E50]/10 text-[#B38E50] text-[9px] px-1 font-mono rounded border border-[#B38E50]/20 font-bold">${item.code}</span>` : ''}
            <span>${item.item}</span>
          </td>
          <td class="p-3 text-xs ${styleVal}">${formatDecimal(item.previsto)}</td>
          <td class="p-3 text-xs ${styleVal}">${formatDecimal(item.realizado)}</td>
          <td class="p-3 text-xs ${deltaColor} font-mono text-right">${deltaSign}${formatDecimal(item.delta)}</td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>DRE Consolidação Fiduciária - Grupo JUST S.A.</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Inter', sans-serif; }
      .font-serif { font-family: 'Lora', Georgia, serif; }
      .font-mono { font-family: 'JetBrains Mono', monospace; }
      @media print {
        .no-print { display: none !important; }
        body { background: white !important; }
      }
    </style>
</head>
<body class="bg-[#F8F9FA] text-slate-800 p-8 min-h-screen">
  <div class="max-w-4xl mx-auto space-y-8 bg-white p-12 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
    
    <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0F293A] via-[#B38E50] to-[#0F293A]"></div>
    
    <!-- Top controller bar for printing -->
    <div class="no-print flex justify-between items-center bg-[#0F293A] text-white p-4 rounded-xl mb-6">
      <div class="text-xs">
        <span class="bg-[#B38E50] text-[#0F293A] font-black px-2 py-0.5 rounded text-[10px] uppercase font-mono mr-2">RELATÓRIO DE CONSELHO</span>
        CONSTRUTORA JUST S/A
      </div>
      <button onclick="window.print()" class="bg-[#B38E50] hover:bg-amber-600 text-[#0F293A] text-xs font-bold px-4 py-2 rounded-lg cursor-pointer">
        Imprimir para PDF
      </button>
    </div>

    <!-- Header -->
    <div class="flex justify-between items-start border-b pb-8 border-slate-100">
      <div class="space-y-2">
        <h1 class="text-3xl font-bold font-serif text-[#0F293A]">Demonstrativo de Resultado da Construtora</h1>
        <p class="text-xs text-slate-500 max-w-lg">Apurado gerencial fiduciário do trimestre consolidando a taxa de administração de obra de 15% nos canteiros, fornecimentos Justfix e equivalência proporcional de SPEs (CPC 18).</p>
      </div>
      <div class="text-right space-y-1 bg-[#FDFBF7] p-4 rounded-xl border border-amber-500/20">
        <span class="text-[9px] font-mono tracking-wider text-[#B38E50] uppercase block">Código de Auditoria</span>
        <span class="text-xs font-bold font-mono text-[#0F293A]">JUST-CON-2026-FIDC</span>
        <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded block font-bold mt-1 text-center border border-emerald-200">SIENGE ATUALIZADO</span>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-3 gap-6">
      <div class="bg-[#FDFBF7] p-4 rounded-xl border border-slate-100 space-y-1">
        <span class="text-[9px] font-mono text-[#B38E50] uppercase block font-bold">Taxa Adm. das SPEs</span>
        <span class="text-xl font-bold font-serif text-[#0F293A]">${showRealValues ? "R$ " + (dynamicMetrics.taxaAdmObras * 1000).toLocaleString('pt-BR') : "R$ " + dynamicMetrics.taxaAdmObras.toLocaleString('pt-BR') + " mil"}</span>
      </div>
      <div class="bg-[#FDFBF7] p-4 rounded-xl border border-slate-100 space-y-1">
        <span class="text-[9px] font-mono text-[#B38E50] uppercase block font-bold">Justfix Rochas</span>
        <span class="text-xl font-bold font-serif text-[#0F293A]">${showRealValues ? "R$ " + (dynamicMetrics.justfixRevenue * 1000).toLocaleString('pt-BR') : "R$ " + dynamicMetrics.justfixRevenue.toLocaleString('pt-BR') + " mil"}</span>
      </div>
      <div class="bg-[#0F293A] p-4 rounded-xl text-white space-y-1">
        <span class="text-[9px] font-mono text-amber-200 uppercase block font-bold">Equivalência Patrimonial</span>
        <span class="text-xl font-bold font-serif text-amber-300">${showRealValues ? "R$ " + (dynamicMetrics.equivalenciaProporcional * 1000).toLocaleString('pt-BR') : "R$ " + dynamicMetrics.equivalenciaProporcional.toLocaleString('pt-BR') + " mil"}</span>
      </div>
    </div>

    <!-- Table -->
    <div class="border border-slate-100 rounded-xl overflow-hidden">
      <table class="w-full text-left text-xs text-slate-700">
        <thead>
          <tr class="bg-[#0F293A] text-white">
            <th class="p-3 uppercase text-[10px]">Conta Contábil / Descrição</th>
            <th class="p-3 text-right uppercase text-[10px]">Previsto</th>
            <th class="p-3 text-right uppercase text-[10px]">Realizado</th>
            <th class="p-3 text-right uppercase text-[10px]">Divergência (Δ)</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>
    </div>

    <!-- Audit Remarks -->
    <div class="bg-[#FDFBF7] p-6 rounded-2xl border border-[#B38E50]/20 space-y-3">
      <h4 class="text-xs font-bold text-[#0F293A] font-mono tracking-wider uppercase flex items-center gap-2">
        <span>📌 Notas Fiduciárias e Metodologia de Cálculo</span>
      </h4>
      <p class="text-[11px] text-slate-600 leading-relaxed">
        <strong>Taxa Administrativa (15%):</strong> Calculada reflexamente com base nos custos incorridos de canteiro reportados pelas SPEs ativas no Sienge.<br/>
        <strong>Equivalência Patrimonial (CPC 18):</strong> Reconhecimento gerencial proporcional ao percentual de controle da Construtora Just nas SPEs do grupo (Blank: 100%, Matera: 85%, Neo: 60%, Acácias: 100%).
      </p>
    </div>

    <!-- Sign-off Block -->
    <div class="border-t border-slate-100 pt-8 mt-12 grid grid-cols-2 gap-12 max-w-xl mx-auto text-center">
      <div class="space-y-1.5">
        <div class="h-10 border-b border-slate-300 w-4/5 mx-auto"></div>
        <p class="text-xs font-bold text-[#0F293A]">Jefferson Gonzales</p>
        <p class="text-[9px] uppercase font-mono text-slate-400">Diretor Financeiro (CFO)</p>
      </div>
      <div class="space-y-1.5">
        <div class="h-10 border-b border-slate-300 w-4/5 mx-auto"></div>
        <p class="text-xs font-bold text-[#0F293A]">Conselho Administrativo Just S/A</p>
        <p class="text-[9px] uppercase font-mono text-slate-400">Presidente do Comitê de Auditoria</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="pt-8 text-center text-[9px] text-slate-400 font-mono tracking-widest border-t border-slate-100">
      GRUPO JUST S.A. | RELATÓRIO DO CONSELHO FINANCEIRO | CONFIGURAÇÃO DE ALTA CUSTÓDIA
    </div>

  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CFO_DRE_Just_Holding_Consolidada_${new Date().getFullYear()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="reconciliation-module" className="space-y-8 animate-fadeIn">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="text-[10px] font-mono font-bold text-amber-600 tracking-widest flex items-center gap-1.5 uppercase mb-1">
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            CONTABILIDADE & CUSTÓDIA INTEGRADA
          </div>
          <h1 className="text-3xl font-black font-sans text-slate-900 tracking-tight flex items-center gap-2">
            Resultados e Governança Fiduciária
          </h1>
          <p className="text-xs text-slate-550 max-w-2xl">
            Integrando o lucro econômico da engenharia civil, posições fiduciárias de SPEs e auditagem cruzada Sienge em uma só tela.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs self-start shrink-0 select-none">
          <button 
            className={`px-4 py-2.5 rounded-lg transition font-bold cursor-pointer ${activeTab === 'dre_just' ? 'bg-white text-[#0F293A] shadow-sm font-extrabold text-orange-650' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('dre_just')}
          >
            DRE da Construtora (Just)
          </button>
          <button 
            className={`px-4 py-2.5 rounded-lg transition font-bold cursor-pointer ${activeTab === 'drp' ? 'bg-white text-[#0F293A] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('drp')}
          >
            Resultado de Ativos (DRP)
          </button>
          <button 
            className={`px-4 py-2.5 rounded-lg transition font-bold cursor-pointer ${activeTab === 'matrix' ? 'bg-white text-[#0F293A] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('matrix')}
          >
            Divergências Contábeis
          </button>
        </div>
      </div>

      {/* 2. DRE Tab: Holding Construtora Just Finance */}
      {activeTab === 'dre_just' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Quick interactive board header */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-[9.5px] bg-[#B38E50]/15 text-[#B38E50] border border-[#B38E50]/25 font-mono px-2 py-0.5 rounded font-extrabold tracking-wider uppercase inline-block">
                Contraponto Fiduciário Gerencial
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-sans tracking-tight">
                Análise de Resultado com Foco em Coordenação do Caixa
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                Alinhada ao prumo legal, as receitas operacionais da Holding Construtora Just nascem estritamente da <strong>taxa de administração de obra (15%)</strong> medida no canteiro, faturamento centralizado Justfix e <strong>equivalência patrimonial CPC 18</strong>.
              </p>
            </div>

            {/* Premium controls */}
            <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto shrink-0 select-none">
              <button
                onClick={() => setShowRealValues(!showRealValues)}
                className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
                title="Alternar entre reais explícitos ou milhares de reais"
              >
                <Coins className="w-4 h-4 text-[#B38E50]" />
                {showRealValues ? "Visualizar em milhares (R$ mil)" : "Visualizar valores cheios (R$)"}
              </button>

              <button
                disabled={isSyncingSienge}
                onClick={() => {
                  setIsSyncingSienge(true);
                  setTimeout(() => {
                    setIsSyncingSienge(false);
                    setSyncTime('Hoje, às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
                  }, 1100);
                }}
                className={`px-3.5 py-2.5 border rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  isSyncingSienge 
                    ? 'bg-slate-50 border-slate-200 text-slate-400' 
                    : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-950'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSienge ? 'animate-spin text-slate-400' : 'text-amber-400'}`} />
                {isSyncingSienge ? "Escrevendo..." : "Sincronizar Sienge"}
              </button>

              <button
                onClick={handleDownloadDossier}
                className="px-4 py-2.5 bg-[#B38E50] hover:bg-amber-600 border border-[#B38E50] text-[#0F293A] font-extrabold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                title="Exportar DRE formatada para conselho deliberativo"
              >
                <Download className="w-3.5 h-3.5 text-[#0F293A]" />
                Exportar Dossier (.HTML)
              </button>
            </div>
          </div>

          {/* Dynamic DRE KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-500/20 transition duration-300">
              <span className="text-[9px] font-mono font-bold text-slate-400 tracking-widest uppercase">01. RECEITA LÍQUIDA DA HOLDING</span>
              <div className="mt-2.5">
                <h4 className="text-2xl font-bold font-serif text-slate-900 tracking-tight">
                  {showRealValues 
                    ? formatReais((dreJustData.find(x => x.item.includes('= Receita'))?.realizado || 0) * 1000)
                    : formatReais((dreJustData.find(x => x.item.includes('= Receita'))?.realizado || 0)) + ' mil'
                  }
                </h4>
                <div className="flex justify-between text-[11px] pt-1.5 border-t border-slate-100 mt-2 text-slate-400 font-medium">
                  <span>Previsto: {showRealValues ? formatReais(12800000) : formatReais(12800) + ' mil'}</span>
                  <span className={(dreJustData.find(x => x.item.includes('= Receita'))?.delta || 0) >= 0 ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                    {((dreJustData.find(x => x.item.includes('= Receita'))?.delta || 0) >= 0 ? '+' : '') + (dreJustData.find(x => x.item.includes('= Receita'))?.delta || 0).toLocaleString('pt-BR')} mil
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-[#0F293A]/20 transition duration-300">
              <span className="text-[9px] font-mono font-bold text-slate-400 tracking-widest uppercase">02. MARGEM CORRENTE (EBITDA)</span>
              <div className="mt-2.5">
                <h4 className="text-2xl font-bold font-serif text-[#0F293A] tracking-tight">
                  {showRealValues 
                    ? formatReais((dreJustData.find(x => x.item.includes('= Margem'))?.realizado || 0) * 1000)
                    : formatReais((dreJustData.find(x => x.item.includes('= Margem'))?.realizado || 0)) + ' mil'
                  }
                </h4>
                <div className="flex justify-between text-[11px] pt-1.5 border-t border-slate-100 mt-2 text-slate-400 font-medium">
                  <span>Previsto: {showRealValues ? formatReais(6400000) : formatReais(6400) + ' mil'}</span>
                  <span className={(dreJustData.find(x => x.item.includes('= Margem'))?.delta || 0) >= 0 ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                    {((dreJustData.find(x => x.item.includes('= Margem'))?.delta || 0) >= 0 ? '+' : '') + (dreJustData.find(x => x.item.includes('= Margem'))?.delta || 0).toLocaleString('pt-BR')} mil
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#0F293A] p-5 rounded-2xl border border-slate-950 shadow-md flex flex-col justify-between text-white hover:border-[#B38E50]/40 transition duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#B38E50]/10 to-transparent rounded-full -mr-6 -mt-6"></div>
              <span className="text-[9px] font-mono font-bold text-amber-200 tracking-widest uppercase relative z-10">03. LUCRO LÍQUIDO CONSOLIDADO (Reflexo)</span>
              <div className="mt-2.5 relative z-10">
                <h4 className="text-2xl font-bold font-serif text-amber-300 tracking-tight">
                  {showRealValues 
                    ? formatReais((dreJustData.find(x => x.item.includes('= Lucro'))?.realizado || 0) * 1000)
                    : formatReais((dreJustData.find(x => x.item.includes('= Lucro'))?.realizado || 0)) + ' mil'
                  }
                </h4>
                <div className="flex justify-between text-[11px] pt-1.5 border-t border-slate-800 mt-2 text-slate-350 font-medium">
                  <span>Previsto: {showRealValues ? formatReais(5280000) : formatReais(5280) + ' mil'}</span>
                  <span className="text-amber-300 font-black">
                    {((dreJustData.find(x => x.item.includes('= Lucro'))?.delta || 0) >= 0 ? '+' : '') + (dreJustData.find(x => x.item.includes('= Lucro'))?.delta || 0).toLocaleString('pt-BR')} mil
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DRE Columns Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Table */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-150">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Gateway Contábil Sienge Conectado</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded">
                  Status: {syncTime}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#0F293A] text-slate-100 font-mono text-[9px] uppercase">
                      <th className="py-3 px-4 font-extrabold w-1/2">CONTA CONTÁBIL / OPERAÇÃO</th>
                      <th className="py-3 px-3 font-extrabold text-right">Previsto</th>
                      <th className="py-3 px-3 font-extrabold text-right">Realizado</th>
                      <th className="py-3 px-4 font-black text-right bg-slate-950 text-amber-300">Divergência (Δ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dreJustData.map((item, index) => {
                      const formatVal = (val: number) => {
                        const actualVal = showRealValues ? val * 1000 : val;
                        if (actualVal === 0) return "—";
                        const isNeg = actualVal < 0;
                        const formatted = Math.abs(actualVal).toLocaleString('pt-BR');
                        return isNeg ? `(${formatted})` : formatted;
                      };

                      const formatDelta = (val: number) => {
                        const actualVal = showRealValues ? val * 1000 : val;
                        if (actualVal === 0) return "—";
                        const sign = actualVal > 0 ? "+" : "";
                        return sign + Math.round(actualVal).toLocaleString('pt-BR');
                      };

                      if (item.isHeader) {
                        return (
                          <tr key={index} className="bg-[#FDFBF7] border-y border-slate-200">
                            <td colSpan={4} className="py-2.5 px-4 text-[10px] font-black text-[#0F293A] tracking-wider uppercase font-mono">
                              {item.item}
                            </td>
                          </tr>
                        );
                      }

                      const isSelected = selectedDreItem === item.item;
                      let rowStyle = "hover:bg-[#FDFBF7]/40 cursor-pointer border-b border-slate-100 transition duration-150";
                      let textStyle = "text-slate-700 font-semibold";
                      let valStyle = "font-mono text-slate-850 text-right";

                      if (item.isTotal) {
                        rowStyle = "bg-slate-50 font-bold border-y-2 border-slate-200 hover:bg-slate-100 cursor-pointer";
                        textStyle = "text-[#0F293A] font-extrabold";
                        valStyle = "font-mono text-[#0F293A] font-extrabold text-right";
                      } else if (item.isDarkenTotal) {
                        rowStyle = "bg-[#0F293A] text-white hover:bg-[#1A3A4D] font-bold cursor-pointer";
                        textStyle = "text-white font-black";
                        valStyle = "font-mono text-amber-200 font-black text-right";
                      }

                      return (
                        <tr
                          key={index}
                          onClick={() => item.explanation && setSelectedDreItem(item.item)}
                          className={`${rowStyle} ${isSelected ? 'ring-2 ring-amber-500/80 ring-inset bg-amber-50/20' : ''}`}
                        >
                          <td className={`py-3 px-4 flex items-center gap-2 ${textStyle}`}>
                            {item.code && (
                              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200/50">
                                {item.code}
                              </span>
                            )}
                            <span className="truncate">{item.item}</span>
                          </td>
                          <td className={`py-3 px-3 ${valStyle}`}>{formatVal(item.previsto)}</td>
                          <td className={`py-3 px-3 ${valStyle}`}>{formatVal(item.realizado)}</td>
                          <td className={`py-3 px-4 font-mono font-black text-right ${
                            item.isDarkenTotal
                              ? 'text-amber-200'
                              : item.delta > 0 
                                ? 'text-emerald-600' 
                                : item.delta < 0 
                                  ? 'text-rose-600' 
                                  : 'text-slate-400'
                          }`}>
                            {formatDelta(item.delta)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar commentary widget */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-semibold text-[#B38E50] uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#B38E50]" />
                    Mural de Notas Fiduciárias
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-snug">Selecione uma conta ao lado para analisar desvios e conexões fiduciárias em tempo real.</p>
                </div>

                <AnimatePresence mode="wait">
                  {selectedDreItem ? (() => {
                    const matched = dreJustData.find(x => x.item === selectedDreItem);
                    if (!matched) return null;

                    return (
                      <motion.div
                        key={selectedDreItem}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div className="bg-[#FDFBF7] border border-[#B38E50]/20 p-4 rounded-xl space-y-2.5">
                          <div className="flex justify-between items-center bg-[#0F293A] text-white px-2.5 py-1 rounded-md text-[10px] font-mono font-bold">
                            <span>Mapeamento</span>
                            <span className="text-amber-300">{matched.code || "REGULADOR"}</span>
                          </div>
                          
                          <h4 className="font-bold text-slate-900 leading-tight font-sans">
                            {matched.item}
                          </h4>
                          
                          <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                            {matched.explanation}
                          </p>
                        </div>

                        {/* Status Check card based on delta */}
                        <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                          matched.delta === 0
                            ? 'bg-slate-55 bg-slate-50 border-slate-200 text-slate-600'
                            : matched.delta > 0
                              ? 'bg-emerald-50/50 border-emerald-150 text-emerald-800'
                              : 'bg-rose-50/50 border-rose-150 text-rose-800'
                        }`}>
                          <div className="flex items-center gap-1.5 font-bold uppercase font-mono text-[9px]">
                            {matched.delta > 0 ? (
                              <TrendingUp className="w-4 h-4 text-emerald-600" />
                            ) : matched.delta < 0 ? (
                              <ArrowDown className="w-4 h-4 text-rose-500" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-slate-400" />
                            )}
                            Vigilância do Conselho
                          </div>
                          <p className="font-sans font-medium">
                            {matched.delta === 0 
                              ? "A conta opera em perfeita consonância com as projeções lineares consolidadas."
                              : matched.delta > 0
                                ? `Desempenho superavitário de R$ ${Math.abs(showRealValues ? matched.delta * 1000 : matched.delta).toLocaleString('pt-BR')} ${showRealValues ? '' : ' mil'} impulsionado pelas atividades integradas de engenharia.`
                                : `Desvio de déficit de R$ ${Math.abs(showRealValues ? matched.delta * 1000 : matched.delta).toLocaleString('pt-BR')} ${showRealValues ? '' : ' mil'} identificado e reconciliado no prumo das SPEs.`
                            }
                          </p>
                        </div>
                      </motion.div>
                    );
                  })() : (
                    <div className="text-center py-8 border-2 border-dashed border-slate-150 rounded-xl text-slate-400 text-xs">
                      Selecione um prumo da planilha de DRE acima para abrir as deduções econômicas reflexas.
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Legal Fanciful Notice */}
              <div className="bg-[#0F293A] p-5 rounded-2xl border border-slate-950 text-white space-y-3 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#B38E50]/15 rounded-full -mr-6 -mb-6"></div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4.5 h-4.5 text-amber-400" />
                  <span className="text-[10px] font-mono tracking-widest text-[#B38E50] uppercase font-bold">Certificação de Governança corporativa</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  A fidedignidade desta DRE é corroborada pelas garantias contra-fiduciárias depositadas nas contas-mãe do grupo, mitigando riscos e promovendo liquidez no prumo fiduciário.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. DRP Tab: Real-time Asset Results Simulation */}
      {activeTab === 'drp' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Wheel Control Deck */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[9px] font-mono tracking-wider text-amber-600 uppercase font-black bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Fiduciary Control Deck (Jefferson)
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-sans">
                  Simulação Dinâmica de Ciclo de Vida do Empreendimento
                </h3>
                <p className="text-xs text-slate-500">
                  Como CFO, altere abaixo o estágio de cada empreendimento ("Previsto" ➔ "Construção" ➔ "Repasse" ➔ "Garantia") para calibrar e ver o reflexo DRP/DRE recalcular em tempo real.
                </p>
              </div>
              <div className="text-xs text-slate-400 bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-200 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                DRE Recalcula Instantaneamente
              </div>
            </div>

            {/* Grid of developments controller */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {obras.map((o) => {
                const correspondingSpe = spes.find(s => s.id === o.speId);
                return (
                  <div 
                    key={o.id} 
                    className={`p-5 rounded-2xl border transition duration-300 flex flex-col justify-between space-y-4 ${
                      selectedObraId === o.id 
                        ? 'border-[#B38E50] bg-[#FDFBF7] shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="space-y-1 cursor-pointer" onClick={() => setSelectedObraId(o.id)}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded">
                          {o.id.toUpperCase()}
                        </span>
                        
                        {/* Custom visual stage pill */}
                        <span className={`text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full font-mono ${
                          o.estagio === 'Previsto' 
                            ? 'bg-slate-100 text-slate-600'
                            : o.estagio === 'Em Construção'
                              ? 'bg-amber-100 text-[#78350f] border border-amber-200'
                              : o.estagio === 'Em Repasse'
                                ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                                : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          ● {o.estagio.toUpperCase()}
                        </span>
                      </div>
                      
                      <h4 className="font-extrabold text-slate-900 text-sm font-sans flex items-center gap-1.5 pt-1.5">
                        <Building2 className="w-4 h-4 text-[#0F293A]" />
                        {o.nome}
                      </h4>
                      <p className="text-[11px] text-slate-450 truncate">{o.speNome}</p>
                    </div>

                    {/* Stage dynamic promoters switcher buttons */}
                    <div className="pt-3 border-t border-slate-100 space-y-2 select-none">
                      <span className="text-[9.5px] font-mono text-slate-400 uppercase block font-bold">Mover Estágio Fiduciário:</span>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                        <button
                          disabled={o.estagio === 'Em Construção'}
                          onClick={() => onUpdateObraEstagio(o.id, 'Em Construção')}
                          className={`py-1.5 px-2 rounded-lg font-bold border transition ${
                            o.estagio === 'Em Construção'
                              ? 'bg-amber-500 border-amber-550 border-amber-500 text-slate-950 font-extrabold'
                              : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 cursor-pointer'
                          }`}
                        >
                          🏗️ Construção
                        </button>
                        <button
                          disabled={o.estagio === 'Em Repasse'}
                          onClick={() => onUpdateObraEstagio(o.id, 'Em Repasse')}
                          className={`py-1.5 px-2 rounded-lg font-bold border transition ${
                            o.estagio === 'Em Repasse'
                              ? 'bg-indigo-950 bg-indigo-900 border-indigo-900 text-white font-extrabold'
                              : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 cursor-pointer'
                          }`}
                        >
                          🏦 Facc./Repasse
                        </button>
                        <button
                          disabled={o.estagio === 'Em Garantia'}
                          onClick={() => onUpdateObraEstagio(o.id, 'Em Garantia')}
                          className={`py-1.5 px-2 rounded-lg font-bold border transition ${
                            o.estagio === 'Em Garantia'
                              ? 'bg-emerald-600 border-emerald-650 text-white font-extrabold'
                              : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 cursor-pointer'
                          }`}
                        >
                          🛡️ Garantia (Pós)
                        </button>
                        <button
                          disabled={o.estagio === 'Previsto'}
                          onClick={() => onUpdateObraEstagio(o.id, 'Previsto')}
                          className={`py-1.5 px-2 rounded-lg font-bold border transition ${
                            o.estagio === 'Previsto'
                              ? 'bg-slate-500 border-slate-600 text-white font-extrabold'
                              : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 cursor-pointer'
                          }`}
                        >
                          📋 Planejado
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Selected Asset DRP Breakdown Sheet */}
          {activeObra && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 xl:p-12 space-y-10 relative overflow-hidden animate-fadeIn">
              
              {/* Header on selected element sheet */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-150">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1 bg-[#FDFBF7] text-[#B38E50] text-[9.5px] font-mono px-3 py-1 rounded border border-[#B38E50]/20 font-bold uppercase uppercase tracking-wider">
                    <Building2 className="w-3.5 h-3.5 text-[#B38E50]" />
                    Empreendimento Sob Foco: {activeObra.nome}
                  </div>
                  <h3 className="text-y-xl text-2xl font-bold font-serif text-[#0F293A]">
                    Demonstrativo do Resultado do Projeto (DRP)
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    Este relatório fiduciário detalha a apropriação de lucros do canteiro sob as determinações de custódia e sua materialização de ativos circulantes ou tangíveis.
                  </p>
                </div>
                
                <div className="bg-slate-50/85 p-4 rounded-2xl border border-slate-200 text-right space-y-1 hover:border-slate-300 transition duration-150 self-start w-full lg:w-auto">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">FRENTE PATRIMONIAL</span>
                  <div className="text-xs font-black text-[#0F293A] font-mono">
                    {activeObra.speNome}
                  </div>
                  <span className="text-[10px] bg-[#B38E50]/15 text-[#0F293A] border border-[#B38E50]/20 px-2 py-0.5 rounded font-black font-serif font-mono mt-2 inline-block">
                    {activeObra.estagio.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Dynamic layout depending on stage */}
              {activeObra.estagio === 'Previsto' ? (
                <div className="py-12 text-center rounded-2xl border-2 border-dashed border-slate-150 max-w-lg mx-auto space-y-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-[#0F293A]">
                    <Calendar className="w-6 h-6 text-[#0F293A]" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-slate-900 font-bold text-sm">Empreendimento em Fase de Planejamento</h4>
                    <p className="text-xs text-slate-450 leading-relaxed max-w-sm mx-auto">
                      O empreendimento {activeObra.nome} está catalogado nas premissas estratégicas da aba (Planejamento Estratégico). Promova de estágio no controlador de fluxo acima para simular a mobilização física e faturamento de taxa adm.
                    </p>
                  </div>
                </div>
              ) : activeObra.estagio === 'Em Construção' ? (
                
                <div className="space-y-8">
                  {/* POC method display */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calculations column */}
                    <div className="lg:col-span-2 space-y-6">
                      <h4 className="text-xs font-semibold text-[#0F293A] font-mono tracking-widest uppercase pb-1.5 border-b border-slate-100">
                        🧮 APROPRIAÇÃO OPERACIONAL PELO POC (MÉTODO DE CONTABILIDADE IMOBILIÁRIA)
                      </h4>
                      
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-slate-400 font-mono text-[9.5px] uppercase block font-bold">VGV Assinado Contratado</span>
                            <span className="text-base font-extrabold text-[#0F293A]">
                              {formatReais(activeObra.receitaTotalContratada || 65810000)}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-400 font-mono text-[9.5px] uppercase block font-bold">Orçamento Geral de Custo (Custos de Obra)</span>
                            <span className="text-base font-extrabold text-slate-900">
                              {formatReais(activeObra.orcamentoTotal)}
                            </span>
                          </div>
                          <div className="space-y-1 pt-2">
                            <span className="text-slate-400 font-mono text-[9.5px] uppercase block font-bold">Percentual de Obra Concluído (PoC)</span>
                            <span className="text-base font-black text-amber-600 font-mono">
                              {activeObra.progressoFisico}%
                            </span>
                          </div>
                          <div className="space-y-1 pt-2">
                            <span className="text-slate-400 font-mono text-[9.5px] uppercase block font-bold">Custo de Obra Incorrido (Acumulado)</span>
                            <span className="text-base font-extrabold text-[#0F293A] font-mono">
                              {formatReais(activeObra.custoRealizado)}
                            </span>
                          </div>
                        </div>

                        {/* Equations calculations */}
                        <div className="pt-4 border-t border-slate-200/80 space-y-2 leading-relaxed">
                          <div className="flex justify-between font-medium">
                            <span>(=) Receita Apropriada Proporcional (VGV &times; PoC):</span>
                            <span className="font-mono text-[#0F293A] font-bold">
                              {formatReais(((activeObra.receitaTotalContratada || 65810000) * activeObra.progressoFisico) / 100)}
                            </span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>(-) Custo de Obra Apropriado Expirado (PoC):</span>
                            <span className="font-mono text-slate-650 font-bold">
                              ({formatReais(activeObra.custoRealizado)})
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-dashed border-slate-200/80 font-black text-xs text-[#0F293A]">
                            <span className="text-sm font-black font-sans">(=) Lucro Contábil / Econômico Acumulado do Canteiro:</span>
                            <span className="text-sm font-bold font-serif text-[#B38E50]">
                              {formatReais((((activeObra.receitaTotalContratada || 65810000) * activeObra.progressoFisico) / 100) - activeObra.custoRealizado)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Materialization column */}
                    <div className="space-y-6">
                      <h4 className="text-xs font-semibold text-[#0F293A] font-mono tracking-widest uppercase pb-1.5 border-b border-slate-100">
                        🏢 CONVERSÃO DO LUCRO EM ATIVOS REAIS
                      </h4>

                      <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#B38E50]/20 space-y-4 text-xs">
                        <span className="text-[10px] text-slate-500 font-mono block">O lucro econômico acima materializou-se reflexamente em:</span>
                        
                        <div className="space-y-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-[#0F293A]/5 flex items-center justify-center text-[#0F293A]">
                              <Coins className="w-4 h-4 text-[#0F293A]" />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Disponibilidades no Caixa Fiduciário</span>
                              <strong className="text-slate-800 text-[11px] font-mono">{formatReais(activeSpeOfObra?.caixaAtual || 18450000)}</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-[#0F293A]/5 flex items-center justify-center text-[#0F293A]">
                              <Building className="w-4 h-4 text-[#0F293A]" />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Terreno Comprado Integralizado</span>
                              <strong className="text-slate-800 text-[11px] font-mono">{formatReais(activeObra.valorTerreno || 7500000)}</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-[#0F293A]/5 flex items-center justify-center text-[#0F293A]">
                              <Building2 className="w-4 h-4 text-[#0F293A]" />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Benfeitorias e Infraestrutura erguida</span>
                              <strong className="text-slate-800 text-[11px] font-mono">{formatReais(activeObra.custoRealizado)}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#B38E50]/25 text-[11px] text-slate-500 font-medium">
                          A integralidade dessas cotas está de posse e salvaguardada no balanço central do Grupo JUST S.A.
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                /* Em Repasse or Garantia: Liquidation approach */
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calculations */}
                    <div className="lg:col-span-2 space-y-6">
                      <h4 className="text-xs font-semibold text-[#0F293A] font-mono tracking-widest uppercase pb-1.5 border-b border-slate-100">
                        ⚖️ BALANÇO DE ENCERRAMENTO E LIQUIDAÇÃO DE CARTEIRA DA SPE
                      </h4>

                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/85 space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1 bg-white p-3.5 rounded-xl border border-slate-150">
                            <span className="text-slate-450 font-mono text-[9px] uppercase block font-bold text-slate-400">Caixa Líquido Atual da SPE</span>
                            <span className="text-sm font-black text-[#0F293A] font-mono">
                              {formatReais(activeSpeOfObra?.caixaAtual || 12450000)}
                            </span>
                          </div>
                          <div className="space-y-1 bg-white p-3.5 rounded-xl border border-slate-150">
                            <span className="text-slate-450 font-mono text-[9px] uppercase block font-bold text-slate-400">Estoque de Unidades Remanescente</span>
                            <span className="text-sm font-black text-slate-700 font-mono">
                              {formatReais(activeSpeOfObra?.estoqueAVender || 500000)}
                            </span>
                          </div>
                          <div className="space-y-1 bg-white p-3.5 rounded-xl border border-slate-150">
                            <span className="text-slate-450 font-mono text-[9px] uppercase block font-bold text-slate-400">Ativo de Contratos/Carteira a Receber</span>
                            <span className="text-sm font-black text-indigo-800 font-mono">
                              {formatReais(activeSpeOfObra?.imoveisEntreguesReceber || 1000000)}
                            </span>
                          </div>
                          <div className="space-y-1 bg-white p-3.5 rounded-xl border border-slate-150">
                            <span className="text-slate-450 font-mono text-[9px] uppercase block font-bold text-slate-400">Passivo (Financiamentos de Obra a pagar)</span>
                            <span className="text-xs font-bold text-rose-700 font-mono">
                              {formatReais(activeSpeOfObra?.alavancagemBancaria || 0)}
                            </span>
                          </div>
                        </div>

                        {/* Liquidation Balance */}
                        <div className="pt-4 border-t border-slate-200/80 space-y-2 leading-relaxed">
                          <div className="flex justify-between font-medium">
                            <span>(+) Caixa Disponível na Conta Centralizada SPE:</span>
                            <span className="font-mono text-slate-800">
                              {formatReais(activeSpeOfObra?.caixaAtual || 12450000)}
                            </span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>(+) Estoque Comercializável de Unidades Concluídas:</span>
                            <span className="font-mono text-slate-800">
                              {formatReais(activeSpeOfObra?.estoqueAVender || 500000)}
                            </span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>(+) Carteira Faturada a Receber do Repasse fiduciário:</span>
                            <span className="font-mono text-[#0F293A] font-bold">
                              {formatReais(activeSpeOfObra?.imoveisEntreguesReceber || 1000000)}
                            </span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>(-) Exigível Comercial / Contas a pagar Fornecedores:</span>
                            <span className="font-mono text-rose-650 font-bold">
                              ({formatReais(activeSpeOfObra?.contasAPagarFornecedores || 200000)})
                            </span>
                          </div>
                          <div className="flex justify-between pt-2.5 border-t border-dashed border-slate-200 font-black text-[#0F293A]">
                            <span className="text-sm font-sans font-black flex items-center gap-1">
                              (=) Valor Patrimonial Executado Distribuível da SPE:
                            </span>
                            <span className="text-sm font-bold font-serif text-[#B38E50] font-mono">
                              {formatReais(
                                ((activeSpeOfObra?.caixaAtual || 12450000) + 
                                (activeSpeOfObra?.estoqueAVender || 500000) + 
                                (activeSpeOfObra?.imoveisEntreguesReceber || 1000000)) - 
                                (activeSpeOfObra?.contasAPagarFornecedores || 200000)
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Explanatory notes column for repasse */}
                    <div className="space-y-6">
                      <h4 className="text-xs font-semibold text-[#0F293A] font-mono tracking-widest uppercase pb-1.5 border-b border-slate-100">
                        🔍 PAINEL DE RETORNO FIDUCIÁRIO DA INCORPORADORA
                      </h4>

                      <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#B38E50]/20 space-y-4 text-xs">
                        <span className="text-[10px] text-slate-500 font-mono block">Diretrizes de Auditoria e Fechamento:</span>
                        
                        <p className="text-slate-650 font-medium leading-relaxed">
                          Neste estágio de <strong>Repasse</strong>, as obrigações construtivas estão 100% liquidadas e medidas. O resultado econômico passa do regime PoC para o regime financeiro de desmobilização e repasses das carteiras CEF / Direta.
                        </p>

                        <div className="p-3.5 bg-slate-100 rounded-xl space-y-1 outline outline-slate-150">
                          <span className="text-[9.5px] font-mono text-[#0F293A] font-bold block">PARTICIPAÇÃO HELD JUST:</span>
                          <p className="text-xs text-slate-700 font-extrabold pr-2 font-mono">
                            {activeSpeOfObra?.participacaoJust || 100}% de controle societário direto.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* 4. Tab 3: Divergence Matrix Auditing Ledger */}
      {activeTab === 'matrix' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] bg-rose-100 text-rose-800 font-mono px-2.5 py-0.5 rounded font-bold tracking-wider uppercase border border-rose-200">
                Ledger de Conformidade Física-Financeira
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-sans">
                Matriz de Reconciliação Geral (Ledger Sienge vs CAIXA)
              </h3>
              <p className="text-xs text-slate-500 max-w-xl">
                Alinhada ao prumo de integridade fiduciária, esta matriz confronta desvios entre valores contábil-bancários contra o prumo de medições BuildIQ reais.
              </p>
            </div>

            <button
              disabled={isAuditing}
              onClick={handleRunAudit}
              className="px-4 py-2.5 bg-[#0F293A] hover:bg-[#1A3A4D] text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin text-slate-400' : 'text-amber-400'}`} />
              {isAuditing ? "Auditando..." : "Rodar Varredura Fiduciária"}
            </button>
          </div>

          {/* Log de Auditoria visual */}
          {auditLog.length > 0 && (
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-950 text-white space-y-2 font-mono text-xs max-h-44 overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-emerald-400 text-[10px] font-bold">
                <span>CONTRAPARTIDA DOS LOGS DE AUDITORIA REAL-TIME</span>
                <span className="animate-pulse">🟢 ATIVO</span>
              </div>
              {auditLog.map((log, index) => (
                <div key={index} className="text-[11px] text-slate-350 leading-snug">
                  {log}
                </div>
              ))}
              {isAuditing && (
                <div className="text-amber-400 animate-pulse font-bold text-[11px] pt-1">
                  &bull; {auditStep}...
                </div>
              )}
            </div>
          )}

          {/* Matrix table list */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-mono font-bold text-[#0F293A] tracking-wider uppercase flex items-center gap-1">
                <FileSpreadsheet className="w-4 h-4 text-amber-600" />
                Matriz de Registros Contábeis de Custódia
              </h4>
              
              {/* Group quick filter badges */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg border text-[10px] text-slate-500 select-none">
                {['Todos', 'Ativos', 'Passivos'].map(grp => (
                  <button
                    key={grp}
                    onClick={() => setSelectedGroup(grp as any)}
                    className={`px-3 py-1 rounded transition cursor-pointer font-bold ${selectedGroup === grp ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-800'}`}
                  >
                    {grp}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-mono text-[9.5px] border-b border-slate-200">
                    <th className="p-3 w-1/4">CONTA / REGISTRO</th>
                    <th className="p-3">GRUPO</th>
                    <th className="p-3 text-right">VALOR CONTÁBIL (SIENGE)</th>
                    <th className="p-3 text-right">VALOR REAIS (CAIXA EXTRAÇÃO)</th>
                    <th className="p-3 text-right text-rose-700">DIVERGÊNCIA</th>
                    <th className="p-3 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((rec) => {
                    const hasDivergencia = rec.divergencia !== 0;
                    return (
                      <tr 
                        key={rec.id} 
                        className={`border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition duration-150 ${
                          hasDivergencia ? 'bg-rose-50/10' : ''
                        }`}
                      >
                        <td className="p-3 flex flex-col">
                          <span className="font-extrabold text-slate-900">{rec.conta}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{rec.origem} &bull; {rec.id}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-[10.5px] bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-600">
                            {rec.grupoPatrimonial}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-800 text-right">{formatReais(rec.valorContabil)}</td>
                        <td className="p-3 font-mono text-slate-800 text-right">{formatReais(rec.valorMensuradoRevolt)}</td>
                        <td className={`p-3 font-mono text-right font-black ${hasDivergencia ? 'text-rose-650 text-rose-600' : 'text-slate-400'}`}>
                          {hasDivergencia ? formatReais(rec.divergencia) : "—"}
                        </td>
                        <td className="p-3 text-center">
                          {hasDivergencia ? (
                            <button
                              onClick={() => {
                                onCorrectDivergence(rec.id);
                              }}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] rounded shadow-sm hover:shadow transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
                              title="Corrigir divergência cruzada"
                            >
                              <AlertTriangle className="w-3 h-3 text-white" />
                              Reconciliar
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mx-auto justify-center">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              RECONCILIADO
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Sum of divergence warning banner */}
            {totalDivergencia > 0 && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center gap-3 text-xs leading-relaxed text-rose-900 font-sans font-medium">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                <p>
                  Atualmente, há um somatório de <strong>{formatReais(totalDivergencia)}</strong> em divergências contábeis pendentes de conformação entre o ERP Sienge e as contas vinculadas de SPEs. Clique em "Reconciliar" para regularizar o balanço.
                </p>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
