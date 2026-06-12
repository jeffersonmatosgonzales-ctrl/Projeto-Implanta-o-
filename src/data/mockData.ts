import { Obra, SPE, TransacaoFinanceira, AIAgent, RegistroPatrimonial } from '../types';

export const mockSPEs: SPE[] = [
  {
    id: 'spe-justone',
    nome: 'SPE Just One Residencial Ltda',
    cnpj: '48.223.490/0001-01',
    participacaoJust: 85,
    caixaAtual: 24850000,
    receitaProjetada: 120000000,
    receitaRecebida: 52400000,
    despesaRealizada: 31200000,
    distribuidoAcumulado: 8000000,
    statusFisicoGeral: 42,
    alavancagemBancaria: 15000000
  },
  {
    id: 'spe-acacias',
    nome: 'SPE Parque das Acácias Ltda',
    cnpj: '45.890.112/0001-90',
    participacaoJust: 100,
    caixaAtual: 12450000,
    receitaProjetada: 85000000,
    receitaRecebida: 61000000,
    despesaRealizada: 48500000,
    distribuidoAcumulado: 5000000,
    statusFisicoGeral: 68,
    alavancagemBancaria: 10000000
  },
  {
    id: 'spe-vanguarda',
    nome: 'SPE Vanguarda Prime Ltda',
    cnpj: '51.100.223/0001-50',
    participacaoJust: 60,
    caixaAtual: 8150000,
    receitaProjetada: 65000000,
    receitaRecebida: 45000000,
    despesaRealizada: 38200000,
    distribuidoAcumulado: 2500000,
    statusFisicoGeral: 90,
    alavancagemBancaria: 5000000
  },
  {
    id: 'spe-belvedere',
    nome: 'SPE Belvedere Hills Ltda',
    cnpj: '53.670.334/0001-33',
    participacaoJust: 100,
    caixaAtual: 15900000,
    receitaProjetada: 145000000,
    receitaRecebida: 18000000,
    despesaRealizada: 9500000,
    distribuidoAcumulado: 0,
    statusFisicoGeral: 12,
    alavancagemBancaria: 25000000
  }
];

export const mockObras: Obra[] = [
  {
    id: 'obra-justone',
    nome: 'Edifício Just One Premium',
    speId: 'spe-justone',
    speNome: 'SPE Just One Residencial Ltda',
    localizacao: 'Av. Brigadeiro Faria Lima, 4500 - São Paulo, SP',
    progressoFisico: 42,
    progressoFinanceiro: 48,
    orcamentoTotal: 72000000,
    custoRealizado: 31200000,
    vendasProgresso: 82,
    custoOrcadoMetroQuadrado: 9200,
    custoRealMetroQuadrado: 8950,
    unidadesTotais: 120,
    unidadesVendidas: 98,
    ticketMedio: 1220000,
    dataInicio: '15/10/2024',
    dataEntrega: '30/11/2027',
    status: 'Em Construção'
  },
  {
    id: 'obra-acacias',
    nome: 'Residencial Parque das Acácias',
    speId: 'spe-acacias',
    speNome: 'SPE Parque das Acácias Ltda',
    localizacao: 'Al. das Palmeiras, 120 - Campinas, SP',
    progressoFisico: 68,
    progressoFinanceiro: 62,
    orcamentoTotal: 55000000,
    custoRealizado: 48500000,
    vendasProgresso: 94,
    custoOrcadoMetroQuadrado: 6400,
    custoRealMetroQuadrado: 6510,
    unidadesTotais: 240,
    unidadesVendidas: 225,
    ticketMedio: 385000,
    dataInicio: '01/03/2024',
    dataEntrega: '15/08/2026',
    status: 'Em Construção'
  },
  {
    id: 'obra-vanguarda',
    nome: 'Vanguarda Corporate Offices',
    speId: 'spe-vanguarda',
    speNome: 'SPE Vanguarda Prime Ltda',
    localizacao: 'Rua do Comércio, 888 - Barueri, SP',
    progressoFisico: 90,
    progressoFinanceiro: 87,
    orcamentoTotal: 42000000,
    custoRealizado: 38200000,
    vendasProgresso: 88,
    custoOrcadoMetroQuadrado: 7800,
    custoRealMetroQuadrado: 7750,
    unidadesTotais: 80,
    unidadesVendidas: 70,
    ticketMedio: 850000,
    dataInicio: '20/08/2023',
    dataEntrega: '10/12/2025',
    status: 'Em Construção'
  },
  {
    id: 'obra-belvedere',
    nome: 'Belvedere Hills Mansions',
    speId: 'spe-belvedere',
    speNome: 'SPE Belvedere Hills Ltda',
    localizacao: 'Rodovia Senador José Ermírio de Moraes, km 8 - Sorocaba, SP',
    progressoFisico: 12,
    progressoFinanceiro: 8,
    orcamentoTotal: 96000000,
    custoRealizado: 9500000,
    vendasProgresso: 35,
    custoOrcadoMetroQuadrado: 11000,
    custoRealMetroQuadrado: 10800,
    unidadesTotais: 64,
    unidadesVendidas: 22,
    ticketMedio: 2800000,
    dataInicio: '01/02/2026',
    dataEntrega: '30/06/2029',
    status: 'Planejamento'
  }
];

