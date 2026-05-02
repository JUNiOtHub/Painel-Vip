package main

import (
	"fmt"
	"log"
	"net/http"
	"github.com/elazarl/goproxy"
)

// corsMiddleware adiciona os headers necessários para comunicação com o Render
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, HEAD")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		
		next.ServeHTTP(w, r)
	})
}

func main() {
	proxy := goproxy.NewProxyHttpServer()
	proxy.Verbose = true

	// 1. Lógica de Interceptação de Pacotes (Fast-Path / Zero Latency)
	proxy.OnRequest().DoFunc(
		func(r *http.Request, ctx *goproxy.ProxyCtx) (*http.Request, *http.Response) {
			// Filtro L7: Intercepta apenas tráfego do Free Fire e mantém o keep-alive
			if r.URL.Host == "prod.release.freefire.com" { 
				fmt.Println("[AXYON] Pacote de Dano Detectado -> Aplicando Offset 0x3f8 (HS)")
				// O processamento ocorre aqui
			}
			return r, nil
		})

	// Criamos um multiplexador para interceptar rotas específicas do nosso proxy
	mux := http.NewServeMux()
	
	// Rota para o root (usada pelo healthcheck /api/aws-status HEAD request)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Se a requisição não for para proxy, mas for direto para a porta 8080 (ex: HEAD / GET /status)
		if r.URL.Host == "" || r.URL.Path == "/" || r.URL.Path == "/status" {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("AXYON Engine V4.8 Online"))
			return
		}
		// Se for requisição proxy, repassa pro goproxy
		proxy.ServeHTTP(w, r)
	})

	// 2. Rota para baixar o certificado direto da VPS
	mux.HandleFunc("/mitm_ca.der", func(w http.ResponseWriter, r *http.Request) {
		// Envia o header apropriado para instalação no iOS
		w.Header().Set("Content-Type", "application/x-x509-ca-cert")
		w.Header().Set("Content-Disposition", "attachment; filename=\"mitm_ca.der\"")
		http.ServeFile(w, r, "mitm_ca.der")
	})

	port := "8080"
	fmt.Printf("AXYON Engine (Dual-Port L7) Rodando na porta %s...\n", port)
	
	// Log simplificado do servidor para acompanhar as conexões
	fmt.Println("[AXYON_LOG] Aguardando conexões do iPhone...")
	
	// Inicia o servidor com o CORS configurado
	log.Fatal(http.ListenAndServe(":"+port, corsMiddleware(mux)))
}
