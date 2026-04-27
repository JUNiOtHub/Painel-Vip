import React, { useEffect, useState, useRef } from 'react';
import { 
  Shield, Activity, Crosshair, Zap, Power, Lock, User, Radar, Cpu, 
  Terminal, Eye, Target, Menu, X, Download, Monitor, Smartphone, 
  CheckCircle2, ChevronRight, Settings, BarChart3, Fingerprint,
  Layers, Database, Network, Ghost, Sparkles, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [downloadStep, setDownloadStep] = useState(1);
  const [isInjecting, setIsInjecting] = useState(false);

  const [stats, setStats] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  useEffect(() => {
    const cachedAuth = localStorage.getItem('axyon_auth');
    if (cachedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const [s, c, l] = await Promise.all([
          fetch('/api/stats').then(r => r.json()),
          fetch('/api/config').then(r => r.json()),
          fetch('/api/logs').then(r => r.json())
        ]);
        setStats(s);
        setConfig(c);
        setLogs(l);
      } catch (err) {
        console.error('Data sync failed', err);
      }
    };

    fetchData();
    const iv = setInterval(fetchData, 2000);

    const terminalLines = [
      "Bypassing kernel security layer...",
      "Injecting polymorphic offsets...",
      "Memory spoofing active: AES-256-V3",
      "Intercepting ballistics packets...",
      "Anti-cheat pattern masked successfully",
      "Rotating session keys...",
      "Normalizing network jitter...",
      "Headshot synchronization stable",
      "Bypassing hardware identification...",
      "Packet integrity shield verified",
      "Protocol: ANTI_CHEST_LOCK V3 ENABLED",
      "Protocol: 360_HEAD_MATRIX RECOGNITION ACTIVE"
    ];

    const terminalIv = setInterval(() => {
      setTerminalOutput(prev => {
        const newLine = `[SYSTEM] ${terminalLines[Math.floor(Math.random() * terminalLines.length)]}`;
        return [newLine, ...prev.slice(0, 20)];
      });
    }, 2500);

    return () => {
      clearInterval(iv);
      clearInterval(terminalIv);
    };
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((username === 'admin' && password === 'admin') || (username === 'ronaldo' && password === 'admin')) {
      setIsAuthenticated(true);
      localStorage.setItem('axyon_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('CREDENTIALS REJECTED. ACCESS DENIED.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('axyon_auth');
  };

  const setConfigValue = async (group: string, key: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [group]: { ...prev[group], [key]: value }
    }));

    await fetch('/api/config/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ group, key, value })
    });
  };

  const toggleConfig = async (group: string, key: string, currentValue: boolean) => {
    const newValue = !currentValue;
    setConfig((prev: any) => ({
      ...prev,
      [group]: { ...prev[group], [key]: newValue }
    }));

    await fetch('/api/config/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ group, key, value: newValue })
    });
  };

  const handleInject = async () => {
    setIsInjecting(true);
    setTerminalOutput(prev => ["[NUR] Synchronizing Neural Params...", ...prev]);
    
    await fetch('/api/inject', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentConfig: config })
    });

    setTimeout(() => {
      setIsInjecting(false);
      window.location.href = 'freefire://';
    }, 2000);
  };

  const handleScanNetwork = async () => {
    setIsScanning(true);
    try {
      await fetch('/api/scan-network');
    } finally {
      setIsScanning(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-amber-500 font-display flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 scanline opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-black to-black" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-neutral-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            
            <div className="text-center mb-10">
              <motion.div 
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="w-20 h-20 bg-amber-500/10 rounded-3xl border border-amber-500/20 mx-auto mb-6 flex items-center justify-center glass shadow-[0_0_40px_rgba(245,158,11,0.2)]"
              >
                <Fingerprint className="w-10 h-10 text-amber-500" />
              </motion.div>
              <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
                PAINEL <span className="text-amber-500">VIP</span>
              </h1>
              <p className="text-[9px] font-mono tracking-[0.6em] text-amber-500 mt-2 uppercase">DOS FAMOSOS - EXCLUSIVE CLUB</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase ml-2">Operator ID</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-[1.25rem] py-4 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500/50 transition-all font-mono text-sm"
                    placeholder="ENTER VIP KEY..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase ml-2">Secret Code</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-[1.25rem] py-4 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500/50 transition-all font-mono text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {loginError && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-[10px] text-red-500 font-bold uppercase tracking-widest text-center"
                >
                  {loginError}
                </motion.div>
              )}

              <button type="submit" className="w-full group bg-amber-600 hover:bg-amber-500 text-white font-black py-5 rounded-2xl transition-all shadow-[0_20px_40px_-10px_rgba(245,158,11,0.4)] mt-6 relative overflow-hidden active:scale-95">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10 tracking-[0.3em] font-display">ENTRAR NO VIP</span>
              </button>
            </form>
          </div>
          
          <div className="mt-8 flex justify-center gap-4 text-neutral-500 font-mono text-[9px] uppercase tracking-widest opacity-40">
            <span>Server: STABLE</span>
            <span>Latency: 12ms</span>
            <span>Version: 17.5.0</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!stats || !config) return (
    <div className="min-h-screen bg-black text-amber-500 flex flex-col items-center justify-center font-mono relative overflow-hidden">
      <div className="absolute inset-0 scanline opacity-20" />
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-2xl font-black tracking-tighter"
      >
        VIP_AUTHENTICATING...
      </motion.div>
      <div className="w-64 h-1 bg-neutral-900 rounded-full mt-6 relative overflow-hidden">
        <motion.div 
           initial={{ x: '-100%' }}
           animate={{ x: '100%' }}
           transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
           className="absolute inset-0 w-32 bg-amber-500"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030303] text-neutral-100 font-sans selection:bg-amber-500/30 selection:text-white">
      {/* Visual background layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(245,158,11,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_100%,rgba(245,158,11,0.05)_0%,transparent_50%)]" />
        <div className="absolute inset-0 scanline opacity-10" />
      </div>

      {/* Sidebar - Desktop Only */}
      <div className="fixed left-0 top-0 h-full w-[80px] glass-dark border-r border-white/5 z-[100] hidden lg:flex flex-col items-center py-10 gap-10">
        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center glow-amber animate-pulse">
          <Crosshair className="w-6 h-6 text-black" />
        </div>
        
        <div className="flex flex-col gap-6 flex-1">
          <SidebarLink icon={<Activity />} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} tooltip="Core Control" />
          <SidebarLink icon={<Terminal />} active={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')} tooltip="Console" />
          <SidebarLink icon={<Target />} active={activeTab === 'arsenal'} onClick={() => setActiveTab('arsenal')} tooltip="Arsenal" />
          <SidebarLink icon={<Shield />} active={activeTab === 'security'} onClick={() => setActiveTab('security')} tooltip="Bypass Status" />
          <SidebarLink icon={<Settings />} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} tooltip="Neural Config" />
        </div>

        <button 
          onClick={handleLogout}
          className="p-4 text-neutral-600 hover:text-amber-500 transition-colors duration-300"
        >
          <Power className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full h-16 glass-dark border-b border-white/5 z-[110] px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crosshair className="w-6 h-6 text-amber-500" />
          <span className="font-display font-black tracking-tighter text-lg italic uppercase">PAINEL <span className="text-amber-400">VIP</span></span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-amber-500">
           {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-black z-[105] pt-24 px-8 flex flex-col gap-4"
          >
            <MobileTabLink icon={<Activity />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => {setActiveTab('dashboard'); setIsMenuOpen(false);}} />
            <MobileTabLink icon={<Terminal />} label="Terminal" active={activeTab === 'terminal'} onClick={() => {setActiveTab('terminal'); setIsMenuOpen(false);}} />
            <MobileTabLink icon={<Target />} label="Arsenal" active={activeTab === 'arsenal'} onClick={() => {setActiveTab('arsenal'); setIsMenuOpen(false);}} />
            <MobileTabLink icon={<Shield />} label="Bypass" active={activeTab === 'security'} onClick={() => {setActiveTab('security'); setIsMenuOpen(false);}} />
            <MobileTabLink icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => {setActiveTab('settings'); setIsMenuOpen(false);}} />
            <div className="mt-auto mb-10">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-4 bg-amber-600/10 border border-amber-500/30 p-5 rounded-3xl text-amber-500 font-black tracking-widest"
              >
                <Power className="w-6 h-6" /> LOGOUT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="lg:ml-[80px] p-6 lg:p-12 max-w-7xl mx-auto pt-24 lg:pt-12 relative z-10 min-h-screen">
        
        {/* Top Intelligence Bar */}
        <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
           <div className="space-y-1">
              <div className="flex items-center gap-3">
                 <h1 className="text-4xl lg:text-5xl font-display font-black tracking-tighter uppercase italic">
                    PAINEL VIP <span className="text-amber-500">FAMOSOS</span>
                 </h1>
                 <div className="hidden sm:flex px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-amber-500 font-black tracking-widest uppercase italic">BYPASS INVISÍVEL ATIVO</span>
                 </div>
              </div>
              <p className="text-neutral-500 font-mono text-[10px] tracking-[0.4em] uppercase font-bold opacity-60">Version {config.VERSION} // Build_ID: {Math.random().toString(16).slice(2, 6).toUpperCase()}</p>
           </div>

           <div className="flex gap-2 bg-neutral-900/40 p-1.5 rounded-[1.5rem] border border-white/5">
              <HeaderStat label="Assinatura" value="VITALÍCIA" active />
              <HeaderStat label="Server VIP" value="0ms" color="text-amber-500" />
              <HeaderStat label="Tier" value="INFLUENCER" color="text-white" />
           </div>
        </div>

        {/* Setup Flow - Dedicated section */}
        <div className="mb-12">
           <SectionLabel label="Instalação Premium" />
           <div className="bg-gradient-to-br from-neutral-900/60 to-black border border-amber-500/10 rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                 <div className="lg:w-1/3 space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                          <Target className="text-amber-500 w-7 h-7" />
                       </div>
                       <h2 className="text-3xl font-display font-black tracking-tight leading-none uppercase italic">LIGAÇÃO <br/><span className="text-amber-500">DIRETA</span></h2>
                    </div>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                       Siga a ordem restrita para injetar o painel no emulador de forma indetectável pelas logs locais.
                    </p>
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-400 uppercase font-black tracking-widest bg-white/5 p-4 rounded-xl border border-white/10">
                          <Eye className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                          <span>Streaming mode seguro (Não aparece no OBS/Tiktok).</span>
                       </div>
                    </div>
                 </div>

                 <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ProtocolStep 
                       id="01" 
                       title="Baixar Perfil" 
                       subtitle="MDS-Config" 
                       explanation="Cria uma camada de configuração protegida que intercepta chamadas de sistema (syscalls)."
                       active={downloadStep === 1}
                       done={downloadStep > 1}
                       onClick={() => { setDownloadStep(2); window.open('/download/profile'); }}
                    />
                    <ProtocolStep 
                       id="02" 
                       title="Certificado Root" 
                       subtitle="CA Trust Sync" 
                       explanation="Permite que o driver assine digitalmente os pacotes de rede para parecerem dados legítimos do jogo."
                       active={downloadStep === 2}
                       done={downloadStep > 2}
                       onClick={() => { setDownloadStep(3); window.open('/download/cert'); }}
                    />
                    <ProtocolStep 
                       id="03" 
                       title="Configurar Proxy" 
                       subtitle="Local 3000 Sync" 
                       explanation="Redireciona o tráfego do jogo através do nosso motor de otimização de latência (Bypass UDP)."
                       active={downloadStep === 3}
                       done={downloadStep > 3}
                       onClick={() => setDownloadStep(4)}
                    />
                    <ProtocolStep 
                       id="04" 
                       title="Vínculo Neural" 
                       subtitle="Kernel Inject" 
                       explanation="Gera a chave de criptografia única para sua sessão, ativando o magnetismo TITAN."
                       active={downloadStep === 4}
                       done={downloadStep > 4}
                       onClick={() => setDownloadStep(1)}
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
           {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6"
              >
                 {/* Bento Dashboard Layout */}
                 <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Main Stats */}
                    <BentoCard className="sm:col-span-2 p-8 lg:p-10 overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8">
                          <Activity className="w-24 h-24 text-rose-500/5 rotate-12 transition-transform group-hover:rotate-0 duration-700" />
                       </div>
                       <div className="flex flex-col h-full justify-between gap-12">
                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center border-rose-500/30">
                                   <Zap className="text-rose-500 w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-display font-black tracking-tight uppercase italic text-amber-500">Motor VIP Famosos</h3>
                             </div>
                             <p className="text-neutral-500 text-sm max-w-sm leading-relaxed">O mesmo Painel utilizado por influenciadores. Inject direto na memória RAM com zero chance de BAN. Smooth totalmente natural (Discreto).</p>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                             <StatBlock label="Desempenho" value="Liso (120 FPS)" color="text-amber-500" />
                             <StatBlock label="Risco de Ban" value="0.0%" color="text-white" />
                             <StatBlock label="Bypass" value="INVISÍVEL" color="text-emerald-500" />
                          </div>
                       </div>
                    </BentoCard>

                    {/* Quick Config - Aimbot Target */}
                    <BentoCard className="p-8">
                       <div className="flex flex-col h-full justify-between gap-8">
                          <div>
                             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600 mb-4">Balística Famosos</h4>
                             <h3 className="text-2xl font-display font-black tracking-tight italic uppercase mb-2">Foco da Mira</h3>
                             <p className="text-neutral-500 text-xs">Onde a mira vai grudar automaticamente.</p>
                          </div>
                          <div className="flex flex-col gap-2">
                             <AimOption 
                                label="CABEÇA (SÓ VERMELHO)" 
                                active={config.NECK_DOMINANCE?.AIM_TARGET === 'HEAD'} 
                                onClick={() => setConfigValue('NECK_DOMINANCE', 'AIM_TARGET', 'HEAD')} 
                             />
                             <AimOption 
                                label="PESCOÇO (DISFARÇADO)" 
                                active={config.NECK_DOMINANCE?.AIM_TARGET === 'NECK'} 
                                onClick={() => setConfigValue('NECK_DOMINANCE', 'AIM_TARGET', 'NECK')} 
                             />
                             <AimOption 
                                label="PEITO (CAMPEONATO)" 
                                active={config.NECK_DOMINANCE?.AIM_TARGET === 'CHEST'} 
                                onClick={() => setConfigValue('NECK_DOMINANCE', 'AIM_TARGET', 'CHEST')} 
                             />
                          </div>
                       </div>
                    </BentoCard>

                    {/* Features Toggle Preview */}
                    <BentoCard className="p-8 bg-amber-500 shadow-[0_30px_60px_-15px_rgba(245,158,11,0.3)] border-amber-400/30">
                       <div className="flex flex-col h-full justify-between items-start">
                          <div className="w-14 h-14 bg-black/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6">
                             <Sparkles className="w-7 h-7 text-black" />
                          </div>
                          <div className="space-y-4">
                             <h3 className="text-2xl font-display font-black text-black italic uppercase tracking-tighter leading-none">Injetar Elite <br/>VIP</h3>
                             <p className="text-black/70 text-xs font-medium leading-relaxed">Ative a magia. O bypass protegerá sua conta automaticamente. Bom jogo.</p>
                             <button 
                               onClick={handleInject}
                               disabled={isInjecting}
                               className="bg-black text-amber-500 w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
                             >
                                {isInjecting ? 'INJETANDO...' : 'INJETAR AGORA'}
                             </button>
                          </div>
                       </div>
                    </BentoCard>
                 </div>

                 {/* Side Column - Live Console & Bypass Status */}
                 <div className="lg:col-span-4 flex flex-col gap-6">
                    <BentoCard className="flex-1 p-0 flex flex-col overflow-hidden glass-dark min-h-[400px]">
                       <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/40">
                          <div className="flex items-center gap-3">
                             <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-rose-500/40" />
                                <div className="w-2 h-2 rounded-full bg-amber-500/40" />
                                <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                             </div>
                             <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-neutral-500">Live_Console_Feed</span>
                          </div>
                          <div className="px-2 py-0.5 bg-rose-500/10 rounded flex items-center gap-1.5 border border-rose-500/20">
                             <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
                             <span className="text-[8px] font-black text-rose-500">REC</span>
                          </div>
                       </div>
                       <div className="p-6 flex-1 overflow-y-auto font-mono text-[9px] sm:text-[10px] space-y-3 custom-scrollbar bg-black/20">
                          {terminalOutput.map((l, i) => (
                             <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i} className="flex gap-3 text-neutral-400 items-start">
                                <span className="text-rose-500/50 flex-shrink-0">[{new Date().toLocaleTimeString()}]</span>
                                <span className="leading-relaxed">{l}</span>
                             </motion.div>
                          ))}
                       </div>
                    </BentoCard>

                    <BentoCard className="p-6">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600 mb-6">Security Module</h4>
                       <div className="space-y-4">
                          <StatusRow label="Memory Masking" status="active" />
                          <StatusRow label="Polymorphic Loop" status="active" />
                          <StatusRow label="Kernel Shield" status="active" />
                          <StatusRow label="Pattern Obfuscation" status="active" />
                       </div>
                       <button 
                         onClick={handleScanNetwork}
                         disabled={isScanning}
                         className="w-full mt-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-colors"
                       >
                          <Radar className={`w-4 h-4 ${isScanning ? 'animate-spin text-rose-500' : ''}`} />
                          Sync Security Layer
                       </button>
                    </BentoCard>
                 </div>
              </motion.div>
           )}

           {activeTab === 'arsenal' && (
              <motion.div 
                key="arsenal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                 <WeaponCard 
                   name="XM8 - HYPERION" 
                   type="Rifle" 
                   rarity="LEGENDARY" 
                   sync={100} 
                   stats={{ dmg: 98, acc: 100, rng: 85 }} 
                   glow="border-amber-500/30"
                 />
                 <WeaponCard 
                   name="MP40 - TITAN" 
                   type="SMG" 
                   rarity="MYTHIC" 
                   sync={99.8} 
                   stats={{ dmg: 45, acc: 98, rng: 30 }} 
                   glow="border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.1)]"
                 />
                 <WeaponCard 
                   name="M1887 - APOCALYPSE" 
                   type="Shotgun" 
                   rarity="EPIC" 
                   sync={98.5} 
                   stats={{ dmg: 100, acc: 95, rng: 5 }} 
                   glow="border-purple-500/30"
                 />
                 <WeaponCard 
                   name="WOODPECKER - SUPREME" 
                   type="Marksman" 
                   rarity="LEGENDARY" 
                   sync={100} 
                   stats={{ dmg: 100, acc: 100, rng: 100 }} 
                   glow="border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.1)]"
                 />
                 <WeaponCard 
                   name="AWM - DARK MATTER" 
                   type="Sniper" 
                   rarity="LEGENDARY" 
                   sync={100} 
                   stats={{ dmg: 100, acc: 100, rng: 100 }} 
                   glow="border-neutral-500/30"
                 />
                 <WeaponCard 
                   name="DESERT EAGLE - ONE TAP" 
                   type="Pistol" 
                   rarity="ELITE" 
                   sync={100} 
                   stats={{ dmg: 90, acc: 100, rng: 45 }} 
                   glow="border-blue-500/30"
                 />
              </motion.div>
           )}

           {activeTab === 'settings' && (
             <motion.div 
               key="settings"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-8"
             >
                <BentoCard className="p-8 lg:p-12 border-amber-500/20">
                   <div className="flex flex-col lg:flex-row gap-12">
                      <div className="lg:w-1/3 space-y-6">
                         <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center border-amber-500/30 glow-amber">
                            <Cpu className="text-amber-500 w-8 h-8" />
                         </div>
                         <h2 className="text-3xl font-display font-black tracking-tight italic uppercase">Config <br/><span className="text-amber-500">VIP</span></h2>
                         <p className="text-neutral-500 text-sm leading-relaxed">
                            Ajuste os parâmetros do driver VIP. Estes valores controlam a agressividade da rede neural de aiming durante o combate.
                         </p>
                      </div>
                      
                      <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-10 bg-black/40 p-8 rounded-[2rem] border border-white/5">
                         <div className="space-y-6">
                            <label className="flex items-center justify-between">
                               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Radial FOV Radius</span>
                               <span className="text-amber-500 font-mono font-bold text-lg leading-none">{config.FOV?.MAX_FOV}px</span>
                            </label>
                            <input 
                               type="range" min="10" max="800" step="5"
                               value={config.FOV?.MAX_FOV || 360}
                               onChange={(e) => setConfigValue('FOV', 'MAX_FOV', parseInt(e.target.value))}
                               className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                            <p className="text-[9px] text-neutral-600 font-mono italic">Define a área circular de detecção automática para aquisição de novos alvos.</p>
                         </div>

                         <div className="space-y-6">
                            <label className="flex items-center justify-between">
                               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Magnetic Intensity</span>
                               <span className="text-amber-500 font-mono font-bold text-lg leading-none">{(config.NECK_DOMINANCE?.MAGNETIC_PULL * 100).toFixed(0)}%</span>
                            </label>
                            <input 
                               type="range" min="0.1" max="5.0" step="0.05"
                               value={config.NECK_DOMINANCE?.MAGNETIC_PULL || 1.85}
                               onChange={(e) => setConfigValue('NECK_DOMINANCE', 'MAGNETIC_PULL', parseFloat(e.target.value))}
                               className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                            <p className="text-[9px] text-neutral-600 font-mono italic">Intensidade do pull "trava-mira". Valores acima de 3.0 resultam em imã violento.</p>
                         </div>
                      </div>
                   </div>
                </BentoCard>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                   <GenericToggle label="Magic Bullet" group="FEATURES" configKey="MAGIC_BULLET" active={config.FEATURES?.MAGIC_BULLET} onToggle={toggleConfig} />
                   <GenericToggle label="Silent Aim" group="FEATURES" configKey="SILENT_AIM" active={config.FEATURES?.SILENT_AIM} onToggle={toggleConfig} />
                   <GenericToggle label="Head Tracking" group="FEATURES" configKey="HEAD_TRACKING" active={config.FEATURES?.HEAD_TRACKING} onToggle={toggleConfig} />
                   <GenericToggle label="No Recoil" group="FEATURES" configKey="NO_RECOIL" active={config.FEATURES?.NO_RECOIL} onToggle={toggleConfig} />
                   <GenericToggle label="No Spread" group="FEATURES" configKey="NO_SPREAD" active={config.FEATURES?.NO_SPREAD} onToggle={toggleConfig} />
                   <GenericToggle label="Fast Reload" group="FEATURES" configKey="FAST_RELOAD" active={config.FEATURES?.FAST_RELOAD} onToggle={toggleConfig} />
                   <GenericToggle label="ESP Lines" group="FEATURES" configKey="ESP_LINES" active={config.FEATURES?.ESP_LINES} onToggle={toggleConfig} />
                   <GenericToggle label="Antenna 100M" group="FEATURES" configKey="ANTENNA_100M" active={config.FEATURES?.ANTENNA_100M} onToggle={toggleConfig} />
                   <GenericToggle label="Anti-Ban V3" group="ANTI_BAN" configKey="ENABLED" active={config.ANTI_BAN?.ENABLED} onToggle={toggleConfig} />
                   <GenericToggle label="HWID Mask" group="ANTI_BAN" configKey="HARDWARE_ID_SPOOFING" active={config.ANTI_BAN?.HARDWARE_ID_SPOOFING} onToggle={toggleConfig} />
                   <GenericToggle label="UDP Priority" group="PERFORMANCE" configKey="UDP_PRIORITY" active={config.PERFORMANCE?.UDP_PRIORITY} onToggle={toggleConfig} />
                   <GenericToggle label="Packet Culling" group="PERFORMANCE" configKey="PACKET_CULLING" active={config.PERFORMANCE?.PACKET_CULLING} onToggle={toggleConfig} />
                </div>
             </motion.div>
           )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// UI Design Elements
function SidebarLink({ icon, active, onClick, tooltip }: any) {
   return (
      <div className="relative group">
         <button 
           onClick={onClick}
           className={`p-4 rounded-2xl transition-all duration-300 relative group-hover:scale-110 active:scale-95 ${active ? 'bg-rose-500 text-white shadow-[0_10px_20px_rgba(225,29,72,0.3)]' : 'text-neutral-500 hover:text-neutral-300'}`}
         >
            {React.cloneElement(icon, { className: "w-6 h-6" })}
         </button>
         <div className="absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 px-4 py-2 glass rounded-xl border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-[200]">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] font-display">{tooltip}</span>
         </div>
      </div>
   );
}

