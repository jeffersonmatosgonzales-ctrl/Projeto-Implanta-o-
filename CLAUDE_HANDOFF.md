# 💎 MANUAL DE TRANSIÇÃO E GOVERNANÇA TÉCNICA — GRUPO JUST S.A.
> **Para o Claude Code Desktop e o Diretor Financeiro (CFO) Jefferson Gonzales**

Este documento é o **mapa de bordo oficial** do projeto. Ele foi planejado para que você, **CFO Jefferson**, possa apresentar e carregar diretamente no **Claude Code** em sua máquina desktop, guiando o modelo de IA no desenvolvimento de lógicas complexas e na futura integração real ao Sienge ERP e a um Banco de Dados Local.

---

## 📅 STATUS DO PROJETO E REGRAS DE PRUMO (Métricas Atuais de Junho/2026)

Este projeto simula e consolida a operação financeira e física do Grupo JUST S.A. com as suas Sociedades de Propósito Específico (SPEs).

### 1. Regras de Entrada e Receita da Holding (Holding Construtora Just S.A.)
A receita gerencial da Holding Just S.A. não é uma alucinação de IA. Ela é calculada com base em fórmulas e percentuais **rígidos e imutáveis**:
*   **Taxa de Administração de Obra (15%):** faturamento corporativo repassado às SPEs ativas para cobertura de overhead técnico. É calculada de forma matemática estrita como a soma de `custoRealizado` de todas as obras atualmente no estágio **"Em Construção"** multiplicada por **`0.15` (15%)**.
*   **Justfix (6%):** faturamento de suprimentos técnicos (rochas ornamentais, granitos e insumos). Calculado estritamente como a soma dos custos realizados de obras ativas em construção multiplicado por **`0.06` (6%)**.
*   **Equivalência Patrimonial (CPC 18):** reconhecimento contábil reflexo dos resultados líquidos gerados pelas SPEs proporcionalmente ao percentual de controle societário da Holding:
    *   **SPE Blank Residence Ltda:** `100%` de controle.
    *   **SPE Matera Residence Ltda:** `85%` de controle.
    *   **SPE Neo Residence Ltda:** `60%` de controle.
    *   **SPE Parque das Acácias Ltda:** `100%` de controle.

---

## 🏗️ FLUXO DE TRANSIÇÃO GERENCIAL: ESTÁGIOS DA OBRA E MATURAÇÃO DO ATIVO

### Mudança de Estágio de Obra ("Em Construção" -> "Em Repasse")
No setor imobiliário e no Sienge, o trânsito do estágio da obra (POC de 100%, expedição do Habite-se) altera significativamente as contas patrimoniais das SPEs. 

#### Regras de Ajuste Matemático Automático para a IA Desenvolver:
Quando uma obra transita do estágio **"Em Construção"** para **"Em Repasse (Pronto)"**, o Claude no desktop deve automatizar as seguintes transferências contábeis gerenciais na SPE correspondente:
1.  **Baixa de Ativo Circulante (Estoque de Imóveis em Construção):** Zera ou reduz drasticamente o saldo contábil correspondente aos custos acumulados de canteiro.
2.  **Aumento da Carteira de Recebíveis de Chaves (A Receber):** Os valores correspondentes às parcelas de chaves e repasse bancário são convertidos para o ativo circulante sob a conta **"Imóveis Entregues a Receber"** ou **"Financiamento de Clientes"**.
3.  **Cessação de Taxas Fiduciárias:** A Holding cessa instantaneamente o faturamento da **Taxa de Administração de Obra de 15%** e do **Justfix (6%)** sobre essa obra, já que os custos diretos de canteiro cessaram. O faturamento da Just S.A. passa a depender da Equivalência Patrimonial (reconhecimento dos lucros gerados pela entrega das chaves e quitação).

---

## 📡 INTEGRAÇÃO REAL COM O SIENGE ERP (API GATEWAY)

Para sair do ambiente de testes estáticos com simulação e conectar-se diretamente às planilhas e balancetes do Sienge, o Claude Code no seu desktop precisará configurar um **Sienge Gateway Service** no backend (atualmente em `server.ts`).

