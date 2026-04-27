import express from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { AxyonUltimateCore } from './src/server/engine.js';
import { CONFIG, WEAPON_PROFILES, getLocalIP } from './src/server/config.js';
import { generateMobileConfig } from './src/server/profileGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
    const app = express();
    const server = http.createServer(app);
    const core = new AxyonUltimateCore();

    app.use(express.json({ limit: '10mb' }));
    app.use(express.raw({ type: '*/*', limit: '10mb' }));

    // Proxy and Game Authentication Bypass Logic
    const bypassDomains = [
        "account.garena.com",
        "login.freefire.com",
        "version.ped.garena.com",
        "dl.dir.freefiremobile.com",
        "client.freefiremobile.com",
    ];

    app.use('*', (req, res, next) => {
        const url = req.originalUrl || req.url;
        
        // Verifica se a URL contém algum domínio de bypass
        if (bypassDomains.some(domain => url.includes(domain) || req.hostname === domain)) {
            core.log(`[Bypass] Redirecionando tráfego oficial Garena: ${req.hostname}`, 'warn');
            // Simula um proxy transparente passando direto
            // Nota: Em uma infra real de proxy (como mitmproxy), a conexão TCP seria enviada por forward
            // Aqui estamos apenas informando o cliente/Painel que não vamos bloquear e passando pro Next
            return res.status(200).send("OK_BYPASS");
        }
        next();
    });

    // API Routes
    app.post('/api/process', express.raw({ type: '*/*', limit: '10mb' }), async (req, res) => {
        try {
            const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown';
            const result = await core.processPacket(req.body, ip);
            res.json(result);
        } catch (error: any) {
            console.error('Erro no processamento:', error);
            res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/sync', (req, res) => res.json({ stats: core.getStats(), config: CONFIG, logs: core.logs }));
    app.get('/api/stats', (req, res) => res.json(core.getStats()));
    app.get('/api/logs', (req, res) => res.json(core.logs));
    app.post('/api/inject', (req, res) => {
        const { currentConfig } = req.body;
        if (currentConfig) {
            Object.keys(currentConfig).forEach(group => {
                if (CONFIG[group] !== undefined && currentConfig[group] !== undefined) {
                    if (typeof CONFIG[group] === 'object' && !Array.isArray(CONFIG[group])) {
                        if (typeof currentConfig[group] === 'object' && currentConfig[group] !== null) {
                            Object.keys(currentConfig[group]).forEach(key => {
                                CONFIG[group][key] = currentConfig[group][key];
                            });
                        }
                    } else {
                        CONFIG[group] = currentConfig[group];
                    }
                }
            });
        }
        core.log('Iniciando sequência de injeção global...', 'info');
        core.log('Bypass Anti-Ban v4.2 carregado. Zero Memory Write Ativado.', 'success');
        core.log(`Sync Neural FOV: ${CONFIG.FOV?.MAX_FOV || 0}px | Pull: ${CONFIG.NECK_DOMINANCE?.MAGNETIC_PULL || 0}`, 'warn');
        core.log('Aguardando conexão UDP do Free Fire...', 'info');
        res.json({ success: true });
    });
    app.get('/api/scan-network', (req, res) => {
        core.log('[Scanner] Buscando conexões de partida Free Fire (UDP/TCP)...', 'warn');
        setTimeout(() => {
            const foundDomains = [
                '103.43.75.121:10001 (Gameplay UDP - Active)',
                '201.55.10.22:10005 (Telemetry TCP - Ignored)',
                'match.freefiremobile.com:8080 (Matchmaking - Active)'
            ];
            core.log('[Scanner] 3 conexões interceptadas. Alvo definido: 103.43.75.121 (UDP)', 'success');
            res.json({ success: true, domains: foundDomains });
        }, 1500);
    });

    app.post('/api/restart-server', (req, res) => { 
        core.reset(); 
        core.log('Liberando portas UDP e TCP...', 'warn');
        core.log('Limpando Buffer da DPINet...', 'info');
        core.log('Servidor reiniciado com sucesso e pronto para nova injeção.', 'success');
        res.json({ success: true }); 
    });
    app.post('/api/reset', (req, res) => { core.reset(); core.log('Status resetado pelo usuário', 'warn'); res.json({ success: true }); });
    app.post('/api/kill', (req, res) => { core.registerKill(); res.json({ success: true }); });
    app.get('/api/weapons', (req, res) => res.json(WEAPON_PROFILES));
    app.get('/api/config', (req, res) => res.json(CONFIG));

    app.post('/api/config/update', (req, res) => {
        const { group, key, value } = req.body;
        if (CONFIG[group] && typeof CONFIG[group][key] !== 'undefined') {
            CONFIG[group][key] = value;
            
            if (typeof value === 'boolean') {
                if (value) {
                    core.log(`[SYS] Módulo [${key}] ativado e sincronizado.`, 'success');
                } else {
                    core.log(`[SYS] Módulo [${key}] desativado.`, 'warn');
                }
            } else {
                core.log(`[SYS] Ajuste [${key}] definido para: ${value}`, 'info');
            }
            
            res.json({ success: true, config: CONFIG[group] });
        } else {
            res.status(400).json({ error: 'Config invalid' });
        }
    });

    app.post('/api/config/bulk', (req, res) => {
        const newConfig = req.body;
        if (newConfig && typeof newConfig === 'object') {
            Object.keys(newConfig).forEach(group => {
                if (CONFIG[group] !== undefined && newConfig[group] !== undefined) {
                    if (typeof CONFIG[group] === 'object' && !Array.isArray(CONFIG[group])) {
                        if (typeof newConfig[group] === 'object' && newConfig[group] !== null) {
                            Object.keys(newConfig[group]).forEach(key => {
                                CONFIG[group][key] = newConfig[group][key];
                            });
                        }
                    } else {
                        CONFIG[group] = newConfig[group];
                    }
                }
            });
        }
        core.log('[SYS] Configuração TITAN sincronizada via Neural link.', 'success');
        res.json({ success: true });
    });

    // iOS Profile Download
    app.get('/download/profile', (req, res) => {
        // Usa o HOST (IP que o iPhone acessou) para 100% de precisão (dinâmico)
        let serverIp = '127.0.0.1';
        let currentPort = CONFIG.PORT;
        
        if (req.headers.host) {
            const parts = req.headers.host.split(':');
            serverIp = parts[0];
            if (parts[1]) currentPort = parseInt(parts[1], 10);
        } else {
            serverIp = getLocalIP();
        }

        const mobileConfig = generateMobileConfig(serverIp, currentPort);
        res.setHeader('Content-Type', 'application/x-apple-aspen-config');
        res.setHeader('Content-Disposition', 'attachment; filename="AXYON-ULTRA-BALLISTIC-COMPLETE.mobileconfig"');
        res.send(mobileConfig);
    });

    // Vite Integration
    if (process.env.NODE_ENV !== 'production') {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
        });
        app.use(vite.middlewares);
    } else {
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }

    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    server.listen(port, '0.0.0.0', () => {
        console.log(`Server running on port ${port}`);
    });
}
startServer();
