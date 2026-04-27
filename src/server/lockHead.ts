export class UltimateLockHead {
    // History array for variance calculation
    private static recentVelYHistory: number[] = [];

    // --- MODO EXECUÇÃO: FORÇA BRUTA (MIRA GRUDADA) ---
    // A testa no Free Fire fica entre -35 e -55 de Y.
    // 0 = PEITO (ou valor positivo pra baixo). Quanto mais negativo, mais alto.

    static forceCapa(
        distance: number, 
        currentY: number, 
        enemyVelX: number = 0, 
        enemyVelY: number = 0, 
        weaponCategory: string = 'ASSAULT',
        playerState: string = 'IDLE'
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

        // Variância alta -> Inimigo pulando ou deitando freneticamente -> Puxada mais agressiva (up to +150%)
        // Variância baixa -> Inimigo parado ou movimento linear -> Fator de suavização p/ não tremer
        const varianceAggression = 1.0 + Math.min(stdDevY * 0.05, 1.5); 
        const stabilitySmoothing = stdDevY < 2.0 ? 0.75 : 1.0; 

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
            weaponYMultiplier = 1.4;  
        } else if (isOneTap) {
            weaponXMultiplier = 1.5; 
            weaponYMultiplier = 2.0; 
        }

        let targetY = 0;
        let trackX = 0;
        let power = 0;

        // --- 1. PREDIÇÃO DE TRAJETÓRIA LINEAR (COMPENSAÇÃO DE PING E MOVIMENTO) ---
        const simulatedPingMs = 45.0; // Simulando latência média do jogador
        const pingCompensation = simulatedPingMs / 1000.0;
        
        // Posição Futura: Acelera o tracking baseado na velocidade real somada ao ping
        const predictedVelX = enemyVelX + (enemyVelX * pingCompensation);
        const predictedVelY = enemyVelY + (enemyVelY * pingCompensation);

        // Momentum Factor
        const enemyVelocityMag = Math.sqrt(predictedVelX * predictedVelX + predictedVelY * predictedVelY);
        const headshotMomentum = 1.0 + (enemyVelocityMag * 0.085);

        // --- PLAYER STATE DYNAMIC SCALING ---
        let stateMultiplier = 1.0;
        if (playerState === 'RUN' || playerState === 'JUMP') {
            stateMultiplier = 1.60;
        } else if (playerState === 'CROUCH' || playerState === 'PRONE') {
            stateMultiplier = 0.85;
        }

        // --- DISTANCE LOGARITHMIC SCALING ---
        const safeDistance = Math.max(2.0, distance);
        const logDistanceScale = Math.max(1.5, 10.0 - Math.log(safeDistance));
        const precisionAimTrack = Math.max(0.1, 1.0 / Math.log10(safeDistance + 1));

        // --- 2. TRAVA DE VETOR (BONE ID: 01 / HEAD) & CURVA DE SUAVIZAÇÃO ---
        const EXACT_HEAD_Y = -45.0;
        const distanceToHead = Math.abs(currentY - EXACT_HEAD_Y);

        // Se estamos a mais de 15 units de distância da cabeça (Aceleração Máxima)
        if (distanceToHead > 15.0) {
            if (currentY > EXACT_HEAD_Y) {
                // Mira abaixo da cabeça: PUXADA POTENTE PARA CIMA
                targetY = -12000.0 * varianceAggression * stabilitySmoothing * logDistanceScale * headshotMomentum * stateMultiplier * weaponYMultiplier;
                power = 120000.0 * logDistanceScale * headshotMomentum;
            } else {
                // Mira acima da cabeça: EMPURRÃO PARA BAIXO
                targetY = 9000.0 * varianceAggression * stabilitySmoothing * logDistanceScale * stateMultiplier * weaponYMultiplier; 
                power = 120000.0 * logDistanceScale;
            }
            // Tracking preditivo severo enquanto puxa
            trackX = predictedVelX * 0.5 * weaponXMultiplier * precisionAimTrack;

        } else {
            // --- 3. DAMPING LOGARÍTMICO (SUAVIZAÇÃO DINÂMICA < 5% DISTÂNCIA) ---
            // Entramos na hitbox da cabeça. Congela e gruda!
            
            // Fator de amortecimento forte para evitar oscilação (Tremores)
            const dampingFactor = 0.15; 
            
            targetY = (EXACT_HEAD_Y - currentY) * 500.0 * dampingFactor; // Micro-correção perfeita
            power = 99999999.0; // FIXAÇÃO ABSOLUTA (Não solta mais)

            // Randomização de Micro-movimentos (Anti-Detecção) simulando ruído orgânico 
            // dentro de uma faixa indetectável (+- 0.05 no Pixel)
            const organicNoiseY = (Math.random() - 0.5) * 0.1;
            const organicNoiseX = (Math.random() - 0.5) * 0.1;

            targetY += organicNoiseY;
            trackX = (predictedVelX * 0.95 * precisionAimTrack) + organicNoiseX; // Acompanha 95% do mov future + ruído
        }

        // --- 4. MODIFICADORES DE DISTÂNCIA EXTREMA ---
        if (distance < 30) {
            power *= 1.30;   
            targetY *= 1.5;  
            if (distanceToHead > 15.0) trackX = predictedVelX * 1.8; 
        } else if (distance > 200) {
            targetY *= 0.65; 
            trackX *= 0.70;
        }

        if (isOneTap) {
            power *= 2.5; 
        }

        // --- 5. OVERSHOOT PROTECTION (SEGURO CONTRA PINADA) ---
        if (targetY < -30000.0) {
            power *= 0.5; 
            targetY *= 0.7; 
        }

        return {
            x: trackX,
            y: targetY,
            power: power
        };
    }

    static getPayload() {
        return `
            [EXECUTION_HACK_MODE_ACTIVE]
            BRUTE_FORCE_HEAD_SNAP=TRUE
            CHEST_LOCK=DESTROYED
            RECOIL=FROZEN_ON_HEAD
        `;
    }
}

