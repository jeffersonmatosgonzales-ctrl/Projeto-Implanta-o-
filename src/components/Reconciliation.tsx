import { useState } from 'react';
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
  LayoutGrid
} from 'lucide-react';
import { RegistroPatrimonial } from '../types';

interface ReconciliationProps {
  records: RegistroPatrimonial[];
  onCorrectDivergence: (recordId: string) => void;
}

// Authentic DRP Project Cases based on Strategic PDF (R$ 6.2M Residencial Aurora and others)
interface DRPProjectCase {
  id: string;
  nome: string;
  vgv: number;
  custos: number;
  lucroEconomico: number;
  materializacao: {
    caixa: number;
    terrenos: number;
    equipamentos: number;
    aplicacoes: number;
  };
  observacoes: string;
}

const db_drp_projects: DRPProjectCase[] = [
  {
    id: 'drp-aurora',
    nome: 'Residencial Aurora',
    vgv: 28000000,
    custos: 21800000,
    lucroEconomico: 6200000,
    materializacao: {
      caixa: 2500000,
      terrenos: 2000000,
      equipamentos: 700000,
      aplicacoes: 1000000
    },
    observacoes: 'Caso ilustrativo original da implantação. Demonstra a conversão total da margem econômica incorporada em ativos reais, com R$ 2,5 mi líquidos em conta fiduciária.'
  },
  {
    id: 'drp-justone',
    nome: 'Edifício Just One Premium',
    vgv: 120000000,
    custos: 82800000,
    lucroEconomico: 37200000,
    materializacao: {
      caixa: 15200000,
      terrenos: 12000000,
      equipamentos: 4000000,
      aplicacoes: 6000000
    },
    observacoes: 'Empreendimento de alto padrão com forte alocação em terrenos de alta valorização no centro de Maringá e grande volume de aplicações financeiras pós-repasse fiduciário.'
  },
  {
    id: 'drp-blank',
    nome: 'Blank Residence',
    vgv: 45000000,
    custos: 33750000,
    lucroEconomico: 11250000,
    materializacao: {
      caixa: 4250000,
      terrenos: 3500000,
      equipamentos: 1500000,
      aplicacoes: 2000000
    },
    observacoes: 'Lançamento recente com captação acelerada. O lucro econômico está ancorado principalmente no estoque de terrenos permutados e provisões de faturamento da SPE.'
  }
];

