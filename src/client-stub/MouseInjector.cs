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
