# Usar imagem oficial do Node
FROM node:20-slim

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o resto do código
COPY . .

# Compilar o sistema Titan
RUN npm run build

# Definir porta
EXPOSE 3000

# Iniciar o servidor Supreme
CMD ["npm", "start"]
