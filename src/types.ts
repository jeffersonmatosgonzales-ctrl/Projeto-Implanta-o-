export interface Obra {
  id: string;
  nome: string;
  speId: string;
  speNome: string;
  localizacao: string;
  progressoFisico: number; // percentage
  progressoFinanceiro: number; // percentage
  orcamentoTotal: number; // em R$
  custoRealizado: number; // em R$
  vendasProgresso: number; // percentage of units sold
  custoOrcadoMetroQuadrado: number; // R$/m²
  custoRealMetroQuadrado: number; // R$/m²
  unidadesTotais: number;
  unidadesVendidas: number;
  ticketMedio: number; // R$
  dataInicio: string;
  dataEntrega: string;
  status: 'Planejamento' | 'Em Construção' | 'Finalizada' | 'Atrasada';
}

export interface SPE {
  id: string;
  nome: string;
  cnpj: string;
  participacaoJust: number; // ex: 80 (%)
  caixaAtual: number;
  receitaProjetada: number;
  receitaRecebida: number;
  despesaRealizada: number;
  distribuidoAcumulado: number;
  statusFisicoGeral: number; // avg physical progress of associated Obras
  alavancagemBancaria: number; // Debt ratio or financing R$
}

export interface TransacaoFinanceira {
  id: string;
  data: string;
  descricao: string;
  categoria: 'Aporte' | 'Venda' | 'Fornecedor' | 'Impostos' | 'Folha de Pagto' | 'Financiamento';
  valor: number; // positive or negative
  speId: string;
  speNome: string;
  status: 'Reconciliado' | 'Pendente';
}

export interface AIAgent {
  id: string;
  nome: string;
  funcao: string;
  frequenciaAtuando: string;
  status: 'Inativo' | 'Processando' | 'Em Espera' | 'Alerta';
  ultimaExtracao: string;
  itensProcessadosHoje: number;
  tipoFonte: 'ERP' | 'Diário de Obra' | 'Notas Fiscais' | 'Contabilidade' | 'Extratos de SPE';
}

export interface RegistroPatrimonial {
  id: string;
  grupoPatrimonial: 'Ativo Circulante' | 'Ativo Não Circulante' | 'Passivo Circulante' | 'Patrimônio Líquido';
  conta: string;
  origem: 'Apurado ERP' | 'Apurado SPE' | 'Ajuste de Avaliação';
  valorContabil: number;
  valorMensuradoRevolt: number; // Reconciled realistic value
  divergencia: number;
  statusReconciliacao: 'Concluído' | 'Sob Revisão' | 'Ajuste Necessário';
}
