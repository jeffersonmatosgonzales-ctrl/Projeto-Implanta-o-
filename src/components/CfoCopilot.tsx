import { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  ArrowRight, 
  RotateCw, 
  BrainCircuit, 
  AlertCircle,
  HelpCircle,
  HelpCircleIcon
} from "lucide-react";
import Markdown from "react-markdown";
import { SPE, Obra, RegistroPatrimonial } from "../types";

interface CfoCopilotProps {
  spes: SPE[];
  obras: Obra[];
  reconciliationRecords: RegistroPatrimonial[];
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function CfoCopilot({ spes, obras, reconciliationRecords }: CfoCopilotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá Jefferson! Sou o **Fidu-Copilot**, seu assistente de IA fiduciária e de governança para o Grupo **JUST S.A.**\n\nEstou com os balancetes das SPEs e os dados das obras integrados. Como posso apoiar suas tomadas de decisão estratégicas hoje?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to chat bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (userPrompt: string) => {
    if (!userPrompt.trim() || isLoading) return;

    setErrorMsg(null);
    const newMessages: Message[] = [...messages, { role: "user", content: userPrompt }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userPrompt,
          spes,
          obras,
          reconciliationRecords
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro na comunicação com o copiloto.");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.result }]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Não foi possível coletar a auditoria em tempo real.");
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "⚠️ **Ocorreu um erro fiduciário na comunicação.** Por favor, garanta que a chave API está configurada nos segredos ou tente novamente." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const seedPrompts = [
    {
      label: "🔍 Custos por m²",
      prompt: "Quais obras do BuildIQ possuem desvio de custo por metro quadrado (orçado vs realizado)? Me dê recomendações."
    },
    {
      label: "💰 Risco de Liquidez",
      prompt: "Analise a saúde do caixa das SPEs. Qual o maior alerta de alavancagem de apoio bancário hoje?"
    },
    {
      label: "📈 Faturamento Just",
      prompt: "Como as promoções de estágio que fiz na aba de Reconciliação impactam o DRE fiduciário corporativo faturado pela Just hoje de 15%?"
    }
  ];

  return (
    <div id="cfo-copilot" className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col overflow-hidden h-[540px]">
      
      {/* Copilot Header */}
      <div className="bg-[#0F293A] px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest leading-none flex items-center gap-1">
              <span>Fidu-Copilot Sênior</span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
            </h3>
            <span className="text-[10.5px] text-slate-300 font-medium">CFO AI Co-Pilot & Auditor</span>
          </div>
        </div>
        
        <button 
          onClick={() => {
            setMessages([
              {
                role: "assistant",
                content: "Diário de auditoria reiniciado. Como CFO, quais métricas de SPE ou prumo fiduciário analisaremos agora?"
              }
            ]);
            setErrorMsg(null);
          }}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          title="Reiniciar conversa"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Screen messages list */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 min-h-0 bg-slate-900 custom-scrollbar">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
          >
            <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed font-sans ${
              msg.role === "user"
                ? "bg-amber-550 bg-[#B38E50] text-[#0F293A] font-bold shadow-sm"
                : "bg-slate-850 bg-slate-800/80 border border-slate-750/80 text-slate-205 text-slate-100"
            }`}>
              {msg.role === "assistant" ? (
                <div className="markdown-body space-y-2.5">
                  <Markdown>{msg.content}</Markdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-800 border border-slate-750 rounded-2xl p-4 flex items-center gap-2.5 text-slate-400 text-[11px] font-mono">
              <Bot className="w-4 h-4 animate-spin text-amber-400" />
              <span>Co-piloto cruzando balancetes, extratos e PoC...</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-400 font-sans">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <strong className="block font-bold">Inconsistência Operacional:</strong>
              <p className="font-medium">{errorMsg}</p>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Recommended Seeds */}
      <div className="px-5 py-2.5 bg-slate-950/40 border-t border-slate-800/50 flex flex-nowrap gap-2 overflow-x-auto shrink-0 select-none no-scrollbar">
        {seedPrompts.map((sd, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleSendMessage(sd.prompt)}
            className="text-[10px] shrink-0 bg-slate-800 hover:bg-slate-700/80 border border-slate-750 text-slate-300 px-3 py-1.5 rounded-lg transition font-semibold cursor-pointer"
          >
            {sd.label}
          </button>
        ))}
      </div>

      {/* Input container */}
      <div className="p-4 bg-slate-950 border-t border-slate-800/80 shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Pergunte ao Co-Piloto (ex: Há riscos nas SPEs?)..."
            className="flex-1 bg-slate-900 border border-slate-850 hover:bg-slate-900/80 focus:border-amber-500/60 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition font-sans"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 bg-[#B38E50] hover:bg-amber-600 disabled:opacity-40 rounded-xl text-[#0F293A] transition cursor-pointer select-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