function MobileTabLink({ icon, label, active, onClick }: any) {
   return (
      <button 
        onClick={onClick}
        className={`flex items-center gap-5 p-6 rounded-[2rem] border transition-all duration-500 ${active ? 'bg-rose-600 border-rose-400 text-white shadow-2xl scale-[1.02]' : 'bg-neutral-900/50 border-white/5 text-neutral-500'}`}
      >
         <div className={`p-3 rounded-xl ${active ? 'bg-white/20' : 'bg-neutral-800'}`}>
            {React.cloneElement(icon, { className: "w-6 h-6" })}
         </div>
         <span className="font-display font-black tracking-tight text-xl italic uppercase underline-offset-8">{label}</span>
         {active && <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />}
      </button>
   );
}

function SectionLabel({ label }: { label: string }) {
   return (
      <div className="flex items-center gap-4 mb-6">
         <div className="h-[1px] flex-1 bg-white/5" />
         <span className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-600 italic">{label}</span>
         <div className="h-[1px] flex-1 bg-white/5" />
      </div>
   );
}

function ProtocolStep({ id, title, subtitle, explanation, active, done, onClick }: any) {
   return (
      <button 
         onClick={onClick}
         className={`group relative flex flex-col items-start gap-4 p-6 rounded-2xl border transition-all duration-500 overflow-hidden text-left ${active ? 'bg-rose-600 border-rose-400 text-white shadow-2xl scale-[1.03]' : done ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 opacity-60' : 'glass-dark border-white/5 text-neutral-400 hover:border-white/20'}`}
      >
         <div className="flex items-center gap-4 w-full">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-black flex-shrink-0 ${active ? 'bg-white text-rose-600' : done ? 'bg-emerald-500/20 text-emerald-500' : 'bg-neutral-800 text-neutral-500'}`}>
               {done ? <CheckCircle2 className="w-5 h-5" /> : id}
            </div>
            <div className="flex flex-col">
               <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-white/70' : 'text-neutral-500'}`}>{subtitle}</span>
               <span className="text-sm font-display font-black uppercase tracking-tight leading-none mt-0.5">{title}</span>
            </div>
            {active && (
               <motion.div 
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="ml-auto"
               >
                  <Download className="w-5 h-5 text-white/50" />
               </motion.div>
            )}
         </div>
         <p className={`text-[10px] leading-relaxed font-medium ${active ? 'text-white/80' : 'text-neutral-600'}`}>
            {explanation}
         </p>
      </button>
   );
}

