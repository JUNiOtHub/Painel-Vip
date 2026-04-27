import crypto from 'crypto';

export function generateMobileConfig(serverIP: string, port: number) {
    const mainUUID = crypto.randomUUID().toUpperCase();
    const accessibilityUUID = crypto.randomUUID().toUpperCase();
    const webclipUUID = crypto.randomUUID().toUpperCase();
    const perfUUID = crypto.randomUUID().toUpperCase();
    const networkUUID = crypto.randomUUID().toUpperCase();
    const certUUID = crypto.randomUUID().toUpperCase();
    const filterUUID = crypto.randomUUID().toUpperCase();
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <!-- ========================================== CA CERTIFICATE FOR SSL ENCRYPTION (VIP LAYER) ========================================== -->
        <dict>
            <key>PayloadType</key>
            <string>com.apple.security.root</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>PayloadIdentifier</key>
            <string>com.axyon.cert.${certUUID}</string>
            <key>PayloadUUID</key>
            <string>${certUUID}</string>
            <key>PayloadDisplayName</key>
            <string>AXYON VIP Root CA</string>
            <key>PayloadContent</key>
            <data>MIIDNTCCAh2gAwIBAgIUQ9Xxrge7FyzB/uRMf6vxYbazl+wwDQYJKoZIhvcNAQELBQAwKDESMBAGA1UEAwwJbWl0bXByb3h5MRIwEAYDVQQKDAltaXRtcHJveHkwHhcNMjYwMjI3MDU0ODAxWhcNMzYwMjI3MDU0ODAxWjAoMRIwEAYDVQQDDAltaXRtcHJveHkxEjAQBgNVBAoMCW1pdG1wcm94eTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKxsAV5qTUeiOu4Sw+Mw1bm6/il/o1I77B+kpInmIT8fGXtfjy1SHcx1/tvhqIZZQ+ZIC/IY/Uw4zGTjL3ZJXcFOUCynELTNk2uEe1hZjLDcjDj1Y3MOtmoWT5GC1bwBg4ztqR4Q06m1phiKmct/3N4XFSxsrKTi+5JyhRE9hb0yYunx3c5xlQiuf1//KUPGwiWXxIIGWWjbxPBE2CGfBFt3vtkKAZnmxzF/1rJzJ1dtCaP92TGFm6672+hoh1OcmmeRi6VUCbI5Ii5apOUpoUkrn/K+Jw+2tK5wfgdF/236HBYoCytpaU2Jhi0OnQjmqsONZAqtoB/IJaiJwB+ZCBMCAwEAAaNXMFUwDwYDVR0TAQH/BAUwAwEB/zATBgNVHSUEDDAKBggrBgEFBQcDATAOBgNVHQ8BAf8EBAMCAQYwHQYDVR0OBBYEFKn8B74f9dtJ/6ujJAqFj7ibrmSWMA0GCSqGSIb3DQEBCwUAA4IBAQBpBeUohTZMF6SVOTTF+t40yz1InpXT848eM7UyeWVW98vx/eSBp2jJh4wkZP4rY9Xfn3RdoYnyyE/1rCktnITJMJvJCU/Nwzoyawx3ZQSUeOorhxGBCdyKKlN8eg8E+xkVXPbonik86PjS2x5qYXPD96+c55CWbkGp57dJBH1YG6ZN/LxNLJn932RzFl6wsxwwV8syRZjRSYT6A0NOW9gIZ3ZDxWW+KnsytQQjpdH99grbetifCbFGgLwHPLHcerYLTysgbxWHoryFXsp3AHZg8o6rs78SuckQL+X8Ghqv9j7fB3h+EeJu69iNNO1XDjSzb5FsXAlG1Ko7MASRElbN</data>
        </dict>
        
        <!-- ========================================== WEB CLIP - DASHBOARD AXYON ========================================== -->
        <dict>
            <key>PayloadType</key>
            <string>com.apple.webclip.managed</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>PayloadIdentifier</key>
            <string>com.axyon.dashboard.${webclipUUID}</string>
            <key>PayloadUUID</key>
            <string>${webclipUUID}</string>
            <key>PayloadDisplayName</key>
            <string>FX PANEL</string>
            <key>PayloadOrganization</key>
            <string>AXYON Technologies</string>
            <key>PayloadDescription</key>
            <string>Dashboard de controle do AXYON Ultimate - Monitore suas estatísticas em tempo real</string>
            <key>URL</key>
            <string>http://${serverIP}:${port}</string>
            <key>Label</key>
            <string>FX PANEL</string>
            <key>IsRemovable</key>
            <true/>
            <key>Precomposed</key>
            <true/>
            <key>FullScreen</key>
            <false/>
            <key>Icon</key>
            <data>
            iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1B
            AACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5l
            dCA0LjAuMTM0A1t6AAAAIGVYSWZNTQAqAAAACAACAAEAAgAEAAAAAQAAACYAAAABAAgAAABk
            AAAAJkVURM4AAAAKSURBVFhH7Zc7DgAgCAP9/1Fbq4mJCQSlSJ1j03irZYCm/4gZexHrYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            Yx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3rYx3r
            </data>
        </dict>
    </array>
    
    <!-- ========================================== METADADOS DO PERFIL PRINCIPAL ========================================== -->
    <key>PayloadDisplayName</key>
    <string>🎯 AXYON ULTIMATE - Perfil VIP</string>
    
    <key>PayloadDescription</key>
    <string>Configuração VIP AXYON PREMIUM. Permite injeção de pacotes (UDP Stream Hooking), Content Filtering, Root CA MitM e Acesso ao FX PANEL.</string>
    
    <key>PayloadIdentifier</key>
    <string>com.axyon.ultimate.profile.${mainUUID}</string>
    
    <key>PayloadUUID</key>
    <string>${mainUUID}</string>
    
    <key>PayloadOrganization</key>
    <string>AXYON Technologies - eSports Division</string>
    
    <key>PayloadRemovalDisallowed</key>
    <false/>
    
    <key>PayloadType</key>
    <string>Configuration</string>
    
    <key>PayloadVersion</key>
    <integer>1</integer>
    
    <!-- ========================================== RESTRIÇÕES DO SISTEMA (REMOVIDAS PARA EVITAR ERROS) ========================================== -->
</dict>
</plist>`;
}
