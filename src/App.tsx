import React, { useState, useEffect } from "react";
import { 
  Shield as ShieldIcon, 
  Cpu as CpuIcon, 
  Zap as ZapIcon, 
  Activity as ActivityIcon, 
  Crosshair as CrosshairIcon, 
  Terminal as TerminalIcon, 
  ShieldCheck as ShieldCheckIcon,
  Smartphone as SmartphoneIcon,
  Lock as LockIcon,
  Fingerprint as FingerprintIcon,
  Target as TargetIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- COMPONENTES ATÓMICOS ---

const BentoCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-neutral-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden relative shadow-2xl ${className}`}>
    {children}
  </div>
);

const StatBadge = ({ label, value, active = false }: { label: string; value: string; active?: boolean }) => (
  <div className={`px-5 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[110px] border transition-all ${active ? "bg-amber-500/10 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)]" : "bg-black/40 border-white/5"}`}>
    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-1">{label}</span>
    <span className={`text-sm font-display font-black italic uppercase italic tracking-tighter ${active ? "text-amber-500" : "text-white"}`}>{value}</span>
  </div>
);

const SettingToggle = ({ label, active, onClick, icon: IconComponent }: any) => (
  <button 
    onClick={onClick}
    className={`w-full p-5 rounded-[1.8rem] border flex items-center justify-between transition-all group ${active ? "bg-amber-500/5 border-amber-500/30" : "bg-white/[0.02] border-white/5 hover:border-white/10"}`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${active ? "bg-amber-500 text-black" : "bg-white/5 text-neutral-500"}`}>
        <IconComponent className="w-6 h-6" />
      </div>
      <div className="text-left">
        <span className={`text-[11px] font-black uppercase tracking-widest block mb-0.5 ${active ? "text-amber-500" : "text-neutral-500"}`}>{label}</span>
        <span className="text-[9px] font-mono font-bold text-neutral-600 block tracking-wider">{active ? "PROTOCOL::ACTIVE" : "LAYER::DISABLED"}</span>
      </div>
    </div>
    <div className={`w-2.5 h-2.5 rounded-full ${active ? "bg-amber-500 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.6)]" : "bg-neutral-800"}`} />
  </button>
);

