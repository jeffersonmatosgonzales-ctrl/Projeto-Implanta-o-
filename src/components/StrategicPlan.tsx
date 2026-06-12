import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Coins, 
  Sliders, 
  Calendar, 
  DollarSign, 
  Database, 
  RefreshCw, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  HelpCircle, 
  TrendingUp, 
  Briefcase, 
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Info,
  Scale
} from 'lucide-react';

interface StrategicFields {
  visao: string;
  vgv_total: string;
  margem_alvo: string;
  roe_alvo: string;
  cagr: string;
  pracas: string;
  segmentos: string;
  posicionamento: string;
  concorrencia: string;
  land_estoque: string;
  land_aquisicoes: string;
  land_capital: string;
  land_permuta: string;
  vso: string;
  precos: string;
  indice_venda: string;
  canais: string;
  custo_direto: string;
  custo_indice: string;
  custo_direto_obs: string;
  ind_comissao: string;
  ind_juros_proprio: string;
  ind_juros_terceiros: string;
  ind_marketing: string;
  ind_admin: string;
  ind_tributos: string;
  ind_obs: string;
  estrutura_capital: string;
  funding: string;
  capital_giro: string;
  distribuicao: string;
  incc: string;
  juros_ref: string;
  demanda: string;
  cenarios: string;
  rec_entrada: string;
  rec_parcelas: string;
  rec_financiamento: string;
  rec_indice: string;
  des_curva: string;
  des_conc: string;
  des_obs: string;
  just_adm: string;
  just_taxa_pct: string;
  just_jfix_rec: string;
  just_jfix_custo: string;
  just_ot_rec: string;
  just_ot_custo: string;
  just_oe_rec: string;
  just_oe_custo: string;
  just_emp_saldo: string;
  just_emp_taxa: string;
  just_emp_amort: string;
  just_distrib_pct: string;
  just_aporte_val: string;
  just_aporte_gatilho: string;
  just_aporte_obs: string;
}

interface Lançamento {
  id: string;
  ano: string;
  emp: string;
  praca: string;
  seg: string;
  vgv: string;
  mes: string;
  prazo: string;
}

interface ObraAndamento {
  id: string;
  nome: string;
  custo_tot: string;
  realizado: string;
  estoque: string;
  ano: string;
  mes: string;
  prazo: string;
}

interface Kpi {
  id: string;
  nome: string;
  y26: string;
  y27: string;
  y28: string;
  y29: string;
  y30: string;
}

const DEFAULT_FIELDS: StrategicFields = {
  visao: "Ser referência em incorporação de médio padrão em Maringá e região, crescendo VGV com margem e disciplina de caixa.",
  vgv_total: "250000000", margem_alvo: "22", roe_alvo: "18", cagr: "15",
  pracas: "Maringá, Sarandi e Paiçandu (PR)", segmentos: "Médio e médio-alto padrão",
  posicionamento: "Boa localização, projeto eficiente e entrega no prazo.",
  concorrencia: "Concorrência local fragmentada; demanda firme no médio padrão.",
  land_estoque: "3 terrenos (Maringá centro, Zona 7 e Sarandi)", land_aquisicoes: "2 terrenos/ano, priorizando permuta",
  land_capital: "18000000", land_permuta: "Permuta física de 15% a 20%",
  vso: "12", precos: "Tabela reajustada conforme evolução física da obra", indice_venda: "INCC",
  canais: "Imobiliárias parceiras + equipe própria",
  custo_direto: "55", custo_indice: "INCC", custo_direto_obs: "Contingência de 3%; performance esperada IPC ~1,0.",
  ind_comissao: "4", ind_juros_proprio: "3", ind_juros_terceiros: "4", ind_marketing: "3", ind_admin: "5", ind_tributos: "4",
  ind_obs: "Percentuais expressos como % do VGV no horizonte do projeto. Juros próprio = custo de oportunidade; terceiros = SFH/empréstimos.",
  estrutura_capital: "60% próprio / 40% terceiros", funding: "SFH (plano empresário) + capital próprio por SPE",
  capital_giro: "Aporte por SPE conforme cronograma físico", distribuicao: "Distribuição após quitação do financiamento da obra",
  incc: "6", juros_ref: "11", demanda: "Base",
  cenarios: "Base: INCC 6%, VSO 12%. Otimista: VSO 15%. Pessimista: INCC 9%, VSO 9%.", rec_entrada: "20", rec_parcelas: "30", rec_financiamento: "50", rec_indice: "INCC", des_curva: "Curva S (física)", des_conc: "Maior no miolo", des_obs: "Recebíveis: entrada no ato, parcelas mensais corrigidas por INCC na obra e repasse bancário na entrega. Desembolso pela curva física da obra (medição).",
  just_adm: "2400000", just_taxa_pct: "8",
  just_jfix_rec: "1800000", just_jfix_custo: "1300000",
  just_ot_rec: "2500000", just_ot_custo: "1900000", just_oe_rec: "1200000", just_oe_custo: "800000",
  just_emp_saldo: "8000000", just_emp_taxa: "14", just_emp_amort: "2000000",
  just_distrib_pct: "50", just_aporte_val: "3000000", just_aporte_gatilho: "Caixa projetado negativo na SPE",
  just_aporte_obs: "O plano provisiona aportes/AFAC antes do fluxo, para o caixa das SPEs nunca faltar até a entrega. Distribuição de lucro só após a quitação do financiamento da obra."
};

const DEFAULT_PIPE: Lançamento[] = [
  { id: 'p1', ano: "2026", emp: "Matera Residence", praca: "Maringá", seg: "Médio", vgv: "28000000", mes: "Mar", prazo: "30" },
  { id: 'p2', ano: "2026", emp: "Residencial Aurora", praca: "Sarandi", seg: "Médio", vgv: "22000000", mes: "Set", prazo: "28" },
  { id: 'p3', ano: "2027", emp: "Just Park", praca: "Maringá", seg: "Médio-alto", vgv: "35000000", mes: "Abr", prazo: "32" },
  { id: 'p4', ano: "2027", emp: "Residencial Horizonte", praca: "Maringá", seg: "Médio", vgv: "30000000", mes: "Out", prazo: "30" },
  { id: 'p5', ano: "2028", emp: "Just Office", praca: "Maringá", seg: "Médio-alto", vgv: "40000000", mes: "Mar", prazo: "34" }
];

const DEFAULT_ANDAMENTO: ObraAndamento[] = [
  { id: 'a1', nome: "Matera Residence", custo_tot: "22263319", realizado: "8541428", estoque: "9500000", ano: "2026", mes: "Jun", prazo: "18" },
  { id: 'a2', nome: "Blank", custo_tot: "15000000", realizado: "3000000", estoque: "7000000", ano: "2026", mes: "Jun", prazo: "24" }
];

const DEFAULT_KPIS: Kpi[] = [
  { id: 'k1', nome: "VGV lançado (R$)", y26: "50.000.000", y27: "65.000.000", y28: "40.000.000", y29: "45.000.000", y30: "50.000.000" },
  { id: 'k2', nome: "Margem (%)", y26: "22", y27: "22", y28: "23", y29: "23", y30: "24" },
  { id: 'k3', nome: "ROE (%)", y26: "16", y27: "17", y28: "18", y29: "18", y30: "19" },
  { id: 'k4', nome: "Geração de caixa (R$)", y26: "6.000.000", y27: "9.000.000", y28: "7.000.000", y29: "8.000.000", y30: "9.000.000" }
];