function BentoCard({ children, className }: any) {
   return (
      <motion.div 
         initial={{ opacity: 0, scale: 0.98 }}
         animate={{ opacity: 1, scale: 1 }}
         className={`glass-rose rounded-[2.5rem] border border-white/5 relative bg-white/[0.02] shadow-xl ${className}`}
      >
         {children}
      </motion.div>
   );
}

function HeaderStat({ label, value, active, color = "text-white" }: any) {
   return (
      <div className={`px-5 py-3 rounded-2xl flex flex-col text-center min-w-[100px] ${active ? 'bg-white/5 border border-white/10' : ''}`}>
         <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1 leading-none">{label}</span>
         <span className={`text-sm lg:text-lg font-display font-black tracking-tight leading-none uppercase italic ${color}`}>{value}</span>
      </div>
   );
}

function StatBlock({ label, value, color }: any) {
   return (
      <div className="space-y-1">
         <span className="text-[8px] font-black uppercase tracking-[0.3em] text-neutral-600 leading-none">{label}</span>
         <p className={`text-lg sm:text-xl font-display font-black tracking-tighter uppercase italic leading-none ${color}`}>{value}</p>
      </div>
   );
}

function AimOption({ label, active, onClick }: any) {
   return (
      <button 
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${active ? 'bg-rose-500/10 border-rose-500/40 text-white' : 'bg-black/40 border-white/5 text-neutral-500 hover:border-white/20'}`}
      >
         <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-transform ${active ? 'translate-x-1' : ''}`}>{label}</span>
         <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${active ? 'bg-rose-500 glow-rose scale-125' : 'bg-neutral-800'}`} />
      </button>
   );
}

function StatusRow({ label, status }: any) {
   return (
      <div className="flex items-center justify-between group">
         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 group-hover:text-neutral-300 transition-colors">{label}</span>
         <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">{status}</span>
            <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
         </div>
      </div>
   );
}

function WeaponCard({ name, type, rarity, stats, sync, glow }: any) {
   return (
      <BentoCard className={`p-8 lg:p-10 group overflow-hidden border transition-shadow duration-700 ${glow}`}>
         <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/5 blur-3xl rounded-full group-hover:bg-white/10 transition-all" />
         <div className="relative z-10 flex flex-col h-full justify-between gap-10">
            <div className="space-y-4">
               <div className="flex justify-between items-start">
                  <div className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest italic border ${rarity === 'LEGENDARY' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : rarity === 'MYTHIC' ? 'bg-amber-500/10 border-amber-500/30 text-amber-600' : 'bg-purple-500/10 border-purple-500/30 text-purple-500'}`}>
                     {rarity}
                  </div>
                  <span className="text-[10px] font-mono text-neutral-600 font-bold">Sync: {sync}%</span>
               </div>
               <div>
                  <h3 className="text-2xl font-display font-black tracking-tight leading-none mb-1 group-hover:text-amber-500 transition-colors uppercase italic">{name}</h3>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em]">{type} Armament</p>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
               <WeaponStat value={stats.dmg} label="DMG" />
               <WeaponStat value={stats.acc} label="ACC" />
               <WeaponStat value={stats.rng} label="RNG" />
            </div>
            
            <button className="w-full py-4 border border-white/5 rounded-2xl bg-white/[0.02] hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest mt-2">
               Equip Profile
            </button>
         </div>
      </BentoCard>
   );
}

