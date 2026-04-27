using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;

namespace ElitePanel.Core
{
    public class ProcessManager
    {
        [DllImport("kernel32.dll", SetLastError = true)]
        public static extern IntPtr OpenProcess(int dwDesiredAccess, bool bInheritHandle, int dwProcessId);

        const int PROCESS_WM_READ = 0x0010;
        const int PROCESS_VM_WRITE = 0x0020;
        const int PROCESS_VM_OPERATION = 0x0008;

        public static IntPtr GameHandle = IntPtr.Zero;
        public static Process GameProcess = null;

        // Scanner para detectar emuladores (BlueStacks, MSI, SmartGaga) ou Client Native
        public static bool AttachToGame(string processName = "HD-Player")
        {
            try
            {
                Process[] processes = Process.GetProcessesByName(processName);
                if (processes.Length > 0)
                {
                    GameProcess = processes[0];
                    GameHandle = OpenProcess(PROCESS_WM_READ | PROCESS_VM_WRITE | PROCESS_VM_OPERATION, false, GameProcess.Id);
                    
                    if (GameHandle != IntPtr.Zero)
                    {
                        Console.WriteLine($"[+] Attached to {processName} | PID: {GameProcess.Id}");
                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[-] Failed to attach: {ex.Message}");
            }
            return false;
        }

        public static void MonitorProcess()
        {
            Thread monitorThread = new Thread(() =>
            {
                while (true)
                {
                    if (GameProcess == null || GameProcess.HasExited)
                    {
                        Console.WriteLine("[!] Game process lost. Waiting for game to start...");
                        while (!AttachToGame())
                        {
                            Thread.Sleep(2000);
                        }
                    }
                    Thread.Sleep(1000);
                }
            });
            monitorThread.IsBackground = true;
            monitorThread.Start();
        }
    }
}
