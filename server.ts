import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API do Painel Elite v4
  app.post("/api/kernel/inject", (req, res) => {
    const { profile, settings, hwid } = req.body;
    console.log(`[AURORA_LOG] Injeção de Segurança Iniciada: Profile=${profile} HWID=${hwid}`);
    
    // Algoritmo de Sincronização S-Linear
    const sessionToken = Buffer.from(`${Date.now()}-${profile}`).toString('base64').slice(0, 16);
    
    setTimeout(() => {
      res.json({ 
        status: "success", 
        token: sessionToken,
        bridge: "NATIVE_HYBRID",
        kernelLevel: "RING-0",
        message: "Aurora Engine V4 estabilizada no hardware."
      });
    }, 1200);
  });

  app.get("/api/kernel/status", (req, res) => {
    res.json({ 
      latency: "1.2ms", 
      activeSessions: 1242, 
      bypassStatus: "UNDETECTED",
      version: "4.8.2-PRO"
    });
  });

  app.get("/download/mobileconfig", (req, res) => {
    const uuid1 = Math.random().toString(36).substring(2, 15).toUpperCase();
    const profileUuid = Math.random().toString(36).substring(2, 15).toUpperCase();

    const config = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>PayloadContent</key>
	<array>
		<dict>
			<key>PayloadDescription</key>
			<string>AXYON Network Bridge - Interceptação L7</string>
			<key>PayloadDisplayName</key>
			<string>AXYON Proxy Config</string>
			<key>PayloadIdentifier</key>
			<string>com.axyon.proxy.${uuid1}</string>
			<key>PayloadType</key>
			<string>com.apple.webClip.managed</string>
			<key>PayloadUUID</key>
			<string>${uuid1}</string>
			<key>PayloadVersion</key>
			<integer>1</integer>
			<key>URL</key>
			<string>https://axyon-hub.tech/setup</string>
			<key>Label</key>
			<string>AXYON Hub</string>
		</dict>
        <dict>
            <key>PayloadType</key>
            <string>com.apple.vpn.managed</string>
            <key>PayloadIdentifier</key>
            <string>com.axyon.vpn.config</string>
            <key>PayloadUUID</key>
            <string>${Math.random().toString(36).substring(2, 10).toUpperCase()}</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>UserDefinedName</key>
            <string>AURORA_AXYON_PROXY</string>
            <key>VPNType</key>
            <string>HTTP</string>
            <key>HTTPProxy</key>
            <dict>
                <key>ProxyServer</key>
                <string>proxy.axyon-hub.io</string>
                <key>ProxyPort</key>
                <integer>8080</integer>
            </dict>
        </dict>
	</array>
	<key>PayloadDescription</key>
	<string>AXYON HUB v4.8 - Sistema de Interceptação de Pacotes. Requer Certificado Root AXYON.</string>
	<key>PayloadDisplayName</key>
	<string>AURORA ELITE (Powered by AXYON)</string>
	<key>PayloadIdentifier</key>
	<string>com.axyon.elite.profile.${profileUuid}</string>
	<key>PayloadOrganization</key>
	<string>AXYON Technologies</string>
	<key>PayloadRemovalDisallowed</key>
	<false/>
	<key>PayloadType</key>
	<string>Configuration</string>
	<key>PayloadUUID</key>
	<string>${profileUuid}</string>
	<key>PayloadVersion</key>
	<integer>1</integer>
</dict>
</plist>`;

    res.setHeader('Content-Type', 'application/x-apple-aspen-config');
    res.setHeader('Content-Disposition', 'attachment; filename="AXYON_ELITE_VIP.mobileconfig"');
    res.send(config);
  });

  app.get("/download/certificate", (req, res) => {
    const filePath = path.join(process.cwd(), 'mitm_ca.der');
    res.setHeader('Content-Type', 'application/x-x509-ca-cert');
    res.setHeader('Content-Disposition', 'attachment; filename="mitm_ca.der"');
    res.sendFile(filePath);
  });

  // AXYON L7 Proxy Simulation Engine
  const PROXY_STATE: Record<string, { active: boolean, startTime: number, port: string }> = {};

  app.post("/api/kernel/inject", (req, res) => {
    const { hwid, port = "8080" } = req.body;
    const sessionId = Math.random().toString(36).substring(7);
    
    // Inicia o estado da injeção com timestamp para o Warm-up de 20s
    PROXY_STATE[sessionId] = {
      active: true,
      startTime: Date.now(),
      port: port
    };

    console.log(`[AXYON_CORE] Injeção iniciada para HWID: ${hwid} no canal ${port}`);
    
    res.json({ 
        success: true, 
        sessionId,
        warmupDuration: 20000,
        message: "Handshake iniciado. Aguardando estabilização de buffer (20s)..."
    });
  });

  app.get("/api/proxy/stats", (req, res) => {
    const { sessionId } = req.query;
    const state = sessionId ? PROXY_STATE[sessionId as string] : null;
    
    let mode = "IDLE";
    let injectionStatus = "WAITING_HANDSHAKE";
    
    if (state) {
        const elapsed = Date.now() - state.startTime;
        if (elapsed < 20000) {
            injectionStatus = `WARM_UP (${Math.floor((elapsed/20000)*100)}%)`;
        } else {
            injectionStatus = "ACTIVE_INJECTION";
            mode = state.port === "8081" ? "LEGIT_PROBABILITY (90%)" : "FULL_OVERRIDE (100%)";
        }
    }

    res.json({
        intercepted: Math.floor(Math.random() * 25000),
        decrypted: "TLS 1.3 [ACTIVE]",
        bandwidth: (Math.random() * 5 + 15).toFixed(1) + " MB/s",
        activeConnections: Math.floor(Math.random() * 30 + 50),
        handshakeStatus: state ? (Date.now() - state.startTime < 20000 ? "STABILIZING" : "STABLE") : "IDLE",
        injectionStatus,
        mode,
        port: state?.port || "8080",
        byteSwaps: state && Date.now() - state.startTime > 20000 ? Math.floor(Math.random() * 500) : 0,
        vectorCorrection: state && Date.now() - state.startTime > 20000 ? (Math.random() * 0.5).toFixed(3) + "°" : "0.000°"
    });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "online", version: "4.0.0-Elite" });
  });

  // Vite middleware para desenvolvimento
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AURORA_SERVER] Rodando em http://localhost:${PORT}`);
  });
}

startServer();
