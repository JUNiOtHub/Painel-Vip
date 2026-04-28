using System;
using System.Numerics;

namespace AuroraProtocol.Kernel {
    public class PredictionEngine {
        private const float VelocityScale = 2.25f;
        private const float Strength = 0.95f;
        private const float IterationDelta = 0.016f; // 60fps sync

        public struct PlayerState {
            public Vector3 Position;
            public Vector3 Velocity;
            public bool IsJumping;
            public bool IsCrouching;
            public string CurrentAction; // "GEL_PLACED", "MOVING", etc.
        }

        /// <summary>
        /// Calcula o ponto futuro do "CAPA" com base na inércia e aceleração do inimigo.
        /// Resolve o problema de errar tiros em alvos que se movimentam pros lados ou pulam.
        /// </summary>
        public Vector3 CalculateAuroraLead(PlayerState enemy, float distance) {
            float travelTime = distance / 1300f; // Velocidade base do projétil simulado
            
            // Bias de Predição para Alvos Rápidos
            float predictionBias = 1.0f + (enemy.Velocity.Length() / 1000f) * VelocityScale * Strength;

            // Compensação de Gravidade para pulos (Jump Curve)
            if (enemy.IsJumping) {
                predictionBias *= 1.85f;
            }

            // Compensação de Gelo Agachado (Previsão de parada brusca)
            if (enemy.CurrentAction == "GEL_PLACED") {
                predictionBias *= 0.5f; // Reduz a predição quando o cara para pra por gelo
            }

            Vector3 lead = enemy.Velocity * travelTime * predictionBias;
            
            // Vertical Correction (Capa Lock)
            // Se o cara tá se movendo muito, a mira tende a baixar. Aqui a gente sobe ela.
            if (enemy.Velocity.Length() > 200f) {
                lead.Y += 0.15f * (enemy.Velocity.Length() / 100f);
            }

            return enemy.Position + lead;
        }
    }
}
