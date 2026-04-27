# Axyon Ultimate Server

Bem vindo ao Axyon. Para rodar a aplicação localmente:

## 1. Instalar os pacotes
Na pasta raiz do projeto, execute:
\`\`\`bash
npm install
\`\`\`

## 2. Iniciar o servidor
Para iniciar em modo de desenvolvimento (o servidor vai rodar e processar os pacotes):
\`\`\`bash
npm run dev
\`\`\`
O painel HTML poderá ser acessado no navegador (ex: http://localhost:3000) com senha: admin / admin.

Se desejar iniciar a versão otimizada pronta para produção:
\`\`\`bash
npm run build
npm run start
\`\`\`

Quando você baixa o **Perfil iOS**, ele adiciona um roteamento de Proxy e DNS para que o trafego do dispositivo mobile passe localmente pelo IP da sua máquina que está rodando o servidor \`Axyon\`. Como isso, todos os offsets e manipulações de pacotes acontecem on-the-fly via o servidor Node.js local.
