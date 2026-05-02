package core

import (
	"fmt"
	"time"
)

// LOGGER MODULE - AXYON HUB
// Terminal-based diagnostic dashboard for HS injections and L7 health.

func LogInjection(count int, mode string) {
	timestamp := time.Now().Format("15:04:05")
	fmt.Printf("[%s] [AXYON-LOG] HS_SWAP_ACTIVE: Total=%d | Mode=%s | Integrity=100%%\n", timestamp, count, mode)
}

func LogStatus(health string) {
	fmt.Printf("[AXYON-STATUS] Kernel Bridge: %s | SSL_Pinning: BYPASSED\n", health)
}
