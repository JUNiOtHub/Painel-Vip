import crypto from 'crypto';
import os from 'os';

export const CONFIG: any = {
    VERSION: '18.0.0',
    BUILD: 'ULTRA_SUPREMACY_TITAN_PRO_EDITION',
    PORT: 3000,
    PORT_HTTPS: 3443,
    SECRET: crypto.randomBytes(128).toString('hex'),
    SESSION_DURATION: 86400000,
    MAX_PACKET_SIZE: 262144,
    DEBUG: false,
    UI: {
        THEME: 'CYBER_ROSE',
        GLOW_STRENGTH: 'MAXIMUM',
        ANIMATION_SPEED: 'FAST',
        SHOW_ADVANCED_METRICS: true
    },
    ENCRYPTION: {
        ENABLED: true,
        ALGORITHM: 'aes-256-gcm',
        KEY_ROTATION_INTERVAL: 150000,
        SIGNATURE_VERIFICATION: true,
        FALLBACK_MODE: false
    },
    PERFORMANCE: {
        TARGET_FPS: 240,
        PACKET_CULLING: true,
        UDP_PRIORITY: true,
        TCP_PRIORITY: true,
        CACHE_SIZE: 2048,
        GC_INTERVAL: 15000,
        CLEANUP_INTERVAL: 1000,
        FRAME_PREDICTION: true,
        FRAME_PREDICTION_MODES: {
            LINEAR: true,
            QUADRATIC: true,
            AI_ASSISTED: true
        },
        LATENCY_COMPENSATION: 1.25,
        BUFFER_PREALLOCATION: true,
        BUFFER_SIZE_MULTIPLIER: 4.0,
        THREAD_PRIORITY: 'realtime',
        CORE_AFFINITY: true,
        DISABLE_NAGLE_ALGO: true,
        NETWORK_OPTIMIZATION_LEVEL: 'EXTREME'
    },
    FEATURES: {
        ESP_LINES: true,
        ESP_BOXES: true,
        ESP_NAME: true,
        ESP_DISTANCE: true,
        MAGIC_BULLET: true,
        HEAD_TRACKING: true,
        AUTO_AIM_LOCK: true,
        RED_CROSSHAIR_TRACKING: true,
        NO_RECOIL: true,
        NO_SPREAD: true,
        FAST_RELOAD: true,
        SILENT_AIM: true,
        WALLHACK: true,
        ANTENNA_100M: true,
        PLAYER_CHAMMS: true
    },
    NECK_DOMINANCE: {
        ENABLED: true,
        AIM_TARGET: 'HEAD', 
        MAGNETIC_PULL: 8.85, 
        NECK_ZONE_MIN: 250,
        NECK_ZONE_MAX: 1800, 
        CHEST_IGNORE_ZONE: 85, 
        HEAD_OFFSET_BASE: 515, 
        NECK_OFFSET_BASE: 445,
        FORCED_NECK_MULTIPLIER: 155.5,
        DISTANCE_FACTOR: 15.5,
        JUMP_COMPENSATION: 45.5,
        RUN_COMPENSATION: 22.8,
        CROUCH_COMPENSATION: 12.4,
        PRONE_COMPENSATION: 10.5,
        VELOCITY_PREDICTION_BIAS: 12.25
    },
    ANTI_BAN: {
        ENABLED: true,
        JITTER_AMOUNT: 0.02,
        JITTER_VARIATION: 0.01,
        HUMAN_DELAY_MIN: 0,
        HUMAN_DELAY_MAX: 0,
        CRC32_CHECKSUM: true,
        CRC32_SALT: crypto.randomBytes(32).toString('hex'),
        RANDOM_PADDING: true,
        PADDING_MIN: 8,
        PADDING_MAX: 32,
        BEHAVIOR_VARIATION: 0.01,
        BEHAVIOR_COMPLEXITY: 15,
        MAX_CONSECUTIVE_LOCKS: 999,
        COOLDOWN_AFTER_KILL: 10,
        SESSION_ROTATION: true,
        PACKET_SHUFFLE: true,
        TIMESTAMP_JITTER: 10,
        HARDWARE_ID_SPOOFING: true,
        DEVICE_FINGERPRINT_MASK: 'iPhone16,P_MAX_ULTRA',
        ANTI_BLACKLIST: {
            ENABLED: true,
            PACKET_MASKING: true,
            OFFSET_RANDOMIZER: true,
            CLIENT_RECOGNITION_BYPASS: true,
            DATA_INTEGRITY_SHIELD: true,
            BYPASS_LEVEL: 'TITAN_SUPREMACY_777',
            DPI_BYPASS: true,
            MTU_SPOOFING: true,
            FRAGMENTATION_DISGUISE: true,
            HEARTBEAT_EMULATION: true
        }
    },
    FOV: {
        RED_DOT: 105,
        SIGHT_2X: 85,
        SIGHT_4X: 65,
        SIGHT_6X: 42,
        SIGHT_8X: 35,
        MIN_FOV: 40,
        MAX_FOV: 360,
        DISTANCE_FACTOR: 1200,
        ADAPTIVE_SCALING: true
    },
    WEAPON_CATEGORIES: {
        ASSAULT: { baseYOffset: 155, recoilComp: 100.0, horizontalComp: 100.0, lockStrength: 550.5, delay: 0 },
        SNIPER: { baseYOffset: 345, recoilComp: 100.0, horizontalComp: 100.0, lockStrength: 855.0, delay: 0 },
        SMG: { baseYOffset: 185, recoilComp: 100.0, horizontalComp: 100.0, lockStrength: 555.5, delay: 0 },
        SHOTGUN: { baseYOffset: 385, recoilComp: 100.0, horizontalComp: 100.0, lockStrength: 785.0, delay: 0 },
        PISTOL: { baseYOffset: 245, recoilComp: 100.0, horizontalComp: 100.0, lockStrength: 585.0, delay: 0 },
        MARKSMAN: { baseYOffset: 345, recoilComp: 100.0, horizontalComp: 100.0, lockStrength: 745.0, delay: 0 },
        LMG: { baseYOffset: 168, recoilComp: 100.0, horizontalComp: 100.0, lockStrength: 555.5, delay: 0 }
    },
    IOS_OFFSETS: {
        POSITION_X: 0x24,
        POSITION_Y: 0x28,
        POSITION_Z: 0x2C,
        WEAPON_ID: 0x70,
        PLAYER_STATE: 0x58,
        VISIBILITY: 0x7F2,
        TEAM_ID: 0x8A0,
        HEALTH: 0x8C4,
        ARMOR: 0x8C8,
        SHIELD: 0x8CC,
        BONE_MATRIX: 0x5B8,
        HEAD_BONE: 0x08,
        NECK_BONE: 0x10,
        SPINE_BONE: 0x18,
        VELOCITY_X: 0x30,
        VELOCITY_Y: 0x34,
        VELOCITY_Z: 0x38,
        ROTATION_PITCH: 0x48,
        ROTATION_YAW: 0x4C,
        ROTATION_ROLL: 0x50,
        SCOPE_ZOOM: 0x80,
        CURRENT_AMMO: 0x84,
        MAX_AMMO: 0x88,
        KILLS: 0x8F0,
        DEATHS: 0x8F4,
        SCORE: 0x8F8,
        NO_RECOIL_PTR: 0x7AC,
        NO_SPREAD_PTR: 0x844,
        FAST_RELOAD_PTR: 0x930,
        ANTENNA_PTR: 0x5C8,
        CHAMMS_PTR: 0x4A0,
        BYPASS_TOKEN: 0xFA0,
        SHIELD_ACTIVE: 0xFA4,
        HEARTBEAT_OFFSET: 0xFB0
    },
    MODES: {
        RANKED_TITAN: true,
        COMPETITIVE_PRO: true,
        SENSI_BOOSTER: true,
        FPS_OPTIMIZER: true,
        BYPASS_LEGIT: false
    }
};

