export class UltimateLockHead {
    // History array for variance calculation
    private static recentVelYHistory: number[] = [];

    // --- MODO EXECUÇÃO: PAINEL DOS FAMOSOS (SMART BONE TARGETING) ---
    // Em jogos Unity (Free Fire), o eixo Y representa a altura (Vertical).
    // O pacote interceptado geralmente aponta para o centro da massa (Peito/Bacia).
    // Para dar "Capa" (Headshot), precisamos aplicar um offset positivo no eixo Y.

    static forceCapa(
        distance: number, 
        currentY: number, // Representa a coordenada Y do mundo (Altura)
        enemyVelX: number = 0, 
        enemyVelY: number = 0, 
        weaponCategory: string = 'ASSAULT',
        playerState: string = 'IDLE',
        configTarget: string = 'HEAD', // HEAD, NECK, CHEST
        magneticPull: number = 1.85 // Intensidade do Puxão configurado no painel
    ): { x: number, y: number, power: number } {
        
        // --- 0. PREDICTION VARIANCE (STANDARD DEVIATION OF Y-AXIS) ---
        this.recentVelYHistory.push(enemyVelY);
        if (this.recentVelYHistory.length > 10) {
            this.recentVelYHistory.shift();
        }

        let stdDevY = 0;
        if (this.recentVelYHistory.length > 1) {
            const meanY = this.recentVelYHistory.reduce((acc, val) => acc + val, 0) / this.recentVelYHistory.length;
            const variance = this.recentVelYHistory.reduce((acc, val) => acc + Math.pow(val - meanY, 2), 0) / this.recentVelYHistory.length;
            stdDevY = Math.sqrt(variance);
        }

        // --- 1. DEFINIÇÃO DE HITBOX (BONE OFFSETS) ---
        // Aqui corrigimos o problema de "só grudar no peito".
        // Base Unit Unity = 1 metro. Altura média do personagem = 1.75m. Peito = ~1.2m
        let targetBoneOffset = 0.0;
        
        if (configTarget === 'HEAD') {
            targetBoneOffset = 0.65; // Do peito para a cabeça (~65cm pra cima)
        } else if (configTarget === 'NECK') {
            targetBoneOffset = 0.45; // Do peito para o pescoço (Disfarçado, pega cabeça com espalhamento)
        } else {
            targetBoneOffset = 0.05; // Peito (Center of Mass)
        }

        // Dinâmica de Pulo / Agachado ajusta a Hitbox
        if (playerState === 'CROUCH') {
            targetBoneOffset -= 0.35;
        } else if (playerState === 'PRONE') {
            targetBoneOffset -= 0.85;
        } else if (playerState === 'JUMP') {
            targetBoneOffset += 0.20;
        }

        // --- WEAPON CATEGORY MULTIPLIERS ---
        const isSMG = weaponCategory === 'SMG';
        const isAR = weaponCategory === 'ASSAULT' || weaponCategory === 'LMG';
        const isOneTap = ['SHOTGUN', 'MARKSMAN', 'SNIPER', 'PISTOL'].includes(weaponCategory);

        let weaponXMultiplier = 1.0;
        let weaponYMultiplier = 1.0;

        if (isSMG) {
            weaponXMultiplier = 1.2; 
            weaponYMultiplier = 1.1; 
        } else if (isAR) {
            weaponXMultiplier = 0.9;  
            weaponYMultiplier = 1.25;  
        } else if (isOneTap) {
            weaponXMultiplier = 1.5; 
            weaponYMultiplier = 2.0; 
        }

        // --- PREDIÇÃO DE MOVIMENTO AVANÇADA (BALLISTICS & LEAD AIM) ---
        // Compensa Ping, Velocidade e Distância (Bullet Travel Time)
        const pingMs = 35.0; // Otimizado
        const bulletSpeed = 950.0; 
        const timeToTarget = (distance / bulletSpeed) + (pingMs / 1000.0);
        
        const velocityMagnitude = Math.sqrt(enemyVelX * enemyVelX + enemyVelY * enemyVelY);
        const accelerationBias = Math.abs(velocityMagnitude - (this.recentVelYHistory[0] || 0));
        
        // Fator JVIP V4: Lead adaptativo com suavização
        const dynamicLead = 1.0 + (velocityMagnitude * 0.20) + (accelerationBias * 0.06);

        const predictedVelX = enemyVelX * timeToTarget * dynamicLead;
        const predictedVelY = enemyVelY * timeToTarget * dynamicLead;

        // --- CÁLCULO FINAL DE TRAVA (PULL) ---
        // ANTI-TREMOR: Em vez de puxar tudo de uma vez, usamos um fator de interpolação
        const lerpFactor = 0.55; // 55% da distância por tick (Suave mas rápido)
        
        let trackX = (predictedVelX * weaponXMultiplier * 2.15) * lerpFactor;
        
        // ANTI-CHEST ANCHOR: Se a mira detectar que está grudada no peito (targetBoneOffset baixo),
        // aplicamos uma força extra de ejeção vertical para forçar a subida.
        let upwardForce = targetBoneOffset * magneticPull;
        
        // Se a mira estiver "estacionária" no peito, multiplicamos a subida
        if (targetBoneOffset > 0.5 && distance < 100) {
            upwardForce *= 1.25; // Ejeção VIP para subir capa rápido
        }

        let exactRise = (upwardForce * weaponYMultiplier * lerpFactor);
        exactRise += (predictedVelY * 1.35); // Predição vertical refinada

        // Redução de Tremor em alvos em alta velocidade
        if (velocityMagnitude > 10) {
            trackX *= 0.95; 
            exactRise *= 0.98;
        }

        // Se o inimigo estiver muito longe, o lead precisa ser agressivo mas estável
        if (distance > 120) {
            trackX *= 1.15;
            exactRise *= 1.05;
        }

        // Se for arma de 1 tiro, o boneco sobe a mira agressivamente pra cabeça no primeiro clique
        if (isOneTap) {
            exactRise *= 1.35; 
        }

        // Randomização Orgânica (Aim Smoothness / Anti-Cheat)
        // Valores entre -0.015 e +0.015 para parecer natural
        const organicNoiseX = (Math.random() - 0.5) * 0.03;
        const organicNoiseY = (Math.random() - 0.5) * 0.02;

        return {
            x: trackX + organicNoiseX,
            y: exactRise + organicNoiseY,
            power: configTarget === 'HEAD' ? 2.5 : 1.0 // Multiplicador de força na Engine
        };
    }

    static getPayload() {
        return `
            [VIP_PANEL_INJECT_V2]
            SMART_BONE_TRACKING=ACTIVE
            ANTI_CHEST_LOCK=BYPASSED
            PULL_INTENSITY=DYNAMIC
        `;
    }
}