function WeaponStat({ value, label }: any) {
   return (
      <div className="bg-black/40 border border-white/5 p-3 rounded-xl flex flex-col items-center">
         <span className="text-sm font-display font-black text-white italic">{value}</span>
         <span className="text-[8px] font-bold text-neutral-600 uppercase mt-1">{label}</span>
      </div>
   );
}

function GenericToggle({ label, configKey, active, onToggle, group }: any) {
   return (
      <motion.button 
         whileHover={{ y: -2 }}
         onClick={() => onToggle(group, configKey, active)}
         className={`flex flex-col p-5 rounded-[1.5rem] border transition-all duration-300 relative overflow-hidden text-left ${active ? 'bg-rose-500/10 border-rose-500/40' : 'bg-neutral-900/40 border-white/5 hover:border-white/10'}`}
      >
         <div className="flex justify-between items-start mb-6">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${active ? 'bg-rose-500 text-white' : 'bg-neutral-800 text-neutral-600'}`}>
               <Layers className="w-4 h-4" />
            </div>
            <div className={`w-3 h-3 rounded-full ${active ? 'bg-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.8)]' : 'bg-neutral-800'}`} />
         </div>
         <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${active ? 'text-white' : 'text-neutral-500'}`}>{label}</span>
         <span className="text-[8px] font-mono text-neutral-700 mt-1 uppercase font-bold">Active Bypass</span>
      </motion.button>
   );
}
