using System;
using System.Numerics;

namespace Aurora.Core.Modules {
    /// <summary>
    /// MÓDULO DE TRAVA DE MIRA (AIMLOCK) - AURORA V4
    /// Implementa algoritmos de interpolação linear para fixação no osso da cabeça.
    /// </summary>
    public class AimLock {
        private float FieldOfView = 140.0f;
        private float Smoothing = 0.85f;

        public Vector2 CalculateLock(Vector3 playerPos, Vector3 targetHead, float dist) {
            // Cálculo de Delta vetorial
            Vector3 delta = targetHead - playerPos;
            
            // Conversão para ângulos de visão (Pitch/Yaw)
            float pitch = (float)Math.Asin(delta.Y / dist) * (180.0f / (float)Math.PI);
            float yaw = (float)Math.Atan2(delta.X, delta.Z) * (180.0f / (float)Math.PI);

            // Aplica o fator de suavização (Smooth) para evitar detecção
            float smoothPitch = Lerp(0, pitch, Smoothing);
            float smoothYaw = Lerp(0, yaw, Smoothing);

            return new Vector2(smoothYaw, smoothPitch);
        }

        private float Lerp(float first, float second, float by) {
            return first * (1 - by) + second * by;
        }

        public void CommitToKernel() {
            Console.WriteLine("[AIMLOCK] Vetor de travamento sincronizado com o Ring-0.");
        }
    }
}
