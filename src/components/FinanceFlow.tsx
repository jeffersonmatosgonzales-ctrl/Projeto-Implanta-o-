import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coins, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart, 
  History,
  CheckCircle,
  HelpCircle,
  Plus,
  RefreshCw,
  TrendingUp,
  FileCheck2,
  Building2
} from 'lucide-react';
import { SPE, TransacaoFinanceira } from '../types';

interface FinanceFlowProps {
  spes: SPE[];
  transacoes: TransacaoFinanceira[];
  onAddTransacao: (tx: Omit<TransacaoFinanceira, 'id'>) => void;
  selectedSpeId: string | null;
  onSelectSPE: (speId: string | null) => void;
}

export default function FinanceFlow({ 
  spes, 
  transacoes, 
  onAddTransacao,
  selectedSpeId,
  onSelectSPE
}: FinanceFlowProps) {
  const [activeTab, setActiveTab] = useState<'consolidated' | 'spes-list' | 'ledger'>('consolidated');
  
  // Transaction entry form state
  const [desc, setDesc] = useState('');
  const [val, setVal] = useState('');
  const [cat, setCat] = useState<'Aporte' | 'Venda' | 'Fornecedor' | 'Impostos' | 'Folha de Pagto' | 'Financiamento'>('Venda');
  const [targetSpeId, setTargetSpeId] = useState(spes[0]?.id || '');
  const [simulatedAIAgentSync, setSimulatedAIAgentSync] = useState(false);

  const consolidatedCaixa = spes.reduce((acc, s) => acc + s.caixaAtual, 0);
  const consolidatedReceitas = spes.reduce((acc, s) => acc + s.receitaRecebida, 0);
  const consolidatedDespesas = spes.reduce((acc, s) => acc + s.despesaRealizada, 0);
  const consolidatedDistribuido = spes.reduce((acc, s) => acc + s.distribuidoAcumulado, 0);
  const consolidatedDividas = spes.reduce((acc, s) => acc + s.alavancagemBancaria, 0);

  const selectedSPE = spes.find(s => s.id === selectedSpeId);

  // Filter transactions for specific SPE if selected
  const filteredTransacoes = selectedSpeId
    ? transacoes.filter(t => t.speId === selectedSpeId)
    : transacoes;

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!desc || !val) return;
    
    const speObj = spes.find(s => s.id === targetSpeId);
    if (!speObj) return;

    setSimulatedAIAgentSync(true);

    // AI Sync Simulation
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

  const formatReais = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div id="financeflow-module" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-orange-600 tracking-wider flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5" />
            MÓDULO FINANCE FLOW
          </div>
          <h1 className="text-2xl font-bold font-sans text-slate-900">
            Liquidez, Fluxo de Caixa & SPEs
          </h1>
          <p className="text-xs text-slate-500">
            Controle integrado de faturamento, distribuições de dividendos excedentes e liquidez por Sociedades de Propósito Específico.
          </p>
        </div>

        {/* View toggles */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs self-start">
          <button 
            className={`px-3 py-1.5 rounded-lg transition font-medium ${activeTab === 'consolidated' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-850'}`}
            onClick={() => { setActiveTab('consolidated'); onSelectSPE(null); }}
          >
            Consolidado
          </button>
          <button 
            className={`px-3 py-1.5 rounded-lg transition font-medium ${activeTab === 'spes-list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-850'}`}
            onClick={() => setActiveTab('spes-list')}
          >
            Detalhamento SPEs
          </button>
          <button 
            className={`px-3 py-1.5 rounded-lg transition font-medium ${activeTab === 'ledger' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-850'}`}
            onClick={() => setActiveTab('ledger')}
          >
            Extrato Contábil Geral
          </button>
        </div>
      </div>

      {activeTab === 'consolidated' && (
        <div className="space-y-8">
          {/* Main Financial Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10.5px] font-mono text-slate-450 uppercase block">Saldo Consolidado</span>
              <div className="text-xl font-bold font-sans text-slate-950">{formatReais(consolidatedCaixa)}</div>
              <p className="text-[10.5px] text-slate-400">Somatória de caixas descentralizados</p>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10.5px] font-mono text-slate-455 uppercase block">Receita Recebida SPEs</span>
              <div className="text-xl font-bold font-sans text-emerald-600">{formatReais(consolidatedReceitas)}</div>
              <p className="text-[10.5px] text-emerald-650">Aportes e repasses acumulados</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10.5px] font-mono text-slate-455 uppercase block">Distribuição Acumulada</span>
              <div className="text-xl font-bold font-sans text-indigo-700">{formatReais(consolidatedDistribuido)}</div>
              <p className="text-[10.5px] text-slate-405 text-slate-400">Total distribuído para a holding Just</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10.5px] font-mono text-slate-455 uppercase block">Alavancagem Bancária</span>
              <div className="text-xl font-bold font-sans text-orange-700">{formatReais(consolidatedDividas)}</div>
              <p className="text-[10.5px] font-medium bg-orange-500/5 px-2 py-0.5 rounded inline-block text-orange-700">Plano empresário contratado</p>
            </div>
          </div>

          {/* Double Column layout: SPE breakdown Table & Form Simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Table of active SPE DRE (2/3 cols) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 font-sans">
                  Sociedades de Propósito Específico (SPE) - Visão DRE
                </h3>
                <p className="text-xs text-slate-450">
                  Relatório sumário de receitas brutas, custos de obras e excedentes de liquidez
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-455 font-mono text-[10px] border-b border-slate-150 uppercase">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Entidade SPE</th>
                      <th className="py-3 px-4 font-semibold">Participação Just</th>
                      <th className="py-3 px-4 font-semibold text-right">Receita Acumulada</th>
                      <th className="py-3 px-4 font-semibold text-right">Despesas Obra</th>
                      <th className="py-3 px-4 font-semibold text-right">Caixa Atual</th>
                      <th className="py-3 px-4 font-semibold text-right">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {spes.map((spe) => {
                      const lucro = spe.receitaRecebida - spe.despesaRealizada;
                      return (
                        <tr 
                          key={spe.id}
                          className="hover:bg-orange-50/10 transition cursor-pointer"
                          onClick={() => { onSelectSPE(spe.id); setActiveTab('spes-list'); }}
                        >
                          <td className="py-3.5 px-4 font-semibold text-slate-900 flex flex-col">
                            <span>{spe.nome}</span>
                            <span className="text-[9.5px] font-mono text-slate-400 font-normal">{spe.cnpj}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
                              {spe.participacaoJust}%
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right text-slate-850 font-mono">{formatReais(spe.receitaRecebida)}</td>
                          <td className="py-3.5 px-4 text-right text-red-600 font-mono">-{formatReais(spe.despesaRealizada)}</td>
                          <td className="py-3.5 px-4 text-right font-bold text-slate-900 font-mono">{formatReais(spe.caixaAtual)}</td>
                          <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                            +{(lucro / 1000000).toFixed(1)}M
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-start gap-2">
                <HelpCircle className="w-4.5 h-4.5 text-orange-600 flex-shrink-0" />
                <span>
                  <strong>Nota sobre SPEs:</strong> Cada empreendimento imobiliário da Construtora Just é estruturado legalmente como uma Sociedade de Propósito Específico (SPE) visando segregação patrimonial saudável. Os lucros acumulados são distribuídos diretamente à holding do grupo proporcionalmente à participação.
                </span>
              </div>
            </div>              {/* Simulated Data Harvester Input Form (1/3 cols) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-orange-600">
                  <RefreshCw className={`w-3.5 h-3.5 ${simulatedAIAgentSync ? 'animate-spin text-orange-550' : ''}`} />
                  TESTE DE INTEGRABILIDADE
                </div>
                <h3 className="text-base font-bold text-slate-950 font-sans">Simular Lançamento ERP</h3>
                <p className="text-xs text-slate-500">
                  Simule uma nova transação financeira gerada no canteiro. A esteira de dados de IA validará e atualizará o caixa da SPE instantaneamente sem e-mail.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-755">Selecione a SPE Alvo</label>
                  <select 
                    value={targetSpeId} 
                    onChange={(e) => setTargetSpeId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium outline-none focus:border-orange-500"
                  >
                    {spes.map((s) => (
                      <option key={s.id} value={s.id}>{s.nome.split(' Ltda')[0]}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-755">Descrição do Movimento</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Fornecedor de Aço Gerdau NF 4410" 
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-sans outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-slate-755">Categoria</label>
                    <select 
                      value={cat} 
                      onChange={(e) => setCat(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium outline-none focus:border-orange-500"
                    >
                      <option value="Fornecedor">Fornecedor</option>
                      <option value="Venda">Recebimento Unidade</option>
                      <option value="Aporte">Aporte Just Holding</option>
                      <option value="Impostos">Impostos (RET)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-slate-755">Valor Bruto (R$)</label>
                    <input 
                      type="number" 
                      placeholder="Ex: 150000" 
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
                  className="w-full bg-slate-950 text-white font-semibold text-xs py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-850 transition cursor-pointer disabled:opacity-50"
                >
                  {simulatedAIAgentSync ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                      Extraindo e validando no ERP...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-orange-500" />
                      Registrar por IA na Esteira
                    </>
                  )}
                </button>
              </form>

              {/* Status logging area */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-[10.5px] text-slate-500 font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span>Auditador Online:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    CONECTADO
                  </span>
                </div>
                <p className="text-[10px] leading-relaxed">
                  Lançamentos contábeis alimentados via OCR de notas municipais e APIs bancárias integradas eliminam a necessidade de conferências manuais e fechamentos longos subsequentes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'spes-list' && (
        <div className="space-y-6">
          {/* Detailed single SPE breakdown view */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs">
            <span className="font-bold text-slate-500 uppercase">Visualizador Individual da SPE:</span>
            <select 
              value={selectedSpeId || ''} 
              onChange={(e) => onSelectSPE(e.target.value || null)}
              className="bg-white border border-slate-200 text-slate-800 rounded font-semibold p-1.5 outline-none"
            >
              <option value="">Selecione uma SPE...</option>
              {spes.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
            {selectedSpeId && (
              <button 
                onClick={() => onSelectSPE(null)} 
                className="text-orange-600 hover:underline font-semibold"
              >
                Limpar seleção
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {selectedSPE ? (
              <motion.div 
                key={selectedSPE.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Specific SPE Metrics & DRE (2/3 width) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-orange-600 tracking-widest">{selectedSPE.cnpj}</span>
                      <h3 className="text-lg font-bold text-slate-900">{selectedSPE.nome}</h3>
                    </div>
                    <span className="bg-orange-500/10 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full border border-orange-500/15">
                      Participação Just: {selectedSPE.participacaoJust}%
                    </span>
                  </div>

                  {/* Financial Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
                      <span className="text-[10.5px] font-mono text-slate-400 block">CAIXA DISPONÍVEL</span>
                      <span className="text-base font-bold text-slate-900 font-mono">{formatReais(selectedSPE.caixaAtual)}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
                      <span className="text-[10.5px] font-mono text-slate-400 block">RECEBIDO EM CARTEIRA</span>
                      <span className="text-base font-bold text-slate-900 font-mono">{formatReais(selectedSPE.receitaRecebida)}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
                      <span className="text-[10.5px] font-mono text-slate-400 block">DESPESAS DE OBRA</span>
                      <span className="text-base font-bold text-red-650 font-mono">{formatReais(selectedSPE.despesaRealizada)}</span>
                    </div>
                  </div>

                  {/* Cash Distribution ledger */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold font-mono text-slate-500 uppercase">Valores Distribuídos para Holding de Controle (Just S.A.)</h4>
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-150 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400">Total Distribuído Acumulado</div>
                        <div className="text-lg font-bold text-slate-850 font-mono">{formatReais(selectedSPE.distribuidoAcumulado)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-450 bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded font-medium inline-block flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Seguro e Homologado
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SPE banking leverage status */}
                  <div className="p-4 bg-orange-500/5 rounded-xl border border-orange-500/10 space-y-2">
                    <h4 className="text-xs font-bold text-orange-700 flex items-center gap-1.5 text-orange-850">
                      <FileCheck2 className="w-4 h-4" />
                      Garantias & Financiamento à Produção (Apoio à Construção)
                    </h4>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Esta SPE possui financiamento corporativo aprovado junto ao banco fiduciário no valor de <strong className="text-orange-800 font-mono">{formatReais(selectedSPE.alavancagemBancaria)}</strong> como auxílio de fluxo de PoC. As garantias são constituídas pelas próprias frações ideais das unidades construídas.
                    </p>
                  </div>
                </div>

                {/* Bank ledger harvested for this specific SPE (1/3 width) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center gap-1.5">
                      <History className="w-4.5 h-4.5" />
                      ÚLTIMAS CONCILIAÇÕES BANCÁRIAS
                    </h3>
                    <p className="text-xs text-slate-400">Transações mapeadas pelo agente de IA na conta fiduciária desta SPE</p>
                  </div>

                  <div className="space-y-3">
                    {filteredTransacoes.map((tx) => {
                      const isExpense = tx.valor < 0;
                      return (
                        <div key={tx.id} className="p-3 bg-stone-50 border border-stone-150 rounded-lg space-y-2 hover:border-amber-400">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[11px] text-stone-850 font-semibold font-sans leading-tight block">{tx.descricao}</span>
                            <span className={`text-[10.5px] font-mono font-bold shrink-0 ${isExpense ? 'text-red-650 text-red-600' : 'text-emerald-600'}`}>
                              {isExpense ? '' : '+'}{formatReais(tx.valor)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono">
                            <span>{tx.data}</span>
                            <span className="bg-stone-200 text-stone-600 px-1 rounded uppercase font-bold text-[8.5px]">
                              {tx.categoria}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {filteredTransacoes.length === 0 && (
                      <div className="text-center py-8 text-xs text-slate-450 font-sans">
                        Nenhum registro específico coletado nesta SPE.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white p-12 text-center border rounded-2xl border-slate-200">
                <p className="text-xs text-slate-500">Selecione uma SPE acima para visualizar os indicadores do livro diário.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 font-sans">
              Extrato Geral Unificado do Grupo
            </h3>
            <p className="text-xs text-slate-400">
              Todos os lançamentos capturados de notas de fornecedores, impostos RET e vendas consolidadas agregadas.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-455 font-mono text-[10px] border-b border-slate-150 uppercase">
                <tr>
                  <th className="py-3 px-4 font-semibold">Data</th>
                  <th className="py-3 px-4 font-semibold">Descrição</th>
                  <th className="py-3 px-4 font-semibold">Categoria</th>
                  <th className="py-3 px-4 font-semibold">SPE de Origem</th>
                  <th className="py-3 px-4 font-semibold text-right">Valor Líquido</th>
                  <th className="py-3 px-4 font-semibold">Status de IA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {transacoes.map((tx) => {
                  const isExpense = tx.valor < 0;
                  return (
                    <tr key={tx.id} className="hover:bg-orange-500/5 transition">
                      <td className="py-3 px-4 font-mono text-slate-500">{tx.data}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">{tx.descricao}</td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-655 px-2 py-0.5 rounded text-[9.5px] uppercase font-bold font-mono">
                          {tx.categoria}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-medium">{tx.speNome}</td>
                      <td className={`py-3 px-4 text-right font-mono font-bold ${isExpense ? 'text-red-650' : 'text-emerald-600'}`}>
                        {isExpense ? '' : '+'}{formatReais(tx.valor)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-[9.5px] font-bold px-1.5 py-0.5 rounded ${tx.status === 'Reconciliado' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Reconciliado' ? 'bg-emerald-500' : 'bg-orange-500 animate-pulse'}`} />
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
      )}
    </div>
  );
}