export default function Reconciliation({ records, onCorrectDivergence }: ReconciliationProps) {
  const [activeTab, setActiveTab] = useState<'matrix' | 'drp'>('matrix');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState('');
  const [auditLog, setAuditLog] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<'Todos' | 'Ativos' | 'Passivos'>('Todos');
  const [selectedDrpCaseId, setSelectedDrpCaseId] = useState<string>('drp-aurora');

  // Filter records for Audit Matrix
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
      'Iniciando verificação cruzada de dados...',
      'Conectando com o módulo BuildIQ para colher PoC % Físico...',
      'Conectando com as Contas Garantidas das SPEs e Extratos CAIXA...',
      'Calculando valores contábeis hipotéticos contra contratos de sinal...',
      'Validando termos de alavancagem de Plano Empresário...',
      'Comparando ledger contábil contra materialização real de ativos...',
      'Reconciliação e auditoria realizada com sucesso!'
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setAuditStep(step);
        setAuditLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
        if (index === steps.length - 1) {
          setIsAuditing(false);
        }
      }, (index + 1) * 700);
    });
  };

  const activeDrpCase = db_drp_projects.find(p => p.id === selectedDrpCaseId) || db_drp_projects[0];

  return (
    <div id="reconciliation-module" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-orange-600 tracking-wider flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" />
            DRP & RECONCILIAÇÃO PATRIMONIAL
          </div>
          <h1 className="text-2xl font-bold font-sans text-slate-900">
            Módulo de Resultados e Auditoria
          </h1>
          <p className="text-xs text-slate-500">
            Conexão entre o lucro econômico da engenharia, fluxo financeiro real e a materialização em ativos patrimoniais.
          </p>
        </div>

        {/* Tab switch for Reconciliation vs DRP */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs self-start">
          <button 
            className={`px-4 py-2 rounded-lg transition font-bold cursor-pointer ${activeTab === 'matrix' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('matrix')}
          >
            Matriz de Divergência Contábil
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition font-bold cursor-pointer ${activeTab === 'drp' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('drp')}
          >
            Demonstrativo do Resultado (DRP)
          </button>
        </div>
      </div>

      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-sm font-bold text-slate-600 font-mono tracking-wide uppercase">Controle de Divergências de Balanço</h2>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button 
                className={`px-3 py-1 rounded-md transition font-medium cursor-pointer ${selectedGroup === 'Todos' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                onClick={() => setSelectedGroup('Todos')}
              >
                Todas as Contas
              </button>
              <button 
                className={`px-3 py-1 rounded-md transition font-medium cursor-pointer ${selectedGroup === 'Ativos' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                onClick={() => setSelectedGroup('Ativos')}
              >
                Ativos
              </button>
              <button 
                className={`px-3 py-1 rounded-md transition font-medium cursor-pointer ${selectedGroup === 'Passivos' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                onClick={() => setSelectedGroup('Passivos')}
              >
                Passivos e PL
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Verification Matrix (2/3 width) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 font-sans tracking-wide uppercase flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-slate-600" />
                  Conferência Cruzada: ERP Balancel vs Reality
                </h3>
                
                <div className="text-xs bg-slate-50 p-2 border border-slate-200 rounded-lg font-medium text-slate-600 flex items-center gap-1.5">
                  <span>Fronteira Patrimonial Diferencial: </span>
                  <span className={`font-mono font-bold ${totalDivergencia === 0 ? 'text-emerald-600' : 'text-orange-700'}`}>
                    {totalDivergencia > 0 ? '+' : ''}{formatReais(totalDivergencia)}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-400 font-mono text-[10px] border-b border-slate-150 uppercase">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Conta Patrimonial</th>
                      <th className="py-3 px-4 font-semibold">Origem Principal</th>
                      <th className="py-3 px-4 font-semibold text-right">No Ledger ERP</th>
                      <th className="py-3 px-4 font-semibold text-right">Físico / Realista</th>
                      <th className="py-3 px-4 font-semibold text-right">Diferença / Ajuste</th>
                      <th className="py-3 px-4 font-semibold text-center">Controles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredRecords.map((rec) => {
                      const hasGap = rec.divergencia !== 0;
                      const isPositiveGap = rec.divergencia > 0;
                      
                      return (
                        <tr key={rec.id} className="hover:bg-orange-500/5 transition">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            <div className="flex flex-col">
                              <span>{rec.conta}</span>
                              <span className="text-[10px] text-slate-400 font-mono font-medium">{rec.grupoPatrimonial}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500">
                            {rec.origem}
                          </td>
                          <td className="py-3.5 px-4 text-right text-slate-800 font-mono">{formatReais(rec.valorContabil)}</td>
                          <td className="py-3.5 px-4 text-right font-bold text-slate-900 font-mono">{formatReais(rec.valorMensuradoRevolt)}</td>
                          <td className={`py-3.5 px-4 text-right font-mono font-bold ${hasGap ? (isPositiveGap ? 'text-emerald-600' : 'text-orange-700') : 'text-slate-400'}`}>
                            {hasGap ? `${isPositiveGap ? '+' : ''}${formatReais(rec.divergencia)}` : 'R$ 0'}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {rec.statusReconciliacao === 'Concluído' ? (
                              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-500/10">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                Reconciliado
                              </span>
                            ) : rec.statusReconciliacao === 'Sob Revisão' ? (
                              <button 
                                onClick={() => onCorrectDivergence(rec.id)}
                                className="inline-flex items-center gap-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-850 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-500/15 transition cursor-pointer"
                              >
                                <AlertTriangle className="w-3 h-3 text-orange-600 animate-pulse" />
                                Ajustar Ledger
                              </button>
                            ) : (
                              <button 
                                onClick={() => onCorrectDivergence(rec.id)}
                                className="bg-slate-900 text-slate-100 hover:bg-slate-800 px-2.5 py-1 rounded text-[10px] font-bold border border-slate-800 transition cursor-pointer"
                              >
                                Aplicar Ajuste Contábil
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono">Apuração de Exercício Relógio: 12/06/2026</span>
                <button className="flex items-center gap-1.5 hover:text-orange-600 text-slate-600 font-bold transition cursor-pointer">
                  <Download className="w-3.5 h-3.5" />
                  Exportar Livros para Auditores (PDF)
                </button>
              </div>
            </div>

            {/* Real-time Audit & Scan Engine (1/3 width) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-orange-600">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    CONTROLE INTEGRADO DE AUDITORIA
                  </div>
                </div>
                
                <h3 className="text-base font-bold text-slate-900 font-sans">Varredura Patrimonial por IA</h3>
                <p className="text-xs text-slate-500">
                  Inicie um escaneamento autônomo nas contas contábeis do ERP e nas SPEs para mapear e mitigar quaisquer furos contábeis ou atrasos em repasses bancários.
                </p>
              </div>

              {/* Interactive auditor tool space */}
              <div className="space-y-4">
                <button 
                  onClick={handleRunAudit}
                  disabled={isAuditing}
                  className="w-full bg-slate-950 text-white hover:bg-slate-850 font-semibold text-xs py-3.5 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {isAuditing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                      Efetivando Varredura...
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft className="w-4 h-4 text-orange-500" />
                      Executar Reconciliação Geral
                    </>
                  )}
                </button>

                {/* Audit logger feed terminal design */}
                <div className="bg-slate-900 border border-slate-950 p-4 rounded-xl font-mono text-[10px] text-slate-300 h-48 overflow-y-auto flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5 animate-fadeIn">
                    <div className="text-orange-400 text-[9.5px] border-b border-slate-800 pb-1 font-semibold flex justify-between">
                      <span>LOG DE REVOLT-AUDIT RECONCILER</span>
                      <span>V1.4</span>
                    </div>
                    
                    {auditLog.map((log, index) => (
                      <div key={index} className="leading-normal animate-fadeIn text-emerald-400">
                        {log}
                      </div>
                    ))}

                    {isAuditing && (
                      <div className="text-orange-300 italic animate-pulse">
                        ... {auditStep}
                      </div>
                    )}
                    
                    {auditLog.length === 0 && !isAuditing && (
                      <div className="text-slate-500 text-center py-8">
                        Pronto para rodar auditoria patrimonial.
                      </div>
                    )}
                  </div>

                  {auditLog.length > 0 && !isAuditing && (
                    <div className="text-emerald-400 font-bold border-t border-slate-800 pt-1.5 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      CONSOLIDAÇÃO E CADASTRAMENTO OK
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <ShieldAlert className="w-4 h-4 text-orange-650 flex-shrink-0" />
                  Conectivos de Governança
                </div>
                <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans">
                  As análises de dispersão contábil estão em total conformidade com a instrução CVM de incorporações imobiliárias do regime de afetação fiscal das SPEs independentes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'drp' && (
        <div className="space-y-6">
          {/* Legend and explanation */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-5 items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 font-sans">O Princípio dos Três Resultados</h3>
              <p className="text-xs text-slate-550 leading-relaxed max-w-2xl">
                Um diferencial estratégico da Just é exibir lado a lado os três resultados que costumam ser confundidos na construção: o <strong>Econômico</strong> (lucro projetado por viabilidade do projeto), o <strong>Financeiro</strong> (quanto efetivamente virou caixa) e o <strong>Patrimonial</strong> (onde esse valor se materializou nas contas de ativos do grupo).
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 rounded-xl border border-slate-150 self-start text-xs font-medium">
              <Building className="w-4 h-4 text-slate-600" />
              <span>Simular Empreendimento:</span>
              <select 
                value={selectedDrpCaseId} 
                onChange={(e) => setSelectedDrpCaseId(e.target.value)}
                className="bg-white border border-slate-200 text-slate-900 rounded font-bold p-1 overflow-visible outline-none"
              >
                {db_drp_projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>
          </div>

          {/* DRP Core Grid layout - Economic vs Financial vs Patrimonial */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. Econômico (Viabilidade) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 relative">
              <div className="absolute top-4 right-4 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                MÓDULO BUILDIQ
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold block">1. Resultado</span>
                <h3 className="text-base font-extrabold text-slate-950 font-sans flex items-center gap-2">
                  <TrendingUp className="w-4.5 h-4.5 text-indigo-600" />
                  Econômico
                </h3>
                <p className="text-xs text-slate-400">Lucro teórico gerado pela venda técnica de frações ideais</p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Valor Geral de Vendas (VGV)</span>
                  <span className="font-mono font-bold text-slate-900">{formatReais(activeDrpCase.vgv)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Custos de Obra Direto/Indireto</span>
                  <span className="font-mono font-bold text-red-600">-{formatReais(activeDrpCase.custos)}</span>
                </div>
                <div className="flex justify-between py-2.5 bg-slate-50 px-2 rounded-lg border border-slate-150">
                  <span className="font-semibold text-slate-700">Lucro Econômico Estimado</span>
                  <span className="font-mono font-black text-indigo-700 text-sm">{formatReais(activeDrpCase.lucroEconomico)}</span>
                </div>
              </div>
              
              <div className="text-[11px] bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-500 leading-normal">
                <strong>Atualização INCC/IPC:</strong> Este lucro é corrigido trimestralmente na viabilidade, relacionando o reajuste de tabela de estoque com as medições de custo real de canteiro.
              </div>
            </div>

            {/* 2. Financeiro (Caixa) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 relative">
              <div className="absolute top-4 right-4 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                FINANCEFLOW
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold block">2. Resultado</span>
                <h3 className="text-base font-extrabold text-slate-950 font-sans flex items-center gap-2">
                  <Coins className="w-4.5 h-4.5 text-emerald-600" />
                  Financeiro
                </h3>
                <p className="text-xs text-slate-400">Fluxo líquido acumulado que de fato entrou na conta bancária</p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Vendas Recebidas (Sinal/Mensal)</span>
                  <span className="font-mono font-semibold text-emerald-600">+{formatReais(activeDrpCase.vgv * 0.45)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Desembolsos Físicos Efetuados</span>
                  <span className="font-mono font-semibold text-red-600">-{formatReais(activeDrpCase.custos * 0.55)}</span>
                </div>
                <div className="flex justify-between py-2.5 bg-slate-50 px-2 rounded-lg border border-slate-150">
                  <span className="font-semibold text-slate-700">Fluxo Disponível Líquido</span>
                  <button className="font-mono font-black text-emerald-700 text-sm hover:underline" onClick={() => alert('Caixa Disponível na SPE')}>
                    {formatReais(activeDrpCase.materializacao.caixa)}
                  </button>
                </div>
              </div>

              <div className="text-[11px] bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-500 leading-normal">
                <strong>Tempo de Repasse fiduciário:</strong> Diferente do lucro, o caixa reflete os recebíveis parcelados em canteiro (VSO) e os repasses dos bancos de financiamento.
              </div>
            </div>

            {/* 3. Patrimonial (DRP Materialização) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 relative bg-gradient-to-br from-white to-slate-50">
              <div className="absolute top-4 right-4 text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full">
                REVOLT-AUDIT
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold block">3. Onde está o lucro</span>
                <h3 className="text-base font-extrabold text-slate-950 font-sans flex items-center gap-2">
                  <LayoutGrid className="w-4.5 h-4.5 text-orange-600" />
                  Mapeado em Ativos
                </h3>
                <p className="text-xs text-slate-400">Onde o resultado econômico está materializado no balanço</p>
              </div>

              <div className="space-y-2.5 pt-1.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 font-medium">
                  <span className="text-slate-500">🏦 Caixa Fiduciário</span>
                  <span className="font-mono text-slate-900 font-bold">{formatReais(activeDrpCase.materializacao.caixa)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 font-medium">
                  <span className="text-slate-500">⛰️ Terrenos / Land Bank</span>
                  <span className="font-mono text-slate-900 font-bold">{formatReais(activeDrpCase.materializacao.terrenos)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 font-medium">
                  <span className="text-slate-500">🚜 Equipamentos / Canteiros</span>
                  <span className="font-mono text-slate-900 font-bold">{formatReais(activeDrpCase.materializacao.equipamentos)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 font-medium font-sans">
                  <span className="text-slate-500">📈 Aplicações Financeiras</span>
                  <span className="font-mono text-slate-900 font-bold">{formatReais(activeDrpCase.materializacao.aplicacoes)}</span>
                </div>
                
                <div className="flex justify-between py-2.5 bg-orange-500/10 px-2 rounded-lg border border-orange-200">
                  <span className="font-extrabold text-orange-950">Apurado Patrimonial</span>
                  <span className="font-mono font-black text-orange-850 text-sm">{formatReais(activeDrpCase.lucroEconomico)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* DRP Insights and detailed audit notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 text-slate-200 p-6 rounded-2xl border border-slate-950">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-400 text-xs font-mono font-bold">
                <Shield className="w-4 h-4" />
                RELATÓRIO DE AUDITABILIDADE DO DRP
              </div>
              <h4 className="text-sm font-bold text-white">Consistência de dados: 100% Conciliado</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeDrpCase.observacoes}
              </p>
            </div>
            
            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-3 leading-relaxed text-xs">
              <div className="text-[10px] text-slate-400 font-mono font-bold tracking-wider">GARANTIA E COMPLIANCE</div>
              <p className="text-slate-300 font-sans">
                A materialização de resultados em ativos segue a resolução CVM 142 e instruções para SPEs enquadradas no regime de Patrimônio de Afetação. Todas as destinações do faturamento foram verificadas electronicamente contra extratos de contas de controle e escrituras do cartório de imóveis.
              </p>
              <div className="flex justify-between items-center text-[10px] text-emerald-400 font-bold font-mono border-t border-slate-700 pt-2">
                <span>REVOLT-AUDIT SIGNATURE VALID</span>
                <span>SHA-256 REGISTERED</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
