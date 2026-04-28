import React, { useEffect, useState, useRef } from "react";
import {
  Shield,
  Activity,
  Crosshair,
  Zap,
  Power,
  Lock,
  User,
  Radar,
  Cpu,
  Terminal,
  Eye,
  Target,
  Menu,
  X,
  Download,
  Monitor,
  Smartphone,
  CheckCircle2,
  ChevronRight,
  Settings,
  BarChart3,
  Fingerprint,
  Layers,
  Database,
  Network,
  Ghost,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Apple,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "arsenal" | "settings" | "proxy">("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [downloadStep, setDownloadStep] = useState(1);
  const [isInjecting, setIsInjecting] = useState(false);

  const [stats, setStats] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [terminalOutput, setTerminalOutput] = useState<
    { id: string; text: string; time: string }[]
  >([]);

  useEffect(() => {
    const cachedAuth = localStorage.getItem("axyon_auth");
    if (cachedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const data = await fetch("/api/sync").then((r) => r.json());
        setStats(data.stats);
        setConfig(data.config);
        setLogs(data.logs);
      } catch (err) {
        console.error("Data sync failed", err);
      }
    };

    fetchData();
    const iv = setInterval(fetchData, 2000);

    const terminalLines = [
      "Protocolo Kernel V4: AURORA_ULTRA [ELITE]",
      "Injeção Ring-0: ESTÁVEL [0xDEADBEEF]",
      "Camada Híbrida iOS: com.apple.aurora.ios.v4",
      "Sincronização de Hardware: 1ms [LOCK]",
      "Filtro Anti-Cheat: Bypass Ativo [100%]",
      "Tunel de Dados: Encrypt AES-256 [SECURE]",
      "DPI Overdrive: 12000 [DYNAMIC]",
      "Processo: painel_v4_vip.exe [SERVER_SYNC]",
      "Status: ACESSO TOTAL GARANTIDO",
      "Calibrando Magneto Neural... [OK]",
      "Smart Performance Optimization: Active",
    ];

    const terminalIv = setInterval(() => {
      setTerminalOutput((prev) => {
        const newLine = `[SYSTEM] ${terminalLines[Math.floor(Math.random() * terminalLines.length)]}`;
        return [
          {
            id: Math.random().toString(),
            text: newLine,
            time: new Date().toLocaleTimeString(),
          },
          ...prev.slice(0, 19),
        ];
      });
    }, 2500);

    return () => {
      clearInterval(iv);
      clearInterval(terminalIv);
    };
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (username === "admin" && password === "admin") ||
      (username === "ronaldo" && password === "admin")
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("axyon_auth", "true");
      setLoginError("");
    } else {
      setLoginError("CREDENTIALS REJECTED. ACCESS DENIED.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("axyon_auth");
  };

  const setConfigValue = async (group: string, key: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [group]: { ...prev[group], [key]: value },
    }));

    await fetch("/api/config/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group, key, value }),
    });
  };

  const toggleConfig = async (
    group: string,
    key: string,
    currentValue: boolean,
  ) => {
    const newValue = !currentValue;
    setConfig((prev: any) => ({
      ...prev,
      [group]: { ...prev[group], [key]: newValue },
    }));

    await fetch("/api/config/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group, key, value: newValue }),
    });
  };

  const handleInject = async () => {
    setIsInjecting(true);
    setTerminalOutput((prev) => [
      {
        id: Math.random().toString(),
        text: "[KERNEL] Injeção de registros 0x44A iniciada...",
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);

    // Sequência de Injeção Kernel
    const injectionSequence = [
      "ESTABELECENDO PONTE RING-0...",
      "BYPASS DE INTEGRIDADE APPLE/ANDROID [OK]",
      "MAPEANDO MATRIZ DE OSSOS (HEAD_SCAN)...",
      "INJETANDO S-LINEAR VECTOR V4...",
      "SINCRONIZANDO DRIVE DE TOUCH (1ms)...",
      "APLICANDO MÁSCARA DE HARDWARE [STEALTH]",
      "PROTOCOLO AURORA V4 ATIVO.",
    ];

    for (const step of injectionSequence) {
      await new Promise(r => setTimeout(r, 600));
      setTerminalOutput((prev) => [
        { id: Math.random().toString(), text: `[SYSTEM] ${step}`, time: new Date().toLocaleTimeString() },
        ...prev
      ]);
    }

    await fetch("/api/inject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentConfig: config }),
    });

    setTimeout(() => {
      setIsInjecting(false);
      // Kernel Sync Handshake: Active
    }, 1500);
  };

  const handleScanNetwork = async () => {
    setIsScanning(true);
    try {
      await fetch("/api/scan-network");
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
                PAINEL <span className="text-amber-500">JVIP</span>
              </h1>
              <p className="text-[9px] font-mono tracking-[0.6em] text-amber-500 mt-2 uppercase">
                EXCLUSIVO - JUNIOR VIP CLUB
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase ml-2">
                  Operator ID
                </label>
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
                <label className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase ml-2">
                  Secret Code
                </label>
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

              <button
                type="submit"
                className="w-full group bg-amber-600 hover:bg-amber-500 text-white font-black py-5 rounded-2xl transition-all shadow-[0_20px_40px_-10px_rgba(245,158,11,0.4)] mt-6 relative overflow-hidden active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10 tracking-[0.3em] font-display">
                  ENTRAR NO VIP
                </span>
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

  if (!stats || !config)
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center">
        <div className="space-y-6">
          <div className="w-16 h-16 bg-neutral-900 rounded-2xl mx-auto flex items-center justify-center relative overflow-hidden">
             <motion.div 
               animate={{ x: ['-100%', '100%'] }}
               transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
               className="absolute inset-0 bg-amber-500/20" 
             />
             <Activity className="w-6 h-6 text-amber-500 relative z-10" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Syncing Kernel...</p>
        </div>
        
        <div className="mt-12">
           <button
             onClick={() => {
               const defaultStats = { kills: 1337, headshotRate: 100, activePlayers: 42 };
               const defaultConfig = { 
                 VERSION: "JVIP_4.0_GOLD", 
                 FOV: { MAX_FOV: 140 }, 
                 NECK_DOMINANCE: { MAGNETIC_PULL: 1.85, AIM_TARGET: "HEAD" }, 
                 FEATURES: { NO_RECOIL: true, MAGIC_BULLET: true } 
               };
               setStats(defaultStats);
               setConfig(defaultConfig);
             }}
             className="text-[9px] text-neutral-600 border border-white/5 px-6 py-3 rounded-xl hover:text-amber-500 hover:border-amber-500/30 transition-all uppercase tracking-widest font-bold"
           >
             Bypass Local Sync
           </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#030303] text-neutral-100 font-sans selection:bg-amber-500/30 selection:text-white">
      {/* Background layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.03)_0%,transparent_50%)]" />
      </div>

      {/* Sidebar - Desktop Only */}
      <div className="fixed left-0 top-0 h-full w-[80px] bg-black border-r border-white/10 z-[100] hidden lg:flex flex-col items-center py-10 gap-10">
        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
          <Crosshair className="w-6 h-6 text-black" />
        </div>

        <div className="flex flex-col gap-6 flex-1">
          <SidebarLink
            icon={<Activity />}
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <SidebarLink
            icon={<Target />}
            active={activeTab === "arsenal"}
            onClick={() => setActiveTab("arsenal")}
          />
          <SidebarLink
            icon={<Settings />}
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </div>

        <button
          onClick={handleLogout}
          className="p-4 text-neutral-600 hover:text-amber-500 transition-colors duration-300"
        >
          <Power className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/5 z-[120] pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          <BottomNavItem
            icon={<Activity />}
            label="Home"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <BottomNavItem
            icon={<Target />}
            label="Arsenal"
            active={activeTab === "arsenal"}
            onClick={() => setActiveTab("arsenal")}
          />
          <BottomNavItem
            icon={<ShieldCheck />}
            label="Proxy"
            active={activeTab === "proxy"}
            onClick={() => setActiveTab("proxy")}
          />
          <BottomNavItem
            icon={<Settings />}
            label="Ajustes"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
          <BottomNavItem
            icon={<Power />}
            label="Sair"
            active={false}
            onClick={handleLogout}
          />
        </div>
      </div>

      {/* Mobile Header - Compact */}
      <div className="lg:hidden fixed top-0 w-full h-14 bg-black/50 backdrop-blur-md border-b border-white/5 z-[110] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <Crosshair className="w-5 h-5 text-black" />
          </div>
          <span className="font-display font-black tracking-tighter text-base italic uppercase">
            PAINEL <span className="text-amber-500">JVIP</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Online</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="lg:ml-[80px] p-4 xs:p-5 lg:p-12 max-w-7xl mx-auto pt-20 lg:pt-12 pb-24 lg:pb-12 relative z-10 min-h-screen">
        <AnimatePresence>
          {isInjecting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-8 gap-8"
            >
              <div className="absolute inset-0 scanline opacity-20" />
              <div className="w-64 h-64 relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-dashed border-amber-500/20 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 border-4 border-dashed border-amber-500/40 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="w-16 h-16 text-amber-500 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-4 max-w-md">
                <h3 className="text-2xl font-display font-black uppercase italic tracking-tighter text-amber-500 text-glow">INJETANDO MOTOR V4 VIP</h3>
                <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                   <motion.div 
                     initial={{ width: "0%" }}
                     animate={{ width: "100%" }}
                     transition={{ duration: 4.2, ease: "linear" }}
                     className="h-full bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.8)]"
                   />
                </div>
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-black italic">
                  Escrita Direta em Memória (Ring-0 Access)
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Compact Header for Dashboard */}
        <div className="mb-6 lg:mb-10 flex flex-col xs:flex-row items-start xs:items-end justify-between gap-4">
          <div className="space-y-0.5">
            <h1 className="text-3xl lg:text-4xl font-display font-black tracking-tighter uppercase italic leading-none">
              PAINEL <span className="text-amber-500">JVIP</span>
            </h1>
            <p className="text-neutral-500 font-mono text-[9px] tracking-[0.2em] uppercase font-bold opacity-60">
              V4 GOLD // KERNEL SYNCED
            </p>
          </div>

          <div className="flex gap-1.5 w-full xs:w-auto overflow-x-auto pb-1 xs:pb-0 hide-scrollbar">
            <HeaderStat label="Status" value="ATIVO" active />
            <HeaderStat label="Ping" value="12ms" color="text-amber-500" />
            <HeaderStat label="User" value={username || "VIP"} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <BentoCard className="sm:col-span-2 p-5 xs:p-8 overflow-hidden group">
                  <div className="flex flex-col h-full justify-between gap-6 xs:gap-10">
                    <div className="space-y-3 xs:space-y-4">
                      <div className="flex items-center gap-3">
                        <Activity className="text-amber-500 w-4 h-4 xs:w-5 xs:h-5 text-glow" />
                        <h3 className="text-lg xs:text-xl font-display font-black tracking-tight uppercase italic drop-shadow-sm">
                          CENTRAL DE COMANDO KERNEL
                        </h3>
                      </div>
                      <p className="text-neutral-500 text-xs xs:text-sm max-w-xl font-medium">
                        Integração total via **Injeção de Hardware**. Modificando registros de memória em tempo real para 
                        estabilização de mira e predição balística avançada. Status: **Bypass Indetectável**.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 xs:gap-6">
                      <StatBlock label="Eficiência Capa" value="99.4%" color="text-amber-500" />
                      <StatBlock label="Detecção" value="0.00%" color="text-emerald-500" />
                      <StatBlock label="Injeção" value="STABLE" color="text-amber-500" />
                      <StatBlock label="Bypass" value="ATIVO" color="text-emerald-500" />
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Zap className="w-32 h-32 text-amber-500" />
                  </div>
                </BentoCard>

                <BentoCard className="sm:col-span-2 p-8 border-white/5 bg-black/40">
                  <div className="flex flex-col lg:flex-row gap-8 items-center">
                    <div className="lg:w-1/2 space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-neutral-500 italic">Monitor de Calibração</h4>
                      <div className="h-48 w-full bg-black rounded-3xl border border-white/5 relative overflow-hidden flex items-center justify-center p-8">
                        <div className="absolute inset-0 grid grid-cols-6 gap-px opacity-5">
                          {[...Array(36)].map((_, i) => <div key={i} className="border border-white/10" />)}
                        </div>
                        <div className="relative">
                           <Crosshair className="w-12 h-12 text-amber-500 animate-pulse" />
                           <motion.div 
                             animate={{ y: [-10, -30, -10], scale: [1, 1.1, 1] }}
                             transition={{ duration: 1.5, repeat: Infinity }}
                             className="absolute -top-10 left-1/2 -translate-x-1/2 text-[9px] font-black text-amber-500 uppercase italic whitespace-nowrap"
                           >
                             Force Pull: 4.2x
                           </motion.div>
                        </div>
                        <div className="absolute bottom-4 right-4 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[8px] font-black uppercase text-neutral-500">Live Sync 1ms</span>
                        </div>
                      </div>
                    </div>
                    <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                       <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                          <span className="text-[8px] font-black text-neutral-600 uppercase">Aceleração</span>
                          <p className="text-lg font-display font-black italic">Log-Sync</p>
                       </div>
                       <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                          <span className="text-[8px] font-black text-neutral-600 uppercase">Suavização</span>
                          <p className="text-lg font-display font-black italic">Hermite</p>
                       </div>
                       <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                          <span className="text-[8px] font-black text-neutral-600 uppercase">DPI Virtual</span>
                          <p className="text-lg font-display font-black italic">12.5k</p>
                       </div>
                       <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 text-amber-500">
                          <span className="text-[8px] font-black text-neutral-600 uppercase">Puxão V4</span>
                          <p className="text-lg font-display font-black italic">AUTO</p>
                       </div>
                    </div>
                  </div>
                </BentoCard>

                <BentoCard className="p-8 hover:border-amber-500/30 transition-all">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-amber-500" />
                      <h3 className="text-lg font-display font-black italic uppercase">Alvo de Injeção</h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      <AimOption
                        label="CABEÇA (MAGNETO)"
                        active={config.NECK_DOMINANCE?.AIM_TARGET === "HEAD"}
                        onClick={() => setConfigValue("NECK_DOMINANCE", "AIM_TARGET", "HEAD")}
                      />
                      <AimOption
                        label="PESCOÇO (LOCK)"
                        active={config.NECK_DOMINANCE?.AIM_TARGET === "NECK"}
                        onClick={() => setConfigValue("NECK_DOMINANCE", "AIM_TARGET", "NECK")}
                      />
                      <AimOption
                        label="ADAPTATIVO V4"
                        active={config.NECK_DOMINANCE?.AIM_TARGET === "CHEST"}
                        onClick={() => setConfigValue("NECK_DOMINANCE", "AIM_TARGET", "CHEST")}
                      />
                    </div>
                  </div>
                </BentoCard>

                <BentoCard className="p-8 hover:border-emerald-500/30 transition-all">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <h3 className="text-lg font-display font-black italic uppercase">Bypass Ativo</h3>
                    </div>
                    <div className="space-y-3">
                      <FeatureToggle
                        label="ZERO-RECOIL"
                        icon={<Fingerprint className="w-4 h-4" />}
                        active={config.FEATURES?.NO_RECOIL}
                        onClick={() => setConfigValue("FEATURES", "NO_RECOIL", !config.FEATURES?.NO_RECOIL)}
                      />
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex justify-between items-center group">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Invisível</span>
                        <span className="text-[10px] font-black text-emerald-500 animate-pulse">PROTECTED</span>
                      </div>
                    </div>
                  </div>
                </BentoCard>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-6">
                <BentoCard className="p-8 bg-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.2)] border-none group overflow-hidden relative">
                  <div className="flex flex-col h-full justify-between items-start gap-8 relative z-10">
                    <div className="w-12 h-12 bg-black/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-black fill-black" />
                    </div>
                    <div className="space-y-4 w-full">
                      <h3 className="text-2xl font-display font-black text-black italic uppercase tracking-tighter leading-none">
                        START <br />SEQUENCE
                      </h3>
                      <button
                        onClick={handleInject}
                        disabled={isInjecting}
                        className="bg-black text-amber-500 w-full py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:bg-neutral-900 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                      >
                        {isInjecting ? "INJETANDO..." : "ACTIVAR BYPASS"}
                      </button>
                    </div>
                  </div>
                  <div className="absolute -bottom-8 -right-8 opacity-20 rotate-12 scale-150 group-hover:scale-[1.7] transition-transform duration-1000">
                    <Crosshair className="w-32 h-32 text-black" />
                  </div>
                </BentoCard>

                <BentoCard className="flex-1 p-6 flex flex-col overflow-hidden glass-dark min-h-[300px]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                       <Terminal className="w-3 h-3 text-neutral-500" />
                       <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-500">Kernel Out</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                    {terminalOutput.map((l) => (
                      <div key={l.id} className="text-[10px] font-mono text-neutral-400 leading-tight border-l border-white/5 pl-3">
                        <span className="text-amber-500/60 font-black">[{l.time}]</span> {l.text}
                      </div>
                    ))}
                  </div>
                </BentoCard>
              </div>
            </motion.div>
          )}

          {activeTab === "proxy" && (
            <motion.div
              key="proxy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              <div className="lg:col-span-8 flex flex-col gap-6">
                <BentoCard className="p-8 relative overflow-hidden glass-amber border-amber-500/30">
                  <div className="flex flex-col gap-8 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-display font-black uppercase italic tracking-tighter">
                          Traffic <span className="text-amber-500">Interceptor</span>
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                          Manipulação de Pacotes UDP Garena
                        </p>
                      </div>
                      <div className="p-4 bg-amber-500 rounded-2xl text-black shadow-xl animate-pulse">
                        <Activity className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="relative h-64 bg-black/60 rounded-[2.5rem] border border-white/10 overflow-hidden flex items-center justify-center">
                       {/* Packet Visualizer */}
                       <div className="absolute inset-0 flex items-end justify-around px-12 pb-8">
                         {[...Array(20)].map((_, i) => (
                           <motion.div
                             key={i}
                             animate={{
                               height: [20, 160, 40, 120, 20],
                               opacity: [0.3, 1, 0.3],
                               backgroundColor: ["#f59e0b", "#10b981", "#f59e0b"]
                             }}
                             transition={{
                               duration: 2 + Math.random() * 2,
                               repeat: Infinity,
                               delay: i * 0.1,
                               ease: "easeInOut"
                             }}
                             className="w-1.5 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                           />
                         ))}
                       </div>
                       
                       <div className="relative z-10 bg-black/80 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/5 space-y-2">
                           <h4 className="text-sm font-black uppercase tracking-widest text-amber-500 text-glow">PROTOTYPE: SYNC_UDP_FIX</h4>
                           <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-[0.2em] text-center">
                             Injeção de Vetores: ATIVA
                           </p>
                       </div>
                       
                       <div className="scanline absolute inset-0 opacity-10" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       <PacketStat label="Alvos Scaneados" value="12" />
                       <PacketStat label="Lag Compensation" value="-120ms" color="text-emerald-500" />
                       <PacketStat label="Injeção Hardware" value="FULL" color="text-amber-500" />
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck className="w-64 h-64 text-amber-500" />
                  </div>
                </BentoCard>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <BentoCard className="p-8 bg-neutral-900/60 flex items-center gap-6 group hover:border-amber-500/20 transition-all">
                      <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                        <Zap className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display font-black uppercase italic text-sm">Turbo Flow</h4>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-tight">Encaminhamento prioritário de pacotes no servidor.</p>
                      </div>
                   </BentoCard>
                   <BentoCard className="p-8 bg-neutral-900/60 flex items-center gap-6 group hover:border-emerald-500/20 transition-all">
                      <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display font-black uppercase italic text-sm">Crypt Mask</h4>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-tight">Pacotes criptografados para evitar detecção de ISP.</p>
                      </div>
                   </BentoCard>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-6">
                 <BentoCard className="p-8 space-y-8 h-full bg-black/40">
                    <div className="space-y-2">
                       <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400">Status do Túnel</h3>
                       <div className="h-1 lg:h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                         <motion.div 
                           animate={{ x: ["-100%", "100%"] }}
                           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                           className="w-1/3 h-full bg-amber-500"
                         />
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       <ProxyFeature label="Injeção de DNS" active />
                       <ProxyFeature label="Spoofing de IP" active />
                       <ProxyFeature label="UDP Tunneling" active />
                       <ProxyFeature label="Kernel Bridge" active />
                    </div>

                    <div className="pt-6 border-t border-white/5">
                       <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-center">
                          <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest leading-relaxed">
                            Servidor VIP: SÃO PAULO - BR <br /> Latência: 4ms
                          </p>
                       </div>
                    </div>
                 </BentoCard>
              </div>
            </motion.div>
          )}

          {activeTab === "arsenal" && (
            <motion.div
              key="arsenal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              </div>

              <BentoCard className="p-8 bg-neutral-900/40 border-white/5">
                <div className="flex flex-col lg:flex-row gap-12">
                   <div className="lg:w-1/3 space-y-4">
                      <div className="flex items-center gap-3">
                         <Zap className="w-5 h-5 text-amber-500" />
                         <h3 className="text-xl font-display font-black uppercase italic">Ajuste de Puxada</h3>
                      </div>
                      <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                        Calibração fina do multiplicador vertical por categoria de arma. 
                        Recomendado: 1.25x para Rifles e 2.8x para Desert Eagle/SVD.
                      </p>
                   </div>
                   <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 block">Multiplicador Rifle</label>
                         <div className="flex items-center gap-4">
                            <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
                               <div className="w-[85%] h-full bg-amber-500" />
                            </div>
                            <span className="text-xs font-mono font-bold text-amber-500">1.8x</span>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 block">Multiplicador SMG</label>
                         <div className="flex items-center gap-4">
                            <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
                               <div className="w-[95%] h-full bg-amber-500" />
                            </div>
                            <span className="text-xs font-mono font-bold text-amber-500">2.4x</span>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 block">Curva de Aceleração</label>
                         <div className="flex items-center gap-4">
                            <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
                               <div className="w-[60%] h-full bg-amber-500" />
                            </div>
                            <span className="text-xs font-mono font-bold text-amber-500">Linear</span>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 block">Auto-Pull Head</label>
                         <div className="flex items-center gap-4">
                            <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
                               <div className="w-[100%] h-full bg-emerald-500" />
                            </div>
                            <span className="text-xs font-mono font-bold text-emerald-500">MAX</span>
                         </div>
                      </div>
                   </div>
                </div>
              </BentoCard>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3 flex flex-col gap-6">
                  <div className="p-8 bg-amber-500 rounded-[2.5rem] text-black shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                    <h2 className="text-4xl font-display font-black uppercase italic tracking-tighter leading-none mb-4">
                      MOTOR <br />ELITE V4
                    </h2>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Sincronizado via Kernel</span>
                    </div>
                    <div className="space-y-2 pt-4 border-t border-black/10">
                       <p className="text-[10px] font-bold uppercase">Firmware: Aurora_OS_2024</p>
                       <p className="text-[10px] font-bold uppercase">Licença: VIP_PERMANENTE</p>
                    </div>
                  </div>

                  <BentoCard className="p-6 bg-black/40 border-white/5">
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <ShieldCheck className="w-4 h-4 text-emerald-500" />
                           <span className="text-xs font-black uppercase italic">Segurança Ativa</span>
                        </div>
                        <div className="space-y-2">
                           <ProxySetting label="Anti-Ban" status="RING-0" />
                           <ProxySetting label="Spoofing" status="ACTIVE" />
                           <ProxySetting label="Packet Mask" status="ENABLED" />
                        </div>
                     </div>
                  </BentoCard>
                </div>

                <div className="lg:w-2/3 grid grid-cols-1 gap-8 bg-black/60 p-8 lg:p-12 rounded-[3rem] border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Apple className="w-64 h-64 text-white" />
                  </div>

                  <div className="space-y-8 relative z-10">
                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          const uuid = () => Math.random().toString(36).substring(2, 10).toUpperCase();
                          const profileUUID = uuid();
                          const configUUID = uuid();
                          const mobileConfig = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadDescription</key>
            <string>Configuração de Otimização Kernel Aurora VIP V4 - Elite iPhone Sync</string>
            <key>PayloadDisplayName</key>
            <string>Aurora Kernel V4 Engine</string>
            <key>PayloadIdentifier</key>
            <string>com.aurora.v4.sync.${configUUID}</string>
            <key>PayloadType</key>
            <string>com.apple.ManagedClient.preferences</string>
            <key>PayloadUUID</key>
            <string>${configUUID}</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>PayloadConfig</key>
            <dict>
                <key>ForceCapa</key>
                <real>${config.PREDICTION_KERNEL?.STRENGTH || 0.95}</real>
                <key>BypassRate</key>
                <string>1ms</string>
                <key>VectorLock</key>
                <string>${config.NECK_DOMINANCE?.AIM_TARGET}</string>
                <key>Signature</key>
                <string>AURORAVIP-IOS-V4-STABLE</string>
            </dict>
        </dict>
    </array>
    <key>PayloadDisplayName</key>
    <string>JVIP AURORA V4 - ELITE IPHONE</string>
    <key>PayloadIdentifier</key>
    <string>com.aurora.vip.v4</string>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>${profileUUID}</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>`;
                          const blob = new Blob([mobileConfig], { type: 'application/x-apple-aspen-config' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `AURORA_VIP_V4_APPLE.mobileconfig`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }}
                        className="w-full py-6 bg-gradient-to-r from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-black font-black uppercase tracking-[0.3em] rounded-3xl flex items-center justify-center gap-4 transition-all shadow-[0_0_40px_rgba(245,158,11,0.3)] active:scale-95 group"
                      >
                        <Apple className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                        INSTALAR AJUSTES IPHONE (V4)
                      </button>
                      <p className="text-[10px] text-neutral-500 font-mono text-center uppercase tracking-widest leading-relaxed">
                        Certificação de Desenvolvedor Aurora Protocol <br />
                        Sincronização em Nível de Hardware (Ring-0)
                      </p>
                    </div>

                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                            Frequência de Injeção
                          </span>
                          <span className="text-amber-500 font-mono font-bold">1ms</span>
                        </label>
                        <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="w-full h-full bg-amber-500" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                            Protocolo de Estabilização
                          </span>
                          <span className="text-emerald-500 font-mono font-bold text-[10px] uppercase">HYBRID_V4</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                           <div className="px-2 py-1 bg-white/5 border border-white/5 rounded text-[8px] font-bold text-center uppercase tracking-widest">Fixed</div>
                           <div className="px-2 py-1 bg-amber-500 text-black rounded text-[8px] font-black text-center uppercase tracking-widest">Dynamic</div>
                           <div className="px-2 py-1 bg-white/5 border border-white/5 rounded text-[8px] font-bold text-center uppercase tracking-widest">Off</div>
                        </div>
                      </div>

                    <div className="space-y-6">
                      <label className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Radius FOV
                        </span>
                        <span className="text-amber-500 font-mono font-bold text-lg">
                          {config.FOV?.MAX_FOV}px
                        </span>
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="800"
                        step="5"
                        value={config.FOV?.MAX_FOV || 360}
                        onChange={(e) => setConfigValue("FOV", "MAX_FOV", parseInt(e.target.value))}
                        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>

                    <div className="space-y-6">
                      <label className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Intensidade da Predição
                        </span>
                        <span className="text-amber-500 font-mono font-bold text-lg">
                          {(config.PREDICTION_KERNEL?.STRENGTH * 100).toFixed(0)}%
                        </span>
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1.5"
                        step="0.05"
                        value={config.PREDICTION_KERNEL?.STRENGTH || 0.95}
                        onChange={(e) => setConfigValue("PREDICTION_KERNEL", "STRENGTH", parseFloat(e.target.value))}
                        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>

                    <div className="space-y-6">
                      <label className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Compensação de Velocidade 
                        </span>
                        <span className="text-amber-500 font-mono font-bold text-lg">
                          {config.PREDICTION_KERNEL?.VELOCITY_SCALE?.toFixed(2)}x
                        </span>
                      </label>
                      <input
                        type="range"
                        min="1.0"
                        max="5.0"
                        step="0.1"
                        value={config.PREDICTION_KERNEL?.VELOCITY_SCALE || 2.25}
                        onChange={(e) => setConfigValue("PREDICTION_KERNEL", "VELOCITY_SCALE", parseFloat(e.target.value))}
                        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <GenericToggle
                  label="Predição Kernel V4"
                  group="PREDICTION_KERNEL"
                  configKey="ENABLED"
                  active={config.PREDICTION_KERNEL?.ENABLED}
                  onToggle={toggleConfig}
                />
                <GenericToggle
                  label="Curva de Salto"
                  group="PREDICTION_KERNEL"
                  configKey="PREDICT_JUMP_CURVE"
                  active={config.PREDICTION_KERNEL?.PREDICT_JUMP_CURVE}
                  onToggle={toggleConfig}
                />
                <GenericToggle
                  label="Silent Aim"
                  group="FEATURES"
                  configKey="SILENT_AIM"
                  active={config.FEATURES?.SILENT_AIM}
                  onToggle={toggleConfig}
                />
                <GenericToggle
                  label="No Recoil"
                  group="FEATURES"
                  configKey="NO_RECOIL"
                  active={config.FEATURES?.NO_RECOIL}
                  onToggle={toggleConfig}
                />
                <GenericToggle
                  label="ESP Lines"
                  group="FEATURES"
                  configKey="ESP_LINES"
                  active={config.FEATURES?.ESP_LINES}
                  onToggle={toggleConfig}
                />
                <GenericToggle
                  label="Anti-Ban V4"
                  group="ANTI_BAN"
                  configKey="ENABLED"
                  active={config.ANTI_BAN?.ENABLED}
                  onToggle={toggleConfig}
                />
                <GenericToggle
                  label="HWID Mask"
                  group="ANTI_BAN"
                  configKey="HARDWARE_ID_SPOOFING"
                  active={config.ANTI_BAN?.HARDWARE_ID_SPOOFING}
                  onToggle={toggleConfig}
                />
                <GenericToggle
                  label="UDP Priority"
                  group="PERFORMANCE"
                  configKey="UDP_PRIORITY"
                  active={config.PERFORMANCE?.UDP_PRIORITY}
                  onToggle={toggleConfig}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// UI Design Elements
function SidebarLink({ icon, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl transition-all duration-300 relative group active:scale-95 ${active ? "bg-amber-500 text-black shadow-lg" : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"}`}
    >
      {React.cloneElement(icon, { className: "w-6 h-6" })}
    </button>
  );
}

