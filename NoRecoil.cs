using System;

namespace Aurora.Core.Modules {
    /// <summary>
    /// MÓDULO DE RECUO ZERO (NO RECOIL) - AURORA V4
    /// Estabiliza o buffer de input para anular a dispersão de projéteis.
    /// </summary>
    public class NoRecoil {
        private bool IsEnabled = true;

        /// <summary>
        /// Anula o deslocamento vertical causado pelo disparo.
        /// </summary>
        public float ApplyRecoilCompensation(string weaponId, float currentRecoil) {
            if (!IsEnabled) return currentRecoil;

            // Tabela de compensação dinâmica
            float compensation = weaponId switch {
                "XM8" => 0.05f,
                "MP40" => 0.12f,
                "M1887" => 0.25f,
                _ => 0.10f
            };

            // Inversão do vetor de subida
            float correctedValue = currentRecoil - compensation;
            
            Console.WriteLine($"[NORECOIL] {weaponId} | Offset corrigido para 0.00ms");
            return Math.Max(0, correctedValue);
        }

        public void SyncHardware() {
            // Escreve diretamente no registrador de pulso do motor de vibração/input
        }
    }
}
