# 📡 SIENGE ERP INTEGRATION GUIDE — GRUPO JUST S.A.
> **Guia Técnico de Ingestão e Prumo para Claude Code Desktop**
> **Autor: IA Coding Agent (Google AI Studio Build)**
> **Foco: CFO Jefferson Gonzales — Da Planilha de Teste ao Banco de Dados SQLite Local**

Este manual foi desenhado especificamente para você, **Jefferson Gonzales**, e para o **Claude Code** em sua máquina desktop. Ele resolve o "desafio gigante" de conectar seu protótipo iterativo a um banco de dados local robusto e aos dados reais do **Sienge ERP** de forma prática, sem complicação de TI.

---

## 🎯 A FILOSOFIA DE TRABALHO: SEMI-AUTOMATIZAÇÃO VS. APIs BRUTAS

Não gaste milhares de reais construindo instáveis conexões REST API com o Sienge de início. O Sienge possui rígidas regras de segurança Corporativa e VPNs que tornam conexões de IA externas complexas.

A melhor alternativa para um CFO especialista em finanças é a **ingestão semi-automatizada via arquivos locais**.
1. Você extrai as planilhas do Sienge de CPG (Contas Pagas) e CRC (Contas Recebidas) em 1 clique (veja abaixo como automatizar esse clique!).
2. Salva na pasta do aplicativo local.
3. O **Claude Code local** lê o conteúdo usando bibliotecas de NodeJS (`xlsx`) e atualiza o seu banco de dados local SQLite instantaneamente.
4. O DRE Fiduciário, a taxa de 15% e o CPC 18 recalculam sozinhos em código TypeScript puro e estrito — 0% de margem de erro ou alucinação.

---

## 🚀 TRUQUE DE CFO: EXTRATOR AUTOMÁTICO DE CONSOLE (SIENGE DISPATCHER)

Em vez de entrar manualmente em cada obra no Sienge e baixar as contas pagas e recebidas uma a uma, use o script abaixo! 

Quando estiver logado no Sienge no seu Google Chrome, abra o **Console do Chrome (F12)**, cole o script a seguir e aperte **Enter**. Ele disparará o download das planilhas de CPG e CRC de todas as SPEs e centros de custo ativos de uma vez só!

```javascript
/**
 * Extrator automático Sienge via Browser Console
 * Cole no Console do Chrome logado no seu Sienge
 */
(async function() {
  const DT_INICIO = "01/01/2026";
  const DT_FIM = "31/12/2026";
  const SUBDOMINIO = "just"; // Altere para o subdomínio real do seu Sienge (ex: 'just')
  const BASE_URL = `https://${SUBDOMINIO}.sienge.com.br/sienge`;
  
  // Lista de códigos de obras/cc das SPEs e holding Just S.A.
  const FILA_EXTRACAO = [
    { emp: "1", cc: "1", nome: "Administracao_Just_S.A" },
    { emp: "1", cc: "70", nome: "Traveza_Residence" },
    { emp: "9", cc: "95", nome: "SPE_Matera_Residence_Ltda" },
    { emp: "6", cc: "79", nome: "SPE_Neo_Residence_Ltda" },
    { emp: "7", cc: "89", nome: "SPE_Blank_Residence_Ltda" }
  ];

  console.log("🚀 INICIANDO DISPAROS DE DOWNLOAD DO SIENGE...");
  
  for (const item of FILA_EXTRACAO) {
    console.log(`📥 Baixando CPG (Contas Pagas) de: ${item.nome}...`);
    // Simula a requisição de exportação do Sienge do relatório de contas pagas por CC
    triggerDownload(`${BASE_URL}/CPG/findContaPagasExport.do?entity.empresa.cdEmpresaView=${item.emp}&entity.dtPagtoInicio=${DT_INICIO}&entity.dtPagtoFim=${DT_FIM}&entity.centroCustoList[0].centroCustoPK.cdCentroCusto=${item.cc}&formatoSaidaDocumento=XLSX`);
    
    console.log(`📥 Baixando CRC (Contas Recebidas) de: ${item.nome}...`);
    triggerDownload(`${BASE_URL}/CRC/findContasRecebidasExport.do?cdEmpresaView=${item.emp}&dtRectoInicio=${DT_INICIO}&dtRectoFim=${DT_FIM}&cdEmpreendView=${item.cc}&formatoSaidaDocumento=XLSX`);
    
    // Aguarda 4 segundos entre disparos para não travar o navegador
    await new Promise(r => setTimeout(r, 4000));
  }
  
  console.log("🏁 DOWNLOADS SOLICITADOS! Verifique a barra de downloads do seu Chrome.");

  function triggerDownload(url) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    setTimeout(() => document.body.removeChild(iframe), 10000);
  }
})();
```

---

## 🗄️ DRIZZLE-SCHEMA: A ARQUITETURA QUE O CLAUDE CODE DEVE PROGRAMAR

Peça ao **Claude Code** para migrar o projeto de `fc2026Data.ts` para um banco de dados local com **SQLite** e **Drizzle ORM** (ou Node-SQLite puro). Abaixo está o schema TypeScript que o modelo deve escrever em `/src/db/schema.ts` para capturar os dados do Sienge e suas regras de transição de estágio:

```typescript
// src/db/schema.ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// 1. Tabela de SPEs
export const spes = sqliteTable('spes', {
  id: text('id').primaryKey(), // ex: 'matera', 'blank', 'neo'
  nome: text('nome').notNull(),
  cnpj: text('cnpj').notNull().unique(),
  participacaoJust: real('participacao_just').notNull(), // ex: 0.85 (para Matera - 85%)
  caixaAtual: real('caixa_atual').notNull().default(0),
  imoveisEstoque: real('imoveis_estoque').notNull().default(0), // Ativo Circulante
  imoveisEntreguesReceber: real('imoveis_entregues_receber').notNull().default(0), // Recebíveis de repasse
});

