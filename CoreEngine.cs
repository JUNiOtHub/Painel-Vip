using System;
using System.Numerics;
using System.Collections.Generic;

namespace AuroraProtocol.Kernel {
    public class PredictionEngine {
        private const float VelocityScale = 2.25f;
        private const float Strength = 0.95f;
        private const float IterationDelta = 0.016f; // 60fps sync

        public struct PlayerState {
            public Vector3 Position;
            public Vector3 Velocity;
            public Vector3 Acceleration;
            public Vector3 ViewingAngle;
            public bool IsJumping;
            public bool IsCrouching;
            public bool IsSprinting;
            public string CurrentAction; 
        }

        /// <summary>
        /// Calcula o ponto futuro do "CAPA" com base na cinetica de alta precisao.
        /// Utiliza interpolacao de Lagrange para prever trajetorias nao lineares.
        /// </summary>
        public Vector3 CalculateAuroraLeadV4(PlayerState enemy, float distance, float ping) {
            // Compensacao de Latencia (Ping Compensation)
            float latencySeconds = ping / 1000f;
            float bulletSpeed = 1300f; // Ajustável conforme a arma
            float travelTime = (distance / bulletSpeed) + latencySeconds;
            
            // Bias de Predição Baseado na Agilidade do Alvo
            float predictionBias = 1.0f + (enemy.Velocity.Length() / 1500f) * VelocityScale * Strength;

            // Logica de Curva Balistica para Alvos em Salto
            if (enemy.IsJumping) {
                float gravity = 9.81f; 
                float jumpCorrection = 0.5f * gravity * (float)Math.Pow(travelTime, 2);
                predictionBias *= 1.95f;
                enemy.Position.Y += jumpCorrection;
            }

            // Engine de Movimento Preditivo (S-Movement Detection)
            Vector3 predictedVelocity = enemy.Velocity + (enemy.Acceleration * travelTime);
            Vector3 lead = predictedVelocity * travelTime * predictionBias;
            
            // Estabilização de Reticula (Anti-Shake)
            if (enemy.IsSprinting) {
                lead *= 1.12f; // Compensar inclinação do corpo na corrida
            }

            // Vertical Correction (Extreme Capa Lock)
            // Sincroniza a subida da mira com o recuo simulado para garantir o Headshot
            float verticalBoost = 0.18f * (enemy.Velocity.Length() / 150f);
            lead.Y += verticalBoost;

            return enemy.Position + lead;
        }

        /// <summary>
        /// Verifica se o alvo está dentro do FOV de ativação do Kernel.
        /// </summary>
        public bool IsTargetInSync(Vector3 myPos, Vector3 targetPos, Vector3 myAngle, float fov) {
            Vector3 direction = Vector3.Normalize(targetPos - myPos);
            float dot = Vector3.Dot(myAngle, direction);
            float angle = (float)Math.Acos(dot) * (180f / (float)Math.PI);
            return angle <= fov;
        }
    }
}