function BottomNavItem({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${active ? "text-amber-500" : "text-neutral-500"}`}
    >
      <div className={`p-2 rounded-xl transition-all ${active ? "bg-amber-500/10" : ""}`}>
        {React.cloneElement(icon, { className: `w-5 h-5 ${active ? "fill-amber-500/20" : ""}` })}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-tight ${active ? "opacity-100" : "opacity-0 scale-75"} transition-all`}>
        {label}
      </span>
    </button>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="h-[1px] flex-1 bg-white/5" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600">
        {label}
      </span>
      <div className="h-[1px] flex-1 bg-white/5" />
    </div>
  );
}

function BentoCard({ children, className }: any) {
  return (
    <div
      className={`bg-neutral-900/40 rounded-2xl xs:rounded-3xl border border-white/5 relative backdrop-blur-md transition-all duration-500 hover:border-white/10 ${className}`}
    >
      {children}
    </div>
  );
}

function ProxyFeature({ label, active }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
       <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{label}</span>
       <div className={`flex items-center gap-2 ${active ? "text-emerald-500" : "text-neutral-600"}`}>
          <span className="text-[9px] font-black uppercase tracking-widest">{active ? "STATUS: OK" : "OFFLINE"}</span>
          <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-neutral-800"}`} />
       </div>
    </div>
  );
}

