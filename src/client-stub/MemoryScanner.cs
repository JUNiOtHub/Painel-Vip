using System;
using System.Numerics;
using System.Runtime.InteropServices;
using System.Threading;

namespace ElitePanel.Core
{
    public class MemoryScanner
    {
        [DllImport("kernel32.dll", SetLastError = true)]
        public static extern bool ReadProcessMemory(IntPtr hProcess, IntPtr lpBaseAddress, byte[] lpBuffer, int nSize, out IntPtr lpNumberOfBytesRead);

        private IntPtr processHandle;

        public MemoryScanner(IntPtr handle)
        {
            processHandle = handle;
        }

        // Lê a ViewMatrix e decodifica para Matrix4x4 da memória do jogo
        public Matrix4x4 ReadMatrix(IntPtr address)
        {
            byte[] buffer = new byte[64]; // 16 floats * 4 bytes
            IntPtr bytesRead;
            
            if (ReadProcessMemory(processHandle, address, buffer, buffer.Length, out bytesRead)) 
            {
                Span<float> floats = MemoryMarshal.Cast<byte, float>(buffer);
                return new Matrix4x4(
                    floats[0], floats[1], floats[2], floats[3],
                    floats[4], floats[5], floats[6], floats[7],
                    floats[8], floats[9], floats[10], floats[11],
                    floats[12], floats[13], floats[14], floats[15]
                );
            }
            return Matrix4x4.Identity; 
        }

        // Multithreading Absoluto para não dropar FPS (Isolamento de Lógica)
        public void StartAimLoop(IntPtr entityListAddr, IntPtr viewMatrixAddr, int screenW, int screenH)
        {
            Thread aimThread = new Thread(() =>
            {
                while (true)
                {
                    // 1. Lê a matriz 3D da tela
                    Matrix4x4 viewMatrix = ReadMatrix(viewMatrixAddr);
                    
                    // 2. Extrair a posição 3D do oponente (Peito/Bacia base)
                    // Na vida real isso leria do EntityList, ex: ProcessManager.ReadVector3(entity + offset)
                    Vector3 enemyBase3D = new Vector3(100f, 50f, 200f); 
                    
                    // 3. Sistema Smart Bone (Painel Famosos) 
                    float headVerticalOffset = 0.65f; 
                    Vector3 enemyHead3D = new Vector3(enemyBase3D.X, enemyBase3D.Y + headVerticalOffset, enemyBase3D.Z);
                    Vector2 headScreenPos = Math3D.WorldToScreen(enemyHead3D, viewMatrix, screenW, screenH);
                    
                    // 4. Injeção de Mouse (Gravidade Estabilizada)
                    if (headScreenPos != Vector2.Zero)
                    {
                        MouseInjector.AutoSnapAim(headScreenPos.X, headScreenPos.Y, screenW, screenH, 180.0f);
                    }

                    // Loop de alta performance: 2ms estabilizado para evitar picos e tremor (500Hz)
                    Thread.Sleep(2); 
                }
            });
            
            aimThread.Priority = ThreadPriority.Highest; // Performance máxima de CPU para essa thread
            aimThread.Start();
        }
    }
}
