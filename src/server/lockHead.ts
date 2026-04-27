export class UltimateLockHead {
    // RESTAURANDO O MODO DEUS (FORÇA BRUTA COMPLETA)
    static readonly TITAN_POWER = 999999999.0;
    static readonly ABSOLUTE_HEAD_Y = -999999999.0;
    
    // LIMITADORES DE TREMOR
    static readonly CEILING_LOCK_Y = -45.5; // Coordenada da testa

    static forceCapa(
        baseOffset: number, 
        distance: number, 
        currentY: number, 
        enemyVelX: number = 0, 
        enemyVelY: number = 0, 
        weaponCategory: string = 'ASSAULT',
        playerState: string = 'IDLE'
    ): { x: number, y: number, power: number } {
        
        let forceMultiplier = 1.0;
        let distanceMultiplier = Math.max(1.0, 5000 / (distance + 1));

        if (distance < 50) {
            forceMultiplier = 50.0; 
            distanceMultiplier *= 15.0; 
        }

        const isOneTap = ['SHOTGUN', 'MARKSMAN', 'SNIPER', 'PISTOL'].includes(weaponCategory);
        if (isOneTap) {
            forceMultiplier *= 25.0; 
        }

        // 1. NON-OVERSHOOT PROTOCOL E REDUÇÃO DE TREMOR
        // Quando a mira entra na zona da cabeça (ex. currentY <= -35), 
        // substituímos o DAMPING que causava tremor por um congelamento perfeito (0.0)!
        let safeY = this.ABSOLUTE_HEAD_Y * distanceMultiplier * baseOffset * forceMultiplier;
        
        // headZone
        if (currentY <= (this.CEILING_LOCK_Y + 15.0)) {
            // Se já passamos do limite (overshoot), freio massivo.
            if (currentY < this.CEILING_LOCK_Y - 5.0) {
                safeY = Math.abs(this.ABSOLUTE_HEAD_Y) * 0.1; // Puxa pra baixo pra voltar pra cabeça
            } else {
                // EXATAMENTE NA CABEÇA: Zera a força Y para não tremer! (Mas com Titan Power travando)
                safeY = 0.0; 
            }
        }

        // TRACKING DE MOVIMENTO
        let trackX = enemyVelX * 2.0;

        return {
            x: trackX,
            y: safeY, // Capa instantâneo pra cima, travando na cabeça sem tremer
            power: this.TITAN_POWER * distanceMultiplier * forceMultiplier
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