### 1. Parâmetros de Autenticação do Sienge
O Sienge trabalha com autenticação via protocolo **Basic Auth** (utilizando `usuário` e `senha/token` do usuário integrador) no cabeçalho das requisições, associado à URL do seu subdomínio configurado.
```bash
## Formato do Cabeçalho de Requisição (Headers)
Authorization: Basic [Token gerado pelo portal de integrações do Sienge]
Content-Type: application/json
```

### 2. Principais Endpoints do Sienge para Integrar:
*   **Listagem de Obras e Status:**
    `GET https://{just}.sienge.com.br/api/v1/obras`
    *Objetivo:* Puxar os nomes das obras, códigos internos e status (POC físico).
*   **Custos Ativos Realizados (Acompanhamento Orçamentário):**
    `GET https://{just}.sienge.com.br/api/v1/planejamento/orcamento-realizado`
    *Objetivo:* Extrair os custos incorridos reais por mês (`custoRealizado` acumulado) para alimentar dinamicamente a taxa de 15% da Just Holding.
*   **POC Físico e Financeiro:**
    `GET https://{just}.sienge.com.br/api/v1/planejamento/poc`
    *Objetivo:* Trazer de forma precisa o indicador físico medido no canteiro pelo engenheiro responsável.

---

## 🗄️ BLUEPRINT DA ARQUITETURA DE BANCO DE DADOS LOCAL
Para garantir a máxima confiabilidade dos dados contábeis, é fundamental substituir a memória estática ("mockData") por um banco de dados relacional que possa rodar localmente no seu computador (como SQLite ou DuckDB) sem custos de nuvem.

### Proposta de Schema Relacional (Tabelas Essenciais):

```sql
-- 1. Tabela de SPEs (Sociedades de Propósito Específico)
CREATE TABLE spes (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    cnpj TEXT UNIQUE NOT NULL,
    participacao_just REAL NOT NULL, -- ex: 85.0 (representando 85%)
    caixa_atual REAL NOT NULL DEFAULT 0,
    receita_projetada REAL NOT NULL,
    receita_recebida REAL NOT NULL,
    despesa_realizada REAL NOT NULL,
    distribuido_acumulado REAL NOT NULL,
    status_fisico_geral REAL NOT NULL DEFAULT 0,
    alavancagem_bancaria REAL NOT NULL DEFAULT 0,
    estoque_a_vender REAL NOT NULL DEFAULT 0,
    imoveis_entregues_receber REAL NOT NULL DEFAULT 0,
    contas_a_pagar_fornecedores REAL NOT NULL DEFAULT 0
);

-- 2. Tabela de Obras (Módulo BuildIQ / POC Sienge)
CREATE TABLE obras (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    spe_id TEXT NOT NULL,
    localizacao TEXT NOT NULL,
    progresso_fisico REAL NOT NULL, -- POC
    progresso_financeiro REAL NOT NULL,
    orcamento_total REAL NOT NULL,
    custo_realizado REAL NOT NULL,
    vendas_progresso REAL NOT NULL,
    custo_orcado_m2 REAL NOT NULL,
    custo_real_m2 REAL NOT NULL,
    unidades_totais INTEGER NOT NULL,
    unidades_vendidas INTEGER NOT NULL,
    ticket_medio REAL NOT NULL,
    status TEXT NOT NULL, -- 'Planejamento', 'Em Construção', 'Finalizada'
    estagio TEXT NOT NULL, -- 'Previsto', 'Em Construção', 'Em Repasse', 'Em Garantia'
    FOREIGN KEY (spe_id) REFERENCES spes(id) ON DELETE CASCADE
);

-- 3. Histórico de Transações de Reconciliação
CREATE TABLE transacoes (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    descricao TEXT NOT NULL,
    categoria TEXT NOT NULL, -- 'Aporte', 'Venda', 'Fornecedor', 'Impostos', etc.
    valor REAL NOT NULL,
    spe_id TEXT NOT NULL,
    status TEXT NOT NULL, -- 'Reconciliado', 'Pendente'
    FOREIGN KEY (spe_id) REFERENCES spes(id) ON DELETE CASCADE
);
```

*Por que usar SQLite?* O SQLite cria um único arquivo `.db` simples na raiz da pasta do seu projeto. É extremamente rápido, robusto, 100% gratuito e não exige instalação de nenhum servidor pesado na sua máquina local.

