package core

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"io/ioutil"
	"log"
)

// CERT MANAGER - AXYON HUB
// Carrega o mitm_ca.der e gera certificados falsos (spoofed) para interceptação SSL.

func LoadAxyonCert(certPath string, keyPath string) (tls.Certificate, *x509.CertPool, error) {
	fmt.Printf("[CERT] Carregando Autoridade Raiz: %s\n", certPath)
	
	cert, err := tls.LoadX509KeyPair(certPath, keyPath)
	if err != nil {
		return tls.Certificate{}, nil, err
	}

	caCert, err := ioutil.ReadFile(certPath)
	if err != nil {
		return tls.Certificate{}, nil, err
	}

	caCertPool := x509.NewCertPool()
	caCertPool.AppendCertsFromPEM(caCert)

	return cert, caCertPool, nil
}

func SignDomain(domain string) {
	log.Printf("[Signer] Gerando assinatura SSL dinâmica para: %s\n", domain)
}