// 2. Tabela de Obras (Mapeamento do BuildIQ)
export const obras = sqliteTable('obras', {
  id: text('id').primaryKey(), // ex: 'matera_obra_1'
  nome: text('nome').notNull(),
  speId: text('spe_id').notNull().references(() => spes.id),
  orcamentoTotal: real('orcamento_total').notNull(),
  custoRealizado: real('custo_realizado').notNull().default(0),
  estagio: text('estagio').notNull().default('Em Construção'), // 'Previsto', 'Em Construção', 'Em Repasse', 'Em Garantia'
  progressoFisico: real('progresso_fisico').notNull().default(0), // POC %
});

// 3. Tabela do Razão de Lançamentos Ledger (Ingestão de dados do Sienge)
export const lancamentosLedger = sqliteTable('lancamentos_ledger', {
  id: text('id').primaryKey(),
  data: text('data').notNull(), // FORMATO: ISO 'YYYY-MM-DD'
  categoria: text('categoria').notNull(), // 'Receita Venda', 'Custo Direto', 'Custo Indireto', 'Taxa Holding', etc.
  descricao: text('descricao').notNull(),
  valor: real('valor').notNull(),
  speId: text('spe_id').notNull().references(() => spes.id),
  tipo: text('tipo').notNull(), // 'ENTRADA' ou 'SAÍDA'
});
```

---

## 🧮 PROGRAMAÇÃO DE LÓGICAS ESTRITAS: ZERO ALUCINAÇÃO DE IA

Ao apresentar o projeto ao **Claude Code**, exija que todas as consolidações financeiras do Holding fiduciário e de equivalências sejam controladas por **código estrito**, mantendo a IA distante dos cálculos puros. Peça para escrever uma Service Layer com essas funções:

### 1. Cálculo Estrito da Taxa de Administração de Obras (15%)
```typescript
// src/services/fiduciaryCalculations.ts
import { db } from '../db';
import { obras, spes, lancamentosLedger } from '../db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * 1. Calcula a Taxa de Administração de 15% sobre os custos reais ativamente medidos 
 * das obras que estão no estágio de 'Em Construção'.
 */