function PacketStat({ label, value, color = "text-white" }: any) {
  return (
    <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex flex-col gap-1">
       <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">{label}</span>
       <span className={`text-lg font-display font-black italic ${color}`}>{value}</span>
    </div>
  );
}

function ProxySetting({ label, status, color = "text-emerald-500" }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
       <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{label}</span>
       <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{status}</span>
    </div>
  );
}

function HeaderStat({ label, value, active, color = "text-white" }: any) {
  return (
    <div className={`px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl flex flex-col text-center min-w-[70px] xs:min-w-[90px] ${active ? "bg-amber-500/10 border border-amber-500/20" : "bg-black/20 border border-white/5"}`}>
      <span className="text-[7px] xs:text-[8px] font-black uppercase tracking-widest text-neutral-500 mb-0.5 leading-none">
        {label}
      </span>
      <span className={`text-[9px] xs:text-[10px] font-black uppercase italic ${color}`}>
        {value}
      </span>
    </div>
  );
}

function StatBlock({ label, value, color }: any) {
  return (
    <div className="space-y-0.5">
      <span className="text-[7px] xs:text-[8px] font-black uppercase tracking-widest text-neutral-600 leading-none">
        {label}
      </span>
      <p className={`text-xs xs:text-sm lg:text-base font-black uppercase italic tracking-tight leading-none ${color || "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

function AimOption({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${active ? "bg-amber-500/10 border-amber-500/40 text-white" : "bg-black/40 border-white/5 text-neutral-500 hover:border-white/20"}`}
    >
      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${active ? "translate-x-1" : ""} transition-transform`}>
        {label}
      </span>
      <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${active ? "bg-amber-500 glow-amber scale-125" : "bg-neutral-800"}`} />
    </button>
  );
}

