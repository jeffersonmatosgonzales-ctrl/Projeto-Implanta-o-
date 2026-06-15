import { useState } from 'react';
import { Copy, Check, ArrowLeft, Bot, FileText, Database, ShieldCheck, Key, RefreshCw } from 'lucide-react';
import { SPE, Obra, TransacaoFinanceira, RegistroPatrimonial, AIAgent } from '../types';

interface ClaudeContextViewProps {
  spes: SPE[];
  obras: Obra[];
  transacoes: TransacaoFinanceira[];
  records: RegistroPatrimonial[];
  agents: AIAgent[];
  onClose?: () => void;
}

export default function ClaudeContextView({
  spes,
  obras,
  transacoes,
  records,
  agents,
  onClose
}: ClaudeContextViewProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'raw_data'>('prompt');

  const todayStr = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const generateMarkdownPayload = () => {
    return `# CONTEXTO INTEGRADO DE AUDITORIA E GOVERNANÇA — GRUPO JUST S.A.
Gerado em: ${todayStr} (Data limite da simulação: Junho de 2026)
Responsável Técnico: Jefferson Gonzales (CFO/Diretor Financeiro)
Email: jefferson.matos.gonzales@gmail.com
---

Este documento serve como a base de dados integrada de alta fidelidade para orientar análises financeiras, reconciliação patrimonial de SPEs, acompanhamento físico de obras (BuildIQ) e simulação de planejamento estratégico de longo prazo do Grupo JUST S.A.

## 1. SOCIEDADES DE PROPÓSITO ESPECÍFICO (SPEs) ATIVAS
As SPEs concentram o faturamento físico e a alocação de ativos do DRP (Demonstrativo de Resultado Patrimonial).
${spes.map((spe, idx) => `
### ${idx + 1}. ${spe.nome}
- **CNPJ:** ${spe.cnpj}
- **Participação do Grupo JUST:** ${spe.participacaoJust}%
- **Saldo de Caixa Atual:** R$ ${spe.caixaAtual.toLocaleString('pt-BR')}
- **Receita Esperada/Projetada:** R$ ${spe.receitaProjetada.toLocaleString('pt-BR')}
- **Receita Recebida Acumulada:** R$ ${spe.receitaRecebida.toLocaleString('pt-BR')}
- **Custo Operacional Realizado:** R$ ${spe.despesaRealizada.toLocaleString('pt-BR')}
- **Dividendos / Caixa Distribuído Acumulado:** R$ ${spe.distribuidoAcumulado.toLocaleString('pt-BR')}
- **Avanço Físico Ponderado:** ${spe.statusFisicoGeral}%
- **Alavancagem / Financiamentos de Apoio:** R$ ${spe.alavancagemBancaria.toLocaleString('pt-BR')}
`).join('\n')}

---

## 2. STATUS EM TEMPO REAL DAS OBRAS (Módulo BuildIQ)
Controle físico de progresso versus orçado e custos logísticos por metro quadrado.
${obras.map((obra, idx) => `
### [OBRA-${idx + 1}] ${obra.nome}
- **SPE Vinculada:** ${obra.speNome} (ID: ${obra.speId})
- **Localização:** ${obra.localizacao}
- **Status:** ${obra.status}
- **Progresso Físico Arbitrado:** ${obra.progressoFisico}% (Previsto/Financeiro: ${obra.progressoFinanceiro}%)
- **Custo Total Orçado:** R$ ${obra.orcamentoTotal.toLocaleString('pt-BR')}
- **Custo Efetivamente Realizado:** R$ ${obra.custoRealizado.toLocaleString('pt-BR')}
- **Unidades Vendidas / Comerciais:** ${obra.unidadesVendidas} de ${obra.unidadesTotais} (${obra.vendasProgresso}% de performance comercial)
- **Ticket Médio:** R$ ${obra.ticketMedio.toLocaleString('pt-BR')}
- **Custo por m² Orçado:** R$ ${obra.custoOrcadoMetroQuadrado.toLocaleString('pt-BR')}/m²
- **Custo por m² Apurado Real:** R$ ${obra.custoRealMetroQuadrado.toLocaleString('pt-BR')}/m²
- **Datas:** Início em ${obra.dataInicio} | Previsão de Conclusão em ${obra.dataEntrega}
`).join('\n')}

---

## 3. HISTÓRICO DE FLUXO E LANÇAMENTOS DE DIÁRIO (Módulo FinanceFlow)
Últimas movimentações financeiras de alta relevância coletadas na malha de SPEs.
${transacoes.map((tx, idx) => `
- **ID Lançamento:** ${tx.id} | **Data:** ${tx.data}
  - **Descrição:** ${tx.descricao}
  - **Tipo / Categoria:** ${tx.categoria}
  - **Valor Líquido:** R$ ${tx.valor.toLocaleString('pt-BR')}
  - **SPE Beneficiária/Origem:** ${tx.speNome}
  - **Status de Auditoria:** 🟢 ${tx.status}
`).join('\n')}

---

## 4. CONFORMIDADE CONTÁBIL E RECONCILIAÇÃO (Sienge Gateway vs. Bancos)
Conciliações periódicas sob regras rígidas de conformidade fiduciária executadas pelo agente Fidu-Reconciler.
${records.map((rec, idx) => `
### Registo Reconciliador [${rec.id}] - ${rec.conta}
- **Grupo Patrimonial:** ${rec.grupoPatrimonial}
- **Origem dos Dados:** ${rec.origem}
- **Valor nos Livros Contábeis:** R$ ${rec.valorContabil.toLocaleString('pt-BR')}
- **Valor Conferido do Extrato/Medição Física:** R$ ${rec.valorMensuradoRevolt.toLocaleString('pt-BR')}
- **Inconsistência Líquida Apurada:** R$ ${rec.divergencia.toLocaleString('pt-BR')}
- **Status de Resolução:** ${rec.statusReconciliacao === 'Concluído' ? '🟢 Concluído' : rec.statusReconciliacao === 'Sob Revisão' ? '🟡 Sob Revisão' : '🔴 Ajuste Necessário'}
`).join('\n')}

---

## 5. AGENTES AUTÔNOMOS E PIPELINES DE IA OPERACIONAIS
Sistemas inteligentes que monitoram e retroalimentam a dashboard de forma contínua.
${agents.map((ag) => `
- **IA Coletor:** ${ag.nome}
  - **Função Integrada:** ${ag.funcao}
  - **Canal de Coleta:** ${ag.tipoFonte} (Frequência: ${ag.frequenciaAtuando})
  - **Status Operacional:** ${ag.status === 'Processando' ? '🟢 Ativo' : ag.status === 'Em Espera' ? '🟡 Em Espera' : '🔴 Alerta'}
  - **Volume Integrado Hoje:** ${ag.itensProcessadosHoje} registros
  - **Última Varredura Integrável:** ${ag.ultimaExtracao}
`).join('\n')}

---

## Instruções de Análise e Instrução do Sistema para o Claude:
Você atuará de maneira integrada à Governança Corporativa do Grupo JUST S.A.
Ao responder ao Jefferson, assuma o papel de Co-Piloto de Decisões Estratégicas e responda com profunda clareza sobre os impactos das SPEs, os custos de obras excedentes por metro quadrado em relação ao orçado, e os ajustes necessários identificados na aba de Reconciliação Patrimonial.`;
  };

  const mdText = generateMarkdownPayload();

  const handleCopy = () => {
    navigator.clipboard.writeText(mdText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-6 md:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-8 max-w-5xl mx-auto font-sans relative overflow-hidden" id="claude-context-sync-panel">
      {/* Visual background lines decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full filter blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl -ml-20 -mb-20"></div>

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase font-mono font-bold tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/25">
            <Bot className="w-3.5 h-3.5 animate-pulse" />
            Integração Segura Claude & LLMs
          </div>
          <h1 className="text-2xl font-black md:text-3xl tracking-tight text-white">
            Portal de Recuperação e Sincronização de Contexto
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            Este painel serve como um emulador e exportador de dados fiduciários completo para que o Claude, ChatGPT ou outros modelos de IA analisem a íntegra da Governança da JUST S.A. sem perda de contexto ou informações.
          </p>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="self-start md:self-center flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-300 font-semibold text-xs border border-slate-800 rounded-xl transition cursor-pointer select-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao Dashboard
          </button>
        )}
      </div>

      {/* Control cards quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10 font-mono">
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-orange-950/40 text-orange-400 rounded-lg border border-orange-500/10">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] text-slate-500">MÚLTIPLAS SPES INTEGRÁVEIS</div>
            <div className="text-xs font-bold text-white">{spes.length} Entidades Ativas</div>
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-blue-950/40 text-blue-400 rounded-lg border border-blue-500/10">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] text-slate-500">DADOS TÉCNICOS DETALHADOS</div>
            <div className="text-xs font-bold text-white">{obras.length} Canteiros Ponderados</div>
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-950/40 text-emerald-400 rounded-lg border border-emerald-500/10">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] text-slate-500">CONVENÇÃO DE LEITURA</div>
            <div className="text-xs font-bold text-white">Fidelidade Fiduciária R$</div>
          </div>
        </div>
      </div>

      {/* Copy Prompt Console Section */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-4 py-1.5 text-xs font-bold tracking-tight rounded-lg transition-all ${
                activeTab === 'prompt' 
                  ? 'bg-slate-800 text-white border border-slate-700' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Exibir Markdown de Contexto
            </button>
            <button
              onClick={() => setActiveTab('raw_data')}
              className={`px-4 py-1.5 text-xs font-bold tracking-tight rounded-lg transition-all ${
                activeTab === 'raw_data' 
                  ? 'bg-slate-800 text-white border border-slate-700' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Exportar Estrutura JSON Bruta
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-tr from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-orange-500/10 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copiado com Sucesso!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copiar Contexto Técnico Completo
              </>
            )}
          </button>
        </div>

        {/* Display Textarea */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-2xl overflow-hidden p-5 font-mono text-[11px] leading-relaxed text-slate-350 space-y-4 max-h-[500px] overflow-y-auto shadow-inner border-t-2 border-t-orange-500/20">
          {activeTab === 'prompt' ? (
            <pre className="whitespace-pre-wrap select-all font-mono leading-relaxed text-slate-300">
              {mdText}
            </pre>
          ) : (
            <pre className="whitespace-pre-wrap select-all font-mono leading-relaxed text-emerald-400">
              {JSON.stringify({ spes, obras, transacoes, records, agents }, null, 2)}
            </pre>
          )}
        </div>
      </div>

      {/* Guide how to use in Claude/ChatGPT */}
      <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/30 space-y-3 relative z-10">
        <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5 text-orange-500" />
          Como compartilhar contexto de leitura com o Claude.ai:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] text-slate-400 leading-relaxed">
          <div className="space-y-2">
            <p className="flex items-start gap-2">
              <span className="font-bold text-orange-400 font-mono">1.</span>
              <span><strong>Envie o Link do Painel Diretamente:</strong> Copie a URL gerencial desta aplicação adicionando um parâmetro de leitura rápida:</span>
            </p>
            <div className="p-2 bg-slate-950 border border-slate-800 rounded font-mono text-[10px] text-white select-all break-all overflow-x-auto">
              {window.location.origin}/?claude=true
            </div>
            <p className="text-[10px] text-slate-500">
              Seu Claude tem navegação ativa? Forneça essa URL para que ele acesse instantaneamente.
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-start gap-2">
              <span className="font-bold text-orange-400 font-mono">2.</span>
              <span><strong>Ou coping o Prompt Consolidado:</strong> Use o botão laranja acima para copiar um pacote Markdown padronizado com todas as finanças em tempo real e cole no chat do Claude de forma 100% segura.</span>
            </p>
            <p>
              Ao receber o contexto contábil estruturado e íntegro, o assistente responderá às suas dúvidas de diário, contabilidade de SPE ou projeções fiscais com precisão perfeita, sem invenção de números (alucinação).
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info of compliance */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[9px] text-slate-600 font-mono pt-4 border-t border-slate-900 uppercase">
        <span>GRUPO JUST S.A. | INFRAESTRUTURA DE DADOS DE SEGURANÇA MÁXIMA</span>
        <span className="flex items-center gap-1">
          <RefreshCw className="w-2.5 h-2.5 animate-spin" />
          Sincronizado e validado Sienge Gateway
        </span>
      </div>
    </div>
  );
}