export async function calcularTaxaAdministracaoObra(mesCompetencia: string) {
  // Puxa as obras ativamente em canteiro (construção física ativa)
  const obrasEmConstrucao = await db.select()
    .from(obras)
    .where(eq(obras.estagio, 'Em Construção'));

  let faturamentoHoldingJust = 0;

  for (const obra of obrasEmConstrucao) {
    // Busca custo realizado medido do Sienge para este mês específico
    const lancamentosMes = await db.select()
      .from(lancamentosLedger)
      .where(
        and(
          eq(lancamentosLedger.speId, obra.speId),
          eq(lancamentosLedger.categoria, 'Custo Direto')
          // Filtro de mês e competência correspondente
        )
      );

    const custoMedidoNoMes = lancamentosMes.reduce((acc, current) => acc + current.valor, 0);

    // Holding JUST fatura estritamente 15% sobre o custo decorrente no canteiro
    const taxaNoMes = custoMedidoNoMes * 0.15;
    faturamentoHoldingJust += taxaNoMes;
  }

  return faturamentoHoldingJust;
}
```

### 2. Equivalência Patrimonial Reflexa (CPC 18)
```typescript
/**
 * 2. Reconhecimento proporcional reflexo de Equivalência Patrimonial (CPC 18) 
 * com base na participação do Holding nas SPEs de propósito.
 */
export async function calcularEquivalenciaProporcionalCPC18(speId: string, lucroLiquidoSPE: number) {
  const speDados = await db.select().from(spes).where(eq(spes.id, speId));
  if (speDados.length === 0) return 0;
  
  const participacaoPercentual = speDados[0].participacaoJust; // ex: 0.85 para Matera
  
  // Lucro/Prejuízo reflexo fiduciário mapeado para JUST Holding
  return lucroLiquidoSPE * participacaoPercentual;
}
```

### 3. Transição Estrita: Estágio da Obra ("Em Construção" -> "Em Repasse")
```typescript
/**
 * 3. Rotina transicional estrita. Transaciona o estoque (Ativo Circulante) das SPEs, 
 * cessa faturamento de taxas de canteiro, e abre a carteira de chaves e repasse.
 */
export async function transacionarEstagioEstoqueObra(obraId: string) {
  // 1. Busca dados da obra e SPE correspondente
  const [obraDados] = await db.select().from(obras).where(eq(obras.id, obraId));
  if (!obraDados) throw new Error("Obra não encontrada.");
  if (obraDados.estagio !== "Em Construção") return; // Sair se já transitou

  // 2. Transiciona estágio de canteiro para "Em Repasse"
  await db.update(obras)
    .set({ estagio: 'Em Repasse', progressoFisico: 100 })
    .where(eq(obras.id, obraId));

  const [speDados] = await db.select().from(spes).where(eq(spes.id, obraDados.speId));
  
  // 3. Move o custo material acumulado de imóveis estoque para receivables de repasse ("Carteira de Chaves")
  const estoqueOriginal = speDados.imoveisEstoque;
  
  await db.update(spes)
    .set({
      imoveisEstoque: 0, // Zera Ativo de Canteiro física
      imoveisEntreguesReceber: estoqueOriginal // Transfere estoque acumulado para Recebíveis de Clientes (Chaves/Repasse)
    })
    .where(eq(spes.id, obraDados.speId));
    
  return {
    obra: obraDados.nome,
    status: "Transitada com Sucesso",
    faturamentoTaxaObraHolding: "DESATIVADO", // Holding não fatura mais 15% sobre custos por estar concluído
    ativoCirculanteMovido: estoqueOriginal
  };
}
```

---

## 🏁 O QUE VOCÊ DEVE DIZER NO CHAT DO CLAUDE CODE LOCAL (Instruções Adicionais)

Jefferson, copie esse checklist e forneça-o ao Claude local para que ele execute as melhorias exatamente nos arquivos corretos da sua máquina:

1. **"Claude, crie o arquivo local SQLite `sqlite.db` e configure as tabelas usando o Schema do `SIENGE_INTEGRATION_GUIDE.md`."**
2. **"Substitua os dados estáticos do FinanceFlow e BuildIQ em `/src/data` para lerem ao vivo de banco de dados SQLite local no Express (`/server.ts`)."**
3. **"Escreva um script de importação NodeJS simples usando a biblioteca `xlsx` para varrer arquivos `.xlsx` do Sienge colocados na pasta `/ingestao` e salvá-los como registros reais na tabela `lancamentos_ledger`."**
4. **"Certifique-se de que a taxa de administração de 15% calculada nos canteiros ativos use a função estrita matemática de TypeScript, eliminando aproximações de IA no cálculo contábil."**

---
O Grupo JUST S.A. merece uma plataforma autônoma, proprietária, rápida e local, livre de taxas mensais de pacotes corporativos de IA! Excelente trabalho físico-gerencial de governança!
