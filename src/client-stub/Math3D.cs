using System;
using System.Numerics;

namespace ElitePanel.Core
{
    public class Math3D
    {
        // Converte coordenadas 3D do mundo do jogo para a tela 2D do jogador (Monitor/Mobile)
        public static Vector2 WorldToScreen(Vector3 worldPos, Matrix4x4 viewMatrix, int screenWidth, int screenHeight)
        {
            // Multiplicação pela matriz de visualização
            float vW = (viewMatrix.M14 * worldPos.X) + (viewMatrix.M24 * worldPos.Y) + (viewMatrix.M34 * worldPos.Z) + viewMatrix.M44;

            // Se o alvo estiver nas costas (atrás da câmera)
            if (vW < 0.001f) return Vector2.Zero; 

            float vX = (viewMatrix.M11 * worldPos.X) + (viewMatrix.M21 * worldPos.Y) + (viewMatrix.M31 * worldPos.Z) + viewMatrix.M41;
            float vY = (viewMatrix.M12 * worldPos.X) + (viewMatrix.M22 * worldPos.Y) + (viewMatrix.M32 * worldPos.Z) + viewMatrix.M42;

            Vector2 screenPos = new Vector2
            {
                X = (screenWidth / 2) + (screenWidth / 2) * vX / vW,
                Y = (screenHeight / 2) - (screenHeight / 2) * vY / vW // Inverte o Eixo Y
            };

            return screenPos;
        }

        // Trava Estática: Diferença Angular (Usado para Internal Injection / Memory Write AIM)
        public static Vector2 CalcAngle(Vector3 src, Vector3 dst)
        {
            Vector3 delta = new Vector3(dst.X - src.X, dst.Y - src.Y, dst.Z - src.Z);
            float dist = (float)Math.Sqrt(delta.X * delta.X + delta.Y * delta.Y + delta.Z * delta.Z);
            
            float pitch = (float)(-Math.Asin(delta.Z / dist) * (180.0 / Math.PI));
            float yaw = (float)(Math.Atan2(delta.Y, delta.X) * (180.0 / Math.PI));

            return new Vector2(yaw, pitch); 
        }
    }
}