// --- APP PRINCIPAL ---

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [terminalLines, setTerminalLines] = useState<{id: string, text: string}[]>([]);
  const [hwid, setHwid] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [proxyStats, setProxyStats] = useState({ 
    intercepted: 0, 
    decrypted: "IDLE", 
    bandwidth: "0", 
    activeConnections: 0, 
    port: "8080",
    injectionStatus: "IDLE",
    mode: "IDLE",
    handshakeStatus: "IDLE",
    byteSwaps: 0,
    vectorCorrection: "0.000°",
    jitter: "0.00ms",
    recoilStatus: "IDLE",
    shieldIntegrity: "0%"
  });
  const [selectedPort, setSelectedPort] = useState("8080");
  const [injectionProgress, setInjectionProgress] = useState(0);

  const [settings, setSettings] = useState({
    headLock: true,
    noRecoil: true,
    speedBoost: false,
    bypassAC: true,
    stealthMode: true,
    smoothFactor: 92,
    torque: 48,
    smartBoneTracking: true,
    magneticHeadlock: true
  });

  const [activeStep, setActiveStep] = useState(0);
  const injectionSteps = [
    "Sincronizando Certificado AXYON v4.8...",
    "Bypass SSL Pinning: INSTALLED",
    "Mapeando GameServer Offset 0x3F8/0x400...",
    "AimEngine: Sincronizando Vetores...",
    "RecoilMaster: Calibrando Trajetória Linear...",
    "SecurityShield: Ativando Anti-Ban Heurístico...",
    "AXYON Ultra V2: Kernel Bridge LOCKED."
  ];

  useEffect(() => {
    setHwid("ELITE-" + Math.random().toString(36).substring(2, 10).toUpperCase());
    
    const interval = setInterval(async () => {
      try {
        const url = sessionId ? `/api/proxy/stats?sessionId=${sessionId}` : "/api/proxy/stats";
        const res = await fetch(url);
        const data = await res.json();
        setProxyStats(data);
        
        if (data.handshakeStatus === "STABILIZING") {
            const match = data.injectionStatus.match(/\d+/);
            if (match) setInjectionProgress(parseInt(match[0]));
        } else if (data.handshakeStatus === "STABLE") {
            setInjectionProgress(100);
            if (isInjecting) {
                setIsInjecting(false);
                addLog(`AURORA_AXYON: Canal ${data.port} Estabilizado. Injeção Ativa.`);
            }
        }

        if (Math.random() > 0.8 && data.injectionStatus === "ACTIVE_INJECTION") {
            const logType = data.port === "8080" ? "OVERRIDE" : "FILTER";
            const originalId = Math.floor(Math.random() * 20) + 1;
            
            if (Math.random() > 0.5) {
                addLog(`[${logType}] Packet 0x${Math.floor(Math.random()*0xFFFF).toString(16)}: OriginalID:${originalId} -> SWAP -> HeadID:0x3F8`);
            } else {
                addLog(`[RECOIL] Neutralizing spread on 0x${Math.floor(Math.random()*0xFF).toString(16)} -> Vector: [0,0,0]`);
            }
        }
      } catch(e) {}
    }, 2000);
    return () => clearInterval(interval);
  }, [sessionId, isInjecting]);

  const addLog = (text: string) => {
    setTerminalLines(prev => [{ id: Math.random().toString(), text }, ...prev].slice(0, 18));
  };

  const handleInject = async () => {
    if (isInjecting) return;
    setIsInjecting(true);
    setInjectionProgress(0);
    setActiveStep(0);
    addLog(`Iniciando Protoclo AXYON Ultra V2 no canal ${selectedPort}...`);
    
    // Simulação visual de passos v2
    let step = 0;
    const stepInterval = setInterval(() => {
        if (step < injectionSteps.length) {
            addLog(`[SYSTEM] ${injectionSteps[step]}`);
            setActiveStep(step);
            step++;
        } else {
            clearInterval(stepInterval);
        }
    }, 2500);

    try {
      const res = await fetch("/api/kernel/inject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hwid, port: selectedPort })
      });
      const data = await res.json();
      if (data.sessionId) {
          setSessionId(data.sessionId);
          addLog("[HANDSHAKE] Aguardando 20s para estabilização de certificados...");
      }
    } catch(e) {
        setIsInjecting(false);
        addLog("[ERRO] Falha na conexão com o Proxy AXYON.");
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 font-sans relative overflow-hidden">
        <div className="absolute inset-0 scanline opacity-20" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <BentoCard className="p-12 border-amber-500/10 bg-black/80">
            <div className="flex flex-col items-center gap-8">
              <div className="relative">
                <div className="w-24 h-24 bg-amber-500 rounded-[2.8rem] flex items-center justify-center shadow-[0_0_60px_rgba(245,158,11,0.4)]">
                   <ShieldIcon className="w-12 h-12 text-black fill-black" />
                </div>
                <div className="absolute -inset-2 border border-amber-500/20 rounded-[3.2rem] animate-pulse" />
              </div>

              <div className="text-center space-y-2">
                <h1 className="text-4xl font-display font-black tracking-tighter uppercase italic leading-none">AXYON <span className="text-amber-500">ULTRA V2</span></h1>
                <p className="text-[10px] font-mono uppercase tracking-[0.6em] text-neutral-600 font-bold">ARM64 ARCHITECTURE :: RING-0</p>
              </div>

              <div className="w-full space-y-4">
                 <div className="relative group">
                    <LockIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 transition-colors group-focus-within:text-amber-500" />
                    <input 
                      type="password" 
                      className="w-full bg-black/60 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-mono focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-neutral-800" 
                      placeholder="ENTER_ELITE_KEY"
                      onKeyPress={(e) => e.key === 'Enter' && setIsAuth(true)}
                    />
                 </div>
                 <button 
                   onClick={() => setIsAuth(true)}
                   className="w-full py-5 bg-amber-600 hover:bg-amber-500 text-black font-black uppercase tracking-[0.4em] rounded-2xl transition-all shadow-2xl shadow-amber-500/20 active:scale-95"
                 >
                   AUTENTICAR
                 </button>
              </div>

              <div className="flex items-center gap-4 text-[9px] font-mono text-neutral-700 uppercase tracking-widest">
                 <span>HWID: {hwid || "SYNCING..."}</span>
              </div>
            </div>
          </BentoCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 lg:p-12 font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 scanline opacity-10 pointer-events-none" />
      
      <main className="max-w-7xl mx-auto space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-amber-500 rounded-[2.2rem] flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.25)]">
                <CpuIcon className="w-10 h-10 text-black fill-black" />
              </div>
              <div>
                <h2 className="text-4xl font-display font-black uppercase italic tracking-tighter leading-none mb-2 text-white">
                   AXYON <span className="text-amber-500">ULTRA V2</span> <span className="text-[12px] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 text-amber-500 ml-4 font-mono not-italic tracking-normal">CORE ENGINE</span>
                </h2>
                <div className="flex items-center gap-2">
                   <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)] ${
                     proxyStats.handshakeStatus === 'STABLE' ? 'bg-emerald-500' : 
                     proxyStats.handshakeStatus === 'STABILIZING' ? 'bg-amber-500' : 'bg-red-500'
                   }`} />
                   <span className={`text-[11px] font-bold uppercase tracking-[0.2em] font-mono ${
                     proxyStats.handshakeStatus === 'STABLE' ? 'text-emerald-500' : 
                     proxyStats.handshakeStatus === 'STABILIZING' ? 'text-amber-500' : 'text-red-500'
                   }`}>
                     {proxyStats.handshakeStatus === 'STABLE' ? 'STATUS: PRONTO PARA O CAPA (MITM ATIVO)' : 
                      proxyStats.handshakeStatus === 'STABILIZING' ? 'STATUS: CALIBRANDO OFFSETS (MITM...)' : 'STATUS: PROXY OFFLINE'}
                   </span>
                </div>
              </div>
           </div>

           <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
              <div className="flex bg-black/40 border border-white/5 p-1 rounded-2xl">
                 <button onClick={() => window.location.href = "/download/certificate"} className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-amber-500 transition-colors">MITM CA</button>
                 <button onClick={() => window.location.href = "/download/mobileconfig"} className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-amber-500 transition-colors">R7VIPXIT PRO</button>
              </div>
              <StatBadge label="L7 Packets" value={proxyStats.intercepted.toString()} active />
              <StatBadge label="TLS Status" value="v1.3" active />
              <StatBadge label="Traffic" value={proxyStats.bandwidth} />
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-8 flex flex-col gap-10">
              <BentoCard className="p-12 border-white/[0.03]">
                 <div className="flex flex-col md:flex-row gap-16 items-center">
                    <div className="md:w-1/2 space-y-10">
                       <div className="space-y-4">
                          <h3 className="text-4xl font-display font-black uppercase italic tracking-tighter leading-tight text-white">AXYON <span className="text-amber-500">ULTRA V2</span></h3>
                          <div className="flex gap-4 p-2 bg-black/40 rounded-2xl border border-white/5 w-fit">
                             <button 
                                onClick={() => setSelectedPort("8080")}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${selectedPort === "8080" ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "text-neutral-500 hover:text-white"}`}
                             >
                                PORT 8080 (AGRESSIVO)
                             </button>
                             <button 
                                onClick={() => setSelectedPort("8081")}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${selectedPort === "8081" ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "text-neutral-500 hover:text-white"}`}
                             >
                                PORT 8081 (LEGIT/SECURE)
                             </button>
                          </div>
                          <p className="text-sm text-neutral-500 leading-relaxed font-medium">Engine L7 de última geração com AimEngine (0x3F8), RecoilMaster e SecurityShield integrados. Interceptação cirúrgica com latência ultra-baixa de combate.</p>
                       </div>
                       
                       <button 
                         onClick={handleInject}
                         disabled={isInjecting}
                         className="w-full py-8 bg-amber-600 hover:bg-amber-500 text-black font-black uppercase tracking-[0.5em] rounded-[2.5rem] transition-all shadow-2xl shadow-amber-500/30 active:scale-95 disabled:opacity-50"
                       >
                         {isInjecting ? `SINCRONIZANDO (${injectionProgress}%)` : "ATIVAR ENGINE"}
                       </button>
                    </div>

                    <div className="md:w-1/2 w-full h-80 bg-black/60 rounded-[4rem] border border-white/5 relative overflow-hidden flex items-center justify-center shadow-inner group">
                       <div className="absolute inset-0 grid grid-cols-10 gap-px opacity-10 pointer-events-none">
                          {[...Array(100)].map((_, i) => <div key={i} className="border border-white/10" />)}
                       </div>
                       
                       {/* Simulação de Crosshair Dinâmica */}
                       <AnimatePresence mode="wait">
                         {isInjecting ? (
                           <motion.div 
                             key="injecting"
                             initial={{ opacity: 0, scale: 0.8 }}
                             animate={{ opacity: 1, scale: 1 }}
                             exit={{ opacity: 0, scale: 0.8 }}
                             className="flex flex-col items-center gap-6 relative z-10 text-center"
                           >
                             <div className="relative">
                                <ActivityIcon className="w-16 h-16 text-amber-500 animate-pulse" />
                                <motion.div 
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                  className="absolute -inset-4 border border-amber-500/20 rounded-full border-t-amber-500"
                                />
                             </div>
                             <span className="text-[11px] font-black uppercase text-amber-500 tracking-[0.4em] font-mono leading-none">Injetando no Processo...</span>
                           </motion.div>
                         ) : (
                           <motion.div 
                             key="idle"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             className="w-full h-full relative"
                           >
                              {/* Alvos Virtuais de Teste */}
                              <motion.div 
                                animate={{ 
                                  x: [50, -50, 80, -30],
                                  y: [-30, 40, -60, 20]
                                }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500/20 rounded-full border border-red-500/50 flex items-center justify-center"
                              >
                                 <div className="w-1 h-1 bg-red-500 rounded-full shadow-[0_0_10px_red]" />
                              </motion.div>

                              {/* Retículo Aurora Auto-Lock */}
                              <motion.div 
                                animate={{ 
                                  x: settings.headLock ? [50, -50, 80, -30] : 0,
                                  y: settings.headLock ? [-30, 40, -60, 20] : 0,
                                }}
                                transition={{ repeat: Infinity, duration: settings.headLock ? 6.2 : 0, ease: "easeInOut" }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                              >
                                 <div className="aimbox-reticle w-12 h-12 flex items-center justify-center">
                                    <div className="w-1 h-1 bg-amber-500 rounded-full" />
                                 </div>
                                 {settings.headLock && (
                                   <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2">
                                      <span className="text-[8px] font-mono font-bold text-amber-500 bg-black/80 px-1 py-0.5 rounded border border-amber-500/20">LOCKED_BONE_HEAD</span>
                                   </div>
                                 )}
                              </motion.div>

                              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
                                 <span className="text-[9px] font-black uppercase text-neutral-600 tracking-[0.2em]">Preview Engine</span>
                                 <div className="w-24 h-0.5 bg-neutral-800 rounded-full overflow-hidden">
                                    <motion.div 
                                      animate={{ x: [-100, 100] }}
                                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                      className="w-1/2 h-full bg-amber-500"
                                    />
                                 </div>
                              </div>
                           </motion.div>
                         )}
                       </AnimatePresence>
                    </div>
                 </div>
              </BentoCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <BentoCard className="p-12 space-y-10">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-amber-500/10 rounded-2xl">
                          <CrosshairIcon className="w-6 h-6 text-amber-500" />
                       </div>
                       <h4 className="text-2xl font-display font-black uppercase italic tracking-tight">Neural Aim</h4>
                    </div>
                    <div className="space-y-5">
                       <SettingToggle label="AimLock L7 (0x3F8)" active={settings.headLock} icon={TargetIcon} onClick={() => setSettings(s => ({...s, headLock: !s.headLock}))} />
                       <SettingToggle label="Smart Bone Tracking" active={settings.smartBoneTracking} icon={TargetIcon} onClick={() => setSettings(s => ({...s, smartBoneTracking: !s.smartBoneTracking}))} />
                       <SettingToggle label="Magnetic Headlock" active={settings.magneticHeadlock} icon={LockIcon} onClick={() => setSettings(s => ({...s, magneticHeadlock: !s.magneticHeadlock}))} />
                       <SettingToggle label="RecoilMaster L7" active={settings.noRecoil} icon={ActivityIcon} onClick={() => setSettings(s => ({...s, noRecoil: !s.noRecoil}))} />
                    </div>
                 </BentoCard>

                 <BentoCard className="p-12 space-y-10">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-emerald-500/10 rounded-2xl">
                          <ShieldIcon className="w-6 h-6 text-emerald-500" />
                       </div>
                       <h4 className="text-2xl font-display font-black uppercase italic tracking-tight">Stealth X</h4>
                    </div>
                    <div className="space-y-5">
                       <SettingToggle label="SecurityShield (Anti-Ban)" active={settings.bypassAC} icon={ShieldCheckIcon} onClick={() => setSettings(s => ({...s, bypassAC: !s.bypassAC}))} />
                       <SettingToggle label="Anti-Blacklist (Heuristic)" active={settings.stealthMode} icon={FingerprintIcon} onClick={() => setSettings(s => ({...s, stealthMode: !s.stealthMode}))} />
                    </div>
                 </BentoCard>
              </div>

              <BentoCard className="p-12 shadow-sm">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-4 md:w-1/2">
                       <div className="flex items-center gap-3">
                          <FingerprintIcon className="w-6 h-6 text-amber-500" />
                          <h4 className="text-2xl font-display font-black uppercase italic tracking-tight">MITM Decryptor</h4>
                       </div>
                       <p className="text-xs text-neutral-500 font-medium font-mono leading-relaxed">
                          AXYON intercepta pacotes TLS 1.3 via certificados on-the-fly. O certificado mitm_ca.der permite a quebra de criptografia do jogo sem disparar flags de integridade.
                       </p>
                    </div>
                    <div className="md:w-1/2 flex flex-col gap-4 w-full">
                       <div className="flex-1 p-6 bg-black/40 rounded-3xl border border-white/5 space-y-2">
                          <span className="text-[9px] font-black uppercase text-neutral-600 tracking-widest">Injection Mode</span>
                          <span className="text-xs font-mono font-bold text-amber-500 block">{proxyStats.mode}</span>
                       </div>
                       <div className="flex-1 p-6 bg-black/40 rounded-3xl border border-white/5 space-y-2">
                          <span className="text-[9px] font-black uppercase text-neutral-600 tracking-widest">L7 Status</span>
                          <span className={`${proxyStats.handshakeStatus === 'STABILIZING' ? 'text-amber-500 animate-pulse' : 'text-emerald-500'} text-xs font-mono font-bold block`}>
                             {proxyStats.injectionStatus}
                          </span>
                       </div>
                    </div>
                 </div>
              </BentoCard>

              <BentoCard className="p-12 shadow-sm">
                 <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <CpuIcon className="w-6 h-6 text-amber-500" />
                          <h4 className="text-2xl font-display font-black uppercase italic tracking-tight">ARM64 Bone Offsets</h4>
                       </div>
                       <span className="text-[9px] font-mono text-neutral-600 bg-white/5 px-3 py-1 rounded-full">SYMPTOMS_DYNAMIC_ASLR: ACTIVE</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                       {[
                          { label: "Head", val: "0x3F8" },
                          { label: "Neck", val: "0x3FC" },
                          { label: "Chest", val: "0x400" },
                          { label: "Pelvis", val: "0x40C" },
                          { label: "Spread", val: "0x43C" },
                          { label: "Firing", val: "0x448" }
                       ].map((offset, i) => (
                          <div key={i} className="p-4 bg-black/40 rounded-2xl border border-white/5 flex flex-col gap-1">
                             <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">{offset.label}</span>
                             <span className="text-xs font-mono font-bold text-amber-500/80">{offset.val}</span>
                          </div>
                       ))}
                    </div>
                 </div>
              </BentoCard>

              <BentoCard className="p-12 shadow-sm">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-4 md:w-1/2">
                       <div className="flex items-center gap-3">
                          <TerminalIcon className="w-6 h-6 text-amber-500" />
                          <h4 className="text-2xl font-display font-black uppercase italic tracking-tight">Live L7 Diagnostic</h4>
                       </div>
                       <p className="text-xs text-neutral-500 font-medium font-mono leading-relaxed">
                          Monitoramento em tempo real do manipulador de pacotes. Cada pico no gráfico representa um "Swap" bem sucedido de offset de dano via Proxy Intercept.
                       </p>
                    </div>
                    <div className="md:w-1/2 grid grid-cols-3 gap-3 w-full">
                       <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                            <ZapIcon className="w-3 h-3 text-amber-500" />
                          </div>
                          <span className="text-[8px] font-black uppercase text-neutral-600 tracking-widest">Byte Swaps</span>
                          <span className="text-lg font-mono font-bold text-amber-500 block">{proxyStats.byteSwaps}</span>
                       </div>
                       <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                            <ActivityIcon className="w-3 h-3 text-emerald-500" />
                          </div>
                          <span className="text-[8px] font-black uppercase text-neutral-600 tracking-widest">Recoil Master</span>
                          <span className="text-lg font-mono font-bold text-emerald-500 block">{proxyStats.recoilStatus}</span>
                       </div>
                       <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                            <ActivityIcon className="w-3 h-3 text-blue-500" />
                          </div>
                          <span className="text-[8px] font-black uppercase text-neutral-600 tracking-widest">Shield Integrity</span>
                          <span className="text-lg font-mono font-bold text-blue-500 block">{proxyStats.shieldIntegrity}</span>
                       </div>
                    </div>
                 </div>
              </BentoCard>

              <BentoCard className="p-12 shadow-sm border-amber-500/5">
                 <div className="space-y-10">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-amber-500/10 rounded-2xl">
                          <SmartphoneIcon className="w-6 h-6 text-amber-500" />
                       </div>
                       <h4 className="text-2xl font-display font-black uppercase italic tracking-tight">iOS Setup (R7VIPXIT)</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <div className="space-y-4">
                          <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-black text-xs">1</div>
                          <h5 className="text-[11px] font-black uppercase tracking-widest text-white">Certificado MITM</h5>
                          <p className="text-[10px] text-neutral-500 font-medium leading-relaxed">Baixe o <b>mitm_ca.der</b>. Instale e ative em: <b>Ajustes &gt; Geral &gt; Sobre &gt; Confiança</b>. Sem isso, a interceptação falha.</p>
                          <button onClick={() => window.location.href = "/download/certificate"} className="w-full py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-amber-500 transition-all">BAIXAR CERTIFICADO</button>
                       </div>
                       
                       <div className="space-y-4">
                          <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-black text-xs">2</div>
                          <h5 className="text-[11px] font-black uppercase tracking-widest text-white">Perfil R7VIPXIT</h5>
                          <p className="text-[10px] text-neutral-500 font-medium leading-relaxed">Instale o perfil para automatizar o Proxy. Vá em <b>Ajustes &gt; Perfil Baixado</b> e confirme a instalação vip.</p>
                          <button onClick={() => window.location.href = "/download/mobileconfig"} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">INSTALAR PERFIL</button>
                       </div>

                       <div className="space-y-4">
                          <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-black text-xs">3</div>
                          <h5 className="text-[11px] font-black uppercase tracking-widest text-white">Ativação L7</h5>
                          <p className="text-[10px] text-neutral-500 font-medium leading-relaxed">No Wi-Fi, garanta que o Proxy está em Manual para: <b>proxy.axyon-hub.io</b> porta <b>{selectedPort}</b>.</p>
                          <div className={`p-3 rounded-xl border border-white/5 font-mono text-[9px] uppercase ${proxyStats.handshakeStatus === "STABLE" ? "text-emerald-500 bg-emerald-500/5" : "text-neutral-700 bg-black/40"}`}>
                             {proxyStats.handshakeStatus === "STABLE" ? "Handshake: STABLE (R7_ACTIVE)" : "Handshake: Awaiting Engine"}
                          </div>
                       </div>
                    </div>
                 </div>
              </BentoCard>

              <BentoCard className="p-12 shadow-sm">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
                    <div className="space-y-8">
                       <div className="flex justify-between items-end">
                          <span className="text-[11px] font-black text-neutral-600 uppercase tracking-[0.3em]">Torque Mira</span>
                          <span className="text-amber-500 font-mono font-bold text-sm tracking-widest">{settings.torque / 10}x</span>
                       </div>
                       <input type="range" className="w-full accent-amber-500 h-1 bg-neutral-800 rounded-full appearance-none cursor-pointer" value={settings.torque} onChange={(e) => setSettings(s => ({...s, torque: parseInt(e.target.value)}))} />
                    </div>
                    <div className="space-y-8">
                       <div className="flex justify-between items-end">
                          <span className="text-[11px] font-black text-neutral-600 uppercase tracking-[0.3em]">Smooth Ratio</span>
                          <span className="text-amber-500 font-mono font-bold text-sm tracking-widest">{settings.smoothFactor / 100}</span>
                       </div>
                       <input type="range" className="w-full accent-amber-500 h-1 bg-neutral-800 rounded-full appearance-none cursor-pointer" value={settings.smoothFactor} onChange={(e) => setSettings(s => ({...s, smoothFactor: parseInt(e.target.value)}))} />
                    </div>
                 </div>
              </BentoCard>
           </div>

           <div className="lg:col-span-4 flex flex-col gap-10">
              <BentoCard className="flex-1 p-10 flex flex-col bg-black/60 border-white/[0.02] min-h-[500px]">
                 <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                    <TerminalIcon className="w-6 h-6 text-amber-500" />
                    <span className="text-sm font-black uppercase tracking-[0.3em] text-neutral-500">LIVE KERNEL OVERRIDE</span>
                 </div>
                 <div className="space-y-5 overflow-y-auto max-h-[450px] custom-scrollbar pr-4">
                    {terminalLines.map((l) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={l.id} 
                        className="text-[12px] font-mono leading-relaxed group"
                      >
                        <span className="text-amber-500/40 mr-3 font-black">ELITE::</span>
                        <span className="text-neutral-500 group-hover:text-white transition-colors">{l.text}</span>
                      </motion.div>
                    ))}
                    {terminalLines.length === 0 && (
                       <div className="h-full flex items-center justify-center text-neutral-800 font-mono text-xs uppercase italic tracking-widest text-center mt-20">
                          Waiting for Kernel Bridge...
                       </div>
                    )}
                 </div>
              </BentoCard>

              <BentoCard className="p-12 bg-amber-500 text-black shadow-[0_0_100px_rgba(245,158,11,0.2)]">
                 <div className="space-y-8">
                    <SmartphoneIcon className="w-12 h-12" />
                    <div className="space-y-2">
                       <h4 className="text-3xl font-display font-black uppercase italic tracking-tighter leading-tight">R7VIPXIT CONFIG</h4>
                       <p className="text-[11px] font-bold uppercase text-black/60 leading-relaxed tracking-wider">Perfil R7-VIP Protocol v4.8 Otimizado para Overrides ARM64.</p>
                    </div>
                    <button 
                      onClick={() => window.location.href = "/download/mobileconfig"}
                      className="w-full py-6 bg-black text-amber-500 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] hover:bg-neutral-900 transition-all shadow-xl active:scale-95"
                    >
                       DOWNLOAD PERFIL R7
                    </button>
                 </div>
              </BentoCard>
           </div>
        </div>
      </main>
    </div>
  );
}