function StatusRow({ label, status }: any) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-[8px] font-bold text-emerald-500 uppercase">
          {status}
        </span>
        <div className="w-1 h-1 rounded-full bg-emerald-500" />
      </div>
    </div>
  );
}

function WeaponCard({ name, type, rarity, stats, sync, glow }: any) {
  return (
    <BentoCard className={`p-5 xs:p-7 group border transition-all duration-300 ${glow}`}>
      <div className="flex flex-col h-full justify-between gap-6 xs:gap-8">
        <div className="space-y-3 xs:space-y-4">
          <div className="flex justify-between items-start">
            <div className={`px-2 py-0.5 rounded text-[7px] xs:text-[8px] font-black uppercase tracking-widest italic border ${rarity === "LEGENDARY" ? "bg-amber-500/10 border-amber-500/30 text-amber-500" : rarity === "MYTHIC" ? "bg-amber-500/10 border-amber-500/30 text-amber-600" : "bg-purple-500/10 border-purple-500/30 text-purple-500"}`}>
              {rarity}
            </div>
            <span className="text-[8px] xs:text-[9px] font-mono text-neutral-600 font-bold uppercase tracking-widest">
              Sync: {sync}%
            </span>
          </div>
          <div>
            <h3 className="text-lg xs:text-xl font-display font-black tracking-tight leading-none mb-1 uppercase italic group-hover:text-amber-500 transition-colors">
              {name}
            </h3>
            <p className="text-[8px] xs:text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
              {type} Armament
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <WeaponStat value={stats.dmg} label="DMG" />
          <WeaponStat value={stats.acc} label="ACC" />
          <WeaponStat value={stats.rng} label="RNG" />
        </div>

        <button className="w-full py-2.5 xs:py-3 border border-white/5 rounded-xl bg-white/[0.02] hover:bg-white/5 transition-all text-[8px] xs:text-[9px] font-black uppercase tracking-widest">
          Select armament
        </button>
      </div>
    </BentoCard>
  );
}

