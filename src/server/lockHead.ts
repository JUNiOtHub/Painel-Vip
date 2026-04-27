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

        // --- PREDIÇÃO DE MOVIMENTO (LEAD AIMBOT) ---
        // Compensa Ping e Velocidade com base na distância
        const pingCompensation = 0.045; // 45ms average
        const leadFactor = Math.min(distance * 0.015, 1.5);
        
        const predictedVelX = enemyVelX + (enemyVelX * pingCompensation * leadFactor);

        // --- CÁLCULO FINAL DE TRAVA (PULL) ---
        // trackX: o quanto vamos puxar o tiro na horizontal (em unidades do mundo)
        // targetY: o quanto vamos subir a mira do ponto atual (em unidades do mundo)
        
        let trackX = predictedVelX * 0.5 * weaponXMultiplier;
        
        // Em vez de retornar posições bizarras (-12000), aplicamos a subida exata para a cabeça, 
        // e deixamos o `power` controlar a "velocidade" da injeção se for interpolação.
        // Puxão Magnético (Painel Famosos)
        let exactRise = (targetBoneOffset * magneticPull) * weaponYMultiplier;

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