export const mockTransacoes: TransacaoFinanceira[] = [
  {
    id: 'tx-001',
    data: '12/06/2026',
    descricao: 'Repasse CEF - Vendas Terceiros - Parque das Acácias',
    categoria: 'Venda',
    valor: 1420000,
    speId: 'spe-acacias',
    speNome: 'SPE Parque das Acácias Ltda',
    status: 'Reconciliado'
  },
  {
    id: 'tx-002',
    data: '12/06/2026',
    descricao: 'Fornecedor Votorantim Cimentos - NF 88.452',
    categoria: 'Fornecedor',
    valor: -385000,
    speId: 'spe-justone',
    speNome: 'SPE Just One Residencial Ltda',
    status: 'Reconciliado'
  },
  {
    id: 'tx-003',
    data: '11/06/2026',
    descricao: 'Aporte mútuo acionistas capital construtor',
    categoria: 'Aporte',
    valor: 4000000,
    speId: 'spe-belvedere',
    speNome: 'SPE Belvedere Hills Ltda',
    status: 'Reconciliado'
  },
  {
    id: 'tx-004',
    data: '10/06/2026',
    descricao: 'Medição subempreiteiro estrutura - Just One',
    categoria: 'Fornecedor',
    valor: -890000,
    speId: 'spe-justone',
    speNome: 'SPE Just One Residencial Ltda',
    status: 'Reconciliado'
  },
  {
    id: 'tx-005',
    data: '08/06/2026',
    descricao: 'Recolhimento RET mensal consolidado (Lucro Presumido)',
    categoria: 'Impostos',
    valor: -245000,
    speId: 'spe-vanguarda',
    speNome: 'SPE Vanguarda Prime Ltda',
    status: 'Reconciliado'
  },
  {
    id: 'tx-006',
    data: '05/06/2026',
    descricao: 'Liberação de tranche financiamento de apoio à produção',
    categoria: 'Financiamento',
    valor: 3500000,
    speId: 'spe-justone',
    speNome: 'SPE Just One Residencial Ltda',
    status: 'Reconciliado'
  },
  {
    id: 'tx-007',
    data: '05/06/2026',
    descricao: 'Folha de pagamento engenharia e obra - Junho/26',
    categoria: 'Folha de Pagto',
    valor: -412000,
    speId: 'spe-acacias',
    speNome: 'SPE Parque das Acácias Ltda',
    status: 'Reconciliado'
  },
  {
    id: 'tx-008',
    data: '12/06/2026 (Hoje)',
    descricao: 'Estorno de pagamento duplicado areia lavada - Pendente aprovação',
    categoria: 'Fornecedor',
    valor: 54000,
    speId: 'spe-vanguarda',
    speNome: 'SPE Vanguarda Prime Ltda',
    status: 'Pendente'
  }
];

