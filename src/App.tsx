import React, { useState, useEffect } from "react";
import { 
  ShieldCheck as ShieldCheckIcon,
  Download as DownloadIcon,
  Smartphone as SmartphoneIcon,
  Activity as ActivityIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const AWS_IP = "18.118.104.195";
const AWS_ENDPOINT = `http://${AWS_IP}:8080`;

const BentoCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-neutral-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden relative shadow-2xl ${className}`}>
    {children}
  </div>
);

export default function App() {
  const [engineStatus, setEngineStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/aws-status");
        const data = await res.json();
        setEngineStatus(data.status);
      } catch {
        setEngineStatus("offline");
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 lg:p-12 font-sans relative overflow-x-hidden flex items-center justify-center">
      <div className="fixed inset-0 scanline opacity-10 pointer-events-none" />
      
      <main className="w-full max-w-4xl mx-auto space-y-12 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-24 h-24 mx-auto bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.3)] mb-8"
          >
            <ShieldCheckIcon className="w-12 h-12 text-black fill-black" />
          </motion.div>
          <h1 className="text-5xl font-display font-black uppercase italic tracking-tighter leading-none text-white">
            AXYON <span className="text-emerald-500">VIP</span>
          </h1>
          <p className="text-neutral-500 font-mono text-xs uppercase tracking-[0.4em] font-bold">
            Central de Auto Configuração R7
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Passo 1 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <BentoCard className="p-10 flex flex-col items-center text-center h-full gap-6 hover:border-emerald-500/30 transition-colors group">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <DownloadIcon className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-2">Passo 1</span>
                <h3 className="text-xl font-display font-black uppercase italic tracking-tight text-white mb-2">Certificado</h3>
                <p className="text-xs text-neutral-500 font-medium leading-relaxed mb-6">
                  Instale e ative a Confiança Total em Ajustes. Essencial para o Bypass.
                </p>
              </div>
              <button 
                onClick={() => window.location.href = `${AWS_ENDPOINT}/mitm_ca.der`}
                className="mt-auto w-full py-4 bg-white/5 hover:bg-emerald-500 hover:text-black border border-white/10 hover:border-emerald-500 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-neutral-400 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" /> Baixar Confiança
              </button>
            </BentoCard>
          </motion.div>

          {/* Passo 2 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <BentoCard className="p-10 flex flex-col items-center text-center h-full gap-6 hover:border-emerald-500/30 transition-colors group">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <SmartphoneIcon className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-2">Passo 2</span>
                <h3 className="text-xl font-display font-black uppercase italic tracking-tight text-white mb-2">Perfil R7VIPXIT</h3>
                <p className="text-xs text-neutral-500 font-medium leading-relaxed mb-6">
                  Configura o seu proxy L7 automaticamente para a nossa AWS. Zero esforço.
                </p>
              </div>
              <button 
                onClick={() => window.location.href = `/download/mobileconfig?awsIp=${AWS_IP}`}
                className="mt-auto w-full py-4 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)] active:scale-95 flex items-center justify-center gap-2"
              >
                <SmartphoneIcon className="w-4 h-4" /> Instalar VIP
              </button>
            </BentoCard>
          </motion.div>

          {/* Passo 3 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <BentoCard className="p-10 flex flex-col items-center text-center h-full gap-6 border-emerald-500/10">
              <div className="relative">
                <div className={`w-16 h-16 rounded-full bg-black flex items-center justify-center border shadow-[0_0_30px_rgba(16,185,129,0.2)] ${engineStatus === 'online' ? 'border-emerald-500/50' : engineStatus === 'offline' ? 'border-red-500/50' : 'border-amber-500/50'}`}>
                  <ActivityIcon className={`w-8 h-8 ${engineStatus === 'online' ? 'text-emerald-500' : engineStatus === 'offline' ? 'text-red-500' : 'text-amber-500'}`} />
                </div>
                {engineStatus === 'online' && (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute -inset-2 border border-emerald-500/20 rounded-full border-t-emerald-500 pointer-events-none"
                  />
                )}
              </div>
              <div>
                <span className={`text-[10px] font-black uppercase tracking-widest block mb-2 ${engineStatus === 'online' ? 'text-emerald-500' : engineStatus === 'offline' ? 'text-red-500' : 'text-amber-500'}`}>Passo 3</span>
                <h3 className="text-xl font-display font-black uppercase italic tracking-tight text-white mb-2">Status do Motor</h3>
                <p className="text-xs text-neutral-500 font-medium leading-relaxed mb-6">
                  Após instalar as duas etapas acima, basta abrir o jogo. O proxy está configurado.
                </p>
              </div>
              <div className="mt-auto w-full py-4 bg-black/50 border border-white/5 rounded-[1.5rem] flex items-center justify-center gap-3">
                 <div className={`w-2 h-2 rounded-full ${engineStatus === 'online' ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]' : engineStatus === 'offline' ? 'bg-red-500' : 'bg-amber-500 animate-pulse'}`} />
                 <span className={`text-[9px] font-mono font-bold uppercase tracking-widest ${engineStatus === 'online' ? 'text-emerald-500' : engineStatus === 'offline' ? 'text-red-500' : 'text-amber-500'}`}>
                   {engineStatus === 'online' ? 'Motor ON' : engineStatus === 'offline' ? 'Manutenção' : 'Checando...'}
                 </span>
              </div>
            </BentoCard>
          </motion.div>

        </div>

      </main>
    </div>
  );
}