export const WEAPON_PROFILES: any = {
    1: { id: 1, name: 'AK47', display: '🔫 AK47 TITAN', category: 'ASSAULT', lockStrength: 550.5, yOffset: 155, recoilComp: 100.0, horizontalComp: 100.0, snapMultiplier: 255.5, neckBias: 255.5, rarity: 'LEGENDARY', fireRate: 600 },
    2: { id: 2, name: 'M4A1', display: '🔫 M4A1 TITAN', category: 'ASSAULT', lockStrength: 550.5, yOffset: 155, recoilComp: 100.0, horizontalComp: 100.0, snapMultiplier: 255.5, neckBias: 255.5, rarity: 'EPIC', fireRate: 680 },
    3: { id: 3, name: 'M14', display: '🔫 M14 TITAN', category: 'ASSAULT', lockStrength: 550.5, yOffset: 255, recoilComp: 100.0, horizontalComp: 100.0, snapMultiplier: 255.5, neckBias: 255.5, rarity: 'EPIC', fireRate: 350 },
    4: { id: 4, name: 'SCAR', display: '🔫 SCAR TITAN', category: 'ASSAULT', lockStrength: 550.5, yOffset: 155, recoilComp: 100.0, horizontalComp: 100.0, snapMultiplier: 255.5, neckBias: 255.5, rarity: 'RARE', fireRate: 640 },
    16: { id: 16, name: 'AWM', display: '🎯 AWM TITAN', category: 'SNIPER', lockStrength: 855.0, yOffset: 345, recoilComp: 100.0, horizontalComp: 100.0, snapMultiplier: 455.0, neckBias: 455.0, rarity: 'LEGENDARY', fireRate: 40 },
    33: { id: 33, name: 'MP40', display: '⚡ MP40 TITAN', category: 'SMG', lockStrength: 655.5, yOffset: 185, recoilComp: 100.0, horizontalComp: 100.0, snapMultiplier: 395.5, neckBias: 395.5, rarity: 'LEGENDARY', fireRate: 1100 },
    53: { id: 53, name: 'M1887', display: '💥 M1887 TITAN', category: 'SHOTGUN', lockStrength: 855.5, yOffset: 385, recoilComp: 100.0, horizontalComp: 100.0, snapMultiplier: 555.5, neckBias: 555.5, rarity: 'LEGENDARY', fireRate: 80 },
    66: { id: 66, name: 'DESERT_EAGLE', display: '💀 DESERT EAGLE TITAN', category: 'PISTOL', lockStrength: 685.0, yOffset: 325, recoilComp: 100.0, horizontalComp: 100.0, snapMultiplier: 455.0, neckBias: 455.0, rarity: 'EPIC', fireRate: 200 },
    116: { id: 116, name: 'CARAPINA', display: '🎯 CARAPINA TITAN', category: 'MARKSMAN', lockStrength: 755.5, yOffset: 345, recoilComp: 100.0, horizontalComp: 100.0, snapMultiplier: 555.5, neckBias: 555.5, rarity: 'EPIC', fireRate: 180 },
    0: { id: 0, name: 'UNKNOWN', display: '❓ TITAN_SUPREMACY', category: 'UNKNOWN', lockStrength: 425.0, yOffset: 255, recoilComp: 100.0, horizontalComp: 100.0, snapMultiplier: 225.5, neckBias: 225.0, rarity: 'COMMON' }
};

export function generateUUID() {
    return crypto.randomUUID();
}

export function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name] || []) {
            if (iface.family === 'IPv4' && !iface.internal && iface.address !== '127.0.0.1') {
                return iface.address;
            }
        }
    }
    return '192.168.1.100';
}
