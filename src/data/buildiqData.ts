// buildiqData.ts
// Real-world, precise engineering-economic database for BuildIQ (JUST Construções)

export interface BuildIQReportColumn {
  key: string;
  label: string;
  align?: 'left' | 'right';
  format?: 'currency' | 'percent' | 'number' | 'text';
}

export interface BuildIQSubReport {
  title: string;
  description: string;
  columns: BuildIQReportColumn[];
  rows: Record<string, any[]>; // keyed by unit or item
}

export const buildiqData = {
  activeDate: "30/04/2026",
  projects: {
    matera: {
      nome: "Residencial Matera",
      periodo: "Abril 2026",
      kpis: {
        totalVendido: 18540000,
        contratos: 24,
        areaTotal: 5840,
        valorMetroQuadrado: 6350,
        estoqueValor: 11580000,
        unidadesEstoque: 16,
        inccAcumulado: 4.85,
        inadimplencia: 2.1,
        custoDireto: 8450000,
        custoIndireto: 1890000,
        folhaMes: 154200,
      }
    },
    blank: {
      nome: "Residencial Blank",
      periodo: "Abril 2026",
      kpis: {
        totalVendido: 12450000,
        contratos: 14,
        areaTotal: 4200,
        valorMetroQuadrado: 6900,
        estoqueValor: 16550000,
        unidadesEstoque: 22,
        inccAcumulado: 4.85,
        inadimplencia: 3.4,
        custoDireto: 5120000,
        custoIndireto: 1420000,
        folhaMes: 135400,
      }
    }
  },
  reports: {
    vendas: {
      title: "Contratos de Venda Ativos",
      description: "Relação detalhada de promissórias de compra e venda firmadas com clientes.",
      columns: [
        { key: 'unidade', label: 'Unidade' },
        { key: 'cliente', label: 'Beneficiário' },
        { key: 'vgv', label: 'VGV Original', format: 'currency' },
        { key: 'recebido', label: 'Total Recebido', format: 'currency' },
        { key: 'saldo', label: 'Saldo Devedor', format: 'currency' },
        { key: 'status', label: 'Status' }
      ],
      rows: {
        matera: [
          { unidade: 'Apto 101', cliente: 'Rogério de Souza Siqueira', vgv: 850000, recebido: 450000, saldo: 400000, status: 'Adimplente' },
          { unidade: 'Apto 102', cliente: 'Ana Beatriz Cavalcanti', vgv: 890000, recebido: 890000, saldo: 0, status: 'Quitado' },
          { unidade: 'Apto 201', cliente: 'Marcelo Vieira Santos', vgv: 920000, recebido: 300000, saldo: 620000, status: 'Adimplente' },
          { unidade: 'Apto 302', cliente: 'Beatriz Maria Pinheiro', vgv: 950000, recebido: 800000, saldo: 150000, status: 'Atraso 15d' }
        ],
        blank: [
          { unidade: 'Salas 10-12', cliente: 'M&A Investimentos S/A', vgv: 2450000, recebido: 1200000, saldo: 1250000, status: 'Adimplente' },
          { unidade: 'Apto 401', cliente: 'Carla Cristina Neves', vgv: 1100000, recebido: 100000, saldo: 1000000, status: 'Adimplente' }
        ]
      }
    },
    estoque: {
      title: "Estoque de Unidades Disponíveis",
      description: "Valor patrimonial das unidades que ainda estão disponíveis na tabela comercial.",
      columns: [
        { key: 'unidade', label: 'Unidade' },
        { key: 'area', label: 'Área Privada (m²)', format: 'number' },
        { key: 'valorM2', label: 'R$/m² Tabela', format: 'currency' },
        { key: 'valorVenda', label: 'Preço de Lista', format: 'currency' },
        { key: 'vagas', label: 'Vagas' }
      ],
      rows: {
        matera: [
          { unidade: 'Apto 401', area: 110, valorM2: 6500, valorVenda: 715000, vagas: 2 },
          { unidade: 'Apto 402', area: 110, valorM2: 6500, valorVenda: 715000, vagas: 2 },
          { unidade: 'Cobertura 501', area: 220, valorM2: 7800, valorVenda: 1716000, vagas: 4 }
        ],
        blank: [
          { unidade: 'Apto 101 B', area: 85, valorM2: 6800, valorVenda: 578000, vagas: 1 },
          { unidade: 'Apto 302 B', area: 95, valorM2: 7100, valorVenda: 674500, vagas: 2 }
        ]
      }
    },
    inccAcum: {
      title: "Reajuste Acumulado INCC",
      description: "Demonstrativo anual da evolução do Índice Nacional de Custo de Construção.",
      columns: [
        { key: 'ano', label: 'Ano de Exercício' },
        { key: 'mes', label: 'Mês de Referência' },
        { key: 'indice', label: 'Variação Mensal', format: 'percent' },
        { key: 'acumulado', label: 'Acumulado Período', format: 'percent' }
      ],
      rows: {
        matera: [
          { ano: '2025', mes: 'Jan-Dez', indice: 4.12, acumulado: 4.12 },
          { ano: '2026', mes: 'Janeiro', indice: 0.45, acumulado: 4.57 },
          { ano: '2026', mes: 'Fevereiro', indice: 0.35, acumulado: 4.92 },
          { ano: '2026', mes: 'Março', indice: 0.58, acumulado: 5.50 },
          { ano: '2026', mes: 'Abril', indice: 0.62, acumulado: 6.12 }
        ],
        blank: [
          { ano: '2025', mes: 'Jan-Dez', indice: 4.12, acumulado: 4.12 },
          { ano: '2026', mes: 'Janeiro', indice: 0.45, acumulado: 4.57 },
          { ano: '2026', mes: 'Fevereiro', indice: 0.35, acumulado: 4.92 }
        ]
      }
    },
    inccVendas: {
      title: "Saldo Devedor Reajustado (INCC)",
      description: "Relatório de correção do saldo de carteira pela evolução do custo de materiais.",
      columns: [
        { key: 'unidade', label: 'Unidade' },
        { key: 'cliente', label: 'Comprador' },
        { key: 'saldoBase', label: 'Saldo de Origem', format: 'currency' },
        { key: 'correcao', label: 'Reajuste INCC', format: 'currency' },
        { key: 'saldoReajustado', label: 'Saldo Atualizado', format: 'currency' }
      ],
      rows: {
        matera: [
          { unidade: 'Apto 101', cliente: 'Rogério de Souza Siqueira', saldoBase: 400000, correcao: 12450, saldoReajustado: 412450 },
          { unidade: 'Apto 201', cliente: 'Marcelo Vieira Santos', saldoBase: 620000, correcao: 19820, saldoReajustado: 639820 }
        ],
        blank: [
          { unidade: 'Salas 10-12', cliente: 'M&A Investimentos S/A', saldoBase: 1250000, correcao: 32400, saldoReajustado: 1282400 }
        ]
      }
    },
    juros: {
      title: "Juros e Financiamentos",
      description: "Juros de obra cobrados do cliente ou alavancagem de repasse habitacional.",
      columns: [
        { key: 'unidade', label: 'Unidade' },
        { key: 'banco', label: 'Financiador' },
        { key: 'taxaJuros', label: 'Taxa Nominal', format: 'percent' },
        { key: 'jurosAcum', label: 'Juros Cobrados', format: 'currency' },
        { key: 'saldoFinanc', label: 'Saldo Financiado', format: 'currency' }
      ],
      rows: {
        matera: [
          { unidade: 'Torre Global', banco: 'Caixa Crehab', taxaJuros: 9.5, jurosAcum: 112450, saldoFinanc: 4500000 },
          { unidade: 'Unidades Livres', banco: 'Banco Bradesco', taxaJuros: 11.2, jurosAcum: 48900, saldoFinanc: 1850000 }
        ],
        blank: [
          { unidade: 'Empreendimento Blank', banco: 'Banco Safra', taxaJuros: 10.8, jurosAcum: 88500, saldoFinanc: 3200000 }
        ]
      }
    },
    inad: {
      title: "Inadimplência e Atrasos",
      description: "Relatório de atrasos de duplicatas ou repasses de contratos de compra.",
      columns: [
        { key: 'unidade', label: 'Unidade' },
        { key: 'cliente', label: 'Cliente' },
        { key: 'parcelasAtraso', label: 'Meses Atraso' },
        { key: 'valorVencido', label: 'Valor Vencido', format: 'currency' },
        { key: 'multaJuros', label: 'Encargos de Mora', format: 'currency' }
      ],
      rows: {
        matera: [
          { unidade: 'Apto 302', cliente: 'Beatriz Maria Pinheiro', parcelasAtraso: '1 mês', valorVencido: 45000, multaJuros: 1200 },
          { unidade: 'Apto 104', cliente: 'Julio Cesar Guedes', parcelasAtraso: '2 meses', valorVencido: 38000, multaJuros: 2150 }
        ],
        blank: [
          { unidade: 'Apto 202 B', cliente: 'Felipe Augusto Antunes', parcelasAtraso: '1 mês', valorVencido: 22000, multaJuros: 650 }
        ]
      }
    },
    custoDireto: {
      title: "Custos Diretos de Engenharia",
      description: "Investimento físico real em materiais, alvenaria, fundação e canteiro.",
      columns: [
        { key: 'etapa', label: 'Fase de Obra' },
        { key: 'previsto', label: 'Custo Planejado', format: 'currency' },
        { key: 'realizado', label: 'Custo Realizado', format: 'currency' },
        { key: 'desvio', label: 'Saldo Desvio', format: 'currency' },
        { key: 'poc', label: 'Peso PoC', format: 'percent' }
      ],
      rows: {
        matera: [
          { etapa: 'Fundações e Contorno', previsto: 1500000, realizado: 1540000, desvio: -40000, poc: 100 },
          { etapa: 'Estrutura Concreta', previsto: 3400000, realizado: 3450000, desvio: -50000, poc: 94 },
          { etapa: 'Alvenaria e Vedação', previsto: 1800000, realizado: 1200000, desvio: 600000, poc: 66 },
          { etapa: 'Acabamentos Nobres', previsto: 2500000, realizado: 450000, desvio: 2050000, poc: 18 }
        ],
        blank: [
          { etapa: 'Fundações e Terreno', previsto: 1200000, realizado: 1180000, desvio: 20000, poc: 100 },
          { etapa: 'Estrutura Pilotis', previsto: 2800000, realizado: 2600000, desvio: 200000, poc: 85 }
        ]
      }
    },
    custoIndireto: {
      title: "Custos Indiretos (Suporte/Segurança)",
      description: "Despesas de suporte à obra, como taxas de prefeitura, seguros, contabilidade e segurança.",
      columns: [
        { key: 'servico', label: 'Grupo de Custo' },
        { key: 'planejado', label: 'Projetado', format: 'currency' },
        { key: 'executado', label: 'Pago Acumulado', format: 'currency' },
        { key: 'orgao', label: 'Órgão / Fornecedor' }
      ],
      rows: {
        matera: [
          { servico: 'Projetos Arquitetônicos', planejado: 350000, executado: 340000, orgao: 'Traveza Arquitetura' },
          { servico: 'Seguros e Alvarás Municipais', planejado: 180000, executado: 175000, orgao: 'Prefeitura Municipal' },
          { servico: 'Comissões de Corretores (Imobiliária)', planejado: 1100000, executado: 850000, orgao: 'RE/MAX Just' }
        ],
        blank: [
          { servico: 'Projetos e Modelagem BIM', planejado: 280000, executado: 280000, orgao: 'Traveza Arquitetura' },
          { servico: 'Taxas de Licenciamento Ambiental', planejado: 120000, executado: 112000, orgao: 'IAP PR' }
        ]
      }
    },
    ipc: {
      title: "Índice de Performance de Custo (IPC)",
      description: "Medição de eficiência de custos (Custo Planejado / Custo Realizado). Valores ≥ 1.00 indicam custos sob controle ou abaixo do teto.",
      columns: [
        { key: 'etapa', label: 'Centro de Custo / Etapa' },
        { key: 'orcado', label: 'Orçado Original', format: 'currency' },
        { key: 'realizado', label: 'Custo Realizado', format: 'currency' },
        { key: 'indice', label: 'Índice de Custo (IPC)', format: 'number' },
        { key: 'status', label: 'Desempenho' }
      ],
      rows: {
        matera: [
          { etapa: 'Fundações & Contorno', orcado: 1500000, realizado: 1540000, indice: 0.97, status: 'Estouro Leve' },
          { etapa: 'Estrutura Concreto Armado', orcado: 3400000, realizado: 3450000, indice: 0.99, status: 'Dentro da Tolerância' },
          { etapa: 'Alvenaria de Vedação', orcado: 1800000, realizado: 1200000, indice: 1.50, status: 'Economia Expressiva' },
          { etapa: 'Instalações Hidráulicas/Elétricas', orcado: 1200000, realizado: 1215000, indice: 0.99, status: 'No Orçamento' },
          { etapa: 'Acabamentos e Revestimentos', orcado: 2500000, realizado: 450000, indice: 5.56, status: 'Fase Inicial (Não aferido)' }
        ],
        blank: [
          { etapa: 'Fundações e Terreno', orcado: 1200000, realizado: 1180000, indice: 1.02, status: 'Economia' },
          { etapa: 'Estrutura de Pilotis', orcado: 2800000, realizado: 2600000, indice: 1.08, status: 'Abaixo do Teto' }
        ]
      }
    },
    ipp: {
      title: "Índice de Performance de Prazo (IPP)",
      description: "Acompanhamento do cronograma (Prazo Realizado / Prazo Planejado). Valores ≥ 1.00 representam obras no prazo ou adiantadas.",
      columns: [
        { key: 'etapa', label: 'Etapa Física' },
        { key: 'progPrevisto', label: 'Progresso Planejado', format: 'percent' },
        { key: 'progRealizado', label: 'Progresso Realizado', format: 'percent' },
        { key: 'indice', label: 'Índice de Prazo (IPP)', format: 'number' },
        { key: 'status', label: 'Cronograma' }
      ],
      rows: {
        matera: [
          { etapa: 'Fundações & Terraplenagem', progPrevisto: 100, progRealizado: 100, indice: 1.00, status: 'Concluído' },
          { etapa: 'Estrutura e Lajes', progPrevisto: 95, progRealizado: 94, indice: 0.99, status: 'No Prazo' },
          { etapa: 'Alvenaria e Enchimentos', progPrevisto: 75, progRealizado: 66, indice: 0.88, status: 'Atrasado Secundário' },
          { etapa: 'Instalações Centrais', progPrevisto: 50, progRealizado: 42, indice: 0.84, status: 'Atraso em Fornecimento' },
          { etapa: 'Acabamentos Internos', progPrevisto: 25, progRealizado: 18, indice: 0.72, status: 'Atraso Crítico' }
        ],
        blank: [
          { etapa: 'Fundações e Escavação', progPrevisto: 100, progRealizado: 100, indice: 1.00, status: 'Concluído' },
          { etapa: 'Estrutura de Lajes Básicas', progPrevisto: 80, progRealizado: 82, indice: 1.03, status: 'Adiantado' }
        ]
      }
    },
    folha: {
      title: "Relação da Folha de Pagamento",
      description: "Investimento mensal em equipe técnica de canteiro de obras e engenheiros residentes.",
      columns: [
        { key: 'cargo', label: 'Função Operativa' },
        { key: 'quantidade', label: 'Qtd. Alocados', format: 'number' },
        { key: 'salarioBase', label: 'Salário Médio', format: 'currency' },
        { key: 'encargos', label: 'Encargos CLT/Seg', format: 'currency' },
        { key: 'totalEncargo', label: 'Custo Mensal Consolidado', format: 'currency' }
      ],
      rows: {
        matera: [
          { cargo: 'Engenheiro Residente', quantidade: 1, salarioBase: 12500, encargos: 8500, totalEncargo: 21000 },
          { cargo: 'Mestre de Obras Júnior', quantidade: 1, salarioBase: 5800, encargos: 4100, totalEncargo: 9900 },
          { cargo: 'Pedreiros e Carpinteiros (Empreiteira)', quantidade: 24, salarioBase: 2800, encargos: 1950, totalEncargo: 114000 },
          { cargo: 'Serventes de Ajuda Geral', quantidade: 6, salarioBase: 1800, encargos: 1200, totalEncargo: 18000 }
        ],
        blank: [
          { cargo: 'Engenheiro Residente', quantidade: 1, salarioBase: 11500, encargos: 7500, totalEncargo: 19000 },
          { cargo: 'Mestre de Obras', quantidade: 1, salarioBase: 5800, encargos: 4100, totalEncargo: 9900 },
          { cargo: 'Pedreiros Convencionais', quantidade: 18, salarioBase: 2800, encargos: 1950, totalEncargo: 85500 },
          { cargo: 'Estagiário de Engenharia Civil', quantidade: 2, salarioBase: 1600, encargos: 450, totalEncargo: 4100 }
        ]
      }
    }
  }
};

