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
  Download
} from 'lucide-react';
import { RegistroPatrimonial } from '../types';

interface ReconciliationProps {
  records: RegistroPatrimonial[];
  onCorrectDivergence: (recordId: string) => void;
}

export default function Reconciliation({ records, onCorrectDivergence }: ReconciliationProps) {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState('');
  const [auditLog, setAuditLog] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<'Todos' | 'Ativos' | 'Passivos'>('Todos');

  // Filter records
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
      'Reconciliação e auditoria realizada com sucesso!'
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setAuditStep(step);
        setAuditLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
        if (index === steps.length - 1) {
          setIsAuditing(false);
        }
      }, (index + 1) * 800);
    });
  };

  return (
    <div id="reconciliation-module" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-orange-600 tracking-wider flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" />
            CAMADA SUPERIOR DE MATURIDADE
          </div>
          <h1 className="text-2xl font-bold font-sans text-slate-900">
            Reconciliação Patrimonial & Auditoria
          </h1>
          <p className="text-xs text-slate-500">
            Apuração exata e consolidação patrimonial integrando valores do ERP com medições reais e físicas de canteiros.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs self-start">
          <button 
            className={`px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${selectedGroup === 'Todos' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setSelectedGroup('Todos')}
          >
            Todas as Contas
          </button>
          <button 
            className={`px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${selectedGroup === 'Ativos' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setSelectedGroup('Ativos')}
          >
            Ativos
          </button>
          <button 
            className={`px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${selectedGroup === 'Passivos' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setSelectedGroup('Passivos')}
          >
            Passivos e PL
          </button>
        </div>
      </div>

      {/* Main double layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Verification Matrix (2/3 width) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 font-mono tracking-wide uppercase flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-slate-600" />
              Matriz de Divergência Contábil x Real
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
              Inicie um escaneamento autônomo nas contas contábeis do ERP e nas SPEs para mapear e mitigar quaisquer furos tributários ou atrasos em repasses bancários.
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
  );
}
