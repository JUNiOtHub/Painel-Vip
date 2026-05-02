import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/download/mobileconfig", (req, res) => {
    const awsIp = (req.query.awsIp as string) || process.env.VITE_AWS_IP || process.env.AWS_IP || "3.134.100.159";
    const uuid1 = "R7VIPXIT-PAYLOAD-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const profileUuid = "R7VIPXIT-PROFILE-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    const config = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>PayloadContent</key>
	<array>
		<dict>
			<key>PayloadType</key>
			<string>com.apple.proxy.http.global</string>
			<key>PayloadVersion</key>
			<integer>1</integer>
			<key>PayloadIdentifier</key>
			<string>axyon.vip.config.proxy</string>
			<key>PayloadUUID</key>
      <string>${uuid1}</string>
			<key>ProxyServer</key>
			<string>${awsIp}</string>
			<key>ProxyPort</key>
			<integer>8080</integer>
		</dict>
	</array>
	<key>PayloadDescription</key>
	<string>AXYON R7VIPXIT - L7 Network Engine (ARM64 Optimized)</string>
	<key>PayloadDisplayName</key>
	<string>R7VIPXIT AXYON PRO</string>
	<key>PayloadIdentifier</key>
	<string>axyon.vip.config</string>
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
    res.setHeader('Content-Disposition', 'attachment; filename="R7VIPXIT.mobileconfig"');
    res.send(config);
  });

  app.get("/api/aws-status", async (req, res) => {
    try {
      const awsIp = process.env.VITE_AWS_IP || process.env.AWS_IP || "3.134.100.159";
      const response = await fetch(`http://${awsIp}:8080/status`, { method: "GET", signal: AbortSignal.timeout(5000) });
      res.json({ status: "online" });
    } catch {
      res.json({ status: "offline" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "online", version: "4.8.0-Elite" });
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
    console.log(`[AXYON_ULTRA_V2] Master Web Central Online - Port ${PORT}`);
    const awsIp = process.env.VITE_AWS_IP || process.env.AWS_IP || "3.134.100.159";
    console.log(`[AXYON_ULTRA_V2] Static IP Configuration: ${awsIp}`);
  });
}

startServer();