export interface ViabilidadeDado {
  item: string;
  isHeader?: boolean;
  ver0: number;
  out25: number;
  variacao: number;
  obs?: string;
  indent?: boolean;
  isTotal?: boolean;
  isPercentage?: boolean;
}

export const viabilidadeProjetos: Record<'matera' | 'blank', ViabilidadeDado[]> = {
  matera: [
    { item: "Valor Global de Venda (VGV)", isHeader: true, ver0: 63629793, out25: 65808654.58, variacao: 2178861.58, obs: "Reajuste de preços de tabela de lançamentos" },
    { item: "Impostos sobre Receita", isHeader: true, ver0: 2545191.72, out25: 2632346.18, variacao: -87154.46, obs: "Indexado a 4.00% do VGV comercializado" },
    { item: "Cofins (1.71%)", indent: true, ver0: 1088069.46, out25: 1125327.99, variacao: -37258.53 },
    { item: "Pis (0.37%)", indent: true, ver0: 235430.23, out25: 243492.02, variacao: -8061.79 },
    { item: "Imposto de Renda (1.26%)", indent: true, ver0: 801735.39, out25: 829189.05, variacao: -27453.66 },
    { item: "Contribuição Social (0.66%)", indent: true, ver0: 419956.63, out25: 434337.12, variacao: -14380.49 },
    { item: "Despesas com Vendas", isHeader: true, ver0: 5335936.55, out25: 5634201.99, variacao: -298265.44, obs: "Aumento nos custos de captação e plantão" },
    { item: "Comissão s/ vendas (5.00%)", indent: true, ver0: 3181489.65, out25: 2846338.78, variacao: 335150.87, obs: "Redução de comissões por carteiras diretas (+)" },
    { item: "Propaganda e publicidade (1.00%)", indent: true, ver0: 636297.93, out25: 636297.93, variacao: 0 },
    { item: "Apartamento Decorado e Central Vendas", indent: true, ver0: 800000, out25: 1422522.01, variacao: -622522.01, obs: "Estouro decorrente de reformas contratuais (-)" },
    { item: "Central de Relacionamentos", indent: true, ver0: 400000, out25: 400000, variacao: 0 },
    { item: "Taxa de Administração de Venda (0.50%)", indent: true, ver0: 318148.97, out25: 329043.27, variacao: -10894.30 },
    { item: "Despesas Operacionais", isHeader: true, ver0: 39385145.72, out25: 39837952.75, variacao: -452807.03, obs: "Aumento do custo físico de construção" },
    { item: "Orçamento Custo Direto Construção", indent: true, ver0: 31795868, out25: 32118887.37, variacao: -323019.37, obs: "Reflexo da variação do INCC e canteiro (-)" },
    { item: "Orçamento Custos Indiretos Construção", indent: true, ver0: 2617897.52, out25: 2636980.08, variacao: -19082.56 },
    { item: "Orçamento, Estudo de Viabilidade", indent: true, ver0: 22000, out25: 22000, variacao: 0 },
    { item: "Taxa de administração construtora (15%)", indent: true, ver0: 4769380.20, out25: 4817833.11, variacao: -48452.91 },
    { item: "Taxa de administração Decorado (10%)", indent: true, ver0: 180000, out25: 242252.20, variacao: -62252.20 },
    { item: "Terrenos", isHeader: true, ver0: 2000000, out25: 2000000, variacao: 0, obs: "Aquisição do lote original quitada em cota única" },
    { item: "Lote 15 da Quadra 54 - Zona 03 (600 m2)", indent: true, ver0: 2000000, out25: 2000000, variacao: 0 },
    { item: "Despesas Financeiras", isHeader: true, ver0: 4792913.10, out25: 10762191.79, variacao: -5969278.69, obs: "Estouro gravíssimo! Juros de obra e alavancagem" },
    { item: "Juros do Financiamento Imobiliário", indent: true, ver0: 4764113.10, out25: 10314723.23, variacao: -5550610.13, obs: "Bradesco III Juros e atraso no repasse habitacional" },
    { item: "Serviço de Assessoria Ref. Operação de Crédito", indent: true, ver0: 0, out25: 418668.56, variacao: -418668.56, obs: "Não provisionado em orçamento preliminar (-)" },
    { item: "Despesas Bancárias", indent: true, ver0: 28800, out25: 28800, variacao: 0 },
    { item: "CUSTO TOTAL (DIRETOS + INDIRETOS)", isTotal: true, ver0: 54059187.09, out25: 60866692.72, variacao: -6807505.63, obs: "Acumulado das saídas e custos operacionais" },
    { item: "RESULTADO LÍQUIDO", isHeader: true, isTotal: true, ver0: 9570605.92, out25: 4941961.86, variacao: -4628644.06, obs: "Lucro líquido do projeto reduzido à metade!" },
    { item: "RESULTADO LÍQUIDO S/ VGV (%)", isHeader: true, isTotal: true, isPercentage: true, ver0: 15.04, out25: 7.51, variacao: -7.53, obs: "Margem líquida caiu em 7.53 pontos percentuais" }
  ],
  blank: [
    { item: "Valor Global de Venda (VGV)", isHeader: true, ver0: 38450000, out25: 39120000, variacao: 670000, obs: "Reajuste pontual na tabela" },
    { item: "Impostos sobre Receita", isHeader: true, ver0: 1538000, out25: 1564800, variacao: -26800 },
    { item: "Despesas com Vendas", isHeader: true, ver0: 3225965, out25: 3345000, variacao: -119035 },
    { item: "Despesas Operacionais", isHeader: true, ver0: 24350000, out25: 24780000, variacao: -430000 },
    { item: "Terrenos", isHeader: true, ver0: 1800000, out25: 1800000, variacao: 0 },
    { item: "Despesas Financeiras", isHeader: true, ver0: 2600000, out25: 3850000, variacao: -1250000, obs: "Altos juros de captação" },
    { item: "CUSTO TOTAL (DIRETOS + INDIRETOS)", isTotal: true, ver0: 33513965, out25: 35339800, variacao: -1825835 },
    { item: "RESULTADO LÍQUIDO", isHeader: true, isTotal: true, ver0: 4936035, out25: 3780200, variacao: -1155835 },
    { item: "RESULTADO LÍQUIDO S/ VGV (%)", isHeader: true, isTotal: true, isPercentage: true, ver0: 12.84, out25: 9.66, variacao: -3.18 }
  ]
};
