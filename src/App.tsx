import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Coins, 
  Scale, 
  LayoutDashboard, 
  Menu, 
  X, 
  Sparkles, 
  User, 
  Building,
  HelpCircle,
  Database,
  Grid,
  Sliders
} from 'lucide-react';

import { 
  mockSPEs, 
  mockObras, 
  mockTransacoes, 
  mockAIAgents, 
  mockReconciliation 
} from './data/mockData';
import { TransacaoFinanceira } from './types';

// Import our modular screens
import ExecutiveOverview from './components/ExecutiveOverview';
import BuildIQ from './components/BuildIQ';
import FinanceFlow from './components/FinanceFlow';
import Reconciliation from './components/Reconciliation';
import StrategicPlan from './components/StrategicPlan';

export default function App() {
  const [currentView, setCurrentView] = useState<'overview' | 'strategic' | 'buildiq' | 'financeflow' | 'reconciliation'>('overview');
  
  // App-level state for real-time interactivity
  const [spes, setSpes] = useState(mockSPEs);
  const [obras, setObras] = useState(mockObras);
  const [transacoes, setTransacoes] = useState(mockTransacoes);
  const [records, setRecords] = useState(mockReconciliation);
  const [agents, setAgents] = useState(mockAIAgents);
  
  const [selectedSpeId, setSelectedSpeId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interaction handlers
  const handleAddTransacao = (newTx: Omit<TransacaoFinanceira, 'id'>) => {
    const nextId = `tx-${String(transacoes.length + 1).padStart(3, '0')}`;
    const transactionWithId: TransacaoFinanceira = {
      ...newTx,
      id: nextId
    };

    // Update transactions list
    setTransacoes(prev => [transactionWithId, ...prev]);

    // Dynamic state propagation: update associated SPE's cash position!
    setSpes(prevSpes => prevSpes.map(spe => {
      if (spe.id === newTx.speId) {
        return {
          ...spe,
          caixaAtual: Math.max(0, spe.caixaAtual + newTx.valor)
        };
      }
      return spe;
    }));

    // Increment AI Agent stats to demonstrate active automated pipelines
    setAgents(prev => prev.map(agent => {
      if (agent.tipoFonte === 'ERP' || agent.tipoFonte === 'Extratos de SPE') {
        return {
          ...agent,
          itensProcessadosHoje: agent.itensProcessadosHoje + 1,
          ultimaExtracao: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
        };
      }
      return agent;
    }));
  };

  const handleCorrectDivergence = (recordId: string) => {
    // Audit Correction: aligning book/accounting figures with real asset physical progress PoC
    setRecords(prevRecords => prevRecords.map(rec => {
      if (rec.id === recordId) {
        return {
          ...rec,
          valorContabil: rec.valorMensuradoRevolt, // reconcile and matching values
          divergencia: 0,
          statusReconciliacao: 'Concluído' as const
        };
      }
      return rec;
    }));

    // Update AI Agent logs
    setAgents(prev => prev.map(agent => {
      if (agent.id === 'agent-bancos') {
        return {
          ...agent,
          itensProcessadosHoje: agent.itensProcessadosHoje + 1,
          status: 'Processando'
        };
      }
      return agent;
    }));
  };

  const handleSelectSPE = (speId: string | null) => {
    setSelectedSpeId(speId);
    if (speId) {
      setCurrentView('financeflow');
    }
  };

  const handleNavigate = (view: 'overview' | 'strategic' | 'buildiq' | 'financeflow' | 'reconciliation') => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  // Menu items list
  const navItems = [
    { id: 'overview', name: 'Dashboard Consolidado', icon: LayoutDashboard },
    { id: 'strategic', name: 'Planejamento e Projeções (F5)', icon: Sliders },
    { id: 'buildiq', name: 'Módulo BuildIQ (Obras)', icon: Building2 },
    { id: 'financeflow', name: 'Módulo FinanceFlow', icon: Coins },
    { id: 'reconciliation', name: 'Reconciliação Patrimonial', icon: Scale },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col antialiased text-slate-800">
      
      {/* Upper Status Banner (Governance reminder) */}
      <div className="bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 py-1.5 px-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Conselho Fiscal: Ativo
          </span>
          <span className="text-slate-600">|</span>
          <span className="hidden md:inline">Instalação: Construtora Just S/A - Ambientes de SPE Integrados</span>
        </div>
        <div className="font-mono text-slate-500 flex items-center gap-2">
          <span>Relógio Geral: 12 Jun 2026</span>
          <span className="bg-slate-800 text-slate-300 px-1 rounded text-[9.5px]">UTC-3</span>
        </div>
      </div>

      {/* Main Framework Frame */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Sidebar Frame - Hidden on small layouts, permanent on medium+ */}
        <aside className="hidden md:flex flex-col justify-between w-64 bg-slate-900 text-slate-200 border-r border-slate-800 p-6 space-y-8 z-10 select-none">
          <div className="space-y-8">
            {/* Group Logo */}
            <div className="space-y-1 pb-4 border-b border-slate-800">
              <div className="text-white font-extrabold text-lg tracking-wider font-sans flex items-center gap-2">
                <Building className="w-5 h-5 text-orange-500" />
                <span>JUST</span>
                <span className="text-orange-500 text-xs font-mono font-medium tracking-normal align-super px-1 bg-orange-500/10 rounded">S.A.</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">CONSTRUTORA E INCORPORADORA</p>
            </div>

            {/* Navigation links */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block mb-3">Menu Estratégico</span>
              
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold tracking-tight transition cursor-pointer ${
                        isActive 
                          ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/20' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Sidebar Footer - Active User status */}
          <div className="border-t border-slate-800 pt-5 space-y-4 font-sans text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-orange-400 border border-slate-700">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-[11px] truncate w-36">Jefferson Gonzales</h4>
                <p className="text-[10px] text-slate-500 font-mono">Diretor Financeiro (CFO)</p>
              </div>
            </div>
            
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800/80 text-[10px] text-slate-400 font-mono space-y-1">
              <div className="flex justify-between items-center text-[9.5px]">
                <span>Status de Conexão</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[9px] text-slate-500">Acesso via Token Seguro CVM</p>
            </div>
          </div>
        </aside>

        {/* Responsive Mobile Top Navigation Bar */}
        <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-orange-500" />
            <span className="font-black text-sm tracking-widest font-sans">JUST INDUSTRIAL</span>
          </div>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 bg-slate-800 hover:bg-slate-750 text-white rounded-lg transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Dropdown Menu Items */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900 border-b border-slate-800 absolute top-12 left-0 right-0 z-30 overflow-hidden text-slate-200 text-xs px-5 py-4 space-y-3"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left font-sans font-bold ${
                      isActive ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
              
              <div className="border-t border-slate-800 pt-3 flex items-center gap-3 text-[11px] text-slate-400">
                <User className="w-4 h-4 text-orange-500" />
                <span>Jefferson Gonzales (CFO)</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Strategic Dashboard Workspace Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-[1400px] mx-auto w-full transition-all duration-300 pb-20 md:pb-8">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {currentView === 'overview' && (
                <ExecutiveOverview 
                  spes={spes}
                  obras={obras}
                  agents={agents}
                  onNavigateToView={handleNavigate}
                  onSelectSPE={handleSelectSPE}
                />
              )}

              {currentView === 'strategic' && (
                <StrategicPlan />
              )}

              {currentView === 'buildiq' && (
                <BuildIQ 
                  obras={obras}
                  onBackToOverview={() => handleNavigate('overview')}
                />
              )}

              {currentView === 'financeflow' && (
                <FinanceFlow 
                  spes={spes}
                  transacoes={transacoes}
                  onAddTransacao={handleAddTransacao}
                  selectedSpeId={selectedSpeId}
                  onSelectSPE={setSelectedSpeId}
                />
              )}

              {currentView === 'reconciliation' && (
                <Reconciliation 
                  records={records}
                  onCorrectDivergence={handleCorrectDivergence}
                />
              )}
            </motion.div>
          </AnimatePresence>

        </main>
      </div>
    </div>
  );
}
