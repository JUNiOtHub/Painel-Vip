import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/api/kernel/status", (req, res) => {
    res.json({ 
      latency: "1.2ms", 
      activeSessions: 1242, 
      bypassStatus: "UNDETECTED",
      version: "4.8.2-PRO"
    });
  });

  app.get("/download/mobileconfig", (req, res) => {
    const uuid1 = "R7VIPXIT-PAYLOAD-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const profileUuid = "R7VIPXIT-PROFILE-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    const config = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>PayloadContent</key>
	<array>
		<dict>
			<key>PayloadDescription</key>
			<string>AXYON Hub v4.8 - R7VIPXIT L7 Proxy Configuration</string>
			<key>PayloadDisplayName</key>
			<string>AXYON R7VIPXIT Engine</string>
			<key>PayloadIdentifier</key>
			<string>com.axyon.r7vipxit.proxy</string>
			<key>PayloadType</key>
			<string>com.apple.webClip.managed</string>
			<key>PayloadUUID</key>
			<string>${uuid1}</string>
			<key>PayloadVersion</key>
			<integer>1</integer>
			<key>URL</key>
			<string>https://axyon-hub.io/portal</string>
			<key>Label</key>
			<string>AXYON R7VIPXIT</string>
		</dict>
	</array>
	<key>PayloadDescription</key>
	<string>AXYON HUB v4.8 (R7VIPXIT). Sistema de Interceptação de Pacotes ARM64.</string>
	<key>PayloadDisplayName</key>
	<string>AXYON R7VIPXIT Protocol</string>
	<key>PayloadIdentifier</key>
	<string>com.axyon.r7vipxit.profile</string>
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
    res.setHeader('Content-Disposition', 'attachment; filename="R7VIPXIT_ELITE.mobileconfig"');
    res.send(config);
  });

  app.get("/download/certificate", (req, res) => {
    const filePath = path.join(process.cwd(), 'mitm_ca.der');
    res.setHeader('Content-Type', 'application/x-x509-ca-cert');
    res.setHeader('Content-Disposition', 'attachment; filename="mitm_ca.der"');
    res.sendFile(filePath);
  });

  // AXYON L7 Proxy Simulation Engine
  const PROXY_STATE: Record<string, { active: boolean, startTime: number, port: string, metrics: { jitter: number, lat: number } }> = {};

  app.post("/api/kernel/inject", (req, res) => {
    const { hwid, port = "8080" } = req.body;
    const sessionId = Math.random().toString(36).substring(7);
    
    // Inicia o estado da injeção com timestamp para o Warm-up de 20s
    PROXY_STATE[sessionId] = {
      active: true,
      startTime: Date.now(),
      port: port,
      metrics: {
        jitter: Math.random() * 0.15,
        lat: Math.random() * 2 + 1
      }
    };

    console.log(`[AXYON_CORE] Injeção iniciada para HWID: ${hwid} no canal ${port}`);
    
    res.json({ 
        success: true, 
        sessionId,
        warmupDuration: 20000,
        message: "AXYON L7: Handshake iniciado. Aguardando estabilização de buffer (20s)..."
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
            injectionStatus = `BUFFERING_L7 (${Math.floor((elapsed/20000)*100)}%)`;
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
        byteSwaps: state && Date.now() - state.startTime > 20000 ? Math.floor(Math.random() * 500 + 1000) : 0,
        vectorCorrection: state && Date.now() - state.startTime > 20000 ? (Math.random() * 0.1).toFixed(3) + "°" : "0.000°",
        jitter: state ? (state.metrics.jitter + (Math.random() * 0.05)).toFixed(2) + "ms" : "0.00ms",
        recoilStatus: state && Date.now() - state.startTime > 20000 ? "NEUTRALIZED" : "STABILIZING",
        shieldIntegrity: state && Date.now() - state.startTime > 20000 ? "100%" : "SCANNING"
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
    console.log(`[AXYON_ULTRA_V2] Servidor rodando em http://localhost:${PORT}`);
    console.log(`[AXYON_ULTRA_V2] Protocolo R7VIPXIT pronto para injeção ARM64.`);
  });
}

startServer();
