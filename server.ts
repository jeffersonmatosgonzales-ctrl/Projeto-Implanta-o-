import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Endpoint for Interactive AI Auditor / Copilot
app.post("/api/ai/audit", async (req, res) => {
  const { query, spes, obras, reconciliationRecords } = req.body;

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: "A chave API do Gemini (GEMINI_API_KEY) não está configurada no servidor. Por favor, configure-a no painel Settings > Secrets do AI Studio." 
      });
    }

    // Design a pristine real estate fiduciary prompt containing the active portfolio
    const systemPrompt = `Você é o "Fidu-Auditor Co-Piloto", um assessor de inteligência fiduciária e auditoria sênior desenvolvido exclusivamente para o Grupo JUST S.A., em particular para Jefferson Gonzales, o CFO/Diretor Financeiro.

Seu tom deve ser altamente profissional, preciso em termos contábeis e financeiros, de alta governança fiduciária, e focado em engenharia de incorporação (POC, SPEs, capital de giro, prumo, mútuos, equivalência contábil CPC 18, custos por metro quadrado).

Aqui está o contexto de dados atualizados em tempo real do ERP Sienge e das Contas Bancárias fiduciárias que o usuário possui:

### 1. SOCIEDADES DE PROPÓSITO ESPECÍFICO (SPEs) ATIVAS (Participação Societária Real do Grupo JUST: Blank 100%, Matera 85%, Neo 60%, Acácias 100%)
${JSON.stringify(spes, null, 2)}

### 2. DETALHAMENTO DE OBRAS (BuildIQ)
${JSON.stringify(obras, null, 2)}

### 3. REGISTROS DE RECONCILIAÇÃO CONTÁBIL E FLUXO
${JSON.stringify(reconciliationRecords, null, 2)}

DIRETRIZES DE RESPOSTA:
1. Responda em português brasileiro.
2. Seja objetivo, focado e prático. Evite termos genéricos ou "introduções de robô". Vá direto ao prumo analítico.
3. Use marcações em negrito para destacar valores e métricas críticas.
4. Lembre que os valores de Blank (100%), Matera (85%), Neo (60%) e Acácias (100%) referem-se à PORCENTAGEM DE PARTICIPAÇÃO SOCIETÁRIA da JUST em cada SPE para consolidação por equivalência patrimonial (CPC 18), e nunca a "taxas" tributárias ou de serviço.
5. Se o usuário perguntar sobre desvios ou custos por m², use os dados de BuildIQ (e.g. Matera com custo orçado vs real por m²).
6. Esclareça quaisquer dúvidas contábeis com base na realidade fiduciária das SPEs ativas do Grupo JUST S.A.
7. Explique o impacto de forma estratégica para mitigar riscos de subcapitalização e coordenar fiduciariamente os dividendos reflexos (CPC 18).`;

    const chatInput = query || "Por favor, faça uma auditoria geral rápida do caixa das SPEs, indicando onde estão os maiores riscos e o que o CFO Jefferson Gonzales deve priorizar hoje.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatInput,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2, // Low temperature for consistent, strict analytical results
      },
    });

    const answer = response.text;
    res.json({ result: answer });

  } catch (error: any) {
    console.error("Erro na chamada da API do Gemini:", error);
    res.status(500).json({ 
      error: `Falha na verificação inteligente de auditoria: ${error?.message || error}` 
    });
  }
});

// Setup dev vs production bundle flow
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode with Vite running in-memory
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode serving compressed bundle from dist/
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[JUST PLATFORM SERVER] Ativo em http://localhost:${PORT} (Express + Vite Handoff)`);
  });
}

startServer();