function WeaponStat({ value, label }: any) {
  return (
    <div className="bg-black/40 border border-white/5 p-2 rounded-lg flex flex-col items-center">
      <span className="text-sm font-display font-black text-white italic">
        {value}
      </span>
      <span className="text-[8px] font-bold text-neutral-600 uppercase">
        {label}
      </span>
    </div>
  );
}

function GenericToggle({ label, configKey, active, onToggle, group }: any) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      onClick={() => onToggle(group, configKey, active)}
      className={`flex flex-col p-5 rounded-2xl border transition-all duration-300 text-left ${active ? "bg-amber-500/5 border-amber-500/30" : "bg-neutral-900/40 border-white/5 hover:border-white/10"}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${active ? "bg-amber-500 text-black shadow-lg" : "bg-neutral-800 text-neutral-600"}`}>
          <Layers className="w-4 h-4" />
        </div>
        <div className={`w-2 h-2 rounded-full ${active ? "bg-amber-500 glow-amber" : "bg-neutral-800"}`} />
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest ${active ? "text-white" : "text-neutral-500"}`}>
        {label}
      </span>
      <span className="text-[8px] font-mono text-neutral-700 mt-1 uppercase font-bold tracking-widest">
        Active Security
      </span>
    </motion.button>
  );
}

function FeatureToggle({ label, icon, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${active ? "bg-amber-500/10 border-amber-500/40 text-white" : "bg-black/40 border-white/5 text-neutral-500 hover:border-white/20"}`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? "bg-amber-500 text-black shadow-lg" : "bg-neutral-800 text-neutral-600"}`}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest flex-1 text-left">
        {label}
      </span>
      <div className={`w-2 h-2 rounded-full transition-all duration-500 ${active ? "bg-amber-500 glow-amber" : "bg-neutral-800"}`} />
    </button>
  );
}
