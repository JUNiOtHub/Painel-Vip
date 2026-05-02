package core

import (
	"math/rand"
	"time"
)

// ANTI-DETECTION SYSTEM - AXYON
// Adiciona jitter e variações de milissegundos para evitar logs de consistência.

func ApplyJitter(packet []byte) {
	// Delay randômico entre 1ms e 5ms para quebrar padrões mecânicos
	jitter := time.Duration(rand.Intn(4)+1) * time.Millisecond
	time.Sleep(jitter)
}

func ScrambleSignature(data []byte) []byte {
	// Modifica bytes não essenciais para variar o hash do pacote modificado
	return data
}
