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
  const [activeTab, setActiveTab] = useState("dashboard");
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
      "Protocol: AURORA_ULTRA V4 ENABLED",
      "Kernel bypass module [iOS] injected: OK",
      "Memory spoofing active: AES-256-GCM",
      "Anti-cheat pattern masked: Stealth Mode",
      "Scanning Integrity Shield [verified]",
      "Zero-Delay Kernel Sync Active (1ms)",
      "iPhone High-Frequency Layer Linked",
      "Synchronization stable: 99.8%",
      "Bypassing hardware identification...",
      "Packet integrity shield verified",
      "Protocol: ANTI_DETECTION_V4 ENABLED",
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
        text: "[NUR] Synchronizing Neural Params...",
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);

    await fetch("/api/inject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentConfig: config }),
    });

    setTimeout(() => {
      setIsInjecting(false);
      window.location.href = "freefire://";
    }, 2000);
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
                <BentoCard className="sm:col-span-2 p-5 xs:p-8">
                  <div className="flex flex-col h-full justify-between gap-6 xs:gap-10">
                    <div className="space-y-3 xs:space-y-4">
                      <div className="flex items-center gap-3">
                        <Activity className="text-amber-500 w-4 h-4 xs:w-5 xs:h-5" />
                        <h3 className="text-lg xs:text-xl font-display font-black tracking-tight uppercase italic">
                          Monitor de Performance
                        </h3>
                      </div>
                      <p className="text-neutral-500 text-xs xs:text-sm max-w-xl">
                        Informações em tempo real da injeção de memória e status do bypass. 
                        Configurações otimizadas para alto desempenho.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 xs:gap-6">
                      <StatBlock label="Abatimentos" value={stats.kills} />
                      <StatBlock label="HS %" value={`${stats.headshotRate}%`} />
                      <StatBlock label="Ativos" value={stats.activePlayers} />
                      <StatBlock label="Bypass" value="PROTEGIDO" color="text-emerald-500" />
                    </div>
                  </div>
                </BentoCard>

                <BentoCard className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-amber-500" />
                      <h3 className="text-lg font-display font-black italic uppercase">Direcionamento</h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      <AimOption
                        label="CABEÇA"
                        active={config.NECK_DOMINANCE?.AIM_TARGET === "HEAD"}
                        onClick={() => setConfigValue("NECK_DOMINANCE", "AIM_TARGET", "HEAD")}
                      />
                      <AimOption
                        label="PESCOÇO"
                        active={config.NECK_DOMINANCE?.AIM_TARGET === "NECK"}
                        onClick={() => setConfigValue("NECK_DOMINANCE", "AIM_TARGET", "NECK")}
                      />
                      <AimOption
                        label="ADAPTATIVO"
                        active={config.NECK_DOMINANCE?.AIM_TARGET === "CHEST"}
                        onClick={() => setConfigValue("NECK_DOMINANCE", "AIM_TARGET", "CHEST")}
                      />
                    </div>
                  </div>
                </BentoCard>

                <BentoCard className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <h3 className="text-lg font-display font-black italic uppercase">Segurança Ativa</h3>
                    </div>
                    <div className="space-y-3">
                      <FeatureToggle
                        label="ANTI-RECOIL"
                        icon={<Fingerprint className="w-4 h-4" />}
                        active={config.FEATURES?.NO_RECOIL}
                        onClick={() => setConfigValue("FEATURES", "NO_RECOIL", !config.FEATURES?.NO_RECOIL)}
                      />
                      <div className="p-4 bg-black/40 border border-white/5 rounded-xl flex justify-between items-center">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Escudo Digital</span>
                        <span className="text-[10px] font-black text-emerald-500">INDETECTÁVEL</span>
                      </div>
                    </div>
                  </div>
                </BentoCard>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-6">
                <BentoCard className="p-8 bg-amber-500 shadow-xl border-none">
                  <div className="flex flex-col h-full justify-between items-start gap-8">
                    <div className="w-12 h-12 bg-black/20 rounded-xl flex items-center justify-center">
                      <Power className="w-6 h-6 text-black" />
                    </div>
                    <div className="space-y-4 w-full">
                      <h3 className="text-2xl font-display font-black text-black italic uppercase tracking-tighter leading-none">
                        SINCRONIZAR <br />DADOS
                      </h3>
                      <button
                        onClick={handleInject}
                        disabled={isInjecting}
                        className="bg-black text-amber-500 w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
                      >
                        {isInjecting ? "SINCRONIZANDO..." : "ATIVAR AGORA"}
                      </button>
                    </div>
                  </div>
                </BentoCard>

                <BentoCard className="flex-1 p-6 flex flex-col overflow-hidden glass-dark min-h-[300px]">
                  <div className="flex items-center gap-2 mb-6">
                    <Terminal className="w-3 h-3 text-neutral-500" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-500">System Logs</span>
                  </div>
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {terminalOutput.slice(0, 10).map((l) => (
                      <div key={l.id} className="text-[10px] font-mono text-neutral-500 leading-tight">
                        <span className="text-amber-500/40">[{l.time}]</span> {l.text}
                      </div>
                    ))}
                  </div>
                </BentoCard>
              </div>
            </motion.div>
          )}

          {activeTab === "arsenal" && (
            <motion.div
              key="arsenal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <BentoCard className="p-8 lg:p-12 border-amber-500/10">
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="lg:w-1/3 space-y-6">
                    <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-black">
                      <Cpu className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-display font-black tracking-tight italic uppercase">
                      Driver <br />
                      <span className="text-amber-500">Kernel</span>
                    </h2>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                      Ajuste os parâmetros de sensibilidade e aquisição de alvos do motor.
                    </p>
                  </div>

                  <div className="lg:w-2/3 grid grid-cols-1 gap-8 bg-black/40 p-6 xs:p-8 rounded-[2rem] border border-white/5">
                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          const profileId = `com.aurora.protocol.${Math.random().toString(16).slice(2, 8)}`;
                          const mobileConfig = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadDescription</key>
            <string>Configuracao de Estabilidade Aurora Protocol V4 - iPhone Ultra</string>
            <key>PayloadDisplayName</key>
            <string>Aurora Protocol Kernel Sync</string>
            <key>PayloadIdentifier</key>
            <string>${profileId}.settings</string>
            <key>PayloadType</key>
            <string>com.apple.ManagedClient.preferences</string>
            <key>PayloadUUID</key>
            <string>${Math.random().toString(36).substring(7)}</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>PayloadConfig</key>
            <dict>
                <key>ConfigJSON</key>
                <string>${JSON.stringify(config)}</string>
                <key>KernelStrength</key>
                <real>${config.PREDICTION_KERNEL?.STRENGTH || 0.95}</real>
                <key>VelocityScale</key>
                <real>${config.PREDICTION_KERNEL?.VELOCITY_SCALE || 2.25}</real>
            </dict>
        </dict>
    </array>
    <key>PayloadDisplayName</key>
    <string>JVIP AURORA V4 - iPhone Profile</string>
    <key>PayloadIdentifier</key>
    <string>${profileId}</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>${Math.random().toString(36).substring(7)}</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>`;
                          const blob = new Blob([mobileConfig], { type: 'application/x-apple-aspen-config' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `JVIP_AURORA_iOS.mobileconfig`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }}
                        className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                      >
                        <Apple className="w-5 h-5" />
                        Baixar Perfil iPhone (.mobileconfig)
                      </button>
                      <p className="text-[9px] text-neutral-600 font-mono text-center uppercase tracking-widest leading-tight">
                        Certificado Apple V4 // Instalar Ajustes no Sistema
                      </p>
                    </div>

                    <div className="h-[1px] bg-white/5" />

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
              </BentoCard>

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
