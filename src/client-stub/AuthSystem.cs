using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Security.Authentication;

namespace ElitePanel.Loader
{
    public class AuthSystem
    {
        private static readonly HttpClient client;

        // Setup TLS 1.2 / 1.3 Seguro
        static AuthSystem()
        {
            var handler = new SocketsHttpHandler
            {
                SslOptions = new System.Net.Security.SslClientAuthenticationOptions
                {
                    EnabledSslProtocols = SslProtocols.Tls12 | SslProtocols.Tls13
                }
            };
            client = new HttpClient(handler);
        }
        
        // Verifica Licença VIP usando REST seguro
        public static async Task<bool> VerifyLicense(string licenseKey)
        {
            try
            {
                string apiUrl = $"https://painel-elite-auth.com/api/v1/verify";
                var requestBody = new StringContent($"{{\"key\":\"{licenseKey}\"}}", System.Text.Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.PostAsync(apiUrl, requestBody);
                
                if (response.IsSuccessStatusCode)
                {
                    string resBody = await response.Content.ReadAsStringAsync();
                    if(resBody.Contains("\"status\":\"active\"")) 
                    {
                        Console.WriteLine("[+++] Conexão TLS Protegida. Licença VIP Autenticada.");
                        return true;
                    }
                }
                
                Console.WriteLine("[-] Acesso Negado. HWID inválido ou Licença Expirada.");
                return false;
            }
            catch (Exception)
            {
                Console.WriteLine("[-] Falha na Comunicação Protegida com o Servidor Base.");
                return false;
            }
        }
    }
}