---

## 💬 PROMPT MESTRE PARA FORNECER AO CLAUDE CODE (Copie e Cole!)

Quando você clonar do seu GitHub para a sua máquina física e iniciar o **Claude Code** pela primeira vez na pasta do projeto, copie e cole exatamente o texto abaixo na linha de comando:

```text
Olá Claude! Eu não sou desenvolvedor, sou Jefferson Gonzales, especialista em finanças e CFO do Grupo JUST S.A. 

Desenvolvi o rascunho visual e lógico dessa aplicação utilizando um ambiente assistido de IA, e agora preciso da sua ajuda como um arquiteto sênior para migrar esta plataforma de um estado de teste (mock/simulado) para um sistema profissional de produção local.

Peço que você leia os arquivos CLAUDE.md e CLAUDE_HANDOFF.md na raiz do projeto. Eles contêm todas as minhas regras de negócio exatas e o escopo financeiro.

Nossos objetivos estratégicos imediatos neste workspace local são:
1. Configurar um banco de dados local leve com SQLite usando Drizzle ORM ou Node-SQLite para salvar o estado das SPEs, Obras e Lançamentos.
2. Implementar a automação financeira do Estágio da Obra: quando mudamos uma obra para "Em Repasse", o sistema deve recalcular matematicamente os recebíveis, baixar o estoque físico de "imóveis em construção" e desativar o faturamento da taxa de administração de 15% da Just Holding.
3. Criar uma camada de serviço mockada, mas com APIs tipadas prontas, para espelhar as chamadas do Gateway do Sienge ERP (Basic Auth, endpoints de custos e POC de progresso físico).

Como podemos esquematizar isso juntos de forma segura e incremental na minha máquina?
```

---

## 🛠️ CONSELHO AMIGO AO CFO JEFFERSON: CLAUDE CODE VS. BASE 44

Agora que esclarecemos que a **Base44** à qual você se referia é a inovadora startup israelense de Inteligência de Dados, aqui está uma análise financeira e operacional realista para apoiar sua tomada de decisão:

1.  **Por que começar pelo Claude Code no Desktop:**
    *   **Controle Total do Código e Custos:** O Claude Code trabalha diretamente com os seus arquivos locais sem limite de flexibilidade. Como você está formatando a base financeira específica da JUST S.A. (com suas taxas específicas de 15%, CPC 18 fiduciário e modelagem de repasse de chaves), o Claude permite escrever uma plataforma personalizada sem taxas mensais exorbitantes e sem ficar preso a um software engessado.
    *   **Prototipagem Segura:** É o melhor ambiente para criar o seu banco de dados local (SQLite) sem gastar nada com infraestrutura de nuvem, permitindo que você valide o aplicativo 100% com dados gerenciais locais antes de contratar uma consultoria.
2.  **Onde entra o papel de uma plataforma israelense/pesada (como a Base44):**
    *   Essas plataformas corporativas de IA são excelentes para processamento de linguagem natural focado em documentos imobiliários complexos de escala global (ex: leitura automática de milhares de notas fiscais, contratos de financiamento, minutas de SPE e análises de mercado por satélite).
    *   **Contudo**, elas não vêm prontas com a sua estrutura de controle gerencial da holding JUST S.A. Você precisaria customizar as integrações de qualquer forma, o que envolve custos altos e ferramentas de terceiros.
3.  **A Rota de Sucesso Recomendada (O Prumo Estratégico):**
    *   **Fase 1:** Use o **Claude Code Desktop** para consolidar a lógica financeira, criar o banco de dados SQLite local no seu computador e estruturar a dashboard integrada exatamente como você e seus sócios precisam.
    *   **Fase 2:** Com as regras matemáticas validadas no app local e estruturado, você pode contratar ou direcionar um programador parceiro por poucas horas para conectar os endpoints de API do Sienge ERP real da sua empresa às portas do banco de dados SQLite/PostgreSQL que o Claude Code estruturou.
    *   Este é o caminho mais barato, rápido, e que garante **15% de taxa de administração** real calculada à prova de falhas!

---
*JUST S.A. — Gestão Ativa, Governança Fiduciária e Transparência Contra Alucinações.*
