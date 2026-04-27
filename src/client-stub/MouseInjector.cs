using System;
using System.Runtime.InteropServices;
using System.Threading;

namespace ElitePanel.Core
{
    public class MouseInjector
    {
        [StructLayout(LayoutKind.Sequential)]
        public struct INPUT
        {
            public uint type;
            public MOUSEINPUT mi;
        }

        [StructLayout(LayoutKind.Sequential)]
        public struct MOUSEINPUT
        {
            public int dx;
            public int dy;
            public uint mouseData;
            public uint dwFlags;
            public uint time;
            public IntPtr dwExtraInfo;
        }

        const uint INPUT_MOUSE = 0;
        const uint MOUSEEVENTF_MOVE = 0x0001;

        [DllImport("user32.dll", SetLastError = true)]
        static extern uint SendInput(uint nInputs, ref INPUT pInputs, int cbSize);

        // Hardware-level mouse movement bypasses generic anti-cheats
        public static void MoveMouseSendInput(int x, int y)
        {
            if (x == 0 && y == 0) return;

            INPUT input = new INPUT
            {
                type = INPUT_MOUSE,
                mi = new MOUSEINPUT
                {
                    dx = x,
                    dy = y,
                    dwFlags = MOUSEEVENTF_MOVE,
                    time = 0,
                    dwExtraInfo = IntPtr.Zero
                }
            };
            SendInput(1, ref input, Marshal.SizeOf(typeof(INPUT)));
        }

        // Nova lógica de "Gravidade Estabilizada" (Anti-Tremor)
        // A mira busca a cabeça de forma ultra-rápida, mas sem vibrar
        public static void AutoSnapAim(float targetX, float targetY, float screenW, float screenH, float fov)
        {
            float centerX = screenW / 2.0f;
            float centerY = screenH / 2.0f;

            float dx = targetX - centerX;
            float dy = targetY - centerY;

            float dist = (float)Math.Sqrt(dx * dx + dy * dy);

            // Verifica FOV
            if (dist > fov) return;
            
            // Zona Morta (Deadzone): Evita micro-oscilações se a mira já estiver no centro
            if (dist < 0.8f) return;

            // Gravidade Inteligente JVIP: Puxão Progressivo (Damping)
            // Em vez de pular 100% da distância, pulamos 65% por frame para não tremer
            float smoothing = 0.65f; 
            
            // Se o alvo se mover rápido, aumentamos a força para não soltar
            if (dist > 30.0f) smoothing = 0.85f;

            int moveX = (int)(dx * smoothing);
            int moveY = (int)(dy * smoothing);

            MoveMouseSendInput(moveX, moveY);
        }

        // Lógica Legada (Smooth)
        public static void SmoothAim(float targetX, float targetY, float screenW, float screenH, float smooth, float fov)
        {
            float centerX = screenW / 2.0f;
            float centerY = screenH / 2.0f;

            float dx = targetX - centerX;
            float dy = targetY - centerY;

            // Distância até o centro da mira
            float dist = (float)Math.Sqrt(dx * dx + dy * dy);

            // Verifica se está dentro do FOV
            if (dist > fov || dist < 1.0f) return;

            // Cálculo do "Puxão" (Aimbot Smoothed)
            // Se estiver mais perto, reduz a suavização para "grudar" forte.
            float currentSmooth = smooth;
            if (dist < 20.0f) 
            {
                currentSmooth = smooth * 0.4f; // Gruda e não solta
            }

            int moveX = (int)(dx / currentSmooth);
            int moveY = (int)(dy / currentSmooth);

            // Envia o movimento para injetar no jogo
            MoveMouseSendInput(moveX, moveY);
        }

        public static void PredictAndLock(float enemyVelocityX, float enemyVelocityY, float distance, bool isOneTap)
        {
            // Thread rápida para evitar queda de FPS no jogo principal
            ThreadPool.QueueUserWorkItem(_ => 
            {
                double safeDistance = Math.Max(2.0, distance);
                double logDistanceScale = Math.Max(1.5, 10.0 - Math.Log(safeDistance));
                
                int targetY = (int)(-12000.0 * logDistanceScale);
                int targetX = (int)(enemyVelocityX * 0.5 * logDistanceScale);

                // Injeta input via User32 SendInput (Assíncrono)
                MoveMouseSendInput(targetX, targetY);
            });
        }
    }
}
