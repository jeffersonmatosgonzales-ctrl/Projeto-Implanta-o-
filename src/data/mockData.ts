import { Obra, SPE, TransacaoFinanceira, AIAgent, RegistroPatrimonial } from '../types';

export const mockSPEs: SPE[] = [
  {
    id: 'spe-matera',
    nome: 'SPE Matera Residence Ltda',
    cnpj: '48.223.490/0001-01',
    participacaoJust: 85,
    caixaAtual: 18450000,
    receitaProjetada: 65810000,
    receitaRecebida: 31200000,
    despesaRealizada: 15220000,
    distribuidoAcumulado: 3000000,
    statusFisicoGeral: 25,
    alavancagemBancaria: 12000000,
    estoqueAVender: 15000000,
    imoveisEntreguesReceber: 19610000,
    contasAPagarFornecedores: 2000000
  },
  {
    id: 'spe-blank',
    nome: 'SPE Blank Residence Ltda',
    cnpj: '45.890.112/0001-90',
    participacaoJust: 100,
    caixaAtual: 11250000,
    receitaProjetada: 39120000,
    receitaRecebida: 12500000,
    despesaRealizada: 7068000,
    distribuidoAcumulado: 1200000,
    statusFisicoGeral: 20,
    alavancagemBancaria: 8000000,
    estoqueAVender: 16000000,
    imoveisEntreguesReceber: 10620000,
    contasAPagarFornecedores: 1500000
  },
  {
    id: 'spe-neo',
    nome: 'SPE Neo Residence Ltda',
    cnpj: '51.100.223/0001-50',
    participacaoJust: 60,
    caixaAtual: 6800000,
    receitaProjetada: 45000000,
    receitaRecebida: 41000000,
    despesaRealizada: 38000000,
    distribuidoAcumulado: 2000000,
    statusFisicoGeral: 100,
    alavancagemBancaria: 0,
    estoqueAVender: 1500000,
    imoveisEntreguesReceber: 2500000,
    contasAPagarFornecedores: 300000
  },
  {
    id: 'spe-acacias',
    nome: 'SPE Parque das Acácias Ltda',
    cnpj: '53.670.334/0001-33',
    participacaoJust: 100,
    caixaAtual: 12450000,
    receitaProjetada: 55000000,
    receitaRecebida: 53500000,
    despesaRealizada: 48000000,
    distribuidoAcumulado: 4000000,
    statusFisicoGeral: 100,
    alavancagemBancaria: 0,
    estoqueAVender: 500000,
    imoveisEntreguesReceber: 1000000,
    contasAPagarFornecedores: 200000
  }
];