const MESI: Record<string, number> = {
  jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5, jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11
};
const MESN = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default function StrategicPlan() {
  const [activeSubTab, setActiveSubTab] = useState<'meta-mercado' | 'lançamentos' | 'custo-comercial' | 'financas' | 'just-budget' | 'simulador'>('simulador');
  const [fields, setFields] = useState<StrategicFields>(DEFAULT_FIELDS);
  const [pipe, setPipe] = useState<Lançamento[]>(DEFAULT_PIPE);
  const [andamento, setAndamento] = useState<ObraAndamento[]>(DEFAULT_ANDAMENTO);
  const [kpis, setKpis] = useState<Kpi[]>(DEFAULT_KPIS);
  const [saveStatus, setSaveStatus] = useState('Salvar plano');

  // Load from LocalStorage if exists
  useEffect(() => {
    const saved = localStorage.getItem('just_plano_estrategico_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.fields) setFields(parsed.fields);
        if (parsed.pipe) setPipe(parsed.pipe);
        if (parsed.andamento) setAndamento(parsed.andamento);
        if (parsed.kpis) setKpis(parsed.kpis);
      } catch (e) {
        console.error('Error loading strategic plan from LocalStorage', e);
      }
    }
  }, []);

  const handleSave = () => {
    const data = { fields, pipe, andamento, kpis };
    localStorage.setItem('just_plano_estrategico_v1', JSON.stringify(data));
    setSaveStatus('Plano Salvo!');
    setTimeout(() => setSaveStatus('Salvar plano'), 2000);
  };

  const handleReset = () => {
    if (confirm('Deseja redefinir todo o plano estratégico para os parâmetros padrão?')) {
      setFields(DEFAULT_FIELDS);
      setPipe(DEFAULT_PIPE);
      setAndamento(DEFAULT_ANDAMENTO);
      setKpis(DEFAULT_KPIS);
      localStorage.removeItem('just_plano_estrategico_v1');
    }
  };

  const handleExportJSON = () => {
    const data = { fields, pipe, andamento, kpis };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Just_Plano_Estrategico_F5.json';
    a.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.fields) setFields(parsed.fields);
        if (parsed.pipe) setPipe(parsed.pipe);
        if (parsed.andamento) setAndamento(parsed.andamento);
        if (parsed.kpis) setKpis(parsed.kpis);
        alert('Plano estratégico importado com sucesso!');
      } catch (x) {
        alert('Arquivo JSON inválido.');
      }
    };
    reader.readAsText(file);
  };

  // Helper numerical parsers
  const parseNum = (v: string | number) => {
    if (!v) return 0;
    return Number(String(v).replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')) || 0;
  };

  const formatReais = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (v: string | number) => {
    return `${parseNum(v)}%`;
  };

  // 1. Math computation of launched SPEs: total launches budget & duration
  const getObrasProjecao = () => {
    const inds = ["ind_comissao", "ind_juros_proprio", "ind_juros_terceiros", "ind_marketing", "ind_admin", "ind_tributos"];
    const indirectPct = inds.reduce((acc, f) => acc + parseNum(fields[f as keyof StrategicFields]), 0);
    const custoPct = parseNum(fields.custo_direto) + indirectPct;

    let totalCustoObra = 0;
    const starts: number[] = [];
    const ends: number[] = [];

    pipe.forEach(item => {
      const vgv = parseNum(item.vgv);
      const ano = parseInt(item.ano, 10);
      const mt = item.mes.trim().toLowerCase().slice(0, 3);
      const prazo = Math.round(parseNum(item.prazo)) || 12;
      if (!ano || !vgv) return;

      totalCustoObra += (vgv * custoPct) / 100;
      const m = MESI[mt] !== undefined ? MESI[mt] : 0;
      starts.push(ano * 12 + m);
      ends.push(ano * 12 + m + prazo);
    });

    andamento.forEach(item => {
      const ct = parseNum(item.custo_tot);
      const rz = parseNum(item.realizado);
      const ano = parseInt(item.ano, 10);
      const mt = item.mes.trim().toLowerCase().slice(0, 3);
      const prazo = Math.round(parseNum(item.prazo)) || 12;
      if (!ano) return;

      totalCustoObra += Math.max(0, ct - rz);
      const m = MESI[mt] !== undefined ? MESI[mt] : 0;
      starts.push(ano * 12 + m);
      ends.push(ano * 12 + m + prazo);
    });

    const totalAnos = starts.length ? Math.max(1, Math.ceil((Math.max(...ends) - Math.min(...starts)) / 12)) : 5;
    return { custo: totalCustoObra, anos: totalAnos };
  };

  // 2. Construtora Just budget projection
  const { custo: projCustoObras, anos: projHorizonteAnos } = getObrasProjecao();
  const taxaPct = parseNum(fields.just_taxa_pct) / 100;

  const justRevenueTaxaAdm = projCustoObras * taxaPct;
  const justRevenueJustfix = parseNum(fields.just_jfix_rec) * projHorizonteAnos;
  const justRevenueObrasTerceiros = parseNum(fields.just_ot_rec) * projHorizonteAnos;
  const justRevenueObrasEntregues = parseNum(fields.just_oe_rec) * projHorizonteAnos;

  const justOutflowADM = parseNum(fields.just_adm) * projHorizonteAnos;
  const justOutflowJustfix = parseNum(fields.just_jfix_custo) * projHorizonteAnos;
  const justOutflowObrasTerceiros = parseNum(fields.just_ot_custo) * projHorizonteAnos;
  const justOutflowObrasEntregues = parseNum(fields.just_oe_custo) * projHorizonteAnos;
  const justOutflowJurosDivida = (parseNum(fields.just_emp_saldo) * parseNum(fields.just_emp_taxa)) / 100 * projHorizonteAnos;

  const totalJustRevenues = justRevenueTaxaAdm + justRevenueJustfix + justRevenueObrasTerceiros + justRevenueObrasEntregues;
  const totalJustOutflows = justOutflowADM + justOutflowJustfix + justOutflowObrasTerceiros + justOutflowObrasEntregues + justOutflowJurosDivida;
  const netJustContribution = totalJustRevenues - totalJustOutflows;

  // 3. Simular launches scenario grouped by Year
  const getNewLaunchesByYear = () => {
    const inds = ["ind_comissao", "ind_juros_proprio", "ind_juros_terceiros", "ind_marketing", "ind_admin", "ind_tributos"];
    const indTot = inds.reduce((acc, f) => acc + parseNum(fields[f as keyof StrategicFields]), 0);
    const custoPct = parseNum(fields.custo_direto) + indTot;

    const byAno: Record<string, number> = {};
    pipe.forEach(item => {
      const ano = item.ano.trim() || 'Sem Ano';
      const vgv = parseNum(item.vgv);
      byAno[ano] = (byAno[ano] || 0) + vgv;
    });

    return Object.keys(byAno).sort().map(ano => {
      const vgv = byAno[ano];
      const custo = (vgv * custoPct) / 100;
      const resultado = vgv - custo;
      const margem = vgv > 0 ? (resultado / vgv) * 100 : 0;
      return { ano, vgv, custo, resultado, margem };
    });
  };

  const simulatedYears = getNewLaunchesByYear();
  const simTotalVgv = simulatedYears.reduce((acc, y) => acc + y.vgv, 0);
  const simTotalCustos = simulatedYears.reduce((acc, y) => acc + y.custo, 0);
  const simTotalRes = simulatedYears.reduce((acc, y) => acc + y.resultado, 0);
  const simAvgMargem = simTotalVgv > 0 ? (simTotalRes / simTotalVgv) * 100 : 0;

  // 4. GENERATE MONTH-BY-MONTH STREAM CASH FLOW
  const getProjectedCashFlowResult = () => {
    const inds = ["ind_comissao", "ind_juros_proprio", "ind_juros_terceiros", "ind_marketing", "ind_admin", "ind_tributos"];
    const indTotPct = inds.reduce((acc, f) => acc + parseNum(fields[f as keyof StrategicFields]), 0);
    const totalCustoPct = parseNum(fields.custo_direto) + indTotPct;

    const entradaPct = parseNum(fields.rec_entrada) / 100;
    const parcelasPct = parseNum(fields.rec_parcelas) / 100;
    const financiamentoPct = parseNum(fields.rec_financiamento) / 100;

    const pipelineList: { idx: number; vgv: number; prazo: number; custo: number }[] = [];
    pipe.forEach(item => {
      const vgv = parseNum(item.vgv);
      const ano = parseInt(item.ano, 10);
      const mt = item.mes.trim().toLowerCase().slice(0, 3);
      const prazo = Math.round(parseNum(item.prazo)) || 12;
      if (!ano || !vgv) return;

      const m = MESI[mt] !== undefined ? MESI[mt] : 0;
      pipelineList.push({
        idx: ano * 12 + m,
        vgv: vgv,
        prazo: prazo,
        custo: (vgv * totalCustoPct) / 100
      });
    });

    const activeList: { idx: number; custoExec: number; estoque: number; prazo: number }[] = [];
    andamento.forEach(item => {
      const ct = parseNum(item.custo_tot);
      const rz = parseNum(item.realizado);
      const est = parseNum(item.estoque);
      const ano = parseInt(item.ano, 10);
      const mt = item.mes.trim().toLowerCase().slice(0, 3);
      const prazo = Math.round(parseNum(item.prazo)) || 12;
      if (!ano) return;

      const m = MESI[mt] !== undefined ? MESI[mt] : 0;
      activeList.push({
        idx: ano * 12 + m,
        custoExec: Math.max(0, ct - rz),
        estoque: est,
        prazo: prazo
      });
    });

    if (pipelineList.length === 0 && activeList.length === 0) {
      return null;
    }

    const allStarts = pipelineList.map(r => r.idx).concat(activeList.map(r => r.idx));
    const allEnds = pipelineList.map(r => r.idx + r.prazo).concat(activeList.map(r => r.idx + r.prazo));
    const minIdx = Math.min(...allStarts);
    const maxIdx = Math.max(...allEnds);
    const n = maxIdx - minIdx + 1;

    // Output Arrays
    const arrRecVendas = new Array(n).fill(0);
    const arrCustoObra = new Array(n).fill(0);
    const arrTaxaAdm = new Array(n).fill(0);
    const arrJustfixReceita = new Array(n).fill(0);
    const arrAporte = new Array(n).fill(0);
    const arrADM = new Array(n).fill(0);
    const arrJustfixCusto = new Array(n).fill(0);
    const arrJuros = new Array(n).fill(0);
    const arrAmortizacao = new Array(n).fill(0);
    const arrObrasTercRec = new Array(n).fill(0);
    const arrObrasTercCusto = new Array(n).fill(0);
    const arrObrasEntrRec = new Array(n).fill(0);
    const arrObrasEntrCusto = new Array(n).fill(0);

    // Distribute pipeline launches month-by-month
    pipelineList.forEach(r => {
      const relativeStart = r.idx - minIdx;
      // Entrada
      if (relativeStart < n) arrRecVendas[relativeStart] += r.vgv * entradaPct;
      // Monthly installments & physical build expenses
      for (let k = 0; k < r.prazo; k++) {
        if (relativeStart + k < n) {
          arrRecVendas[relativeStart + k] += (r.vgv * parcelasPct) / r.prazo;
          arrCustoObra[relativeStart + k] += r.custo / r.prazo;
        }
      }
      // Funding repasse at entrega
      if (relativeStart + r.prazo < n) {
        arrRecVendas[relativeStart + r.prazo] += r.vgv * financiamentoPct;
      }
    });

    // Distribute active works month-by-month
    activeList.forEach(r => {
      const relativeStart = r.idx - minIdx;
      // Entrada simulated on launch remaining
      if (relativeStart < n) arrRecVendas[relativeStart] += r.estoque * entradaPct;
      // Installments & costs left to execute
      for (let k = 0; k < r.prazo; k++) {
        if (relativeStart + k < n) {
          arrRecVendas[relativeStart + k] += (r.estoque * parcelasPct) / r.prazo;
          arrCustoObra[relativeStart + k] += r.custoExec / r.prazo;
        }
      }
      // Repasse at entrega
      if (relativeStart + r.prazo < n) {
        arrRecVendas[relativeStart + r.prazo] += r.estoque * financiamentoPct;
      }
    });

    // Calculate dynamic Taxa de Administração based on monthly active build costs
    const constTaxaPct = parseNum(fields.just_taxa_pct) / 100;
    for (let i = 0; i < n; i++) {
      arrTaxaAdm[i] = arrCustoObra[i] * constTaxaPct;
    }

    // Distribute general holding overhead & debtor costs
    const monthlyJustfixRec = parseNum(fields.just_jfix_rec) / 12;
    const monthlyJustfixCusto = parseNum(fields.just_jfix_custo) / 12;
    const monthlyADM = parseNum(fields.just_adm) / 12;
    const monthlyOtRec = parseNum(fields.just_ot_rec) / 12;
    const monthlyOtCusto = parseNum(fields.just_ot_custo) / 12;
    const monthlyOeRec = parseNum(fields.just_oe_rec) / 12;
    const monthlyOeCusto = parseNum(fields.just_oe_custo) / 12;
    const monthlyJuros = (parseNum(fields.just_emp_saldo) * parseNum(fields.just_emp_taxa)) / 100 / 12;
    const monthlyAmort = parseNum(fields.just_emp_amort) / 12;

    for (let i = 0; i < n; i++) {
      arrJustfixReceita[i] = monthlyJustfixRec;
      arrJustfixCusto[i] = monthlyJustfixCusto;
      arrADM[i] = monthlyADM;
      arrObrasTercRec[i] = monthlyOtRec;
      arrObrasTercCusto[i] = monthlyOtCusto;
      arrObrasEntrRec[i] = monthlyOeRec;
      arrObrasEntrCusto[i] = monthlyOeCusto;
      arrJuros[i] = monthlyJuros;
      arrAmortizacao[i] = monthlyAmort;
    }

    // Aporte holding added to month 0
    arrAporte[0] = parseNum(fields.just_aporte_val);

    // Sum everything up (Intercompany Taxa de adm / Justfix sells are eliminated internally from group consolidated cash but added as source for holding Just)
    const arrRecebimentos = new Array(n).fill(0);
    const arrDesembolsos = new Array(n).fill(0);
    const arrNetMensal = new Array(n).fill(0);
    const arrCaixaAcumulado = new Array(n).fill(0);

    let runningAccum = 0;
    let minAccum = 0;
    let minAccumMonthIndex = 0;

    for (let i = 0; i < n; i++) {
      const rec = arrRecVendas[i] + arrTaxaAdm[i] + arrJustfixReceita[i] + arrObrasTercRec[i] + arrObrasEntrRec[i] + arrAporte[i];
      // Note: Intercompany transfers (taxa de adm and granito paid by SPE for Construtora) are emutted inside the overall SPE active build costs
      // In the consolidated balance, these are neutral. But for cash, SPE pays, Construtora receives.
      const des = arrCustoObra[i] + arrADM[i] + arrJustfixCusto[i] + arrObrasTercCusto[i] + arrObrasEntrCusto[i] + arrJuros[i] + arrAmortizacao[i];
      
      const net = rec - des;
      runningAccum += net;

      arrRecebimentos[i] = rec;
      arrDesembolsos[i] = des;
      arrNetMensal[i] = net;
      arrCaixaAcumulado[i] = runningAccum;

      if (runningAccum < minAccum) {
        minAccum = runningAccum;
        minAccumMonthIndex = i;
      }
    }

    // Break even point (when accum cash returns above 0 after reaching minimum)
    let breakEvenIndex = -1;
    for (let i = minAccumMonthIndex; i < n; i++) {
      if (arrCaixaAcumulado[i] >= 0) {
        breakEvenIndex = i;
        break;
      }
    }

    return {
      n,
      minIdx,
      minAccum,
      minAccumMonthIndex,
      breakEvenIndex,
      finalCash: runningAccum,
      caixaAcumulado: arrCaixaAcumulado,
      netMensal: arrNetMensal,
      recebimentos: arrRecebimentos,
      desembolsos: arrDesembolsos,
      sVendas: arrRecVendas.reduce((a, b) => a + b, 0),
      sAporte: arrAporte.reduce((a, b) => a + b, 0),
      sTaxaAdm: arrTaxaAdm.reduce((a, b) => a + b, 0),
      sGranito: arrJustfixReceita.reduce((a, b) => a + b, 0),
      sOtRec: arrObrasTercRec.reduce((a, b) => a + b, 0),
      sOeRec: arrObrasEntrRec.reduce((a, b) => a + b, 0),
      sCustoObra: arrCustoObra.reduce((a, b) => a + b, 0),
      sADM: arrADM.reduce((a, b) => a + b, 0),
      sJustfixCusto: arrJustfixCusto.reduce((a, b) => a + b, 0),
      sOtCusto: arrObrasTercCusto.reduce((a, b) => a + b, 0),
      sOeCusto: arrObrasEntrCusto.reduce((a, b) => a + b, 0),
      sJuros: arrJuros.reduce((a, b) => a + b, 0),
      sAmort: arrAmortizacao.reduce((a, b) => a + b, 0)
    };
  };

  const cashFlowResult = getProjectedCashFlowResult();

  // Helper labels
  const getMonthLabel = (idx: number) => {
    return `${MESN[((idx % 12) + 12) % 12] || ''}/${String(Math.floor(idx / 12)).slice(2)}`;
  };

  const handleAddField = (key: 'pipe' | 'andamento' | 'kpis') => {
    if (key === 'pipe') {
      const nextId = `pipe-${pipe.length + 1}`;
      setPipe([...pipe, { id: nextId, ano: "2026", emp: "Novo Lançamento", praca: "Maringá", seg: "Médio", vgv: "20000000", mes: "Jan", prazo: "24" }]);
    } else if (key === 'andamento') {
      const nextId = `and-${andamento.length + 1}`;
      setAndamento([...andamento, { id: nextId, nome: "Nova SPE em Obra", custo_tot: "15000000", realizado: "0", estoque: "8000000", ano: "2026", mes: "Jan", prazo: "24" }]);
    } else if (key === 'kpis') {
      const nextId = `kpi-${kpis.length + 1}`;
      setKpis([...kpis, { id: nextId, nome: "Novo Indicador", y26: "0", y27: "0", y28: "0", y29: "0", y30: "0" }]);
    }
  };

  const handleRemoveField = (key: 'pipe' | 'andamento' | 'kpis', id: string) => {
    if (key === 'pipe') {
      setPipe(pipe.filter(p => p.id !== id));
    } else if (key === 'andamento') {
      setAndamento(andamento.filter(p => p.id !== id));
    } else if (key === 'kpis') {
      setKpis(kpis.filter(p => p.id !== id));
    }
  };

  const handleFieldChange = (key: keyof StrategicFields, value: string) => {
    setFields({
      ...fields,
      [key]: value
    });
  };

  const handleRowChange = (key: 'pipe' | 'andamento' | 'kpis', index: number, propName: string, value: string) => {
    if (key === 'pipe') {
      const newAr = [...pipe];
      newAr[index] = { ...newAr[index], [propName]: value };
      setPipe(newAr);
    } else if (key === 'andamento') {
      const newAr = [...andamento];
      newAr[index] = { ...newAr[index], [propName]: value };
      setAndamento(newAr);
    } else if (key === 'kpis') {
      const newAr = [...kpis];
      newAr[index] = { ...newAr[index], [propName]: value };
      setKpis(newAr);
    }
  };

  const totalVgvPipeline = pipe.reduce((acc, p) => acc + parseNum(p.vgv), 0);
  const totalRecebiveisSoma = parseNum(fields.rec_entrada) + parseNum(fields.rec_parcelas) + parseNum(fields.rec_financiamento);

  return (
    <div id="strategic-plan-module" className="space-y-8">
      {/* Prime Strategic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 bg-slate-900 text-slate-100 p-8 rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative">
        <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -z-1" />
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 text-xs px-3 py-1 rounded-full font-medium border border-orange-500/20">
            <SlidersHorizontal className="w-3.5 h-3.5 animate-pulse" />
            MOTOR DE CENÁRIOS E PROJEÇÕES FINANCEIRAS
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
            Plano Estratégico (Projetado F5)
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Insumo de planejamento de longo prazo (5 anos). Simule pipeline de lançamentos, premissas de custos e orçamentos gerais para alimentar de forma consistente o <span className="text-slate-200">FinanceFlow</span> e obter a projeção de caixa consolidada do grupo.
          </p>
        </div>

        {/* Toolbar of general plan actions */}
        <div className="flex bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-slate-750 flex-wrap gap-2 text-xs font-semibold">
          <button 
            onClick={handleSave}
            className="px-3.5 py-2.5 bg-orange-500 text-white hover:bg-orange-600 rounded-lg cursor-pointer flex items-center gap-2 transition duration-150 shadow-md shadow-orange-500/15"
          >
            💾 {saveStatus}
          </button>
          <button 
            onClick={handleExportJSON}
            className="px-3.5 py-2.5 bg-slate-700 text-slate-100 hover:bg-slate-655 hover:bg-slate-600 rounded-lg cursor-pointer flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" /> Exportar
          </button>
          <label className="px-3.5 py-2.5 bg-slate-700 text-slate-100 hover:bg-slate-600 rounded-lg cursor-pointer flex items-center gap-1.5 transition">
            <Upload className="w-3.5 h-3.5" /> Importar
            <input type="file" accept="application/json" onChange={handleImportJSON} className="hidden" />
          </label>
          <button 
            onClick={handleReset}
            className="px-3.5 py-2.5 bg-red-950 text-red-400 hover:bg-red-900 rounded-lg cursor-pointer border border-red-900/20 transition"
          >
            Limpar Dados
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex overflow-x-auto bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold whitespace-nowrap scrollbar-none">
        {[
          { id: 'meta-mercado', name: '1. Metas e Mercado' },
          { id: 'lançamentos', name: '2. Pipeline e Andamento' },
          { id: 'custo-comercial', name: '3. Custos e Comercial' },
          { id: 'financas', name: '4. Estratégia de Atração' },
          { id: 'just-budget', name: '5. Orçamento Just Holding' },
          { id: 'simulador', name: '6. Simulação F5 & Caixa' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-3 rounded-xl transition cursor-pointer flex-1 text-center ${activeSubTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveSubTab(tab.id as any)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Contents Frame */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-6 animate-fadeIn"
          >
            {/* 1. METAS E ESTRATÉGIA DE MERCADO */}
            {activeSubTab === 'meta-mercado' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-1.5">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    Parâmetros Estratégicos & Visão Global
                  </h3>
                  <p className="text-xs text-slate-500">As metas de planejamento que servem como teto de modelagem.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strategic Vision Textarea */}
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700">Visão Estratégica (Mapeamento de 5 anos)</label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-orange-500 h-24 whitespace-pre-wrap leading-relaxed"
                      value={fields.visao}
                      onChange={(e) => handleFieldChange('visao', e.target.value)}
                    />
                  </div>

                  {/* Quantitative inputs */}
                  <div className="flex flex-col gap-1.5 text-xs">
                    <label className="font-bold text-slate-700">VGV total projetado a lançar (R$)</label>
                    <input 
                      type="text" 
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-orange-500 font-mono"
                      value={fields.vgv_total}
                      onChange={(e) => handleFieldChange('vgv_total', e.target.value)}
                      onBlur={() => handleFieldChange('vgv_total', String(parseNum(fields.vgv_total)))}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs">
                    <label className="font-bold text-slate-700">Margem líquida operacional alvo (%)</label>
                    <input 
                      type="text" 
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-orange-500 font-mono"
                      value={fields.margem_alvo}
                      onChange={(e) => handleFieldChange('margem_alvo', e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs">
                    <label className="font-bold text-slate-700">ROE-alvo do grupo (%)</label>
                    <input 
                      type="text" 
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-orange-500 font-mono"
                      value={fields.roe_alvo}
                      onChange={(e) => handleFieldChange('roe_alvo', e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs">
                    <label className="font-bold text-slate-700">Crescimento anual de VGV (CAGR %)</label>
                    <input 
                      type="text" 
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-orange-500 font-mono"
                      value={fields.cagr}
                      onChange={(e) => handleFieldChange('cagr', e.target.value)}
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <h4 className="text-xs font-bold text-slate-550 uppercase tracking-wider">Estratégia de Posicionamento e Demanda</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5 text-xs">
                      <label className="font-bold text-slate-705">Praças de Atuação Regionais</label>
                      <textarea 
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 h-20 outline-none focus:border-orange-500 leading-normal"
                        value={fields.pracas}
                        onChange={(e) => handleFieldChange('pracas', e.target.value)}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5 text-xs">
                      <label className="font-bold text-slate-705">Segmentos em Foco (Ex: Econômico/Alto padrão)</label>
                      <textarea 
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 h-20 outline-none focus:border-orange-500 leading-normal"
                        value={fields.segmentos}
                        onChange={(e) => handleFieldChange('segmentos', e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs">
                      <label className="font-bold text-slate-705">Diferenciais e Proposta de Valor</label>
                      <textarea 
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 h-20 outline-none focus:border-orange-500 leading-normal"
                        value={fields.posicionamento}
                        onChange={(e) => handleFieldChange('posicionamento', e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs">
                      <label className="font-bold text-slate-705">Análise de Demanda e Leitura Concorrencial</label>
                      <textarea 
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 h-20 outline-none focus:border-orange-500 leading-normal"
                        value={fields.concorrencia}
                        onChange={(e) => handleFieldChange('concorrencia', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PIPELINE DE LANÇAMENTOS E OBRAS EM ANDAMENTO */}
            {activeSubTab === 'lançamentos' && (
              <div className="space-y-8">
                {/* Section A: Pipeline de novos lançamentos */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-1.5">
                        <Briefcase className="w-5 h-5 text-orange-500" />
                        Pipeline de Novos Empreendimentos (SPEs Futuras)
                      </h3>
                      <p className="text-xs text-slate-500">Planejamento fiduciário de lançamentos para os próximos 5 anos.</p>
                    </div>
                    <button 
                      onClick={() => handleAddField('pipe')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-800 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition"
                    >
                      <Plus className="w-3.5 h-3.5 text-orange-500" /> lançar Empreendimento
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="bg-slate-50 text-slate-400 font-mono text-[10px] border-b border-slate-150 uppercase">
                        <tr>
                          <th className="py-3.5 px-4 font-semibold">Ano</th>
                          <th className="py-3.5 px-4 font-semibold">Empreendimento</th>
                          <th className="py-3.5 px-4 font-semibold">Praça</th>
                          <th className="py-3.5 px-4 font-semibold">Segmento</th>
                          <th className="py-3.5 px-4 font-semibold text-right">VGV Estm (R$)</th>
                          <th className="py-3.5 px-4 font-semibold">Mês Lançam.</th>
                          <th className="py-3.5 px-4 font-semibold">Prazo Obra (meses)</th>
                          <th className="py-3.5 px-4 font-semibold text-center">Excluir</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {pipe.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-4 shrink-0"><input type="text" className="bg-white border border-slate-250 p-1 rounded w-16 text-center font-mono font-medium outline-none focus:border-orange-500" value={item.ano} onChange={(e) => handleRowChange('pipe', idx, 'ano', e.target.value)} /></td>
                            <td className="py-2.5 px-4"><input type="text" className="bg-white border border-slate-250 p-1.5 rounded font-semibold text-slate-900 outline-none focus:border-orange-500 min-w-[150px]" value={item.emp} onChange={(e) => handleRowChange('pipe', idx, 'emp', e.target.value)} /></td>
                            <td className="py-2.5 px-4"><input type="text" className="bg-white border border-slate-250 p-1.5 rounded outline-none focus:border-orange-500" value={item.praca} onChange={(e) => handleRowChange('pipe', idx, 'praca', e.target.value)} /></td>
                            <td className="py-2.5 px-4"><input type="text" className="bg-white border border-slate-250 p-1.5 rounded outline-none focus:border-orange-500" value={item.seg} onChange={(e) => handleRowChange('pipe', idx, 'seg', e.target.value)} /></td>
                            <td className="py-2.5 px-4 text-right"><input type="text" className="bg-white border border-slate-250 p-1.5 rounded text-right font-mono font-bold outline-none focus:border-orange-500 min-w-[125px]" value={item.vgv} onChange={(e) => handleRowChange('pipe', idx, 'vgv', e.target.value)} onBlur={() => handleRowChange('pipe', idx, 'vgv', String(parseNum(item.vgv)))} /></td>
                            <td className="py-2.5 px-4"><input type="text" className="bg-white border border-slate-250 p-1 rounded w-16 text-center font-semibold outline-none focus:border-orange-500" value={item.mes} onChange={(e) => handleRowChange('pipe', idx, 'mes', e.target.value)} /></td>
                            <td className="py-2.5 px-4"><input type="text" className="bg-white border border-slate-250 p-1 rounded w-16 text-center font-mono font-medium outline-none focus:border-orange-500" value={item.prazo} onChange={(e) => handleRowChange('pipe', idx, 'prazo', e.target.value)} /></td>
                            <td className="py-2.5 px-4 text-center">
                              <button onClick={() => handleRemoveField('pipe', item.id)} className="p-1 text-red-650 hover:bg-red-50 rounded transition cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-50 font-sans font-bold">
                          <td colSpan={4} className="py-3 px-4 text-slate-700 font-bold">VGV Total Calculado do Pipeline</td>
                          <td className="py-3 px-4 text-right font-mono font-black text-indigo-700">{formatReais(totalVgvPipeline)}</td>
                          <td colSpan={3}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Section B: Obras já em andamento (Matera / Blank etc.) */}
                <div className="space-y-4 pt-4 border-t border-slate-150">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-1.5">
                        <Building2 className="w-5 h-5 text-orange-500" />
                        Obras em Andamento (Blank / Matera) &mdash; Insumo BuildIQ
                      </h3>
                      <p className="text-xs text-slate-550 leading-relaxed max-w-3xl">
                        Ativos operacionais em andamento. BuildIQ colhe os custos de obra acumulados e o estoque remanescente; e neste plano simula-se a distribuição do <strong>custo a executar (Total - Realizado)</strong> e o parcelamento dos recebíveis do estoque das unidades.
                      </p>
                    </div>
                    <button 
                      onClick={() => handleAddField('andamento')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-205 hover:bg-slate-200 text-slate-750 border border-slate-250 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 transition"
                    >
                      <Plus className="w-3.5 h-3.5 text-orange-500" /> Adicionar Obra
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="bg-slate-50 text-slate-400 font-mono text-[10px] border-b border-slate-150 uppercase">
                        <tr>
                          <th className="py-3.5 px-4 font-semibold">SPE em Execução</th>
                          <th className="py-3.5 px-4 font-semibold text-right">Custo total atualizado (BuildIQ)</th>
                          <th className="py-3.5 px-4 font-semibold text-right">Realizado Histórico (Sienge)</th>
                          <th className="py-3.5 px-4 font-semibold text-right">Estoque Restante a Vender</th>
                          <th className="py-3.5 px-4 font-semibold">Ano Sim.</th>
                          <th className="py-3.5 px-4 font-semibold">Mês Sim.</th>
                          <th className="py-3.5 px-4 font-semibold">Prazo Restante (m)</th>
                          <th className="py-3.5 px-4 font-semibold text-center">Excluir</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {andamento.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-4"><input type="text" className="bg-white border border-slate-250 p-1.5 rounded font-semibold text-slate-900 outline-none focus:border-orange-500 min-w-[150px]" value={item.nome} onChange={(e) => handleRowChange('andamento', idx, 'nome', e.target.value)} /></td>
                            <td className="py-2.5 px-4 text-right"><input type="text" className="bg-white border border-slate-250 p-1.5 rounded text-right font-mono outline-none focus:border-orange-500 min-w-[125px]" value={item.custo_tot} onChange={(e) => handleRowChange('andamento', idx, 'custo_tot', e.target.value)} onBlur={() => handleRowChange('andamento', idx, 'custo_tot', String(parseNum(item.custo_tot)))} /></td>
                            <td className="py-2.5 px-4 text-right"><input type="text" className="bg-white border border-slate-250 p-1.5 rounded text-right font-mono text-emerald-600 font-medium outline-none focus:border-orange-500 min-w-[125px]" value={item.realizado} onChange={(e) => handleRowChange('andamento', idx, 'realizado', e.target.value)} onBlur={() => handleRowChange('andamento', idx, 'realizado', String(parseNum(item.realizado)))} /></td>
                            <td className="py-2.5 px-4 text-right"><input type="text" className="bg-white border border-slate-250 p-1.5 rounded text-right font-mono text-indigo-600 font-medium outline-none focus:border-orange-500 min-w-[125px]" value={item.estoque} onChange={(e) => handleRowChange('andamento', idx, 'estoque', e.target.value)} onBlur={() => handleRowChange('andamento', idx, 'estoque', String(parseNum(item.estoque)))} /></td>
                            <td className="py-2.5 px-4"><input type="text" className="bg-white border border-slate-250 p-1 rounded w-16 text-center font-mono outline-none focus:border-orange-500" value={item.ano} onChange={(e) => handleRowChange('andamento', idx, 'ano', e.target.value)} /></td>
                            <td className="py-2.5 px-4"><input type="text" className="bg-white border border-slate-250 p-1 rounded w-16 text-center outline-none focus:border-orange-500" value={item.mes} onChange={(e) => handleRowChange('andamento', idx, 'mes', e.target.value)} /></td>
                            <td className="py-2.5 px-4"><input type="text" className="bg-white border border-slate-250 p-1 rounded w-16 text-center font-mono outline-none focus:border-orange-500" value={item.prazo} onChange={(e) => handleRowChange('andamento', idx, 'prazo', e.target.value)} /></td>
                            <td className="py-2.5 px-4 text-center">
                              <button onClick={() => handleRemoveField('andamento', item.id)} className="p-1 text-red-650 hover:bg-red-50 rounded transition cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CUSTOS E COMERCIAL */}
            {activeSubTab === 'custo-comercial' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-1.5">
                    <Sliders className="w-5 h-5 text-orange-500" />
                    Fatores de Custos Diretos & Indiretos
                  </h3>
                  <p className="text-xs text-slate-500">Distribuição estrutural de gastos aplicada sobre o VGV planejado.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Custos diretos */}
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/80 space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase">Custos Diretos de Obra</h4>
                    
                    <div className="flex flex-col gap-1.5 text-xs">
                      <label className="font-bold text-slate-705">Custo Direto Inicial de Produção (% do VGV)</label>
                      <input 
                        type="text" 
                        className="bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-orange-500 font-mono"
                        value={fields.custo_direto}
                        onChange={(e) => handleFieldChange('custo_direto', e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs">
                      <label className="font-bold text-slate-750">Índice Estimado de Correção do Custo (INCC/etc)</label>
                      <input 
                        type="text" 
                        className="bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-orange-500 font-sans"
                        value={fields.custo_indice}
                        onChange={(e) => handleFieldChange('custo_indice', e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs">
                      <label className="font-bold text-slate-755">Observações sobre contingências diretas</label>
                      <textarea 
                        className="bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-orange-500 h-16 leading-relaxed"
                        value={fields.custo_direto_obs}
                        onChange={(e) => handleFieldChange('custo_direto_obs', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Custos indiretos */}
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/80 space-y-4">
                    <h4 className="text-xs font-bold text-slate-705 uppercase">Custos Indiretos & Encargos (% do VGV)</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5 text-xs">
                        <label className="font-bold text-slate-705">Comissão Vendas (%)</label>
                        <input type="text" className="bg-white border border-slate-200 rounded-xl p-2.5 font-mono" value={fields.ind_comissao} onChange={(e) => handleFieldChange('ind_comissao', e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1.5 text-xs">
                        <label className="font-bold text-slate-705">Juros Cap. Próprio (%)</label>
                        <input type="text" className="bg-white border border-slate-200 rounded-xl p-2.5 font-mono" value={fields.ind_juros_proprio} onChange={(e) => handleFieldChange('ind_juros_proprio', e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1.5 text-xs">
                        <label className="font-bold text-slate-705">Juros Cap. Terceiros (%)</label>
                        <input type="text" className="bg-white border border-slate-200 rounded-xl p-2.5 font-mono" value={fields.ind_juros_terceiros} onChange={(e) => handleFieldChange('ind_juros_terceiros', e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1.5 text-xs">
                        <label className="font-bold text-slate-700">Marketing e Lançamento (%)</label>
                        <input type="text" className="bg-white border border-slate-200 rounded-xl p-2.5 font-mono" value={fields.ind_marketing} onChange={(e) => handleFieldChange('ind_marketing', e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1.5 text-xs">
                        <label className="font-bold text-slate-700">Taxa Administrativa ADM (%)</label>
                        <input type="text" className="bg-white border border-slate-200 rounded-xl p-2.5 font-mono" value={fields.ind_admin} onChange={(e) => handleFieldChange('ind_admin', e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1.5 text-xs">
                        <label className="font-bold text-slate-700">Tributos Federais RET (%)</label>
                        <input type="text" className="bg-white border border-slate-200 rounded-xl p-2.5 font-mono" value={fields.ind_tributos} onChange={(e) => handleFieldChange('ind_tributos', e.target.value)} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs pt-1">
                      <label className="font-bold text-slate-750">Premissas indiretas gerais</label>
                      <textarea className="bg-white border border-slate-200 rounded-xl p-3 h-16 outline-none focus:border-orange-500 leading-normal" value={fields.ind_obs} onChange={(e) => handleFieldChange('ind_obs', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Comercial inputs */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold text-slate-550 uppercase">Estratégia e Canais de Comercialização</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5 text-xs">
                        <label className="font-bold text-slate-705">VSO Alvo Mensal (%)</label>
                        <input type="text" className="bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono" value={fields.vso} onChange={(e) => handleFieldChange('vso', e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1.5 text-xs">
                        <label className="font-bold text-slate-705">Índice Reajuste Tabelas</label>
                        <input type="text" className="bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-800" value={fields.indice_venda} onChange={(e) => handleFieldChange('indice_venda', e.target.value)} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs">
                      <label className="font-bold text-slate-705">Política de Precificação e Descontos de Unidades</label>
                      <textarea className="bg-slate-50 border border-slate-200 rounded-xl p-3 h-12 leading-relaxed" value={fields.precos} onChange={(e) => handleFieldChange('precos', e.target.value)} />
                    </div>
                    
                    <div className="md:col-span-2 flex flex-col gap-1.5 text-xs">
                      <label className="font-bold text-slate-700">Canais de Venda Ativos & Estrutura de Corretores Parceiros</label>
                      <textarea className="bg-slate-50 border border-slate-200 rounded-xl p-3 h-16 leading-relaxed" value={fields.canais} onChange={(e) => handleFieldChange('canais', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. FINANÇAS E DISTRIBUIÇÃO */}
            {activeSubTab === 'financas' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-1.5">
                    <SlidersHorizontal className="w-5 h-5 text-orange-500" />
                    Atração de Funding, Fluxo Recebível e Macro
                  </h3>
                  <p className="text-xs text-slate-550">Metodologia de captação, reajustes fiduciários bancários e amortização.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recebiveis distribution sinal/parcelas/repasse */}
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/80 space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase">Premissas de Recebimento de Vendas (VGV)</h4>
                    
                    <div className="grid grid-cols-3 gap-4 font-mono text-xs">
                      <div className="flex flex-col gap-1">
                        <label className="font-sans font-semibold text-slate-700">Entrada/Sinal (%)</label>
                        <input type="text" className="bg-white border border-slate-200 rounded-xl p-2.5 text-center font-bold" value={fields.rec_entrada} onChange={(e) => handleFieldChange('rec_entrada', e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-sans font-semibold text-slate-700">Obra Mensais (%)</label>
                        <input type="text" className="bg-white border border-slate-200 rounded-xl p-2.5 text-center font-bold cursor-wait" value={fields.rec_parcelas} onChange={(e) => handleFieldChange('rec_parcelas', e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-sans font-semibold text-slate-700">Financ. Repasse (%)</label>
                        <input type="text" className="bg-white border border-slate-200 rounded-xl p-2.5 text-center font-bold" value={fields.rec_financiamento} onChange={(e) => handleFieldChange('rec_financiamento', e.target.value)} />
                      </div>
                    </div>

                    <div className="text-xs py-2 px-3 rounded-xl flex items-center justify-between" style={{ backgroundColor: Math.abs(totalRecebiveisSoma - 100) < 0.5 ? '#f0fdf4' : '#fef2f2' }}>
                      <span className="font-bold text-slate-600">Soma das frações de venda:</span>
                      <span className={`font-mono font-black ${Math.abs(totalRecebiveisSoma - 100) < 0.5 ? 'text-emerald-700' : 'text-red-700'}`}>
                        {totalRecebiveisSoma}% {Math.abs(totalRecebiveisSoma - 100) < 0.5 ? '(Ideal: 100%)' : '(Alerta: Ajuste para 100%)'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-slate-705">Curva Gasto Custo Obra</label>
                        <select className="bg-white border border-slate-200 rounded-xl p-3 outline-none" value={fields.des_curva} onChange={(e) => handleFieldChange('des_curva', e.target.value)}>
                          <option>Linear (uniforme no prazo)</option>
                          <option>Curva S (física)</option>
                          <option>Por medição real (BuildIQ)</option>
                        </select>
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-slate-705">Concentração Gasto</label>
                        <select className="bg-white border border-slate-200 rounded-xl p-3 outline-none" value={fields.des_conc} onChange={(e) => handleFieldChange('des_conc', e.target.value)}>
                          <option>Equilibrada</option>
                          <option>Maior no início</option>
                          <option>Maior no miolo</option>
                          <option>Maior no fim</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs">
                      <label className="font-bold text-slate-700 font-sans">Detalhamento da distribuição sugerida</label>
                      <textarea className="bg-white border border-slate-200 rounded-xl p-3 h-14 leading-normal" value={fields.des_obs} onChange={(e) => handleFieldChange('des_obs', e.target.value)} />
                    </div>
                  </div>

                  {/* Funding and capital structure */}
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/80 space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase font-sans">Estrutura de Capital & Indicadores Macro</h4>
                    
                    <div className="flex flex-col gap-1.5 text-xs">
                      <label className="font-bold text-slate-700">Estrutura de Capital Almejada (% Próprio / Terceiros)</label>
                      <input type="text" className="bg-white border border-slate-200 rounded-xl p-3 font-mono font-medium" value={fields.estrutura_capital} onChange={(e) => handleFieldChange('estrutura_capital', e.target.value)} />
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs">
                      <label className="font-bold text-slate-700">Linhas de Funding Principais (Ex: SFH / FI / CRI)</label>
                      <textarea className="bg-white border border-slate-200 rounded-xl p-2.5 h-12 leading-relaxed" value={fields.funding} onChange={(e) => handleFieldChange('funding', e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div className="flex flex-col gap-1">
                        <label className="font-sans font-bold text-slate-700">Projeção INCC (% a.a.)</label>
                        <input type="text" className="bg-white border border-slate-200 rounded-xl p-2.5 font-bold" value={fields.incc} onChange={(e) => handleFieldChange('incc', e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-sans font-bold text-slate-700">Selic / Juros Ref (% a.a.)</label>
                        <input type="text" className="bg-white border border-slate-200 rounded-xl p-2.5 font-bold" value={fields.juros_ref} onChange={(e) => handleFieldChange('juros_ref', e.target.value)} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs">
                      <label className="font-bold text-slate-700">Política de Dividendos & AFAC das SPEs</label>
                      <textarea className="bg-white border border-slate-200 rounded-xl p-2.5 h-12 leading-relaxed" value={fields.distribuicao} onChange={(e) => handleFieldChange('distribuicao', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. CONSTRUTORA JUST ORÇAMENTOS */}
            {activeSubTab === 'just-budget' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-1.5">
                    <Scale className="w-5 h-5 text-orange-500" />
                    Orçamento do Centro de Custos Construtora (Just S/A)
                  </h3>
                  <p className="text-xs text-slate-450">Projeção forward das drenagens financeiras e taxas administrativas da Construtora centralizada.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  {/* Construtora Just Overhead params */}
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/80 space-y-4">
                    <h4 className="text-xs font-bold text-slate-705 uppercase">Just Construções (Geral S/A)</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-slate-700">ADM Overhead Anual (R$)</label>
                        <input type="text" className="bg-white border border-slate-200 rounded-xl p-2.5 font-mono text-slate-800" value={fields.just_adm} onChange={(e) => handleFieldChange('just_adm', e.target.value)} onBlur={() => handleFieldChange('just_adm', String(parseNum(fields.just_adm)))} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-slate-700">Taxa Administração Obra (%)</label>
                        <input type="text" className="bg-white border border-slate-200 rounded-xl p-2.5 font-mono text-orange-700 font-bold" value={fields.just_taxa_pct} onChange={(e) => handleFieldChange('just_taxa_pct', e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h5 className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wide">Módulo Justfix (Granito às Obras)</h5>
                      <p className="text-[10px] text-slate-450 leading-relaxed">
                        Justfix atua como fornecedor de granito secundário exclusivo. Representa custo de obra na SPE e receita sob centro correspondente Justfix.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-slate-700">Receita Anual Justfix (R$)</label>
                          <input type="text" className="bg-white border border-slate-200 rounded-xl p-2 font-mono" value={fields.just_jfix_rec} onChange={(e) => handleFieldChange('just_jfix_rec', e.target.value)} onBlur={() => handleFieldChange('just_jfix_rec', String(parseNum(fields.just_jfix_rec)))} />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-slate-700">Custo Anual Justfix (R$)</label>
                          <input type="text" className="bg-white border border-slate-200 rounded-xl p-2 font-mono" value={fields.just_jfix_custo} onChange={(e) => handleFieldChange('just_jfix_custo', e.target.value)} onBlur={() => handleFieldChange('just_jfix_custo', String(parseNum(fields.just_jfix_custo)))} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Demais centros de custo e dividas */}
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/80 space-y-4">
                    <h4 className="text-xs font-bold text-slate-705 uppercase">Outros Centros de Custos e Drenagens</h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">Obras Terceiros Receita/ano (R$)</label>
                        <input type="text" className="bg-white border border-slate-200 rounded-xl p-2 font-mono" value={fields.just_ot_rec} onChange={(e) => handleFieldChange('just_ot_rec', e.target.value)} onBlur={() => handleFieldChange('just_ot_rec', String(parseNum(fields.just_ot_rec)))} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">Obras Terceiros Custo/ano (R$)</label>
                        <input type="text" className="bg-white border border-slate-200 rounded-xl p-2 font-mono" value={fields.just_ot_custo} onChange={(e) => handleFieldChange('just_ot_custo', e.target.value)} onBlur={() => handleFieldChange('just_ot_custo', String(parseNum(fields.just_ot_custo)))} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">Obras Entregues (Travéza) Rec (R$/ano)</label>
                        <input type="text" className="bg-white border border-slate-200 rounded-xl p-2 font-mono" value={fields.just_oe_rec} onChange={(e) => handleFieldChange('just_oe_rec', e.target.value)} onBlur={() => handleFieldChange('just_oe_rec', String(parseNum(fields.just_oe_rec)))} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">Obras Entregues Manutenção (R$/ano)</label>
                        <input type="text" className="bg-white border border-slate-200 rounded-xl p-2 font-mono" value={fields.just_oe_custo} onChange={(e) => handleFieldChange('just_oe_custo', e.target.value)} onBlur={() => handleFieldChange('just_oe_custo', String(parseNum(fields.just_oe_custo)))} />
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      <h5 className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wide">Serviço da Dívida e Empréstimos Corporativos</h5>
                      <div className="grid grid-cols-3 gap-2 font-mono">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-sans font-semibold text-slate-600">Saldo Atual (R$)</span>
                          <input type="text" className="bg-white border border-slate-200 rounded-lg p-1.5 text-center font-bold" value={fields.just_emp_saldo} onChange={(e) => handleFieldChange('just_emp_saldo', e.target.value)} onBlur={() => handleFieldChange('just_emp_saldo', String(parseNum(fields.just_emp_saldo)))} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-sans font-semibold text-slate-600">Custo (% a.a.)</span>
                          <input type="text" className="bg-white border border-slate-200 rounded-lg p-1.5 text-center font-bold" value={fields.just_emp_taxa} onChange={(e) => handleFieldChange('just_emp_taxa', e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-sans font-semibold text-slate-600">Amortiz. Anual (R$)</span>
                          <input type="text" className="bg-white border border-slate-200 rounded-lg p-1.5 text-center font-bold" value={fields.just_emp_amort} onChange={(e) => handleFieldChange('just_emp_amort', e.target.value)} onBlur={() => handleFieldChange('just_emp_amort', String(parseNum(fields.just_emp_amort)))} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Provisioned AFAC and Distribution targets */}
                <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-6 text-xs">
                  <div className="flex-1 space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="text-xs font-semibold text-slate-800">Resultado Projetado da Construtora centralizada ({projHorizonteAnos} anos)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b border-slate-150">
                        <span>Receita Administrativa das Obras ({fields.just_taxa_pct}%)</span>
                        <span className="font-mono text-emerald-600 font-bold">+{formatReais(justRevenueTaxaAdm)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-150">
                        <span>Outras Receitas Consolidadas Centro Custo</span>
                        <span className="font-mono text-emerald-600 font-bold">+{formatReais(justRevenueJustfix + justRevenueObrasTerceiros + justRevenueObrasEntregues)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-150">
                        <span>ADM Overhead & Centros de Custos Totais</span>
                        <span className="font-mono text-red-600 font-bold">-{formatReais(justOutflowADM + justOutflowJustfix + justOutflowObrasTerceiros + justOutflowObrasEntregues)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-150">
                        <span>Serviço Financeiro de Empréstimos S/A</span>
                        <span className="font-mono text-red-600 font-bold">-{formatReais(justOutflowJurosDivida)}</span>
                      </div>
                      <div className="flex justify-between py-2.5 bg-white px-2 rounded-lg border border-slate-200 font-extrabold text-[13px]">
                        <span>Lucro Contribuição Central</span>
                        <span className={netJustContribution >= 0 ? 'text-emerald-700 font-mono' : 'text-red-700 font-mono'}>{formatReais(netJustContribution)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 p-4 bg-slate-900 text-slate-300 rounded-2xl border border-slate-950">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Aportes Estratégicos & Distribuições</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400">Provisão de AFAC / Aporte (R$)</label>
                        <input type="text" className="bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono font-bold" value={fields.just_aporte_val} onChange={(e) => handleFieldChange('just_aporte_val', e.target.value)} onBlur={() => handleFieldChange('just_aporte_val', String(parseNum(fields.just_aporte_val)))} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400">Distribuição Lucro Alvo (%)</label>
                        <input type="text" className="bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono font-bold" value={fields.just_distrib_pct} onChange={(e) => handleFieldChange('just_distrib_pct', e.target.value)} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 pt-1">
                      <label className="font-bold text-slate-400">Diretriz Tributária do AFAC</label>
                      <textarea className="bg-slate-800 border border-slate-700 rounded-xl p-2 h-16 leading-relaxed text-slate-300 outline-none" value={fields.just_aporte_obs} onChange={(e) => handleFieldChange('just_aporte_obs', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. SIMULAÇÃO F5 & FLUXO CONSOLIDADO */}
            {activeSubTab === 'simulador' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Simulated Lanzations Results by Year */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-1.5">
                        <Sparkles className="w-5 h-5 text-orange-500" />
                        Cenário Econômico Projetado (SPEs Futuras)
                      </h3>
                      <p className="text-xs text-slate-500">Resultado consolidado simplificado por ano das novas incorporações.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-2 text-xs font-medium">
                    <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl">
                      <span className="text-slate-400 block font-mono">VGV TOTAL DO PIPELINE</span>
                      <span className="text-lg font-black text-slate-900 font-mono">{formatReais(simTotalVgv)}</span>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl">
                      <span className="text-slate-400 block font-mono">CUSTO TOTAL DE OBRA</span>
                      <span className="text-lg font-black text-red-600 font-mono">{formatReais(simTotalCustos)}</span>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl">
                      <span className="text-slate-400 block font-mono">LUCRO ESTIMADO</span>
                      <span className="text-lg font-black text-emerald-600 font-mono">{formatReais(simTotalRes)}</span>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl">
                      <span className="text-slate-400 block font-mono font-sans">MARGEM MÉDIA ESTIMADA</span>
                      <span className="text-lg font-black text-indigo-700">{simAvgMargem.toFixed(2)}%</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl text-xs">
                    <table className="w-full text-left font-sans">
                      <thead className="bg-slate-50 text-slate-400 font-mono text-[10px] border-b border-slate-150 uppercase">
                        <tr>
                          <th className="py-3 px-4 font-semibold">Ano de Lançamento</th>
                          <th className="py-3 px-4 font-semibold text-right">VGV Lançado</th>
                          <th className="py-3 px-4 font-semibold text-right">Custos Direto/Indireto</th>
                          <th className="py-3 px-4 font-semibold text-right">Resultado Teórico</th>
                          <th className="py-3 px-4 font-semibold text-center">Margem Operacional</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {simulatedYears.map((y) => (
                          <tr key={y.ano} className="hover:bg-slate-50">
                            <td className="py-3 px-4 font-bold text-slate-900">{y.ano}</td>
                            <td className="py-3 px-4 text-right font-mono">{formatReais(y.vgv)}</td>
                            <td className="py-3 px-4 text-right font-mono text-red-655 text-red-600">{formatReais(y.custo)}</td>
                            <td className="py-3 px-4 text-right font-mono text-emerald-600 font-bold">{formatReais(y.resultado)}</td>
                            <td className="py-3 px-4 text-center font-bold text-indigo-700">{y.margem.toFixed(1)}%</td>
                          </tr>
                        ))}
                        {simulatedYears.length === 0 && (
                          <tr>
                            <td colSpan={5} className="text-center py-6 text-slate-400">Preencha o pipeline de lançamentos na aba anterior.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Simulated Consolidated Cash Flow Timeline with beautiful SVG Graphics */}
                {cashFlowResult ? (
                  <div className="space-y-6 pt-4 border-t border-slate-150 animate-fadeIn">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-1.5">
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                        Fluxo Projetado &mdash; Consolidação 5 Anos (mês a mês)
                      </h3>
                      <p className="text-xs text-slate-550 leading-relaxed max-w-2xl">
                        Este simulador integra as três fontes fiduciárias: as <strong>obras em andamento</strong> (valores colhidos Sienge/BuildIQ), as <strong>novas SPEs futuras</strong> (pipeline) e o <strong>orçamento da Just Holding</strong> (Overhead, granitos Justfix, amortização de dívidas).
                      </p>
                    </div>

                    {/* SVG GRAPH PLOT */}
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-inner space-y-4">
                      <h4 className="text-[11.5px] font-sans font-extrabold text-slate-800 flex items-center gap-1.5 uppercase">
                        Conserva de Liquidez Global e Saldo Líquido Mensal consolidado
                      </h4>
                      
                      {/* Responsive container for SVG box */}
                      <div className="w-full h-72">
                        <svg className="w-full h-full border border-slate-150 rounded-xl bg-slate-50" viewBox="0 0 920 280" preserveAspectRatio="none">
                          {/* Inner chart grid lines */}
                          <line x1="60" y1="20" x2="900" y2="20" stroke="#eceff1" strokeWidth="1" strokeDasharray="3" />
                          <line x1="60" y1="75" x2="900" y2="75" stroke="#eceff1" strokeWidth="1" strokeDasharray="3" />
                          <line x1="60" y1="130" x2="900" y2="130" stroke="#eceff1" strokeWidth="1" strokeDasharray="3" />
                          <line x1="60" y1="185" x2="900" y2="185" stroke="#eceff1" strokeWidth="1" strokeDasharray="3" />
                          <line x1="60" y1="240" x2="900" y2="240" stroke="#eceff1" strokeWidth="1" strokeDasharray="3" />

                          {/* SVG drawing logic */}
                          {(() => {
                            const n = cashFlowResult.n;
                            const minIdx = cashFlowResult.minIdx;
                            const maxVal = Math.max(...cashFlowResult.caixaAcumulado, ...cashFlowResult.netMensal, 0);
                            const minVal = Math.min(...cashFlowResult.caixaAcumulado, ...cashFlowResult.netMensal, 0);
                            const valDiff = maxVal - minVal === 0 ? 1 : maxVal - minVal;

                            const getX = (i: number) => 60 + (i * 840) / (n - 1 || 1);
                            const getY = (val: number) => 20 + ((maxVal - val) / valDiff) * 200;

                            const zeroY = getY(0);

                            // Month Label ticks
                            const tickStep = Math.max(1, Math.ceil(n / 10));
                            const ticks = [];
                            for (let i = 0; i < n; i += tickStep) {
                              ticks.push(
                                <g key={`tick-${i}-group`}>
                                  <line x1={getX(i)} y1="230" x2={getX(i)} y2="240" stroke="#cfd8dc" strokeWidth="1" />
                                  <text x={getX(i)} y="255" fontSize="10" fill="#78909c" textAnchor="middle" fontWeight="semibold" className="font-mono">
                                    {getMonthLabel(minIdx + i)}
                                  </text>
                                </g>
                              );
                            }

                            // Bars representing net monthly balance
                            const barNodes = cashFlowResult.netMensal.map((net, idx) => {
                              const x = getX(idx);
                              const y = getY(net);
                              const height = Math.abs(y - zeroY);
                              const top = Math.min(y, zeroY);
                              const color = net >= 0 ? '#86efac' : '#fca5a5'; // light green vs light red

                              return (
                                <rect 
                                  key={`bar-${idx}`}
                                  x={x - 4} 
                                  y={top} 
                                  width="8" 
                                  height={height} 
                                  fill={color} 
                                  stroke={net >= 0 ? '#4ade80' : '#f87171'}
                                  strokeWidth="0.5"
                                  className="transition duration-100 hover:opacity-80 cursor-help"
                                />
                              );
                            });

                            // Polyline representing cumulative cash trajectory
                            let polylinePointsArr = '';
                            for (let i = 0; i < n; i++) {
                              polylinePointsArr += `${getX(i).toFixed(1)},${getY(cashFlowResult.caixaAcumulado[i]).toFixed(1)} `;
                            }

                            // Critical point markers
                            const minPointX = getX(cashFlowResult.minAccumMonthIndex);
                            const minPointY = getY(cashFlowResult.minAccum);

                            return (
                              <g>
                                {/* Balance Bars */}
                                {barNodes}

                                {/* Zero reference line */}
                                <line x1="60" y1={zeroY} x2="900" y2={zeroY} stroke="#90a4ae" strokeWidth="1.5" />

                                {/* Cumulative Cash Line */}
                                <polyline 
                                  points={polylinePointsArr}
                                  fill="none"
                                  stroke="#1e293b"
                                  strokeWidth="3.5"
                                  strokeLinecap="round"
                                />

                                {/* Minimum point red circle */}
                                <circle 
                                  cx={minPointX} 
                                  cy={minPointY} 
                                  r="5.5" 
                                  fill="#ef4444" 
                                  stroke="#7f1d1d" 
                                  strokeWidth="1.5" 
                                />

                                {ticks}
                              </g>
                            );
                          })()}
                        </svg>
                      </div>

                      {/* Legend and stats */}
                      <div className="flex flex-wrap items-center justify-between gap-4 font-medium text-xs border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-4 text-slate-550">
                          <span className="flex items-center gap-1.5 text-slate-900 font-bold">
                            <span className="w-3 h-3 rounded bg-slate-900" />
                            Caixa Acumulado Consolidado
                          </span>
                          <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                            <span className="w-3 h-3 rounded bg-emerald-300" />
                            Saldo Positivo Mensal
                          </span>
                          <span className="flex items-center gap-1.5 text-red-600 font-bold">
                            <span className="w-3 h-3 rounded bg-red-300" />
                            Exposição Líquida Mensal
                          </span>
                        </div>

                        {/* Analysis indicators */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0 font-medium leading-relaxed font-sans text-slate-700 space-y-1">
                          <div>
                            📉 <strong>Necessidade Máxima de Caixa:</strong> <span className="font-mono text-red-650 font-bold">{formatReais(-cashFlowResult.minAccum)}</span> em <span className="font-bold text-slate-950 font-mono">{getMonthLabel(cashFlowResult.minIdx + cashFlowResult.minAccumMonthIndex)}</span>.
                          </div>
                          {cashFlowResult.breakEvenIndex >= 0 && (
                            <div>
                              🌅 <strong>Ponto de Equilíbrio (Break-Even):</strong> Caixa retorna positivo em <span className="font-mono font-bold text-emerald-600">{getMonthLabel(cashFlowResult.minIdx + cashFlowResult.breakEvenIndex)}</span>.
                            </div>
                          )}
                          <div>
                            💰 <strong>Saldo de Projecção ao Fim:</strong> <span className={cashFlowResult.finalCash >= 0 ? 'text-emerald-700 font-mono font-bold' : 'text-red-700 font-mono font-bold'}>{formatReais(cashFlowResult.finalCash)}</span>.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Table of cash inflows and outflows by verba */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 font-sans uppercase">Projeção por Natureza de Verba</h4>
                      <div className="overflow-x-auto border border-slate-200 rounded-xl text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 text-slate-400 font-mono text-[10px] border-b border-slate-150 uppercase">
                            <tr>
                              <th className="py-3.5 px-4 font-semibold">Rubrica / Natureza de Caixa</th>
                              <th className="py-3.5 px-4 font-semibold text-right">Faturamento Consolidado Projetado</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-sans">
                            {/* Entradas */}
                            <tr className="bg-slate-50/50">
                              <td colSpan={2} className="py-2 px-4 font-bold text-slate-800">ENTRADAS DE RECURSOS</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-slate-655 font-medium">(+) Recebíveis Comerciais de Vendas (SPEs)</td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">+{formatReais(cashFlowResult.sVendas)}</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-slate-655 font-medium">(+) Taxa Administrativa de gestão de obras (Just S/A)</td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">+{formatReais(cashFlowResult.sTaxaAdm)}</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-slate-655 font-medium">(+) Receitas Extraordinárias de Vendas Justfix (S/A)</td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">+{formatReais(cashFlowResult.sGranito)}</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-slate-655 font-medium">(+) Receitas de Empreendimentos de Terceiros</td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">+{formatReais(cashFlowResult.sOtRec)}</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-slate-655 font-medium">(+) Receitas de Obras Concluidas (Incorp. Própria, ex: Travéza)</td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">+{formatReais(cashFlowResult.sOeRec)}</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-slate-655 font-medium">(+) Provisão de AFAC / Aporte Inicial de Caixa</td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">+{formatReais(cashFlowResult.sAporte)}</td>
                            </tr>
                            
                            {/* Saídas */}
                            <tr className="bg-slate-50/50">
                              <td colSpan={2} className="py-2 px-4 font-bold text-slate-800">SAÍDAS DE RECURSOS</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-slate-655 font-medium">(&minus;) Desembolsos Diretos/Indiretos de Canteiros (Externo)</td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-red-655 text-red-600">-{formatReais(cashFlowResult.sCustoObra - cashFlowResult.sTaxaAdm - cashFlowResult.sGranito)}</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-slate-655 font-medium">(&minus;) Pagamento de Taxas Administrativas Internas</td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-red-655 text-red-600">-{formatReais(cashFlowResult.sTaxaAdm)}</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-slate-655 font-medium font-sans">(&minus;) Pagamento de Fornecimento Justfix (Granito)</td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-red-655 text-red-600">-{formatReais(cashFlowResult.sGranito)}</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-slate-655 font-medium">(&minus;) ADM Corporativa Overhead (Just S/A)</td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-red-655 text-red-600">-{formatReais(cashFlowResult.sADM)}</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-slate-655 font-medium">(&minus;) Custo Operacional de Produção Justfix</td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-red-655 text-red-600">-{formatReais(cashFlowResult.sJustfixCusto)}</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-slate-655 font-medium">(&minus;) Custo Físico com Obras de Terceiros</td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-red-655 text-red-600">-{formatReais(cashFlowResult.sOtCusto)}</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-slate-655 font-medium">(&minus;) Assistência Técnica pós-entrega (Obras Entregues)</td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-red-655 text-red-600">-{formatReais(cashFlowResult.sOeCusto)}</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-slate-655 font-medium">(&minus;) Serviço de dívida e juros corporativos</td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-red-655 text-red-600">-{formatReais(cashFlowResult.sJuros)}</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-slate-655 font-medium">(&minus;) Amortização compulsória de empréstimos</td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-red-655 text-red-600">-{formatReais(cashFlowResult.sAmort)}</td>
                            </tr>
                          </tbody>
                          <tfoot>
                            <tr className="bg-slate-50 font-sans font-bold text-[13px]">
                              <td className="py-3 px-4 text-slate-800 font-extrabold">Saldo do Fluxo de Caixa Acumulado no Período</td>
                              <td className={`py-3 px-4 text-right font-mono font-black ${cashFlowResult.finalCash >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{formatReais(cashFlowResult.finalCash)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-12 text-center rounded-2xl border border-dashed border-slate-300">
                    <p className="text-sm text-slate-500">Cadastre pelo menos 1 lançamento ou obra em andamento para obter o fluxo consolidado.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
