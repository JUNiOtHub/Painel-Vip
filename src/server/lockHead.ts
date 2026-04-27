export class UltimateLockHead {
    // RESTAURANDO O MODO DEUS (FORÇA BRUTA)
    // O sistema suave não quebra a mira original do jogo (que puxa pro peito).
    // Precisamos de força colossal bruta.
    
    static readonly TITAN_POWER = 9999999.0;

    static readonly WEAPON_AIM_CURVES: Record<string, { trackXFactor: number, trackYFactor: number, powerMultFactor: number, forceYFactor: number }> = {
        SMG: { trackXFactor: 1.8, trackYFactor: 0.9, powerMultFactor: 1.3, forceYFactor: 1.1 }, // Faster horizontal tracking for close range
        SNIPER: { trackXFactor: 0.4, trackYFactor: 1.8, powerMultFactor: 3.0, forceYFactor: 2.5 }, // Strong vertical pull, precise horizontal
        SHOTGUN: { trackXFactor: 1.2, trackYFactor: 1.1, powerMultFactor: 2.5, forceYFactor: 2.0 }, // CQC dominance
        ASSAULT: { trackXFactor: 1.0, trackYFactor: 1.0, powerMultFactor: 1.0, forceYFactor: 1.0 }, // Balanced tracking
        MARKSMAN: { trackXFactor: 0.7, trackYFactor: 1.4, powerMultFactor: 2.0, forceYFactor: 1.8 }, // Accurate, snap-heavy
        PISTOL: { trackXFactor: 1.4, trackYFactor: 1.0, powerMultFactor: 1.5, forceYFactor: 1.3 }, // Agile tracking
        LMG: { trackXFactor: 0.6, trackYFactor: 0.7, powerMultFactor: 1.2, forceYFactor: 0.9 }, // Heavy, slow tracking
        UNKNOWN: { trackXFactor: 1.0, trackYFactor: 1.0, powerMultFactor: 1.0, forceYFactor: 1.0 }
    };

    static forceCapa(
        distScalar: number, 
        distance: number, 
        currentY: number, 
        enemyVelX: number = 0, 
        enemyVelY: number = 0, 
        weaponCategory: string = 'ASSAULT',
        playerState: string = 'IDLE'
    ): { x: number, y: number, power: number } {
        
        const isOneTap = ['SHOTGUN', 'MARKSMAN', 'SNIPER', 'PISTOL'].includes(weaponCategory);
        const aimCurve = this.WEAPON_AIM_CURVES[weaponCategory] || this.WEAPON_AIM_CURVES['UNKNOWN'];
        
        // --- ADVANCED PREDICTIVE LOGIC & DYNAMIC TRAJECTORY ---
        // Calculate lead time based on distance and velocity (dynamic trajectory)
        const distanceLeadFactor = Math.max(0.01, distance * 0.002);
        const velocityMagnitude = Math.sqrt(enemyVelX * enemyVelX + enemyVelY * enemyVelY);
        const dynamicTrajectoryAdjustment = 1.0 + (velocityMagnitude * 0.001);
        
        const leadTime = distanceLeadFactor * dynamicTrajectoryAdjustment;
        
        let trackX = 0;
        let trackY = 0;

        // Predictive horizontal and vertical tracking
        if (Math.abs(enemyVelX) > 10) {
            trackX = enemyVelX * leadTime * distScalar * (isOneTap ? 1.2 : 0.8) * aimCurve.trackXFactor;
        }
        if (Math.abs(enemyVelY) > 10) {
            trackY = enemyVelY * leadTime * distScalar * (isOneTap ? 1.2 : 0.8) * aimCurve.trackYFactor;
        }

        // Se a velocidade for muito alta (dash/pulo), aumenta a previsão exponencialmente
        if (Math.abs(enemyVelX) > 200) trackX *= 1.8;
        if (Math.abs(enemyVelY) > 200) trackY *= 1.8;

        // --- HEADSHOT MOMENTUM ---
        // Increase vertical pull proportional to target's velocity (diagonal/vertical)
        const headshotMomentum = 1.0 + (velocityMagnitude * 0.05);

        // --- PLAYER STATE MODIFIERS (WEAPON SWAY DAMPENING) ---
        let stateStabilizerX = 1.0;
        let statePowerMult = 1.0;

        switch(playerState) {
            case 'RUN':
                stateStabilizerX = 1.5; // Compensate more for our own movement
                statePowerMult = 1.25;
                break;
            case 'CROUCH':
                stateStabilizerX = 0.15; // Weapon Sway Dampening (extreme stability)
                statePowerMult = 2.5; // Laser focus
                break;
            case 'PRONE':
                stateStabilizerX = 0.05; // Absolute stability
                statePowerMult = 3.0; // Maximum focus
                break;
            case 'JUMP':
                stateStabilizerX = 2.0;
                statePowerMult = 1.8; // Need strong pull when mid-air
                break;
            default: // IDLE
                stateStabilizerX = 0.3; // Weapon Sway Dampening (smooth stationary aim)
                statePowerMult = 2.0;
                break;
        }

        trackX *= stateStabilizerX;
        trackY *= stateStabilizerX; // Also dampen vertical tracking jitter

        // 2. FORÇA DE SUBIDA MONSTRUOSA E ABSOLUTA (ADEUS PEITO)
        // Quando a mira toca no inimigo, o Y sobe com um soco negativo massivo
        let forceY = -85000.0 * aimCurve.forceYFactor * headshotMomentum;
        let powerMultiplier = 1.0 * statePowerMult * aimCurve.powerMultFactor;
        
        // --- AGGRESSIVE MAGNETIC PULL (< 50 UNITS) ---
        // Rapid target acquisition and CQC absolute dominance
        if (distance < 50) {
            powerMultiplier *= 2500.0; // Extremely high power for instantaneous lock
            forceY *= 10.0; // Smash up violently
            trackX *= 4.0; // Snap horizontally with severe aggression
            
            if (distance < 25) {
                forceY *= 25.0; // Absolute maximum, completely overrides all recoil and movement
                powerMultiplier *= 50.0;
                trackX *= 2.0; // Even faster horizontal tracking close up
            }
        } else if (distance < 100) {
            forceY = -150000.0;
            powerMultiplier *= 5.0;
        }

        if (isOneTap) {
            // Um-tiro: Desert, M1014, Carapina
            forceY *= 3.5; 
            powerMultiplier *= 50.0;
        }

        // Add vertical prediction to the pulling force, boosted by Headshot Momentum
        forceY -= Math.abs(trackY) * 60.0 * headshotMomentum;

        // 3. PROTETOR DE PASSAR COROA (OVERSHOOT) - EXTRA ROBUSTO
        // Dynamic Overshoot Protection based on distance and weapon type
        const dynamicCeilingY = distance < 20 ? -60.0 : (isOneTap ? -40.0 : -45.0); 
        const headZoneY = distance < 20 ? -20.0 : -35.0;

        // Se a mira chegou na altura do capacete (valores negativos)
        if (currentY <= headZoneY) {
            if (currentY < dynamicCeilingY) {
                // Passou demais pro céu (overshoot excessivo)! Freio abrupto reverso extremo.
                forceY = 15000.0 * Math.max(1.5, distScalar) * (isOneTap ? 1.5 : 1.0); 
                powerMultiplier *= 500.0; // Puxa pra baixo super rápido e trava
                trackX *= 0.01; // Elimina tremor horizontal por completo
            } else {
                // Cravado perfeitamente na cabeça. Congela ABSOLUTO!
                forceY = 0.0; 
                powerMultiplier *= 1000.0; // Magnetismo de trava divina
                // Zera tremor X mínimo
                if (Math.abs(trackX) < 8) trackX = 0; 
            }
        }

        // PEITO EXPLODER: Se currentY for grande e positivo (no pé ou barriga), arranca a mira com força
        if (currentY > 0) {
            forceY *= 5.0; // Soco de +500% de velocidade pra sair da barriga
        }

        return {
            x: trackX,
            y: forceY,
            power: this.TITAN_POWER * distScalar * powerMultiplier
        };
    }

    static getPayload() {
        return `
            [TITAN_GOD_MODE_ACTIVE]
            CHEST_LOCK_DESTROYER=999999
            ONE_TAP_GOD_HITBOX=MAXIMUM
            NO_RECOIL_ABSOLUTE_Y=TRUE
            PINADA_REMOVER=TRUE
            INSTANT_TELEPORT_AIM_Y=TRUE
            OVERSHOOT_BLOCKER=FROZEN
            [END_TITAN]
        `;
    }
}