export const mockObras: Obra[] = [
  {
    id: 'obra-matera',
    nome: 'Residencial Matera',
    speId: 'spe-matera',
    speNome: 'SPE Matera Residence Ltda',
    localizacao: 'Zona 01, Centro - Maringá, PR',
    progressoFisico: 25,
    progressoFinanceiro: 23,
    orcamentoTotal: 60870000,
    custoRealizado: 15220000,
    vendasProgresso: 72,
    custoOrcadoMetroQuadrado: 8200,
    custoRealMetroQuadrado: 8100,
    unidadesTotais: 110,
    unidadesVendidas: 80,
    ticketMedio: 822600,
    dataInicio: '10/01/2026',
    dataEntrega: '30/12/2028',
    status: 'Em Construção',
    estagio: 'Em Construção',
    receitaTotalContratada: 65810000,
    valorTerreno: 7500000
  },
  {
    id: 'obra-blank',
    nome: 'Blank Residence',
    speId: 'spe-blank',
    speNome: 'SPE Blank Residence Ltda',
    localizacao: 'Zona 07, Próximo UEM - Maringá, PR',
    progressoFisico: 20,
    progressoFinanceiro: 18,
    orcamentoTotal: 35340000,
    custoRealizado: 7068000,
    vendasProgresso: 51,
    custoOrcadoMetroQuadrado: 7100,
    custoRealMetroQuadrado: 7150,
    unidadesTotais: 80,
    unidadesVendidas: 41,
    ticketMedio: 954000,
    dataInicio: '15/02/2026',
    dataEntrega: '30/06/2029',
    status: 'Em Construção',
    estagio: 'Em Construção',
    receitaTotalContratada: 39120000,
    valorTerreno: 4800000
  },
  {
    id: 'obra-neo',
    nome: 'Neo Residence',
    speId: 'spe-neo',
    speNome: 'SPE Neo Residence Ltda',
    localizacao: 'Av. Horácio Raccanello - Maringá, PR',
    progressoFisico: 100,
    progressoFinanceiro: 100,
    orcamentoTotal: 38000000,
    custoRealizado: 38000000,
    vendasProgresso: 96,
    custoOrcadoMetroQuadrado: 6400,
    custoRealMetroQuadrado: 6410,
    unidadesTotais: 140,
    unidadesVendidas: 135,
    ticketMedio: 333000,
    dataInicio: '01/03/2024',
    dataEntrega: '15/05/2026',
    status: 'Finalizada',
    estagio: 'Em Repasse',
    receitaTotalContratada: 45000000,
    valorTerreno: 5000000
  },
  {
    id: 'obra-acacias',
    nome: 'Residencial Parque das Acácias',
    speId: 'spe-acacias',
    speNome: 'SPE Parque das Acácias Ltda',
    localizacao: 'Al. das Américas, 120 - Sarandi, PR',
    progressoFisico: 100,
    progressoFinanceiro: 100,
    orcamentoTotal: 48000000,
    custoRealizado: 48000000,
    vendasProgresso: 98,
    custoOrcadoMetroQuadrado: 5500,
    custoRealMetroQuadrado: 5490,
    unidadesTotais: 200,
    unidadesVendidas: 196,
    ticketMedio: 280000,
    dataInicio: '10/01/2024',
    dataEntrega: '01/04/2026',
    status: 'Finalizada',
    estagio: 'Em Repasse',
    receitaTotalContratada: 55000000,
    valorTerreno: 6000000
  },
  {
    id: 'obra-traveza',
    nome: 'Travéza Residence',
    speId: 'spe-traveza',
    speNome: 'Holding / Construtora Just',
    localizacao: 'Zona 03 - Maringá, PR',
    progressoFisico: 100,
    progressoFinanceiro: 100,
    orcamentoTotal: 26050000,
    custoRealizado: 26050000,
    vendasProgresso: 100,
    custoOrcadoMetroQuadrado: 5100,
    custoRealMetroQuadrado: 5150,
    unidadesTotais: 120,
    unidadesVendidas: 120,
    ticketMedio: 250000,
    dataInicio: '15/08/2022',
    dataEntrega: '20/12/2024',
    status: 'Finalizada',
    estagio: 'Em Garantia',
    receitaTotalContratada: 30000000,
    valorTerreno: 3000000
  },
  {
    id: 'obra-aurora',
    nome: 'Residencial Aurora',
    speId: 'spe-aurora',
    speNome: 'Planejado',
    localizacao: 'Maringá, PR',
    progressoFisico: 0,
    progressoFinanceiro: 0,
    orcamentoTotal: 21800000,
    custoRealizado: 0,
    vendasProgresso: 0,
    custoOrcadoMetroQuadrado: 5800,
    custoRealMetroQuadrado: 0,
    unidadesTotais: 90,
    unidadesVendidas: 0,
    ticketMedio: 311000,
    dataInicio: 'A definir',
    dataEntrega: 'A definir',
    status: 'Planejamento',
    estagio: 'Previsto',
    receitaTotalContratada: 28000000,
    valorTerreno: 2800000
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
    speId: 'spe-matera',
    speNome: 'SPE Matera Residence Ltda',
    status: 'Reconciliado'
  },
  {
    id: 'tx-003',
    data: '11/06/2026',
    descricao: 'Aporte mútuo acionistas capital construtor',
    categoria: 'Aporte',
    valor: 4000000,
    speId: 'spe-blank',
    speNome: 'SPE Blank Residence Ltda',
    status: 'Reconciliado'
  },
  {
    id: 'tx-004',
    data: '10/06/2026',
    descricao: 'Medição subempreiteiro estrutura - Matera',
    categoria: 'Fornecedor',
    valor: -890000,
    speId: 'spe-matera',
    speNome: 'SPE Matera Residence Ltda',
    status: 'Reconciliado'
  },
  {
    id: 'tx-005',
    data: '08/06/2026',
    descricao: 'Recolhimento RET mensal consolidado (Lucro Presumido)',
    categoria: 'Impostos',
    valor: -245000,
    speId: 'spe-neo',
    speNome: 'SPE Neo Residence Ltda',
    status: 'Reconciliado'
  },
  {
    id: 'tx-006',
    data: '05/06/2026',
    descricao: 'Liberação de tranche financiamento de apoio à produção',
    categoria: 'Financiamento',
    valor: 3500000,
    speId: 'spe-matera',
    speNome: 'SPE Matera Residence Ltda',
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
    speId: 'spe-neo',
    speNome: 'SPE Neo Residence Ltda',
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