export const mockAIAgents: AIAgent[] = [
  {
    id: 'agent-erp',
    nome: 'Boni-ERP Collector',
    funcao: 'Coleta automática de balancetes, lançamentos de contas a pagar e receber do software de retaguarda.',
    frequenciaAtuando: 'A cada 30 minutos',
    status: 'Processando',
    ultimaExtracao: 'Hoje, 06:45',
    itensProcessadosHoje: 342,
    tipoFonte: 'ERP'
  },
  {
    id: 'agent-diario',
    nome: 'Sensus-Logistics',
    funcao: 'Varredura e classificação de avanço físico a partir de uploads de Relatórios de Diário de Obra das SPEs.',
    frequenciaAtuando: 'A cada 2 horas',
    status: 'Em Espera',
    ultimaExtracao: 'Hoje, 05:30',
    itensProcessadosHoje: 8,
    tipoFonte: 'Diário de Obra'
  },
  {
    id: 'agent-notas',
    nome: 'Tributum-OCR',
    funcao: 'Leitura, validação de impostos das prefeituras (RET) e aprovação de notas de materiais e fornecedores.',
    frequenciaAtuando: 'Tempo real no recebimento',
    status: 'Processando',
    ultimaExtracao: 'Hoje, 06:50',
    itensProcessadosHoje: 74,
    tipoFonte: 'Notas Fiscais'
  },
  {
    id: 'agent-bancos',
    nome: 'Fidu-Reconciler',
    funcao: 'Conciliação e espelhamento diário automático dos extratos bancários de todas as contas SPE com o contábil.',
    frequenciaAtuando: 'A cada 1 hora',
    status: 'Processando',
    ultimaExtracao: 'Hoje, 06:15',
    itensProcessadosHoje: 89,
    tipoFonte: 'Extratos de SPE'
  }
];

export const mockReconciliation: RegistroPatrimonial[] = [
  {
    id: 'rp-001',
    grupoPatrimonial: 'Ativo Circulante',
    conta: 'Bancos e Equivalentes (Contas SPE)',
    origem: 'Apurado SPE',
    valorContabil: 61350000,
    valorMensuradoRevolt: 61350000,
    divergencia: 0,
    statusReconciliacao: 'Concluído'
  },
  {
    id: 'rp-002',
    grupoPatrimonial: 'Ativo Circulante',
    conta: 'Recebíveis de Carteira de Mutuários (Unidades)',
    origem: 'Apurado ERP',
    valorContabil: 112400000,
    valorMensuradoRevolt: 112850000,
    divergencia: +450000, // Ajuste positivo identificado de atrasos securitizados
    statusReconciliacao: 'Concluído'
  },
  {
    id: 'rp-003',
    grupoPatrimonial: 'Ativo Não Circulante',
    conta: 'Imobilizado de Obras em Andamento (PoC %)',
    origem: 'Ajuste de Avaliação',
    valorContabil: 122240000,
    valorMensuradoRevolt: 121800000,
    divergencia: -440000, // Diferença no cálculo físico acumulado
    statusReconciliacao: 'Sob Revisão'
  },
  {
    id: 'rp-004',
    grupoPatrimonial: 'Passivo Circulante',
    conta: 'Adiantamentos de Clientes (Permuta/Sinal)',
    origem: 'Apurado ERP',
    valorContabil: 18450000,
    valorMensuradoRevolt: 18450000,
    divergencia: 0,
    statusReconciliacao: 'Concluído'
  },
  {
    id: 'rp-005',
    grupoPatrimonial: 'Passivo Circulante',
    conta: 'Financiamentos à Produção (Plano Empresário)',
    origem: 'Apurado SPE',
    valorContabil: 55000000,
    valorMensuradoRevolt: 55000000,
    divergencia: 0,
    statusReconciliacao: 'Concluído'
  },
  {
    id: 'rp-006',
    grupoPatrimonial: 'Patrimônio Líquido',
    conta: 'Capital Social Integralizado e Lucros Retidos',
    origem: 'Ajuste de Avaliação',
    valorContabil: 154100000,
    valorMensuradoRevolt: 154110000,
    divergencia: +10000,
    statusReconciliacao: 'Ajuste Necessário'
  }
];
